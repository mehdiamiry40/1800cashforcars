import { toQuoteState, processQuote } from "@/lib/quote";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err) {
    console.error("[lead] unreadable form body", err);
    return Response.json(
      { ok: false, message: "Please check the form and try again." },
      { status: 400 },
    );
  }

  const result = await processQuote(formData, request.headers);
  const headers: Record<string, string> = {};
  if (result.retryAfter) headers["Retry-After"] = String(result.retryAfter);
  return Response.json(toQuoteState(result), { status: result.status, headers });
}
