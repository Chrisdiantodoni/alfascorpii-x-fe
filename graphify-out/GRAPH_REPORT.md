# Graph Report - .  (2026-07-29)

## Corpus Check
- 107 files · ~166,845 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 496 nodes · 706 edges · 37 communities (25 shown, 12 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

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
- Auth Client Functions

## God Nodes (most connected - your core abstractions)
1. `cms` - 21 edges
2. `compilerOptions` - 17 edges
3. `scripts` - 14 edges
4. `MaterialIcon()` - 13 edges
5. `FileRoutesByPath` - 12 edges
6. `useCartStore` - 11 edges
7. `Section()` - 9 edges
8. `Button()` - 8 edges
9. `includes` - 7 edges
10. `DragScrollContainer()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Drizzle ORM Logo` --conceptually_related_to--> `Drizzle ORM`  [EXTRACTED]
  public/drizzle.svg → AGENTS.md
- `Tailwind Elements Carousel Component` --conceptually_related_to--> `Tailwind CSS v4`  [INFERRED]
  .firecrawl/tw-carousel.md → AGENTS.md
- `TanStack Start App` --conceptually_related_to--> `TanStack Start Framework`  [EXTRACTED]
  README.md → AGENTS.md
- `File-Based Routing` --conceptually_related_to--> `TanStack Router`  [EXTRACTED]
  AGENTS.md → README.md
- `Vitest Testing Framework` --conceptually_related_to--> `TypeScript Strict Mode with verbatimModuleSyntax`  [EXTRACTED]
  README.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Drag and Scroll Research References** — firecrawl_inertia_scroller, firecrawl_kinetic_scrolling, firecrawl_pointer_events_drag, firecrawl_tw_carousel [INFERRED 0.85]

## Communities (37 total, 12 thin omitted)

### Community 0 - "Layout Components"
Cohesion: 0.06
Nodes (46): Topbar(), TopbarProps, LineupCarousel(), subNames, zoneIcon, MessageGallery(), PARTNERS, SocialsGrid() (+38 more)

### Community 1 - "Database Relations"
Cohesion: 0.05
Nodes (53): authAccountRelations, authSessionRelations, authUserRelations, blogCategoriesRelations, blogsRelations, categoriesRelations, menuItemsRelations, menusRelations (+45 more)

### Community 2 - "External Dependencies"
Cohesion: 0.04
Nodes (49): better-auth, drizzle-orm, @faker-js/faker, lucide-react, dependencies, better-auth, drizzle-orm, @faker-js/faker (+41 more)

### Community 3 - "TanStack Integration"
Cohesion: 0.06
Nodes (40): getContext(), getRouter(), Register, @tanstack/react-router, Route, Route, Route, Route (+32 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.05
Nodes (37): @biomejs/biome, dotenv, drizzle-kit, jsdom, devDependencies, @biomejs/biome, dotenv, drizzle-kit (+29 more)

### Community 5 - "Biome Configuration"
Cohesion: 0.07
Nodes (28): source, assist, actions, files, ignoreUnknown, includes, formatter, enabled (+20 more)

### Community 6 - "TypeScript References"
Cohesion: 0.08
Nodes (24): DOM, DOM.Iterable, ES2022, **/*.ts, **/*.tsx, vite/client, compilerOptions, allowImportingTsExtensions (+16 more)

### Community 7 - "Package Configuration"
Cohesion: 0.09
Nodes (22): imports, name, pnpm, onlyBuiltDependencies, private, scripts, build, check (+14 more)

### Community 8 - "Form Components"
Cohesion: 0.13
Nodes (13): Button(), ButtonAsAnchor, ButtonAsButton, ButtonAsLink, ButtonBaseProps, ButtonProps, variants, SelectInput() (+5 more)

### Community 9 - "Cart Components"
Cohesion: 0.17
Nodes (10): CartDrawer(), CartDrawerProps, itemIcon(), ProductThumb(), ProductThumbProps, TODO: sesuaikan nama field (thumbnailUrl/image/thumbnail_url) dengan, rupiah(), OverlayNav() (+2 more)

### Community 10 - "App Data Relations"
Cohesion: 0.13
Nodes (14): blogCategoriesRelations, blogsRelations, categoriesRelations, menuItemsRelations, menusRelations, modelHasPermissionsRelations, modelHasRolesRelations, permissionsRelations (+6 more)

### Community 11 - "Auth Database Schema"
Cohesion: 0.28
Nodes (9): account, accountRelations, session, sessionRelations, user, userRelations, verification, db (+1 more)

### Community 12 - "Architecture Documentation"
Cohesion: 0.18
Nodes (11): Better Auth, Drizzle ORM, File-Based Routing, PostgreSQL Database, Tailwind CSS v4, TanStack Start Framework, Tailwind Elements Carousel Component, Drizzle ORM Logo (+3 more)

### Community 13 - "Hero and Banner"
Cohesion: 0.27
Nodes (8): Hero(), BannerCarousel(), BannerCarouselProps, Banner, BannerFieldSettings, BannerSlide(), DEFAULT_FIELDS, posClass()

### Community 14 - "Web App Manifest"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 15 - "Marquee Component"
Cohesion: 0.47
Nodes (4): Marquee(), MarqueeProps, ClassValue, cn()

### Community 16 - "Theme Toggle"
Cohesion: 0.60
Nodes (4): applyThemeMode(), getInitialMode(), ThemeMode, ThemeToggle()

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

## Knowledge Gaps
- **241 isolated node(s):** `$schema`, `.opencode/plugins/graphify.js`, `$schema`, `enabled`, `clientKind` (+236 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `External Dependencies` to `Package Configuration`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package Configuration`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `cms` connect `Layout Components` to `Form Components`, `Cart Components`, `TanStack Integration`, `Hero and Banner`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `$schema`, `.opencode/plugins/graphify.js`, `$schema` to the rest of the system?**
  _241 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.056962025316455694 - nodes in this community are weakly interconnected._
- **Should `Database Relations` be split into smaller, more focused modules?**
  _Cohesion score 0.05064935064935065 - nodes in this community are weakly interconnected._
- **Should `External Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._