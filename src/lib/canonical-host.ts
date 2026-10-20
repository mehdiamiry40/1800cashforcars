// Public production hosts that must not be indexed as copies of the site.
export const CANONICAL_HOST = "1800cashforcars.com.au";
export const CANONICAL_ORIGIN = "https://1800cashforcars.com.au";

/** The Vercel production alias. Preview and per-deployment URLs use other *.vercel.app hosts. */
export const PRODUCTION_VERCEL_ALIAS = "1800cashforcars.vercel.app";

export function hostnameOf(hostHeader: string | null): string {
  if (!hostHeader) return "";
  const value = hostHeader.trim().toLowerCase();
  if (value.startsWith("[")) {
    const end = value.indexOf("]");
    return end === -1 ? value : value.slice(1, end);
  }
  return value.split(":")[0] ?? "";
}

export function isLocalDevHost(host: string): boolean {
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0" || host.endsWith(".localhost");
}

/** Preview and deployment URLs. The public production alias is not one of these. */
export function isVercelNonProductionHost(host: string): boolean {
  return host.endsWith(".vercel.app") && host !== PRODUCTION_VERCEL_ALIAS;
}

/**
 * Permanent redirect target for a non-canonical host, or null when the request should be served.
 * Local dev, `next dev`, Vercel preview deployments, and non-production *.vercel.app hosts are left alone.
 */
export function canonicalRedirectUrl(hostHeader: string | null, pathname: string, search = ""): string | null {
  if (process.env.NODE_ENV === "development") return null;
  if (process.env.VERCEL_ENV === "preview") return null;

  const host = hostnameOf(hostHeader);
  if (!host || host === CANONICAL_HOST || isLocalDevHost(host) || isVercelNonProductionHost(host)) return null;

  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${CANONICAL_ORIGIN}${path}${search}`;
}
