// Same rule the quote email uses for reply-to. Blank is allowed.
const QUOTE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function quoteEmailError(value: string): string | null {
  const email = value.trim();
  if (!email) return null;
  if (!QUOTE_EMAIL.test(email)) return "Enter a valid email address, or leave it blank.";
  return null;
}
