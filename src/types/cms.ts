import type { FileData } from "./master";

export interface Blog {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	status: string;
	publishedAt: string;
	blogCategory: BlogCategory;
	files: FileData[];
}

export interface BlogCategory {
	id: string;
	name: string;
	slug: string;
}
