import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { describe, it } from "node:test";
import sitemap from "../src/app/sitemap";

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
});
