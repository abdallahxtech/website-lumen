import { Photo } from "@/components/Photo";
import type { MediaKey } from "@/content/media";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ConsultationBand } from "@/components/ui";
import { LeadForm } from "@/components/LeadForm";
import { CommunityCard, DevelopmentCard, PropertyCard } from "@/components/cards";
import { ArrowUpRight, WhatsApp } from "@/components/Icons";
import { communities, getCommunity } from "@/content/communities";
import { publishedDevelopments, publishedProperties } from "@/content/listings";
import { pageMeta } from "@/lib/seo";
import { waLink, waMessages } from "@/lib/whatsapp";

export function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCommunity((await params).slug);
  if (!c) return {};
  return pageMeta({ title: `Living in ${c.name}`, description: `${c.tagline} A guide to ${c.name}: housing, lifestyle and what to know before you buy or rent.`, path: `/communities/${c.slug}` });
}

export default async function CommunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCommunity((await params).slug);
  if (!c) notFound();
  const index = communities.indexOf(c);
  const props = publishedProperties().filter((p) => p.community === c.slug).slice(0, 3);
  const devs = publishedDevelopments().filter((d) => d.community === c.slug).slice(0, 3);
  const others = communities.filter((x) => x.slug !== c.slug).slice(index % 5, (index % 5) + 3);

  return (
    <>
      <section className="dark relative isolate overflow-hidden bg-[var(--midnight-deep)] text-[var(--on-dark)]">
        <div className="absolute inset-0 -z-10">
          <Photo name={`community-${c.slug}` as MediaKey} sizes="100vw" priority className="hero-media" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,21,38,.92)] via-[rgba(11,21,38,.45)] to-[rgba(11,21,38,.55)]" />
        </div>
        <div className="wrap flex min-h-[min(72svh,700px)] flex-col justify-between pb-14 pt-10">
          <div className="text-[var(--on-dark-soft)]"><Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/communities", label: "Communities" }, { label: c.name }]} /></div>
          <div>
            <p className="label label-gold enter">Community guide · {c.masterDeveloper}</p>
            <h1 className="display t-hero enter mt-6 text-white" style={{ ["--d" as string]: ".1s" }}>{c.name}</h1>
            <p className="lede enter mt-6 text-[var(--on-dark-soft)]" style={{ ["--d" as string]: ".2s" }}>{c.tagline}</p>
          </div>
        </div>
      </section>

      <section className="on-ivory band">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-24">
          <div className="min-w-0">
            <p className="label label-gold">Neighbourhood overview</p>
            <div className="prose-lumen mt-6 text-[1.12rem]">{c.overview.map((p, i) => <p key={i}>{p}</p>)}</div>
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="display t-4">Property types</h2>
                <ul className="mt-4 grid gap-2">{c.propertyTypes.map((t) => <li key={t} className="border-b border-[var(--rule)] pb-2">{t}</li>)}</ul>
              </div>
              <div>
                <h2 className="display t-4">Lifestyle highlights</h2>
                <ul className="mt-4 grid gap-2">{c.highlights.map((t) => <li key={t} className="border-b border-[var(--rule)] pb-2">{t}</li>)}</ul>
              </div>
            </div>
            <a className="link-line mt-12 text-[var(--lumen-teal)]" target="_blank" rel="noopener" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.name + ", Dubai")}`}>View {c.name} on Google Maps <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start" aria-label={`Ask about ${c.name}`}>
            <a href={waLink(waMessages.community(c.name))} target="_blank" rel="noopener" className="btn btn-outline mb-6 w-full"><WhatsApp className="h-5 w-5" /> Ask about {c.name}</a>
            <LeadForm defaultType="buy" tone="card" showDetails={false} heading={`Looking in ${c.name}?`} context={{ community: c.name }} submitLabel="Send my brief" />
          </aside>
        </div>
      </section>

      <section className="on-paper band-tight">
        <div className="wrap">
          <h2 className="display t-3">Available in {c.name}</h2>
          {props.length || devs.length ? (
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {props.map((p) => <PropertyCard key={p.slug} p={p} />)}
              {devs.map((d) => <DevelopmentCard key={d.slug} d={d} />)}
            </div>
          ) : (
            <p className="muted mt-5 max-w-[62ch]">We don&apos;t have verified listings in {c.name} published on the site right now. Our advisors can tell you what is currently on the market, including homes offered privately. <Link href={`/contact?type=buy&community=${c.slug}`} className="text-[var(--lumen-teal)] underline underline-offset-4">Ask an advisor</Link>.</p>
          )}
        </div>
      </section>

      <section className="on-ivory band-tight">
        <div className="wrap">
          <h2 className="display t-3">Explore other communities</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-3">{others.map((o) => <li key={o.slug}><CommunityCard c={o} index={communities.indexOf(o)} /></li>)}</ul>
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}
