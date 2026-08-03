import { createServerFn } from "@tanstack/react-start";
import * as cheerio from "cheerio";

export interface UniversalSocialData {
	id: string;
	platform: "instagram" | "tiktok" | "youtube" | "unknown";
	url: string;
	title: string | null; // Caption / Judul Video
	thumbnailUrl: string | null; // Gambar Thumbnail
	author: string | null; // Nama Creator / Channel
	mediaType: "video" | "image" | "carousel" | "unknown"; // Jenis konten
	likes: number; // Jumlah Like
	comments: number; // Jumlah Komentar
	views: number; // Jumlah Views
	shares?: number; // Jumlah Share (TikTok)
	saves?: number; // Jumlah Save/Collect (TikTok)
	statsReliable?: boolean; // false = kemungkinan angka placeholder (Instagram)
	// Versi siap-tampil, sudah diformat di server (contoh: "19.3jt", "1.8M")
	likesFormatted: string;
	commentsFormatted: string;
	viewsFormatted: string;
	sharesFormatted?: string;
	savesFormatted?: string;
	error?: string;
}

// Bungkus objek hasil scrape supaya field *Formatted otomatis terisi,
// jadi setiap return di bawah cukup pakai withFormatted({...}) sekali.
type RawSocialData = Omit<
	UniversalSocialData,
	| "likesFormatted"
	| "commentsFormatted"
	| "viewsFormatted"
	| "sharesFormatted"
	| "savesFormatted"
>;

function withFormatted(data: RawSocialData): UniversalSocialData {
	return {
		...data,
		likesFormatted: formatCompactNumber(data.likes),
		commentsFormatted: formatCompactNumber(data.comments),
		viewsFormatted: formatCompactNumber(data.views),
		sharesFormatted:
			data.shares !== undefined ? formatCompactNumber(data.shares) : undefined,
		savesFormatted:
			data.saves !== undefined ? formatCompactNumber(data.saves) : undefined,
	};
}

// =================================================================
// CACHE — hindari scraping ulang URL yang sama berkali-kali.
// Catatan: ini in-memory (per instance server). Kalau deploy di
// platform serverless (Vercel dll) yang cold-start, cache ini akan
// hilang antar invocation. Untuk produksi, ganti dengan Redis/KV.
// =================================================================
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit
const cache = new Map<string, { data: UniversalSocialData; expires: number }>();

function getCached(url: string): UniversalSocialData | null {
	const entry = cache.get(url);
	if (!entry) return null;
	if (Date.now() > entry.expires) {
		cache.delete(url);
		return null;
	}
	return entry.data;
}

function setCached(url: string, data: UniversalSocialData) {
	cache.set(url, { data, expires: Date.now() + CACHE_TTL_MS });
}

// Fetch dengan timeout keras supaya satu platform yang lemot
// nggak bikin seluruh request nunggu tanpa batas.
async function fetchWithTimeout(
	url: string,
	init: RequestInit = {},
	timeoutMs = 8000,
) {
	return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}

async function fetchHtml(url: string, timeoutMs = 8000): Promise<string> {
	const res = await fetchWithTimeout(
		url,
		{
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			},
		},
		timeoutMs,
	);
	return await res.text();
}

export const getSocialPostData = createServerFn({ method: "POST" })
	.validator((url: string) => url)
	.handler(async ({ data: url }): Promise<UniversalSocialData> => {
		const cleanUrl = url.trim();

		const cached = getCached(cleanUrl);
		if (cached) return cached;

		try {
			let result: UniversalSocialData;

			if (cleanUrl.includes("instagram.com")) {
				result = await scrapeInstagram(cleanUrl);
			} else if (cleanUrl.includes("tiktok.com")) {
				result = await scrapeTikTok(cleanUrl);
			} else if (
				cleanUrl.includes("youtube.com") ||
				cleanUrl.includes("youtu.be")
			) {
				result = await scrapeYouTube(cleanUrl);
			} else {
				result = createErrorResponse(
					"unknown",
					cleanUrl,
					"Domain/Platform tidak didukung.",
				);
			}

			if (!result.error) setCached(cleanUrl, result);
			return result;
		} catch (error) {
			console.error("Error scraping social data:", error);
			return createErrorResponse("unknown", cleanUrl, "Gagal memproses URL.");
		}
	});

