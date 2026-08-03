ALTER TABLE "auth_account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "auth_verification" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "auth_account" CASCADE;--> statement-breakpoint
DROP TABLE "auth_session" CASCADE;--> statement-breakpoint
DROP TABLE "auth_user" CASCADE;--> statement-breakpoint
DROP TABLE "auth_verification" CASCADE;--> statement-breakpoint
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_blog_category_id_blog_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_menu_id_menus_id_fk";
--> statement-breakpoint
ALTER TABLE "model_has_permissions" DROP CONSTRAINT "model_has_permissions_permission_id_permissions_uuid_fk";
--> statement-breakpoint
ALTER TABLE "model_has_roles" DROP CONSTRAINT "model_has_roles_role_id_roles_uuid_fk";
--> statement-breakpoint
ALTER TABLE "product_colors" DROP CONSTRAINT "product_colors_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_sub_category_id_sub_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "related_products" DROP CONSTRAINT "related_products_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "related_products" DROP CONSTRAINT "related_products_related_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "role_has_permissions" DROP CONSTRAINT "role_has_permissions_permission_id_permissions_uuid_fk";
--> statement-breakpoint
ALTER TABLE "role_has_permissions" DROP CONSTRAINT "role_has_permissions_role_id_roles_uuid_fk";
--> statement-breakpoint
ALTER TABLE "sub_categories" DROP CONSTRAINT "sub_categories_category_id_categories_id_fk";
--> statement-breakpoint
DROP INDEX "personal_access_tokens_tokenable_type_tokenable_id_index";--> statement-breakpoint
ALTER TABLE "banners" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "menu_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "menu_items" ALTER COLUMN "parent_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "pages" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "personal_access_tokens" ALTER COLUMN "tokenable_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "product_colors" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "seo_metadata" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "personal_access_tokens" USING btree ("tokenable_type" bpchar_ops,"tokenable_id" bpchar_ops);