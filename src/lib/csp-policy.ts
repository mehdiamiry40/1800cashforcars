// Hosts observed on the live site (page view, including the Google tag's lazy load).
// Supabase, maps, and registration APIs are server-side or plain links, so they are not listed.
// Vercel Web Analytics loads a same-origin script and beacons to /_vercel/insights, covered by 'self'.

export const CSP_HASH_PLACEHOLDER = "__CSP_INLINE_HASHES__";

const GOOGLE_TAG_SCRIPT_HOSTS = ["https://www.googletagmanager.com", "https://googleads.g.doubleclick.net"];

const GOOGLE_TAG_CONNECT_HOSTS = [
  "https://www.google.com",
  "https://ad.doubleclick.net",
  "https://googleads.g.doubleclick.net",
];

const GOOGLE_TAG_IMG_HOSTS = ["https://www.google.com", "https://googleads.g.doubleclick.net"];

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
    join("script-src", ["'self'", ...hashes, ...GOOGLE_TAG_SCRIPT_HOSTS]),
    join("script-src-attr", ["'none'"]),
    join("style-src-elem", ["'self'"]),
    join("style-src-attr", ["'unsafe-inline'"]),
    join("img-src", ["'self'", "data:", ...GOOGLE_TAG_IMG_HOSTS]),
    join("font-src", ["'self'"]),
    join("connect-src", ["'self'", ...GOOGLE_TAG_CONNECT_HOSTS]),
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
    join("script-src", ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...GOOGLE_TAG_SCRIPT_HOSTS]),
    join("script-src-attr", ["'none'"]),
    join("style-src-elem", ["'self'", "'unsafe-inline'"]),
    join("style-src-attr", ["'unsafe-inline'"]),
    join("img-src", ["'self'", "data:", "blob:", ...GOOGLE_TAG_IMG_HOSTS]),
    join("font-src", ["'self'", "data:"]),
    join("connect-src", ["'self'", ...GOOGLE_TAG_CONNECT_HOSTS, "ws:", "wss:"]),
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