// =================================================================
// 1. INSTAGRAM
// =================================================================
async function scrapeInstagram(cleanUrl: string): Promise<UniversalSocialData> {
	const res = await fetchWithTimeout(cleanUrl, {
		headers: {
			"User-Agent":
				"facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
			"Accept-Language": "en-US,en;q=0.9",
		},
	});

	if (!res.ok) {
		return createErrorResponse(
			"instagram",
			cleanUrl,
			`Instagram HTTP ${res.status}`,
		);
	}

	const html = await res.text();
	const $ = cheerio.load(html);

	const ogTitle = $('meta[property="og:title"]').attr("content") ?? "";
	const ogDesc = $('meta[property="og:description"]').attr("content") ?? "";
	const ogImage = $('meta[property="og:image"]').attr("content") ?? null;
	const ogVideo = $('meta[property="og:video"]').attr("content") ?? null;
	const ogType = $('meta[property="og:type"]').attr("content") ?? "";

	if (!ogDesc && !ogTitle && !ogImage) {
		return createErrorResponse(
			"instagram",
			cleanUrl,
			"Postingan bersifat private, dibatasi usia, atau di-block Instagram.",
		);
	}

	// Instagram kadang taruh format "Author on Instagram: \"caption\"" di
	// og:title, kadang di og:description — cek dua-duanya, pakai yang cocok.
	const source = ogTitle.includes("on Instagram:") ? ogTitle : ogDesc;

	let author: string | null = null;
	let title: string | null = null;

	const fullMatch = source.match(
		/^(.*?)\s+on Instagram:\s*["“](.*)["”]?\s*$/is,
	);
	if (fullMatch) {
		author = fullMatch[1].trim();
		title = fullMatch[2].replace(/["”]\s*$/, "").trim();
	} else {
		// Fallback lama untuk format "Author (@handle) ..."
		const authorMatch = ogTitle.match(/^([^(@]+)/i);
		if (authorMatch) author = authorMatch[1].trim();
	}

	// CATATAN PENTING: Instagram sejak ~2022 biasanya menyembunyikan jumlah
	// like/komentar asli dari crawler publik dan mengembalikan angka placeholder
	// generik (paling sering "1 Likes, 1 Comments") untuk akun yang bukan
	// whitelisted. Tanpa Instagram Graph API resmi (Business/Creator account +
	// access token), angka di bawah ini TIDAK reliable untuk kebanyakan post
	// publik — nilai "1" hampir pasti placeholder, bukan angka asli.
	const likeMatch = ogDesc.match(/([\d,.]+)\s*(?:Likes|Suka)/i);
	const commentMatch = ogDesc.match(/([\d,.]+)\s*(?:Comments|Komentar)/i);
	const likes = likeMatch ? parseNumber(likeMatch[1]) : 0;
	const comments = commentMatch ? parseNumber(commentMatch[1]) : 0;

	// Ada og:video -> ini Reel/video post. Kalau nggak ada, berarti foto.
	// CATATAN: carousel (multi-slide) nggak bisa dibedain dari foto tunggal
	// cuma lewat OG tags — Instagram cuma expose slide pertama ke crawler
	// publik. Jadi carousel akan kebaca sebagai "image", bukan "carousel".
	const mediaType: UniversalSocialData["mediaType"] = ogVideo
		? "video"
		: ogImage
			? "image"
			: "unknown";

	return withFormatted({
		platform: "instagram",
		url: cleanUrl,
		title,
		thumbnailUrl: ogImage,
		author,
		mediaType,
		likes,
		comments,
		views: 0,
		statsReliable: !(likes <= 1 && comments <= 1),
	});
}

// =================================================================
// 2. TIKTOK — ambil dari JSON hydration state, bukan regex og:description
// =================================================================
async function scrapeTikTok(cleanUrl: string): Promise<UniversalSocialData> {
	// oEmbed, HTML scraping, DAN fallback tikwm.com ditembak BERSAMAAN.
	// tikwm baru benar-benar dipakai kalau ekstraksi HTML gagal, tapi
	// request-nya sudah "jalan di background" dari awal — jadi kalau
	// ternyata kepakai, kita tinggal await promise yang sudah setengah
	// jalan, bukan mulai request baru dari nol (hemat 1 round-trip penuh).
	const [oembedResult, html, tikwmResult] = await Promise.all([
		fetchWithTimeout(
			`https://www.tiktok.com/oembed?url=${encodeURIComponent(cleanUrl)}`,
		)
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null),
		fetchHtml(cleanUrl).catch(() => ""),
		fetchWithTimeout(
			`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`,
		)
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null),
	]);

	let title: string | null = oembedResult?.title ?? null;
	let thumbnailUrl: string | null = oembedResult?.thumbnail_url ?? null;
	let author: string | null = oembedResult?.author_name ?? null;

	let likes = 0;
	let comments = 0;
	let views = 0;
	let shares = 0;
	let saves = 0;
	// Default video karena mayoritas konten TikTok adalah video. Diubah
	// jadi "image"/"carousel" kalau ketemu field imagePost (TikTok Photo Mode).
	let mediaType: UniversalSocialData["mediaType"] = "video";

	let statsFound = false;

	if (html) {
		// TikTok menaruh data video (stats lengkap) di dalam script tag JSON.
		// Ada dua kemungkinan id tergantung versi halaman yang di-serve.
		const detail = extractTikTokDetail(html);

		if (detail) {
			const stats = detail.statsV2 ?? detail.stats ?? {};
			likes = parseNumber(stats.diggCount ?? "0");
			comments = parseNumber(stats.commentCount ?? "0");
			views = parseNumber(stats.playCount ?? "0");
			shares = parseNumber(stats.shareCount ?? "0");
			saves = parseNumber(stats.collectCount ?? "0");

			title = title ?? detail.desc ?? null;
			author =
				author ?? detail.author?.nickname ?? detail.author?.uniqueId ?? null;
			thumbnailUrl =
				thumbnailUrl ??
				detail.video?.cover ??
				detail.video?.originCover ??
				null;

			// TikTok Photo Mode: post berupa kumpulan foto, bukan video.
			const imageCount = detail.imagePost?.images?.length ?? 0;
			if (imageCount > 1) mediaType = "carousel";
			else if (imageCount === 1) mediaType = "image";

			statsFound = likes > 0 || comments > 0 || views > 0;
		}

		// Fallback ke og:image kalau thumbnail masih kosong
		if (!thumbnailUrl) {
			const $ = cheerio.load(html);
			thumbnailUrl = $('meta[property="og:image"]').attr("content") ?? null;
		}
	}

	// Kalau parsing HTML gagal dapat stats — biasanya karena TikTok
	// mendeteksi IP server (datacenter) dan mengembalikan halaman
	// kosong/verifikasi, bukan halaman video asli — pakai hasil tikwm.com
	// yang sudah kita tembak paralel dari awal. Ini BUKAN API resmi TikTok,
	// jadi uptime/ToS-nya tidak dijamin; hapus kalau tidak mau bergantung
	// pada layanan luar.
	if (!statsFound) {
		if (!tikwmResult) {
			console.warn(
				"TikTok: gagal ekstrak stats dari HTML dan fallback tikwm.com juga gagal (kemungkinan IP server diblokir/di-rate-limit TikTok).",
			);
		}
		const d = tikwmResult?.data;
		if (d) {
			likes = likes || parseNumber(d.digg_count ?? 0);
			comments = comments || parseNumber(d.comment_count ?? 0);
			views = views || parseNumber(d.play_count ?? 0);
			shares = shares || parseNumber(d.share_count ?? 0);
			saves = saves || parseNumber(d.collect_count ?? 0);
			title = title ?? d.title ?? null;
			author = author ?? d.author?.nickname ?? null;
			thumbnailUrl = thumbnailUrl ?? d.cover ?? null;

			// tikwm juga expose "images" untuk TikTok Photo Mode
			if (mediaType === "video" && Array.isArray(d.images)) {
				mediaType = d.images.length > 1 ? "carousel" : "image";
			}
		}
	}

	return withFormatted({
		platform: "tiktok",
		url: cleanUrl,
		title,
		thumbnailUrl,
		author,
		mediaType,
		likes,
		comments,
		views,
		shares,
		saves,
	});
}

// Coba beberapa pola script-id, karena TikTok kadang serve versi
// halaman yang berbeda tergantung region/A-B test.
function extractTikTokDetail(html: string): any | null {
	const patterns: Array<{ id: string; extract: (json: any) => any }> = [
		{
			id: "__UNIVERSAL_DATA_FOR_REHYDRATION__",
			extract: (json) =>
				json?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct,
		},
		{
			id: "SIGI_STATE",
			extract: (json) => {
				const itemModule = json?.ItemModule;
				const firstKey = itemModule ? Object.keys(itemModule)[0] : null;
				return firstKey ? itemModule[firstKey] : null;
			},
		},
	];

	for (const { id, extract } of patterns) {
		const re = new RegExp(`<script id="${id}"[^>]*>(.*?)</script>`, "s");
		const match = html.match(re);
		if (!match) continue;
		try {
			const json = JSON.parse(match[1]);
			const detail = extract(json);
			if (detail) return detail;
		} catch (e) {
			console.error(`Gagal parse TikTok JSON (${id}):`, e);
		}
	}

	return null;
}

// =================================================================
// 3. YOUTUBE
// =================================================================
async function scrapeYouTube(cleanUrl: string): Promise<UniversalSocialData> {
	const [oembedResult, html] = await Promise.all([
		fetchWithTimeout(
			`https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`,
		)
			.then((r) => (r.ok ? r.json() : null))
			.catch(() => null),
		fetchHtml(cleanUrl).catch(() => ""),
	]);

	const title: string | null = oembedResult?.title ?? null;
	let thumbnailUrl: string | null = oembedResult?.thumbnail_url ?? null;
	const author: string | null = oembedResult?.author_name ?? null;

	if (!thumbnailUrl && html) {
		const $ = cheerio.load(html);
		thumbnailUrl = $('meta[property="og:image"]').attr("content") ?? null;
	}

	const viewsMatch = html.match(/"viewCount":"(\d+)"/);
	const likesMatch = html.match(/"likeCount":"(\d+)"/);

	// Cek apakah URL ini beneran link video, bukan link channel/playlist.
	// Link channel (mis. youtube.com/@namachannel) tidak punya video stats
	// sama sekali — bukan bug scraping, memang bukan halaman video.
	const isVideoUrl = /\/watch\?v=|youtu\.be\//.test(cleanUrl);
	const mediaType: UniversalSocialData["mediaType"] = isVideoUrl
		? "video"
		: "unknown";

	return withFormatted({
		platform: "youtube",
		url: cleanUrl,
		title,
		thumbnailUrl,
		author,
		mediaType,
		likes: likesMatch ? parseNumber(likesMatch[1]) : 0,
		comments: 0,
		views: viewsMatch ? parseNumber(viewsMatch[1]) : 0,
	});
}

// =================================================================
// HELPERS
// =================================================================
// =================================================================
// FORMATTER — ubah angka mentah jadi format ringkas ala IG/TikTok
// Contoh: 1250 -> "1.3rb", 19306474 -> "19.3jt", 1799875253 -> "1.8M"
// =================================================================
export function formatCompactNumber(
	num: number,
	locale: "id" | "en" = "id",
): string {
	const abs = Math.abs(num);
	const sign = num < 0 ? "-" : "";

	const units =
		locale === "id"
			? [
					{ value: 1_000_000_000, suffix: "M" }, // miliar
					{ value: 1_000_000, suffix: "jt" }, // juta
					{ value: 1_000, suffix: "rb" }, // ribu
				]
			: [
					{ value: 1_000_000_000, suffix: "B" },
					{ value: 1_000_000, suffix: "M" },
					{ value: 1_000, suffix: "K" },
				];

	for (const unit of units) {
		if (abs >= unit.value) {
			// 1 desimal, tapi buang ".0" biar "2rb" bukan "2.0rb"
			const formatted = (abs / unit.value).toFixed(1).replace(/\.0$/, "");
			return `${sign}${formatted}${unit.suffix}`;
		}
	}
	return `${sign}${abs}`;
}

function parseNumber(text: string | number): number {
	if (typeof text === "number") return text;
	return parseInt(text.replace(/[,.]/g, ""), 10) || 0;
}

function createErrorResponse(
	platform: UniversalSocialData["platform"],
	url: string,
	message: string,
): UniversalSocialData {
	return withFormatted({
		platform,
		url,
		title: null,
		thumbnailUrl: null,
		author: null,
		mediaType: "unknown",
		likes: 0,
		comments: 0,
		views: 0,
		error: message,
	});
}

export const getSocialFeeds = createServerFn({ method: "GET" }).handler(
	async () => {
		const mixedUrls = [
			"https://www.instagram.com/p/Dbiqo7hEhs6",
			"https://www.tiktok.com/@alfascorpiiofficial/video/7327598153828486405?is_from_webapp=1&sender_device=pc",
			"https://youtube.com/shorts/cdKRMtFzs2c?si=30qImqclUuD_J-s7",
		];

		// Sudah paralel via Promise.all — bagian ini sudah benar dari awal.
		const results = await Promise.all(
			mixedUrls.map((url) => getSocialPostData({ data: url })),
		);

		return results;
	},
);
