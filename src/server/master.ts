import { createServerFn } from "@tanstack/react-start";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
  categories,
  menuItems,
  products,
  relatedProducts,
  siteSettings,
  subCategories,
} from "#/drizzle/schema";
import { generatePresignedUrl } from "#/lib/minio";
import type { ContactSettings } from "#/types";
import { safeSerialize } from "#/utils/fn";
import { batchFilesWithUrls } from "./files";

const siteSettingSchema = z.object({
  key: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val : [val])),
});

export const getLayoutData = createServerFn({ method: "GET" }).handler(
  async () => {
    // 1. Jalankan query database secara paralel tanpa 'await' di dalam array
    const [allMenus, contactSettings] = await Promise.all([
      db.query.menus.findMany({
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
                where: and(
                  eq(categories.isActive, true),
                  isNull(categories.deletedAt),
                ),
                with: {
                  subCategories: {
                    orderBy: (subs, { asc }) => [asc(subs.orderIndex)],
                    where: and(
                      eq(subCategories.showInMenu, true),
                      isNull(subCategories.deletedAt),
                      eq(subCategories.isActive, true),
                    ),
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

      db.query.siteSettings.findFirst({
        where: eq(siteSettings.key, "contact"),
      }),
    ]);

    // 2. Mapping menus & items
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
            } = category as typeof category & { specTemplate?: unknown };
            return { ...catWithoutSpec, subCategories };
          }
          return null;
        })();

        return { ...rest, reference };
      }),
    }));

    // 3. Safe contact values & parallel presigned URL resolution
    const contactVal = contactSettings?.value as ContactSettings;
    const [logoUrl, logoDarkUrl] = await Promise.all([
      contactVal.logo ? generatePresignedUrl(contactVal.logo) : null,
      contactVal.logo_dark ? generatePresignedUrl(contactVal.logo_dark) : null,
    ]);

    return {
      newMenus,
      contact: {
        ...contactVal,
        logo: logoUrl,
        logo_dark: logoDarkUrl,
      },
    };
  },
);

type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const getSiteSettings = createServerFn({ method: "GET" })
  .validator(siteSettingSchema)
  .handler(async ({ data: { key } }) => {
    if (!key || key.length === 0) {
      return { settings: {} as Record<string, JsonValue> };
    }

    const records = await db.query.siteSettings.findMany({
      where: inArray(siteSettings.key, key),
    });

    const settingsMap = records?.reduce<Record<string, JsonValue>>(
      (acc, item) => {
        let value: JsonValue = item.value as JsonValue;

        if (typeof item.value === "string") {
          try {
            value = JSON.parse(item.value) as JsonValue;
          } catch {
            value = item.value;
          }
        }

        acc[item.key] = value;
        return acc;
      },
      {},
    );

    return {
      settings: settingsMap,
    };
  });

