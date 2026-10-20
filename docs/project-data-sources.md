# Project data sources

No developments are published. A project appears on the site only when all of the following are true:

1. Lumen is authorised to market it (written confirmation from the developer or an approved channel).
2. Every published fact is taken from an official developer source, with its URL and retrieval date recorded in the record.
3. The starting price has been checked with the developer, and `priceVerifiedOn` is set.
4. Images and brochures have redistribution rights.
5. `marketingAuthorized: true` and `status: "published"` are set.

## Research backlog template

Use this table (or the CMS equivalent) before creating a record. Developers suggested in the brief, for research only and not as claimed partners: Emaar, DAMAC, Sobha Realty, Nakheel, Meraas, Dubai Holding Real Estate, Binghatti, Aldar, Ellington Properties, Select Group, Omniyat, Azizi Developments.

| Project | Developer | Location | Status | Source URL | Retrieved | Image rights | Price verified | Authorised to market | Approved by |
|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | |

## Record fields

The `Development` interface in `src/content/listings.ts` covers every section of the project page (hero, overview, gallery, facts, lifestyle, amenities, unit types, payment plan, floor plans, location, developer, investor notes, downloads, related projects and enquiry actions). Sections with no verified data are not rendered; nothing is filled with defaults.

## Why the catalogue is empty

Developer websites could not be reached from the build environment, and the brief rules out presenting projects as marketed by Lumen without authorisation. The catalogue template, filters and detail pages are built and tested against fixture records (`tests/fixtures/listings.ts`), so the first real project can be published by adding one record.
