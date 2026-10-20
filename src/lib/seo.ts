import type { Metadata } from "next";
import { site } from "@/content/site";

export function pageMeta({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, images: [{ url: image ?? "/og-image.jpg", width: 1200, height: 630 }] },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon-512.png`,
        image: `${site.url}/og-image.jpg`,
        telephone: site.phone.e164,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${site.office.unit}, ${site.office.building}, ${site.office.street}`,
          addressLocality: site.office.city,
          addressRegion: "Dubai",
          addressCountry: site.office.countryCode,
        },
        areaServed: { "@type": "City", name: "Dubai" },
        ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}
