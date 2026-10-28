import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { sha256Source, uncoveredInlineScripts } from "@/lib/csp-inline";
import { buildContentSecurityPolicy, directiveValue } from "@/lib/csp-policy";
import { measureOpenAiCallClick, measureOpenAiLead, openAiAdsBootstrapScript, quoteLeadEventId } from "@/lib/openai-ads";
import { OPENAI_ADS_PIXEL_ID } from "@/lib/site";

const holder = globalThis as { window?: { oaiq?: (...args: unknown[]) => void } };

afterEach(() => {
  delete holder.window;
});

describe("ChatGPT Ads measurement pixel", () => {
  it("bakes the confirmed pixel id into the bootstrap", () => {
    assert.equal(OPENAI_ADS_PIXEL_ID, "Tf8BpfGnY6eFM4ukchfyy3");
    const script = openAiAdsBootstrapScript();
    assert.match(script, /https:\/\/bzrcdn\.openai\.com\/sdk\/oaiq\.min\.js/);
    assert.match(script, /oaiq\("init", \{ pixelId: "Tf8BpfGnY6eFM4ukchfyy3" \}\)/);
    assert.equal(script.includes("unsafe-inline"), false);
    assert.throws(() => openAiAdsBootstrapScript(""), /OPENAI_ADS_PIXEL_ID is empty/);
  });

  it("hashes the bootstrap instead of allowing unsafe-inline", () => {
    const bootstrap = openAiAdsBootstrapScript();
    const html = `<!doctype html><script>${bootstrap}</script>`;
    const without = buildContentSecurityPolicy([sha256Source("var ready = true;")]);
    assert.deepEqual(uncoveredInlineScripts(html, without), [sha256Source(bootstrap)]);
    const withHash = buildContentSecurityPolicy([sha256Source(bootstrap)]);
    assert.equal(uncoveredInlineScripts(html, withHash).length, 0);
    assert.equal(directiveValue(withHash, "script-src").includes("'unsafe-inline'"), false);
  });

  it("fires lead_created once per quote reference and ignores non-leads", () => {
    assert.equal(quoteLeadEventId(null), null);
    assert.equal(quoteLeadEventId({ ok: true }), null);
    assert.equal(quoteLeadEventId({ ok: true, lead: false, ref: "Q-AAAAAA" }), null);
    assert.equal(quoteLeadEventId({ ok: false, lead: true, ref: "Q-AAAAAA" }), null);
    assert.equal(quoteLeadEventId({ ok: false, ref: "Q-AAAAAA" }), null);
    assert.equal(quoteLeadEventId({ ok: true, lead: true, ref: "" }), null);
    assert.equal(quoteLeadEventId({ ok: true, lead: true, ref: "Q-LEAD01" }), "Q-LEAD01");

    const calls: unknown[][] = [];
    holder.window = {
      oaiq: (...args: unknown[]) => {
        calls.push(args);
      },
    };

    assert.equal(measureOpenAiLead(""), false);
    assert.equal(measureOpenAiLead("Q-LEAD01"), true);
    assert.equal(measureOpenAiLead("Q-LEAD01"), false);
    assert.equal(measureOpenAiLead("Q-LEAD02"), true);
    assert.deepEqual(calls, [
      ["measure", "lead_created", { type: "customer_action" }, { event_id: "Q-LEAD01" }],
      ["measure", "lead_created", { type: "customer_action" }, { event_id: "Q-LEAD02" }],
    ]);
  });

  it("does not mark a lead measured when the pixel queue is missing", () => {
    assert.equal(measureOpenAiLead("Q-RETRY1"), false);
    const calls: unknown[][] = [];
    holder.window = {
      oaiq: (...args: unknown[]) => {
        calls.push(args);
      },
    };
    assert.equal(measureOpenAiLead("Q-RETRY1"), true);
    assert.equal(calls.length, 1);
  });

  it("fires call_click only through the custom event shape", () => {
    const calls: unknown[][] = [];
    holder.window = {
      oaiq: (...args: unknown[]) => {
        calls.push(args);
      },
    };
    assert.equal(measureOpenAiCallClick(), true);
    assert.equal(measureOpenAiCallClick(), true);
    assert.deepEqual(calls, [
      ["measure", "custom", { type: "custom" }, { custom_event_name: "call_click" }],
      ["measure", "custom", { type: "custom" }, { custom_event_name: "call_click" }],
    ]);
    delete holder.window;
    assert.equal(measureOpenAiCallClick(), false);
  });
});
