# Content inventory

## Published content and its basis

| Content | Basis | Needs |
|---|---|---|
| Company name, office address, WhatsApp/phone | Supplied by Lumen (Oct 2026) | — |
| RERA ORN 64951, trade licence 1652672 | Company profile header | Confirm against the RERA certificate and trade licence; set `verified: true` in `site.ts` |
| Team names and titles (7) | Supplied list | "Chief People Office" was corrected to "Chief People **Officer**"; please confirm |
| Team biographies, languages, specialisms | Not supplied | Placeholders say "profile will be published soon" |
| Community guides (8) | Long-standing public facts only: landmarks, master developer, housing types | Editorial review; set `editorialReview` in `communities.ts`. No prices, yields or travel times are shown. |
| Service pages and FAQs | General Dubai process (Form F, NOC, Ejari, Oqood, escrow) | Review by COO |
| Insights (3 guides) | Cited sources listed on each page | Review before launch; recheck fees each quarter |
| Cost calculator figures | `fees.ts` with sources | Confirm against the current DLD fee schedule and record the reviewer |
| Properties | **None.** The empty state invites an advisory enquiry | Verified listings with permit numbers |
| Developments | **None.** The empty state invites an off-plan enquiry | Authorisation plus verified details, see project-data-sources.md |
| Testimonials | None | Only with written client consent |
| Social accounts | None listed | Supply confirmed URLs |
| Public email address | None shown | Supply a sales inbox if one should be published |

## Media slots

**Update 20 Oct 2026:** all illustration slots now use real photography. Location photos are free-licence Unsplash images listed in `src/content/media.ts` and on `/credits`. Six team portraits were supplied by Lumen and normalised to the same crop, face size and studio backdrop with `tools/normalise-portraits.py`; Mohamad Sabiq still uses the initials card until his photo arrives. Wael Naeem, Bassel Elhewety and Sharon Paulson portraits were replaced with new photos on 26 Oct 2026. Angélica Troya's portrait still shows a small LPH lapel pin.


| Slot | Where | Spec | Status |
|---|---|---|---|
| Hero | Homepage | Landscape, ≥ 2400×1500 px, Dubai architecture at dusk or blue hour, a quiet left third for text | Set `site.media.hero` in `site.ts`; the illustration is used until then |
| Introduction pair | Homepage §02 | 4:5 portrait and a 1:1 detail | Illustration |
| Services (4) | Homepage, /services | 16:10 and 4:3 | Illustration |
| Communities (8) | Cards and heroes | 3:4 card, wide hero | Illustration |
| Team portraits (7) | /team, profiles | 4:5, same backdrop and lighting for everyone | Monogram placeholders. `Admin.jpeg` and `Zanty.jpeg` were referenced but not received; portraits will be matched to names only on written confirmation |
| Article covers (3) | Insights | 16:10 | Illustration |
| Listing and project media | Detail pages | Official renders with rights to republish | None yet |

Rights rule: use only photography Lumen owns or has licensed. Record the credit in the `credit` field, which the lightbox displays. Never pair a stock image with a specific listing.
