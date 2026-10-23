import { lookupRego } from "@/lib/autoval/rego";
import { decodeVin } from "@/lib/autoval/vin";
import { lookupErrorBody } from "@/lib/autoval/errors";
import { autovalRateLimitResponse } from "@/lib/autoval/limit";

export async function POST(request: Request) {
  const limited = autovalRateLimitResponse("lookup", request.headers);
  if (limited) return limited;

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
    const mapped = lookupErrorBody(err);
    return Response.json({ error: mapped.error }, { status: mapped.status });
  }
}
