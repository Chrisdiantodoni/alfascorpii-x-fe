import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, gte, isNull, lte, not, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import {
  banners,
  blogCategories,
  blogs,
  categories,
  menuItems,
  pages,
  products,
  siteSettings,
  subCategories,
} from "#/drizzle/schema";
import { now, storageUrl } from "#/lib/utils";
import type { BannerScope } from "#/types/menu";
import { batchFilesWithUrls } from "./files";

function mapBanner(b: typeof banners.$inferSelect) {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: storageUrl(b.filePath),
    clickUrl: b.clickUrl,
    ctaText: b.ctaText,
    textColor: b.textColor,
    overlay: b.overlay,
    placement: b.placement,
    orderPosition: b.orderPosition,
    isActive: b.isActive,
    startDate: b.startDate,
    endDate: b.endDate,
    fieldSettings: JSON.parse(JSON.stringify(b.fieldSettings ?? null)),
  };
}

async function resolveScopes(pathname: string): Promise<BannerScope[]> {
  if (pathname === "/") return [{ type: "home", id: "home" }];

  const slug = pathname.replace(/^\//, "").split("/").pop()!;

  const [page, category, product, blog, menuItem] = await Promise.all([
    db.query.pages.findFirst({ where: eq(pages.slug, slug) }),
    db.query.categories.findFirst({ where: eq(categories.slug, slug) }),
    db.query.products.findFirst({ where: eq(products.slug, slug) }),
    db.query.blogs.findFirst({ where: eq(blogs.slug, slug) }),
    db.query.menuItems.findFirst({ where: eq(menuItems.url, pathname) }),
  ]);

  if (page) return [{ type: "page", id: page.id }];

  if (category) {
    const subs = await db.query.subCategories.findMany({
      where: eq(subCategories.categoryId, category.id),
      columns: { id: true },
    });
    return [
      { type: "category", id: category.id },
      ...subs.map((s) => ({ type: "sub_category" as const, id: s.id })),
    ];
  }

  if (product) return [{ type: "product", id: product.id }];
  if (blog) return [{ type: "blog", id: blog.id }];
  if (menuItem) return [{ type: "menu_item", id: menuItem.id }];

  return [];
}

async function fetchBanners(scopes: BannerScope[]) {
  const scopeFilters = [
    isNull(banners.bannerableType),
    ...scopes.map((s) =>
      s.type === "home"
        ? eq(banners.bannerableType, "home")
        : and(
            eq(banners.bannerableType, s.type),
            eq(banners.bannerableId, s.id),
          ),
    ),
  ];

  const currentTime = now();

  const rows = await db.query.banners.findMany({
    where: and(
      eq(banners.isActive, true),
      or(...scopeFilters),
      or(isNull(banners.startDate), lte(banners.startDate, currentTime)),
      or(isNull(banners.endDate), gte(banners.endDate, currentTime)),
    ),
    orderBy: (b, { asc }) => [asc(b.placement), asc(b.orderPosition)],
  });

  return rows;
}

const schema = z.object({
  pathname: z.string(),
});

export const getBanners = createServerFn({ method: "GET" })
  .validator(schema)
  .handler(async ({ data }) => {
    console.log({ data }, "data");
    const scopes = await resolveScopes(data.pathname);

    const rows = await fetchBanners(scopes);

    const grouped: Record<string, ReturnType<typeof mapBanner>[]> = {
      hero: [],
      top: [],
      middle: [],
      bottom: [],
    };
    for (const b of rows) {
      grouped[b.placement]?.push(mapBanner(b));
    }
    return grouped;
  });

const blogListSchema = z
  .object({
    slug: z.string().optional(),
  })
  .optional()
  .default({});

export const getBlogs = createServerFn({ method: "GET" })
  .validator((data: unknown) => blogListSchema.parse(data ?? {}))
  .handler(async ({ data }) => {
    // 2. Ambil kategori terlebih dahulu agar bisa filter blog berdasarkan categoryId
    const allCategories = await db.query.blogCategories.findMany({
      orderBy: asc(blogCategories.orderIndex),
    });

    const conditions = [eq(blogs.status, "published")];

    if (data?.slug) {
      // Cari ID kategori berdasarkan slug yang dikirim
      const selectedCategory = allCategories.find((c) => c.slug === data.slug);

      if (selectedCategory) {
        // Filter blog berdasarkan categoryId milik kategori tersebut
        conditions.push(eq(blogs.blogCategoryId, selectedCategory.id));
      } else {
        // Jika slug kategori tidak ditemukan di DB, kembalikan list kosong
        return {
          blogCategories: allCategories,
          blogLists: [],
        };
      }
    }

    // 3. Kueri blog yang sudah difilter dengan benar
    const blogLists = await db.query.blogs.findMany({
      where: and(...conditions),
      with: { blogCategory: true },
      orderBy: asc(blogs.publishedAt),
    });

    // 4. Batching URL file gambar
    const blogIds = blogLists.map((item) => item.id);
    const filesMap =
      blogIds.length > 0
        ? await batchFilesWithUrls({ data: { type: "blog", ids: blogIds } })
        : {};

    // 5. Return data terstruktur
    return {
      blogCategories: allCategories,
      blogLists: blogLists.map((item) => ({
        ...item,
        // Disesuaikan dengan komponen BlogCard (bisa diakses via post.files atau post.thumbnail)
        files: filesMap[item.id] ?? [],
        thumbnail: filesMap[item.id] ?? null,
      })),
    };
  });

const blogDetailSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
});

