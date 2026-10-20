import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { media } from "@/content/media";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Photo credits", description: "Credits for the photography used on the Lumen Realty website.", path: "/credits" });

export default function CreditsPage() {
  const rows = Object.entries(media);
  return (
    <>
      <PageHero eyebrow="Credits" title="Photo credits" crumbs={[{ href: "/", label: "Home" }, { label: "Photo credits" }]} intro="Location photography on this site is used under the Unsplash licence. Team portraits are the property of Lumen Realty." />
      <section className="on-ivory band-tight">
        <div className="wrap table-scroll">
          <table className="w-full min-w-[560px] border-collapse text-left text-[.95rem]">
            <thead><tr className="label muted border-b border-[var(--rule)]"><th className="py-3 font-normal">Image</th><th className="py-3 font-normal">Photographer</th><th className="py-3 font-normal">Source</th></tr></thead>
            <tbody>
              {rows.map(([k, m]) => (
                <tr key={k} className="border-b border-[var(--rule)]">
                  <td className="py-3 pr-6">{m.alt}</td>
                  <td className="py-3 pr-6">{m.credit}</td>
                  <td className="py-3"><a href={m.sourceUrl} target="_blank" rel="noopener" className="underline underline-offset-2">Unsplash</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
