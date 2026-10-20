import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, ConsultationBand } from "@/components/ui";
import { Plate } from "@/components/Art";
import { Mark } from "@/components/Logo";
import { TeamCard } from "@/components/cards";
import { ArrowRight } from "@/components/Icons";
import { site, officeAddressLines } from "@/content/site";
import { team } from "@/content/team";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About Lumen Realty",
  description: "Lumen Realty is a Dubai real estate brokerage for buying, selling, leasing and off-plan investment, built around clarity and personal accountability.",
  path: "/about",
});

const pillars = [
  ["Selective excellence", "We take on clients we can serve well and properties we can stand behind."],
  ["Trust & integrity", "Advice is honest even when it's inconvenient, and costs are written down at the start."],
  ["Accountability", "Every client has one named advisor who owns the outcome."],
  ["Shared success", "Our growth depends on our clients' outcomes and the people they refer to us."],
  ["Continuous development", "Our team keeps learning the market, the regulations and the craft of advising."],
  ["Mentorship & coaching", "Experienced colleagues coach newer advisors, so standards stay consistent."],
  ["Performance measurement", "We review our work against clear standards, and act on what we find."],
  ["Professional growth", "We invest in our people's careers, because clients benefit from advisors who stay."],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Lumen"
        title={<>Real estate guided by <em>clarity.</em></>}
        intro="Lumen means light. We chose the name because the best property decisions are made when everything is visible: the price, the costs, the risks and the alternatives."
        crumbs={[{ href: "/", label: "Home" }, { label: "About Lumen" }]}
      />
      <section className="on-ivory band">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="aspect-[4/5] overflow-hidden"><Plate seed="about-arcade" tone="navy" kind="arcade" className="h-full w-full" /></div>
          <div className="min-w-0">
            <p className="label label-gold">Who we are</p>
            <h2 className="display t-2 mt-6">A Dubai brokerage built on <em>personal attention.</em></h2>
            <div className="prose-lumen muted mt-8 text-[1.08rem]">
              <p>Lumen Realty helps people buy, sell and lease property in Dubai, and advises investors on new developments. We work from our office on Sheikh Zayed Road.</p>
              <p>We keep our client list deliberately focused. That lets our advisors spend time understanding what each client actually needs, and give advice that holds up long after the transaction.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="on-midnight dark band">
        <div className="wrap">
          <p className="label label-gold">How we work</p>
          <h2 className="display t-2 mt-6 max-w-[18ch]">Eight principles behind <em>every deal.</em></h2>
          <ul className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map(([t, b]) => (
              <li key={t} className="border-t border-[var(--rule-dark)] pt-6">
                <Mark variant="reverse" className="h-6 w-6" />
                <h3 className="display t-4 mt-5 text-white">{t}</h3>
                <p className="muted mt-3 text-[.95rem]">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ivory band">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="label label-gold">Leadership</p><h2 className="display t-2 mt-5">The people behind Lumen.</h2></div>
            <Link href="/team" className="link-line text-[var(--lumen-teal)]">Meet the full team <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4">{team.filter((m) => m.group === "leadership").map((m) => <TeamCard key={m.slug} member={m} />)}</div>
        </div>
      </section>

      <section className="on-paper band-tight">
        <div className="wrap grid gap-10 md:grid-cols-3">
          <div><p className="label muted">RERA office registration</p><p className="display num mt-2 text-[1.8rem]">ORN {site.licensing.reraOrn.value}</p></div>
          <div><p className="label muted">Dubai trade licence</p><p className="display num mt-2 text-[1.8rem]">{site.licensing.tradeLicence.value}</p></div>
          <div><p className="label muted">Office</p><address className="mt-2 not-italic">{officeAddressLines.map((l) => <span key={l} className="block">{l}</span>)}</address></div>
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}
