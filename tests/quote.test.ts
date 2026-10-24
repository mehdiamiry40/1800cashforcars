import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { POST } from "@/app/api/quote/route";
import { QUOTE_GENERIC_ERROR, QUOTE_RATE_LIMIT_MESSAGE, processQuote } from "@/lib/quote";
import { QUOTE_LIMIT, type HeaderSource } from "@/lib/rate-limit";
import { site } from "@/lib/site";

const ENV_KEYS = ["RESEND_API_KEY", "LEAD_TO_EMAIL", "RESEND_EMAIL_DOMAIN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};
const NOW = 1_800_000_000_000;

function ip(address: string, extra: Record<string, string> = {}): HeaderSource {
  const values: Record<string, string> = { ...extra };
  if (address) values["x-forwarded-for"] = address;
  return { get: (name) => values[name] ?? null };
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

describe("quote submission", () => {
  let calls: { url: string; body: string }[];
  let originalFetch: typeof fetch;

  beforeEach(() => {
    for (const key of ENV_KEYS) saved[key] = process.env[key];
    for (const key of ENV_KEYS) delete process.env[key];
    calls = [];
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), body: typeof init?.body === "string" ? init.body : "" });
      return new Response(JSON.stringify({ id: "email_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it("accepts an empty description and still emails the other fields", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const result = await processQuote(quoteForm({ description: "" }), ip("203.0.113.19"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.equal(calls.length, 1);
    const payload = JSON.parse(calls[0].body) as { text: string; subject: string };
    assert.match(payload.subject, /2012 Toyota Corolla/);
    assert.match(payload.text, /Name: Sam Lee/);
    assert.match(payload.text, /Phone: 0423 514 111/);
    assert.match(payload.text, /Vehicle: 2012 Toyota Corolla/);
    assert.match(payload.text, /Suburb \/ address: Rocklea/);
    assert.doesNotMatch(payload.text, /Description:/);
  });

  it("accepts a normal submission and still sends the email", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com, office@example.com";
    process.env.RESEND_EMAIL_DOMAIN = "1800cashforcars.com.au";

    const result = await processQuote(quoteForm(), ip("203.0.113.10"), NOW);

    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /api\.resend\.com\/emails$/);
    const payload = JSON.parse(calls[0].body) as { from: string; to: string[]; subject: string; text: string; html: string; reply_to: string };
    assert.equal(payload.from, `${site.name} <quotes@1800cashforcars.com.au>`);
    assert.deepEqual(payload.to, ["leads@example.com", "office@example.com"]);
    assert.match(payload.subject, /2012 Toyota Corolla/);
    assert.match(payload.subject, /Rocklea/);
    assert.match(payload.subject, /\$2,500/);
    assert.match(payload.text, /Name: Sam Lee/);
    assert.match(payload.text, /Phone: 0423 514 111/);
    assert.match(payload.text, /Email: sam@example.com/);
    assert.match(payload.text, /Suburb \/ address: Rocklea/);
    assert.match(payload.text, /Vehicle: 2012 Toyota Corolla/);
    assert.match(payload.text, /Description: Runs, scratch <b>on<\/b> the bumper/);
    assert.match(payload.text, /Hoping for: \$2,500/);
    assert.match(payload.text, /Sent from: \/quote/);
    assert.match(payload.html, /&lt;b&gt;/);
    assert.equal(payload.reply_to, "sam@example.com");
    assert.doesNotMatch(payload.html, /<b>on<\/b>/);
  });

  it("records a lead without calling Resend when email is not configured", async () => {
    const result = await processQuote(quoteForm(), ip("203.0.113.11"), NOW);
    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.equal(calls.length, 0);
  });

  it("returns 429 on the 6th submission and does not send another email", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const address = "203.0.113.12";

    for (let i = 0; i < QUOTE_LIMIT.limit; i++) {
      const result = await processQuote(quoteForm(), ip(address), NOW + i);
      assert.equal(result.status, 200, `submission ${i + 1} should be accepted`);
    }
    assert.equal(calls.length, QUOTE_LIMIT.limit);

    const blocked = await processQuote(quoteForm(), ip(address), NOW + QUOTE_LIMIT.limit);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.ok, false);
    assert.equal(blocked.lead, undefined);
    assert.equal(blocked.message, QUOTE_RATE_LIMIT_MESSAGE);
    assert.match(blocked.message, /0423 514 111/);
    assert.equal(calls.length, QUOTE_LIMIT.limit);
  });

  it("exposes that 429 from the quote route", async () => {
    const address = "203.0.113.13";
    for (let i = 0; i < QUOTE_LIMIT.limit; i++) {
      const res = await POST(new Request("http://localhost/api/quote", {
        method: "POST",
        headers: { "x-forwarded-for": address },
        body: quoteForm(),
      }));
      assert.equal(res.status, 200);
    }
    const blocked = await POST(new Request("http://localhost/api/quote", {
      method: "POST",
      headers: { "x-forwarded-for": address },
      body: quoteForm(),
    }));
    assert.equal(blocked.status, 429);
    assert.match(blocked.headers.get("Retry-After") ?? "", /^[1-9]\d*$/);
    const body = (await blocked.json()) as { ok: boolean; message: string; lead?: boolean };
    assert.equal(body.ok, false);
    assert.equal(body.message, QUOTE_RATE_LIMIT_MESSAGE);
    assert.equal(body.lead, undefined);
    assert.equal("status" in body, false);
  });

  it("drops a filled honeypot without sending email", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const result = await processQuote(quoteForm({ company: "Acme Bots" }), ip("203.0.113.14"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, undefined);
    assert.equal(calls.length, 0);
  });

  it("drops a too-fast submission without sending email", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const result = await processQuote(quoteForm({ e: "2499" }), ip("203.0.113.15"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.message, "");
    assert.equal(result.lead, undefined);
    assert.equal(calls.length, 0);
  });

  it("lets a submission through at the minimum time", async () => {
    const result = await processQuote(quoteForm({ e: "2500" }), ip("203.0.113.16"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.lead, true);
  });

  it("does not count incomplete submissions toward the limit", async () => {
    const address = "203.0.113.17";
    for (let i = 0; i < QUOTE_LIMIT.limit + 2; i++) {
      const result = await processQuote(quoteForm({ name: "" }), ip(address), NOW);
      assert.equal(result.status, 400);
    }
    const accepted = await processQuote(quoteForm(), ip(address), NOW);
    assert.equal(accepted.status, 200);
  });

  it("returns a generic message instead of a thrown error", async () => {
    const result = await processQuote(quoteForm(), {
      get() {
        throw new Error("connect ECONNREFUSED secret-db.internal password=hunter2");
      },
    }, NOW);
    assert.equal(result.status, 500);
    assert.equal(result.message, QUOTE_GENERIC_ERROR);
    assert.doesNotMatch(result.message, /hunter2|ECONNREFUSED|secret-db/);
  });

  it("keeps Resend's error off the message shown to the visitor", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ message: "Invalid API key sk_live_secret" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    const result = await processQuote(quoteForm(), ip("203.0.113.18"), NOW);
    assert.equal(result.status, 502);
    assert.match(result.message, /didn't reach us/);
    assert.match(result.message, /0423 514 111/);
    assert.doesNotMatch(result.message, /sk_live_secret|Invalid API key/);
  });
});
