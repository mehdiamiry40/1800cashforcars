import { AUTOVAL_LOOKUP_LIMIT, AUTOVAL_VALUATE_LIMIT, clientIp, rateLimit, type HeaderSource } from "@/lib/rate-limit";
import { AUTOVAL_RATE_LIMIT_MESSAGE } from "@/lib/autoval/messages";

export function autovalRateLimitResponse(
  scope: "lookup" | "valuate",
  headerSource: HeaderSource,
  now = Date.now(),
): Response | null {
  const policy = scope === "lookup" ? AUTOVAL_LOOKUP_LIMIT : AUTOVAL_VALUATE_LIMIT;
  const decision = rateLimit(`autoval:${scope}:${clientIp(headerSource)}`, policy, now);
  if (!decision.limited) return null;
  return Response.json(
    { error: AUTOVAL_RATE_LIMIT_MESSAGE },
    { status: 429, headers: { "Retry-After": String(decision.retryAfter) } },
  );
}
