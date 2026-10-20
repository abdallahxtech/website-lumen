import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, EmptyInventory, ConsultationBand } from "@/components/ui";
import { PropertyCard } from "@/components/cards";
import { publishedProperties } from "@/content/listings";
import { communities } from "@/content/communities";
import { filterProperties, paginate, parsePropertyFilters } from "@/lib/filters";
import { pageMeta } from "@/lib/seo";
import { FilterDrawer } from "@/components/FilterDrawer";

export const metadata: Metadata = pageMeta({
  title: "Properties for sale and rent in Dubai",
  description: "Verified apartments, villas, townhouses and penthouses for sale and rent across Dubai, represented by Lumen Realty.",
  path: "/properties",
});

const TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Office"];

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const f = parsePropertyFilters(sp);
  const all = publishedProperties();
  const results = filterProperties(all, f);
  const { items, pages, total } = paginate(results, f.page);
  const qs = (page: number) => {
    const p = new URLSearchParams(Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" && v ? [[k, v]] : [])));
    p.set("page", String(page));
    return `/properties?${p}`;
  };
  const active = Object.entries(sp).some(([k, v]) => k !== "page" && k !== "sort" && v);

  const filters = (
    <form method="get" action="/properties" className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-[repeat(6,minmax(0,1fr))_auto] lg:items-end" aria-label="Filter properties">
      <div className="field">
        <label htmlFor="f-transaction">For</label>
        <select id="f-transaction" name="transaction" className="input" defaultValue={f.transaction}>
          <option value="">Sale or rent</option><option value="sale">Sale</option><option value="rent">Rent</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-community">Community</label>
        <select id="f-community" name="community" className="input" defaultValue={f.community}>
          <option value="">All communities</option>
          {communities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-type">Category</label>
        <select id="f-type" name="type" className="input" defaultValue={f.type}>
          <option value="">All categories</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-beds">Bedrooms</label>
        <select id="f-beds" name="beds" className="input" defaultValue={f.beds?.toString() ?? ""}>
          <option value="">Any</option><option value="0">Studio</option>
          {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}<option value="5">5+</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="f-max">Max price (AED)</label>
        <input id="f-max" name="maxPrice" inputMode="numeric" className="input num" defaultValue={f.maxPrice ?? ""} placeholder="Any" />
      </div>
      <div className="field">
        <label htmlFor="f-sort">Sort by</label>
        <select id="f-sort" name="sort" className="input" defaultValue={f.sort}>
          <option value="newest">Newest</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option>
        </select>
      </div>
      <div className="flex gap-3 sm:col-span-2 lg:col-span-1">
        <button className="btn btn-primary flex-1" type="submit">Apply</button>
        {active && <Link href="/properties" className="btn btn-outline">Clear</Link>}
      </div>
    </form>
  );

  return (
    <>
      <PageHero
        eyebrow="Properties"
        title={<>Homes for sale <em>and rent.</em></>}
        intro="Every property here is represented by Lumen Realty and advertised under a valid permit. Filter by community, size and budget."
        crumbs={[{ href: "/", label: "Home" }, { label: "Properties" }]}
      />
      <section className="on-ivory band-tight">
        <div className="wrap">
          {all.length > 0 && (
            <>
              <FilterDrawer>{filters}</FilterDrawer>
              <p className="muted mt-10 text-[.95rem]" role="status">
                {total === 0 ? "No properties match these filters." : `${total} ${total === 1 ? "property" : "properties"}`}
              </p>
            </>
          )}
          {all.length === 0 ? (
            <EmptyInventory
              title="Our verified listings are on their way."
              body="We're preparing our current homes for publication on the new site. Share your brief and an advisor will send you properties that match, including those offered privately."
              enquiry="buy"
            />
          ) : (
            <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{items.map((p) => <PropertyCard key={p.slug} p={p} />)}</div>
          )}
          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-16 flex flex-wrap justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={qs(n)} aria-current={n === f.page ? "page" : undefined} className={`num grid h-11 min-w-11 place-items-center border px-3 no-underline ${n === f.page ? "border-[var(--midnight)] bg-[var(--midnight)] text-white" : "border-[var(--rule)]"}`}>{n}</Link>
              ))}
            </nav>
          )}
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}
