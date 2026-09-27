import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { areas, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...pages.map((p) => ({ url: `${site.url}/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.9 })),
    ...areas.map((a) => ({ url: `${site.url}/locations/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/contact-us`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/quote`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
