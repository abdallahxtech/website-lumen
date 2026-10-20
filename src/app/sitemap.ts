import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { communities } from "@/content/communities";
import { services } from "@/content/services";
import { team } from "@/content/team";
import { publishedArticles } from "@/content/insights";
import { publishedDevelopments, publishedProperties } from "@/content/listings";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${site.url}${path}`, lastModified: new Date(), priority });
  return [
    u("/", 1),
    u("/properties", 0.9),
    u("/developments", 0.9),
    u("/communities", 0.8),
    u("/services", 0.8),
    u("/about", 0.6),
    u("/team", 0.6),
    u("/insights", 0.7),
    u("/contact", 0.8),
    u("/privacy-policy", 0.2),
    u("/terms", 0.2),
    u("/credits", 0.1),
    ...services.map((s) => u(`/services/${s.slug}`, 0.8)),
    ...communities.map((c) => u(`/communities/${c.slug}`, 0.7)),
    ...team.map((m) => u(`/team/${m.slug}`, 0.4)),
    ...publishedArticles().map((a) => ({ ...u(`/insights/${a.slug}`, 0.6), lastModified: new Date(a.updated) })),
    ...publishedProperties().map((p) => ({ ...u(`/properties/${p.slug}`, 0.7), lastModified: new Date(p.updatedAt) })),
    ...publishedDevelopments().map((d) => u(`/developments/${d.slug}`, 0.8)),
  ];
}
