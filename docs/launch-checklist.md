# Launch checklist

## Blocking: must be resolved before launch

| # | Item | Owner | Status |
|---|---|---|---|
| 1 | Confirm RERA ORN 64951 and trade licence 1652672 against the certificates; set `verified: true` in `src/content/site.ts` | COO | Open |
| 2 | Confirm the logo choice (page 4 of the PDF) and approve the simplified favicon | CEO | Open |
| 3 | Confirm team titles, especially "Chief People **Officer**" (supplied as "Office") | CPO | Open |
| 4 | Decide the CRM (Zoho, Odoo, Bitrix24 via webhook, or none) and issue a dedicated API credential | CTO | Open |
| 5 | Set `ADMIN_USER` / `ADMIN_PASSWORD` and choose who can access `/admin/leads` | CTO | Open |
| 6 | Confirm hosting with a persistent volume for leads, and back up the current site | CTO | Open |
| 7 | Legal review of the privacy policy and terms (UAE PDPL) | Legal | Open |
| 8 | Confirm every purchase-cost figure against the current DLD fee schedule; record the reviewer in `fees.ts` | COO | Open |
| 9 | Editorial review of the 8 community guides, 4 service pages and 3 insights | COO / Sales | Open |
| 10 | Add redirects from any existing URLs | CTO | Open |

## Content to supply

- [ ] Licensed hero photograph (≥ 2400 px wide, Dubai architecture, blue hour)
- [ ] Team portraits for all 7 people, in matching style, each confirmed against a name (`Admin.jpeg` and `Zanty.jpeg` were referenced but not received)
- [ ] Short verified biographies, languages and specialisms per person
- [ ] Verified listings with Trakheesi / DLD permit numbers
- [ ] Developer projects Lumen is authorised to market, with official media
- [ ] Public sales email address, if one should be shown
- [ ] Confirmed social media URLs
- [ ] Section photography to replace the illustrations (see content-inventory.md)

## Nice to have after launch

- [ ] Arabic version with professional translation
- [ ] Headless CMS for non-technical editing
- [ ] Analytics (GA4 / GTM) behind a consent banner; the event names are already defined in `src/lib/analytics.ts`
- [ ] Email notification to the sales inbox for each new lead
- [ ] Safari and Firefox runs in CI
- [ ] Scheduling integration for real consultation slots
