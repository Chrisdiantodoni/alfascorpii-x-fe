# Alfascorpii X

TanStack Start (SSR React) + Drizzle ORM + PostgreSQL + Better Auth + Tailwind CSS v4

## Commands

```sh
pnpm dev              # dev server on :3000
pnpm build            # production build
pnpm test             # Vitest (no test files exist yet)
pnpm check            # Biome lint + format
pnpm generate-routes  # regenerate src/routeTree.gen.ts after adding routes
pnpm db:generate      # Drizzle migration generation
pnpm db:migrate       # apply migrations
pnpm db:push          # push schema (dev shortcut)
pnpm db:pull          # reflect DB into src/drizzle/
pnpm db:studio        # launch Drizzle Studio
```

## Architecture

- **Routing**: file-based in `src/routes/`. Add a file, then run `pnpm generate-routes` to update `src/routeTree.gen.ts` (auto-generated, do not edit)
- **Path aliases**: `#/*` and `@/*` both → `./src/*`
- **Database schemas**:
  - `src/db/schema.ts` — app schema (source of truth, manually edited)
  - `src/db/auth-schema.ts` — Better Auth tables (user, session, account, verification)
  - `src/drizzle/schema.ts` — DB reflection from `drizzle-kit pull` (auto-generated, do not edit)
- **DB instance**: `src/db/index.ts` creates a schema-less drizzle instance — `db.select().from(table)`, `db.insert(table).values()` etc. work by passing table references directly; the relational query builder (`db.query.*`) is not available
- **Auth**: Better Auth via Drizzle adapter (`src/lib/auth.ts`)
- **Styling**: Tailwind CSS v4 + CSS custom properties theme (light/dark/auto, `src/styles.css`)
- **Dual schema**: both `src/db/schema.ts` and `src/db/auth-schema.ts` are registered in `drizzle.config.ts` for migrations

## Standards

- TypeScript **strict** + `verbatimModuleSyntax` — use `import type` for type-only imports
- Biome (no ESLint/Prettier): **tabs**, **double quotes**, auto-organize imports on save
- Do not edit generated files: `src/routeTree.gen.ts`, `src/drizzle/schema.ts`
- Files prefixed `demo` in `src/routes/demo/`, `src/hooks/`, `src/components/` are starter examples, safe to delete
- `onlyBuiltDependencies` in package.json restricts pnpm postinstall scripts to `esbuild` and `lightningcss`

## Setup

- Requires PostgreSQL (`DATABASE_URL` in `.env` or `.env.local`, both gitignored)
- Package manager: **pnpm** (`pnpm-lock.yaml` is the source of truth)

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
