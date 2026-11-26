import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { type DatedPath, pageUpdated, updatedOn } from "@/lib/page-dates";
import { areaHref, areas, site } from "@/lib/site";

// Every lastmod is set by hand, next to the page's copy or in page-dates.ts. None comes from the build,
// the deploy or a git commit, so a date moves only when someone edits that page and says so.
function areaUpdated(path: string): Date {
  if (!(path in pageUpdated)) throw new Error(`${path} has no date in src/lib/page-dates.ts`);
  return updatedOn(path as DatedPath);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: updatedOn("/"), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, lastModified: updatedOn("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/car-removal-brisbane`, lastModified: updatedOn("/car-removal-brisbane"), changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/car-removal-no-keys-no-wheels`, lastModified: updatedOn("/car-removal-no-keys-no-wheels"), changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/scrap-car-prices-brisbane`, lastModified: updatedOn("/scrap-car-prices-brisbane"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/locations`, lastModified: updatedOn("/locations"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/locations/toowong`, lastModified: updatedOn("/locations/toowong"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/car-wreckers-gold-coast`, lastModified: updatedOn("/car-wreckers-gold-coast"), changeFrequency: "monthly", priority: 0.8 },
    // The service pages share two copy files. Each page carries its own `updated` date, set next to its copy.
    ...pages.map((p) => ({ url: `${site.url}/${p.slug}`, lastModified: new Date(p.updated), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...areas.filter((a) => !a.href).map((a) => ({ url: `${site.url}${areaHref(a)}`, lastModified: areaUpdated(areaHref(a)), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/autoval`, lastModified: updatedOn("/autoval"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contact-us`, lastModified: updatedOn("/contact-us"), changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacy`, lastModified: updatedOn("/privacy"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
