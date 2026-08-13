import { pgTable, serial, varchar, integer, timestamp, index, char, text, bigserial, smallint, unique, jsonb, foreignKey, boolean, json, check, uuid, numeric, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const migrations = pgTable("migrations", {
	id: serial().primaryKey().notNull(),
	migration: varchar({ length: 255 }).notNull(),
	batch: integer().notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
	email: varchar({ length: 255 }).primaryKey().notNull(),
	token: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
});

export const sessions = pgTable("sessions", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	userId: char("user_id", { length: 26 }),
	ipAddress: varchar("ip_address", { length: 45 }),
	userAgent: text("user_agent"),
	payload: text().notNull(),
	lastActivity: integer("last_activity").notNull(),
}, (table) => [
	index().using("btree", table.lastActivity.asc().nullsLast().op("int4_ops")),
	index().using("btree", table.userId.asc().nullsLast().op("bpchar_ops")),
]);

export const cache = pgTable("cache", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	value: text().notNull(),
	expiration: integer().notNull(),
});

export const cacheLocks = pgTable("cache_locks", {
	key: varchar({ length: 255 }).primaryKey().notNull(),
	owner: varchar({ length: 255 }).notNull(),
	expiration: integer().notNull(),
});

export const jobs = pgTable("jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	queue: varchar({ length: 255 }).notNull(),
	payload: text().notNull(),
	attempts: smallint().notNull(),
	reservedAt: integer("reserved_at"),
	availableAt: integer("available_at").notNull(),
	createdAt: integer("created_at").notNull(),
}, (table) => [
	index().using("btree", table.queue.asc().nullsLast().op("text_ops")),
]);

export const jobBatches = pgTable("job_batches", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	totalJobs: integer("total_jobs").notNull(),
	pendingJobs: integer("pending_jobs").notNull(),
	failedJobs: integer("failed_jobs").notNull(),
	failedJobIds: text("failed_job_ids").notNull(),
	options: text(),
	cancelledAt: integer("cancelled_at"),
	createdAt: integer("created_at").notNull(),
	finishedAt: integer("finished_at"),
});

export const failedJobs = pgTable("failed_jobs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: varchar({ length: 255 }).notNull(),
	connection: text().notNull(),
	queue: text().notNull(),
	payload: text().notNull(),
	exception: text().notNull(),
	failedAt: timestamp("failed_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => [
	unique("failed_jobs_uuid_unique").on(table.uuid),
]);

export const siteSettings = pgTable("site_settings", {
	id: char({ length: 26 }).primaryKey().notNull(),
	key: varchar({ length: 255 }).notNull(),
	value: jsonb().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("site_settings_key_unique").on(table.key),
]);

export const users = pgTable("users", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	emailVerifiedAt: timestamp("email_verified_at", { mode: 'string' }),
	password: varchar({ length: 255 }).notNull(),
	rememberToken: varchar("remember_token", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	passwordResetAt: timestamp("password_reset_at", { mode: 'string' }),
}, (table) => [
	unique("users_username_unique").on(table.username),
	unique("users_email_unique").on(table.email),
]);

export const blogs = pgTable("blogs", {
	id: char({ length: 26 }).primaryKey().notNull(),
	userId: char("user_id", { length: 26 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	blogCategoryId: char("blog_category_id", { length: 26 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	excerpt: text(),
	content: text().notNull(),
	status: varchar({ length: 255 }).default('draft').notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "blogs_user_id_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.blogCategoryId],
			foreignColumns: [blogCategories.id],
			name: "blogs_blog_category_id_foreign"
		}).onDelete("cascade"),
	unique("blogs_slug_unique").on(table.slug),
]);

export const blogCategories = pgTable("blog_categories", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	orderIndex: integer("order_index").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("blog_categories_slug_unique").on(table.slug),
]);

export const files = pgTable("files", {
	id: char({ length: 26 }).primaryKey().notNull(),
	filePath: varchar("file_path", { length: 255 }).notNull(),
	fileType: varchar("file_type", { length: 255 }),
	fileSize: integer("file_size"),
	disk: varchar({ length: 255 }).default('local').notNull(),
	fileableType: varchar("fileable_type", { length: 255 }).notNull(),
	fileableId: char("fileable_id", { length: 26 }).notNull(),
	role: varchar({ length: 255 }).default('gallery').notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.fileableType.asc().nullsLast().op("text_ops"), table.fileableId.asc().nullsLast().op("text_ops")),
]);

