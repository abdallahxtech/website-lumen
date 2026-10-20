import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Terms of use", description: "Terms for using the Lumen Realty website.", path: "/terms" });

/** TEMPLATE — requires legal review before launch. */
export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" crumbs={[{ href: "/", label: "Home" }, { label: "Terms of use" }]} intro="Last updated 20 October 2026. Draft pending legal review." />
      <section className="on-ivory band-tight">
        <div className="wrap prose-lumen">
          <h2>Information on this site</h2>
          <p>We take care to keep property details, prices and guides accurate, but they can change without notice and do not form part of any offer or contract. Always confirm details with your advisor before making a decision.</p>
          <h2>Not financial or legal advice</h2>
          <p>Guides and calculators on this site are general information. Fees and regulations change; seek advice specific to your circumstances before you buy, sell or invest.</p>
          <h2>Listings and advertising</h2>
          <p>Properties are advertised under the relevant Dubai Land Department permits. Images may include renders or illustrations, which are labelled where relevant.</p>
          <h2>Intellectual property</h2>
          <p>The {site.name} name, logo and site content belong to {site.name} or its licensors and may not be reused without permission.</p>
          <h2>Governing law</h2>
          <p>These terms are governed by the laws of the Emirate of Dubai and the federal laws of the United Arab Emirates.</p>
        </div>
      </section>
    </>
  );
}
