import { routes, type Route } from "./content";
import { esc } from "./html";
import { SITE_ORIGIN } from "./site";

/** Same sitemap addresses Yoast published, so Search Console needs no changes. */
export const SITEMAPS = { page: "page-sitemap.xml", post: "post-sitemap.xml" } as const;

const xml = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
    headers: { "content-type": "application/xml; charset=utf-8" },
  });

const entries = (kind: Route["kind"]) => routes.filter((route) => route.kind === kind && route.lastmod);

const newest = (list: Route[]) => list.map((route) => route.lastmod!).sort().at(-1);

export function urlSet(kind: keyof typeof SITEMAPS): Response {
  const urls = entries(kind)
    .map((route) => `\t<url>\n\t\t<loc>${esc(SITE_ORIGIN + route.path)}</loc>\n\t\t<lastmod>${route.lastmod}</lastmod>\n\t</url>`)
    .join("\n");
  return xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
}

export function sitemapIndex(): Response {
  const maps = (Object.keys(SITEMAPS) as Array<keyof typeof SITEMAPS>)
    .reverse()
    .map((kind) => {
      const lastmod = newest(entries(kind));
      return `\t<sitemap>\n\t\t<loc>${SITE_ORIGIN}/${SITEMAPS[kind]}</loc>${lastmod ? `\n\t\t<lastmod>${lastmod}</lastmod>` : ""}\n\t</sitemap>`;
    })
    .join("\n");
  return xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${maps}\n</sitemapindex>`);
}
