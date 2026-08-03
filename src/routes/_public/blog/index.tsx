import { useSuspenseQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import Hero from "#/components/sections/Hero";
import { BannerCarousel } from "#/components/ui/BannerCarousel";
import type { Banner } from "#/components/ui/BannerSlide";
import { BlogCard } from "#/components/ui/BlogCard";
import { StaggerItem } from "#/components/ui/StaggerItem";
import { StaggerList } from "#/components/ui/StaggerList";
import { getBanners, getBlogs } from "#/server/cms";

const pageSize = 6;

// 1. Zod schema dengan default handling agar tidak crash tanpa query param
const blogListSchema = z
	.object({
		slug: z.string().optional(),
	})
	.optional()
	.default({});

export const Route = createFileRoute("/_public/blog/")({
	component: Blog,
	validateSearch: zodValidator(blogListSchema),
	loaderDeps: ({ search }) => ({
		slug: search.slug,
	}),
	loader: async ({ deps }) => {
		const res = await getBlogs({ data: { slug: deps.slug } });

		return {
			res,
		};
	},
});

function Blog() {
	const { res } = Route.useLoaderData();

	const location = useLocation();

	const { data: banners } = useSuspenseQuery({
		queryKey: ["banners", "blog"],
		queryFn: () => getBanners({ data: { pathname: "/blog" } }),
		staleTime: Infinity,
	});

	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const posts = res.blogLists;
	const blogCategories = res.blogCategories;

	const currentSlug = search?.slug || "";
	const [shown, setShown] = useState(pageSize);
	const sentinelRef = useRef<HTMLDivElement>(null);

	// Reset item yang ditampilkan jika kategori (slug) pada URL berubah
	useEffect(() => {
		setShown(pageSize);
	}, []);

	// Observer untuk Infinite Scroll
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || shown >= posts.length) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setShown((s) => s + pageSize);
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [shown, posts.length]);

	// Function handler untuk update URL ketika kategori diklik
	const handleFilterChange = (slug?: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				slug: slug || undefined, // Hapus query param 'slug' dari URL jika klik "SEMUA"
			}),
		});
	};

	return (
		<>
			<div className="layout-container">
				{/* mode="wait" memastikan halaman lama menghilang sebelum halaman baru masuk */}
				<AnimatePresence mode="wait">
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -15 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<Hero banners={banners.hero as Banner[]} />

						<BannerCarousel
							banners={banners.top as Banner[]}
							height="200px"
							className="-mx-6 md:-mx-16"
						/>

						<section className="min-h-[40vh] flex flex-col justify-center pt-24 pb-8">
							<span className="text-[12px] tracking-[0.25em] text-blue-bright font-semibold mb-4">
								EDITORIAL &amp; INSIGHT
							</span>
							<h1 className="font-head font-black leading-[0.88] tracking-tighter text-[clamp(2.75rem,10vw,6rem)]">
								BLOG
							</h1>
							<p className="text-[17px] md:text-[20px] text-ash max-w-lg mt-6">
								Tips perawatan, teknologi terbaru, dan info promo langsung dari
								tim Alfa Scorpii X.
							</p>
						</section>

						<BannerCarousel
							banners={banners.middle as Banner[]}
							height="200px"
							className="-mx-6 md:-mx-16"
						/>

						{/* Filter Buttons Section */}
						<section className="py-8 border-t border-line flex flex-wrap gap-3">
							<button
								type="button"
								onClick={() => handleFilterChange()}
								className={`px-5 py-2 text-[12px] font-semibold tracking-widest transition-colors ${
									!currentSlug
										? "bg-[#0A0A0C] text-white"
										: "border border-line text-ash hover:text-ink hover:border-ink"
								}`}
							>
								SEMUA
							</button>

							{blogCategories.map((cat) => (
								<button
									type="button"
									key={cat.id || cat.slug}
									onClick={() => handleFilterChange(cat.slug)}
									className={`px-5 py-2 text-[12px] font-semibold tracking-widest transition-colors ${
										currentSlug === cat.slug
											? "bg-[#0A0A0C] text-white"
											: "border border-line text-ash hover:text-ink hover:border-ink"
									}`}
								>
									{cat.name.toUpperCase()}
								</button>
							))}
						</section>

						{/* Posts Grid */}
						{posts.length > 0 ? (
							<StaggerList
								key={currentSlug}
								className="py-12 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14"
							>
								{posts.slice(0, shown).map((post) => (
									<StaggerItem key={post.id}>
										<BlogCard post={post} />
									</StaggerItem>
								))}
							</StaggerList>
						) : null}

						{/* Sentinel Infinite Scroll / Status Info */}
						<div ref={sentinelRef} className="flex justify-center py-10">
							{posts.length === 0 ? (
								<span className="text-[12px] tracking-[.08em] text-[#9CA3AF]">
									Belum ada artikel di kategori ini.
								</span>
							) : shown >= posts.length ? (
								<span className="text-[12px] tracking-[.08em] text-[#9CA3AF]">
									SEMUA ARTIKEL SUDAH DITAMPILKAN
								</span>
							) : (
								<div className="w-5 h-5 border-2 border-line border-t-blue-bright rounded-full animate-spin" />
							)}
						</div>

						<BannerCarousel
							banners={banners.bottom as Banner[]}
							height="200px"
							className="-mx-6 md:-mx-16"
						/>
					</motion.div>
				</AnimatePresence>
			</div>
		</>
	);
}
