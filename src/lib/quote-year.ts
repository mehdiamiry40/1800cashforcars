// Shared by the quote form and the quote API. A 4-digit model year, not a birth year.
export const QUOTE_YEAR_MIN = 1950;

export function quoteYearMax(now = new Date()): number {
  return now.getFullYear() + 1;
}

export function quoteYearError(value: string, now = new Date()): string | null {
  const max = quoteYearMax(now);
  if (!/^\d{4}$/.test(value)) return "Enter a 4-digit year.";
  const year = Number(value);
  if (year < QUOTE_YEAR_MIN || year > max) return `Enter a year from ${QUOTE_YEAR_MIN} to ${max}.`;
  return null;
}
