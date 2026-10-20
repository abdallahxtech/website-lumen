import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ConsultationBand } from "@/components/ui";
import { Plate } from "@/components/Art";
import { ArticleCard } from "@/components/cards";
import { getArticle, publishedArticles } from "@/content/insights";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return publishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return { ...pageMeta({ title: a.title, description: a.dek, path: `/insights/${a.slug}` }), openGraph: { type: "article", title: a.title, description: a.dek, publishedTime: a.published, modifiedTime: a.updated } };
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    datePublished: a.published,
    dateModified: a.updated,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/insights/${a.slug}`,
  };
  const more = publishedArticles().filter((x) => x.slug !== a.slug);

  return (
    <>
      <article className="on-ivory">
        <header className="wrap pb-14 pt-10">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/insights", label: "Insights" }, { label: a.title }]} />
          <div className="mx-auto mt-16 max-w-4xl text-center">
            <p className="label label-gold">{a.category} · {a.readingMinutes} min read</p>
            <h1 className="display t-1 mt-6">{a.title}</h1>
            <p className="lede muted mx-auto mt-6">{a.dek}</p>
            <p className="label muted mt-8">Updated <time dateTime={a.updated}>{fmt(a.updated)}</time></p>
          </div>
        </header>
        <div className="wrap"><div className="aspect-[21/8] overflow-hidden"><Plate seed={a.slug} tone="teal" kind="arcade" className="h-full w-full" /></div></div>
        <div className="wrap band-tight">
          <div className="prose-lumen mx-auto text-[1.1rem]">
            {a.body.map((b, i) => (
              <section key={i}>
                {b.h && <h2>{b.h}</h2>}
                {b.p.map((p, j) => <p key={j}>{p}</p>)}
              </section>
            ))}
            <aside className="mt-16 border-t border-[var(--rule)] pt-6 text-[.92rem]">
              <p className="label muted">Sources</p>
              <ul className="mt-3 grid gap-2">{a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener" className="underline underline-offset-2">{s.label}</a></li>)}</ul>
              <p className="muted mt-6">This guide is general information, not legal or financial advice. Rules and fees change; confirm the details for your situation with your advisor. <Link href="/contact?type=consultation" className="text-[var(--lumen-teal)] underline underline-offset-2">Speak to an advisor</Link>.</p>
            </aside>
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="on-paper band-tight"><div className="wrap"><h2 className="display t-3">More insights</h2><div className="mt-10 grid gap-10 md:grid-cols-3">{more.map((x, i) => <ArticleCard key={x.slug} a={x} i={i + 1} />)}</div></div></section>
      )}
      <ConsultationBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
