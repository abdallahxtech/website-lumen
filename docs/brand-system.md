# Brand system

## Logo

Source: `Lumen_logo_HQ.pdf`, an Adobe Illustrator export with four pages.

| Page | Contents | Status |
|---|---|---|
| 1–2 | Exploration sheets: sunburst, compass and flare variants | Not used |
| 3 | Brand board with a separate solid "sun" mark | Not used, see note |
| 4 | Horizontal lock-up: dashed eight-ray sunburst with one gold ray, "Lumen" in teal, "Realty" in champagne | **Selected**. It matches the October 2026 company profile. |

The vector paths were extracted directly from page 4. No marks were redrawn, and the files are generated from the original artwork:

| File | Use |
|---|---|
| `public/brand/lumen-logo.svg` | Primary, on light backgrounds |
| `public/brand/lumen-logo-reverse.svg` | Ivory wordmark, on dark backgrounds |
| `public/brand/lumen-logo-dark.svg` | Single-colour navy |
| `public/brand/lumen-mark.svg`, `lumen-mark-reverse.svg` | Standalone sunburst |
| `public/brand/app-icon.svg` | Source for the 180/192/512 px icons |
| `public/favicon.svg`, `favicon.ico` (16/32/48) | Simplified sunburst with thicker rays and no dashes, so it stays legible at 16 px |
| `public/og-image.jpg` | 1200×630 social image |

> **Approval needed:** page 3 contains a different, solid "sun" mark. Please confirm page 4 is the final identity, and approve the simplified favicon.

## Colour

| Token | Hex | Role |
|---|---|---|
| `--pearl-sand` | #D1C9B9 | Warm section backgrounds |
| `--champagne` | #BBA682 | Accents on dark surfaces only (rules, labels, totals) |
| `--lumen-teal` | #1C6767 | Primary actions, links |
| `--deep-teal` | #1A4753 | Supporting surfaces; label colour on sand |
| `--midnight` | #1D2F49 | Ink, dark sections |
| `--ivory` | #F7F4EE | Page background |
| `--paper` | #EFEBE3 | Alternate light sections |
| `--gold-text` | #74603C | Champagne darkened to meet WCAG AA as small text on ivory and paper |

Champagne fails contrast as text on light surfaces, so on ivory and paper it is replaced by `--gold-text`, and on sand by deep teal. All pages pass axe-core colour-contrast checks.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display | Cormorant Garamond 300 / 400 italic | Headlines in the voice of a property journal; the italic carries the emphasis |
| Body and UI | Figtree (variable) | Navigation, forms, running text |
| Labels | Lexend Exa 300/400, uppercase, +0.26em tracking | Echoes the extended geometry of the wordmark |

Lexend Exa is a third family, used only for small labels because it ties the interface to the logo. Scale: `t-hero`, `t-1` … `t-4` in `globals.css`.

## Motion

One orchestrated moment: on load, the hero eyebrow fades in, the two headline lines rise in sequence, then the text, actions and search panel follow. The animation is transform-only, so the headline paints immediately (better LCP) and causes no layout shift. Elsewhere motion is limited to slow image zoom on hover and underline transitions. `prefers-reduced-motion` turns all of it off.

## Imagery

Until licensed photography arrives, every image slot uses a branded architectural line illustration (`src/components/Art.tsx`). These are deliberately drawn rather than photographic, so they never imply a real listing. See content-inventory.md for the media slots to fill.
