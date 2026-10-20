import type { Development, Property } from "@/content/listings";

/**
 * TEST FIXTURES ONLY. Loaded when LUMEN_FIXTURES=1 so filters and detail
 * templates can be exercised end to end. Names are deliberately generic and
 * every page shows a "Sample data" banner. Never enable in production.
 */
const now = "2026-10-01T00:00:00.000Z";

export const fixtureProperties: Property[] = [
  { reference: "TEST-S-0001", slug: "sample-two-bedroom-marina", title: "Sample two-bedroom apartment", description: ["Test record used to verify the property template."], transaction: "sale", propertyType: "Apartment", community: "dubai-marina", bedrooms: 2, bathrooms: 2, areaSqft: 1250, priceAed: 2_400_000, furnishing: "Unfurnished", amenities: ["Pool", "Gym"], availability: "Available", agent: "mostafa-zanaty", images: [], status: "published", createdAt: "2026-09-20T00:00:00Z", updatedAt: now },
  { reference: "TEST-S-0002", slug: "sample-villa-hills", title: "Sample four-bedroom villa", description: ["Test record used to verify the property template."], transaction: "sale", propertyType: "Villa", community: "dubai-hills-estate", bedrooms: 4, bathrooms: 5, areaSqft: 4100, priceAed: 7_900_000, amenities: ["Garden"], availability: "Available", agent: "mohamad-sabiq", images: [], status: "published", createdAt: "2026-09-25T00:00:00Z", updatedAt: now },
  { reference: "TEST-R-0001", slug: "sample-studio-jvc-rent", title: "Sample studio for rent", description: ["Test record used to verify the property template."], transaction: "rent", propertyType: "Apartment", community: "jumeirah-village-circle", bedrooms: 0, bathrooms: 1, areaSqft: 420, priceAed: 62_000, amenities: [], availability: "Available", images: [], status: "published", createdAt: "2026-09-28T00:00:00Z", updatedAt: now },
  { reference: "TEST-S-0003", slug: "sample-unpublished", title: "Unpublished sample", description: ["Must never appear."], transaction: "sale", propertyType: "Apartment", community: "business-bay", bedrooms: 1, bathrooms: 1, areaSqft: 700, priceAed: 1_300_000, amenities: [], availability: "Available", images: [], status: "draft", createdAt: now, updatedAt: now },
];

export const fixtureDevelopments: Development[] = [
  {
    slug: "sample-creek-residences",
    name: "Sample Creek Residences",
    developer: { name: "Sample Developer" },
    emirate: "Dubai",
    community: "dubai-creek-harbour",
    propertyTypes: ["Apartment"],
    bedrooms: "1–3",
    areaRange: "750–1,900 sq ft",
    startingPriceAed: 1_800_000,
    priceVerifiedOn: "2026-10-01",
    handover: "Q4 2028",
    completionYear: 2028,
    projectStatus: "Under construction",
    ownership: "Freehold",
    overview: ["Test record used to verify the development template."],
    amenities: ["Swimming pool", "Gym"],
    unitTypes: [
      { type: "1 bedroom", bedrooms: "1", area: "750–820 sq ft", fromAed: 1_800_000, availability: "Available" },
      { type: "2 bedroom", bedrooms: "2", area: "1,150–1,300 sq ft", fromAed: 2_700_000, availability: "Limited" },
    ],
    paymentPlan: [
      { label: "Reservation", percent: 10, milestone: "On booking" },
      { label: "Construction", percent: 50, milestone: "During construction" },
      { label: "Handover", percent: 40, milestone: "On completion" },
    ],
    gallery: [],
    location: { lat: 25.205, lng: 55.346, landmarks: ["Dubai Creek"] },
    investorNotes: ["Test note."],
    sourceUrl: "https://example.com",
    retrievedOn: "2026-10-01",
    marketingAuthorized: true,
    status: "published",
  },
  {
    slug: "sample-unauthorized",
    name: "Unauthorized Sample",
    developer: { name: "Other Developer" },
    emirate: "Dubai",
    community: "business-bay",
    propertyTypes: ["Apartment"],
    bedrooms: "1–2",
    projectStatus: "Launching",
    ownership: "Freehold",
    overview: ["Must never appear."],
    amenities: [],
    unitTypes: [],
    gallery: [],
    sourceUrl: "https://example.com",
    retrievedOn: "2026-10-01",
    marketingAuthorized: false,
    status: "published",
  },
];
