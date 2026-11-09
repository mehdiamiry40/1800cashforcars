import { Resend } from "resend";
import { MESSAGES, leadSubject, leadText, validateQuote, type FormResponse } from "@/lib/quote";
import { createRateLimiter } from "@/lib/rate-limit";
import { EMAIL, SITE_ORIGIN } from "@/lib/site";

const allow = createRateLimiter(5, 10 * 60 * 1000);
const json = (body: FormResponse, status = 200) => Response.json(body, { status });

/** reCAPTCHA v3, checked only when RECAPTCHA_SECRET_KEY is set (as it was on WordPress). */
async function passesRecaptcha(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean; score?: number };
    return Boolean(data.success) && (data.score ?? 0) >= 0.5;
  } catch (error) {
    // Google being unreachable must not cost a real lead.
    console.error("[contact] reCAPTCHA check failed, accepting submission", error);
    return true;
  }
}

export async function POST(request: Request) {
  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
    if (!input || typeof input !== "object") throw new Error("not an object");
  } catch {
    return json({ status: "mail_failed", message: MESSAGES.failed }, 400);
  }

  const { quote, invalid } = validateQuote(input);
  if (invalid.length) return json({ status: "validation_failed", message: MESSAGES.invalid, invalid_fields: invalid });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allow(ip)) return json({ status: "mail_failed", message: MESSAGES.rateLimited }, 429);
  if (!(await passesRecaptcha(input._wpcf7_recaptcha_response, ip))) {
    return json({ status: "spam", message: MESSAGES.failed });
  }

  const page = typeof input._page === "string" ? input._page.slice(0, 300) : "";
  const text = leadText(quote, page.startsWith("/") ? SITE_ORIGIN + page : SITE_ORIGIN);
  // Backup copy in the function logs, in case the email below is not delivered.
  console.log(`[lead] ${JSON.stringify({ ...quote, page })}`);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("[contact] LEAD NOT DELIVERED: RESEND_API_KEY or LEAD_FROM_EMAIL is not set");
    return json({ status: "mail_failed", message: MESSAGES.failed }, 500);
  }
  const to = (process.env.LEAD_TO_EMAIL ?? EMAIL).split(",").map((address) => address.trim()).filter(Boolean);
  const resend = new Resend(apiKey);
  for (let attempt = 1; attempt <= 2; attempt++) {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: quote["your-email"],
      subject: leadSubject(quote),
      text,
    });
    if (!error) return json({ status: "mail_sent", message: MESSAGES.sent });
    console.error(`[contact] email attempt ${attempt} failed`, error);
  }
  console.error("[contact] LEAD NOT DELIVERED after retry");
  return json({ status: "mail_failed", message: MESSAGES.failed }, 502);
}
