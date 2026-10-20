import Link from "next/link";
import { ArrowRight, WhatsApp } from "./Icons";
import { waLink, waMessages } from "@/lib/whatsapp";
import { site } from "@/content/site";

export function SectionHead({
  eyebrow,
  title,
  intro,
  action,
  align = "split",
  as: As = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  action?: React.ReactNode;
  align?: "split" | "stack";
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "split" ? "grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-end lg:gap-20" : "grid max-w-3xl gap-6"}>
      <div className="min-w-0">
        <p className="label label-gold">{eyebrow}</p>
        <As className={`display mt-5 ${As === "h1" ? "t-1" : "t-2"}`}>{title}</As>
      </div>
      {(intro || action) && (
        <div className="grid min-w-0 gap-6">
          {intro && <div className="lede muted">{intro}</div>}
          {action}
        </div>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${site.url}${it.href}` } : {}),
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="label muted">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-3">
            {it.href ? <Link href={it.href} className="no-underline hover:text-[var(--lumen-teal)]">{it.label}</Link> : <span aria-current="page">{it.label}</span>}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="on-ivory border-b border-[var(--rule)]">
      <div className="wrap pb-16 pt-12 lg:pb-24 lg:pt-16">
        <Breadcrumbs items={crumbs} />
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <div className="min-w-0">
            <p className="label label-gold enter">{eyebrow}</p>
            <h1 className="display t-1 enter mt-6" style={{ ["--d" as string]: ".08s" }}>{title}</h1>
          </div>
          {intro && <div className="lede muted enter min-w-0" style={{ ["--d" as string]: ".18s" }}>{intro}</div>}
        </div>
        {children}
      </div>
    </section>
  );
}

/** Honest empty state for inventory that has not been published yet. */
export function EmptyInventory({ title, body, enquiry }: { title: string; body: string; enquiry: string }) {
  return (
    <div className="grid gap-8 border border-[var(--rule)] bg-[var(--paper)] p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-12">
      <div className="min-w-0">
        <p className="display t-3">{title}</p>
        <p className="muted mt-3 max-w-[60ch]">{body}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={`/contact?type=${enquiry}`} className="btn btn-primary">Tell us what you need <ArrowRight /></Link>
        <a href={waLink(waMessages.general)} target="_blank" rel="noopener" className="btn btn-outline"><WhatsApp className="h-5 w-5" /> WhatsApp</a>
      </div>
    </div>
  );
}

export function ConsultationBand() {
  return (
    <section className="on-midnight dark relative overflow-hidden">
      <div className="wrap band grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-end">
        <div className="min-w-0">
          <p className="label label-gold">Private consultation</p>
          <h2 className="display t-1 mt-6">Your next chapter starts with the <em>right conversation.</em></h2>
        </div>
        <div className="grid min-w-0 gap-6">
          <p className="lede muted">Meet an advisor at our Sheikh Zayed Road office or speak by phone. We&apos;ll listen first, then show you what the market really offers.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact?type=consultation" className="btn btn-light">Arrange a Private Consultation <ArrowRight /></Link>
            <a href={waLink(waMessages.general)} target="_blank" rel="noopener" className="btn btn-outline"><WhatsApp className="h-5 w-5" /> {site.whatsapp.display}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
