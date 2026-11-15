// Pages for a browser that sent the quote form itself, because the form's script had not loaded yet
// or is switched off. The script's own requests get JSON and never come here.
export const QUOTE_SENT_PATH = "/quote/sent";
export const QUOTE_NOT_SENT_PATH = "/quote/not-sent";

/** Where to send that browser. Only the quote reference goes in the address, never message text. */
export function quoteResultPath(result: { ok: boolean; lead?: boolean; ref?: string }): string {
  if (!result.ok) return QUOTE_NOT_SENT_PATH;
  return result.lead && result.ref ? `${QUOTE_SENT_PATH}?ref=${encodeURIComponent(result.ref)}` : QUOTE_SENT_PATH;
}
