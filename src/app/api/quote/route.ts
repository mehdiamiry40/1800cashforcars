import { toQuoteState, processQuote } from "@/lib/quote";
import { QUOTE_NOT_SENT_PATH, quoteResultPath } from "@/lib/quote-sent";

// The form's script sends the request with fetch and reads JSON back. A browser that sends the form
// itself (the script had not loaded yet, or is switched off) is navigating, and would show that JSON
// as the page. It is sent to a result page instead.
function isFormNavigation(request: Request): boolean {
  if (request.headers.get("sec-fetch-mode") === "navigate") return true;
  return (request.headers.get("accept") ?? "").includes("text/html");
}

// 303 so the browser follows with a GET. A relative Location keeps it on whichever host served the form.
function seeOther(path: string): Response {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export async function POST(request: Request) {
  const navigation = isFormNavigation(request);

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error("[lead] unreadable form body", err);
    if (navigation) return seeOther(QUOTE_NOT_SENT_PATH);
    return Response.json(
      { ok: false, message: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const result = await processQuote(formData, request.headers);
  if (navigation) return seeOther(quoteResultPath(result));

  const headers: Record<string, string> = {};
  if (result.retryAfter) headers["Retry-After"] = String(result.retryAfter);
  return Response.json(toQuoteState(result), { status: result.status, headers });
}
