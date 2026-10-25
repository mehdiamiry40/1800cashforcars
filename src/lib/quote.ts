import { Resend } from "resend";
import { site } from "@/lib/site";
import type { QuoteState } from "@/lib/quote-state";
import { quoteEmailError } from "@/lib/quote-email";
import { generateQuoteRef } from "@/lib/quote-ref";
import { insertQuoteSubmission, isQuoteRefConflict, QUOTE_FIELDS, type QuoteLead } from "@/lib/quote-store";
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

// Humans can't fill the form in under ~2.5s. An empty value means JavaScript didn't run, so we let it through.
export const MIN_SUBMIT_MS = 2500;

export const QUOTE_RATE_LIMIT_MESSAGE = `You've sent several quote requests recently. Please wait a few minutes and try again, or call or text ${site.phoneDisplay}.`;

export const QUOTE_GENERIC_ERROR = `Sorry, something went wrong. Please call or text ${site.phoneDisplay} and we'll give you a price.`;

const EMAIL_FAILED = `Sorry, your details didn't reach us. Please call or text ${site.phoneDisplay} and we'll give you a price.`;

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

export async function processQuote(formData: FormData, headerSource: HeaderSource, now = Date.now()): Promise<QuoteResult> {
  try {
    // Honeypot: real visitors never fill this hidden field. Pretend it worked so a bot doesn't retry.
    if (formData.get("company")) return { ok: true, message: "Thanks!", status: 200 };

    const elapsedMs = parseInt(String(formData.get("e") ?? ""), 10);
    if (Number.isFinite(elapsedMs) && elapsedMs < MIN_SUBMIT_MS) {
      console.warn("[lead] dropped: submitted too fast");
      return { ok: true, message: "", status: 200 };
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

    // Email, description and price stay optional. Make, model and year do not.
    if (!lead.name || !lead.phone || !lead.address || !lead.make || !lead.model || !yearInput) {
      return {
        ok: false,
        message: "Please enter your name, mobile number, suburb, make, model and year.",
        status: 400,
      };
    }
    const yearProblem = quoteYearError(yearInput, new Date(now));
    if (yearProblem) {
      return { ok: false, message: yearProblem, status: 400 };
    }
    if (!/^[\d\s()+-]{8,}$/.test(lead.phone)) {
      return { ok: false, message: "Please enter a valid phone number.", status: 400 };
    }
    const emailProblem = quoteEmailError(lead.email);
    if (emailProblem) {
      return { ok: false, message: emailProblem, status: 400 };
    }

    lead.year = yearInput;
    lead.vehicle = `${yearInput} ${lead.make} ${lead.model}`;

    const ip = clientIp(headerSource);
    const decision = rateLimit(`quote:${ip}`, QUOTE_LIMIT, now);
    if (decision.limited) {
      console.warn("[lead] rate limited", ip);
      return { ok: false, message: QUOTE_RATE_LIMIT_MESSAGE, status: 429, retryAfter: decision.retryAfter };
    }

    // Honeypot, timing, validation and the rate limit have all passed. A failed insert must not block the email.
    // A duplicate reference (409 / 23505) gets a new code, up to 3 retries.
    for (let attempt = 0; attempt < 4; attempt++) {
      lead.ref = generateQuoteRef();
      try {
        await insertQuoteSubmission(lead, headerSource.get("user-agent"));
        break;
      } catch (err) {
        if (isQuoteRefConflict(err) && attempt < 3) continue;
        console.error("[lead] supabase insert failed", err);
        break;
      }
    }

    const subject = `[${lead.ref}] New quote request: ${lead.vehicle.split("\n")[0].slice(0, 60)}${lead.description ? ` (${lead.description.split("\n")[0].slice(0, 40)})` : ""}${lead.address ? ` — ${lead.address}` : ""}${lead.expected ? ` — wants ${lead.expected}` : ""}`;
    const rows = QUOTE_FIELDS.filter(([k]) => lead[k])
      .map(([k, label]) => `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${label}</td><td style="padding:6px 12px;font-weight:600;white-space:pre-wrap">${escape(lead[k])}</td></tr>`)
      .join("");
    const text = QUOTE_FIELDS.filter(([k]) => lead[k]).map(([k, label]) => `${label}: ${lead[k]}`).join("\n");

    // Always record the lead in the function logs so nothing is lost if email fails.
    console.log("[lead]", JSON.stringify(lead));

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.LEAD_TO_EMAIL;
    if (!apiKey || !to) {
      console.error("[lead] RESEND_API_KEY or LEAD_TO_EMAIL not set — lead only recorded in logs");
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
    let { error } = await resend.emails.send(email, { idempotencyKey });
    if (error) {
      console.warn("[lead] email failed, retrying", error);
      await new Promise((r) => setTimeout(r, 1500));
      ({ error } = await resend.emails.send(email, { idempotencyKey }));
    }
    if (error) {
      // Nobody would see this lead except in the logs, so ask the customer to get in touch directly.
      console.error("[lead] email failed, LEAD NOT DELIVERED", error);
      return { ok: false, message: EMAIL_FAILED, status: 502, ref: lead.ref };
    }

    return { ok: true, message: "", status: 200, lead: true, ref: lead.ref };
  } catch (err) {
    console.error("[lead] submission failed", err);
    return { ok: false, message: QUOTE_GENERIC_ERROR, status: 500 };
  }
}
