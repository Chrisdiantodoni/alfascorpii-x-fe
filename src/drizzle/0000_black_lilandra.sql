CREATE TABLE "areas" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "auth_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "banners" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255),
	"subtitle" varchar(255),
	"file_path" varchar(255),
	"click_url" varchar(255),
	"cta_text" varchar(255),
	"text_color" varchar(255) DEFAULT 'light' NOT NULL,
	"overlay" boolean DEFAULT true NOT NULL,
	"placement" varchar(255) NOT NULL,
	"order_position" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"bannerable_type" varchar(255),
	"bannerable_id" char(26),
	"deleted_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	"field_settings" json
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" char(26) NOT NULL,
	"title" varchar(255) NOT NULL,
	"blog_category_id" char(26) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"status" varchar(255) DEFAULT 'draft' NOT NULL,
	"deleted_at" timestamp,
	"published_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expiration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache_locks" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"owner" varchar(255) NOT NULL,
	"expiration" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	"show_in_menu" boolean DEFAULT true NOT NULL,
	"spec_template" jsonb,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "failed_jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"uuid" varchar(255) NOT NULL,
	"connection" text NOT NULL,
	"queue" text NOT NULL,
	"payload" text NOT NULL,
	"exception" text NOT NULL,
	"failed_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "failed_jobs_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"file_path" varchar(255) NOT NULL,
	"file_type" varchar(255),
	"file_size" integer,
	"disk" varchar(255) DEFAULT 'local' NOT NULL,
	"fileable_type" varchar(255) NOT NULL,
	"fileable_id" char(26) NOT NULL,
	"role" varchar(255) DEFAULT 'gallery' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"whatsapp_number" varchar(255) NOT NULL,
	"email" varchar(255),
	"subject" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"status" varchar(255) DEFAULT 'new' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "inquiries_status_check" CHECK ((status)::text = ANY ((ARRAY['new'::character varying, 'followed_up'::character varying, 'closed'::character varying])::text[]))
);
--> statement-breakpoint
CREATE TABLE "job_batches" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"total_jobs" integer NOT NULL,
	"pending_jobs" integer NOT NULL,
	"failed_jobs" integer NOT NULL,
	"failed_job_ids" text NOT NULL,
	"options" text,
	"cancelled_at" integer,
	"created_at" integer NOT NULL,
	"finished_at" integer
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"queue" varchar(255) NOT NULL,
	"payload" text NOT NULL,
	"attempts" smallint NOT NULL,
	"reserved_at" integer,
	"available_at" integer NOT NULL,
	"created_at" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"menu_id" bigint NOT NULL,
	"parent_id" bigint,
	"type" varchar(255) NOT NULL,
	"reference_id" varchar(255),
	"label" varchar(255),
	"url" varchar(255),
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"location" varchar(255) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "menus_location_unique" UNIQUE("location")
);
--> statement-breakpoint
CREATE TABLE "migrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"migration" varchar(255) NOT NULL,
	"batch" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "model_has_permissions" (
	"permission_id" uuid NOT NULL,
	"model_type" varchar(255) NOT NULL,
	"model_uuid" char(26) NOT NULL,
	CONSTRAINT "model_has_permissions_pkey" PRIMARY KEY("permission_id","model_type","model_uuid")
);
--> statement-breakpoint
CREATE TABLE "model_has_roles" (
	"role_id" uuid NOT NULL,
	"model_type" varchar(255) NOT NULL,
	"model_uuid" char(26) NOT NULL,
	CONSTRAINT "model_has_roles_pkey" PRIMARY KEY("role_id","model_type","model_uuid")
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"deleted_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"order_index" text NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"guard_name" varchar(255) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"group_name" varchar(255),
	CONSTRAINT "permissions_name_guard_name_unique" UNIQUE("name","guard_name")
);
--> statement-breakpoint
CREATE TABLE "personal_access_tokens" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"tokenable_type" varchar(255) NOT NULL,
	"tokenable_id" bigint NOT NULL,
	"name" text NOT NULL,
	"token" varchar(64) NOT NULL,
	"abilities" text,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "personal_access_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "product_colors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"product_id" char(26) NOT NULL,
	"name" varchar(255) NOT NULL,
	"hex" varchar(255) NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"code" varchar(255),
	"description" text,
	"sub_category_id" char(26) NOT NULL,
	"price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"weight" numeric(9, 2),
	"length" numeric(9, 2),
	"width" numeric(9, 2),
	"height" numeric(9, 2),
	"stock" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"spec_values" jsonb,
	"deleted_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "related_products" (
	"product_id" char(26) NOT NULL,
	"related_product_id" char(26) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "related_products_pkey" PRIMARY KEY("product_id","related_product_id"),
	CONSTRAINT "related_products_product_id_related_product_id_unique" UNIQUE("product_id","related_product_id")
);
--> statement-breakpoint
CREATE TABLE "role_has_permissions" (
	"permission_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "role_has_permissions_pkey" PRIMARY KEY("permission_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"uuid" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"guard_name" varchar(255) NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "roles_name_guard_name_unique" UNIQUE("name","guard_name")
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"seoable_type" varchar(255) NOT NULL,
	"seoable_id" char(26) NOT NULL,
	"meta_title" varchar(255),
	"meta_description" text,
	"meta_keywords" varchar(255),
	"og_image_path" varchar(255),
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" char(26),
	"ip_address" varchar(45),
	"user_agent" text,
	"payload" text NOT NULL,
	"last_activity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "sub_categories" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"category_id" char(26),
	"order_index" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp,
	"updated_at" timestamp,
	"show_in_menu" boolean DEFAULT true NOT NULL,
	CONSTRAINT "sub_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp,
	"password" varchar(255) NOT NULL,
	"remember_token" varchar(100),
	"created_at" timestamp,
	"updated_at" timestamp,
	"password_reset_at" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_blog_category_id_blog_categories_id_fk" FOREIGN KEY ("blog_category_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_blog_category_id_foreign" FOREIGN KEY ("blog_category_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menu_id_foreign" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parent_id_foreign" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_items"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_permissions" ADD CONSTRAINT "model_has_permissions_permission_id_permissions_uuid_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "model_has_roles" ADD CONSTRAINT "model_has_roles_role_id_roles_uuid_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_colors" ADD CONSTRAINT "product_colors_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_colors" ADD CONSTRAINT "product_colors_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sub_category_id_sub_categories_id_fk" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_sub_category_id_foreign" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_products" ADD CONSTRAINT "related_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_products" ADD CONSTRAINT "related_products_related_product_id_products_id_fk" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_products" ADD CONSTRAINT "related_products_product_id_foreign" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "related_products" ADD CONSTRAINT "related_products_related_product_id_foreign" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_permission_id_foreign" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_role_id_foreign" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_permission_id_permissions_uuid_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_has_permissions" ADD CONSTRAINT "role_has_permissions_role_id_roles_uuid_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_category_id_foreign" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "auth_account" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "auth_session" USING btree ("user_id" text_ops);--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "auth_verification" USING btree ("identifier" text_ops);--> statement-breakpoint
CREATE INDEX "banners_bannerable_type_bannerable_id_index" ON "banners" USING btree ("bannerable_type" text_ops,"bannerable_id" text_ops);--> statement-breakpoint
CREATE INDEX "files_fileable_type_fileable_id_index" ON "files" USING btree ("fileable_type" text_ops,"fileable_id" text_ops);--> statement-breakpoint
CREATE INDEX "jobs_queue_index" ON "jobs" USING btree ("queue" text_ops);--> statement-breakpoint
CREATE INDEX "model_has_permissions_model_id_model_type_index" ON "model_has_permissions" USING btree ("model_uuid" bpchar_ops,"model_type" text_ops);--> statement-breakpoint
CREATE INDEX "model_has_roles_model_id_model_type_index" ON "model_has_roles" USING btree ("model_uuid" bpchar_ops,"model_type" text_ops);--> statement-breakpoint
CREATE INDEX "personal_access_tokens_expires_at_index" ON "personal_access_tokens" USING btree ("expires_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" ON "personal_access_tokens" USING btree ("tokenable_type" int8_ops,"tokenable_id" int8_ops);--> statement-breakpoint
CREATE INDEX "seo_metadata_seoable_type_seoable_id_index" ON "seo_metadata" USING btree ("seoable_type" text_ops,"seoable_id" text_ops);--> statement-breakpoint
CREATE INDEX "sessions_last_activity_index" ON "sessions" USING btree ("last_activity" int4_ops);--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("user_id" bpchar_ops);