# Graph Report - alfascorpii-x  (2026-08-06)

## Corpus Check
- 186 files · ~210,855 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1188 nodes · 1805 edges · 107 communities (63 shown, 44 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.62)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f52cd65`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Layout Components
- Database Relations
- External Dependencies
- TanStack Integration
- Dev Dependencies
- Biome Configuration
- TypeScript References
- Package Configuration
- Form Components
- Cart Components
- App Data Relations
- Auth Database Schema
- Architecture Documentation
- Hero and Banner
- Web App Manifest
- Marquee Component
- Theme Toggle
- Demo Table Data
- Opencode Config
- DB Schema Docs
- Project Standards
- Scroll Research
- Graphify Plugin
- Badge Component
- App Logos
- Demo Form Context
- Auth Client Lib
- Test Suite
- Vite Configuration
- DB Instance
- Generated Files
- Path Aliases
- Demo Files
- DB BigInt Serializer
- App DB Schema
- Auth Client Functions
- Logo AI Prompt Engineering
- CIP Deliverable Guide
- BM25
- Workflow
- drizzle/relations.ts
- InquiryForm.tsx
- Routing by Task Type
- Primary Color Meanings
- Core Logo Types
- text-input-field.tsx
- CIP Mockup Prompt Engineering
- category/$slug.tsx
- socials.ts
- Design Principles
- icon/generate.py
- FeaturedCarousel.tsx
- CIP Design Reference
- Icon Design Reference
- Copywriting Formulas
- product/$slug/index.tsx
- Layout Patterns
- Faq.tsx
- _public/index.tsx
- Logo Design Reference
- CIP Design Style Guide
- Skeleton.tsx
- customer.tsx
- Slide Strategies
- logo/generate.py
- files.server.ts
- router.tsx
- Slides Reference
- HTML Slide Template
- types/cms.ts
- CartDrawer.tsx
- server.ts
- files.tsx
- express
- tailwindcss
- slides-create.md
- @tanstack/react-query
- drizzle-orm
- @faker-js/faker
- lucide-react
- marked
- motion
- pg
- @radix-ui/react-dialog
- react
- react-dom
- sonner
- swiper
- @tailwindcss/vite
- @tanstack/match-sorter-utils
- @tanstack/react-devtools
- @tanstack/react-form
- @tanstack/react-form-start
- @tanstack/react-router-devtools
- @tanstack/react-router-ssr-query
- @tanstack/react-start
- @tanstack/react-table
- @tanstack/router-plugin
- @tanstack/zod-adapter
- @tanstack/zod-form-adapter
- ulid
- zod
- zustand
- PageTransition.tsx

## God Nodes (most connected - your core abstractions)
1. `FileRoutesByPath` - 19 edges
2. `MaterialIcon()` - 17 edges
3. `compilerOptions` - 17 edges
4. `scripts` - 15 edges
5. `Design` - 15 edges
6. `cms` - 13 edges
7. `useCartStore` - 13 edges
8. `formatRupiah()` - 12 edges
9. `Banner` - 11 edges
10. `Button()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Drizzle ORM Logo` --conceptually_related_to--> `Drizzle ORM`  [EXTRACTED]
  public/drizzle.svg → AGENTS.md
- `Tailwind Elements Carousel Component` --conceptually_related_to--> `Tailwind CSS v4`  [INFERRED]
  .firecrawl/tw-carousel.md → AGENTS.md
- `bannerQueryOptions()` --calls--> `getBanners`  [EXTRACTED]
  src/queries/cms.ts → src/server/cms.tsx
- `TanStack Start App` --conceptually_related_to--> `TanStack Start Framework`  [EXTRACTED]
  README.md → AGENTS.md
- `File-Based Routing` --conceptually_related_to--> `TanStack Router`  [EXTRACTED]
  AGENTS.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Drag and Scroll Research References** — firecrawl_inertia_scroller, firecrawl_kinetic_scrolling, firecrawl_pointer_events_drag, firecrawl_tw_carousel [INFERRED 0.85]

## Communities (107 total, 44 thin omitted)

### Community 0 - "Layout Components"
Cohesion: 0.16
Nodes (10): DragScrollContainer(), DragScrollContainerProps, listVariants, getProductType(), Product, ProductCard(), ProductCardProps, zoneIcon (+2 more)

### Community 1 - "Database Relations"
Cohesion: 0.13
Nodes (14): banners, blogCategories, blogs, pages, now(), bannerQueryOptions(), blogQueryOptions(), blogDetailSchema (+6 more)

### Community 2 - "External Dependencies"
Cohesion: 0.22
Nodes (9): better-auth, dependencies, better-auth, @tanstack/react-form-start, @tanstack/react-router, @unpic/react, @tanstack/react-form-start, @tanstack/react-router (+1 more)

### Community 3 - "TanStack Integration"
Cohesion: 0.06
Nodes (40): Route, Route, Route, Route, Route, Route, Route, Route (+32 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.05
Nodes (43): @biomejs/biome, cross-env, dotenv, drizzle-dbml-generator, drizzle-kit, jsdom, devDependencies, @biomejs/biome (+35 more)

### Community 5 - "Biome Configuration"
Cohesion: 0.07
Nodes (28): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+20 more)

### Community 6 - "TypeScript References"
Cohesion: 0.08
Nodes (24): DOM, DOM.Iterable, ES2022, **/*.ts, **/*.tsx, vite/client, compilerOptions, allowImportingTsExtensions (+16 more)

### Community 7 - "Package Configuration"
Cohesion: 0.08
Nodes (24): author, imports, name, pnpm, onlyBuiltDependencies, private, scripts, build (+16 more)

### Community 8 - "Form Components"
Cohesion: 0.25
Nodes (7): ButtonAsAnchor, ButtonAsButton, ButtonAsLink, ButtonBaseProps, ButtonProps, motionFx, variants

### Community 9 - "Cart Components"
Cohesion: 0.06
Nodes (37): Footer(), footerRoute(), getLabel(), OverlayNav(), OverlayNavProps, staggerItem, staggerList, Topbar() (+29 more)

### Community 10 - "App Data Relations"
Cohesion: 0.13
Nodes (14): blogCategoriesRelations, blogsRelations, categoriesRelations, menuItemsRelations, menusRelations, modelHasPermissionsRelations, modelHasRolesRelations, permissionsRelations (+6 more)

### Community 11 - "Auth Database Schema"
Cohesion: 0.25
Nodes (10): account, accountRelations, session, sessionRelations, user, userRelations, verification, db (+2 more)

### Community 12 - "Architecture Documentation"
Cohesion: 0.18
Nodes (11): Better Auth, Drizzle ORM, File-Based Routing, PostgreSQL Database, Tailwind CSS v4, TanStack Start Framework, Tailwind Elements Carousel Component, Drizzle ORM Logo (+3 more)

### Community 13 - "Hero and Banner"
Cohesion: 0.17
Nodes (11): ctaVariantStyles, EmptyStateDashboard(), EmptyStateProps, PageHeader(), PageHeaderProps, sizeStyles, WishlistButton(), WishlistButtonProps (+3 more)

### Community 14 - "Web App Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 15 - "Marquee Component"
Cohesion: 0.27
Nodes (7): PARTNERS, MarkdownPreview(), MarkdownPreviewProps, Marquee(), MarqueeProps, ClassValue, cn()

### Community 16 - "Theme Toggle"
Cohesion: 0.06
Nodes (42): BM25, detect_domain(), get_cip_brief(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection (+34 more)

### Community 17 - "Demo Table Data"
Cohesion: 0.50
Nodes (3): makeData(), newPerson(), Person

### Community 18 - "Opencode Config"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 19 - "DB Schema Docs"
Cohesion: 0.67
Nodes (3): Auth Schema (src/db/auth-schema.ts), App Database Schema (src/db/schema.ts), Drizzle Schema Reflection (src/drizzle/schema.ts)

### Community 20 - "Project Standards"
Cohesion: 0.67
Nodes (3): Biome Linter and Formatter, TypeScript Strict Mode with verbatimModuleSyntax, Vitest Testing Framework

### Community 21 - "Scroll Research"
Cohesion: 0.67
Nodes (3): Inertia Scroller (CSS Drag Scroll Pattern), JavaScript Kinetic Scrolling with Physics, Pointer Events Drag Interactions

### Community 26 - "Auth Client Lib"
Cohesion: 0.40
Nodes (5): Route, UserOverview(), UserProfile(), useUserSession(), getWishlist

### Community 34 - "DB BigInt Serializer"
Cohesion: 0.06
Nodes (35): Banner Design (Built-in), Banner: Design Rules, Banner: Quick Size Reference, Banner: Top Art Styles, Banner: Workflow, CIP Design (Built-in), CIP: Generate Brief, CIP: Generate Mockups (+27 more)

### Community 35 - "App DB Schema"
Cohesion: 0.24
Nodes (8): wishlists, wishlistsRelations, products, addWishlist, getWishlistIds, removeWishlist, wishlistSchema, WishlistState

### Community 37 - "Logo AI Prompt Engineering"
Cohesion: 0.08
Nodes (25): Common Pitfalls, Core Prompt Structure, Detailed Brief, Eco/Sustainable, Effective Keywords by Style, Fashion Brand, Healthcare, Industry-Specific Prompts (+17 more)

### Community 38 - "CIP Deliverable Guide"
Cohesion: 0.08
Nodes (24): Apparel, Business Card, Car/Sedan, CIP Deliverable Guide, Core Identity, Digital Assets, Email Signature, Envelope (+16 more)

### Community 39 - "BM25"
Cohesion: 0.11
Nodes (19): BM25, detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+11 more)

### Community 40 - "Workflow"
Cohesion: 0.08
Nodes (23): Art Direction Styles (Reuse from Banner), Color & Contrast, Design Best Practices, HTML Design Rules, HTML Template Structure, Option A: Chrome Headless CLI (Recommended — zero dependencies), Option B: chrome-devtools skill, Option C: Playwright script (+15 more)

### Community 41 - "drizzle/relations.ts"
Cohesion: 0.06
Nodes (36): schema, blogCategoriesRelations, blogsRelations, categoriesRelations, menuItemsRelations, menusRelations, modelHasPermissionsRelations, modelHasRolesRelations (+28 more)

### Community 43 - "Routing by Task Type"
Cohesion: 0.10
Nodes (19): Banner Design Tasks, Brand Identity Tasks, Component Creation, Corporate Identity Program Tasks, Design Routing Guide, Design System Migration, Icon Design Tasks, Implementation Tasks (+11 more)

### Community 44 - "Primary Color Meanings"
Cohesion: 0.11
Nodes (18): Accessibility Considerations, Analogous, Black, Blue, Color Combinations by Industry, Color Harmony Types, Complementary, Green (+10 more)

### Community 45 - "Core Logo Types"
Cohesion: 0.11
Nodes (18): 1. Wordmark (Logotype), 2. Lettermark (Monogram), 3. Pictorial Mark (Brand Mark), 4. Abstract Mark, 5. Mascot, 6. Emblem, 7. Combination Mark, Aesthetic Styles (+10 more)

### Community 46 - "text-input-field.tsx"
Cohesion: 0.15
Nodes (13): SelectInput, SelectInputProps, SelectOption, SelectField(), SelectFieldProps, FieldBase, MultiLineProps, Props (+5 more)

### Community 47 - "CIP Mockup Prompt Engineering"
Cohesion: 0.11
Nodes (17): Apparel (Polo/T-Shirt), Base Prompt Structure, Business Card, CIP Mockup Prompt Engineering, Context Modifiers, Corporate Minimal, Deliverable-Specific Modifiers, Letterhead (+9 more)

### Community 48 - "category/$slug.tsx"
Cohesion: 0.29
Nodes (9): cn(), shimmerStyle, SkeletonBanner(), SkeletonBox(), SkeletonBoxProps, SkeletonCard(), SkeletonGrid(), SkeletonText() (+1 more)

### Community 50 - "socials.ts"
Cohesion: 0.24
Nodes (14): cache, createErrorResponse(), extractTikTokDetail(), fetchHtml(), fetchWithTimeout(), formatCompactNumber(), getSocialPostData, parseNumber() (+6 more)

### Community 51 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 52 - "icon/generate.py"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 53 - "FeaturedCarousel.tsx"
Cohesion: 0.05
Nodes (63): AnimatedRoute(), AnimatedRouteProps, pageTransition, routeVariants, PageBanner(), PageBannerProps, FeaturedCarousel(), FeaturedCarouselProps (+55 more)

### Community 54 - "CIP Design Reference"
Cohesion: 0.13
Nodes (14): CIP Brief (Start Here), CIP Design Reference, Commands, Deliverable Categories, Design Styles, Detailed References, Generate Mockups, HTML Presentation Features (+6 more)

### Community 55 - "Icon Design Reference"
Cohesion: 0.13
Nodes (14): Available Styles, CLI Options, Commands, Generate Batch Variations, Generate Multiple Sizes, Generate Single Icon, Icon Categories, Icon Design Reference (+6 more)

### Community 56 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 57 - "product/$slug/index.tsx"
Cohesion: 0.17
Nodes (9): ProductDetailSkeleton(), iconMap, MaterialIcon(), MaterialIconProps, GalleryImage, ImageLightboxProps, prepareImages(), ProductGallery() (+1 more)

### Community 58 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 59 - "Faq.tsx"
Cohesion: 0.33
Nodes (4): FaqProps, listVariants, StaggerList(), StaggerListProps

### Community 60 - "_public/index.tsx"
Cohesion: 0.14
Nodes (16): categories, menuItems, siteSettings, subCategories, categorySlugQueryOptions(), subCategoryQueryOptions(), getCategories, getProductByCategory (+8 more)

### Community 61 - "Logo Design Reference"
Cohesion: 0.15
Nodes (12): Available Styles, Color Psychology, Commands, Design Brief (Start Here), Detailed References, Generate Logo, Industry Defaults, Logo Design Reference (+4 more)

### Community 62 - "CIP Design Style Guide"
Cohesion: 0.18
Nodes (10): Bold Dynamic, CIP Design Style Guide, Classic Traditional, Color Psychology, Corporate Minimal, Fresh Modern, Luxury Premium, Modern Tech (+2 more)

### Community 63 - "Skeleton.tsx"
Cohesion: 0.19
Nodes (10): defaultValues, InquiryForm(), MessageGallery(), SocialItem, SocialsGridProps, Section(), SectionProps, SectionLabel() (+2 more)

### Community 64 - "customer.tsx"
Cohesion: 0.33
Nodes (5): inquiries, Inquiry, inquiryFormSchema, InquiryFormValues, inquirySchema

### Community 65 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 66 - "logo/generate.py"
Cohesion: 0.29
Nodes (9): enhance_prompt(), generate_batch(), generate_logo(), load_env(), main(), Enhance the logo prompt with style and industry modifiers, Generate a logo using Gemini models with image generation      Args:         asp, Generate multiple logo variants with different styles (+1 more)

### Community 67 - "files.server.ts"
Cohesion: 0.14
Nodes (14): batchFiles(), batchFilesWithUrls(), FileableType, FileItem, FileItemWithUrl, files, storageUrl(), mapBanner() (+6 more)

### Community 68 - "router.tsx"
Cohesion: 0.28
Nodes (6): getContext(), getRouter(), Register, @tanstack/react-router, Register, routeTree

### Community 69 - "Slides Reference"
Cohesion: 0.29
Nodes (6): Key Features, Knowledge Base, Slides Reference, Usage, When to Use, Workflow

### Community 70 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 71 - "types/cms.ts"
Cohesion: 0.44
Nodes (6): BlogCard(), BlogCardProps, Image(), BlogDetail(), Blog, formatDate()

### Community 72 - "CartDrawer.tsx"
Cohesion: 0.47
Nodes (5): CartDrawer(), itemIcon(), ProductThumb(), ProductThumbProps, rupiah()

### Community 74 - "files.tsx"
Cohesion: 0.14
Nodes (11): SearchBar(), SearchBarProps, BaseProps, Props, TextAreaProps, TextInput, TextInputProps, authClient (+3 more)

## Knowledge Gaps
- **563 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `$schema`, `enabled`, `clientKind` (+558 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `External Dependencies` to `Package Configuration`, `InquiryForm.tsx`, `express`, `tailwindcss`, `@tanstack/react-query`, `drizzle-orm`, `@faker-js/faker`, `lucide-react`, `marked`, `motion`, `pg`, `@radix-ui/react-dialog`, `react`, `react-dom`, `sonner`, `swiper`, `@tailwindcss/vite`, `@tanstack/match-sorter-utils`, `@tanstack/react-devtools`, `@tanstack/react-form`, `@tanstack/react-form-start`, `@tanstack/react-router-devtools`, `@tanstack/react-router-ssr-query`, `@tanstack/react-start`, `@tanstack/react-table`, `@tanstack/router-plugin`, `@tanstack/zod-adapter`, `@tanstack/zod-form-adapter`, `ulid`, `zod`, `zustand`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Configuration`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `ContactSettings` connect `Cart Components` to `_public/index.tsx`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `$schema` to the rest of the system?**
  _563 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Database Relations` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `TanStack Integration` be split into smaller, more focused modules?**
  _Cohesion score 0.0627177700348432 - nodes in this community are weakly interconnected._
- **Should `Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._