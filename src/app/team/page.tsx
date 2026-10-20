import type { Metadata } from "next";
import { PageHero, ConsultationBand } from "@/components/ui";
import { TeamCard } from "@/components/cards";
import { team } from "@/content/team";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Our team",
  description: "Meet the leadership, sales and client services team at Lumen Realty in Dubai.",
  path: "/team",
});

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title={<>People who know the market. <em>And value the relationship.</em></>}
        intro="A small team by design, so that leadership stays close to every client and advisors have time for each one."
        crumbs={[{ href: "/", label: "Home" }, { label: "Our Team" }]}
      />
      <section className="on-ivory band-tight">
        <div className="wrap">
          <h2 className="label label-gold">Executive leadership</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-4">{team.filter((m) => m.group === "leadership").map((m) => <TeamCard key={m.slug} member={m} />)}</div>
          <h2 className="label label-gold mt-24">Sales and client services</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 md:grid-cols-4">{team.filter((m) => m.group === "sales").map((m) => <TeamCard key={m.slug} member={m} />)}</div>
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}
