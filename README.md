# Referral Monorepo

TypeScript monorepo scaffold for a referral intake flow built with Next.js App Router, a standalone tRPC server, Drizzle ORM, PostgreSQL, Zod, pnpm workspaces, and Turborepo-style root scripts.

## What This Repo Includes

- `apps/web`: Next.js 15 frontend that renders the referral form and talks to the API through a typed tRPC client
- `apps/server`: Express-hosted tRPC server with request validation, environment parsing, and database access
- `packages/schemas`: shared Zod schemas used by both the web app and the server
- `packages/types`: shared type exports derived from the schemas package
- `packages/utils`: shared runtime helpers such as error formatting and the shared tRPC path constant
- `db`: Drizzle schema and generated migrations
- `scripts`: wrapper scripts for `next`, `tsx`, `tsc`, and workspace bootstrapping

## Setup Steps

### 1. Prerequisites

- Node.js 20+
- pnpm 10+
- Docker Desktop or a local PostgreSQL instance

### 2. Install dependencies

From the workspace root:

```bash
pnpm install
```

This repo uses root script wrappers rather than assuming every CLI is available in `node_modules/.bin`, so stick to the workspace scripts instead of invoking tools directly where possible.

### 3. Configure environment variables

Create or update the root `.env` file with at least:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/referrals
NEXT_PUBLIC_TRPC_URL=http://localhost:4000/trpc
PORT=4000
```

Notes:

- `DATABASE_URL` is required by the server and Drizzle
- `PORT` defaults to `4000` in the server, but setting it explicitly keeps local setup obvious
- `NEXT_PUBLIC_TRPC_URL` defaults to `http://localhost:4000/trpc` in the web app, but defining it makes the coupling explicit

### 4. Start PostgreSQL

If you want the included local database:

```bash
docker compose up -d
```

That starts PostgreSQL with:

- user: `postgres`
- password: `postgres`
- database: `referrals`
- port: `5432`

### 5. Generate or apply the database migration

```bash
pnpm db:generate
pnpm db:migrate
```

Drizzle reads its schema from `db/schema.ts` and writes migrations to `db/migrations`.

### 6. Run the apps in development

```bash
pnpm dev
```

Expected local endpoints:

- web: `http://localhost:3000`
- server health check: `http://localhost:4000/health`
- tRPC endpoint: `http://localhost:4000/trpc`

If you want only the API server:

```bash
pnpm --filter @repo/server dev
```

If you want only the web app:

```bash
pnpm --filter @repo/web dev
```

## Useful Commands

```bash
pnpm build
pnpm typecheck
pnpm lint
pnpm db:studio
pnpm --filter @repo/server build
```

## Project Structure

```text
.
|-- apps/
|   |-- server/
|   |   |-- src/
|   |   |   |-- db.ts
|   |   |   |-- env.ts
|   |   |   |-- index.ts
|   |   |   |-- router.ts
|   |   |   |-- routers/
|   |   |   `-- trpc.ts
|   `-- web/
|       |-- src/
|       |   |-- app/
|       |   |-- components/
|       |   `-- lib/
|       `-- package.json
|-- db/
|   |-- migrations/
|   `-- schema.ts
|-- packages/
|   |-- schemas/
|   |-- types/
|   `-- utils/
|-- scripts/
|-- drizzle.config.ts
|-- package.json
|-- pnpm-workspace.yaml
|-- tsconfig.json
`-- turbo.json
```

## Reasoning

### Why a monorepo

The frontend, API, and shared validation layer are tightly coupled. Keeping them in one workspace makes schema changes local and fast:

- a form field can be added once in `packages/schemas`
- the server consumes the same validation contract immediately
- the web app gets updated types without publishing a package

This is simpler than maintaining separate repos for a project where the browser and server are expected to evolve together.

### Why Zod in `packages/schemas`

Validation is the most important shared contract in this project. Putting Zod schemas in a dedicated package means:

- browser validation and server validation stay aligned
- inferred types come from the same source of truth
- API payload drift is much less likely

The `packages/types` package then re-exports derived types so consumers can depend on clean type names without duplicating schema logic.

### Why a standalone tRPC server instead of Next route handlers

The server is intentionally separated from the Next app so API concerns stay isolated:

- the backend can evolve independently from the UI
- Express middleware such as CORS and JSON parsing remains explicit
- deployment can later split web and API targets without restructuring the app layer first

tRPC is used because this project benefits from end-to-end type safety more than it benefits from designing a public REST surface.

### Why Drizzle + PostgreSQL

Drizzle gives typed schema definitions and migrations while staying close to SQL. PostgreSQL is a good default for a business workflow app because it is predictable, well supported, and strong on relational data integrity.

This combination keeps the data layer explicit without introducing a heavy ORM abstraction that hides the actual schema.

### Why the root scripts exist

The root `scripts/` folder wraps tools like `tsc`, `tsx`, `next`, and `turbo` so the workspace can be bootstrapped consistently from the root. In this repo, those wrappers also ensure shared packages are linked and built before app-level commands run.

That matters because the apps depend on generated output from the shared workspace packages.

## Development Notes

- Shared packages are built into `dist/` before app builds and dev startup
- `apps/server/tsconfig.json` uses `NodeNext` because the server runs as native ESM in Node
- the root `tsconfig.json` is intentionally minimal and does not rely on `baseUrl`
- `apps/server/src/env.ts` validates environment variables at startup, so missing database configuration fails early

## Current Local Flow

1. Start PostgreSQL
2. Ensure `.env` contains a valid `DATABASE_URL`
3. Run `pnpm install`
4. Run `pnpm db:migrate`
5. Run `pnpm dev`

That is the shortest path from clone to a working local referral form backed by PostgreSQL.
