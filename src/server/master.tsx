import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
	categories,
	menuItems,
	products,
	siteSettings,
	subCategories,
} from "#/drizzle/schema";
import type { ContactSettings } from "#/types";
import { batchFilesWithUrls } from "./files";

const siteSettingSchema = z.object({
	key: z.string(),
});

export const getLayoutData = createServerFn({ method: "GET" }).handler(
	async () => {
		const [allMenus, contactSettings] = await Promise.all([
			await db.query.menus.findMany({
				orderBy: (menus, { asc }) => [asc(menus.id)],
				with: {
					menuItems: {
						orderBy: (items, { asc }) => [
							asc(items.menuId),
							asc(items.orderIndex),
						],
						where: eq(menuItems.isActive, true),
						with: {
							page: true,
							category: {
								with: {
									subCategories: {
										orderBy: (subs, { asc }) => [asc(subs.orderIndex)],
										where: eq(subCategories.showInMenu, true),
										with: {
											products: {
												limit: 3,
												columns: { name: true, slug: true, id: true },
												orderBy: (p, { asc }) => [asc(p.name)],
											},
										},
									},
								},
							},
						},
					},
				},
			}),

			await db.query.siteSettings.findFirst({
				where: eq(siteSettings.key, "contact"),
			}),
		]);

		const newMenus = allMenus.map((menu) => ({
			...menu,
			menuItems: menu.menuItems.map((item) => {
				const { page, category, ...rest } = item;

				const reference = (() => {
					if (item.type === "page") return page;
					if (item.type === "category" && category) {
						const {
							specTemplate: _,
							subCategories,
							...catWithoutSpec
						} = category;
						return { ...catWithoutSpec, subCategories };
					}
					return null;
				})();

				return { ...rest, reference };
			}),
		}));

		return {
			newMenus,
			contact: (contactSettings?.value as ContactSettings) ?? null,
		};
	},
);

export const getSiteSettings = createServerFn({ method: "GET" })
	.validator(siteSettingSchema)
	.handler(async ({ data: { key } }) => {
		const settings = await db.query.siteSettings.findFirst({
			where: eq(siteSettings.key, key),
		});
		if (!settings) {
			return { settings: null };
		}
		return {
			settings: JSON.parse(JSON.stringify(settings.value)),
		};
	});

export const getCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const response = await db.query.categories.findMany({
			where: eq(categories.isActive, true),
			orderBy: (categories, { asc }) => [asc(categories.orderIndex)],
			with: {
				subCategories: {
					with: {
						products: {
							where: and(
								eq(products.isLineup, true),
								eq(products.isActive, true),
							),
							limit: 2,
						},
					},
				},
			},
		});

		const productIds = response.flatMap((category) =>
			category.subCategories.flatMap((subCategory) =>
				subCategory.products.map((item) => item.id),
			),
		);

		const filesMap = await batchFilesWithUrls({
			data: { type: "product", ids: productIds },
		});

		return {
			categories: response.map((item) => ({
				...item,
				specTemplate: JSON.parse(JSON.stringify(item.specTemplate)),
				subCategories: item.subCategories.map((item) => ({
					...item,
					products: item.products.map((item) => ({
						...item,
						images: filesMap[item.id],
						specValues: JSON.parse(JSON.stringify(item.specValues)),
					})),
				})),
			})),
		};
	},
);

export const getSubCategoryBySlug = createServerFn({ method: "GET" })
	.validator(z.object({ slug: z.string() }))
	.handler(async ({ data: { slug } }) => {
		const subCategory = await db.query.subCategories.findFirst({
			where: eq(subCategories.slug, slug),
			with: {
				products: {
					where: eq(products.isActive, true),
					orderBy: asc(products.name),
				},
				category: true,
			},
		});

		if (!subCategory) return null;

		const productIds = subCategory.products.map((p) => p.id);

		const filesMap =
			productIds.length > 0
				? await batchFilesWithUrls({
						data: { type: "product", ids: productIds },
					})
				: {};

		return {
			...subCategory,
			products: subCategory.products.map((prod) => ({
				...prod,
				files: filesMap[prod.id] ?? [],
				thumbnail: filesMap[prod.id] ?? null,
			})),
		};
	});

export const getSubCategories = createServerFn({ method: "GET" }).handler(
	async () => {
		const response = await db.query.subCategories.findMany({
			orderBy: asc(subCategories.orderIndex),
			with: {
				products: {
					where: eq(products.isActive, true),
					limit: 10,
				},
				category: true,
			},
		});

		const productIds = response.flatMap((subC) =>
			subC.products ? subC.products.map((p) => p.id) : [],
		);

		const filesMap =
			productIds.length > 0
				? await batchFilesWithUrls({
						data: { type: "product", ids: productIds },
					})
				: {};

		const result = response.map((subC) => ({
			...subC,
			products: subC.products.map((prod) => ({
				...prod,
				files: filesMap[prod.id] ?? [],
				thumbnail: filesMap[prod.id] ?? null,
			})),
		}));
		return result;
	},
);
