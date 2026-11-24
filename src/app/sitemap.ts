import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { areaHref, areas, site } from "@/lib/site";
import { PRICE_GUIDE_SOURCES, lastModified as updated } from "@/lib/sitemap-dates";

// Logan and Ipswich were rewritten on 22 October 2026. Their last resort.
const LOCATION_CONTENT_UPDATED = "2026-10-22T00:00:00.000+10:00";

// Each location page shows its AutoVal line from this file.
const VALUATION_NOTES = "src/lib/valuation-notes.ts";

function locationUpdated(slug: string): Date {
  if (slug === "logan") {
    return updated(
      ["src/app/locations/logan/page.tsx", "src/lib/areas/logan-suburbs.ts", VALUATION_NOTES],
      LOCATION_CONTENT_UPDATED,
    );
  }
  if (slug === "ipswich") {
    return updated(
      ["src/app/locations/ipswich/page.tsx", "src/lib/areas/ipswich-suburbs.ts", VALUATION_NOTES],
      LOCATION_CONTENT_UPDATED,
    );
  }
  if (slug === "gold-coast" || slug === "sunshine-coast" || slug === "tweed-heads") {
    return updated([
      `src/lib/areas/${slug}.ts`,
      "src/app/locations/[slug]/page.tsx",
      "src/components/AreaPage.tsx",
      VALUATION_NOTES,
    ]);
  }
  return updated(["src/app/locations/[slug]/page.tsx"]);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: updated(["src/app/page.tsx", "src/components/HomeSections.tsx"]), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, lastModified: updated(["src/app/about/page.tsx"]), changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/car-removal-brisbane`, lastModified: updated(["src/app/car-removal-brisbane/page.tsx"]), changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/car-removal-no-keys-no-wheels`, lastModified: updated(["src/app/car-removal-no-keys-no-wheels/page.tsx"]), changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/scrap-car-prices-brisbane`, lastModified: updated(PRICE_GUIDE_SOURCES), changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/locations`, lastModified: updated(["src/app/locations/page.tsx", VALUATION_NOTES]), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/locations/toowong`, lastModified: updated(["src/app/locations/toowong/page.tsx", VALUATION_NOTES]), changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/car-wreckers-gold-coast`, lastModified: updated(["src/app/car-wreckers-gold-coast/page.tsx"]), changeFrequency: "monthly", priority: 0.8 },
    // The service pages share two copy files, so a git date for those files moved every one of these
    // URLs when a single page was edited. Each page carries its own `updated` date, set next to its copy.
    ...pages.map((p) => ({ url: `${site.url}/${p.slug}`, lastModified: new Date(p.updated), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...areas.filter((a) => !a.href).map((a) => ({ url: `${site.url}${areaHref(a)}`, lastModified: locationUpdated(a.slug), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/autoval`, lastModified: updated(["src/app/autoval/page.tsx"]), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contact-us`, lastModified: updated(["src/app/contact-us/page.tsx"]), changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacy`, lastModified: updated(["src/app/privacy/page.tsx"]), changeFrequency: "yearly", priority: 0.2 },
  ];
}
