export const QUOTE_FIELDS = [
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["address", "Suburb / address"],
  ["vehicle", "Vehicle"],
  ["description", "Description"],
  ["expected", "Hoping for"],
  ["page", "Sent from"],
] as const;

export type QuoteField = (typeof QUOTE_FIELDS)[number][0];
export type QuoteLead = Record<QuoteField, string>;

type FetchLike = typeof fetch;

/** Inserts one accepted quote. Does nothing when either Supabase env var is missing. */
export async function insertQuoteSubmission(
  lead: QuoteLead,
  userAgent: string | null,
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<void> {
  const url = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return;

  const res = await fetchImpl(`${url.replace(/\/$/, "")}/rest/v1/quote_submissions`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      vehicle: lead.vehicle,
      description: lead.description,
      expected: lead.expected,
      page: lead.page,
      user_agent: userAgent,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase insert failed (${res.status})${detail ? `: ${detail.slice(0, 300)}` : ""}`);
  }
}
