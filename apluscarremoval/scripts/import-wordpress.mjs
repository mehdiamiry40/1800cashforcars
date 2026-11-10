#!/usr/bin/env node
// One-off importer: reads the live WordPress site and writes the content files this
// Next.js app renders (content/*.json, content/html/*.html) plus the media under public/.
//
//   NODE_USE_ENV_PROXY=1 node scripts/import-wordpress.mjs            # fetch, then build content
//   node scripts/import-wordpress.mjs --offline                        # rebuild from .import-cache only
//
// Pages are requested with ?LSCWP_CTRL=before_optm so LiteSpeed returns the HTML before its
// lazy-load / critical-CSS rewriting. Everything fetched is kept in .import-cache/ (gitignored).
// Once WordPress is switched off this script has nothing to read; the content files are then
// the source of truth and are edited directly.
import { mkdir, readFile, writeFile, access, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://www.apluscarremoval.com.au";
const CACHE = join(ROOT, ".import-cache");
const OFFLINE = process.argv.includes("--offline");
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const BYPASS = "LSCWP_CTRL=before_optm";

const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchCached(url, cacheName, { binary = false, allow404 = false } = {}) {
  const file = join(CACHE, cacheName);
  if (await exists(file)) return binary ? readFile(file) : readFile(file, "utf8");
  if (await exists(file + ".404")) return null;
  if (OFFLINE) throw new Error(`Not in cache (offline): ${url}`);
  await mkdir(dirname(file), { recursive: true });
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "manual" });
      if (res.status === 404 && allow404) {
        const body = Buffer.from(await res.arrayBuffer());
        // The 404 template is itself content we import; missing media is just recorded.
        if (!binary) {
          await writeFile(file, body);
          return body.toString("utf8");
        }
        await writeFile(file + ".404", "");
        return null;
      }
      if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${url}`);
      const body = Buffer.from(await res.arrayBuffer());
      await writeFile(file, body);
      await sleep(150);
      return binary ? body : body.toString("utf8");
    } catch (err) {
      if (attempt >= 4) throw err;
      await sleep(1000 * 2 ** attempt);
    }
  }
}

const decode = (s) =>
  s
    .replace(/&#0?38;|&amp;/g, "&")
    .replace(/&#0?39;|&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`));
  return m ? decode(m[1] ?? m[2]) : undefined;
};

