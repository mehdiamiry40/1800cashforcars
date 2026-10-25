// Uppercase, with 0/O and 1/I/L left out so a reference can be read back over the phone.
export const QUOTE_REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const QUOTE_REF_PATTERN = /^Q-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

export function generateQuoteRef(): string {
  const chars: string[] = [];
  const bytes = new Uint8Array(16);
  const limit = QUOTE_REF_ALPHABET.length * 8;
  while (chars.length < 6) {
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      if (byte >= limit) continue;
      chars.push(QUOTE_REF_ALPHABET[byte % QUOTE_REF_ALPHABET.length]!);
      if (chars.length === 6) break;
    }
  }
  return `Q-${chars.join("")}`;
}
