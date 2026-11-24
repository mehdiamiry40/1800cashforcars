import { after } from "next/server";
import { Resend } from "resend";
import { AD_SOURCE_FIELD, describeAdSource, parseAdSource, type AdSource } from "@/lib/ad-source";
import { scheduleOpenAiServerLead } from "@/lib/openai-ads-capi";
import { site } from "@/lib/site";
import type { QuoteState } from "@/lib/quote-state";
import { quoteEmailError } from "@/lib/quote-email";
import { generateQuoteRef } from "@/lib/quote-ref";
import { MIN_SUBMIT_MS, QUOTE_HONEYPOT_FIELD } from "@/lib/quote-spam";
import { insertQuoteSubmission, isAttributionColumnMissing, isQuoteRefConflict, QUOTE_FIELDS, type QuoteLead } from "@/lib/quote-store";
import { quoteYearError } from "@/lib/quote-year";
import { QUOTE_LIMIT, clientIp, rateLimit, type HeaderSource } from "@/lib/rate-limit";

export type QuoteResult = {
  ok: boolean;
  message: string;
  lead?: boolean;
  ref?: string;
  status: number;
  retryAfter?: number;
};

export const QUOTE_RATE_LIMIT_MESSAGE = `You've sent several quote requests recently. Please wait a few minutes and try again, or call or text ${site.phoneDisplay}.`;

export const QUOTE_GENERIC_ERROR = `Sorry, something went wrong. Please call or text ${site.phoneDisplay} and we'll give you a price.`;

const EMAIL_FAILED = `Sorry, your details didn't reach us. Please call or text ${site.phoneDisplay} and we'll give you a price.`;

export const QUOTE_TOO_FAST_MESSAGE = `Sorry, that didn't go through. Please press the button again, or call or text ${site.phoneDisplay}.`;

// What a bot that filled the hidden field is told, so it doesn't retry.
const SPAM_ACCEPTED: QuoteResult = { ok: true, message: "Thanks!", status: 200 };

/**
 * Waits before each background resend, once both attempts made while the visitor waits have failed.
 * They cover a mail-provider outage of a few minutes. Tests shorten them.
 */
export const leadEmailRetry = { delaysMs: [15_000, 45_000, 120_000] };

/**
 * Keeps trying to deliver the lead email after the visitor has been told to call. The same idempotency
 * key is used throughout, so the lead can never arrive twice. Runs after the response via `after`; with
 * no request scope (unit tests) it runs detached.
 */
function scheduleEmailRetry(send: () => Promise<unknown>, ref: string): void {
  const task = async () => {
    for (const delay of leadEmailRetry.delaysMs) {
      await new Promise<void>((resolve) => setTimeout(resolve, delay).unref());
      const error = await send().catch((err: unknown) => err ?? new Error("send failed"));
      if (!error) {
        console.warn("[lead] email delivered on a background retry", ref);
        return;
      }
    }
    console.error("[lead] email failed on every retry, LEAD NOT DELIVERED", ref);
  };
  try {
    after(task);
  } catch {
    void task();
  }
}

// Same gate as the browser pixel: a saved quote the visitor is told succeeded. Honeypots, fast fills,
// validation errors, rate limits and undelivered emails are not leads. Scheduling never changes the result.
function reportOpenAiLead(lead: QuoteLead, headerSource: HeaderSource, timestampMs: number) {
  try {
    scheduleOpenAiServerLead({
      ref: lead.ref,
      email: lead.email,
      phone: lead.phone,
      page: lead.page,
      cookieHeader: headerSource.get("cookie"),
      userAgent: headerSource.get("user-agent"),
      ip: clientIp(headerSource),
      timestampMs,
    });
  } catch {
    console.error("[openai-ads] could not schedule server lead event");
  }
}

