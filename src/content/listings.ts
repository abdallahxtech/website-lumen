/**
 * Structured inventory records. These arrays are the single source for every
 * listing page, filter and sitemap entry.
 *
 * They are intentionally empty: no verified Lumen inventory or authorized
 * developer marketing material has been supplied. Add records only when the
 * listing (and, for developments, Lumen's marketing authorization) is confirmed.
 * Only records with `status: "published"` appear on the site.
 *
 * The CMS adapter (docs/architecture.md → Content) replaces these arrays
 * without changing any page code.
 */

export type PublishStatus = "draft" | "in_review" | "published";
export type Transaction = "sale" | "rent";

export interface MediaItem {
  src: string;
  alt: string;
  credit?: string;
  kind?: "exterior" | "interior" | "amenity" | "view" | "plan" | "location";
}

export interface Property {
  reference: string; // Lumen reference, e.g. LR-S-0001
  permitNumber?: string; // DLD / Trakheesi advertising permit
  slug: string;
  title: string;
  description: string[];
  transaction: Transaction;
  propertyType: "Apartment" | "Villa" | "Townhouse" | "Penthouse" | "Office" | "Plot";
  community: string; // community slug
  subcommunity?: string;
  bedrooms: number; // 0 = studio
  bathrooms: number;
  areaSqft: number;
  priceAed: number; // sale price, or annual rent when transaction = rent
  furnishing?: "Furnished" | "Unfurnished" | "Partly furnished";
  amenities: string[];
  availability: "Available" | "Under offer" | "Sold" | "Let";
  development?: string; // development slug
  agent?: string; // team slug
  images: MediaItem[];
  floorPlans?: MediaItem[];
  brochureUrl?: string;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStage {
  label: string;
  percent: number;
  milestone: string;
}

export interface Development {
  slug: string;
  name: string;
  developer: { name: string; website?: string; description?: string };
  emirate: string;
  community: string; // community slug
  propertyTypes: string[];
  bedrooms: string;
  areaRange?: string;
  startingPriceAed?: number;
  priceVerifiedOn?: string;
  handover?: string; // e.g. "Q4 2028"
  completionYear?: number;
  projectStatus: "Launching" | "Under construction" | "Ready";
  ownership: "Freehold" | "Leasehold";
  officialReference?: string;
  overview: string[];
  lifestyle?: string;
  amenities: string[]; // verified only
  unitTypes: { type: string; bedrooms: string; area: string; fromAed?: number; availability: string }[];
  paymentPlan?: PaymentStage[];
  gallery: MediaItem[];
  floorPlans?: MediaItem[];
  downloads?: { label: string; url: string }[];
  location?: { lat: number; lng: number; landmarks: string[] };
  investorNotes?: string[];
  sourceUrl: string;
  retrievedOn: string;
  marketingAuthorized: boolean;
  status: PublishStatus;
}

export const properties: Property[] = [];
export const developments: Development[] = [];

/** Test fixtures are loaded only when LUMEN_FIXTURES=1 (never set this in production). */
export const usingFixtures = process.env.LUMEN_FIXTURES === "1";

function source() {
  if (!usingFixtures) return { properties, developments };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const f = require("../../tests/fixtures/listings") as typeof import("../../tests/fixtures/listings");
  return { properties: f.fixtureProperties, developments: f.fixtureDevelopments };
}

export const publishedProperties = () => source().properties.filter((p) => p.status === "published");
export const publishedDevelopments = () =>
  source().developments.filter((d) => d.status === "published" && d.marketingAuthorized);
export const getProperty = (slug: string) => publishedProperties().find((p) => p.slug === slug);
export const getDevelopment = (slug: string) => publishedDevelopments().find((d) => d.slug === slug);
