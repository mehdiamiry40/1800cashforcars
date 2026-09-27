"use server";

import { Resend } from "resend";
import { site } from "@/lib/site";

export type QuoteState = { ok: boolean; message: string } | null;

const FIELDS = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["address", "Suburb / address"],
  ["vehicle", "Vehicle details"],
  ["page", "Sent from"],
] as const;

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export async function submitQuote(
  _prev: QuoteState,
  formData: FormData,
): Promise<QuoteState> {
  // Honeypot: real visitors never fill this hidden field.
  if (formData.get("company")) return { ok: true, message: "Thanks!" };

  const lead = Object.fromEntries(
    FIELDS.map(([key]) => [
      key,
      String(formData.get(key) ?? "")
        .trim()
        .slice(0, 2000),
    ]),
  ) as Record<(typeof FIELDS)[number][0], string>;

  if (!lead.name || !lead.phone || !lead.vehicle) {
    return {
      ok: false,
      message: "Please enter your name, phone number and vehicle details.",
    };
  }
  if (
    !/^[\d\s()+-]+$/.test(lead.phone) ||
    !/^\d{8,15}$/.test(lead.phone.replace(/\D/g, ""))
  ) {
    return { ok: false, message: "Please enter a valid phone number." };
  }

  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return {
      ok: false,
      message: "Please enter a valid email address, or leave email blank.",
    };
  }

  const failure = {
    ok: false,
    message:
      "We couldn't send your request. Your details are still here — please try again or call us for a quote.",
  };
  const subject = `New quote request: ${lead.vehicle.split("\n")[0].slice(0, 60)}${lead.address ? ` — ${lead.address}` : ""}`;
  const rows = FIELDS.filter(([k]) => lead[k])
    .map(
      ([k, label]) =>
        `<tr><td style="padding:6px 12px;color:#555;vertical-align:top">${label}</td><td style="padding:6px 12px;font-weight:600;white-space:pre-wrap">${escape(lead[k])}</td></tr>`,
    )
    .join("");
  const text = FIELDS.filter(([k]) => lead[k])
    .map(([k, label]) => `${label}: ${lead[k]}`)
    .join("\n");

  // Always record the lead in the function logs so nothing is lost if email fails.
  console.log("[lead]", JSON.stringify(lead));

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!apiKey || !to) {
    console.error(
      "[lead] RESEND_API_KEY or LEAD_TO_EMAIL not set — lead only recorded in logs",
    );
    return failure;
  }

  const domain = process.env.RESEND_EMAIL_DOMAIN || site.domain;
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: `${site.name} <quotes@${domain}>`,
      to: to.split(",").map((s) => s.trim()),
      replyTo: lead.email || undefined,
      subject,
      text,
      html: `<h2 style="font-family:sans-serif">${escape(subject)}</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows}</table>`,
    });
    if (error) {
      console.error("[lead] email failed", error.name);
      return failure;
    }
  } catch {
    console.error("[lead] email request failed");
    return failure;
  }

  return { ok: true, message: "" };
}
