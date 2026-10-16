import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { areaHref, areas, site } from "@/lib/site";

// Generated at build time, so this is the date of the last deploy.
const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/car-removal-brisbane`, changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/locations`, changeFrequency: "monthly", priority: 0.7 },
    ...pages.map((p) => ({ url: `${site.url}/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...areas.filter((a) => !a.href).map((a) => ({ url: `${site.url}${areaHref(a)}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/contact-us`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
  return entries.map((e) => ({ ...e, lastModified }));
}
