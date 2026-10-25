export const QUOTE_FIELDS = [
  ["ref", "Reference"],
  ["name", "Name"],
  ["phone", "Phone"],
  ["email", "Email"],
  ["address", "Suburb / address"],
  ["make", "Make"],
  ["model", "Model"],
  ["year", "Year"],
  ["vehicle", "Vehicle"],
  ["description", "Description"],
  ["expected", "Price"],
  ["page", "Sent from"],
] as const;

export type QuoteField = (typeof QUOTE_FIELDS)[number][0];
export type QuoteLead = Record<QuoteField, string>;

type FetchLike = typeof fetch;

export class QuoteInsertError extends Error {
  readonly status: number;
  readonly body: string;

  constructor(status: number, body: string) {
    super(`Supabase insert failed (${status})${body ? `: ${body.slice(0, 300)}` : ""}`);
    this.name = "QuoteInsertError";
    this.status = status;
    this.body = body;
  }
}

export function isQuoteRefConflict(err: unknown): boolean {
  return err instanceof QuoteInsertError && (err.status === 409 || err.body.includes("23505"));
}

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
      ref: lead.ref,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      // The live table has no make, model or year columns. Store them in vehicle as "2012 Toyota Corolla".
      // expected is NOT NULL text. A blank price is stored as an empty string, after the same normalisation as the email.
      vehicle: lead.vehicle || [lead.year, lead.make, lead.model].filter(Boolean).join(" "),
      description: lead.description,
      expected: lead.expected,
      page: lead.page,
      user_agent: userAgent,
    }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new QuoteInsertError(res.status, detail);
  }
}