export const areas = pgTable("areas", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	unique("areas_name_unique").on(table.name),
]);

export const pages = pgTable("pages", {
	id: char({ length: 26 }).primaryKey().notNull(),
	title: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	content: text().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	orderIndex: text("order_index").notNull(),
	description: varchar({ length: 255 }),
}, (table) => [
	unique("pages_slug_unique").on(table.slug),
]);

export const banners = pgTable("banners", {
	id: char({ length: 26 }).primaryKey().notNull(),
	title: varchar({ length: 255 }),
	subtitle: varchar({ length: 255 }),
	filePath: varchar("file_path", { length: 255 }),
	clickUrl: varchar("click_url", { length: 255 }),
	ctaText: varchar("cta_text", { length: 255 }),
	textColor: varchar("text_color", { length: 255 }).default('light').notNull(),
	overlay: boolean().default(true).notNull(),
	placement: varchar({ length: 255 }).notNull(),
	orderPosition: integer("order_position").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	bannerableType: varchar("bannerable_type", { length: 255 }),
	bannerableId: char("bannerable_id", { length: 26 }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	fieldSettings: json("field_settings"),
}, (table) => [
	index().using("btree", table.bannerableType.asc().nullsLast().op("text_ops"), table.bannerableId.asc().nullsLast().op("text_ops")),
]);

export const seoMetadata = pgTable("seo_metadata", {
	id: char({ length: 26 }).primaryKey().notNull(),
	seoableType: varchar("seoable_type", { length: 255 }).notNull(),
	seoableId: char("seoable_id", { length: 26 }).notNull(),
	metaTitle: varchar("meta_title", { length: 255 }),
	metaDescription: text("meta_description"),
	metaKeywords: varchar("meta_keywords", { length: 255 }),
	ogImagePath: varchar("og_image_path", { length: 255 }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.seoableType.asc().nullsLast().op("text_ops"), table.seoableId.asc().nullsLast().op("text_ops")),
]);

export const inquiries = pgTable("inquiries", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	whatsappNumber: varchar("whatsapp_number", { length: 255 }).notNull(),
	email: varchar({ length: 255 }),
	subject: varchar({ length: 255 }).notNull(),
	message: text().notNull(),
	status: varchar({ length: 255 }).default('new').notNull(),
	adminNotes: text("admin_notes"),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	check("inquiries_status_check", sql`(status)::text = ANY ((ARRAY['new'::character varying, 'followed_up'::character varying, 'closed'::character varying])::text[])`),
]);

export const categories = pgTable("categories", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	orderIndex: integer("order_index").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	showInMenu: boolean("show_in_menu").default(true).notNull(),
	specTemplate: jsonb("spec_template"),
	description: varchar({ length: 255 }),
}, (table) => [
	unique("categories_slug_unique").on(table.slug),
]);

export const personalAccessTokens = pgTable("personal_access_tokens", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	tokenableType: varchar("tokenable_type", { length: 255 }).notNull(),
	tokenableId: char("tokenable_id", { length: 26 }).notNull(),
	name: text().notNull(),
	token: varchar({ length: 64 }).notNull(),
	abilities: text(),
	lastUsedAt: timestamp("last_used_at", { mode: 'string' }),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	index().using("btree", table.expiresAt.asc().nullsLast().op("timestamp_ops")),
	index().using("btree", table.tokenableType.asc().nullsLast().op("bpchar_ops"), table.tokenableId.asc().nullsLast().op("bpchar_ops")),
	unique("personal_access_tokens_token_unique").on(table.token),
]);

export const menus = pgTable("menus", {
	id: char({ length: 26 }).primaryKey().notNull(),
	location: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("menus_location_unique").on(table.location),
]);

export const menuItems = pgTable("menu_items", {
	id: char({ length: 26 }).primaryKey().notNull(),
	menuId: char("menu_id", { length: 26 }).notNull(),
	parentId: char("parent_id", { length: 26 }),
	type: varchar({ length: 255 }).notNull(),
	referenceId: varchar("reference_id", { length: 255 }),
	label: varchar({ length: 255 }),
	url: varchar({ length: 255 }),
	orderIndex: integer("order_index").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.menuId],
			foreignColumns: [menus.id],
			name: "menu_items_menu_id_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "menu_items_parent_id_foreign"
		}).onDelete("set null"),
]);

