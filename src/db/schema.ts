import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { products } from "../drizzle/schema";
import { user } from "./auth-schema";

// owned by: italfa:staff

export const wishlists = pgTable(
	"wishlists",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		productId: text("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => [
		unique("wishlists_user_product_unique").on(table.userId, table.productId),
		index("wishlists_user_idx").on(table.userId),
	],
);

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
	user: one(user, {
		fields: [wishlists.userId],
		references: [user.id],
	}),
	product: one(products, {
		fields: [wishlists.productId],
		references: [products.id],
	}),
}));
