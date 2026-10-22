import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AUTOVAL_LOOKUP_LIMIT, AUTOVAL_VALUATE_LIMIT, QUOTE_LIMIT, clientIp, rateLimit } from "@/lib/rate-limit";

function headers(values: Record<string, string>): { get(name: string): string | null } {
  return { get: (name) => values[name] ?? null };
}

describe("clientIp", () => {
  it("uses the first address in x-forwarded-for", () => {
    assert.equal(clientIp(headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" })), "203.0.113.5");
  });

  it("skips empty forwarded entries", () => {
    assert.equal(clientIp(headers({ "x-forwarded-for": " , 198.51.100.8" })), "198.51.100.8");
  });

  it("falls back to x-real-ip", () => {
    assert.equal(clientIp(headers({ "x-real-ip": "192.0.2.20" })), "192.0.2.20");
  });

  it("uses unknown when neither header is set", () => {
    assert.equal(clientIp(headers({})), "unknown");
  });
});

describe("sliding window", () => {
  const start = 1_700_000_000_000;

  it("allows the limit and blocks the next hit inside the window", () => {
    const key = "window-block";
    for (let i = 0; i < QUOTE_LIMIT.limit; i++) {
      assert.deepEqual(rateLimit(key, QUOTE_LIMIT, start + i), { limited: false });
    }
    const blocked = rateLimit(key, QUOTE_LIMIT, start + QUOTE_LIMIT.limit);
    assert.equal(blocked.limited, true);
    if (blocked.limited) assert.ok(blocked.retryAfter > 0);
  });

  it("opens a slot once the oldest hit slides out of the window", () => {
    const key = "window-slide";
    assert.equal(rateLimit(key, QUOTE_LIMIT, start).limited, false);
    for (let i = 1; i < QUOTE_LIMIT.limit; i++) {
      assert.equal(rateLimit(key, QUOTE_LIMIT, start + 1_000).limited, false);
    }
    assert.equal(rateLimit(key, QUOTE_LIMIT, start + 1_000).limited, true);
    assert.equal(rateLimit(key, QUOTE_LIMIT, start + QUOTE_LIMIT.windowMs).limited, false);
  });

  it("keeps quote, lookup and valuation limits separate", () => {
    const ip = "203.0.113.77";
    for (let i = 0; i < QUOTE_LIMIT.limit; i++) rateLimit(`quote:${ip}`, QUOTE_LIMIT, start);
    assert.equal(rateLimit(`autoval:lookup:${ip}`, AUTOVAL_LOOKUP_LIMIT, start).limited, false);
    assert.equal(rateLimit(`autoval:valuate:${ip}`, AUTOVAL_VALUATE_LIMIT, start).limited, false);
  });
});
