import { track } from "@vercel/analytics";
import { measureOpenAiLead } from "@/lib/openai-ads";

/**
 * Browser-side measurement for one accepted quote: Vercel Analytics, the Google Ads conversion and the
 * ChatGPT Ads lead. Call it only for a real lead. Honeypots, validation errors and rate limits are not leads.
 */
export function reportQuoteLead(ref: string | null, page: string, form: string): void {
  track("quote_submitted", { page, form });
  // Google Ads conversion: "1800CFC - Quote form".
  (window as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "conversion", {
    send_to: "AW-11027669589/ZYZ_CMOYvYwdENXEs4op",
  });
  // One ChatGPT Ads lead per quote reference.
  if (ref) measureOpenAiLead(ref);
}
