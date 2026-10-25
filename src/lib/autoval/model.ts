/** Previous AutoVal model. Retried once when the primary call fails. */
export const AUTOVAL_FALLBACK_MODEL = "anthropic/claude-sonnet-5-5";

/**
 * Current DeepSeek chat model on Vercel AI Gateway.
 * DeepSeek's `deepseek-flash` API name is served by DeepSeek-V4.1-Flash-1017.
 */
export const AUTOVAL_DEFAULT_MODEL = "deepseek/deepseek-v4.1-flash-1017";

/**
 * Gateway model id for AutoVal. `AUTOVAL_MODEL` overrides it; the older
 * `VALUATION_MODEL` name still works. No provider API key is required:
 * both ids are called through the Vercel AI Gateway.
 */
export function autovalModel(env: NodeJS.ProcessEnv = process.env): string {
  return env.AUTOVAL_MODEL?.trim() || env.VALUATION_MODEL?.trim() || AUTOVAL_DEFAULT_MODEL;
}
