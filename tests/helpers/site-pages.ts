// Loads and renders the site's pages for tests, without a Next.js build.
//
// A page that shows a photo imports the file, which only the Next.js build knows how to load. Here each
// photo import gets a stand-in with the fields next/image asks for.
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Metadata } from "next";

for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
  require.extensions[ext] = (module, filename) => {
    module.exports = { src: `/photo/${filename.split("/").pop()}`, width: 1200, height: 600, blurDataURL: "data:image/gif;base64,R0lGODlhAQABAAAAACw=" };
  };
}

type PageModule = {
  default: (props: { params: Promise<Record<string, string>> }) => ReactElement | Promise<ReactElement>;
  metadata?: Metadata;
  generateMetadata?: (props: { params: Promise<Record<string, string>> }) => Promise<Metadata>;
};

/** Every page a visitor can open, with the file that builds it. The thank-you pages are left out. */
export const routes: { path: string; file: string; params?: Record<string, string> }[] = [
  { path: "/", file: "page" },
  { path: "/about", file: "about/page" },
  { path: "/autoval", file: "autoval/page" },
  { path: "/car-removal-brisbane", file: "car-removal-brisbane/page" },
  { path: "/car-removal-no-keys-no-wheels", file: "car-removal-no-keys-no-wheels/page" },
  { path: "/car-wreckers-gold-coast", file: "car-wreckers-gold-coast/page" },
  { path: "/contact-us", file: "contact-us/page" },
  { path: "/locations", file: "locations/page" },
  { path: "/locations/ipswich", file: "locations/ipswich/page" },
  { path: "/locations/logan", file: "locations/logan/page" },
  { path: "/locations/toowong", file: "locations/toowong/page" },
  { path: "/privacy", file: "privacy/page" },
  { path: "/quote", file: "quote/page" },
  { path: "/scrap-car-prices-brisbane", file: "scrap-car-prices-brisbane/page" },
  ...["cash-for-cars", "car-removals", "services", "truck-removal", "scrap-car-removal", "car-wreckers", "car-disposal"].map((page) => ({
    path: `/${page}`,
    file: "[page]/page",
    params: { page },
  })),
  ...["gold-coast", "sunshine-coast", "tweed-heads"].map((slug) => ({
    path: `/locations/${slug}`,
    file: "locations/[slug]/page",
    params: { slug },
  })),
];

const route = (path: string) => {
  const found = routes.find((r) => r.path === path);
  if (!found) throw new Error(`No route listed for ${path}`);
  return found;
};

async function load(path: string): Promise<{ module: PageModule; props: { params: Promise<Record<string, string>> } }> {
  const { file, params = {} } = route(path);
  return { module: (await import(`../../src/app/${file}`)) as PageModule, props: { params: Promise.resolve(params) } };
}

export async function metadataOf(path: string): Promise<Metadata> {
  const { module, props } = await load(path);
  return module.metadata ?? (await module.generateMetadata?.(props)) ?? {};
}

// Outside a Next.js page there is no current path, so the quote form's hidden "page" field renders with a
// null value and React says so. That one message is expected. Anything else is still printed.
// next/image also warns that a photo's quality setting is not in its config. That config is in
// next.config.ts, which only the build reads, so the warning means nothing here.
export function render(element: ReactElement): string {
  const report = console.error;
  const warn = console.warn;
  console.error = (...args: unknown[]) => {
    if (!String(args[0]).includes("should not be null")) report(...args);
  };
  console.warn = (...args: unknown[]) => {
    if (!String(args[0]).includes("is using quality")) warn(...args);
  };
  try {
    return renderToStaticMarkup(element);
  } finally {
    console.error = report;
    console.warn = warn;
  }
}

const rendered = new Map<string, Promise<string>>();

/** The page's HTML, as the server sends it inside <main>. The header and footer are not part of it. */
export function htmlOf(path: string): Promise<string> {
  let html = rendered.get(path);
  if (!html) {
    html = load(path).then(async ({ module, props }) => render(await module.default(props)));
    rendered.set(path, html);
  }
  return html;
}

export const text = (html: string) =>
  html
    .replace(/<script\b[^>]*>.*?<\/script>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');

/** Every link in the HTML, as its address and the words a reader sees. */
export function linksIn(html: string): { href: string; label: string }[] {
  return [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"[^>]*>(.*?)<\/a>/g)].map((m) => ({ href: m[1], label: text(m[2]).replace(/\s+/g, " ").trim() }));
}

/** The JSON-LD blocks on the page, parsed. */
export function jsonLdIn(html: string): Record<string, unknown>[] {
  return [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}

