import { execFileSync } from "node:child_process";
import recorded from "./sitemap-dates.json";

// When each page's source last changed, for the sitemap's lastmod.
//
// Git is the source while its history reaches back far enough. Vercel builds from a shallow clone that
// holds only the newest few commits, and the oldest of them looks as if it added every older file. Its
// date is not that file's date, and it moves forward with every deploy. So a commit at the cut is never
// trusted, and the date comes from sitemap-dates.json instead. That file is written from the full history
// by `npm run sitemap:dates`. A date in it can be older than the truth, never newer.

const RECORDED: Record<string, string> = recorded;

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

let shallowClone: boolean | undefined;

/** Whether the build's clone has its history cut short. False when git is missing. */
export function isShallowClone(): boolean {
  return (shallowClone ??= git(["rev-parse", "--is-shallow-repository"]) === "true");
}

/**
 * Reads one `git log -1 --format=%cI%x09%P` line: the commit date, a tab, the parent commits.
 * Null when there is no commit, or when the commit is where a shallow clone's history was cut.
 * Git shows that commit with no parents.
 */
export function trustedCommitDate(line: string, shallow: boolean): Date | null {
  const [iso = "", parents = ""] = line.split("\t");
  if (!iso.trim()) return null;
  if (shallow && !parents.trim()) return null;
  const date = new Date(iso.trim());
  return Number.isNaN(date.getTime()) ? null : date;
}

const requested = new Set<string>();

/** Every file the sitemap has asked about, for the script that records their dates. */
export function requestedSourceFiles(): string[] {
  return [...requested].sort();
}

/** When the file last changed: from git when its history reaches that far, else the recorded date. */
export function sourceDate(file: string): Date | null {
  requested.add(file);
  const fromGit = trustedCommitDate(git(["log", "-1", "--format=%cI%x09%P", "--", file]), isShallowClone());
  if (fromGit) return fromGit;
  const iso = RECORDED[file];
  return iso ? new Date(iso) : null;
}

// Last resort, for a file with neither a trustworthy git date nor a recorded one.
const FALLBACK_UPDATED = "2026-10-18T11:03:00.000Z";

/**
 * Latest change across the files that actually feed a URL. Never the deploy time.
 * It is the URL's lastmod in the sitemap, and a page that states a dateModified takes it from here too,
 * so the two cannot disagree.
 */
export function lastModified(files: string[], fallback = FALLBACK_UPDATED): Date {
  let max = 0;
  for (const file of files) {
    const date = sourceDate(file);
    if (date) max = Math.max(max, date.getTime());
  }
  return new Date(max || new Date(fallback).getTime());
}

/** The files behind /scrap-car-prices-brisbane, shared by the sitemap and that page's schema. */
export const PRICE_GUIDE_SOURCES = ["src/app/scrap-car-prices-brisbane/page.tsx"];
