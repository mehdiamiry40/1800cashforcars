import { gateway, generateText, isStepCount, Output } from "ai";
import { clientIp, rateLimit } from "@/lib/autoval/rate-limit";
import { valuationRequestSchema, valuationSchema, type ValuationRequest } from "@/lib/autoval/valuation";

export const maxDuration = 120;

const MODEL = process.env.VALUATION_MODEL ?? "anthropic/claude-sonnet-5-5";

const SYSTEM = `You are an experienced Australian used-car valuer and sales advisor.
You value cars in AUD for the Australian market and advise private sellers how to get the best price.

Method:
1. Use the web search tool to find current Australian comparables for this exact make/model/generation and similar kilometres
   (carsales.com.au, drive.com.au, redbook.com.au, gumtree.com.au, facebook marketplace, autotrader.com.au, dealer sites).
   Two or three focused searches are enough.
2. Adjust for kilometres (Australian average is ~13,000–15,000 km/year), condition, service history, owners, accident history,
   options/extras and the state's market.
3. Private sale typically sits between trade-in and dealer retail. Trade-in is usually 15–30% under private sale.
4. If the vehicle details look inconsistent (e.g. a model that was never sold in that year), say so in confidenceReason and lower confidence.

Rules:
- Never invent comparables. Only put listings/guides in marketEvidence that you actually saw in search results.
- If search returns little, still give your best estimate but set confidence to "low".
- Parts to check must be specific to this model where possible (e.g. known DSG mechatronics, timing chain, CVT judder, rust spots),
  plus the generic items Australian buyers and roadworthy inspectors check (tyres, brakes, windscreen, lights, suspension, leaks).
- Paperwork must match the seller's state (e.g. NSW pink slip only needed if rego is renewed; QLD safety certificate required to
  advertise; VIC RWC required to transfer; WA/SA/TAS/NT/ACT rules differ). If state unknown, give a short general list.
- Whole-dollar AUD amounts, no cents. Round ranges to the nearest $100 (or $500 above $30k).`;

function describe(v: ValuationRequest) {
  const lines = [
    `Vehicle: ${v.year} ${v.make} ${v.model}${v.variant ? ` ${v.variant}` : ""}`,
    v.bodyType && `Body: ${v.bodyType}`,
    v.engine && `Engine: ${v.engine}`,
    v.transmission && `Transmission: ${v.transmission}`,
    v.fuelType && `Fuel: ${v.fuelType}`,
    v.drivetrain && `Drivetrain: ${v.drivetrain}`,
    v.colour && `Colour: ${v.colour}`,
    v.vin && `VIN: ${v.vin}`,
    `State: ${v.state ?? "unknown"}`,
    `Odometer: ${v.odometerKm.toLocaleString("en-AU")} km`,
    `Condition (seller's assessment): ${v.condition}`,
    `Service history: ${v.serviceHistory}`,
    v.owners && `Previous owners: ${v.owners}`,
    `Accident history: ${v.accidentHistory ? "yes" : "none reported"}`,
    v.extras && `Extras / options: ${v.extras}`,
    v.knownIssues && `Known issues: ${v.knownIssues}`,
  ];
  return lines.filter(Boolean).join("\n");
}

export async function POST(request: Request) {
  const retryAfter = rateLimit(clientIp(request));
  if (retryAfter) {
    return Response.json(
      { error: `You've run a few valuations already. Please try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const parsed = valuationRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") },
      { status: 400 },
    );
  }

  try {
    const { output } = await generateText({
      model: MODEL,
      system: SYSTEM,
      prompt: `Today's date: ${new Date().toISOString().slice(0, 10)}\n\n${describe(parsed.data)}\n\nResearch the market, then return the valuation.`,
      tools: {
        web_search: gateway.tools.perplexitySearch({ country: "AU", maxResults: 8, searchLanguageFilter: ["en"] }),
      },
      stopWhen: isStepCount(6),
      output: Output.object({ schema: valuationSchema }),
      abortSignal: request.signal,
    });
    return Response.json({ valuation: output });
  } catch (err) {
    console.error("valuation failed", err);
    const message = (err as Error).message ?? "Valuation failed";
    const auth = /api key|unauthori[sz]ed|401|authentication/i.test(message);
    return Response.json(
      {
        error: auth
          ? "AI isn't configured: set AI_GATEWAY_API_KEY in .env.local (or run `vercel env pull` on a linked project)."
          : `Valuation failed: ${message}`,
      },
      { status: auth ? 503 : 502 },
    );
  }
}
