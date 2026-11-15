"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { reportQuoteLead } from "@/lib/quote-conversion";
import { QUOTE_REF_PATTERN } from "@/lib/quote-ref";
import { QUOTE_SENT_PATH } from "@/lib/quote-sent";

/**
 * The reference line on /quote/sent, read from the address. It also reports the lead to the ad tags,
 * which the form's script would have done had it been running. Once per reference per tab, so a
 * reload does not count twice.
 */
export function SentReference() {
  const raw = useSearchParams().get("ref") ?? "";
  const reference = QUOTE_REF_PATTERN.test(raw) ? raw : null;

  useEffect(() => {
    if (!reference) return;
    const key = `quote-lead-${reference}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be blocked. Reporting once more is better than not at all.
    }
    reportQuoteLead(reference, QUOTE_SENT_PATH, "page");
  }, [reference]);

  return reference ? <p className="mt-1">Your reference: {reference}</p> : null;
}
