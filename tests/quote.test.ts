import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { POST } from "@/app/api/quote/route";
import { QUOTE_GENERIC_ERROR, QUOTE_RATE_LIMIT_MESSAGE, QUOTE_TOO_FAST_MESSAGE, leadEmailRetry, processQuote } from "@/lib/quote";
import { generateQuoteRef, QUOTE_REF_PATTERN } from "@/lib/quote-ref";
import { QUOTE_HONEYPOT_FIELD } from "@/lib/quote-spam";
import { quoteYearMax } from "@/lib/quote-year";
import { QUOTE_LIMIT, type HeaderSource } from "@/lib/rate-limit";
import { site } from "@/lib/site";

const ENV_KEYS = ["RESEND_API_KEY", "LEAD_TO_EMAIL", "RESEND_EMAIL_DOMAIN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_ADS_CAPI_KEY"] as const;
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

describe("quote reference", () => {
  it("uses six unambiguous characters", () => {
    const refs = new Set<string>();
    for (let i = 0; i < 40; i++) refs.add(generateQuoteRef());
    assert.equal(refs.size, 40);
    for (const ref of refs) {
      assert.match(ref, QUOTE_REF_PATTERN);
      assert.equal(/[01IOL]/.test(ref.slice(2)), false);
    }
  });
});