export const subCategories = pgTable("sub_categories", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	categoryId: char("category_id", { length: 26 }),
	orderIndex: integer("order_index").default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	showInMenu: boolean("show_in_menu").default(true).notNull(),
	description: varchar({ length: 255 }),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "sub_categories_category_id_foreign"
		}).onDelete("set null"),
	unique("sub_categories_slug_unique").on(table.slug),
]);

export const productColors = pgTable("product_colors", {
	id: char({ length: 26 }).primaryKey().notNull(),
	productId: char("product_id", { length: 26 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	hex: varchar({ length: 255 }).notNull(),
	orderIndex: integer("order_index").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_colors_product_id_foreign"
		}).onDelete("cascade"),
]);

export const roles = pgTable("roles", {
	uuid: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	guardName: varchar("guard_name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	unique("roles_name_guard_name_unique").on(table.name, table.guardName),
]);

export const permissions = pgTable("permissions", {
	uuid: uuid().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	guardName: varchar("guard_name", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	groupName: varchar("group_name", { length: 255 }),
}, (table) => [
	unique("permissions_name_guard_name_unique").on(table.name, table.guardName),
]);

export const products = pgTable("products", {
	id: char({ length: 26 }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	slug: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 255 }),
	description: text(),
	subCategoryId: char("sub_category_id", { length: 26 }).notNull(),
	price: numeric({ precision: 12, scale:  2 }).default('0').notNull(),
	weight: numeric({ precision: 9, scale:  2 }),
	length: numeric({ precision: 9, scale:  2 }),
	width: numeric({ precision: 9, scale:  2 }),
	height: numeric({ precision: 9, scale:  2 }),
	stock: integer().default(0).notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	specValues: jsonb("spec_values"),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	isLineup: boolean("is_lineup").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.subCategoryId],
			foreignColumns: [subCategories.id],
			name: "products_sub_category_id_foreign"
		}).onDelete("cascade"),
	unique("products_slug_unique").on(table.slug),
]);

export const roleHasPermissions = pgTable("role_has_permissions", {
	permissionId: uuid("permission_id").notNull(),
	roleId: uuid("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.uuid],
			name: "role_has_permissions_permission_id_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.uuid],
			name: "role_has_permissions_role_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.permissionId, table.roleId], name: "role_has_permissions_pkey"}),
]);

export const modelHasPermissions = pgTable("model_has_permissions", {
	permissionId: uuid("permission_id").notNull(),
	modelType: varchar("model_type", { length: 255 }).notNull(),
	modelUuid: char("model_uuid", { length: 26 }).notNull(),
}, (table) => [
	index("model_has_permissions_model_id_model_type_index").using("btree", table.modelUuid.asc().nullsLast().op("bpchar_ops"), table.modelType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.uuid],
			name: "model_has_permissions_permission_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.permissionId, table.modelType, table.modelUuid], name: "model_has_permissions_pkey"}),
]);

export const modelHasRoles = pgTable("model_has_roles", {
	roleId: uuid("role_id").notNull(),
	modelType: varchar("model_type", { length: 255 }).notNull(),
	modelUuid: char("model_uuid", { length: 26 }).notNull(),
}, (table) => [
	index("model_has_roles_model_id_model_type_index").using("btree", table.modelUuid.asc().nullsLast().op("bpchar_ops"), table.modelType.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.uuid],
			name: "model_has_roles_role_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.modelType, table.modelUuid], name: "model_has_roles_pkey"}),
]);

export const relatedProducts = pgTable("related_products", {
	productId: char("product_id", { length: 26 }).notNull(),
	relatedProductId: char("related_product_id", { length: 26 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "related_products_product_id_foreign"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.relatedProductId],
			foreignColumns: [products.id],
			name: "related_products_related_product_id_foreign"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.productId, table.relatedProductId], name: "related_products_pkey"}),
	unique("related_products_product_id_related_product_id_unique").on(table.productId, table.relatedProductId),
]);
