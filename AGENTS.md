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


<!-- headroom:rtk-instructions -->
# RTK (Rust Token Killer) - Token-Optimized Commands

When running shell commands, **always prefix with `rtk`**. This reduces context
usage by 60-90% with zero behavior change. If rtk has no filter for a command,
it passes through unchanged — so it is always safe to use.

## Key Commands
```bash
# Git (59-80% savings)
rtk git status          rtk git diff            rtk git log

# Files & Search (60-75% savings)
rtk ls <path>           rtk read <file>         rtk grep <pattern>
rtk find <pattern>      rtk diff <file>

# Test (90-99% savings) — shows failures only
rtk pytest tests/       rtk cargo test          rtk test <cmd>

# Build & Lint (80-90% savings) — shows errors only
rtk tsc                 rtk lint                rtk cargo build
rtk prettier --check    rtk mypy                rtk ruff check

# Analysis (70-90% savings)
rtk err <cmd>           rtk log <file>          rtk json <file>
rtk summary <cmd>       rtk deps                rtk env

# GitHub (26-87% savings)
rtk gh pr view <n>      rtk gh run list         rtk gh issue list

# Infrastructure (85% savings)
rtk docker ps           rtk kubectl get         rtk docker logs <c>

# Package managers (70-90% savings)
rtk pip list            rtk pnpm install        rtk npm run <script>
```

## Rules
- In command chains, prefix each segment: `rtk git add . && rtk git commit -m "msg"`
- For debugging, use raw command without rtk prefix
- `rtk proxy <cmd>` runs command without filtering but tracks usage
<!-- /headroom:rtk-instructions -->
