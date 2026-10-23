import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { POST as lookup } from "@/app/api/autoval/lookup/route";
import { POST as valuate } from "@/app/api/autoval/valuate/route";
import { lookupErrorBody } from "@/lib/autoval/errors";
import { autovalRateLimitResponse } from "@/lib/autoval/limit";
import {
  AUTOVAL_DETAILS_INVALID,
  AUTOVAL_LOOKUP_FAILED,
  AUTOVAL_LOOKUP_UNAVAILABLE,
  AUTOVAL_RATE_LIMIT_MESSAGE,
  AUTOVAL_VALUATION_FAILED,
} from "@/lib/autoval/messages";
import { RegoLookupUnavailableError } from "@/lib/autoval/rego";
import { AUTOVAL_LOOKUP_LIMIT, AUTOVAL_VALUATE_LIMIT } from "@/lib/rate-limit";
import { PublicError } from "@/lib/public-error";

const NOW = 1_900_000_000_000;

function headers(ip: string) {
  return { get: (name: string) => (name === "x-forwarded-for" ? ip : name === "x-real-ip" ? null : null) };
}

describe("AutoVal limits", () => {
  it("allows a normal run of lookups, then returns a generic 429", async () => {
    const ip = "198.51.100.20";
    for (let i = 0; i < AUTOVAL_LOOKUP_LIMIT.limit; i++) {
      assert.equal(autovalRateLimitResponse("lookup", headers(ip), NOW + i), null);
    }
    const blocked = autovalRateLimitResponse("lookup", headers(ip), NOW + AUTOVAL_LOOKUP_LIMIT.limit);
    assert.ok(blocked);
    assert.equal(blocked.status, 429);
    const body = (await blocked.json()) as { error: string };
    assert.equal(body.error, AUTOVAL_RATE_LIMIT_MESSAGE);
    assert.doesNotMatch(body.error, /stack|Error|API/);
  });

  it("limits valuations separately from lookups", async () => {
    const ip = "198.51.100.21";
    for (let i = 0; i < AUTOVAL_VALUATE_LIMIT.limit; i++) {
      assert.equal(autovalRateLimitResponse("valuate", headers(ip), NOW), null);
    }
    const blocked = autovalRateLimitResponse("valuate", headers(ip), NOW);
    assert.equal(blocked?.status, 429);
    assert.equal(autovalRateLimitResponse("lookup", headers(ip), NOW), null);
  });

  it("returns 429 from the lookup and valuation routes", async () => {
    const lookupIp = "198.51.100.22";
    for (let i = 0; i < AUTOVAL_LOOKUP_LIMIT.limit; i++) {
      const res = await lookup(new Request("http://localhost/api/autoval/lookup", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": lookupIp },
        body: JSON.stringify({ type: "vin", vin: "SHORT" }),
      }));
      assert.equal(res.status, 422);
    }
    const lookupBlocked = await lookup(new Request("http://localhost/api/autoval/lookup", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": lookupIp },
      body: JSON.stringify({ type: "vin", vin: "SHORT" }),
    }));
    assert.equal(lookupBlocked.status, 429);
    assert.equal(((await lookupBlocked.json()) as { error: string }).error, AUTOVAL_RATE_LIMIT_MESSAGE);

    const valueIp = "198.51.100.23";
    for (let i = 0; i < AUTOVAL_VALUATE_LIMIT.limit; i++) {
      const res = await valuate(new Request("http://localhost/api/autoval/valuate", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": valueIp, "x-real-ip": "10.0.0.8" },
        body: "{}",
      }));
      const body = (await res.json()) as { error: string };
      assert.equal(res.status, 400);
      assert.equal(body.error, AUTOVAL_DETAILS_INVALID);
      assert.doesNotMatch(body.error, /odometer|expected|invalid/i);
    }
    const valueBlocked = await valuate(new Request("http://localhost/api/autoval/valuate", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": valueIp },
      body: "{}",
    }));
    assert.equal(valueBlocked.status, 429);
    assert.equal(((await valueBlocked.json()) as { error: string }).error, AUTOVAL_RATE_LIMIT_MESSAGE);
  });
});

describe("AutoVal public errors", () => {
  it("shows a plate or VIN problem we wrote for the visitor", () => {
    const body = lookupErrorBody(new PublicError("Enter a valid Australian number plate."));
    assert.equal(body.status, 422);
    assert.equal(body.error, "Enter a valid Australian number plate.");
  });

  it("hides rego configuration details", () => {
    const body = lookupErrorBody(new RegoLookupUnavailableError("set REGO_API_USERNAME in the environment"));
    assert.equal(body.status, 501);
    assert.equal(body.error, AUTOVAL_LOOKUP_UNAVAILABLE);
    assert.doesNotMatch(body.error, /REGO_API_USERNAME|environment/);
  });

  it("hides upstream failures", () => {
    const body = lookupErrorBody(new Error("connect ECONNREFUSED 10.1.2.3 vPIC returned 500"));
    assert.equal(body.error, AUTOVAL_LOOKUP_FAILED);
    assert.doesNotMatch(body.error, /ECONNREFUSED|10\.1\.2\.3|vPIC/);
  });

  it("uses one generic valuation failure message", () => {
    assert.doesNotMatch(AUTOVAL_VALUATION_FAILED, /API key|sk-|Valuation failed:/i);
  });

  it("lookup route turns a missing rego service into a generic 501", async () => {
    const previous = process.env.REGO_API_USERNAME;
    delete process.env.REGO_API_USERNAME;
    try {
      const res = await lookup(new Request("http://localhost/api/autoval/lookup", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.40" },
        body: JSON.stringify({ type: "rego", rego: "ABC123", state: "QLD" }),
      }));
      const body = (await res.json()) as { error: string };
      assert.equal(res.status, 501);
      assert.equal(body.error, AUTOVAL_LOOKUP_UNAVAILABLE);
      assert.doesNotMatch(body.error, /REGO_API/);
    } finally {
      if (previous === undefined) delete process.env.REGO_API_USERNAME;
      else process.env.REGO_API_USERNAME = previous;
    }
  });
});
