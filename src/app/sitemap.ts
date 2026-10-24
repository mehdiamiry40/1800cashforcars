import { execFileSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { pages } from "@/lib/content";
import { areaHref, areas, site } from "@/lib/site";

// Last content commit, used only when git history is not available in the build.
const FALLBACK_UPDATED = "2026-10-18T11:03:00.000Z";

// Logan and Ipswich were rewritten on 22 October 2026. Use that date if git is missing.
const LOCATION_CONTENT_UPDATED = "2026-10-22T00:00:00.000+10:00";

function gitDate(file: string): Date | null {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (iso) return new Date(iso);
  } catch {
    // Shallow or git-less builds keep a stable date instead of the deploy time.
  }
  return null;
}

/** Latest git date across the files that actually feed a URL. */
function updated(files: string[], fallback = FALLBACK_UPDATED): Date {
  let max = 0;
  for (const file of files) {
    const date = gitDate(file);
    if (date) max = Math.max(max, date.getTime());
  }
  return new Date(max || new Date(fallback).getTime());
}

const SERVICE_COPY_FILES = [
  "src/lib/content.ts",
  "src/lib/service-copy.ts",
  "src/lib/copy.ts",
  "src/app/[page]/page.tsx",
];

function locationUpdated(slug: string): Date {
  if (slug === "logan") {
    return updated(
      ["src/app/locations/logan/page.tsx", "src/lib/areas/logan-suburbs.ts"],
      LOCATION_CONTENT_UPDATED,
    );
  }
  if (slug === "ipswich") {
    return updated(
      ["src/app/locations/ipswich/page.tsx", "src/lib/areas/ipswich-suburbs.ts"],
      LOCATION_CONTENT_UPDATED,
    );
  }
  if (slug === "gold-coast" || slug === "sunshine-coast" || slug === "tweed-heads") {
    return updated([
      `src/lib/areas/${slug}.ts`,
      "src/app/locations/[slug]/page.tsx",
      "src/components/AreaPage.tsx",
    ]);
  }
  return updated(["src/app/locations/[slug]/page.tsx"]);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceUpdated = updated(SERVICE_COPY_FILES);
  return [
    { url: site.url, lastModified: updated(["src/app/page.tsx", "src/components/HomeSections.tsx"]), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/about`, lastModified: updated(["src/app/about/page.tsx"]), changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/car-removal-brisbane`, lastModified: updated(["src/app/car-removal-brisbane/page.tsx"]), changeFrequency: "monthly", priority: 0.95 },
    { url: `${site.url}/car-removal-no-keys-no-wheels`, lastModified: updated(["src/app/car-removal-no-keys-no-wheels/page.tsx"]), changeFrequency: "monthly", priority: 0.85 },
    { url: `${site.url}/scrap-car-prices-brisbane`, lastModified: updated(["src/app/scrap-car-prices-brisbane/page.tsx"]), changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/locations`, lastModified: updated(["src/app/locations/page.tsx"]), changeFrequency: "monthly", priority: 0.7 },
    ...pages.map((p) => ({ url: `${site.url}/${p.slug}`, lastModified: serviceUpdated, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...areas.filter((a) => !a.href).map((a) => ({ url: `${site.url}${areaHref(a)}`, lastModified: locationUpdated(a.slug), changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/autoval`, lastModified: updated(["src/app/autoval/page.tsx"]), changeFrequency: "monthly", priority: 0.7 },
    { url: `${site.url}/contact-us`, lastModified: updated(["src/app/contact-us/page.tsx"]), changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/privacy`, lastModified: updated(["src/app/privacy/page.tsx"]), changeFrequency: "yearly", priority: 0.2 },
  ];
}
