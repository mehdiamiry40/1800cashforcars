import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { AD_SOURCE_FIELD } from "@/lib/ad-source";
import { processQuote } from "@/lib/quote";
import { QUOTE_HONEYPOT_FIELD } from "@/lib/quote-spam";
import { QUOTE_LIMIT } from "@/lib/rate-limit";
import { insertQuoteSubmission, type QuoteLead } from "@/lib/quote-store";

const ENV_KEYS = ["RESEND_API_KEY", "LEAD_TO_EMAIL", "RESEND_EMAIL_DOMAIN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_ADS_CAPI_KEY"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

const lead: QuoteLead = {
  ref: "Q-7K3MPX",
  name: "Sam Lee",
  phone: "0423 514 111",
  email: "sam@example.com",
  address: "Rocklea",
  make: "Toyota",
  model: "Corolla",
  year: "2012",
  vehicle: "2012 Toyota Corolla",
  description: "Runs, scratch <b>on</b> the bumper",
  expected: "$2,500",
  page: "/quote",
};

describe("quote submissions in Supabase", () => {
  let calls: { url: string; init?: RequestInit }[];
  let originalFetch: typeof fetch;

  beforeEach(() => {
    for (const key of ENV_KEYS) saved[key] = process.env[key];
    for (const key of ENV_KEYS) delete process.env[key];
    calls = [];
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      return new Response(null, { status: 201 });
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it("inserts the mapped form fields, source page and user agent", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co/";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";

    await insertQuoteSubmission(lead, "Mozilla/5.0 (test)");

    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, "https://example.supabase.co/rest/v1/quote_submissions");
    assert.equal(calls[0].init?.method, "POST");
    const headers = new Headers(calls[0].init?.headers);
    assert.equal(headers.get("apikey"), "service-role-test");
    assert.equal(headers.get("authorization"), "Bearer service-role-test");
    assert.equal(headers.get("content-type"), "application/json");
    assert.deepEqual(JSON.parse(String(calls[0].init?.body)), {
      ref: "Q-7K3MPX",
      name: "Sam Lee",
      phone: "0423 514 111",
      email: "sam@example.com",
      address: "Rocklea",
      vehicle: "2012 Toyota Corolla",
      description: "Runs, scratch <b>on</b> the bumper",
      expected: "$2,500",
      page: "/quote",
      user_agent: "Mozilla/5.0 (test)",
    });
  });

  it("skips the insert when either env var is unset", async () => {
    await insertQuoteSubmission(lead, "Mozilla/5.0 (test)");
    assert.equal(calls.length, 0);

    process.env.SUPABASE_URL = "https://example.supabase.co";
    await insertQuoteSubmission(lead, null);
    assert.equal(calls.length, 0);

    delete process.env.SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    await insertQuoteSubmission(lead, null);
    assert.equal(calls.length, 0);
  });

  it("still sends the email when the insert throws", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    process.env.RESEND_EMAIL_DOMAIN = "1800cashforcars.com.au";

    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/rest/v1/quote_submissions")) {
        throw new Error("supabase down: relation quote_submissions does not exist");
      }
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "email_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const result = await processQuote(quoteForm(), quoteHeaders("203.0.113.70"), 1_910_000_000_000);

    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.equal(result.message, "");
    assert.doesNotMatch(JSON.stringify(result), /supabase|relation/i);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /api\.resend\.com\/emails$/);
    const payload = JSON.parse(String(calls[0].init?.body)) as { text: string; subject: string; to: string[] };
    assert.deepEqual(payload.to, ["leads@example.com"]);
    assert.match(payload.subject, /2012 Toyota Corolla/);
    assert.match(payload.text, /^Reference: Q-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}\nName: Sam Lee/);
    assert.match(payload.subject, /^\[Q-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}\]/);
    assert.match(payload.text, /Phone: 0423 514 111/);
    assert.match(payload.text, /Email: sam@example.com/);
    assert.match(payload.text, /Suburb \/ address: Rocklea/);
    assert.match(payload.text, /Make: Toyota/);
    assert.match(payload.text, /Model: Corolla/);
    assert.match(payload.text, /Year: 2012/);
    assert.match(payload.text, /Vehicle: 2012 Toyota Corolla/);
    assert.match(payload.text, /Description: Runs, scratch <b>on<\/b> the bumper/);
    assert.match(payload.text, /Price: \$2,500/);
    assert.match(payload.text, /Sent from: \/quote/);
  });

  it("inserts a quote only after the timing check and rate limit, and flags a honeypot one", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    const headers = quoteHeaders("203.0.113.71");
    const now = 1_920_000_000_000;

    await processQuote(quoteForm({ e: "100" }), headers, now);
    assert.equal(calls.length, 0);

    await processQuote(quoteForm({ [QUOTE_HONEYPOT_FIELD]: "Acme Bots" }), headers, now);
    assert.equal(calls.length, 1);
    assert.equal((JSON.parse(String(calls[0].init?.body)) as { spam_reason?: string }).spam_reason, "honeypot");
    calls.length = 0;

    for (let i = 0; i < QUOTE_LIMIT.limit; i++) {
      const result = await processQuote(quoteForm(), headers, now + i);
      assert.equal(result.status, 200);
      assert.equal(result.lead, true);
    }
    assert.equal(calls.length, QUOTE_LIMIT.limit);
    const stored = JSON.parse(String(calls[0].init?.body)) as { user_agent: string; expected: string; vehicle: string; ref: string };
    assert.equal(stored.user_agent, "Mozilla/5.0 (test)");
    assert.equal(stored.expected, "$2,500");
    assert.equal(stored.vehicle, "2012 Toyota Corolla");
    assert.match(stored.ref, /^Q-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
    assert.equal("make" in stored, false);
    assert.equal("model" in stored, false);
    assert.equal("year" in stored, false);

    const blocked = await processQuote(quoteForm(), headers, now + QUOTE_LIMIT.limit);
    assert.equal(blocked.status, 429);
    assert.equal(calls.length, QUOTE_LIMIT.limit);
  });

  it("retries a duplicate reference up to 3 times and still emails if every insert conflicts", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";

    let conflictsLeft = 1;
    const inserts: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/rest/v1/quote_submissions")) {
        const ref = (JSON.parse(String(init?.body)) as { ref: string }).ref;
        inserts.push(ref);
        if (conflictsLeft > 0) {
          conflictsLeft -= 1;
          return new Response(JSON.stringify({ code: "23505", message: "duplicate key" }), { status: 409 });
        }
        return new Response(null, { status: 201 });
      }
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "email_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const result = await processQuote(quoteForm(), quoteHeaders("203.0.113.80"), 1_930_000_000_000);
    assert.equal(result.ok, true);
    assert.equal(inserts.length, 2);
    assert.notEqual(inserts[0], inserts[1]);
    assert.equal(result.ref, inserts[1]);
    const payload = JSON.parse(String(calls[0].init?.body)) as { subject: string; text: string };
    assert.equal(payload.subject.startsWith(`[${result.ref}]`), true);
    assert.match(payload.text, new RegExp(`^Reference: ${result.ref}`));
    const idempotency = new Headers(calls[0].init?.headers).get("Idempotency-Key");
    assert.equal(idempotency, `quote-${result.ref}`);

    conflictsLeft = 99;
    inserts.length = 0;
    calls.length = 0;
    const exhausted = await processQuote(quoteForm(), quoteHeaders("203.0.113.81"), 1_940_000_000_000);
    assert.equal(exhausted.ok, true);
    assert.equal(exhausted.lead, true);
    assert.equal(inserts.length, 4);
    assert.equal(new Set(inserts).size, 4);
    assert.equal(exhausted.ref, inserts[3]);
    assert.equal(calls.length, 1);
    const sent = JSON.parse(String(calls[0].init?.body)) as { subject: string };
    assert.equal(sent.subject.startsWith(`[${exhausted.ref}]`), true);
  });

  it("saves where the visitor came from and adds it to the lead email", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";

    const source = JSON.stringify({
      gclid: "Cj0KCQtest",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "brisbane-cash-for-cars",
      landing: "/",
      referrer: "www.google.com",
      unknown: "dropped",
    });
    const { inserts, emails } = splitInsertsAndEmails();
    const result = await processQuote(quoteForm({ [AD_SOURCE_FIELD]: source }), quoteHeaders("203.0.113.90"), 1_950_000_000_000);

    assert.equal(result.ok, true);
    assert.equal(inserts.length, 1);
    assert.equal(emails.length, 1);
    assert.deepEqual(inserts[0].attribution, {
      gclid: "Cj0KCQtest",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "brisbane-cash-for-cars",
      landing: "/",
      referrer: "www.google.com",
    });
    const email = emails[0] as { text: string; html: string };
    assert.match(email.text, /\nCame from: Google Ads \(google \/ cpc\) · campaign brisbane-cash-for-cars · landed on \/$/);
    assert.match(email.html, /Came from<\/td>/);
  });

  it("leaves the source out when the form sends none, or sends something unreadable", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";

    const { inserts, emails } = splitInsertsAndEmails();
    await processQuote(quoteForm(), quoteHeaders("203.0.113.91"), 1_960_000_000_000);
    await processQuote(quoteForm({ [AD_SOURCE_FIELD]: "{not json" }), quoteHeaders("203.0.113.92"), 1_960_000_000_000);
    await processQuote(quoteForm({ [AD_SOURCE_FIELD]: '{"landing":"<script>"}' }), quoteHeaders("203.0.113.93"), 1_960_000_000_000);

    assert.equal(inserts.length, 3);
    assert.equal(emails.length, 3);
    for (const insert of inserts) assert.equal("attribution" in insert, false);
    for (const email of emails) assert.doesNotMatch(String(email.text), /Came from/);
  });

  it("saves the quote without the source when the attribution column has not been added yet", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";

    // What Supabase answers when a row names a column the table does not have.
    const { inserts, emails } = splitInsertsAndEmails((row) =>
      "attribution" in row
        ? new Response(
            JSON.stringify({ code: "PGRST204", message: "Could not find the 'attribution' column of 'quote_submissions' in the schema cache" }),
            { status: 400 },
          )
        : null,
    );

    const source = JSON.stringify({ utm_source: "chatgpt", landing: "/cash-for-cars" });
    const result = await processQuote(quoteForm({ [AD_SOURCE_FIELD]: source }), quoteHeaders("203.0.113.94"), 1_970_000_000_000);

    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.equal(inserts.length, 2);
    assert.equal("attribution" in inserts[0], true);
    assert.equal("attribution" in inserts[1], false);
    assert.equal(result.ref, inserts[1].ref);
    // The email still says where the quote came from.
    assert.match(String(emails[0].text), /Came from: chatgpt · landed on \/cash-for-cars/);
  });
});