export const getBlogDetail = createServerFn({ method: "GET" })
  .validator(blogDetailSchema)
  .handler(async ({ data }) => {
    // 1. Kueri blog berdasarkan slug dan status published
    const blogDetails = await db.query.blogs.findFirst({
      where: and(
        eq(blogs.slug, data.slug),
        eq(blogs.status, "published"), // Memastikan hanya blog terpublikasi yang bisa diakses
      ),
      with: {
        blogCategory: true, // Ambil pula relasi kategorinya jika dibutuhkan di detail page
      },
      orderBy: (blogs, { desc }) => [desc(blogs.createdAt)],
    });

    // 2. Early return jika blog tidak ditemukan (404 Handling)
    if (!blogDetails) {
      return {
        blogDetail: null,
      };
    }
    const related = await db.query.blogs.findMany({
      where: and(
        eq(blogs.status, "published"),
        eq(blogs.blogCategoryId, blogDetails?.blogCategoryId),
        not(eq(blogs.id, blogDetails.id)),
      ),
      limit: 5, // Optional: batasi jumlah related blogs
      with: {
        blogCategory: true,
      },
    });

    const relatedIds = related.map((item) => item.id);

    // 3. Ambil URL file/gambar dengan safe Array ID passing
    const filesMap = await batchFilesWithUrls({
      data: { type: "blog", ids: [blogDetails.id, ...relatedIds] },
    });

    // 4. Return data yang valid
    return {
      blogDetail: {
        ...blogDetails,
        files: filesMap[blogDetails.id] ?? [],
      },
      related: related.map((item) => ({
        ...item,
        files: filesMap[item.id] ?? [],
      })),
    };
  });

export const getPages = createServerFn({ method: "GET" })
  .validator(blogDetailSchema)
  .handler(async ({ data }) => {
    // Jika tidak ada slug yang dikirim, return null
    if (!data?.slug) {
      return null;
    }

    const page = await db.query.pages.findFirst({
      where: and(
        eq(pages.slug, data.slug.replace("/", "")),
        eq(pages.isActive, true),
      ),
    });

    if (!page) {
      return null;
    }

    // Return data dengan sanitasi properti JSON jika ada
    return {
      ...page,
      // bersihkan agar serializable dan bebas error TypeScript:
    };
  });
