import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CANONICAL_ORIGIN, canonicalCasePath, canonicalRedirectUrl } from "../src/lib/canonical-host";

describe("brand-case addresses", () => {
  it("sends /AutoVal, in any mix of capitals, to /autoval", () => {
    assert.equal(canonicalCasePath("/AutoVal"), "/autoval");
    assert.equal(canonicalCasePath("/AUTOVAL"), "/autoval");
    assert.equal(canonicalCasePath("/Autoval"), "/autoval");
    assert.equal(canonicalCasePath("/AutoVal/"), "/autoval");
  });

  // The page's own address must come back unchanged, or the redirect would loop.
  it("leaves the lower-case page alone", () => {
    assert.equal(canonicalCasePath("/autoval"), "/autoval");
    assert.equal(canonicalCasePath("/autoval/"), "/autoval/");
  });

  it("leaves every other path alone, whatever its case", () => {
    for (const path of ["/", "/about", "/About", "/AutoVal/report", "/api/autoval/lookup", "/API/AutoVal/Lookup", "/autovalue", "/_next/static/AutoVal.js"]) {
      assert.equal(canonicalCasePath(path), path);
    }
  });

  it("reaches the canonical page in one redirect from another host", () => {
    assert.equal(
      canonicalRedirectUrl("example.com", canonicalCasePath("/AutoVal"), "?utm_source=x"),
      `${CANONICAL_ORIGIN}/autoval?utm_source=x`,
    );
  });
});

describe("canonical host", () => {
  it("serves the canonical host, localhost and preview deployments without a redirect", () => {
    assert.equal(canonicalRedirectUrl("1800cashforcars.com.au", "/autoval"), null);
    assert.equal(canonicalRedirectUrl("localhost:3010", "/autoval"), null);
    assert.equal(canonicalRedirectUrl("cashforcars-git-branch-team.vercel.app", "/autoval"), null);
  });
});
