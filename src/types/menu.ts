export interface MenuData {
	id: string;
	location: string;
	createdAt: string | null;
	updatedAt: string | null;
	menuItems: MenuItemData[];
}

export interface MenuItemData {
	id: string;
	menuId: string;
	parentId: string | null;
	type: string;
	referenceId: string | null;
	label: string | null;
	url: string | null;
	orderIndex: number;
	isActive: boolean;
	createdAt: string | null;
	updatedAt: string | null;
	reference: PageRef | CategoryRef | null;
}

export interface PageRef {
	id: string;
	title: string;
	slug: string;
}

export interface CategoryRef {
	id: string;
	name: string;
	slug: string;
	subCategories: SubCategoryRef[];
}

export interface SubCategoryRef {
	id: string;
	name: string;
	slug: string;
	products?: ProductRef[];
}

export interface ProductRef {
	id: string;
	name: string;
	slug: string;
}

export interface ContactSettings {
	name: string;
	email: string;
	phone: string;
	tel_number?: string | null;
	logo?: string | null;
	logo_dark?: string | null;
	address: {
		street: string;
		province: string;
		city: string;
		district: string;
		sub_district: string;
		zipcode: string;
	};
	social_media?: ContactSocialMedia | null;
}
export interface ContactSocialMedia {
	instagram?: string | null;
	linkedin?: string | null;
	facebook?: string | null;
	tiktok?: string | null;
	whatsapp?: string | null;
	youtube?: string | null;
}

export const PLACEMENTS = ["hero", "top", "middle", "bottom"] as const;
export type BannerPlacement = (typeof PLACEMENTS)[number];

export interface BannerScope {
	type: "page" | "category" | "sub_category" | "product" | "blog" | "menu_item";
	id: string;
}

export interface BannerOut {
	id: string;
	title: string | null;
	subtitle: string | null;
	imageUrl: string | null;
	clickUrl: string | null;
	ctaText: string | null;
	textColor: string;
	overlay: boolean;
	placement: string;
	orderPosition: number;
	isActive: boolean;
	startDate: string | null;
	endDate: string | null;
	fieldSettings: unknown;
}
