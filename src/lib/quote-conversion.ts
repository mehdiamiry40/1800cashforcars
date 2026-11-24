import { track } from "@vercel/analytics";
import { measureOpenAiLead } from "@/lib/openai-ads";

type Gtag = (...args: unknown[]) => void;

/**
 * Google Ads conversion for a tap on the phone number, as "AW-11027669589/<label>". Blank sends nothing.
 * To switch it on, create a conversion action in Google Ads (Goals > Conversions > New conversion action >
 * Website > "Phone number clicks" or a manual "Contact" action) and paste its `send_to` value here.
 */
export const GOOGLE_ADS_CALL_CONVERSION = "";

/** Tells Google Ads that a phone link was tapped. Does nothing until the conversion above is set. */
export function reportCallTap(sendTo: string = GOOGLE_ADS_CALL_CONVERSION): boolean {
  if (!sendTo) return false;
  const gtag = (window as { gtag?: Gtag }).gtag;
  if (!gtag) return false;
  gtag("event", "conversion", { send_to: sendTo });
  return true;
}

/**
 * Browser-side measurement for one accepted quote: Vercel Analytics, the Google Ads conversion and the
 * ChatGPT Ads lead. Call it only for a real lead. Honeypots, validation errors and rate limits are not leads.
 */
export function reportQuoteLead(ref: string | null, page: string, form: string): void {
  track("quote_submitted", { page, form });
  // Google Ads conversion: "1800CFC - Quote form".
  (window as { gtag?: Gtag }).gtag?.("event", "conversion", {
    send_to: "AW-11027669589/ZYZ_CMOYvYwdENXEs4op",
  });
  // One ChatGPT Ads lead per quote reference.
  if (ref) measureOpenAiLead(ref);
}
