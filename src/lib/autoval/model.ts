import type { GatewayProviderOptions } from "@ai-sdk/gateway";

/** Previous AutoVal model. Retried once when the DeepSeek attempts fail. */
export const AUTOVAL_FALLBACK_MODEL = "anthropic/claude-sonnet-5-5";

/**
 * Standard DeepSeek V4.1 Flash. Tried after the fast tier when that tier
 * does not search or does not return schema-valid JSON.
 */
export const AUTOVAL_STANDARD_MODEL = "deepseek/deepseek-v4.1-flash-1017";

/**
 * Fast DeepSeek V4.1 Flash tier on Vercel AI Gateway (Baseten).
 * Highest measured tokens per second for this model.
 */
export const AUTOVAL_DEFAULT_MODEL = "deepseek/deepseek-v4.1-flash-1017-fast";

/**
 * Search can use a little reasoning. The valuation JSON cannot: this
 * provider does not enforce the response schema, so reasoning text in the
 * body fails JSON parsing. Both models accept `none` and `low`.
 */
export const AUTOVAL_SEARCH_REASONING = "low" as const;
export const AUTOVAL_OUTPUT_REASONING = "none" as const;

/**
 * Gateway model id for AutoVal. `AUTOVAL_MODEL` overrides it; the older
 * `VALUATION_MODEL` name still works. No provider API key is required:
 * both ids are called through the Vercel AI Gateway.
 */
export function autovalModel(env: NodeJS.ProcessEnv = process.env): string {
  return env.AUTOVAL_MODEL?.trim() || env.VALUATION_MODEL?.trim() || AUTOVAL_DEFAULT_MODEL;
}

export function isAutovalDeepseek(model: string): boolean {
  return model === AUTOVAL_DEFAULT_MODEL || model === AUTOVAL_STANDARD_MODEL;
}

/**
 * Models tried in order. Gateway `models` fallback only runs when the
 * provider call fails. A schema failure is a successful provider response,
 * so the standard model has to be the next application attempt.
 */
export function autovalAttempts(model: string): string[] {
  if (model === AUTOVAL_DEFAULT_MODEL) {
    return [AUTOVAL_DEFAULT_MODEL, AUTOVAL_STANDARD_MODEL, AUTOVAL_FALLBACK_MODEL];
  }
  if (model === AUTOVAL_FALLBACK_MODEL) return [model];
  return [model, AUTOVAL_FALLBACK_MODEL];
}

/**
 * DeepSeek routing. `sort: "tps"` ranks providers by tokens per second.
 * Claude and other overrides do not receive it.
 */
export function autovalDeepseekOptions(model: string, phase: "search" | "output") {
  if (!isAutovalDeepseek(model)) return {};
  const gateway = { sort: "tps" } satisfies GatewayProviderOptions;
  return {
    reasoning: phase === "search" ? AUTOVAL_SEARCH_REASONING : AUTOVAL_OUTPUT_REASONING,
    providerOptions: { gateway },
  };
}
