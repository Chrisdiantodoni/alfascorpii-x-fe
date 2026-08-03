import { and, eq, inArray } from "drizzle-orm";
import { db } from "#/db";
import { files } from "#/drizzle/schema";
import { storageUrl } from "#/lib/utils";

export type FileableType = "product" | "sub-category" | "blog";
export type FileItem = typeof files.$inferSelect;
export type FileItemWithUrl = FileItem & { url: string | null };

export async function getFiles(
	type: FileableType,
	id: string,
): Promise<FileItem[]> {
	return db.query.files.findMany({
		where: and(eq(files.fileableType, type), eq(files.fileableId, id)),
		orderBy: (f, { asc }) => [asc(f.sortOrder)],
	});
}

export async function batchFiles(
	type: FileableType,
	ids: string[],
): Promise<Map<string, FileItem[]>> {
	if (ids.length === 0) return new Map();

	const uniqueIds = Array.from(new Set(ids));

	const rows = await db.query.files.findMany({
		where: and(
			eq(files.fileableType, type),
			inArray(files.fileableId, uniqueIds),
		),
		orderBy: (f, { asc }) => [asc(f.sortOrder)],
	});

	const grouped = new Map<string, FileItem[]>();
	for (const row of rows) {
		const arr = grouped.get(row.fileableId);
		if (arr) {
			arr.push(row);
		} else {
			grouped.set(row.fileableId, [row]);
		}
	}
	return grouped;
}

export async function batchFilesWithUrls(
	type: FileableType,
	ids: string[],
): Promise<Map<string, FileItemWithUrl[]>> {
	const grouped = await batchFiles(type, ids);
	const result = new Map<string, FileItemWithUrl[]>();

	for (const [id, items] of grouped) {
		result.set(
			id,
			items.map((f) => ({
				...f,
				// Safe check jika f.filePath bernilai null/undefined
				url: storageUrl(f.filePath) ?? null,
			})),
		);
	}

	return result;
}