// "2500", "$2,500" or "2.5k" -> "$2,500". Anything else (e.g. "make an offer") is kept as typed.
function formatPrice(raw: string): string {
  const v = raw.slice(0, 40).trim();
  const m = v.replace(/[$,\s]/g, "").match(/^(\d+(?:\.\d+)?)(k)?$/i);
  if (!m) return v;
  const n = Math.round(parseFloat(m[1]) * (m[2] ? 1000 : 1));
  return `$${n.toLocaleString("en-AU")}`;
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function toQuoteState(result: QuoteResult): QuoteState {
  return { ok: result.ok, message: result.message, lead: result.lead, ref: result.ref };
}

/** The first problem with the details, or null when the quote is complete. */
function leadProblem(lead: QuoteLead, yearInput: string, now: number): string | null {
  // Email, description and price stay optional. Make, model and year do not.
  if (!lead.name || !lead.phone || !lead.address || !lead.make || !lead.model || !yearInput) {
    return "Please enter your name, mobile number, suburb, make, model and year.";
  }
  const yearProblem = quoteYearError(yearInput, new Date(now));
  if (yearProblem) return yearProblem;
  if (!/^[\d\s()+-]{8,}$/.test(lead.phone)) return "Please enter a valid phone number.";
  return quoteEmailError(lead.email);
}

/**
 * Saves the lead under a new reference. A duplicate reference (409 / 23505) gets a new code, up to 3 retries.
 * If the table has no attribution column yet, the lead is saved without where it came from, so a
 * migration that has not been applied never costs a saved lead. Resolves to whether a row was saved.
 */
async function storeLead(lead: QuoteLead, userAgent: string | null, spamReason?: string, adSource?: AdSource | null): Promise<boolean> {
  let attribution = adSource;
  for (let attempt = 0; attempt < 4; attempt++) {
    lead.ref = generateQuoteRef();
    try {
      return await insertQuoteSubmission(lead, userAgent, undefined, undefined, spamReason, attribution);
    } catch (err) {
      if (isQuoteRefConflict(err) && attempt < 3) continue;
      if (attribution && isAttributionColumnMissing(err) && attempt < 3) {
        console.warn("[lead] attribution column missing, saving without the ad source");
        attribution = null;
        continue;
      }
      console.error(spamReason ? "[lead] suspected spam not stored" : "[lead] supabase insert failed", err);
      return false;
    }
  }
  return false;
}

export async function processQuote(formData: FormData, headerSource: HeaderSource, now = Date.now()): Promise<QuoteResult> {
  try {
    // Honeypot: real visitors never fill this hidden field. A hit is never emailed, but it is no longer
    // thrown away unseen: a complete one is saved as suspected spam, and every hit is counted in the logs.
    const honeypot = String(formData.get(QUOTE_HONEYPOT_FIELD) ?? "").trim() !== "";

    // An empty value means JavaScript didn't run, so we let it through. A person who trips this is asked
    // to press the button again, which works, so a real quote is never lost to this check.
    const elapsedMs = parseInt(String(formData.get("e") ?? ""), 10);
    if (!honeypot && Number.isFinite(elapsedMs) && elapsedMs < MIN_SUBMIT_MS) {
      console.warn("[lead] sent too fast, asked to resubmit");
      return { ok: false, message: QUOTE_TOO_FAST_MESSAGE, status: 400 };
    }

    const textField = (key: string) => String(formData.get(key) ?? "").trim().slice(0, 2000);
    const yearInput = String(formData.get("year") ?? "").trim();
    const lead: QuoteLead = {
      ref: "",
      name: textField("name"),
      phone: textField("phone"),
      email: textField("email"),
      address: textField("address"),
      make: textField("make"),
      model: textField("model"),
      year: "",
      vehicle: "",
      description: textField("description"),
      expected: formatPrice(textField("expected")),
      page: textField("page"),
    };

    const problem = leadProblem(lead, yearInput, now);
    if (honeypot && problem) {
      console.warn("[lead] suspected spam dropped: honeypot, details incomplete");
      return SPAM_ACCEPTED;
    }
    if (problem) return { ok: false, message: problem, status: 400 };

    lead.year = yearInput;
    lead.vehicle = `${yearInput} ${lead.make} ${lead.model}`;

    const ip = clientIp(headerSource);

    if (honeypot) {
      // Its own limit, so a bot can neither fill the table nor use up a real visitor's allowance.
      if (rateLimit(`quote-spam:${ip}`, QUOTE_LIMIT, now).limited) {
        console.warn("[lead] suspected spam dropped: honeypot, rate limited");
        return SPAM_ACCEPTED;
      }
      const stored = await storeLead(lead, headerSource.get("user-agent"), "honeypot");
      console.warn(`[lead] suspected spam ${stored ? "stored" : "dropped"}: honeypot`);
      return SPAM_ACCEPTED;
    }

    const decision = rateLimit(`quote:${ip}`, QUOTE_LIMIT, now);
    if (decision.limited) {
      console.warn("[lead] rate limited");
      return { ok: false, message: QUOTE_RATE_LIMIT_MESSAGE, status: 429, retryAfter: decision.retryAfter };
    }

    // Where the visitor came from, noted by the form's script. Missing when the browser sent the form itself.
    const adSource = parseAdSource(String(formData.get(AD_SOURCE_FIELD) ?? ""));
    const cameFrom = describeAdSource(adSource);

    // Honeypot, timing, validation and the rate limit have all passed. A failed insert must not block the email.
    const stored = await storeLead(lead, headerSource.get("user-agent"), undefined, adSource);

    const subject = `[${lead.ref}] New quote request: ${lead.vehicle.split("\n")[0].slice(0, 60)}${lead.description ? ` (${lead.description.split("\n")[0].slice(0, 40)})` : ""}${lead.address ? ` — ${lead.address}` : ""}${lead.expected ? ` — wants ${lead.expected}` : ""}`;
    const details: [label: string, value: string][] = QUOTE_FIELDS.filter(([k]) => lead[k]).map(([k, label]) => [label, lead[k]]);
    if (cameFrom) details.push(["Came from", cameFrom]);
    const rows = details
      .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${label}</td><td style="padding:6px 12px;font-weight:600;white-space:pre-wrap">${escape(value)}</td></tr>`)
      .join("");
    const text = details.map(([label, value]) => `${label}: ${value}`).join("\n");

    // The saved row is the record of the lead. Its details go to the function logs only when there is no
    // saved row, so nothing is lost if the email also fails and names and numbers are not logged otherwise.
    if (stored) console.log("[lead] saved", lead.ref);
    else console.log("[lead]", JSON.stringify(cameFrom ? { ...lead, cameFrom } : lead));

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_TO_EMAIL;
    if (!apiKey || !to) {
      console.error("[lead] RESEND_API_KEY or LEAD_TO_EMAIL not set — lead only recorded in logs");
      reportOpenAiLead(lead, headerSource, now);
      return { ok: true, message: "", status: 200, lead: true, ref: lead.ref };
    }

    const domain = process.env.RESEND_EMAIL_DOMAIN || site.domain;
    const resend = new Resend(apiKey);
    const email = {
      from: `${site.name} <quotes@${domain}>`,
      to: to.split(",").map((s) => s.trim()),
      replyTo: lead.email && !quoteEmailError(lead.email) ? lead.email : undefined,
      subject,
      text,
      html: `<h2 style="font-family:sans-serif">${escape(subject)}</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
    };
    // Retry once for a passing hiccup. The idempotency key stops a retry from sending the lead twice.
    const idempotencyKey = `quote-${lead.ref}`;
    const send = async () => (await resend.emails.send(email, { idempotencyKey })).error;
    let error = await send();
    if (error) {
      console.warn("[lead] email failed, retrying", error);
      await new Promise((r) => setTimeout(r, 1500));
      error = await send();
    }
    if (error) {
      // The lead has not reached the inbox, so ask the customer to get in touch directly, and keep
      // trying in the background in case the mail provider recovers.
      console.error("[lead] email failed twice, retrying in the background", lead.ref, error);
      scheduleEmailRetry(send, lead.ref);
      return { ok: false, message: EMAIL_FAILED, status: 502, ref: lead.ref };
    }

    reportOpenAiLead(lead, headerSource, now);
    return { ok: true, message: "", status: 200, lead: true, ref: lead.ref };
  } catch (err) {
    console.error("[lead] submission failed", err);
    return { ok: false, message: QUOTE_GENERIC_ERROR, status: 500 };
  }
}
