import { PublicError } from "@/lib/public-error";
import { AUTOVAL_LOOKUP_FAILED, AUTOVAL_LOOKUP_UNAVAILABLE } from "@/lib/autoval/messages";
import { RegoLookupUnavailableError } from "@/lib/autoval/rego";

/** Maps a lookup failure to a message we can show. Upstream and config details stay in the logs. */
export function lookupErrorBody(err: unknown): { status: number; error: string } {
  if (err instanceof RegoLookupUnavailableError) {
    console.error("[autoval] rego lookup unavailable", err);
    return { status: 501, error: AUTOVAL_LOOKUP_UNAVAILABLE };
  }
  if (err instanceof PublicError) return { status: err.status, error: err.message };
  console.error("[autoval] lookup failed", err);
  return { status: 422, error: AUTOVAL_LOOKUP_FAILED };
}