export const getCategories = createServerFn({ method: "GET" }).handler(
  async () => {
    const response = await db.query.categories.findMany({
      where: and(eq(categories.isActive, true), isNull(categories.deletedAt)),
      orderBy: (categories, { asc }) => [asc(categories.orderIndex)],
      with: {
        subCategories: {
          with: {
            products: {
              where: and(
                eq(products.isLineup, true),
                isNull(products.deletedAt),
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

function buildSortOrder(sort: string | undefined): SQL[] {
  switch (sort) {
    case "price_asc":
      return [asc(products.price)];
    case "price_desc":
      return [desc(products.price)];
    case "name_asc":
      return [asc(products.name)];
    case "name_desc":
      return [desc(products.name)];
    default:
      return [desc(products.createdAt)];
  }
}

function buildSpecFilters(
  specTemplate: Array<{ key: string; type?: string }>,
  filters: Record<string, string | undefined>,
): SQL[] {
  const textKeys = new Set(
    specTemplate.filter((t) => t.type === "text").map((t) => t.key),
  );
  const numberKeys = new Set(
    specTemplate.filter((t) => t.type === "number").map((t) => t.key),
  );

  const filterConditions: SQL[] = [];

  for (const [key, rawValue] of Object.entries(filters)) {
    if (!rawValue) continue;

    const rangeMatch = key.match(/^(.+)_(min|max)$/);
    if (rangeMatch && numberKeys.has(rangeMatch[1])) {
      const [, baseKey, bound] = rangeMatch;
      const numericValue = Number(rawValue.trim());
      if (!Number.isFinite(numericValue)) continue;

      const operator = bound === "min" ? sql`>=` : sql`<=`;
      filterConditions.push(sql`EXISTS (
        SELECT 1 FROM jsonb_array_elements(${products.specValues}) AS elem
        WHERE elem->>'key' = ${baseKey}
          AND (CASE WHEN elem->>'value' ~ '^-?[0-9]+(\\.[0-9]+)?$'
                    THEN (elem->>'value')::numeric END) ${operator} ${numericValue}
      )`);
      continue;
    }

    if (textKeys.has(key)) {
      const pattern = `%${rawValue.trim()}%`;
      filterConditions.push(sql`EXISTS (
        SELECT 1 FROM jsonb_array_elements(${products.specValues}) AS elem
        WHERE elem->>'key' = ${key} AND elem->>'value' ILIKE ${pattern}
      )`);
      continue;
    }

    const targetValues = rawValue
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (targetValues.length === 0) continue;

    const valueConditions = targetValues.map((val) => {
      const filterObject = JSON.stringify([
        { key: String(key), value: String(val) },
      ]);

      return sql`${products.specValues} @> ${filterObject}::text::jsonb`;
    });

    filterConditions.push(sql`(${sql.join(valueConditions, sql` OR `)})`);
  }

  return filterConditions;
}

export const getSubCategoryBySlug = createServerFn({ method: "GET" })
  .validator(
    z.intersection(
      z.object({ slug: z.string() }),
      z.record(z.string(), z.string().optional()),
    ),
  )
  .handler(async ({ data }) => {
    const { slug, sort, q, ...filters } = data;

    const searchCondition = q?.trim()
      ? or(
          ilike(products.name, `%${q.trim()}%`),
          ilike(products.code, `%${q.trim()}%`),
        )
      : undefined;

    const base = await db.query.subCategories.findFirst({
      where: and(eq(subCategories.slug, slug), isNull(subCategories.deletedAt)),
      columns: { id: true },
      with: { category: { columns: { specTemplate: true } } },
    });

    if (!base) return null;

    const specTemplate = (base.category?.specTemplate ?? []) as Array<{
      key: string;
      type?: string;
    }>;

    const filterConditions = buildSpecFilters(specTemplate, filters);
    const orderBy = buildSortOrder(sort);

    const subCategory = await db.query.subCategories.findFirst({
      where: and(eq(subCategories.slug, slug), isNull(subCategories.deletedAt)),
      with: {
        products: {
          where: (products, { and, eq }) =>
            and(
              eq(products.isActive, true),
              isNull(products.deletedAt),
              ...(searchCondition ? [searchCondition] : []),
              ...filterConditions,
            ),
          orderBy,
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
      where: isNull(subCategories.deletedAt),
      orderBy: asc(subCategories.orderIndex),
      with: {
        products: {
          where: and(eq(products.isActive, true), isNull(products.deletedAt)),
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
      where: and(eq(products.slug, data.slug), isNull(products.deletedAt)),
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

    const relatedIds = await db
      .select({ relatedProductId: relatedProducts.relatedProductId })
      .from(relatedProducts)
      .where(eq(relatedProducts.productId, response.id));

    const ids = relatedIds.map((r) => r.relatedProductId);

    const relatedProductsList =
      ids.length > 0
        ? await db
            .select({
              id: products.id,
              name: products.name,
              slug: products.slug,
              code: products.code,
              price: products.price,
              stock: products.stock,
              description: products.description,
              subCategoryName: subCategories.name,
            })
            .from(products)
            .leftJoin(
              subCategories,
              eq(products.subCategoryId, subCategories.id),
            )
            .where(
              and(
                inArray(products.id, ids),
                eq(products.isActive, true),
                isNull(products.deletedAt),
              ),
            )
        : [];

    const relatedFilesMap =
      relatedProductsList.length > 0
        ? await batchFilesWithUrls({
            data: {
              type: "product",
              ids: relatedProductsList.map((p) => p.id),
            },
          })
        : {};

    const related = relatedProductsList.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      code: p.code,
      price: p.price,
      stock: p.stock,
      description: p.description,
      subCategory: p.subCategoryName ? { name: p.subCategoryName } : null,
      images: relatedFilesMap[p.id] ?? [],
    }));

    return {
      ...response,
      specValues: response.specValues
        ? JSON.parse(JSON.stringify(response.specValues))
        : null,
      files: filesMap[response.id] ?? [],
      related,
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
          isNull(products.deletedAt),
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

export const getProductByCategory = createServerFn({ method: "GET" })
  .validator(
    z.intersection(
      z.object({ slug: z.string().min(1) }),
      z.record(z.string(), z.string().optional()),
    ),
  )
  .handler(async ({ data }) => {
    const { slug, sort, q, ...filters } = data;

    const searchCondition = q?.trim()
      ? or(
          ilike(products.name, `%${q.trim()}%`),
          ilike(products.code, `%${q.trim()}%`),
        )
      : undefined;

    const category = await db.query.categories.findFirst({
      where: and(eq(categories.slug, slug), isNull(categories.deletedAt)),
      with: { subCategories: { where: isNull(subCategories.deletedAt) } },
    });

    if (!category || category.subCategories.length === 0) {
      return { res: [] };
    }

    const subCategoryIds = category.subCategories.map((s) => s.id);

    const specTemplate = (category.specTemplate ?? []) as Array<{
      key: string;
      type?: string;
    }>;

    const filterConditions = buildSpecFilters(specTemplate, filters);
    const orderBy = buildSortOrder(sort);

    const res = await db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        isNull(products.deletedAt),
        inArray(products.subCategoryId, subCategoryIds),
        ...(searchCondition ? [searchCondition] : []),
        ...filterConditions,
      ),
      orderBy,
      with: {
        subCategory: true,
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
      where: and(
        eq(products.isLineup, data.is_lineup),
        isNull(products.deletedAt),
      ),
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
