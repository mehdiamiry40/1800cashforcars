import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { submitQuote } from "../src/app/actions";

const originalEnv = { ...process.env };
beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.LEAD_TO_EMAIL;
  mock.method(console, "log", () => {});
  mock.method(console, "error", () => {});
  // No test may send a real quote email.
  mock.method(globalThis, "fetch", async () => {
    throw new Error("Unexpected network request");
  });
});
afterEach(() => {
  process.env = { ...originalEnv };
  mock.restoreAll();
});

function lead(overrides: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Test Customer",
    phone: "0400 000 000",
    email: "test@example.com",
    vehicle: "2009 Corolla, not running",
    ...overrides,
  }))
    data.set(key, value);
  return data;
}

test("missing email configuration does not confirm receipt", async () => {
  const result = await submitQuote(null, lead());
  assert.equal(result?.ok, false);
  assert.match(result!.message, /call|try again/i);
});

test("phone made only of punctuation is rejected before delivery", async () => {
  const result = await submitQuote(null, lead({ phone: "--------" }));
  assert.equal(result?.ok, false);
  assert.match(result!.message, /phone/i);
});

test("invalid optional email is rejected before delivery", async () => {
  const result = await submitQuote(null, lead({ email: "not-an-email" }));
  assert.equal(result?.ok, false);
  assert.match(result!.message, /email/i);
});

test("missing required details are rejected", async () => {
  assert.equal((await submitQuote(null, lead({ vehicle: " " })))?.ok, false);
});

test("provider rejection returns a recoverable failure", async () => {
  process.env.RESEND_API_KEY = "re_test_not_a_real_key";
  process.env.LEAD_TO_EMAIL = "test@example.com";
  mock.method(
    globalThis,
    "fetch",
    async () =>
      new Response(
        JSON.stringify({
          name: "validation_error",
          message: "Rejected",
          statusCode: 422,
        }),
        { status: 422 },
      ),
  );
  assert.equal((await submitQuote(null, lead()))?.ok, false);
});

test("network failure returns a recoverable failure", async () => {
  process.env.RESEND_API_KEY = "re_test_not_a_real_key";
  process.env.LEAD_TO_EMAIL = "test@example.com";
  assert.equal((await submitQuote(null, lead()))?.ok, false);
});

test("successful provider receipt confirms the request and escapes email HTML", async () => {
  process.env.RESEND_API_KEY = "re_test_not_a_real_key";
  process.env.LEAD_TO_EMAIL = "test@example.com";
  let sentHtml = "";
  mock.method(
    globalThis,
    "fetch",
    async (_url: unknown, options: RequestInit) => {
      sentHtml = JSON.parse(String(options.body)).html;
      return new Response(JSON.stringify({ id: "test-message" }), {
        status: 200,
      });
    },
  );
  assert.equal(
    (await submitQuote(null, lead({ name: "<script>test</script>" })))?.ok,
    true,
  );
  assert.ok(sentHtml.includes("&lt;script&gt;"));
  assert.ok(!sentHtml.includes("<script>"));
});
