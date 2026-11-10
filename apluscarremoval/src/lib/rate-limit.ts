/**
 * In-memory sliding window. Each serverless instance keeps its own counts and a cold start
 * clears them, so this slows a burst from one address; it is not a durable limit.
 */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return function allow(key: string, now = Date.now()): boolean {
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) {
      for (const [k, times] of hits) if (times.every((time) => now - time >= windowMs)) hits.delete(k);
    }
    return true;
  };
}
