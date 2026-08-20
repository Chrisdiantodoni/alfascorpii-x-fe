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
import { now } from "#/lib/utils";
import { generatePresignedUrls } from "#/lib/minio";
import type { BannerScope } from "#/types/menu";
import { batchFilesWithUrls } from "./files";

function mapBanner(b: typeof banners.$inferSelect) {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.filePath,
    clickUrl: b.clickUrl,
    ctaText: b.ctaText,
    textColor: b.textColor,
    overlay: b.overlay,
    placement: b.placement,
    orderPosition: b.orderPosition,
    isActive: b.isActive,
    startDate: b.startDate,
    endDate: b.endDate,
    fieldSettings: b.fieldSettings ?? null,
  };
}

async function resolveScopes(pathname: string): Promise<BannerScope[]> {
  // Pastikan pathname ter-decode dengan benar
  const decodedPath = decodeURIComponent(pathname);
  if (decodedPath === "/") return [{ type: "home", id: "home" }];

  const slug = decodedPath.replace(/^\//, "").split("/").pop() || "";

  const [page, category, subCategory, menuItem] = await Promise.all([
    slug
      ? db.query.pages.findFirst({
          where: and(eq(pages.slug, slug), isNull(pages.deletedAt)),
        })
      : null,
    slug
      ? db.query.categories.findFirst({
          where: and(eq(categories.slug, slug), isNull(categories.deletedAt)),
        })
      : null,
    slug
      ? db.query.subCategories.findFirst({
          where: and(
            eq(subCategories.slug, slug),
            isNull(subCategories.deletedAt),
          ),
        })
      : null,
    db.query.menuItems.findFirst({ where: eq(menuItems.url, decodedPath) }),
  ]);

  if (page) return [{ type: "page", id: page.id }];
  if (category) return [{ type: "category", id: category.id }];
  if (subCategory) return [{ type: "sub-category", id: subCategory.id }]; // Disesuaikan menjadi sub_category
  if (menuItem) return [{ type: "menu_item", id: menuItem.id }];

  return [];
}

async function fetchBanners(scopes: BannerScope[]) {
  const scopeFilters = [
    isNull(banners.bannerableType), // Banner global (berlaku untuk semua halaman)
    ...scopes.map((s) =>
      s.type === "home"
        ? eq(banners.bannerableType, "home")
        : and(
            eq(banners.bannerableType, s.type),
            eq(banners.bannerableId, s.id),
          ),
    ),
  ];

  const currentTime = new Date(); // Atau gunakan now() bawaan project Anda

  const rows = await db.query.banners.findMany({
    where: and(
      eq(banners.isActive, true),
      isNull(banners.deletedAt),
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
    const scopes = await resolveScopes(data.pathname);
    const rows = await fetchBanners(scopes);

    const allPaths = rows.map((b) => b.filePath).filter(Boolean) as string[];
    const presignedMap =
      allPaths.length > 0 ? await generatePresignedUrls(allPaths) : {};

    const grouped: Record<string, ReturnType<typeof mapBanner>[]> = {
      hero: [],
      top: [],
      middle: [],
      bottom: [],
    };

    for (const b of rows) {
      if (b.placement && grouped[b.placement]) {
        const mapped = mapBanner(b);
        mapped.imageUrl = b.filePath
          ? (presignedMap[b.filePath] ?? null)
          : null;
        grouped[b.placement].push(mapped);
      }
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
  .validator(blogListSchema)
  .handler(async ({ data }) => {
    // 2. Ambil kategori terlebih dahulu agar bisa filter blog berdasarkan categoryId
    const allCategories = await db.query.blogCategories.findMany({
      orderBy: asc(blogCategories.orderIndex),
      where: and(
        eq(blogCategories.isActive, true),
        isNull(blogCategories.deletedAt),
      ),
    });

    const conditions = [
      and(eq(blogs.status, "published"), isNull(blogs.deletedAt)),
    ];

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
        eq(blogs.status, "published"),
        isNull(blogs.deletedAt),
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
        isNull(blogs.deletedAt),
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
        isNull(pages.deletedAt),
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

const markdownImagesSchema = z.object({
  paths: z.array(z.string()).max(50),
});

export const getMarkdownPresignedUrls = createServerFn({ method: "POST" })
  .validator(markdownImagesSchema)
  .handler(async ({ data }) => generatePresignedUrls(data.paths));
