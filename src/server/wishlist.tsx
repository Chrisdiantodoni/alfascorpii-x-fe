// owned by: italfa:staff
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { and, desc, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { z } from "zod";
import { db } from "#/db";
import { wishlists } from "#/db/schema";
import { products } from "#/drizzle/schema";
import { auth } from "#/lib/auth";
import { batchFilesWithUrls } from "./files";

async function getUserId(): Promise<string | null> {
  const headers = getRequest()?.headers;
  if (!headers) return null;
  const session = await auth.api.getSession({ headers });
  return session?.user?.id ?? null;
}

export const getWishlist = createServerFn({ method: "GET" }).handler(
  async () => {
    const userId = await getUserId();
    if (!userId) return [];

    const rows = await db
      .select({
        id: wishlists.id,
        productId: wishlists.productId,
        createdAt: wishlists.createdAt,
        product: {
          id: products.id,
          name: products.name,
          slug: products.slug,
          code: products.code,
          price: products.price,
          description: products.description,
        },
      })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .where(eq(wishlists.userId, userId))
      .orderBy(desc(wishlists.createdAt));

    const ids = rows.map((r) => r.productId);
    const filesMap =
      ids.length > 0
        ? await batchFilesWithUrls({ data: { type: "product", ids } })
        : {};

    return rows.map((row) => ({
      ...row,
      product: {
        ...row.product,
        price: row.product.price ? String(row.product.price) : null,
        files: filesMap[row.productId] ?? [],
      },
    }));
  },
);

export const getWishlistIds = createServerFn({ method: "GET" }).handler(
  async () => {
    const userId = await getUserId();
    if (!userId) return [];

    const rows = await db
      .select({ productId: wishlists.productId })
      .from(wishlists)
      .where(eq(wishlists.userId, userId));

    return rows.map((r) => r.productId);
  },
);

const wishlistSchema = z.object({
  productId: z.string().min(1, "Product wajib diisi"),
});

export const addWishlist = createServerFn({ method: "POST" })
  .validator(wishlistSchema)
  .handler(async ({ data }) => {
    const userId = await getUserId();
    if (!userId) return { ok: false, error: "UNAUTHORIZED" as const };

    const [existing] = await db
      .select({ id: wishlists.id })
      .from(wishlists)
      .where(
        and(
          eq(wishlists.userId, userId),
          eq(wishlists.productId, data.productId),
        ),
      )
      .limit(1);

    if (!existing) {
      await db.insert(wishlists).values({
        id: ulid(),
        userId,
        productId: data.productId,
      });
    }

    return { ok: true as const };
  });

export const removeWishlist = createServerFn({ method: "POST" })
  .validator(wishlistSchema)
  .handler(async ({ data }) => {
    const userId = await getUserId();
    if (!userId) return { ok: false, error: "UNAUTHORIZED" as const };

    await db
      .delete(wishlists)
      .where(
        and(
          eq(wishlists.userId, userId),
          eq(wishlists.productId, data.productId),
        ),
      );

    return { ok: true as const };
  });
