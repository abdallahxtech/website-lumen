import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui";
import { Gallery } from "@/components/Gallery";
import { Plate } from "@/components/Art";
import { LeadForm } from "@/components/LeadForm";
import { PropertyCard, Portrait } from "@/components/cards";
import { WhatsApp } from "@/components/Icons";
import { getProperty, publishedProperties } from "@/content/listings";
import { getCommunity } from "@/content/communities";
import { getMember } from "@/content/team";
import { formatAed } from "@/lib/calc";
import { pageMeta } from "@/lib/seo";
import { waLink, waMessages } from "@/lib/whatsapp";
import { site } from "@/content/site";

export function generateStaticParams() {
  return publishedProperties().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProperty((await params).slug);
  if (!p) return {};
  return pageMeta({ title: `${p.title}, ${getCommunity(p.community)?.name ?? ""}`, description: p.description[0], path: `/properties/${p.slug}`, image: p.images[0]?.src });
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProperty((await params).slug);
  if (!p) notFound();
  const community = getCommunity(p.community);
  const agent = p.agent ? getMember(p.agent) : undefined;
  const related = publishedProperties().filter((x) => x.slug !== p.slug && (x.community === p.community || x.propertyType === p.propertyType)).slice(0, 3);
  const specs: [string, string][] = [
    ["Reference", p.reference],
    ...(p.permitNumber ? [["Permit", p.permitNumber] as [string, string]] : []),
    ["Type", p.propertyType],
    ["Bedrooms", p.bedrooms === 0 ? "Studio" : String(p.bedrooms)],
    ["Bathrooms", String(p.bathrooms)],
    ["Size", `${p.areaSqft.toLocaleString("en-US")} sq ft`],
    ...(p.furnishing ? [["Furnishing", p.furnishing] as [string, string]] : []),
    ["Status", p.availability],
  ];
  const ld = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: p.title,
    price: p.priceAed,
    priceCurrency: "AED",
    availability: p.availability === "Available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    seller: { "@id": `${site.url}/#organization` },
    itemOffered: { "@type": p.propertyType === "Apartment" || p.propertyType === "Penthouse" ? "Apartment" : "SingleFamilyResidence", name: p.title, numberOfRooms: p.bedrooms, floorSize: { "@type": "QuantitativeValue", value: p.areaSqft, unitCode: "FTK" } },
  };

  return (
    <>
      <section className="on-ivory">
        <div className="wrap pt-10">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/properties", label: "Properties" }, { label: p.title }]} />
          <div className="mt-10">
            {p.images.length ? <Gallery items={p.images} title={p.title} /> : <div className="aspect-[21/9] overflow-hidden"><Plate seed={p.slug} kind={p.propertyType === "Villa" ? "villa" : "towers"} className="h-full w-full" /></div>}
          </div>
        </div>
      </section>
      <section className="on-ivory band-tight">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p className="label label-gold">{community?.name ?? p.community}{p.subcommunity ? ` · ${p.subcommunity}` : ""}</p>
            <h1 className="display t-2 mt-5">{p.title}</h1>
            <p className="display num mt-6 text-[2rem]">{formatAed(p.priceAed)}{p.transaction === "rent" ? <span className="muted text-[1.1rem]"> per year</span> : null}</p>
            <dl className="mt-10 grid grid-cols-2 border-t border-[var(--rule)] sm:grid-cols-4">
              {specs.map(([k, v]) => (
                <div key={k} className="border-b border-[var(--rule)] py-4 pr-4"><dt className="label muted">{k}</dt><dd className="num mt-2">{v}</dd></div>
              ))}
            </dl>
            <div className="prose-lumen mt-12">{p.description.map((d, i) => <p key={i}>{d}</p>)}</div>
            {p.amenities.length > 0 && (
              <>
                <h2 className="display t-3 mt-14">Features</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">{p.amenities.map((a) => <li key={a} className="border-b border-[var(--rule)] pb-3">{a}</li>)}</ul>
              </>
            )}
            {p.floorPlans?.length ? (<><h2 className="display t-3 mt-14">Floor plan</h2><div className="mt-6"><Gallery items={p.floorPlans} title={`${p.title} floor plan`} /></div></>) : null}
            {community && (
              <p className="mt-14"><Link className="link-line text-[var(--lumen-teal)]" href={`/communities/${community.slug}`}>Living in {community.name}</Link></p>
            )}
          </div>
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label="Enquire about this property">
            {agent && (
              <div className="mb-8 grid grid-cols-[88px_minmax(0,1fr)] items-center gap-5">
                <Portrait member={agent} />
                <div><p className="label muted">Your advisor</p><p className="display mt-1 text-[1.4rem]">{agent.name}</p><p className="muted text-[.9rem]">{agent.title}</p></div>
              </div>
            )}
            <a href={waLink(waMessages.property(p.title, p.reference))} target="_blank" rel="noopener" className="btn btn-outline mb-8 w-full"><WhatsApp className="h-5 w-5" /> Ask on WhatsApp</a>
            <LeadForm defaultType="viewing" lockType showDetails={false} tone="card" heading="Request a viewing" context={{ property: `${p.title} (${p.reference})`, community: community?.name }} submitLabel="Request a viewing" whatsappMessage={waMessages.property(p.title, p.reference)} />
          </aside>
        </div>
      </section>
      {related.length > 0 && (
        <section className="on-paper band-tight"><div className="wrap"><h2 className="display t-3">Related properties</h2><div className="mt-10 grid gap-10 md:grid-cols-3">{related.map((x) => <PropertyCard key={x.slug} p={x} />)}</div></div></section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
