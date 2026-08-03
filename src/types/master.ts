export interface FeaturedProduct {
	id: string;
	name: string;
	slug: string;
	code: string | null;
	price: string;
	stock: number;
	isActive: boolean;
	specValues: Record<string, unknown> | null;
	images: FileData[];
}

export interface FileData {
	id: string;
	role: string;
	url: string | null;
}

export interface SubCategory {
	id: string;
	categoryId: string | null;
	name: string;
	slug: string;
	orderIndex: number;
	showInMenu: boolean;
	isActive: boolean;
	createdAt: string | null;
	updatedAt: string | null;
	deletedAt: string | null;
	products?: FeaturedProduct[];
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	orderIndex: number;
	showInMenu: boolean;
	isActive: boolean;
	specTemplate: string | Record<string, unknown> | null;
	createdAt: string | null;
	updatedAt: string | null;
	deletedAt: string | null;
	subCategories: SubCategory[];
}
