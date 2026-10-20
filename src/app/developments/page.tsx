import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, EmptyInventory, ConsultationBand } from "@/components/ui";
import { DevelopmentCard } from "@/components/cards";
import { publishedDevelopments } from "@/content/listings";
import { communities } from "@/content/communities";
import { filterDevelopments, parseDevelopmentFilters } from "@/lib/filters";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "New developments and off-plan projects in Dubai",
  description: "Off-plan and newly completed developments in Dubai, with developer, payment plan and handover details set out clearly.",
  path: "/developments",
});

export default async function DevelopmentsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const f = parseDevelopmentFilters(sp);
  const all = publishedDevelopments();
  const results = filterDevelopments(all, f);
  const developers = [...new Set(all.map((d) => d.developer.name))].sort();
  const years = [...new Set(all.map((d) => d.completionYear).filter(Boolean))].sort() as number[];
  const types = [...new Set(all.flatMap((d) => d.propertyTypes))].sort();
  const featured = results[0];

  return (
    <>
      <PageHero
        eyebrow="New developments"
        title={<>Architecture worth <em>discovering.</em></>}
        intro="Off-plan and newly completed projects, with the developer's record, payment plan and handover timing laid out before you reserve."
        crumbs={[{ href: "/", label: "Home" }, { label: "New Developments" }]}
      />
      <section className="on-ivory band-tight">
        <div className="wrap">
          {all.length === 0 ? (
            <EmptyInventory
              title="Our development catalogue is being prepared."
              body="We only publish projects once we've verified the details and confirmed we're authorised to market them. Tell us what you're looking for and we'll walk you through current launches that fit."
              enquiry="off_plan"
            />
          ) : (
            <>
              <form method="get" action="/developments" aria-label="Filter developments" className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-[repeat(6,minmax(0,1fr))_auto] lg:items-end">
                <div className="field"><label htmlFor="d-q">Search</label><input id="d-q" name="q" className="input" defaultValue={f.q} placeholder="Project or developer" /></div>
                <div className="field"><label htmlFor="d-dev">Developer</label><select id="d-dev" name="developer" className="input" defaultValue={f.developer}><option value="">All developers</option>{developers.map((d) => <option key={d}>{d}</option>)}</select></div>
                <div className="field"><label htmlFor="d-com">Location</label><select id="d-com" name="community" className="input" defaultValue={f.community}><option value="">All locations</option>{communities.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
                <div className="field"><label htmlFor="d-status">Status</label><select id="d-status" name="status" className="input" defaultValue={f.status}><option value="">Any status</option><option>Launching</option><option>Under construction</option><option>Ready</option></select></div>
                <div className="field"><label htmlFor="d-type">Property type</label><select id="d-type" name="type" className="input" defaultValue={f.type}><option value="">All types</option>{types.map((t) => <option key={t}>{t}</option>)}</select></div>
                <div className="field"><label htmlFor="d-year">Completion</label><select id="d-year" name="year" className="input" defaultValue={f.year?.toString() ?? ""}><option value="">Any year</option>{years.map((y) => <option key={y}>{y}</option>)}</select></div>
                <div className="flex gap-3"><button className="btn btn-primary flex-1" type="submit">Apply</button><Link href="/developments" className="btn btn-outline">Clear</Link></div>
                <div className="field sm:col-span-2 lg:col-span-2"><label htmlFor="d-price">Starting price up to (AED)</label><input id="d-price" name="maxPrice" inputMode="numeric" className="input num" defaultValue={f.maxPrice ?? ""} placeholder="Any" /></div>
              </form>
              <p className="muted mt-10 text-[.95rem]" role="status">{results.length === 0 ? "No developments match these filters." : `${results.length} ${results.length === 1 ? "development" : "developments"}`}</p>
              {featured && <div className="mt-10"><DevelopmentCard d={featured} large /></div>}
              <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">{results.slice(1).map((d) => <DevelopmentCard key={d.slug} d={d} />)}</div>
            </>
          )}
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}
