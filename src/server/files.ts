import { createServerFn } from "@tanstack/react-start";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "#/db";
import { files } from "#/drizzle/schema";
import { storageUrl } from "#/lib/utils";

export type FileableType = "product" | "sub-category" | "blog";
export type FileItem = typeof files.$inferSelect;
export type FileItemWithUrl = FileItem & { url: string | null };

export const getFiles = createServerFn({ method: "GET" })
	.validator((data: { type: FileableType; id: string }) => data)
	.handler(async ({ data }) => {
		return db.query.files.findMany({
			where: and(
				eq(files.fileableType, data.type),
				eq(files.fileableId, data.id),
			),
			orderBy: (f, { asc }) => [asc(f.sortOrder)],
		});
	});

export const batchFiles = createServerFn({ method: "POST" })
	.validator((data: { type: FileableType; ids: string[] }) => data)
	.handler(async ({ data }) => {
		if (data.ids.length === 0) return {};

		const uniqueIds = Array.from(new Set(data.ids));

		const rows = await db.query.files.findMany({
			where: and(
				eq(files.fileableType, data.type),
				inArray(files.fileableId, uniqueIds),
			),
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
	});

export const batchFilesWithUrls = createServerFn({ method: "POST" })
	.validator((data: { type: FileableType; ids: string[] }) => data)
	.handler(async ({ data }) => {
		// Panggil handler batchFiles langsung di server
		const grouped = await batchFiles({ data });
		const result: Record<string, FileItemWithUrl[]> = {};

		for (const [id, items] of Object.entries(grouped)) {
			result[id] = items.map((f) => ({
				...f,
				url: storageUrl(f.filePath) ?? null,
			}));
		}

		return result;
	});
