import { OPENAI_ADS_PIXEL_ID } from "@/lib/site";

const OPENAI_ADS_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js";

type Oaiq = (...args: unknown[]) => void;

const measuredLeadIds = new Set<string>();

function getOaiq(): Oaiq | null {
  if (typeof window === "undefined") return null;
  const candidate = (window as Window & { oaiq?: unknown }).oaiq;
  return typeof candidate === "function" ? (candidate as Oaiq) : null;
}

/**
 * Official Measurement Pixel bootstrap. `next/script` puts this in the initial
 * HTML on every page, and the CSP build hashes it. The queue is installed
 * before the SDK arrives, then `init` runs with the pixel ID.
 */
export function openAiAdsBootstrapScript(pixelId: string = OPENAI_ADS_PIXEL_ID): string {
  if (!pixelId) throw new Error("OPENAI_ADS_PIXEL_ID is empty");
  return `(function (w, d, s, u) {
  if (w.oaiq) return;
  var q = function () {
    q.q.push(arguments);
  };
  q.q = [];
  w.oaiq = q;
  var js = d.createElement(s);
  js.async = true;
  js.src = u;
  var f = d.getElementsByTagName(s)[0];
  f.parentNode.insertBefore(js, f);
})(window, document, "script", ${JSON.stringify(OPENAI_ADS_SDK_URL)});
oaiq("init", { pixelId: ${JSON.stringify(pixelId)} });
`;
}

/** Quote reference for a real successful lead. Honeypots, fast fills, validation errors, and rate limits are not leads. */
export function quoteLeadEventId(state: { ok: boolean; lead?: boolean; ref?: string } | null): string | null {
  if (!state?.ok || state.lead !== true) return null;
  if (typeof state.ref !== "string" || state.ref.length === 0) return null;
  return state.ref;
}

/** Standard lead, once per quote reference. Does nothing when the pixel queue is not installed. */
export function measureOpenAiLead(eventId: string): boolean {
  if (!eventId || measuredLeadIds.has(eventId)) return false;
  const oaiq = getOaiq();
  if (!oaiq) return false;
  measuredLeadIds.add(eventId);
  oaiq("measure", "lead_created", { type: "customer_action" }, { event_id: eventId });
  return true;
}

/** Phone-link click. SMS taps are not call clicks. */
export function measureOpenAiCallClick(): boolean {
  const oaiq = getOaiq();
  if (!oaiq) return false;
  oaiq("measure", "custom", { type: "custom" }, { custom_event_name: "call_click" });
  return true;
}
