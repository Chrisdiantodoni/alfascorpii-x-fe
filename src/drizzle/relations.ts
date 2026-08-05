import { relations } from "drizzle-orm/relations";
import {
	blogCategories,
	blogs,
	categories,
	menuItems,
	menus,
	modelHasPermissions,
	modelHasRoles,
	permissions,
	productColors,
	products,
	relatedProducts,
	roleHasPermissions,
	roles,
	subCategories,
	users,
} from "./schema";

export const blogsRelations = relations(blogs, ({ one }) => ({
	user: one(users, {
		fields: [blogs.userId],
		references: [users.id],
	}),
	blogCategory: one(blogCategories, {
		fields: [blogs.blogCategoryId],
		references: [blogCategories.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	blogs: many(blogs),
}));

export const blogCategoriesRelations = relations(
	blogCategories,
	({ many }) => ({
		blogs: many(blogs),
	}),
);

export const subCategoriesRelations = relations(
	subCategories,
	({ one, many }) => ({
		category: one(categories, {
			fields: [subCategories.categoryId],
			references: [categories.id],
		}),
		products: many(products),
	}),
);

export const categoriesRelations = relations(categories, ({ many }) => ({
	subCategories: many(subCategories),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
	menu: one(menus, {
		fields: [menuItems.menuId],
		references: [menus.id],
	}),
	menuItem: one(menuItems, {
		fields: [menuItems.parentId],
		references: [menuItems.id],
		relationName: "menuItems_parentId_menuItems_id",
	}),
	menuItems: many(menuItems, {
		relationName: "menuItems_parentId_menuItems_id",
	}),
}));

export const menusRelations = relations(menus, ({ many }) => ({
	menuItems: many(menuItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	subCategory: one(subCategories, {
		fields: [products.subCategoryId],
		references: [subCategories.id],
	}),
	productColors: many(productColors),
	relatedProducts_productId: many(relatedProducts, {
		relationName: "relatedProducts_productId_products_id",
	}),
	relatedProducts_relatedProductId: many(relatedProducts, {
		relationName: "relatedProducts_relatedProductId_products_id",
	}),
}));

export const productColorsRelations = relations(productColors, ({ one }) => ({
	product: one(products, {
		fields: [productColors.productId],
		references: [products.id],
	}),
}));

export const roleHasPermissionsRelations = relations(
	roleHasPermissions,
	({ one }) => ({
		permission: one(permissions, {
			fields: [roleHasPermissions.permissionId],
			references: [permissions.uuid],
		}),
		role: one(roles, {
			fields: [roleHasPermissions.roleId],
			references: [roles.uuid],
		}),
	}),
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
	roleHasPermissions: many(roleHasPermissions),
	modelHasPermissions: many(modelHasPermissions),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
	roleHasPermissions: many(roleHasPermissions),
	modelHasRoles: many(modelHasRoles),
}));

export const modelHasPermissionsRelations = relations(
	modelHasPermissions,
	({ one }) => ({
		permission: one(permissions, {
			fields: [modelHasPermissions.permissionId],
			references: [permissions.uuid],
		}),
	}),
);

export const modelHasRolesRelations = relations(modelHasRoles, ({ one }) => ({
	role: one(roles, {
		fields: [modelHasRoles.roleId],
		references: [roles.uuid],
	}),
}));

export const relatedProductsRelations = relations(
	relatedProducts,
	({ one }) => ({
		product_productId: one(products, {
			fields: [relatedProducts.productId],
			references: [products.id],
			relationName: "relatedProducts_productId_products_id",
		}),
		product_relatedProductId: one(products, {
			fields: [relatedProducts.relatedProductId],
			references: [products.id],
			relationName: "relatedProducts_relatedProductId_products_id",
		}),
	}),
);
