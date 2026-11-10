import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import nextConfig from "../next.config";
import { allSlugs, readHtml, renderMain, resolve, routes } from "../src/lib/content";
import { FOOTER_MENUS_TOP, FOOTER_QUICK_LINKS, HEADER_MENU } from "../src/lib/menus";

const publicDir = join(process.cwd(), "public");

// Broken on the WordPress site as well; kept as they were rather than silently dropped.
const KNOWN_MISSING = new Set([
  "/images/aplus-logo.webp",
  "/wp-content/uploads/2022/08/Component-1-–-1-1.png",
  "/wp-content/uploads/2022/08/Component-5-–-1.png",
  "/wp-content/uploads/interior-condition-car-resale-value.webp",
]);

test("every route has content and a unique path with a trailing slash", () => {
  const seen = new Set<string>();
  for (const route of routes) {
    assert.match(route.path, /^\/([a-z0-9-]+\/)*$/, route.path);
    assert.ok(!seen.has(route.path), `duplicate ${route.path}`);
    seen.add(route.path);
    assert.ok(readHtml(route.html).length > 200, `${route.path} has no content`);
    assert.ok(route.title, `${route.path} has no title`);
  }
  assert.equal(routes.filter((route) => route.kind === "page").length, 27);
  assert.equal(routes.filter((route) => route.kind === "post").length, 14);
});

test("indexable pages keep their canonical URL and description", () => {
  for (const route of routes.filter((r) => r.kind === "page" || r.kind === "post")) {
    assert.equal(route.canonical, `https://www.apluscarremoval.com.au${route.path}`);
    assert.ok(route.metas.some((meta) => meta.key === "description" && meta.content), route.path);
    assert.ok(route.metas.some((meta) => meta.key === "og:title"), route.path);
  }
});

test("the crawl's cache-bypass parameter never reaches the content", () => {
  for (const route of routes) assert.ok(!readHtml(route.html).includes("LSCWP_CTRL"), route.path);
});

test("every image and stylesheet the content references is in public/", () => {
  const missing = new Set<string>();
  for (const route of routes) {
    const html = readHtml(route.html);
    const urls = [
      ...[...html.matchAll(/\s(?:src|href)="(\/(?:wp-content|images|assets)\/[^"?#]+)/g)].map((m) => m[1]),
      ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(",").map((part) => part.trim().split(/\s+/)[0])),
    ];
    for (const url of urls) {
      if (!url.startsWith("/") || KNOWN_MISSING.has(decodeURI(url))) continue;
      if (!existsSync(join(publicDir, decodeURI(url)))) missing.add(url);
    }
  }
  assert.deepEqual([...missing], []);
});

test("internal links point at a page, a redirect, or a file", async () => {
  const known = new Set(routes.map((route) => route.path));
  const redirects = (await nextConfig.redirects!()).map((r) => r.source.replace(/\/:.*$/, ""));
  const broken = new Set<string>();
  const check = (href: string, where: string) => {
    const path = href.split(/[?#]/)[0];
    if (!path.startsWith("/") || path.startsWith("//")) return;
    if (known.has(path) || known.has(`${path}/`)) return;
    if (redirects.some((source) => path.replace(/\/$/, "") === source || path.startsWith(`${source}/`))) return;
    if (existsSync(join(publicDir, decodeURI(path))) && path !== "/") return;
    broken.add(`${where} -> ${href}`);
  };
  for (const route of routes) {
    for (const m of readHtml(route.html).matchAll(/<a\s[^>]*?href="([^"]+)"/g)) check(m[1], route.path);
  }
  const menuItems = [...HEADER_MENU, ...FOOTER_MENUS_TOP.flatMap((m) => m.items), ...FOOTER_QUICK_LINKS.items];
  for (const item of menuItems.flatMap((i) => [i, ...(i.children ?? [])])) {
    if (item.href && item.href !== "#") check(item.href, "menu");
  }
  assert.deepEqual([...broken], []);
});

test("recent-removals pages resolve and render their own slice of the grid", () => {
  const first = resolve(["recent-car-removals-brisbane"])!;
  const second = resolve(["recent-car-removals-brisbane", "page", "2"])!;
  assert.ok(first && second);
  assert.equal(second.route.canonical, "https://www.apluscarremoval.com.au/recent-car-removals-brisbane/?tlzmda_page=2");
  const a = renderMain(first);
  const b = renderMain(second);
  assert.ok(!a.includes("<!--aplus:recent-removals-->"));
  assert.equal(a.match(/<article class="tlzmda-cr-card">/g)?.length, 12);
  assert.match(a, /<span aria-current="page" class="page-numbers current">1<\/span>/);
  assert.match(b, /<span aria-current="page" class="page-numbers current">2<\/span>/);
  assert.match(a, /loading="eager" fetchpriority="high"/);
  assert.notEqual(a, b);
  assert.equal(resolve(["recent-car-removals-brisbane", "page", "99"]), undefined);
  assert.equal(resolve(["recent-car-removals-brisbane", "page", "1"]), undefined);
});

test("static params cover every route plus the extra grid pages", () => {
  const slugs = allSlugs().map((slug) => slug.join("/"));
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(slugs.includes(""));
  assert.ok(slugs.includes("recent-car-removals-brisbane/page/2"));
  assert.equal(resolve(["no-such-page"]), undefined);
});
