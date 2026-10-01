"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";

export type QuoteState = { ok: boolean; message: string } | null;

const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["address", "Suburb / address"],
  ["vehicle", "Vehicle"],
  ["condition", "Condition"],
  ["expected", "Hoping for"],
  ["notes", "Notes"],
  ["page", "Sent from"],
] as const;

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

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: real visitors never fill this hidden field.
  if (formData.get("company")) return { ok: true, message: "Thanks!" };
  // Time trap: milliseconds between page load and the visitor's last keystroke. Humans can't fill the form in
  // under ~2.5s. If JavaScript is off the field is empty and we let it through.
  const elapsedMs = parseInt(String(formData.get("e") ?? ""), 10);
  if (Number.isFinite(elapsedMs) && elapsedMs < 2500) {
    console.warn("[lead] dropped: submitted too fast");
    return { ok: true, message: "" };
  }

  const lead = Object.fromEntries(
    FIELDS.map(([key]) => [key, String(formData.get(key) ?? "").trim().slice(0, 2000)]),
  ) as Record<(typeof FIELDS)[number][0], string>;

  lead.expected = formatPrice(lead.expected);
  // The form asks for year, make and model in separate boxes; the email shows them as one line.
  if (!lead.vehicle) {
    const part = (k: string) => String(formData.get(k) ?? "").trim().slice(0, 60);
    lead.vehicle = [part("year"), part("make"), part("model")].filter(Boolean).join(" ");
  }

  if (!lead.name || !lead.phone || !lead.vehicle || !lead.condition) {
    return { ok: false, message: "Please enter your name, mobile number, and the car's make, model and condition." };
  }
  if (!/^[\d\s()+-]{8,}$/.test(lead.phone)) {
    return { ok: false, message: "Please enter a valid phone number." };
  }

  const subject = `New quote request: ${lead.vehicle.split("\n")[0].slice(0, 60)}${lead.condition ? ` (${lead.condition.slice(0, 40)})` : ""}${lead.address ? ` — ${lead.address}` : ""}${lead.expected ? ` — wants ${lead.expected}` : ""}`;
  const rows = FIELDS.filter(([k]) => lead[k])
    .map(([k, label]) => `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${label}</td><td style="padding:6px 12px;font-weight:600;white-space:pre-wrap">${escape(lead[k])}</td></tr>`)
    .join("");
  const text = FIELDS.filter(([k]) => lead[k]).map(([k, label]) => `${label}: ${lead[k]}`).join("\n");

  // Always record the lead in the function logs so nothing is lost if email fails.
  console.log("[lead]", JSON.stringify(lead));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[lead] RESEND_API_KEY or LEAD_TO_EMAIL not set — lead only recorded in logs");
    return { ok: true, message: "" };
  }

  const domain = process.env.RESEND_EMAIL_DOMAIN || site.domain;
  const { error } = await new Resend(apiKey).emails.send({
    from: `${site.name} <quotes@${domain}>`,
    to: to.split(",").map((s) => s.trim()),
    replyTo: lead.email || undefined,
    subject,
    text,
    html: `<h2 style="font-family:sans-serif">${escape(subject)}</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
  });
  if (error) console.error("[lead] email failed", error);

  return { ok: true, message: "" };
}