describe("quote submission", () => {
  let calls: { url: string; body: string; idempotencyKey: string | null }[];
  let originalFetch: typeof fetch;

  const retryDelays = leadEmailRetry.delaysMs;

  beforeEach(() => {
    for (const key of ENV_KEYS) saved[key] = process.env[key];
    for (const key of ENV_KEYS) delete process.env[key];
    // No background resends unless a test asks for them, so none can outlive its test.
    leadEmailRetry.delaysMs = [];
    calls = [];
    originalFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(input),
        body: typeof init?.body === "string" ? init.body : "",
        idempotencyKey: new Headers(init?.headers).get("Idempotency-Key"),
      });
      return new Response(JSON.stringify({ id: "email_123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;
  });

  afterEach(() => {
    leadEmailRetry.delaysMs = retryDelays;
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
    assert.match(payload.text, /Make: Toyota/);
    assert.match(payload.text, /Model: Corolla/);
    assert.match(payload.text, /Year: 2012/);
    assert.match(payload.text, /Vehicle: 2012 Toyota Corolla/);
    assert.match(payload.text, /Price: \$2,500/);
    assert.match(payload.text, /Suburb \/ address: Rocklea/);
    assert.doesNotMatch(payload.text, /Description:/);
    assert.doesNotMatch(payload.text, /Hoping for/);
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
    assert.match(payload.subject, /^\[Q-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}\] New quote request:/);
    assert.match(payload.subject, /2012 Toyota Corolla/);
    assert.match(payload.subject, /Rocklea/);
    assert.match(payload.subject, /— wants \$2,500/);
    assert.match(result.ref ?? "", QUOTE_REF_PATTERN);
    assert.match(payload.text, new RegExp(`^Reference: ${result.ref}\\nName: Sam Lee`));
    assert.match(payload.text, /Phone: 0423 514 111/);
    assert.match(payload.text, /Email: sam@example.com/);
    assert.match(payload.text, /Suburb \/ address: Rocklea/);
    assert.match(payload.text, /Make: Toyota/);
    assert.match(payload.text, /Model: Corolla/);
    assert.match(payload.text, /Year: 2012/);
    assert.match(payload.text, /Vehicle: 2012 Toyota Corolla/);
    assert.match(payload.text, /Description: Runs, scratch <b>on<\/b> the bumper/);
    assert.match(payload.text, /Price: \$2,500/);
    assert.doesNotMatch(payload.text, /Hoping for/);
    assert.match(payload.text, /Sent from: \/quote/);
    assert.match(payload.html, /&lt;b&gt;/);
    assert.equal(payload.reply_to, "sam@example.com");
    assert.equal(payload.subject.startsWith(`[${result.ref}]`), true);
    assert.equal(calls[0].idempotencyKey, `quote-${result.ref}`);
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

  it("never emails a filled honeypot, and tells the bot it worked", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const result = await processQuote(quoteForm({ [QUOTE_HONEYPOT_FIELD]: "Buy cheap pills" }), ip("203.0.113.14"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, undefined);
    assert.equal(result.ref, undefined);
    assert.equal(calls.length, 0);
  });

  it("stores a complete honeypot submission as suspected spam instead of discarding it", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";

    const result = await processQuote(quoteForm({ [QUOTE_HONEYPOT_FIELD]: "Buy cheap pills" }), ip("203.0.113.50"), NOW);
    assert.equal(result.ok, true);
    assert.equal(result.lead, undefined);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/rest\/v1\/quote_submissions$/);
    const stored = JSON.parse(calls[0].body) as { spam_reason?: string; name: string; phone: string; ref: string };
    assert.equal(stored.spam_reason, "honeypot");
    assert.equal(stored.name, "Sam Lee");
    assert.equal(stored.phone, "0423 514 111");
    assert.match(stored.ref, QUOTE_REF_PATTERN);
  });

  it("does not store a honeypot submission with incomplete details", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    const result = await processQuote(quoteForm({ [QUOTE_HONEYPOT_FIELD]: "x", phone: "call me" }), ip("203.0.113.51"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, undefined);
    assert.equal(calls.length, 0);
  });

  it("stops storing honeypot submissions past the limit, without using up the visitor's own allowance", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    const address = "203.0.113.52";
    for (let i = 0; i < QUOTE_LIMIT.limit + 3; i++) {
      const result = await processQuote(quoteForm({ [QUOTE_HONEYPOT_FIELD]: "x" }), ip(address), NOW + i);
      assert.equal(result.ok, true);
      assert.equal(result.lead, undefined);
    }
    assert.equal(calls.length, QUOTE_LIMIT.limit);

    const real = await processQuote(quoteForm(), ip(address), NOW + 100);
    assert.equal(real.status, 200);
    assert.equal(real.lead, true);
  });

  it("does not send spam_reason with a normal quote", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
    const result = await processQuote(quoteForm(), ip("203.0.113.53"), NOW);
    assert.equal(result.lead, true);
    assert.equal("spam_reason" in (JSON.parse(calls[0].body) as object), false);
  });

  it("accepts a real quote when autofill has filled the old hidden field name", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const result = await processQuote(quoteForm({ company: "Sam's Plumbing Pty Ltd" }), ip("203.0.113.54"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.lead, true);
    assert.equal(calls.length, 1);
  });

  it("asks a too-fast submission to resend instead of pretending it worked", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const address = "203.0.113.15";
    const result = await processQuote(quoteForm({ e: "2499" }), ip(address), NOW);
    assert.equal(result.status, 400);
    assert.equal(result.ok, false);
    assert.equal(result.message, QUOTE_TOO_FAST_MESSAGE);
    assert.match(result.message, /press the button again/);
    assert.equal(result.lead, undefined);
    assert.equal(calls.length, 0);

    const again = await processQuote(quoteForm({ e: "6200" }), ip(address), NOW + 3700);
    assert.equal(again.status, 200);
    assert.equal(again.lead, true);
    assert.equal(calls.length, 1);
  });

  it("lets a submission through at the minimum time", async () => {
    const result = await processQuote(quoteForm({ e: "2500" }), ip("203.0.113.16"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.lead, true);
  });

  it("accepts a blank email and rejects an invalid one", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";

    const blank = await processQuote(quoteForm({ email: "   " }), ip("203.0.113.40"), NOW);
    assert.equal(blank.status, 200);
    assert.equal(blank.lead, true);
    assert.match(blank.ref ?? "", QUOTE_REF_PATTERN);
    const blankPayload = JSON.parse(calls[0].body) as { text: string; reply_to?: string; subject: string };
    assert.doesNotMatch(blankPayload.text, /Email:/);
    assert.equal(blankPayload.reply_to, undefined);
    assert.equal(blankPayload.subject.startsWith(`[${blank.ref}]`), true);
    assert.equal(calls[0].idempotencyKey, `quote-${blank.ref}`);

    const invalid = await processQuote(quoteForm({ email: "not-an-email" }), ip("203.0.113.41"), NOW);
    assert.equal(invalid.status, 400);
    assert.equal(invalid.ok, false);
    assert.match(invalid.message, /valid email/i);
    assert.equal(invalid.ref, undefined);
    assert.equal(calls.length, 1);

    const res = await POST(new Request("http://localhost/api/quote", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.42" },
      body: quoteForm({ email: "" }),
    }));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { ok: boolean; ref?: string; lead?: boolean };
    assert.equal(body.ok, true);
    assert.equal(body.lead, true);
    assert.match(body.ref ?? "", QUOTE_REF_PATTERN);
    assert.equal("status" in body, false);
  });

  it("accepts a blank price, omits it from the email, and stores an empty string", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";

    const result = await processQuote(quoteForm({ expected: "   " }), ip("203.0.113.20"), NOW);
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.match(result.ref ?? "", QUOTE_REF_PATTERN);

    const insert = calls.find((call) => call.url.includes("/rest/v1/quote_submissions"));
    const email = calls.find((call) => call.url.includes("api.resend.com"));
    assert.ok(insert);
    assert.ok(email);
    const stored = JSON.parse(insert.body) as { expected: string; vehicle: string };
    assert.equal(stored.expected, "");
    assert.equal(stored.vehicle, "2012 Toyota Corolla");
    const payload = JSON.parse(email.body) as { text: string; html: string; subject: string };
    assert.doesNotMatch(payload.subject, /wants/);
    assert.match(payload.subject, /— Rocklea$/);
    assert.doesNotMatch(payload.text, /Price:/);
    assert.doesNotMatch(payload.html, />Price</);
    assert.match(payload.text, /Make: Toyota/);
    assert.match(payload.text, /Year: 2012/);

    const res = await POST(new Request("http://localhost/api/quote", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.20b" },
      body: quoteForm({ expected: "" }),
    }));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { ok: boolean; lead?: boolean; ref?: string };
    assert.equal(body.ok, true);
    assert.equal(body.lead, true);
    assert.match(body.ref ?? "", QUOTE_REF_PATTERN);
  });

  it("rejects a submission with no make, model or year", async () => {
    for (const [field, address] of [
      ["make", "203.0.113.21"],
      ["model", "203.0.113.22"],
      ["year", "203.0.113.23"],
    ] as const) {
      const result = await processQuote(quoteForm({ [field]: "", expected: "" }), ip(address), NOW);
      assert.equal(result.status, 400, field);
      assert.equal(result.message, "Please enter your name, mobile number, suburb, make, model and year.");
    }
    assert.equal(calls.length, 0);
  });

  it("rejects a year outside 1950 through next year, including a value that would look valid if truncated", async () => {
    const max = quoteYearMax(new Date(NOW));
    const tooEarly = await processQuote(quoteForm({ year: "1949" }), ip("203.0.113.24"), NOW);
    assert.equal(tooEarly.status, 400);
    assert.match(tooEarly.message, /1950/);
    assert.match(tooEarly.message, new RegExp(String(max)));

    const tooLate = await processQuote(quoteForm({ year: String(max + 1) }), ip("203.0.113.25"), NOW);
    assert.equal(tooLate.status, 400);
    assert.match(tooLate.message, new RegExp(String(max)));

    const truncated = await processQuote(quoteForm({ year: "20125" }), ip("203.0.113.26"), NOW);
    assert.equal(truncated.status, 400);
    assert.match(truncated.message, /4-digit/);
    assert.equal(calls.length, 0);
  });

  it("accepts the minimum and maximum model years", async () => {
    const max = quoteYearMax(new Date(NOW));
    const oldest = await processQuote(quoteForm({ year: "1950" }), ip("203.0.113.27"), NOW);
    assert.equal(oldest.status, 200);
    assert.equal(oldest.lead, true);
    const newest = await processQuote(quoteForm({ year: String(max) }), ip("203.0.113.28"), NOW);
    assert.equal(newest.status, 200);
    assert.equal(newest.lead, true);
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

  it("keeps trying to deliver the email in the background after telling the visitor to call", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    leadEmailRetry.delaysMs = [5, 5];
    const keys: (string | null)[] = [];
    globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      keys.push(new Headers(init?.headers).get("Idempotency-Key"));
      // Both attempts made while the visitor waits fail, and so does the first background one.
      if (keys.length <= 3) {
        return new Response(JSON.stringify({ message: "Service unavailable" }), {
          status: 503,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ id: "email_123" }), { status: 200, headers: { "content-type": "application/json" } });
    }) as typeof fetch;

    const result = await processQuote(quoteForm(), ip("203.0.113.61"), NOW);
    assert.equal(result.status, 502);
    assert.match(result.message, /didn't reach us/);
    assert.equal(keys.length, 2);

    await new Promise((resolve) => setTimeout(resolve, 150));
    assert.equal(keys.length, 4);
    // One key for every attempt, so the mail provider can never deliver the lead twice.
    assert.deepEqual(new Set(keys), new Set([`quote-${result.ref}`]));
  });

  it("logs the lead's details only when there is no saved row to fall back on", async () => {
    const logged: string[] = [];
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      logged.push(args.map(String).join(" "));
    };
    try {
      await processQuote(quoteForm(), ip("203.0.113.62"), NOW);
      assert.equal(logged.some((line) => line.includes("Sam Lee") && line.includes("0423 514 111")), true);

      logged.length = 0;
      process.env.SUPABASE_URL = "https://example.supabase.co";
      process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test";
      const result = await processQuote(quoteForm(), ip("203.0.113.63"), NOW);
      assert.equal(result.lead, true);
      assert.deepEqual(logged.filter((line) => line.startsWith("[lead]")), [`[lead] saved ${result.ref}`]);
      assert.equal(logged.join(" ").includes("Sam Lee"), false);
      assert.equal(logged.join(" ").includes("0423"), false);
    } finally {
      console.log = originalLog;
    }
  });

  it("sends a browser that posted the form itself to a result page, not to JSON", async () => {
    const browserPost = (address: string, overrides: Record<string, string> = {}) =>
      POST(new Request("http://localhost/api/quote", {
        method: "POST",
        headers: { "x-forwarded-for": address, accept: "text/html,application/xhtml+xml,*/*;q=0.8" },
        // No script ran, so the time-on-screen field is empty.
        body: quoteForm({ e: "", ...overrides }),
      }));

    const sent = await browserPost("203.0.113.64");
    assert.equal(sent.status, 303);
    assert.match(sent.headers.get("Location") ?? "", /^\/quote\/sent\?ref=Q-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/);
    assert.equal(await sent.text(), "");

    const incomplete = await browserPost("203.0.113.65", { phone: "" });
    assert.equal(incomplete.status, 303);
    assert.equal(incomplete.headers.get("Location"), "/quote/not-sent");

    // A bot that fills the hidden field sees the same page as a real sender, with no reference.
    const spam = await browserPost("203.0.113.66", { [QUOTE_HONEYPOT_FIELD]: "x" });
    assert.equal(spam.status, 303);
    assert.equal(spam.headers.get("Location"), "/quote/sent");

    // The form's own script still gets JSON.
    const scripted = await POST(new Request("http://localhost/api/quote", {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.67", accept: "*/*" },
      body: quoteForm(),
    }));
    assert.equal(scripted.status, 200);
    assert.equal(((await scripted.json()) as { lead?: boolean }).lead, true);
  });
});
