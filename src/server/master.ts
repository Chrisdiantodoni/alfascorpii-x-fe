import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, ilike, inArray, or, sql } from "drizzle-orm";
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
import { safeSerialize } from "#/utils/fn";

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
  .validator(
    z.intersection(
      z.object({ slug: z.string() }),
      z.record(z.string(), z.string().optional()),
    ),
  )
  .handler(async ({ data }) => {
    const { slug, ...filters } = data;

    const subCategory = await db.query.subCategories.findFirst({
      where: eq(subCategories.slug, slug),
      with: {
        products: {
          where: (products, { and, eq }) => {
            const conditions = [eq(products.isActive, true)];

            for (const [key, rawValue] of Object.entries(filters)) {
              if (!rawValue) continue;

              const targetValues = rawValue
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);

              if (targetValues.length === 0) continue;

              const valueConditions = targetValues.map((val) => {
                // ▼ Struktur asli specValues pakai `value` (singular), bukan `values` (array)
                const filterObject = JSON.stringify([
                  { key: String(key), value: String(val) },
                ]);

                return sql`${products.specValues} @> ${filterObject}::text::jsonb`;
              });

              conditions.push(sql`(${sql.join(valueConditions, sql` OR `)})`);
            }

            return and(...conditions);
          },
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

    const response = {
      subCategory: safeSerialize(subCategory),
      category: subCategory.category
        ? safeSerialize({
            ...subCategory.category,
            specTemplate: subCategory.category.specTemplate
              ? safeSerialize(subCategory.category.specTemplate)
              : null,
          })
        : null,
      products: subCategory.products.map((prod) => ({
        ...prod,
        specValues: safeSerialize(prod.specValues),
        images: filesMap[prod.id] ?? [],
        thumbnail: filesMap[prod.id]?.[0] ?? null,
      })),
    } as any;

    return response;
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
    const subCategoryIds = response.map((item) => item.id);

    const subCategoryMap = await batchFilesWithUrls({
      data: { type: "sub-category", ids: subCategoryIds },
    });

    const filesMap =
      productIds.length > 0
        ? await batchFilesWithUrls({
            data: { type: "product", ids: productIds },
          })
        : {};

    const result = response.map((subC) => ({
      ...subC,
      files: subCategoryMap[subC.id],
      category: subC.category
        ? {
            ...subC.category,
            specTemplate: subC.category.specTemplate
              ? JSON.parse(JSON.stringify(subC.category.specTemplate))
              : null,
          }
        : null,
      products: subC.products.map((prod) => ({
        ...prod,
        specValues: JSON.parse(JSON.stringify(prod.specValues)),
        files: filesMap[prod.id] ?? [],
        thumbnail: filesMap[prod.id] ?? null,
      })),
    }));
    return result;
  },
);

const productDetailSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
});

export const getProductDetail = createServerFn({ method: "GET" })
  .validator(productDetailSchema)
  .handler(async ({ data }) => {
    const response = await db.query.products.findFirst({
      where: eq(products.slug, data.slug),
      with: {
        productColors: true,
        subCategory: true,
      },
    });

    if (!response) {
      return {
        productDetail: null,
      };
    }
    const filesMap = await batchFilesWithUrls({
      data: { type: "product", ids: [response.id] },
    });

    return {
      ...response,
      specValues: response.specValues
        ? JSON.parse(JSON.stringify(response.specValues))
        : null,
      files: filesMap[response.id] ?? [],
    };
  });

const searchProductsSchema = z.object({
  query: z.string().min(1),
});

export const searchProducts = createServerFn({ method: "GET" })
  .validator(searchProductsSchema)
  .handler(async ({ data }) => {
    const pattern = `%${data.query}%`;

    const results = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        code: products.code,
        price: products.price,
        description: products.description,
      })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          or(ilike(products.name, pattern), ilike(products.code, pattern)),
        ),
      )
      .limit(8);

    const ids = results.map((p) => p.id);
    const filesMap =
      ids.length > 0
        ? await batchFilesWithUrls({
            data: { type: "product", ids },
          })
        : {};

    return results.map((product) => ({
      ...product,
      files: filesMap[product.id] ?? [],
    }));
  });

const productSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
});

export const getProductByCategory = createServerFn({ method: "GET" })
  .validator(productSchema)
  .handler(async ({ data }) => {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, data.slug),
      with: { subCategories: true },
    });

    if (!category || category.subCategories.length === 0) {
      return { res: [] };
    }

    const subCategoryIds = category.subCategories.map((s) => s.id);

    // 2. Query products yang subCategoryId-nya cocok
    const res = await db.query.products.findMany({
      where: inArray(products.subCategoryId, subCategoryIds),
      with: {
        subCategory: true, // opsional: sertakan data subCategory jika butuh
      },
    });

    const productIds = res.map((p) => p.id);

    const filesMap =
      productIds.length > 0
        ? await batchFilesWithUrls({
            data: { type: "product", ids: productIds },
          })
        : {};
    const response = {
      products: res.map((item) => ({
        ...item,
        images: filesMap[item.id],
        specValues: JSON.parse(JSON.stringify(item.specValues)),
      })),
      categories: {
        ...category,
        specTemplate: JSON.parse(JSON.stringify(category.specTemplate)),
      },
    };

    return response;
  });

const productListSchema = z.object({
  is_lineup: z.boolean().default(false),
});

export const getAllProducts = createServerFn({ method: "GET" })
  .validator(productListSchema)
  .handler(async ({ data }) => {
    // 2. Query products yang subCategoryId-nya cocok
    const res = await db.query.products.findMany({
      where: eq(products.isLineup, data.is_lineup),
      with: {
        subCategory: {
          with: {
            category: true,
          },
        },
      },
    });

    const productIds = res.map((p) => p.id);

    const filesMap =
      productIds.length > 0
        ? await batchFilesWithUrls({
            data: { type: "product", ids: productIds },
          })
        : {};
    const response = {
      products: res.map((item) => ({
        ...item,
        files: filesMap[item.id],
        specValues: JSON.parse(JSON.stringify(item.specValues)),
        subCategory: {
          ...item.subCategory,
          category: {
            ...item.subCategory.category,
            specTemplate: item.subCategory.category?.specTemplate
              ? JSON.parse(
                  JSON.stringify(item.subCategory.category?.specTemplate),
                )
              : null,
          },
        },
      })),
    };

    return response.products;
  });