/**
 * Replaces fetch with one that keeps database rows and emails apart, and answers each the way its
 * service does. `rejectInsert` can return a response to refuse a row. The suite restores fetch.
 */
function splitInsertsAndEmails(rejectInsert?: (row: Record<string, unknown>) => Response | null) {
  const inserts: Record<string, unknown>[] = [];
  const emails: Record<string, unknown>[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    if (String(input).includes("/rest/v1/quote_submissions")) {
      inserts.push(body);
      return rejectInsert?.(body) ?? new Response(null, { status: 201 });
    }
    emails.push(body);
    return new Response(JSON.stringify({ id: "email_123" }), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;
  return { inserts, emails };
}

function quoteHeaders(ip: string) {
  return {
    get(name: string) {
      if (name === "x-forwarded-for") return ip;
      if (name === "user-agent") return "Mozilla/5.0 (test)";
      return null;
    },
  };
}

function quoteForm(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const fields: Record<string, string> = {
    name: "Sam Lee",
    phone: "0423 514 111",
    email: "sam@example.com",
    address: "Rocklea",
    make: "Toyota",
    model: "Corolla",
    year: "2012",
    description: "Runs, scratch <b>on</b> the bumper",
    expected: "2.5k",
    page: "/quote",
    e: "4000",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}
