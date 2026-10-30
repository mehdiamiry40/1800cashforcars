import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { POST } from "@/app/api/quote/route";
import {
  buildOpenAiLeadRequest,
  isIpAddress,
  leadSourceUrl,
  normalizeOpenAiPhone,
  readCookie,
  resetOpenAiAdsCapiForTests,
  sendOpenAiServerLead,
  sha256Hex,
  type OpenAiLeadEventInput,
} from "@/lib/openai-ads-capi";
import { processQuote } from "@/lib/quote";
import { QUOTE_LIMIT, type HeaderSource } from "@/lib/rate-limit";
import { OPENAI_ADS_PIXEL_ID, site } from "@/lib/site";

const ENV_KEYS = ["RESEND_API_KEY", "LEAD_TO_EMAIL", "RESEND_EMAIL_DOMAIN", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "OPENAI_ADS_CAPI_KEY"] as const;
const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};
const KEY = "test-capi-key";
const NOW = 1_800_000_000_000;
const PHONE_HASH = "758fbf68945f21c416814c539ab578876c8d98fb69e6da692def92cd52417fe0";

function headers(extra: Record<string, string> = {}): HeaderSource {
  return { get: (name) => extra[name] ?? null };
}

function quoteForm(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const fields: Record<string, string> = {
    name: "Sam Lee",
    phone: "0423 514 111",
    email: " Sam@Example.com ",
    address: "Rocklea",
    make: "Toyota",
    model: "Corolla",
    year: "2012",
    description: "Runs",
    expected: "2.5k",
    page: "/quote",
    e: "4000",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

function leadInput(overrides: Partial<OpenAiLeadEventInput> = {}): OpenAiLeadEventInput {
  return {
    ref: "Q-LEAD01",
    email: " Sam@Example.com ",
    phone: "+1 (415) 555-2671",
    page: "/quote",
    cookieHeader: "__oppref=oppref_abc; __obref=123e4567-e89b-42d3-a456-426614174000",
    userAgent: "Mozilla/5.0",
    ip: "203.0.113.1",
    timestampMs: NOW,
    ...overrides,
  };
}

describe("OpenAI Ads Conversions API", () => {
  let originalFetch: typeof fetch;
  let warnings: string[];
  let errors: string[];
  let originalWarn: typeof console.warn;
  let originalError: typeof console.error;

  beforeEach(() => {
    for (const key of ENV_KEYS) saved[key] = process.env[key];
    for (const key of ENV_KEYS) delete process.env[key];
    resetOpenAiAdsCapiForTests();
    warnings = [];
    errors = [];
    originalWarn = console.warn;
    originalError = console.error;
    console.warn = (...args: unknown[]) => {
      warnings.push(args.map(String).join(" "));
    };
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "));
    };
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    console.warn = originalWarn;
    console.error = originalError;
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it("builds a lead_created event whose id is the quote reference", () => {
    const request = buildOpenAiLeadRequest(leadInput());
    assert.ok(request);
    assert.equal(request.url, `https://bzr.openai.com/v1/events?pid=${OPENAI_ADS_PIXEL_ID}`);
    assert.equal(OPENAI_ADS_PIXEL_ID, "Tf8BpfGnY6eFM4ukchfyy3");
    assert.equal(request.body.validate_only, false);
    assert.equal(request.body.events.length, 1);

    const event = request.body.events[0];
    assert.equal(event.id, "Q-LEAD01");
    assert.equal(event.type, "lead_created");
    assert.equal(event.timestamp_ms, NOW);
    assert.equal(event.action_source, "web");
    assert.equal(event.source_url, `${site.url}/quote`);
    assert.equal(event.oppref, "oppref_abc");
    assert.deepEqual(event.data, { type: "customer_action" });
    assert.equal(event.user?.obref, "123e4567-e89b-42d3-a456-426614174000");
    assert.deepEqual(event.user?.emails_sha256, [sha256Hex("sam@example.com")]);
    assert.deepEqual(event.user?.phone_numbers_sha256, [PHONE_HASH]);
    assert.equal(event.user?.ip_address, "203.0.113.1");
    assert.equal(event.user?.user_agent, "Mozilla/5.0");

    const serialized = JSON.stringify(request.body);
    assert.equal(serialized.includes("Sam@Example.com"), false);
    assert.equal(serialized.includes("sam@example.com"), false);
    assert.equal(serialized.includes("415"), false);
    assert.equal(serialized.includes("555-2671"), false);
    assert.equal(serialized.includes("Sam Lee"), false);
    assert.equal(serialized.includes("Rocklea"), false);
    assert.equal(serialized.includes(KEY), false);
  });

  it("hashes phones only in the documented shape and drops ones that do not fit", () => {
    assert.equal(normalizeOpenAiPhone("+1 (415) 555-2671"), "14155552671");
    assert.equal(sha256Hex("14155552671"), PHONE_HASH);
    assert.equal(normalizeOpenAiPhone("0423 514 111"), "423514111");
    assert.equal(normalizeOpenAiPhone("+61 (0) 423 514 111"), "610423514111");
    assert.equal(normalizeOpenAiPhone("0001234"), null);
    assert.equal(normalizeOpenAiPhone("call me"), null);

    const australian = buildOpenAiLeadRequest(leadInput({ phone: "0423 514 111", email: "   " }));
    assert.deepEqual(australian?.body.events[0].user?.phone_numbers_sha256, [sha256Hex("423514111")]);
    assert.equal(australian?.body.events[0].user?.emails_sha256, undefined);
    assert.equal(JSON.stringify(australian).includes("0423"), false);

    const omitted = buildOpenAiLeadRequest(leadInput({ phone: "123", email: "" }));
    assert.equal(omitted?.body.events[0].user?.phone_numbers_sha256, undefined);
    assert.equal(omitted?.body.events[0].user?.emails_sha256, undefined);
  });

  it("passes click and browser identifiers unchanged and omits unsafe values", () => {
    assert.equal(readCookie("__oppref=oppref_abc; __obref=browser-1", "__oppref"), "oppref_abc");
    assert.equal(readCookie("not__obref=no; __obref=browser-1", "__obref"), "browser-1");
    assert.equal(readCookie("__oppref=a%2Bb", "__oppref"), "a%2Bb");
    assert.equal(isIpAddress("203.0.113.1"), true);
    assert.equal(isIpAddress("2001:db8::1"), true);
    assert.equal(isIpAddress("unknown"), false);
    assert.equal(leadSourceUrl("/locations/logan"), `${site.url}/locations/logan`);
    assert.equal(leadSourceUrl("https://evil.example/phish"), site.url);
    assert.equal(leadSourceUrl("//evil.example"), site.url);

    const request = buildOpenAiLeadRequest(leadInput({
      cookieHeader: "__oppref=keep-me",
      ip: "unknown",
      userAgent: "   ",
      page: "https://evil.example/phish",
      email: "",
      phone: "",
    }));
    const event = request?.body.events[0];
    assert.equal(event?.oppref, "keep-me");
    assert.equal(event?.source_url, site.url);
    assert.equal(event?.user?.ip_address, undefined);
    assert.equal(event?.user?.user_agent, undefined);
    assert.equal(event?.user?.obref, undefined);
  });

  it("skips the request when the key is missing and warns once without a secret", async () => {
    let fetches = 0;
    globalThis.fetch = (async () => {
      fetches += 1;
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    assert.equal(await sendOpenAiServerLead(leadInput()), "skipped");
    assert.equal(await sendOpenAiServerLead(leadInput({ ref: "Q-LEAD02" })), "skipped");
    assert.equal(fetches, 0);
    assert.deepEqual(warnings, ["[openai-ads] OPENAI_ADS_CAPI_KEY is unset; server lead events are skipped"]);
    assert.equal(warnings.join(" ").includes(KEY), false);
    assert.equal(errors.length, 0);

    resetOpenAiAdsCapiForTests();
    warnings.length = 0;
    assert.equal(await sendOpenAiServerLead(leadInput({ ref: "" })), "skipped");
    assert.deepEqual(warnings, []);
  });

  it("does not throw when the Conversions API fails", async () => {
    process.env.OPENAI_ADS_CAPI_KEY = KEY;
    globalThis.fetch = (async () => {
      const error = new Error(`Bearer ${KEY} leaked`);
      error.name = "TypeError";
      throw error;
    }) as typeof fetch;

    assert.equal(await sendOpenAiServerLead(leadInput()), "failed");
    assert.deepEqual(errors, ["[openai-ads] conversions api request failed (TypeError)"]);
    assert.equal(errors.join(" ").includes(KEY), false);

    errors.length = 0;
    globalThis.fetch = (async () => new Response(KEY, { status: 503 })) as typeof fetch;
    assert.equal(await sendOpenAiServerLead(leadInput()), "failed");
    assert.deepEqual(errors, ["[openai-ads] conversions api responded 503"]);
    assert.equal(errors.join(" ").includes(KEY), false);
  });

  it("posts the quote reference after a real lead and not after a rejected one", async () => {
    process.env.OPENAI_ADS_CAPI_KEY = KEY;
    const calls: { url: string; init?: RequestInit }[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), init });
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const cookie = "__oppref=oppref_abc; __obref=browser-ref";
    const result = await processQuote(quoteForm(), headers({
      "x-forwarded-for": "203.0.113.77",
      cookie,
      "user-agent": "Mozilla/5.0 QuoteTest",
    }), NOW);
    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, `https://bzr.openai.com/v1/events?pid=${OPENAI_ADS_PIXEL_ID}`);
    const headersSent = new Headers(calls[0].init?.headers);
    assert.equal(headersSent.get("authorization"), `Bearer ${KEY}`);
    assert.equal(headersSent.get("content-type"), "application/json");
    const body = JSON.parse(String(calls[0].init?.body)) as {
      validate_only: boolean;
      events: { id: string; type: string; timestamp_ms: number; user?: { emails_sha256?: string[]; phone_numbers_sha256?: string[]; ip_address?: string } }[];
    };
    assert.equal(body.validate_only, false);
    assert.equal(body.events[0].id, result.ref);
    assert.equal(body.events[0].type, "lead_created");
    assert.equal(body.events[0].timestamp_ms, NOW);
    assert.deepEqual(body.events[0].user?.emails_sha256, [sha256Hex("sam@example.com")]);
    assert.deepEqual(body.events[0].user?.phone_numbers_sha256, [sha256Hex("423514111")]);
    assert.equal(body.events[0].user?.ip_address, "203.0.113.77");
    assert.equal(JSON.stringify(body).includes("Sam@Example.com"), false);
    assert.equal(JSON.stringify(body).includes(KEY), false);
    assert.equal(errors.join(" ").includes(KEY), false);

    calls.length = 0;
    const invalid = await processQuote(quoteForm({ make: "" }), headers({ "x-forwarded-for": "203.0.113.78" }), NOW);
    assert.equal(invalid.status, 400);
    const honeypot = await processQuote(quoteForm({ company: "Acme Bots" }), headers({ "x-forwarded-for": "203.0.113.79" }), NOW);
    assert.equal(honeypot.lead, undefined);
    const tooFast = await processQuote(quoteForm({ e: "100" }), headers({ "x-forwarded-for": "203.0.113.80" }), NOW);
    assert.equal(tooFast.lead, undefined);
    assert.equal(calls.length, 0);

    const address = "203.0.113.81";
    for (let i = 0; i < QUOTE_LIMIT.limit; i++) {
      const accepted = await processQuote(quoteForm(), headers({ "x-forwarded-for": address }), NOW + i);
      assert.equal(accepted.lead, true);
    }
    const blocked = await processQuote(quoteForm(), headers({ "x-forwarded-for": address }), NOW + QUOTE_LIMIT.limit);
    assert.equal(blocked.status, 429);
    assert.equal(calls.filter((call) => call.url.includes("bzr.openai.com")).length, QUOTE_LIMIT.limit);
  });

  it("keeps a failed Conversions API call from changing the quote result", async () => {
    process.env.OPENAI_ADS_CAPI_KEY = KEY;
    globalThis.fetch = (async () => {
      throw new Error(`network ${KEY}`);
    }) as typeof fetch;

    const result = await processQuote(quoteForm(), headers({ "x-forwarded-for": "203.0.113.82" }), NOW);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(result.status, 200);
    assert.equal(result.ok, true);
    assert.equal(result.lead, true);
    assert.match(result.ref ?? "", /^Q-/);
    assert.equal(errors.some((line) => line.includes(KEY)), false);
  });

  it("does not send a server event when the lead email is not delivered", async () => {
    process.env.OPENAI_ADS_CAPI_KEY = KEY;
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.LEAD_TO_EMAIL = "leads@example.com";
    const urls: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      urls.push(String(input));
      return new Response(JSON.stringify({ message: "nope" }), { status: 500 });
    }) as typeof fetch;

    const result = await processQuote(quoteForm(), headers({ "x-forwarded-for": "203.0.113.83" }), NOW);
    assert.equal(result.status, 502);
    assert.equal(result.lead, undefined);
    assert.equal(urls.some((url) => url.includes("bzr.openai.com")), false);
  });

  it("sends the route request's cookies, address and user agent with the quote reference", async () => {
    process.env.OPENAI_ADS_CAPI_KEY = KEY;
    const calls: { url: string; body: string }[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({ url: String(input), body: typeof init?.body === "string" ? init.body : "" });
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const response = await POST(new Request("http://localhost/api/quote", {
      method: "POST",
      headers: {
        "x-forwarded-for": "203.0.113.84",
        "user-agent": "Mozilla/5.0 Route",
        cookie: "__oppref=from-route; __obref=route-browser",
      },
      body: quoteForm({ page: "/locations/logan" }),
    }));
    assert.equal(response.status, 200);
    const payload = (await response.json()) as { ok: boolean; lead?: boolean; ref?: string };
    assert.equal(payload.ok, true);
    assert.equal(payload.lead, true);
    const openai = calls.find((call) => call.url.includes("bzr.openai.com"));
    assert.ok(openai);
    const body = JSON.parse(openai.body) as {
      events: { id: string; source_url: string; oppref?: string; user?: { obref?: string; ip_address?: string; user_agent?: string } }[];
    };
    assert.equal(body.events[0].id, payload.ref);
    assert.equal(body.events[0].oppref, "from-route");
    assert.equal(body.events[0].user?.obref, "route-browser");
    assert.equal(body.events[0].user?.ip_address, "203.0.113.84");
    assert.equal(body.events[0].user?.user_agent, "Mozilla/5.0 Route");
    assert.equal(body.events[0].source_url, `${site.url}/locations/logan`);
  });
});
