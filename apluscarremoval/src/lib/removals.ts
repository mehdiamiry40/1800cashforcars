import data from "@content/recent-removals.json";
import { esc } from "./html";

/**
 * The "Recent Car Removals" grid. Entries live in content/recent-removals.json, newest first.
 * Add a vehicle by adding an object at the top of `items`; the pages re-flow automatically.
 * Markup matches the WordPress plugin (tlzmda-car-removals) the grid came from.
 */
export type Removal = {
  title: string;
  badge?: string;
  location?: string;
  condition?: string;
  price?: string;
  image: { src: string; width: number; height: number; alt: string; srcset?: string };
};

export const REMOVALS_PATH = "/recent-car-removals-brisbane/";
export const REMOVALS_QUERY = "tlzmda_page";
export const PLACEHOLDER = "<!--aplus:recent-removals-->";

const items = data.items as Removal[];
const perPage = data.perPage;

export const removalsPageCount = Math.max(1, Math.ceil(items.length / perPage));

const pageHref = (n: number) => `${REMOVALS_PATH}?${REMOVALS_QUERY}=${n}`;

function card(item: Removal, first: boolean): string {
  const { image } = item;
  const sizes = `(max-width: ${image.width}px) 100vw, ${image.width}px`;
  const img =
    `<img decoding="async" width="${image.width}" height="${image.height}" src="${esc(image.src)}"` +
    ` class="tlzmda-cr-photo wp-post-image" alt="${esc(image.alt)}"` +
    (first ? ` loading="eager" fetchpriority="high"` : ` loading="lazy"`) +
    (image.srcset ? ` srcset="${esc(image.srcset)}" sizes="${first ? sizes : `auto, ${sizes}`}"` : "") +
    ` />`;
  const line = (cls: string, label: string, value?: string) =>
    value ? `<p class="tlzmda-cr-${cls}"><span class="tlzmda-cr-label">${label}:</span> ${esc(value)}</p>` : "";
  return (
    `<article class="tlzmda-cr-card"><div class="tlzmda-cr-image">${img}` +
    (item.badge ? `<span class="tlzmda-cr-badge">${esc(item.badge)}</span>` : "") +
    `</div><div class="tlzmda-cr-content"><h2 class="tlzmda-cr-title">${esc(item.title)}</h2>` +
    line("location", "Purchased", item.location) +
    line("condition", "Condition", item.condition) +
    `</div>` +
    (item.price ? `<p class="tlzmda-cr-price"><strong>${esc(item.price)}</strong></p>` : "") +
    `<div class="tlzmda-cr-cta"><span class="tlzmda-cr-cta-prompt">Have a similar car to sell?</span>` +
    `<a class="tlzmda-cr-cta-link" href="/contact-us/">Get a Free Quote</a></div></article>`
  );
}

function pagination(current: number): string {
  if (removalsPageCount < 2) return "";
  const rows: string[] = [];
  if (current > 1) rows.push(`<a class="prev page-numbers" href="${pageHref(current - 1)}">← Previous</a>`);
  for (let n = 1; n <= removalsPageCount; n++) {
    rows.push(
      n === current
        ? `<span aria-current="page" class="page-numbers current">${n}</span>`
        : `<a class="page-numbers" href="${pageHref(n)}">${n}</a>`,
    );
  }
  if (current < removalsPageCount) rows.push(`<a class="next page-numbers" href="${pageHref(current + 1)}">Next →</a>`);
  return (
    `<nav class="tlzmda-cr-pagination" aria-label="Car removals pages"><ul class="page-numbers">\n` +
    rows.map((row) => `\t<li>${row}</li>\n`).join("") +
    `</ul>\n</nav>`
  );
}

export function renderRemovalsGrid(page: number): string {
  const slice = items.slice((page - 1) * perPage, page * perPage);
  const root = `<div class="tlzmda-cr-root" style="${esc(data.style)}">`;
  if (slice.length === 0) {
    return `${root}<p class="tlzmda-cr-empty">No recent vehicle removals are available yet.</p></div>`;
  }
  return `${root}<div class="tlzmda-cr-grid">${slice.map((item, i) => card(item, i === 0)).join("")}</div>${pagination(page)}</div>`;
}
