import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui";
import { Gallery } from "@/components/Gallery";
import { Plate } from "@/components/Art";
import { LeadForm } from "@/components/LeadForm";
import { DevelopmentCard } from "@/components/cards";
import { ArrowUpRight, WhatsApp } from "@/components/Icons";
import { getDevelopment, publishedDevelopments } from "@/content/listings";
import { getCommunity } from "@/content/communities";
import { formatAed } from "@/lib/calc";
import { pageMeta } from "@/lib/seo";
import { waLink, waMessages } from "@/lib/whatsapp";

export function generateStaticParams() {
  return publishedDevelopments().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const d = getDevelopment((await params).slug);
  if (!d) return {};
  return pageMeta({ title: `${d.name} by ${d.developer.name}`, description: d.overview[0], path: `/developments/${d.slug}`, image: d.gallery[0]?.src });
}

export default async function DevelopmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDevelopment((await params).slug);
  if (!d) notFound();
  const community = getCommunity(d.community);
  const cover = d.gallery[0];
  const related = publishedDevelopments().filter((x) => x.slug !== d.slug && (x.community === d.community || x.propertyTypes.some((t) => d.propertyTypes.includes(t)))).slice(0, 3);
  const facts: [string, string | undefined][] = [
    ["Developer", d.developer.name],
    ["Development", d.name],
    ["Emirate", d.emirate],
    ["Community", community?.name ?? d.community],
    ["Property types", d.propertyTypes.join(", ")],
    ["Bedrooms", d.bedrooms],
    ["Sizes", d.areaRange],
    ["Starting price", d.startingPriceAed ? `${formatAed(d.startingPriceAed)}${d.priceVerifiedOn ? ` (checked ${d.priceVerifiedOn})` : ""}` : undefined],
    ["Handover", d.handover],
    ["Ownership", d.ownership],
    ["Status", d.projectStatus],
    ["Project reference", d.officialReference],
  ];
  const ctx = { project: d.name, community: community?.name };
  const enquiryActions: [string, string][] = [["brochure", "Request Project Brochure"], ["availability", "Ask for Availability"], ["off_plan", "Get Payment Plan"], ["viewing", "Schedule a Viewing"]];

  return (
    <>
      {/* A — Cinematic hero */}
      <section className="dark relative isolate overflow-hidden bg-[var(--midnight-deep)] text-[var(--on-dark)]">
        <div className="absolute inset-0 -z-10">
          {cover ? <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" className="hero-media object-cover" /> : <Plate seed={d.slug} tone="navy" className="h-full w-full" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,21,38,.92)] via-[rgba(11,21,38,.35)] to-[rgba(11,21,38,.5)]" />
        </div>
        <div className="wrap flex min-h-[min(86svh,820px)] flex-col justify-between pb-14 pt-10">
          <div className="text-[var(--on-dark-soft)]"><Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/developments", label: "New Developments" }, { label: d.name }]} /></div>
          <div>
            <p className="label label-gold enter">{d.developer.name} · {community?.name ?? d.community}</p>
            <h1 className="display t-hero enter mt-6 text-white" style={{ ["--d" as string]: ".1s" }}>{d.name}</h1>
            <div className="enter mt-10 flex flex-wrap items-end gap-x-12 gap-y-6" style={{ ["--d" as string]: ".25s" }}>
              {d.startingPriceAed && <div><p className="label muted">Starting from</p><p className="display num mt-2 text-[2rem] text-white">{formatAed(d.startingPriceAed)}</p></div>}
              <div><p className="label muted">Status</p><p className="mt-2 text-[1.1rem]">{d.projectStatus}{d.handover ? ` · Handover ${d.handover}` : ""}</p></div>
              <a href="#enquire" className="btn btn-light ml-auto">Enquire about {d.name}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="on-ivory band-tight">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            {/* B — Overview */}
            <h2 className="display t-2">Overview</h2>
            <div className="prose-lumen mt-6">{d.overview.map((p, i) => <p key={i}>{p}</p>)}</div>
            {d.lifestyle && (<><h2 className="display t-3 mt-16">Lifestyle</h2><p className="prose-lumen mt-5">{d.lifestyle}</p></>)}

            {/* C — Gallery */}
            {d.gallery.length > 1 && (<><h2 className="display t-3 mt-16">Gallery</h2><div className="mt-6"><Gallery items={d.gallery} title={d.name} /></div></>)}

            {/* D — Facts */}
            <h2 className="display t-3 mt-16">Project facts</h2>
            <dl className="mt-6 grid border-t border-[var(--rule)] sm:grid-cols-2">
              {facts.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_minmax(0,1fr)] gap-4 border-b border-[var(--rule)] py-4 sm:pr-6"><dt className="label muted pt-1">{k}</dt><dd className="num">{v}</dd></div>
              ))}
            </dl>

            {/* F — Amenities (verified only) */}
            {d.amenities.length > 0 && (<><h2 className="display t-3 mt-16">Amenities</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2">{d.amenities.map((a) => <li key={a} className="border-b border-[var(--rule)] pb-3">{a}</li>)}</ul></>)}

            {/* G — Unit types */}
            {d.unitTypes.length > 0 && (
              <>
                <h2 className="display t-3 mt-16">Unit types</h2>
                <div className="table-scroll mt-6">
                  <table className="num w-full min-w-[520px] border-collapse text-left text-[.95rem]">
                    <thead><tr className="label muted border-b border-[var(--rule)]"><th className="py-3 font-normal">Type</th><th className="py-3 font-normal">Bedrooms</th><th className="py-3 font-normal">Area</th><th className="py-3 font-normal">From</th><th className="py-3 font-normal">Availability</th></tr></thead>
                    <tbody>{d.unitTypes.map((u) => <tr key={u.type} className="border-b border-[var(--rule)]"><td className="py-4">{u.type}</td><td>{u.bedrooms}</td><td>{u.area}</td><td>{u.fromAed ? formatAed(u.fromAed) : "On request"}</td><td>{u.availability}</td></tr>)}</tbody>
                  </table>
                </div>
              </>
            )}

            {/* H — Payment plan */}
            {d.paymentPlan && d.paymentPlan.length > 0 && (
              <>
                <h2 className="display t-3 mt-16">Payment plan</h2>
                <div className="mt-6 flex h-3 overflow-hidden" aria-hidden>{d.paymentPlan.map((s, i) => <span key={s.label} style={{ width: `${s.percent}%`, background: ["var(--champagne)", "var(--lumen-teal)", "var(--midnight)", "var(--deep-teal)"][i % 4] }} />)}</div>
                <ol className="mt-6 grid gap-0">{d.paymentPlan.map((s) => <li key={s.label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-[var(--rule)] py-4"><span className="display num text-[1.8rem] leading-none">{s.percent}%</span><span><strong className="font-semibold">{s.label}</strong><span className="muted block text-[.92rem]">{s.milestone}</span></span></li>)}</ol>
              </>
            )}

            {/* I — Floor plans */}
            {d.floorPlans?.length ? (<><h2 className="display t-3 mt-16">Floor plans</h2><div className="mt-6"><Gallery items={d.floorPlans} title={`${d.name} floor plans`} /></div></>) : null}

            {/* J — Location */}
            {d.location && (
              <>
                <h2 className="display t-3 mt-16">Location</h2>
                {d.location.landmarks.length > 0 && <p className="mt-5">Nearby: {d.location.landmarks.join(", ")}.</p>}
                <a className="link-line mt-5 text-[var(--lumen-teal)]" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${d.location.lat},${d.location.lng}`}>Open in Google Maps <ArrowUpRight className="h-4 w-4" /></a>
              </>
            )}

            {/* K — Developer */}
            <h2 className="display t-3 mt-16">About the developer</h2>
            <p className="mt-5 font-semibold">{d.developer.name}</p>
            {d.developer.description && <p className="prose-lumen muted mt-3">{d.developer.description}</p>}
            {d.developer.website && <a className="link-line mt-4 text-[var(--lumen-teal)]" href={d.developer.website} target="_blank" rel="noopener">Developer website <ArrowUpRight className="h-4 w-4" /></a>}

            {/* L — Investor considerations */}
            <h2 className="display t-3 mt-16">Before you invest</h2>
            <ul className="prose-lumen mt-5 list-disc space-y-2 pl-5">
              {(d.investorNotes ?? []).map((n) => <li key={n}>{n}</li>)}
              <li>Off-plan payments are made in stages and should go into the project&apos;s registered escrow account.</li>
              <li>Handover dates can change, and neither capital growth nor rental income is guaranteed.</li>
              <li>Budget for DLD registration and other purchase costs on top of the price. <Link href="/#intel-title" className="underline underline-offset-2">See the cost calculator.</Link></li>
            </ul>

            {/* M — Downloads */}
            {d.downloads?.length ? (<><h2 className="display t-3 mt-16">Downloads</h2><ul className="mt-5 grid gap-3">{d.downloads.map((x) => <li key={x.url}><a className="link-line text-[var(--lumen-teal)]" href={x.url} target="_blank" rel="noopener">{x.label}</a></li>)}</ul></>) : null}

            <p className="muted mt-16 text-[.82rem]">Project details sourced from <a className="underline" href={d.sourceUrl} target="_blank" rel="noopener">the developer</a>, retrieved {d.retrievedOn}. Availability and prices can change; please confirm with your advisor.</p>
          </div>

          {/* O — Lead generation */}
          <aside id="enquire" className="min-w-0 scroll-mt-28 lg:sticky lg:top-28 lg:self-start" aria-label={`Enquire about ${d.name}`}>
            <a href={waLink(waMessages.development(d.name))} target="_blank" rel="noopener" className="btn btn-outline mb-6 w-full"><WhatsApp className="h-5 w-5" /> Speak to an Advisor on WhatsApp</a>
            <p className="label muted mb-3">I&apos;d like to</p>
            <div className="mb-8 flex flex-wrap gap-2">
              {enquiryActions.map(([t, l]) => <Link key={t} href={`/contact?type=${t}&project=${encodeURIComponent(d.name)}`} className="border border-[var(--rule)] px-3 py-2 text-[.85rem] no-underline hover:border-[var(--lumen-teal)]">{l}</Link>)}
            </div>
            <LeadForm defaultType="availability" lockType showDetails={false} tone="card" heading={`Enquire about ${d.name}`} context={ctx} submitLabel="Send enquiry" whatsappMessage={waMessages.development(d.name)} />
          </aside>
        </div>
      </section>

      {/* N — Related */}
      {related.length > 0 && (<section className="on-paper band-tight"><div className="wrap"><h2 className="display t-3">Related developments</h2><div className="mt-10 grid gap-10 md:grid-cols-3">{related.map((x) => <DevelopmentCard key={x.slug} d={x} />)}</div></div></section>)}
    </>
  );
}
