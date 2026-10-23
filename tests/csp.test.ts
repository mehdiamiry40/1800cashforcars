import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  inlineScripts,
  requiredScriptHashes,
  sha256Source,
  stripPreviewToolbar,
  uncoveredInlineScripts,
} from "../src/lib/csp-inline";
import {
  CSP_HASH_PLACEHOLDER,
  assertProductionScriptSrc,
  buildContentSecurityPolicy,
  buildDevContentSecurityPolicy,
  directiveValue,
} from "../src/lib/csp-policy";

const GTAG = "window.dataLayer = window.dataLayer || [];";

function page(extra = ""): string {
  const payload = JSON.stringify([0, { children: GTAG, id: "google-ads-tag" }]);
  return `<!doctype html><script src="/_next/static/chunks/app.js"></script>
<script type="application/ld+json">{"@type":"WebSite"}</script>
<script>(self.__next_s=self.__next_s||[]).push(${payload})</script>
<script>(self.__next_f=self.__next_f||[]).push([0])</script>
${extra}`;
}

describe("content security policy", () => {
  it("hashes the script source the browser hashes", () => {
    assert.equal(sha256Source("window.__ok = 1"), "'sha256-jHIk/15hbltKLWfuHJjRVWpRTvmtGvByNu5yNRfH7oc='");
  });

  it("ignores JSON-LD and external scripts, and hashes next/script payloads", () => {
    const scripts = inlineScripts(page());
    assert.equal(scripts.length, 2);
    assert.deepEqual(scripts[0]?.dynamic, [GTAG]);
    const hashes = requiredScriptHashes(page());
    assert.ok(hashes.includes(sha256Source(scripts[0]!.text)));
    assert.ok(hashes.includes(sha256Source(GTAG)));
    assert.ok(hashes.includes(sha256Source("(self.__next_f=self.__next_f||[]).push([0])")));
  });

  it("keeps unsafe-eval out of the production script-src", () => {
    const policy = buildContentSecurityPolicy([sha256Source("var ready = true;")]);
    assert.equal(directiveValue(policy, "script-src").includes("'unsafe-inline'"), false);
    assert.equal(directiveValue(policy, "script-src").includes("'unsafe-eval'"), false);
    assert.equal(directiveValue(policy, "frame-ancestors"), "'none'");
    assert.match(directiveValue(policy, "img-src"), /https:\/\/www\.googletagmanager\.com/);
    assert.equal(policy.includes("vercel.live"), false);
    assert.doesNotThrow(() => assertProductionScriptSrc(policy));
    assert.equal(uncoveredInlineScripts("<script>var ready = true;</script>", policy).length, 0);
  });

  it("ships a placeholder until the post-build step fills hashes", () => {
    const policy = buildContentSecurityPolicy([]);
    assert.ok(policy.includes(CSP_HASH_PLACEHOLDER));
    assert.throws(() => assertProductionScriptSrc(policy), /placeholder/);
  });

  it("allows eval only in the development policy", () => {
    const dev = buildDevContentSecurityPolicy();
    assert.match(directiveValue(dev, "script-src"), /'unsafe-eval'/);
    assert.match(directiveValue(dev, "script-src"), /'unsafe-inline'/);
  });

  it("strips the preview toolbar injection and rejects an unknown one", () => {
    const injected =
      'before;var r=document.createElement("script");r.src="https://vercel.live/_next-live/feedback/feedback.js",r.setAttribute("data-deployment-id",globalThis.NEXT_DEPLOYMENT_ID),(document.head||document.documentElement).appendChild(r);after';
    assert.equal(stripPreviewToolbar(injected), "before;void 0;after");
    assert.equal(stripPreviewToolbar("var ready = true;"), "var ready = true;");
    assert.throws(
      () => stripPreviewToolbar('const src = "https://vercel.live/_next-live/feedback/feedback.js";'),
      /unrecognized/,
    );
  });

  it("fails closed when a prerendered inline script has no hash", () => {
    const policy = buildContentSecurityPolicy([sha256Source("var ready = true;")]);
    const missing = uncoveredInlineScripts("<script>var other = true;</script>", policy);
    assert.deepEqual(missing, [sha256Source("var other = true;")]);
  });
});