/** Make same-site URLs root-relative and drop the cache-bypass parameter the crawl added. */
function localise(html) {
  return html
    .replace(/\?LSCWP_CTRL=before_optm&(amp;|#0?38;)/g, "?")
    .replace(/&(amp;|#0?38;)LSCWP_CTRL=before_optm/g, "")
    .replace(/\?LSCWP_CTRL=before_optm/g, "")
    .replace(/%3FLSCWP_CTRL%3Dbefore_optm/g, "")
    .replace(
      /(\s(?:href|src|action|poster|data-src|data-css-url)=["'])https:\/\/www\.apluscarremoval\.com\.au(?=\/|["'])/g,
      "$1",
    )
    .replace(/(\ssrcset=["'])([^"']+)(["'])/g, (_, a, v, c) => a + v.replaceAll(ORIGIN + "/", "/") + c)
    .replace(/url\((['"]?)https:\/\/www\.apluscarremoval\.com\.au\//g, "url($1/")
    .replace(/(\shref=)(["'])\2/g, "$1$2/$2"); // href="" left by the origin-only home link
}

function slice(html, startMarker, endMarker) {
  const a = html.indexOf(startMarker);
  const b = html.indexOf(endMarker, a);
  if (a < 0 || b < 0) throw new Error(`Markers not found: ${startMarker} … ${endMarker}`);
  return html.slice(a, b);
}

function parseHead(html) {
  const head = html.slice(0, html.indexOf("</head>"));
  const title = decode((head.match(/<title>([\s\S]*?)<\/title>/) || [, ""])[1]);
  const metas = [];
  for (const tag of head.match(/<meta\s[^>]*>/g) || []) {
    const name = attr(tag, "name");
    const property = attr(tag, "property");
    const content = attr(tag, "content");
    if (content === undefined) continue;
    const key = name ?? property;
    if (!key || ["viewport", "generator", "ti-site-data", "msapplication-TileImage"].includes(key)) continue;
    metas.push({ attr: name ? "name" : "property", key, content });
  }
  const canonicalTag = head.match(/<link rel="canonical"[^>]*>/);
  const canonical = canonicalTag ? attr(canonicalTag[0], "href") : undefined;
  const jsonLd = [...head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
    m[1].trim(),
  );
  return { title, metas, canonical, jsonLd };
}

/** Menu classes that differ from the neutral (404) rendering: this is what marks the current page. */
function menuState(body, base) {
  const state = {};
  const zones = {
    header: slice(body, '<header id="header"', "</header>"),
    footer: slice(body, '<footer id="footer"', "</footer>"),
    mobile: slice(body, '<div id="main-menu"', "<script"),
  };
  for (const [zone, html] of Object.entries(zones)) {
    for (const m of html.matchAll(/<li (?:id="menu-item-\d+" )?class="([^"]*)">\s*<a([^>]*)>/g)) {
      const id = (m[1].match(/menu-item-(\d+)/) || [])[1];
      if (!id) continue;
      const key = `${zone}:${id}`;
      const current = /aria-current="page"/.test(m[2]);
      if (base) {
        if (base[key]?.className !== m[1] || current) state[key] = { className: m[1], current };
      } else state[key] = { className: m[1] };
    }
  }
  return state;
}

function parseRemovals(mainHtml) {
  const start = mainHtml.indexOf('<div class="tlzmda-cr-root"');
  if (start < 0) return null;
  const endMarker = "</nav></div>";
  const endAt = mainHtml.indexOf(endMarker, start);
  if (endAt < 0) return { block: "", cards: [] }; // past the last page: "no removals" notice only
  const block = mainHtml.slice(start, endAt + endMarker.length);
  const cards = [...block.matchAll(/<article class="tlzmda-cr-card">([\s\S]*?)<\/article>/g)].map((m) => {
    const c = m[1];
    const img = c.match(/<img[^>]*>/)[0];
    const text = (re) => {
      const x = c.match(re);
      return x ? decode(x[1]) : undefined;
    };
    return {
      title: text(/<h2 class="tlzmda-cr-title">([\s\S]*?)<\/h2>/),
      badge: text(/<span class="tlzmda-cr-badge">([\s\S]*?)<\/span>/),
      location: text(/<p class="tlzmda-cr-location"><span class="tlzmda-cr-label">Purchased:<\/span> ([\s\S]*?)<\/p>/),
      condition: text(/<p class="tlzmda-cr-condition"><span class="tlzmda-cr-label">Condition:<\/span> ([\s\S]*?)<\/p>/),
      price: text(/<p class="tlzmda-cr-price"><strong>([\s\S]*?)<\/strong><\/p>/),
      image: {
        src: attr(img, "src").replace(ORIGIN, ""),
        width: Number(attr(img, "width")),
        height: Number(attr(img, "height")),
        alt: attr(img, "alt"),
        srcset: attr(img, "srcset")?.replaceAll(ORIGIN + "/", "/"),
      },
    };
  });
  return { block, cards, style: attr(block.match(/<div class="tlzmda-cr-root"[^>]*>/)[0], "style") };
}

async function main() {
  if (!OFFLINE && !process.env.NODE_USE_ENV_PROXY && process.env.HTTPS_PROXY) {
    console.warn("HTTPS_PROXY is set: run with NODE_USE_ENV_PROXY=1 so fetch() uses it.");
  }

  // ---- 1. What to import -------------------------------------------------------------
  const sitemapUrls = [];
  const lastmod = {};
  for (const name of ["page-sitemap.xml", "post-sitemap.xml"]) {
    const xml = await fetchCached(`${ORIGIN}/${name}`, `sitemaps/${name}`);
    for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?/g)) {
      const path = m[1].replace(ORIGIN, "");
      sitemapUrls.push(path);
      if (m[2]) lastmod[path] = m[2];
    }
  }
  const api = async (endpoint, name) =>
    JSON.parse(await fetchCached(`${ORIGIN}/wp-json/wp/v2/${endpoint}`, `api/${name}.json`));
  const wpPosts = await api(
    "posts?per_page=100&_fields=id,slug,link,date_gmt,modified_gmt,categories,tags,title",
    "posts",
  );
  const wpPages = await api("pages?per_page=100&_fields=id,slug,link,date_gmt,modified_gmt,title", "pages");
  const wpCategories = await api("categories?per_page=100&_fields=id,slug,name,count,link", "categories");
  const wpTags = await api("tags?per_page=100&_fields=id,slug,name,count,link", "tags");

  const targets = [
    ...wpPages.map((p) => ({ kind: "page", path: p.link.replace(ORIGIN, ""), wp: p })),
    ...wpPosts.map((p) => ({ kind: "post", path: p.link.replace(ORIGIN, ""), wp: p })),
    ...wpCategories.map((c) => ({ kind: "category", path: c.link.replace(ORIGIN, ""), wp: c })),
    ...wpTags.filter((t) => t.count > 0).map((t) => ({ kind: "tag", path: t.link.replace(ORIGIN, ""), wp: t })),
  ];
  for (const path of sitemapUrls) {
    if (!targets.some((t) => t.path === path)) throw new Error(`Sitemap URL not covered by the REST API: ${path}`);
  }

  const cacheName = (path) => `pages/${path === "/" ? "index" : path.replace(/^\/|\/$/g, "").replaceAll("/", "__")}.html`;
  const getPage = (path, query = "") =>
    fetchCached(`${ORIGIN}${path}?${query}${BYPASS}`, cacheName(path + (query ? query.replace(/\W+/g, "-") : "")), {
      allow404: true,
    });

  // ---- 2. Neutral chrome from the 404 template ----------------------------------------
  const notFoundHtml = await getPage("/aplus-import-not-found-probe/");
  const notFoundBody = notFoundHtml.slice(notFoundHtml.indexOf("<body"));
  const baseMenu = menuState(notFoundBody, null);

  const outHtml = join(ROOT, "content/html");
  await rm(join(ROOT, "content"), { recursive: true, force: true });
  await mkdir(outHtml, { recursive: true });

  const routes = [];
  const mediaUrls = new Set();
  const collectMedia = (html) => {
    const add = (u) => {
      const clean = decode(u.trim()).replace(ORIGIN, "").split(/[?#]/)[0];
      if (/^\/(wp-content|images)\/.+\.(png|jpe?g|webp|gif|svg|ico|avif|mp4|webm|pdf)$/i.test(clean)) mediaUrls.add(clean);
    };
    for (const m of html.matchAll(/(?:src|href|content|poster)=["']([^"']+)["']/g)) add(m[1]);
    for (const m of html.matchAll(/srcset=["']([^"']+)["']/g)) for (const part of m[1].split(",")) add(part.trim().split(/\s+/)[0]);
    for (const m of html.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) add(m[1]);
    for (const m of html.matchAll(/"(https:\\?\/\\?\/www\.apluscarremoval\.com\.au[^"]+)"/g)) add(m[1].replaceAll("\\/", "/"));
  };

  let removals = null;
  const mainOf = (html) => slice(html, "<main", "</main>").replace(/^<main[^>]*>/, "");

  const importPage = async (target, html, key) => {
    const head = parseHead(html);
    const body = html.slice(html.indexOf("<body"));
    const bodyClass = attr(body.match(/<body[^>]*>/)[0], "class");
    let main = mainOf(html);
    collectMedia(html);
    const rem = parseRemovals(main);
    if (rem) {
      main = main.replace(rem.block, "<!--aplus:recent-removals-->");
      if (!removals) removals = { style: rem.style, perPage: rem.cards.length, items: [] };
      removals.items.push(...rem.cards);
    }
    await writeFile(join(outHtml, `${key}.html`), localise(main));
    return {
      path: target.path,
      kind: target.kind,
      wpId: target.wp?.id,
      html: key,
      bodyClass,
      title: head.title,
      canonical: head.canonical,
      metas: head.metas,
      jsonLd: head.jsonLd,
      menu: menuState(body, baseMenu),
      lastmod: lastmod[target.path],
    };
  };

  for (const target of targets) {
    const html = await getPage(target.path);
    const key = target.path === "/" ? "index" : target.path.replace(/^\/|\/$/g, "").replaceAll("/", "__");
    const route = await importPage(target, html, key);
    routes.push(route);
    process.stdout.write(`imported ${target.path}\n`);

    // Paginated "recent car removals" grid: later pages only add cards to removals.json.
    if (removals && removals.items.length && target.path === "/recent-car-removals-brisbane/") {
      for (let n = 2; n < 50; n++) {
        const pageHtml = await getPage(target.path, `tlzmda_page=${n}&`);
        const more = parseRemovals(mainOf(pageHtml));
        if (!more || more.cards.length === 0) break;
        collectMedia(pageHtml);
        removals.items.push(...more.cards);
      }
    }
  }

  // Blog index: the theme loads page 2+ of the post grid over AJAX. Keep those pages next to it.
  {
    const blogFile = join(outHtml, "blog.html");
    let blog = await readFile(blogFile, "utf8");
    const relay = blog.match(/data-flatsome-relay="([^"]+)"/);
    if (relay) {
      const data = JSON.parse(decode(relay[1]));
      const pages = [];
      for (let n = 2; n <= data.totalPages; n++) {
        const params = new URLSearchParams({ action: "flatsome_ajax_apply_shortcode", tag: data.tag });
        for (const [k, v] of Object.entries({ ...data.atts, page_number: String(n) })) params.set(`atts[${k}]`, v);
        const json = JSON.parse(
          await fetchCached(`${ORIGIN}/wp-admin/admin-ajax.php?${params}`, `api/relay-blog-${n}.json`),
        );
        if (!json.success) throw new Error("Blog relay request failed");
        collectMedia(json.data);
        pages.push(`<template data-relay-page="${n}">${localise(json.data)}</template>`);
      }
      blog = blog.replace(/(<div id="ux-relay-\d+")/, `${pages.join("")}$1`);
      await writeFile(blogFile, blog);
    }
  }

  // 404 template and its metadata
  await writeFile(join(outHtml, "404.html"), localise(mainOf(notFoundHtml)));
  const notFoundHead = parseHead(notFoundHtml);
  const notFound = {
    html: "404",
    bodyClass: attr(notFoundBody.match(/<body[^>]*>/)[0], "class"),
    title: notFoundHead.title,
    metas: notFoundHead.metas.filter((m) => m.key !== "og:url"),
  };

  // Search results reuse the post cards the archives render.
  const cards = {};
  for (const route of routes.filter((r) => r.kind === "category" || r.kind === "tag")) {
    const html = await readFile(join(outHtml, `${route.html}.html`), "utf8");
    for (const m of html.matchAll(/<div class="col post-item" >[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>(?=<div class="col post-item"|<\/div>)/g)) {
      const href = (m[0].match(/href="([^"]+)"/) || [])[1];
      if (href && !cards[href]) cards[href] = m[0];
    }
  }
  const strip = (html) =>
    decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const searchIndex = [];
  for (const route of routes.filter((r) => r.kind === "post" || r.kind === "page")) {
    const html = await readFile(join(outHtml, `${route.html}.html`), "utf8");
    const wpTitle = decode(route.kind === "post" || route.kind === "page" ? targets.find((t) => t.path === route.path).wp.title.rendered : route.title);
    const image = route.metas.find((m) => m.key === "og:image")?.content.replace(ORIGIN, "");
    searchIndex.push({
      path: route.path,
      kind: route.kind,
      title: wpTitle,
      date: targets.find((t) => t.path === route.path).wp.date_gmt,
      image,
      card: cards[route.path],
      text: strip(html).toLowerCase(),
    });
  }

  const posts = wpPosts.map((p) => ({
    path: p.link.replace(ORIGIN, ""),
    title: decode(p.title.rendered),
    date: p.date_gmt + "Z",
    modified: p.modified_gmt + "Z",
    categories: p.categories.map((id) => wpCategories.find((c) => c.id === id).slug),
    tags: p.tags.map((id) => wpTags.find((t) => t.id === id).slug),
  }));

  const json = (name, data) => writeFile(join(ROOT, "content", name), JSON.stringify(data, null, 2) + "\n");
  await json("routes.json", routes);
  await json("not-found.json", notFound);
  await json("menu-base.json", baseMenu);
  await json("recent-removals.json", removals);
  await json("posts.json", posts);
  await json("search-index.json", searchIndex);

  // ---- 3. Media and theme assets -------------------------------------------------------
  const themeAssets = [
    "/wp-content/themes/flatsome/assets/css/flatsome.css",
    "/wp-content/themes/flatsome/assets/css/icons/fl-icons.woff2",
    "/wp-content/themes/flatsome/assets/css/icons/fl-icons.woff",
    "/wp-content/themes/flatsome/assets/css/icons/fl-icons.ttf",
    "/wp-content/themes/flatsome/assets/css/icons/fl-icons.eot",
    "/wp-content/themes/flatsome/assets/css/icons/fl-icons.svg",
    "/wp-content/themes/flatsome/assets/img/shadow@2x.png",
    "/wp-content/themes/flatsome/assets/img/underline.png",
    "/wp-content/plugins/contact-form-7/includes/css/styles.css",
    "/wp-content/plugins/tlzmda-car-removals/assets/css/grid.css",
    "/wp-content/uploads/trustindex-google-widget.css",
  ];
  const inlineCss = {};
  const anyHead = notFoundHtml.slice(0, notFoundHtml.indexOf("</head>"));
  for (const m of anyHead.matchAll(/<style id="([^"]+)"[^>]*>([\s\S]*?)<\/style>/g)) inlineCss[m[1]] = m[2];
  for (const route of routes) {
    const html = await getPage(route.path);
    for (const m of html.slice(0, html.indexOf("</head>")).matchAll(/<style id="([^"]+)"[^>]*>([\s\S]*?)<\/style>/g)) {
      if (inlineCss[m[1]] === undefined) inlineCss[m[1]] = m[2];
      else if (inlineCss[m[1]] !== m[2]) throw new Error(`Inline style ${m[1]} differs on ${route.path}`);
    }
  }
  for (const css of Object.values(inlineCss)) collectMedia(css);
  for (const m of Object.values(inlineCss).join("\n").matchAll(/url\(\s*["']?(https:\/\/www\.apluscarremoval\.com\.au)?(\/wp-content\/fonts\/[^"')]+)/g)) {
    themeAssets.push(m[2]);
  }

  const missing = [];
  let saved = 0;
  for (const path of [...new Set([...mediaUrls, ...themeAssets])].sort()) {
    const buf = await fetchCached(ORIGIN + encodeURI(path), `media${path}`, { binary: true, allow404: true });
    if (!buf) {
      missing.push(path);
      continue;
    }
    const isStyle = path.endsWith(".css") && !path.includes("/uploads/");
    // The icon font is referenced by absolute URL from the theme's inline CSS, so it stays in
    // public/. The two images are relative url()s inside flatsome.css and are bundled with it.
    const isThemeAsset = path.includes("/themes/flatsome/assets/img/");
    // Stylesheets are bundled from src/styles; their relative url() assets sit beside them.
    const dest = isStyle || isThemeAsset ? join(ROOT, "src/styles/vendor", path) : join(ROOT, "public", path);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    saved++;
  }
  const blockStyles = Object.keys(inlineCss).filter((k) => k.startsWith("wp-block-")).sort();
  const early = ["wp-img-auto-sizes-contain-inline-css", "global-styles-inline-css"];
  const late = ["custom-css", "wp-custom-css", "kirki-inline-styles", ...blockStyles];
  const cssFile = async (file, ids) => {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(
      file,
      ids.map((id) => `/* ${id} */\n${localise(inlineCss[id]).replaceAll(ORIGIN + "/", "/")}`).join("\n\n") + "\n",
    );
  };
  await cssFile(join(ROOT, "src/styles/vendor/wp-core-inline.css"), early);
  await cssFile(join(ROOT, "src/styles/vendor/flatsome-inline.css"), ["flatsome-main-inline-css"]);
  // Everything WordPress printed after the theme stylesheet, in its original order: the
  // Customizer CSS, the font faces, then the block styles. The Customizer part was typed by
  // hand and contains rules a strict CSS parser rejects. Browsers recover from those in a
  // specific way, so this file is served untouched instead of going through the bundler.
  await cssFile(join(ROOT, "public/assets/wp-late-styles.css"), late);
  const unknown = Object.keys(inlineCss).filter((k) => ![...early, "flatsome-main-inline-css", ...late].includes(k));
  if (unknown.length) throw new Error(`Unhandled inline styles: ${unknown.join(", ")}`);

  console.log(`\n${routes.length} routes, ${removals?.items.length ?? 0} recent removals, ${saved} media files.`);
  if (missing.length) console.log(`Missing on the live site too (left as-is):\n  ${missing.join("\n  ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
