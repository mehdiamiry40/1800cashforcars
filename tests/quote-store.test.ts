import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { processQuote } from "@/lib/quote";
import { QUOTE_LIMIT } from "@/lib/rate-limit";
import { insertQuoteSubmission, type QuoteLead } from "@/lib/quote-store";

const ENV_KEYS = ["RESEND_API_KEY", "LEAD_TO_EMAIL", "RESEND_EMAIL_DOMAIN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

const lead: QuoteLead = {
  name: "Sam Lee",
  phone: "0423 514 111",
  email: "sam@example.com",
  address: "Rocklea",
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
    assert.match(payload.text, /Name: Sam Lee/);
    assert.match(payload.text, /Phone: 0423 514 111/);
    assert.match(payload.text, /Email: sam@example.com/);
    assert.match(payload.text, /Suburb \/ address: Rocklea/);
    assert.match(payload.text, /Vehicle: 2012 Toyota Corolla/);
    assert.match(payload.text, /Description: Runs, scratch <b>on<\/b> the bumper/);
    assert.match(payload.text, /Hoping for: \$2,500/);
    assert.match(payload.text, /Sent from: \/quote/);
  });

  it("inserts only after the honeypot, timing check and rate limit", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    const headers = quoteHeaders("203.0.113.71");
    const now = 1_920_000_000_000;

    await processQuote(quoteForm({ company: "Acme Bots" }), headers, now);
    await processQuote(quoteForm({ e: "100" }), headers, now);
    assert.equal(calls.length, 0);

    for (let i = 0; i < QUOTE_LIMIT.limit; i++) {
      const result = await processQuote(quoteForm(), headers, now + i);
      assert.equal(result.status, 200);
      assert.equal(result.lead, true);
    }
    assert.equal(calls.length, QUOTE_LIMIT.limit);
    const stored = JSON.parse(String(calls[0].init?.body)) as { user_agent: string; expected: string };
    assert.equal(stored.user_agent, "Mozilla/5.0 (test)");
    assert.equal(stored.expected, "$2,500");

    const blocked = await processQuote(quoteForm(), headers, now + QUOTE_LIMIT.limit);
    assert.equal(blocked.status, 429);
    assert.equal(calls.length, QUOTE_LIMIT.limit);
  });
});

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
    vehicle: "2012 Toyota Corolla",
    description: "Runs, scratch <b>on</b> the bumper",
    expected: "2.5k",
    page: "/quote",
    e: "4000",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}
