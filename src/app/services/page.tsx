import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, ConsultationBand } from "@/components/ui";
import { Plate } from "@/components/Art";
import { ArrowRight } from "@/components/Icons";
import { services } from "@/content/services";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Real estate services in Dubai",
  description: "Buying, selling, leasing and off-plan advisory in Dubai, from Lumen Realty.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title={<>Considered advice for every <em>property decision.</em></>}
        intro="Whichever way you're moving, the same advisor stays with you from the first conversation to the keys."
        crumbs={[{ href: "/", label: "Home" }, { label: "Our Services" }]}
      />
      <section className="on-ivory">
        {services.map((s, i) => (
          <article key={s.slug} className="border-b border-[var(--rule)]">
            <div className={`wrap band-tight grid items-center gap-12 lg:grid-cols-2 lg:gap-24 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div className="aspect-[4/3] overflow-hidden"><Plate seed={`svc-${s.slug}`} tone={s.plate} kind={(["villa", "towers", "arcade", "towers"] as const)[i]} className="h-full w-full" /></div>
              <div className="min-w-0">
                <p className="label label-gold">{s.short}</p>
                <h2 className="display t-2 mt-5">{s.headline}</h2>
                <p className="lede muted mt-6">{s.intro}</p>
                <ul className="mt-8 grid gap-2">{s.includes.slice(0, 3).map((x) => <li key={x} className="border-b border-[var(--rule)] pb-2 text-[.98rem]">{x}</li>)}</ul>
                <Link href={`/services/${s.slug}`} className="link-line mt-8 text-[var(--lumen-teal)]">{s.name} <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <ConsultationBand />
    </>
  );
}
