// Hosts observed on the live site (page view, including the Google tag's lazy load).
// Supabase, maps, and registration APIs are server-side or plain links, so they are not listed.
// Vercel Web Analytics loads a same-origin script and beacons to /_vercel/insights, covered by 'self'.

export const CSP_HASH_PLACEHOLDER = "__CSP_INLINE_HASHES__";

const GOOGLE_TAG_SCRIPT_HOSTS = ["https://www.googletagmanager.com", "https://googleads.g.doubleclick.net"];

const GOOGLE_TAG_CONNECT_HOSTS = [
  "https://www.google.com",
  "https://ad.doubleclick.net",
  "https://googleads.g.doubleclick.net",
  // Quote success calls gtag('event','conversion'), which fetches this host.
  // It stays off script-src. vercel.live is not added.
  "https://www.googleadservices.com",
];

// gtag.js is loaded from googletagmanager.com. A warm tag on the preview also requested
// https://www.googletagmanager.com/a as an image (gtm.js / gtag.config).
// Australian visitors get the remarketing pixel from www.google.com.au.
// Google's Ads CSP guidance lists www.googleadservices.com on img-src for
// conversion and remarketing pixels. The same host is also on connect-src
// because a successful quote fires a conversion fetch, not only an image.
const GOOGLE_TAG_IMG_HOSTS = [
  "https://www.google.com",
  "https://www.google.com.au",
  "https://www.googleadservices.com",
  "https://www.googletagmanager.com",
  "https://googleads.g.doubleclick.net",
];

// ChatGPT Ads Measurement Pixel (https://developers.openai.com/ads/measurement-pixel).
// script-src loads oaiq.min.js. connect-src sends events and fetches per-pixel config.
// img-src is the image-request fallback. The inline bootstrap is hashed; do not add 'unsafe-inline'.
const OPENAI_ADS_SCRIPT_HOSTS = ["https://bzrcdn.openai.com"];
const OPENAI_ADS_CONNECT_HOSTS = ["https://bzr.openai.com", "https://bzrcdn.openai.com"];
const OPENAI_ADS_IMG_HOSTS = ["https://bzr.openai.com"];

function join(directive: string, sources: string[]): string {
  return `${directive} ${sources.join(" ")}`;
}

/**
 * Production policy. `scriptHashes` are `'sha256-...'` sources.
 * An empty list leaves a placeholder that `scripts/csp-hashes.ts` must replace
 * inside the build output Vercel serves. Shipping the placeholder blocks every inline script.
 */
export function buildContentSecurityPolicy(scriptHashes: string[]): string {
  const hashes = scriptHashes.length > 0 ? [...scriptHashes].sort() : [CSP_HASH_PLACEHOLDER];
  return [
    join("default-src", ["'self'"]),
    join("script-src", ["'self'", ...hashes, ...GOOGLE_TAG_SCRIPT_HOSTS, ...OPENAI_ADS_SCRIPT_HOSTS]),
    join("script-src-attr", ["'none'"]),
    join("style-src-elem", ["'self'"]),
    join("style-src-attr", ["'unsafe-inline'"]),
    join("img-src", ["'self'", "data:", ...GOOGLE_TAG_IMG_HOSTS, ...OPENAI_ADS_IMG_HOSTS]),
    join("font-src", ["'self'"]),
    join("connect-src", ["'self'", ...GOOGLE_TAG_CONNECT_HOSTS, ...OPENAI_ADS_CONNECT_HOSTS]),
    join("frame-src", ["'none'"]),
    join("worker-src", ["'self'"]),
    join("object-src", ["'none'"]),
    join("base-uri", ["'self'"]),
    join("form-action", ["'self'"]),
    join("frame-ancestors", ["'none'"]),
    "upgrade-insecure-requests",
  ].join("; ");
}

/** React's development overlay needs eval, and dev inline scripts change every compile. */
export function buildDevContentSecurityPolicy(): string {
  return [
    join("default-src", ["'self'"]),
    join("script-src", ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...GOOGLE_TAG_SCRIPT_HOSTS, ...OPENAI_ADS_SCRIPT_HOSTS]),
    join("script-src-attr", ["'none'"]),
    join("style-src-elem", ["'self'", "'unsafe-inline'"]),
    join("style-src-attr", ["'unsafe-inline'"]),
    join("img-src", ["'self'", "data:", "blob:", ...GOOGLE_TAG_IMG_HOSTS, ...OPENAI_ADS_IMG_HOSTS]),
    join("font-src", ["'self'", "data:"]),
    join("connect-src", ["'self'", ...GOOGLE_TAG_CONNECT_HOSTS, ...OPENAI_ADS_CONNECT_HOSTS, "ws:", "wss:"]),
    join("frame-src", ["'none'"]),
    join("worker-src", ["'self'", "blob:"]),
    join("object-src", ["'none'"]),
    join("base-uri", ["'self'"]),
    join("form-action", ["'self'"]),
    join("frame-ancestors", ["'none'"]),
  ].join("; ");
}

export function directiveValue(policy: string, name: string): string {
  const match = policy
    .split(";")
    .map((part) => part.trim())
    .find((part) => part === name || part.startsWith(`${name} `));
  if (!match) throw new Error(`CSP is missing ${name}`);
  return match.slice(name.length).trim();
}

export function assertProductionScriptSrc(policy: string): void {
  const scriptSrc = directiveValue(policy, "script-src");
  if (scriptSrc.includes("'unsafe-inline'") || scriptSrc.includes("'unsafe-eval'")) {
    throw new Error(`production script-src must not allow unsafe-inline or unsafe-eval: ${scriptSrc}`);
  }
  if (scriptSrc.includes(CSP_HASH_PLACEHOLDER) || policy.includes(CSP_HASH_PLACEHOLDER)) {
    throw new Error("production CSP still contains the inline-script hash placeholder");
  }
  if (!scriptSrc.includes("'sha256-")) {
    throw new Error("production script-src has no sha256 hashes");
  }
}

export function missingScriptHashes(policy: string, required: string[]): string[] {
  const scriptSrc = directiveValue(policy, "script-src");
  return required.filter((hash) => !scriptSrc.includes(hash));
}
