# Architecture

## Discovery findings (20 October 2026)

| Item | Finding |
|---|---|
| Existing repository | None supplied. No source tree, package manifest, git history or deployment scripts were available to inspect. |
| Existing site | A single-file HTML prototype produced earlier in this engagement. It was used as the content and feature reference (cost calculator, team list, WhatsApp flows). |
| Supplied assets | `Lumen_logo_HQ.pdf` (4 pages, vector), colour palette image, company-profile header, registered-office snippet. |
| Assets referenced but not supplied | `Admin.jpeg`, `Zanty.jpeg`, `Lumen Realty.html`, `Lumen Realty.md`, all property and project photography. |
| Hosting, DNS, CRM, analytics | Unknown. Nothing has been deployed and no live infrastructure was touched. |

Decision: a new Next.js App Router project in TypeScript with Tailwind CSS 4, since there was no maintainable application to preserve. The code was built on the branch `feature/premium-rebuild`; the initial scaffold commit is the rollback point.

## Stack

- **Next.js 16** (App Router, React 19, server components by default). Output is `standalone`, so it runs on any Node host or in Docker.
- **Tailwind CSS 4** for layout utilities, with design-system classes in `src/app/globals.css` inside `@layer components` so utilities can override them.
- **Fonts** self-hosted with `next/font/local` (no third-party font requests): Cormorant Garamond (display), Figtree (body), Lexend Exa (labels).
- **zod** for server-side validation; **better-sqlite3** for durable lead storage.
- No client-side state library, no CMS SDK, no analytics script.

## Rendering

| Route | Mode |
|---|---|
| `/`, `/about`, `/communities`, `/services`, `/team`, `/insights`, legal pages | Static |
| `/communities/[slug]`, `/services/[slug]`, `/team/[slug]`, `/insights/[slug]` | Static (SSG) |
| `/properties`, `/developments`, `/contact` | Server-rendered per request (they read filter and enquiry query strings) |
| `/properties/[slug]`, `/developments/[slug]` | SSG for published records; anything else returns the branded 404 |
| `/api/leads`, `/admin/leads` | Dynamic, Node runtime |

Client JavaScript is limited to: header/mobile menu, hero search, lead forms, cost calculator, gallery lightbox and the mobile filter toggle. Filters are plain GET forms, so they work without JavaScript and produce shareable URLs.

## Content

Content lives in typed modules under `src/content/`. Every page reads through small accessor functions (`publishedProperties()`, `getCommunity()` …), so swapping the source for a headless CMS changes those functions only.

Publishing rules enforced in code:
- Properties appear only with `status: "published"`.
- Developments appear only with `status: "published"` **and** `marketingAuthorized: true`.
- Test fixtures load only when `LUMEN_FIXTURES=1`, and every page then shows a red "Test mode" banner.

### CMS recommendation

For non-technical editing, connect a hosted headless CMS (Sanity or Payload are good fits for this content model) once hosting is confirmed. Required capabilities and how they map:

| Requirement | Implementation path |
|---|---|
| Draft/published states | `status` field already in the model |
| Approval for externally sourced projects | `marketingAuthorized` + `status: "in_review"` |
| Slug uniqueness, validation | CMS schema rules mirroring the TypeScript interfaces |
| Media upload | CMS asset pipeline, delivered through `next/image` |
| Preview | Next.js draft mode |

This was not installed yet, to avoid adding infrastructure before the hosting decision.

## Leads

See [lead-integration.md](lead-integration.md). Summary: validate → spam checks → **store in SQLite** → forward to CRM (optional) → record result → respond. Success is shown only when a lead ID is returned from storage.

## Security

- Security headers and a strict Content Security Policy in `next.config.ts` (self-only scripts, styles, fonts, images, connections).
- Server-side validation, honeypot, minimum fill time, per-IP rate limit, idempotency keys.
- Admin area behind HTTP Basic auth, disabled entirely when credentials are unset, marked `noindex`.
- No secrets in client bundles: CRM credentials are read only in server modules guarded by `server-only`.
- Indexing is off (`noindex` + `Disallow: /`) until `NEXT_PUBLIC_ALLOW_INDEXING=true`.

## Arabic / RTL readiness

The layout uses logical spacing where it matters, `<html dir>` is set in one place, and all copy lives in content modules. To add Arabic: introduce a `[locale]` segment, load an Arabic-capable face (for example IBM Plex Sans Arabic) alongside the Latin faces, translate content modules with human review, and add `hreflang` alternates. Machine translation must not be published unreviewed.
