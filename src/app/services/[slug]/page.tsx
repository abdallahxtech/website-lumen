import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { Plate } from "@/components/Art";
import { LeadForm } from "@/components/LeadForm";
import { ArrowRight } from "@/components/Icons";
import { services, getService } from "@/content/services";
import { publishedArticles } from "@/content/insights";
import { pageMeta } from "@/lib/seo";
import { waMessages } from "@/lib/whatsapp";
import type { ENQUIRY_TYPES } from "@/lib/leads/enquiry";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: `${s.name} in Dubai`, description: s.intro, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const others = services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <PageHero eyebrow={s.name} title={s.headline} intro={s.intro} crumbs={[{ href: "/", label: "Home" }, { href: "/services", label: "Our Services" }, { label: s.name }]}>
        <div className="mt-14 aspect-[21/8] overflow-hidden"><Plate seed={`svc-${s.slug}`} tone={s.plate} kind={s.slug === "buy" ? "villa" : s.slug === "rent" ? "arcade" : "towers"} className="h-full w-full" /></div>
      </PageHero>

      <section className="on-ivory band">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-24">
          <div className="min-w-0">
            <p className="label label-gold">What&apos;s included</p>
            <ul className="mt-6 grid gap-0">{s.includes.map((x) => <li key={x} className="border-t border-[var(--rule)] py-4 last:border-b">{x}</li>)}</ul>
          </div>
          <div className="min-w-0">
            <p className="label label-gold">How it works</p>
            <ol className="mt-6 grid gap-0">
              {s.process.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[56px_minmax(0,1fr)] gap-5 border-t border-[var(--rule)] py-7 last:border-b">
                  <span className="display num text-[2rem] leading-none text-[var(--gold-text)]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="display t-4">{p.title}</h3>
                    <p className="muted mt-2">{p.body}</p>
                    {p.document && <span className="label mt-3 inline-block border border-[var(--rule)] px-2 py-1 text-[.56rem]">{p.document}</span>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="on-paper band">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-24">
          <div className="min-w-0">
            <p className="label label-gold">Questions</p>
            <h2 className="display t-2 mt-5">Frequently asked.</h2>
          </div>
          <div className="min-w-0">
            {s.faqs.map((f) => (
              <details key={f.q} className="group border-t border-[var(--rule)] py-6 last:border-b">
                <summary className="display flex cursor-pointer list-none items-center justify-between gap-6 text-[1.45rem] leading-snug">
                  {f.q}<span aria-hidden className="text-[var(--lumen-teal)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="muted mt-4 max-w-[62ch]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="on-midnight dark band">
        <div className="wrap grid gap-16 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="min-w-0">
            <p className="label label-gold">{s.cta}</p>
            <h2 className="display t-2 mt-6">Let&apos;s begin with a <em>conversation.</em></h2>
            <ul className="mt-12 grid gap-4">
              {others.map((o) => <li key={o.slug}><Link href={`/services/${o.slug}`} className="link-line text-[var(--pearl-sand)]">{o.name} <ArrowRight className="h-4 w-4" /></Link></li>)}
              {publishedArticles().slice(0, 1).map((a) => <li key={a.slug}><Link href={`/insights/${a.slug}`} className="link-line text-[var(--pearl-sand)]">{a.title}</Link></li>)}
            </ul>
          </div>
          <LeadForm defaultType={s.enquiryType as (typeof ENQUIRY_TYPES)[number]} tone="card" submitLabel={s.cta} whatsappMessage={waMessages.general} />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
