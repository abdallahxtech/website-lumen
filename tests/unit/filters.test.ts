import { describe, expect, it } from "vitest";
import { filterDevelopments, filterProperties, paginate, parseDevelopmentFilters, parsePropertyFilters } from "@/lib/filters";
import { fixtureDevelopments, fixtureProperties } from "../fixtures/listings";

const published = fixtureProperties.filter((p) => p.status === "published");

describe("property filters", () => {
  it("parses and ignores invalid values", () => {
    const f = parsePropertyFilters({ transaction: "lease", beds: "abc", sort: "weird", page: "-3" });
    expect(f.transaction).toBe("");
    expect(f.beds).toBeUndefined();
    expect(f.sort).toBe("newest");
    expect(f.page).toBe(1);
  });
  it("filters by transaction, community, beds and price", () => {
    expect(filterProperties(published, parsePropertyFilters({ transaction: "rent" })).map((p) => p.reference)).toEqual(["TEST-R-0001"]);
    expect(filterProperties(published, parsePropertyFilters({ community: "dubai-hills-estate" }))).toHaveLength(1);
    expect(filterProperties(published, parsePropertyFilters({ beds: "0" }))[0].bedrooms).toBe(0);
    expect(filterProperties(published, parsePropertyFilters({ maxPrice: "3000000", transaction: "sale" })).map((p) => p.reference)).toEqual(["TEST-S-0001"]);
  });
  it("sorts by price", () => {
    const r = filterProperties(published, parsePropertyFilters({ sort: "price-desc" }));
    expect(r.map((p) => p.priceAed)).toEqual([...r.map((p) => p.priceAed)].sort((a, b) => b - a));
  });
  it("paginates", () => {
    const p = paginate([1, 2, 3, 4, 5], 2, 2);
    expect(p.items).toEqual([3, 4]);
    expect(p.pages).toBe(3);
  });
});

describe("development filters", () => {
  it("filters by developer, year and starting price", () => {
    const all = fixtureDevelopments;
    expect(filterDevelopments(all, parseDevelopmentFilters({ developer: "Sample Developer" }))).toHaveLength(1);
    expect(filterDevelopments(all, parseDevelopmentFilters({ year: "2028" }))).toHaveLength(1);
    expect(filterDevelopments(all, parseDevelopmentFilters({ maxPrice: "1000000" }))).toHaveLength(0);
  });
});
