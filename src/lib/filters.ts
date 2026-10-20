import type { Development, Property } from "@/content/listings";

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
const num = (v: string) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

export interface PropertyFilters {
  q: string;
  transaction: "" | "sale" | "rent";
  type: string;
  community: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  sort: "newest" | "price-asc" | "price-desc";
  page: number;
}

export function parsePropertyFilters(p: Params): PropertyFilters {
  const t = one(p.transaction);
  const s = one(p.sort);
  return {
    q: one(p.q).trim(),
    transaction: t === "sale" || t === "rent" ? t : "",
    type: one(p.type),
    community: one(p.community),
    minPrice: num(one(p.minPrice)),
    maxPrice: num(one(p.maxPrice)),
    beds: num(one(p.beds)),
    sort: s === "price-asc" || s === "price-desc" ? s : "newest",
    page: Math.max(1, num(one(p.page)) ?? 1),
  };
}

export function filterProperties(list: Property[], f: PropertyFilters) {
  const q = f.q.toLowerCase();
  const out = list.filter(
    (p) =>
      (!f.transaction || p.transaction === f.transaction) &&
      (!f.type || p.propertyType === f.type) &&
      (!f.community || p.community === f.community) &&
      (f.minPrice === undefined || p.priceAed >= f.minPrice) &&
      (f.maxPrice === undefined || p.priceAed <= f.maxPrice) &&
      (f.beds === undefined || (f.beds >= 5 ? p.bedrooms >= 5 : p.bedrooms === f.beds)) &&
      (!q || `${p.title} ${p.reference} ${p.community}`.toLowerCase().includes(q)),
  );
  out.sort((a, b) =>
    f.sort === "price-asc" ? a.priceAed - b.priceAed : f.sort === "price-desc" ? b.priceAed - a.priceAed : b.createdAt.localeCompare(a.createdAt),
  );
  return out;
}

export interface DevelopmentFilters {
  q: string;
  developer: string;
  community: string;
  status: string;
  type: string;
  maxPrice?: number;
  year?: number;
}

export function parseDevelopmentFilters(p: Params): DevelopmentFilters {
  return {
    q: one(p.q).trim(),
    developer: one(p.developer),
    community: one(p.community),
    status: one(p.status),
    type: one(p.type),
    maxPrice: num(one(p.maxPrice)),
    year: num(one(p.year)),
  };
}

export function filterDevelopments(list: Development[], f: DevelopmentFilters) {
  const q = f.q.toLowerCase();
  return list.filter(
    (d) =>
      (!f.developer || d.developer.name === f.developer) &&
      (!f.community || d.community === f.community) &&
      (!f.status || d.projectStatus === f.status) &&
      (!f.type || d.propertyTypes.includes(f.type)) &&
      (f.maxPrice === undefined || (d.startingPriceAed !== undefined && d.startingPriceAed <= f.maxPrice)) &&
      (f.year === undefined || d.completionYear === f.year) &&
      (!q || `${d.name} ${d.developer.name}`.toLowerCase().includes(q)),
  );
}

export const paginate = <T,>(items: T[], page: number, size = 12) => ({
  items: items.slice((page - 1) * size, page * size),
  pages: Math.max(1, Math.ceil(items.length / size)),
  total: items.length,
});
