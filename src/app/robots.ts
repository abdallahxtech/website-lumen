import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Indexing stays off until NEXT_PUBLIC_ALLOW_INDEXING=true is set on the production deployment. */
export default function robots(): MetadataRoute.Robots {
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allow ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
