# Lumen Realty — website

The lumenrealty.ae website: a Next.js (App Router, TypeScript, Tailwind CSS 4) application with a premium editorial design, structured property and development catalogues, community guides, a purchase-cost calculator and lead capture that is stored on the server before any success message is shown.

## Quick start

```bash
npm ci
cp .env.example .env.local      # then fill in ADMIN_USER / ADMIN_PASSWORD at least
npm run dev                     # http://localhost:3000
```

Requires Node.js 20.9 or later. `better-sqlite3` builds a native module on install; on Windows this needs the "Desktop development with C++" build tools, or run inside Docker/WSL.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server (standalone output in `.next/standalone`) |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm test` | Unit and API tests (Vitest) |
| `npm run test:e2e` | Builds the site twice (real and fixture data) and runs the Playwright suite |
| `npm run icons` | Regenerates favicons, app icons and the social image from `public/brand` |
| `npm run audit:a11y` | axe-core WCAG audit and screenshots against a running server |

## Where things live

| Area | Path |
|---|---|
| Company facts, contact details, licensing | `src/content/site.ts` |
| Team (7 people, exact titles) | `src/content/team.ts` |
| Properties and developments (empty until verified) | `src/content/listings.ts` |
| Community guides | `src/content/communities.ts` |
| Services, process steps, FAQs | `src/content/services.ts` |
| Insights articles | `src/content/insights.ts` |
| Purchase-cost assumptions and sources | `src/content/fees.ts` |
| Design tokens and type | `src/app/globals.css` |
| Logo (drawn from the approved artwork) | `src/components/Logo.tsx`, `public/brand/` |
| Lead API, storage, CRM adapters | `src/app/api/leads/route.ts`, `src/lib/leads/` |
| Lead inbox (Basic auth) | `/admin/leads` |

## Documentation

- [Architecture](docs/architecture.md)
- [Brand system](docs/brand-system.md)
- [Content inventory and media slots](docs/content-inventory.md)
- [Project data sources and research backlog](docs/project-data-sources.md)
- [Lead integration](docs/lead-integration.md)
- [Testing](docs/testing.md)
- [Deployment and rollback](docs/deployment.md)
- [Launch checklist](docs/launch-checklist.md)
