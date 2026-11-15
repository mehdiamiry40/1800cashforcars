// Spam checks shared by the quote form (browser) and the quote handler (server).

/**
 * Hidden field real visitors never see. The name is one that browsers and password managers
 * do not autofill. The old name, "company", is an autofill target, so a real visitor could
 * trip the check without knowing.
 */
export const QUOTE_HONEYPOT_FIELD = "comments";

/** Nobody fills the form in under ~2.5 seconds. Measured from when the form appears to when it is sent. */
export const MIN_SUBMIT_MS = 2500;
