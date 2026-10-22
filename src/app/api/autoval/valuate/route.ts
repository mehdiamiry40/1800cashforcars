import { gateway, generateText, isStepCount, Output } from "ai";
import { AUTOVAL_DETAILS_INVALID, AUTOVAL_VALUATION_FAILED } from "@/lib/autoval/messages";
import { autovalRateLimitResponse } from "@/lib/autoval/limit";
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
- Engine: identify the exact engine (family and code) fitted to this make/model/year/variant. Use the seller's engine field or
  VIN if given. If the model was sold with several engines and the details don't settle it, name the most likely one and say so
  in matchNote. Specs and service intervals must be the manufacturer's figures for the Australian-market engine; never guess a
  figure you can't stand behind: leave that spec out, or say "check the logbook" for a service interval. Engine faults go in engine.commonIssues, not knownModelIssues.
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
  const limited = autovalRateLimitResponse("valuate", request.headers);
  if (limited) return limited;

  const parsed = valuationRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    console.error("[autoval] invalid valuation request", parsed.error.issues);
    return Response.json({ error: AUTOVAL_DETAILS_INVALID }, { status: 400 });
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
    console.error("[autoval] valuation failed", err);
    return Response.json({ error: AUTOVAL_VALUATION_FAILED }, { status: 502 });
  }
}
