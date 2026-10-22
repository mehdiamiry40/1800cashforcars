// In-memory sliding window keyed by client IP. Each serverless instance has its own
// map, so a limit is best-effort across the fleet and resets when that instance
// goes cold. A shared store such as Upstash would make the limit durable; that is
// a new service and new environment variables, so it is not wired up here.

export type HeaderSource = { get(name: string): string | null };

export type RatePolicy = { limit: number; windowMs: number };

const TEN_MINUTES = 10 * 60 * 1000;

/** Complete quote submissions. Five in ten minutes is enough for a genuine retry, not a script. */
export const QUOTE_LIMIT: RatePolicy = { limit: 5, windowMs: TEN_MINUTES };

/** Plate and VIN lookups. Allows mistypes and switching between rego and VIN. */
export const AUTOVAL_LOOKUP_LIMIT: RatePolicy = { limit: 20, windowMs: TEN_MINUTES };

/** Model valuations. A couple of cars in one sitting, then it stops to limit AI cost. */
export const AUTOVAL_VALUATE_LIMIT: RatePolicy = { limit: 5, windowMs: TEN_MINUTES };

const hits = new Map<string, number[]>();

/** First address in x-forwarded-for (Vercel puts the client first), then x-real-ip. */
export function clientIp(headers: HeaderSource): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    for (const part of forwarded.split(",")) {
      const ip = part.trim();
      if (ip) return ip;
    }
  }
  const real = headers.get("x-real-ip")?.trim();
  return real || "unknown";
}

export type RateDecision = { limited: false } | { limited: true; retryAfter: number };

/** Records a hit. `limited` is true when the key is already at the policy's maximum. */
export function rateLimit(key: string, policy: RatePolicy, now = Date.now()): RateDecision {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < policy.windowMs);
  if (recent.length >= policy.limit) {
    hits.set(key, recent);
    const retryAfter = Math.max(1, Math.ceil((policy.windowMs - (now - recent[0])) / 1000));
    return { limited: true, retryAfter };
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const candidate of hits.keys()) {
      if (candidate !== key) {
        hits.delete(candidate);
        break;
      }
    }
  }
  return { limited: false };
}
