// Records when each file behind a sitemap URL last changed, for builds whose git history is cut short
// (see src/lib/sitemap-dates.ts). Run it from a full clone after page content changes:
//
//   npm run sitemap:dates
//
// It rewrites src/lib/sitemap-dates.json. Commit the result.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import sitemap from "../src/app/sitemap";
import { isShallowClone, requestedSourceFiles } from "../src/lib/sitemap-dates";

if (isShallowClone()) {
  console.error("This clone's history is cut short, so the dates would be wrong. Run `git fetch --unshallow` first.");
  process.exit(1);
}

// Building the sitemap asks for every file it depends on.
sitemap();

const dates: Record<string, string> = {};
for (const file of requestedSourceFiles()) {
  const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { encoding: "utf8" }).trim();
  if (iso) dates[file] = iso;
  else console.warn(`No commit found for ${file}. It is left out.`);
}

writeFileSync("src/lib/sitemap-dates.json", `${JSON.stringify(dates, null, 2)}\n`);
console.log(`Recorded ${Object.keys(dates).length} dates in src/lib/sitemap-dates.json`);
