/**
 * Purchase-cost assumptions for the calculator. All figures live here so they
 * can be reviewed and updated in one place.
 *
 * kind:
 *   "regulated"  – set by the Dubai Land Department or another authority
 *   "commercial" – a market convention that varies by agreement or lender
 *
 * Before launch, confirm each regulated figure against the current DLD fee
 * schedule and record the reviewer below.
 */
export const feeConfig = {
  lastVerified: "2026-10-20",
  reviewedBy: null as string | null, // e.g. "Bassel Elhewety, COO"
  vatRate: 0.05,
  dldTransferRate: 0.04,
  titleDeedFee: 580,
  knowledgeInnovationFees: 20,
  trustee: { threshold: 500_000, below: 2_000, atOrAbove: 4_000 },
  agencyRate: 0.02,
  mortgage: {
    registrationRate: 0.0025,
    registrationAdmin: 290,
    arrangementRate: 0.01,
    valuationFee: 3_000,
    maxLtvPercent: 80,
  },
  goldenVisaThreshold: 2_000_000,
  sources: [
    {
      label: "Property Finder — DLD fees in Dubai (updated 3 July 2026)",
      url: "https://www.propertyfinder.ae/blog/dld-fees-dubai/",
      covers: "Transfer fee, title deed, trustee, mortgage registration and valuation ranges",
    },
    {
      label: "UAE Government portal — Golden Visa",
      url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/golden-visa",
      covers: "AED 2 million minimum investment for the real estate investor route",
    },
    {
      label: "Dubai Land Department — official service fees",
      url: "https://dubailand.gov.ae/",
      covers: "Authoritative fee schedule; confirm before each transfer",
    },
  ],
  exclusions: [
    "Developer NOC fees, usually charged to the seller",
    "Service charges and utility connection deposits",
    "Off-plan registration (Oqood) fees, which differ from ready transfers",
    "Mortgage life and property insurance",
    "Currency conversion and international transfer charges",
  ],
} as const;
