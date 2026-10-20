# Testing

All results below were produced on 20 October 2026, in the build environment, against a local production build (`next build` + `next start`).

## Automated suites

| Suite | Command | Result |
|---|---|---|
| ESLint | `npm run lint` | 0 errors, 0 warnings |
| TypeScript | `npm run typecheck` | Pass |
| Unit and API (Vitest) | `npm test` | **19 / 19 passed** |
| End-to-end (Playwright, Chromium 141) | `npm run test:e2e` | **17 / 17 passed** |
| Accessibility (axe-core 4.10, WCAG 2.0/2.1/2.2 A+AA) | `npm run audit:a11y` | **0 violations** on 9 pages |

### Unit and API coverage
- Cost calculator: trustee threshold, VAT, mortgage add-ons, LTV cap at 80 %, separation of official fees and estimates.
- Filters: parsing of bad input, transaction/community/bedroom/price filters, sorting, pagination, development filters.
- Lead API: valid submission is stored before success; missing consent (422); invalid phone (422); malformed JSON (400); duplicate idempotency key returns the original lead; honeypot and too-fast submissions are dropped without storing (202); rate limit returns 429 on the 6th attempt; CRM 503 and CRM timeout are recorded as `crm_failed` with the lead kept; successful webhook stores the CRM reference and sends an HMAC signature.

### End-to-end coverage
- All 19 public routes return 200, with exactly one `h1`, a title and a canonical link, and no console errors.
- No horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440 and 1920 px on four representative pages.
- Hero copy, WhatsApp number, RERA ORN, licence number and office address are correct.
- All seven team members appear with their exact titles.
- The mobile menu opens, focuses its first link, traps Tab, closes on Escape and returns focus.
- The contact form shows field errors and sends nothing when invalid.
- **Hero search → advisory request → stored lead → visible in `/admin/leads` with its context.**
- A double-clicked submit creates exactly one lead.
- `/admin/leads` returns 401 without credentials.
- The calculator recalculates for a mortgage.
- Sitemap, robots, manifest, favicons and the OG image are served, and RealEstateAgent JSON-LD is present.
- Unknown URLs return the branded 404.
- With fixtures: filters work against records, filtered URLs are shareable, property and development detail sections render, and unpublished or unauthorised records return 404.

## Lighthouse (homepage, local server)

| Profile | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 66* | 0.8 s | 0 | 0 ms |
| Mobile (simulated slow 4G, 4× CPU) | 86–95 across runs | 100 | 100 | 66* | 2.8–3.8 s | 0 | 50 ms |

\* The SEO score is held down only by `is-crawlable`, because indexing is deliberately disabled until launch. With `NEXT_PUBLIC_ALLOW_INDEXING=true` that audit passes.

These are local measurements without a CDN. Repeat them on staging, behind the production CDN and with real hero photography, before quoting figures. Mobile LCP is the headline text waiting for the display font; a CDN with HTTP/2 push or early hints should bring it under 2.5 s.

## Not yet tested

| Item | Reason |
|---|---|
| Safari, Firefox, Edge | Only Chromium is available in the build environment. Run `npx playwright install` locally and add WebKit and Firefox projects to `playwright.config.ts`. |
| Real CRM | No CRM credentials exist yet; the adapters are tested with mocked HTTP. |
| Expired CRM credentials | Covered by the same failure path (non-2xx → `crm_failed`); test against the real CRM once connected. |
| RTL layout | Arabic is not enabled yet. |
| Brochure downloads | No brochures exist yet. |

Screenshots for desktop, tablet and mobile are in `docs/screenshots/`.
