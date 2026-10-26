import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AUTOVAL_DEFAULT_MODEL,
  AUTOVAL_FALLBACK_MODEL,
  AUTOVAL_OUTPUT_REASONING,
  AUTOVAL_SEARCH_REASONING,
  AUTOVAL_STANDARD_MODEL,
  autovalAttempts,
  autovalDeepseekOptions,
  autovalModel,
} from "@/lib/autoval/model";

function env(values: Record<string, string> = {}): NodeJS.ProcessEnv {
  return { NODE_ENV: "test", ...values };
}

describe("AutoVal model", () => {
  it("defaults to the fast DeepSeek V4.1 Flash tier on the AI Gateway", () => {
    assert.equal(AUTOVAL_DEFAULT_MODEL, "deepseek/deepseek-v4.1-flash-1017-fast");
    assert.equal(autovalModel(env()), AUTOVAL_DEFAULT_MODEL);
  });

  it("tries the fast tier, then the standard model, then Claude", () => {
    assert.equal(AUTOVAL_STANDARD_MODEL, "deepseek/deepseek-v4.1-flash-1017");
    assert.equal(AUTOVAL_FALLBACK_MODEL, "anthropic/claude-sonnet-5-5");
    assert.deepEqual(autovalAttempts(AUTOVAL_DEFAULT_MODEL), [
      "deepseek/deepseek-v4.1-flash-1017-fast",
      "deepseek/deepseek-v4.1-flash-1017",
      "anthropic/claude-sonnet-5-5",
    ]);
  });

  it("sorts DeepSeek providers by throughput and keeps reasoning off the JSON step", () => {
    assert.equal(AUTOVAL_SEARCH_REASONING, "low");
    assert.equal(AUTOVAL_OUTPUT_REASONING, "none");
    assert.deepEqual(autovalDeepseekOptions(AUTOVAL_DEFAULT_MODEL, "search"), {
      reasoning: "low",
      providerOptions: { gateway: { sort: "tps" } },
    });
    assert.deepEqual(autovalDeepseekOptions(AUTOVAL_STANDARD_MODEL, "output"), {
      reasoning: "none",
      providerOptions: { gateway: { sort: "tps" } },
    });
  });

  it("does not attach DeepSeek routing to an override or the Claude retry", () => {
    assert.deepEqual(autovalDeepseekOptions(AUTOVAL_FALLBACK_MODEL, "search"), {});
    assert.deepEqual(autovalDeepseekOptions(AUTOVAL_FALLBACK_MODEL, "output"), {});
    assert.deepEqual(autovalDeepseekOptions("google/gemini-3-flash", "output"), {});
    assert.deepEqual(autovalAttempts(AUTOVAL_FALLBACK_MODEL), ["anthropic/claude-sonnet-5-5"]);
    assert.deepEqual(autovalAttempts("google/gemini-3-flash"), ["google/gemini-3-flash", "anthropic/claude-sonnet-5-5"]);
    assert.deepEqual(autovalAttempts(AUTOVAL_STANDARD_MODEL), [
      "deepseek/deepseek-v4.1-flash-1017",
      "anthropic/claude-sonnet-5-5",
    ]);
  });

  it("prefers AUTOVAL_MODEL, then the existing VALUATION_MODEL name", () => {
    assert.equal(autovalModel(env({ AUTOVAL_MODEL: "  google/gemini-3-flash  " })), "google/gemini-3-flash");
    assert.equal(autovalModel(env({ VALUATION_MODEL: "anthropic/claude-sonnet-5-5" })), "anthropic/claude-sonnet-5-5");
    assert.equal(
      autovalModel(env({ AUTOVAL_MODEL: "deepseek/deepseek-v4-pro", VALUATION_MODEL: "anthropic/claude-sonnet-5-5" })),
      "deepseek/deepseek-v4-pro",
    );
    assert.equal(autovalModel(env({ AUTOVAL_MODEL: "  ", VALUATION_MODEL: "" })), AUTOVAL_DEFAULT_MODEL);
  });
});
