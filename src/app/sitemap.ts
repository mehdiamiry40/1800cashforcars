import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { areaHref, areas, site } from "@/lib/site";

// Last content commit, used only when git history is not available in the build.
const FALLBACK_UPDATED = "2026-10-18T11:03:00.000Z";

function updated(file: string): Date {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // Shallow or git-less builds keep a stable date instead of the deploy time.
  }
  return new Date(FALLBACK_UPDATED);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const contentUpdated = updated("src/lib/content.ts");
  const locationUpdated = updated("src/app/locations/[slug]/page.tsx");
  return [
    { url: site.url, lastModified: updated("src/app/page.tsx"), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/car-removal-brisbane`, lastModified: updated("src/app/car-removal-brisbane/page.tsx"), changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/scrap-car-prices-brisbane`, lastModified: updated("src/app/scrap-car-prices-brisbane/page.tsx"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/locations`, lastModified: updated("src/app/locations/page.tsx"), changeFrequency: "monthly", priority: 0.7 },
    ...pages.map((p) => ({ url: `${site.url}/${p.slug}`, lastModified: contentUpdated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...areas.filter((a) => !a.href).map((a) => ({ url: `${site.url}${areaHref(a)}`, lastModified: locationUpdated, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/autoval`, lastModified: updated("src/app/autoval/page.tsx"), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contact-us`, lastModified: updated("src/app/contact-us/page.tsx"), changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacy`, lastModified: updated("src/app/privacy/page.tsx"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
