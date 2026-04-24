# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build (Vite + copies instrument.server.mjs)
npm run test       # Run all tests with Vitest
npm run test -- path/to/file.test.ts  # Run a single test file
npm run lint       # Lint with Biome
npm run format     # Format with Biome
npm run check      # Lint + format verification (CI)
npm run deploy     # Build and deploy to Cloudflare Workers via Wrangler
```

Add Shadcn components with:
```bash
pnpm dlx shadcn@latest add <component-name>
```

## Architecture

**Tourneez** is a tournament/event management app built on [TanStack Start](https://tanstack.com/start) — a React SSR meta-framework deployed to **Cloudflare Workers**.

### Stack

| Layer | Choice |
|---|---|
| Framework | TanStack Start (React 19, SSR) |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS 4 + Shadcn UI |
| Auth | Better Auth (email/password, stateless by default) |
| Data fetching | TanStack Query + route loaders |
| Error monitoring | Sentry (`@sentry/tanstackstart-react`) |
| Linter/formatter | Biome (tabs, double quotes) |
| Testing | Vitest + Testing Library + jsdom |
| Deployment | Cloudflare Workers (Wrangler) |

### Routing

Routes live in `src/routes/` and are file-based — TanStack Router auto-generates `src/routeTree.gen.ts` (do not edit manually). The root layout is `src/routes/__root.tsx`.

- Use `<Link to="/path">` from `@tanstack/react-router` for client-side navigation
- Data loading before render: define a `loader` on the route and consume with `Route.useLoaderData()`
- API routes: use the `server` property in route definitions (see `src/routes/api/auth/$.ts` for reference)

### Server Functions

Use `createServerFn` from `@tanstack/react-start` to write server-side logic that's callable from client components. Wrap the handler body with a Sentry span so server functions are instrumented:

```tsx
import { createServerFn } from '@tanstack/react-start'
import * as Sentry from '@sentry/tanstackstart-react'

const myFn = createServerFn({ method: 'GET' }).handler(async () => {
  return Sentry.startSpan({ name: 'Describe the operation' }, async () => {
    // server-side logic here
  })
})
```

### Authentication

Better Auth is configured in `src/lib/auth.ts` (server) and `src/lib/auth-client.ts` (client). The API handler is wired at `/api/auth/$`. Access the current session in components via `authClient.useSession()`.

Better Auth runs in stateless mode by default. To persist users, add a database connection in `src/lib/auth.ts` and run `npx @better-auth/cli migrate`.

### Sentry

Error collection is automatic — configured in `src/router.tsx`. The server is instrumented via `instrument.server.mjs` (loaded before the app starts). Always instrument new `createServerFn` handlers with `Sentry.startSpan` as shown above.

### Code Style (Biome)

- **Indentation**: tabs
- **Quotes**: double quotes
- **TypeScript**: strict mode, no unused variables
- **Path aliases**: `@/*` and `#/*` both map to `src/*`
