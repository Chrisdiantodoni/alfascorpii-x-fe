import { relations } from "drizzle-orm";
import * as s from "../drizzle/schema.ts";

export const blogCategoriesRelations = relations(
	s.blogCategories,
	({ many }) => ({
		blogs: many(s.blogs),
	}),
);

export const blogsRelations = relations(s.blogs, ({ one }) => ({
	blogCategory: one(s.blogCategories, {
		fields: [s.blogs.blogCategoryId],
		references: [s.blogCategories.id],
	}),
	user: one(s.users, {
		fields: [s.blogs.userId],
		references: [s.users.id],
	}),
}));

export const usersRelations = relations(s.users, ({ many }) => ({
	blogs: many(s.blogs),
}));

export const menusRelations = relations(s.menus, ({ many }) => ({
	menuItems: many(s.menuItems),
}));

export const menuItemsRelations = relations(s.menuItems, ({ one }) => ({
	menu: one(s.menus, {
		fields: [s.menuItems.menuId],
		references: [s.menus.id],
	}),
	parent: one(s.menuItems, {
		fields: [s.menuItems.parentId],
		references: [s.menuItems.id],
	}),
	page: one(s.pages, {
		fields: [s.menuItems.referenceId],
		references: [s.pages.id],
	}),
	category: one(s.categories, {
		fields: [s.menuItems.referenceId],
		references: [s.categories.id],
	}),
}));

export const modelHasPermissionsRelations = relations(
	s.modelHasPermissions,
	({ one }) => ({
		permission: one(s.permissions, {
			fields: [s.modelHasPermissions.permissionId],
			references: [s.permissions.uuid],
		}),
	}),
);

export const permissionsRelations = relations(s.permissions, ({ many }) => ({
	modelHasPermissions: many(s.modelHasPermissions),
	roleHasPermissions: many(s.roleHasPermissions),
}));

export const roleHasPermissionsRelations = relations(
	s.roleHasPermissions,
	({ one }) => ({
		permission: one(s.permissions, {
			fields: [s.roleHasPermissions.permissionId],
			references: [s.permissions.uuid],
		}),
		role: one(s.roles, {
			fields: [s.roleHasPermissions.roleId],
			references: [s.roles.uuid],
		}),
	}),
);

export const modelHasRolesRelations = relations(s.modelHasRoles, ({ one }) => ({
	role: one(s.roles, {
		fields: [s.modelHasRoles.roleId],
		references: [s.roles.uuid],
	}),
}));

export const rolesRelations = relations(s.roles, ({ many }) => ({
	modelHasRoles: many(s.modelHasRoles),
	roleHasPermissions: many(s.roleHasPermissions),
}));

export const productColorsRelations = relations(s.productColors, ({ one }) => ({
	product: one(s.products, {
		fields: [s.productColors.productId],
		references: [s.products.id],
	}),
}));

export const productsRelations = relations(s.products, ({ one, many }) => ({
	productColors: many(s.productColors),
	subCategory: one(s.subCategories, {
		fields: [s.products.subCategoryId],
		references: [s.subCategories.id],
	}),
}));

export const subCategoriesRelations = relations(
	s.subCategories,
	({ one, many }) => ({
		products: many(s.products),
		category: one(s.categories, {
			fields: [s.subCategories.categoryId],
			references: [s.categories.id],
		}),
	}),
);

export const categoriesRelations = relations(s.categories, ({ many }) => ({
	subCategories: many(s.subCategories),
}));
