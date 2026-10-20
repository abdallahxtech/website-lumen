import type { Metadata } from "next";
import { PageHero, ConsultationBand } from "@/components/ui";
import { CommunityCard } from "@/components/cards";
import { communities } from "@/content/communities";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Dubai communities guide",
  description: "A guide to eight Dubai communities, from Downtown Dubai and Palm Jumeirah to Dubai Hills Estate and Jumeirah Village Circle.",
  path: "/communities",
});

export default function CommunitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Communities"
        title={<>Find where life feels <em>right.</em></>}
        intro="Each Dubai neighbourhood has its own pace, housing stock and character. Start here, then ask us what's available."
        crumbs={[{ href: "/", label: "Home" }, { label: "Communities" }]}
      />
      <section className="on-ivory band-tight">
        <ul className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {communities.map((c, i) => <li key={c.slug}><CommunityCard c={c} index={i} /></li>)}
        </ul>
      </section>
      <ConsultationBand />
    </>
  );
}
