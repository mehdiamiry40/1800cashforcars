import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import sitemap from "../src/app/sitemap";
import { pages } from "../src/lib/content";
import { pageUpdated } from "../src/lib/page-dates";
import { site } from "../src/lib/site";

const BRISBANE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+10:00$/;
const pathOf = (url: string) => url.slice(site.url.length) || "/";

describe("sitemap lastmod", () => {
  it("lists the Toowong page and the Gold Coast wreckers page", () => {
    const urls = sitemap().map((item) => item.url);
    assert.equal(urls.filter((url) => url.endsWith("/locations/toowong")).length, 1);
    assert.equal(urls.filter((url) => url.endsWith("/car-wreckers-gold-coast")).length, 1);
  });

  // The hand-built pages used to take their date from the last git commit to their file, so a CSS class
  // change moved a page's lastmod. Each one now has a date set by hand in page-dates.ts.
  it("dates every hand-built page from its own entry in page-dates.ts", () => {
    const entries = sitemap();
    const servicePaths = new Set(pages.map((page) => `/${page.slug}`));
    const handBuilt = entries.map((item) => pathOf(item.url)).filter((path) => !servicePaths.has(path));
    assert.deepEqual([...handBuilt].sort(), Object.keys(pageUpdated).sort(), "page-dates.ts and the sitemap list different pages");
    for (const [path, iso] of Object.entries(pageUpdated)) {
      const entry = entries.find((item) => pathOf(item.url) === path);
      assert.ok(entry?.lastModified instanceof Date, `${path} is missing from the sitemap`);
      assert.match(iso, BRISBANE_TIME, `${path} is not written as a Brisbane date and time`);
      assert.equal(entry.lastModified.getTime(), new Date(iso).getTime(), `${path} is not dated from page-dates.ts`);
      assert.ok(entry.lastModified.getTime() <= Date.now(), `${path} is dated in the future`);
    }
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

  // A date from git, the build or the clock moves when nothing a reader can see has changed.
  it("takes no date from git, the build or the clock", () => {
    for (const file of ["src/app/sitemap.ts", "src/lib/page-dates.ts"]) {
      const code = readFileSync(file, "utf8").replace(/\/\/.*$/gm, "");
      assert.doesNotMatch(code, /child_process|execFile|Date\.now|new Date\(\)|process\.env/, `${file} reads a date from somewhere other than the page's own entry`);
    }
    const dates = () => sitemap().map((item) => (item.lastModified as Date).toISOString());
    assert.deepEqual(dates(), dates());
  });

  // The price guide prints the date its prices were last reviewed. Its schema used to give the file's last
  // commit as dateModified, so the two dates on one page disagreed by five weeks.
  it("gives the price guide's printed date as its schema dateModified", () => {
    const source = readFileSync("src/app/scrap-car-prices-brisbane/page.tsx", "utf8");
    assert.match(source, /Prices updated <time dateTime=\{UPDATED_ISO\}>\{UPDATED_LABEL\}<\/time>/);
    assert.match(source, /dateModified: UPDATED_ISO,/);
    assert.match(source, /datePublished: UPDATED_ISO,/);
    assert.match(source, /const UPDATED_ISO = "\d{4}-\d{2}-\d{2}";/);
  });

  // Search results cut a title off at about 60 characters, and " | 1800-CASH-FOR-CARS" is 21 of them.
  it("keeps each service page's title, with the site name, to 60 characters", () => {
    for (const page of pages) {
      const title = `${page.metaTitle} | ${site.name}`;
      assert.ok(title.length <= 60, `/${page.slug}: "${title}" is ${title.length} characters`);
    }
  });

  it("writes each service page's date with a Brisbane time, not a bare day", () => {
    for (const page of pages) {
      assert.match(page.updated, BRISBANE_TIME, `/${page.slug}`);
    }
  });
});
