import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AUTOVAL_DEFAULT_MODEL, AUTOVAL_FALLBACK_MODEL, autovalModel } from "@/lib/autoval/model";

function env(values: Record<string, string> = {}): NodeJS.ProcessEnv {
  return { NODE_ENV: "test", ...values };
}

describe("AutoVal model", () => {
  it("defaults to the current DeepSeek chat model on the AI Gateway", () => {
    assert.equal(AUTOVAL_DEFAULT_MODEL, "deepseek/deepseek-v4.1-flash-1017");
    assert.equal(autovalModel(env()), AUTOVAL_DEFAULT_MODEL);
  });

  it("keeps Claude Sonnet 5.5 as the fallback", () => {
    assert.equal(AUTOVAL_FALLBACK_MODEL, "anthropic/claude-sonnet-5-5");
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
