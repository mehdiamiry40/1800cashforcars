import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AUTOVAL_DEFAULT_MODEL,
  AUTOVAL_FALLBACK_MODEL,
  AUTOVAL_REASONING_EFFORT,
  AUTOVAL_STANDARD_MODEL,
  autovalDeepseekRequestOptions,
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

  it("keeps the standard DeepSeek model as the gateway fallback and Claude as the last resort", () => {
    assert.equal(AUTOVAL_STANDARD_MODEL, "deepseek/deepseek-v4.1-flash-1017");
    assert.equal(AUTOVAL_FALLBACK_MODEL, "anthropic/claude-sonnet-5-5");
  });

  it("sends the fast call through gateway model fallback, throughput sorting, and low reasoning", () => {
    assert.equal(AUTOVAL_REASONING_EFFORT, "low");
    assert.deepEqual(autovalDeepseekRequestOptions(AUTOVAL_DEFAULT_MODEL), {
      reasoning: "low",
      providerOptions: {
        gateway: {
          models: ["deepseek/deepseek-v4.1-flash-1017"],
          sort: "tps",
        },
      },
    });
  });

  it("does not attach DeepSeek routing to an override or the Claude retry", () => {
    assert.equal(autovalDeepseekRequestOptions(AUTOVAL_FALLBACK_MODEL), undefined);
    assert.equal(autovalDeepseekRequestOptions(AUTOVAL_STANDARD_MODEL), undefined);
    assert.equal(autovalDeepseekRequestOptions("google/gemini-3-flash"), undefined);
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
