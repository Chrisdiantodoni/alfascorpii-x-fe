// =============================================================================
// CATATAN PERUBAHAN (rollback: uncomment blok "LAMA" di bawah, comment blok "BARU")
//
// Versi lama mendeklarasikan getFiles/batchFiles/batchFilesWithUrls sebagai
// `createServerFn`. Padahal ketiga fungsi ini HANYA dipanggil dari handler
// server lain (master.ts / wishlist.ts / cms.ts), tidak pernah dari client.
// Akibatnya di production build fungsi-fungsi ini tidak terdaftar di RPC
// manifest TanStack Start, sehingga pemanggilan dari dalam handler lain
// memicu error: "Server function info not found for 84226f19...".
//
// Fix: diubah menjadi plain async function dengan signature & return yang
// identik, sehingga semua call site TIDAK berubah.
// =============================================================================

import { and, eq, inArray } from "drizzle-orm";
import { db } from "#/db";
import { files } from "#/drizzle/schema";
import { storageUrl } from "#/lib/utils";

export type FileableType = "product" | "sub-category" | "blog";
export type FileItem = typeof files.$inferSelect;
export type FileItemWithUrl = FileItem & { url: string | null };

// ================================ LAMA (ROLLBACK) ================================
// import { createServerFn } from "@tanstack/react-start";
//
// export const getFiles = createServerFn({ method: "GET" })
// 	.validator((data: { type: FileableType; id: string }) => data)
// 	.handler(async ({ data }) => {
// 		return db.query.files.findMany({
// 			where: and(
// 				eq(files.fileableType, data.type),
// 				eq(files.fileableId, data.id),
// 			),
// 			orderBy: (f, { asc }) => [asc(f.sortOrder)],
// 		});
// 	});
//
// export const batchFiles = createServerFn({ method: "POST" })
// 	.validator((data: { type: FileableType; ids: string[] }) => data)
// 	.handler(async ({ data }) => {
// 		if (data.ids.length === 0) return {};
//
// 		const uniqueIds = Array.from(new Set(data.ids));
//
// 		const rows = await db.query.files.findMany({
// 			where: and(
// 				eq(files.fileableType, data.type),
// 				inArray(files.fileableId, uniqueIds),
// 			),
// 			orderBy: (f, { asc }) => [asc(f.sortOrder)],
// 		});
//
// 		const grouped: Record<string, FileItem[]> = {};
// 		for (const row of rows) {
// 			if (!grouped[row.fileableId]) {
// 				grouped[row.fileableId] = [];
// 			}
// 			grouped[row.fileableId].push(row);
// 		}
// 		return grouped;
// 	});
//
// export const batchFilesWithUrls = createServerFn({ method: "POST" })
// 	.validator((data: { type: FileableType; ids: string[] }) => data)
// 	.handler(async ({ data }) => {
// 		// Panggil handler batchFiles langsung di server
// 		const grouped = await batchFiles({ data });
// 		const result: Record<string, FileItemWithUrl[]> = {};
//
// 		for (const [id, items] of Object.entries(grouped)) {
// 			result[id] = items.map((f) => ({
// 				...f,
// 				url: storageUrl(f.filePath) ?? null,
// 			}));
// 		}
//
// 		return result;
// 	});
// ================================ AKHIR LAMA ================================

// ================================ BARU ================================
export async function getFiles(data: {
	data: { type: FileableType; id: string };
}) {
	const { type, id } = data.data;
	return db.query.files.findMany({
		where: and(eq(files.fileableType, type), eq(files.fileableId, id)),
		orderBy: (f, { asc }) => [asc(f.sortOrder)],
	});
}

export async function batchFiles(data: {
	data: { type: FileableType; ids: string[] };
}) {
	const { type, ids } = data.data;
	if (ids.length === 0) return {};

	const uniqueIds = Array.from(new Set(ids));

	const rows = await db.query.files.findMany({
		where: and(eq(files.fileableType, type), inArray(files.fileableId, uniqueIds)),
		orderBy: (f, { asc }) => [asc(f.sortOrder)],
	});

	const grouped: Record<string, FileItem[]> = {};
	for (const row of rows) {
		if (!grouped[row.fileableId]) {
			grouped[row.fileableId] = [];
		}
		grouped[row.fileableId].push(row);
	}
	return grouped;
}

export async function batchFilesWithUrls(data: {
	data: { type: FileableType; ids: string[] };
}) {
	const grouped = await batchFiles(data);
	const result: Record<string, FileItemWithUrl[]> = {};

	for (const [id, items] of Object.entries(grouped)) {
		result[id] = items.map((f) => ({
			...f,
			url: storageUrl(f.filePath) ?? null,
		}));
	}

	return result;
}
// ================================ AKHIR BARU ================================
