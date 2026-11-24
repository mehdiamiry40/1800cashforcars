// Which ad or link brought a visitor. Noted when they arrive, kept for the tab's session, and sent
// with the quote form, so each quote can be matched to the ad, search or site it came from.
// Shared by the browser (noting and sending) and the quote handler (cleaning and describing).

/** Google Ads click IDs. gclid is the usual one; gbraid and wbraid replace it on some iPhone clicks. */
const AD_CLICK_KEYS = ["gclid", "gbraid", "wbraid"] as const;

/** Campaign tags, added to an ad's or a link's address by whoever set it up. */
const AD_TAG_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** `landing` is the first page of the visit. `referrer` is the host of the site that linked here. */
export const AD_SOURCE_KEYS = [...AD_CLICK_KEYS, ...AD_TAG_KEYS, "landing", "referrer"] as const;

export type AdSourceKey = (typeof AD_SOURCE_KEYS)[number];
export type AdSource = Partial<Record<AdSourceKey, string>>;

/** Form field that carries the stored record, as JSON. Empty when the form's script did not run. */
export const AD_SOURCE_FIELD = "src";

const STORAGE_KEY = "quote-source";
const MAX_VALUE_LENGTH = 200;

function cleanValue(value: unknown): string {
  if (typeof value !== "string") return "";
  // Printable characters only: the value ends up in an email and a database row.
  return value.replace(/[^\x20-\x7E]/g, "").trim().slice(0, MAX_VALUE_LENGTH);
}

/** Keeps the known keys as short, printable strings. Null when nothing usable is left. */
export function cleanAdSource(input: unknown): AdSource | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const source: AdSource = {};
  for (const key of AD_SOURCE_KEYS) {
    const value = cleanValue(record[key]);
    if (!value) continue;
    if (key === "landing" && !value.startsWith("/")) continue;
    if (key === "referrer" && !/^[a-z0-9.-]+$/i.test(value)) continue;
    source[key] = value;
  }
  return Object.keys(source).length ? source : null;
}

/** The form field's value, as sent by the browser. Anything unreadable is treated as no record. */
export function parseAdSource(raw: string): AdSource | null {
  if (!raw || raw.length > 4000) return null;
  try {
    return cleanAdSource(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Whether the address carried an ad click ID or a campaign tag. */
export function hasAdTags(source: AdSource | null): boolean {
  return Boolean(source) && [...AD_CLICK_KEYS, ...AD_TAG_KEYS].some((key) => source![key]);
}

/** What one page view says about where the visitor came from. `ownHost` referrers are our own pages. */
export function adSourceFromVisit(search: string, pathname: string, referrer: string, ownHost: string): AdSource {
  const params = new URLSearchParams(search);
  let referrerHost = "";
  try {
    referrerHost = referrer ? new URL(referrer).hostname : "";
  } catch {
    // Not an address. Leave it out.
  }
  return (
    cleanAdSource({
      ...Object.fromEntries([...AD_CLICK_KEYS, ...AD_TAG_KEYS].map((key) => [key, params.get(key) ?? ""])),
      landing: pathname,
      referrer: referrerHost && referrerHost !== ownHost ? referrerHost : "",
    }) ?? {}
  );
}

/**
 * Notes this page view. The first view of the visit is kept, and a later one replaces it only when it
 * arrives with an ad click ID or a campaign tag. Browser only. Does nothing when storage is blocked.
 */
export function rememberAdSource(): void {
  try {
    const visit = adSourceFromVisit(location.search, location.pathname, document.referrer, location.hostname);
    if (!hasAdTags(visit) && sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visit));
  } catch {
    // Storage can be blocked. The quote is sent without a source.
  }
}

/** The stored record for the quote form to send, or an empty string. Browser only. */
export function storedAdSource(): string {
  try {
    return sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** One line for the lead email, for example "Google Ads · campaign brisbane-scrap · landed on /". */
export function describeAdSource(source: AdSource | null): string {
  if (!source) return "";
  const tagged = [source.utm_source, source.utm_medium].filter(Boolean).join(" / ");
  let channel = "Direct visit";
  if (AD_CLICK_KEYS.some((key) => source[key])) channel = tagged ? `Google Ads (${tagged})` : "Google Ads";
  else if (tagged) channel = tagged;
  else if (source.referrer) channel = `Link from ${source.referrer}`;
  return [
    channel,
    source.utm_campaign && `campaign ${source.utm_campaign}`,
    source.utm_term && `keyword ${source.utm_term}`,
    source.utm_content && `ad ${source.utm_content}`,
    source.landing && `landed on ${source.landing}`,
  ]
    .filter(Boolean)
    .join(" · ");
}
