import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, it } from "node:test";
import sitemap from "../src/app/sitemap";
import { pages } from "../src/lib/content";
import { site } from "../src/lib/site";
import recorded from "../src/lib/sitemap-dates.json";
import { isShallowClone, requestedSourceFiles, trustedCommitDate } from "../src/lib/sitemap-dates";

function gitDate(file: string): number {
  const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { encoding: "utf8" }).trim();
  return new Date(iso).getTime();
}

describe("sitemap lastmod", () => {
  it("lists the Toowong page and the Gold Coast wreckers page", () => {
    const urls = sitemap().map((item) => item.url);
    assert.equal(urls.filter((url) => url.endsWith("/locations/toowong")).length, 1);
    assert.equal(urls.filter((url) => url.endsWith("/car-wreckers-gold-coast")).length, 1);
  });

  it("uses at least the git date of the Gold Coast area copy", () => {
    const entry = sitemap().find((item) => item.url.endsWith("/locations/gold-coast"));
    assert.ok(entry?.lastModified instanceof Date);
    assert.ok(entry.lastModified.getTime() >= gitDate("src/lib/areas/gold-coast.ts"));
  });

  // The service pages share their copy files. Each one is dated from its own `updated` value,
  // so editing one page cannot move the date on the others.
  it("dates each service page from that page's own updated value", () => {
    const entries = sitemap();
    for (const page of pages) {
      const entry = entries.find((item) => item.url === `${site.url}/${page.slug}`);
      assert.ok(entry?.lastModified instanceof Date, `/${page.slug} is missing from the sitemap`);
      const time = entry.lastModified.getTime();
      assert.ok(!Number.isNaN(time), `/${page.slug} has an updated value that is not a date`);
      assert.equal(time, new Date(page.updated).getTime(), `/${page.slug} is not dated from its own copy`);
      assert.ok(time <= Date.now(), `/${page.slug} is dated in the future`);
    }
  });

  it("writes each service page's date with a Brisbane time, not a bare day", () => {
    for (const page of pages) {
      assert.match(page.updated, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+10:00$/, `/${page.slug}`);
    }
  });

  it("does not trust the commit where a shallow clone's history is cut", () => {
    const boundary = "2026-10-31T09:13:48+10:00\t";
    const ordinary = "2026-11-16T10:35:14+10:00\tda8dba9f0c1e";
    // A full clone: every commit is real, including the first one, which has no parents.
    assert.equal(trustedCommitDate(boundary, false)?.toISOString(), "2026-10-30T23:13:48.000Z");
    assert.equal(trustedCommitDate(ordinary, false)?.toISOString(), "2026-11-16T00:35:14.000Z");
    // A shallow clone: the commit with no parents only looks as if it added the file.
    assert.equal(trustedCommitDate(boundary, true), null);
    assert.equal(trustedCommitDate(ordinary, true)?.toISOString(), "2026-11-16T00:35:14.000Z");
    assert.equal(trustedCommitDate("", true), null);
    assert.equal(trustedCommitDate("not a date\tabc", false), null);
  });

  it("records a date for every file behind the sitemap, and never one later than its last commit", (t) => {
    if (isShallowClone()) return t.skip("needs the full git history");
    sitemap();
    const dates: Record<string, string> = recorded;
    for (const file of requestedSourceFiles()) {
      assert.ok(dates[file], `${file} has no recorded date. Run: npm run sitemap:dates`);
      assert.ok(new Date(dates[file]).getTime() <= gitDate(file), `${file} is recorded as changed after its last commit`);
    }
  });
});
