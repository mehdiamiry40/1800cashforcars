import { lookupRego, RegoLookupUnavailableError } from "@/lib/autoval/rego";
import { decodeVin } from "@/lib/autoval/vin";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    type?: "vin" | "rego";
    vin?: string;
    rego?: string;
    state?: string;
  };

  try {
    if (body.type === "vin" && body.vin) {
      return Response.json(await decodeVin(body.vin));
    }
    if (body.type === "rego" && body.rego) {
      return Response.json(await lookupRego(body.rego, body.state ?? ""));
    }
    return Response.json({ error: "Provide a VIN or a rego + state." }, { status: 400 });
  } catch (err) {
    const status = err instanceof RegoLookupUnavailableError ? 501 : 422;
    return Response.json({ error: (err as Error).message }, { status });
  }
}
