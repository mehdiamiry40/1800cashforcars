// When each hand-built page last changed in a way a reader or a search engine can see: its copy, its
// title or description, or its schema. The sitemap gives this as the page's lastmod.
//
// Set a date by hand, and only for the page that was edited. A change to styling, to layout, to a
// component shared with other pages, or to the code behind a page is not a reason to move it. The dates
// used to come from each file's last git commit, which moved a page's lastmod for a CSS class change.
//
// The service pages built from content.ts and service-copy.ts carry the same kind of date next to their
// copy, as `updated`. Write each date and time in Brisbane time (+10:00), and never in the future.
export const pageUpdated = {
  "/": "2026-11-26T12:39:00+10:00",
  "/about": "2026-11-26T12:53:00+10:00",
  "/car-removal-brisbane": "2026-11-26T11:39:05+10:00",
  "/car-removal-no-keys-no-wheels": "2026-11-15T23:40:04+10:00",
  "/scrap-car-prices-brisbane": "2026-11-26T12:39:00+10:00",
  "/locations": "2026-11-26T12:39:00+10:00",
  "/locations/toowong": "2026-11-24T14:22:44+10:00",
  "/car-wreckers-gold-coast": "2026-11-26T11:39:05+10:00",
  "/locations/gold-coast": "2026-11-24T14:22:44+10:00",
  "/locations/logan": "2026-11-26T11:39:05+10:00",
  "/locations/ipswich": "2026-11-26T11:39:05+10:00",
  "/locations/sunshine-coast": "2026-11-26T12:39:00+10:00",
  "/locations/tweed-heads": "2026-11-26T12:39:00+10:00",
  "/autoval": "2026-11-26T11:39:05+10:00",
  "/contact-us": "2026-11-26T11:39:05+10:00",
  "/privacy": "2026-11-24T11:16:52+10:00",
} as const satisfies Record<string, string>;

export type DatedPath = keyof typeof pageUpdated;

export function updatedOn(path: DatedPath): Date {
  return new Date(pageUpdated[path]);
}
