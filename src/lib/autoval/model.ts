import type { GatewayProviderOptions } from "@ai-sdk/gateway";

/** Previous AutoVal model. Retried once when the primary call fails. */
export const AUTOVAL_FALLBACK_MODEL = "anthropic/claude-sonnet-5-5";

/**
 * Standard DeepSeek V4.1 Flash. Gateway fallback when the fast tier's
 * providers fail. Tried before the Claude retry.
 */
export const AUTOVAL_STANDARD_MODEL = "deepseek/deepseek-v4.1-flash-1017";

/**
 * Fast DeepSeek V4.1 Flash tier on Vercel AI Gateway (Baseten).
 * Highest measured tokens per second for this model.
 */
export const AUTOVAL_DEFAULT_MODEL = "deepseek/deepseek-v4.1-flash-1017-fast";

/**
 * Effort for the fast DeepSeek call. Both the fast tier (`none | low |
 * medium | high`) and the standard model (`none | low | high | max`)
 * accept `low`. Kept off the Claude retry.
 */
export const AUTOVAL_REASONING_EFFORT = "low" as const;

/**
 * Gateway model id for AutoVal. `AUTOVAL_MODEL` overrides it; the older
 * `VALUATION_MODEL` name still works. No provider API key is required:
 * both ids are called through the Vercel AI Gateway.
 */
export function autovalModel(env: NodeJS.ProcessEnv = process.env): string {
  return env.AUTOVAL_MODEL?.trim() || env.VALUATION_MODEL?.trim() || AUTOVAL_DEFAULT_MODEL;
}

/**
 * Routing for the fast DeepSeek call only. `models` is the standard
 * variant; `sort: "tps"` ranks each model's providers by tokens per
 * second. Undefined for env overrides and for the Claude retry, so those
 * calls do not inherit DeepSeek provider routing.
 *
 * The object is checked against the installed gateway option type, then
 * kept as that narrow object so it stays valid `providerOptions` JSON.
 */
export function autovalDeepseekRequestOptions(model: string) {
  if (model !== AUTOVAL_DEFAULT_MODEL) return undefined;
  const gateway = {
    models: [AUTOVAL_STANDARD_MODEL],
    sort: "tps",
  } satisfies GatewayProviderOptions;
  return {
    reasoning: AUTOVAL_REASONING_EFFORT,
    providerOptions: { gateway },
  };
}
