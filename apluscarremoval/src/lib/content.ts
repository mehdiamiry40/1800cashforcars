import { readFileSync } from "node:fs";
import { join } from "node:path";
import routesJson from "@content/routes.json";
import notFoundJson from "@content/not-found.json";
import menuBaseJson from "@content/menu-base.json";
import { PLACEHOLDER, REMOVALS_PATH, REMOVALS_QUERY, removalsPageCount, renderRemovalsGrid } from "./removals";
import { SITE_ORIGIN } from "./site";

export type Meta = { attr: "name" | "property"; key: string; content: string };
export type MenuState = Record<string, { className: string; current?: boolean }>;

export type Route = {
  /** Public path, always with a trailing slash. */
  path: string;
  kind: "page" | "post" | "category" | "tag";
  wpId?: number;
  /** File name (without .html) under content/html. */
  html: string;
  bodyClass: string;
  title: string;
  canonical?: string;
  metas: Meta[];
  jsonLd: string[];
  /** Menu item classes that differ from the neutral state, e.g. the current page. */
  menu: MenuState;
  lastmod?: string;
};

export const routes = routesJson as Route[];
export const menuBase = menuBaseJson as MenuState;
export const notFoundPage = notFoundJson as Pick<Route, "html" | "bodyClass" | "title" | "metas">;

const byPath = new Map(routes.map((route) => [route.path, route]));

export const slugToPath = (slug?: string[]) => (slug?.length ? `/${slug.join("/")}/` : "/");
export const pathToSlug = (path: string) => path.split("/").filter(Boolean);

export type Resolved = { route: Route; removalsPage: number };

/**
 * Pages 2+ of the recent-removals grid are served from /recent-car-removals-brisbane/page/N/
 * internally; next.config.ts rewrites the public ?tlzmda_page=N address onto them.
 */
export function resolve(slug?: string[]): Resolved | undefined {
  const path = slugToPath(slug);
  const direct = byPath.get(path);
  if (direct) return { route: direct, removalsPage: 1 };
  const paged = path.match(/^\/recent-car-removals-brisbane\/page\/(\d+)\/$/);
  if (paged) {
    const page = Number(paged[1]);
    const base = byPath.get(REMOVALS_PATH);
    if (!base || page < 2 || page > removalsPageCount) return undefined;
    const url = `${SITE_ORIGIN}${REMOVALS_PATH}?${REMOVALS_QUERY}=${page}`;
    return {
      removalsPage: page,
      route: {
        ...base,
        path,
        canonical: url,
        metas: base.metas.map((meta) => (meta.key === "og:url" ? { ...meta, content: url } : meta)),
      },
    };
  }
  return undefined;
}

export function allSlugs(): string[][] {
  const slugs = routes.map((route) => pathToSlug(route.path));
  for (let page = 2; page <= removalsPageCount; page++) {
    slugs.push([...pathToSlug(REMOVALS_PATH), "page", String(page)]);
  }
  return slugs;
}

const htmlCache = new Map<string, string>();

/** Content HTML is read at build time only: every page that uses it is prerendered. */
export function readHtml(key: string): string {
  let html = htmlCache.get(key);
  if (html === undefined) {
    html = readFileSync(join(process.cwd(), "content/html", `${key}.html`), "utf8");
    htmlCache.set(key, html);
  }
  return html;
}

export function renderMain({ route, removalsPage }: Resolved): string {
  const html = readHtml(route.html);
  return html.includes(PLACEHOLDER) ? html.replace(PLACEHOLDER, renderRemovalsGrid(removalsPage)) : html;
}
