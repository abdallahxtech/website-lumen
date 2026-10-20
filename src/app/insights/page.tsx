import type { Metadata } from "next";
import { PageHero, ConsultationBand } from "@/components/ui";
import { ArticleCard } from "@/components/cards";
import { publishedArticles } from "@/content/insights";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Insights: Dubai property guides",
  description: "Plain-English guides to buying costs, off-plan property and the Golden Visa in Dubai.",
  path: "/insights",
});

export default function InsightsPage() {
  const articles = publishedArticles();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={<>Guides for <em>clear decisions.</em></>}
        intro="Plain-English explainers on how property works in Dubai. Each guide lists its sources and the date it was last checked."
        crumbs={[{ href: "/", label: "Home" }, { label: "Insights" }]}
      />
      <section className="on-ivory band-tight">
        <div className="wrap grid gap-x-8 gap-y-16 md:grid-cols-3">{articles.map((a, i) => <ArticleCard key={a.slug} a={a} i={i} />)}</div>
      </section>
      <ConsultationBand />
    </>
  );
}
