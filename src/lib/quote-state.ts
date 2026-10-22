// Kept in its own module so the client form can use the type without bundling the server submission code.
export type QuoteState = { ok: boolean; message: string; lead?: boolean } | null;
