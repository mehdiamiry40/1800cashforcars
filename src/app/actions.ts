"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";

export type QuoteState = { ok: boolean; message: string } | null;

const FIELDS = [
  ["year", "Year"],
  ["make", "Make"],
  ["model", "Model"],
  ["condition", "Condition"],
  ["rego", "Rego / VIN"],
  ["postcode", "Suburb / postcode"],
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["notes", "Notes"],
] as const;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function submitQuote(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: real visitors never fill this hidden field.
  if (formData.get("company")) return { ok: true, message: "Thanks!" };

  const lead = Object.fromEntries(
    FIELDS.map(([key]) => [key, String(formData.get(key) ?? "").trim().slice(0, 1000)]),
  ) as Record<(typeof FIELDS)[number][0], string>;

  if (!lead.make || !lead.model || !lead.name || !lead.phone || !lead.postcode) {
    return { ok: false, message: "Please fill in your car, location, name and phone number." };
  }
  if (!/^[\d\s()+-]{8,}$/.test(lead.phone)) {
    return { ok: false, message: "Please enter a valid phone number." };
  }

  const subject = `New quote: ${lead.year} ${lead.make} ${lead.model} — ${lead.postcode}`;
  const rows = FIELDS.filter(([k]) => lead[k])
    .map(([k, label]) => `<tr><td style="padding:6px 12px;color:#55607a">${label}</td><td style="padding:6px 12px;font-weight:600">${escape(lead[k])}</td></tr>`)
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
