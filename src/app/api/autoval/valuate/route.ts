import { gateway, generateText, isStepCount, Output } from "ai";
import { autovalAttempts, autovalDeepseekOptions, autovalModel } from "@/lib/autoval/model";
import { AUTOVAL_DETAILS_INVALID, AUTOVAL_VALUATION_FAILED } from "@/lib/autoval/messages";
import { autovalRateLimitResponse } from "@/lib/autoval/limit";
import { valuationRequestSchema, valuationSchema, type ValuationRequest } from "@/lib/autoval/valuation";

export const maxDuration = 120;

const MODEL = autovalModel();
const VALUATION_JSON_SCHEMA = JSON.stringify(valuationSchema.toJSONSchema());

const SEARCH_SYSTEM = `You research the Australian used-car market.
Use the web_search tool. Two or three focused searches are enough for this exact make, model, year and kilometres:
private-sale asking prices, dealer or trade prices, and known faults.
Prefer carsales.com.au, drive.com.au, redbook.com.au, gumtree.com.au and dealer sites.
Do not write the valuation and do not invent prices.`;

const VALUATION_SYSTEM = `You are an experienced Australian used-car valuer and sales advisor.
You value cars in AUD for the Australian market and advise private sellers how to get the best price.
The market research is already in the user message. Do not call tools. Return one JSON object and nothing else.

Method:
1. Use only the attached search results for comparables. Do not browse again.
2. Adjust for kilometres (Australian average is ~13,000–15,000 km/year), condition, service history, owners, accident history,
   options/extras and the state's market.
3. Private sale typically sits between trade-in and dealer retail. Trade-in is usually 15–30% under private sale.
4. If the vehicle details look inconsistent (e.g. a model that was never sold in that year), say so in confidenceReason and lower confidence.

Rules:
- Never invent comparables. Only put listings/guides in marketEvidence that appear in the attached research.
- If search returns little, still give your best estimate but set confidence to "low".
- Parts to check must be specific to this model where possible (e.g. known DSG mechatronics, timing chain, CVT judder, rust spots),
  plus the generic items Australian buyers and roadworthy inspectors check (tyres, brakes, windscreen, lights, suspension, leaks).
- Engine: identify the exact engine (family and code) fitted to this make/model/year/variant. Use the seller's engine field or
  VIN if given. If the model was sold with several engines and the details don't settle it, name the most likely one and say so
  in matchNote. Specs and service intervals must be the manufacturer's figures for the Australian-market engine; never guess a
  figure you can't stand behind: leave that spec out, or say "check the logbook" for a service interval. Engine faults go in engine.commonIssues, not knownModelIssues.
- Paperwork must match the seller's state (e.g. NSW pink slip only needed if rego is renewed; QLD safety certificate required to
  advertise; VIC RWC required to transfer; WA/SA/TAS/NT/ACT rules differ). If state unknown, give a short general list.
- Whole-dollar AUD amounts, no cents. Round ranges to the nearest $100 (or $500 above $30k).
- Include every field in the schema. Use an empty array or an empty string when you have nothing to say.`;

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

function record(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

function served(result: {
  response: { modelId: string };
  providerMetadata?: { gateway?: unknown };
  finishReason: string;
  steps: readonly unknown[];
  toolCalls: readonly unknown[];
}) {
  const routing = record(record(result.providerMetadata?.gateway)?.routing);
  const sort = record(routing?.sort);
  return {
    responseModelId: result.response.modelId,
    provider: typeof routing?.finalProvider === "string" ? routing.finalProvider : undefined,
    canonicalSlug: typeof routing?.canonicalSlug === "string" ? routing.canonicalSlug : undefined,
    speed: typeof routing?.speed === "string" ? routing.speed : undefined,
    sort: typeof sort?.option === "string" ? sort.option : undefined,
    executionOrder: Array.isArray(sort?.executionOrder) ? sort.executionOrder : undefined,
    finishReason: result.finishReason,
    steps: result.steps.length,
    toolCalls: result.toolCalls.length,
  };
}

function researchNotes(toolResults: readonly { output: unknown }[]): string | undefined {
  const chunks: string[] = [];
  for (const call of toolResults) {
    const output = record(call.output);
    const results = output?.results;
    if (!Array.isArray(results) || results.length === 0) continue;
    chunks.push(JSON.stringify(results));
  }
  if (chunks.length === 0) return undefined;
  return chunks.join("\n\n").slice(0, 20_000);
}

function searchMarket(model: string, vehicle: ValuationRequest, signal: AbortSignal) {
  return generateText({
    model,
    system: SEARCH_SYSTEM,
    prompt: `Today's date: ${new Date().toISOString().slice(0, 10)}\n\n${describe(vehicle)}\n\nSearch the Australian market now.`,
    tools: {
      web_search: gateway.tools.perplexitySearch({ country: "AU", maxResults: 8, searchLanguageFilter: ["en"] }),
    },
    prepareStep: ({ stepNumber }) => (stepNumber === 0 ? { toolChoice: "required" } : { toolChoice: "auto" }),
    stopWhen: isStepCount(4),
    abortSignal: signal,
    ...autovalDeepseekOptions(model, "search"),
  });
}

function writeValuation(model: string, vehicle: ValuationRequest, research: string, signal: AbortSignal) {
  return generateText({
    model,
    system: VALUATION_SYSTEM,
    prompt: `Today's date: ${new Date().toISOString().slice(0, 10)}\n\n${describe(vehicle)}\n\nMarket research from web search:\n${research}\n\nJSON schema:\n${VALUATION_JSON_SCHEMA}`,
    output: Output.object({ name: "valuation", schema: valuationSchema }),
    abortSignal: signal,
    ...autovalDeepseekOptions(model, "output"),
  });
}

export async function POST(request: Request) {
  const limited = autovalRateLimitResponse("valuate", request.headers);
  if (limited) return limited;

  const parsed = valuationRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    console.error("[autoval] invalid valuation request", parsed.error.issues);
    return Response.json({ error: AUTOVAL_DETAILS_INVALID }, { status: 400 });
  }

  const attempts = autovalAttempts(MODEL);
  let lastError: unknown;
  for (const model of attempts) {
    if (request.signal.aborted) break;
    try {
      const search = await searchMarket(model, parsed.data, request.signal);
      const research = researchNotes(search.toolResults);
      if (!research) {
        console.error(
          "[autoval] web search returned no results",
          JSON.stringify({ model, search: served(search), text: search.text.slice(0, 500) }),
        );
        throw new Error("AutoVal web search returned no results");
      }
      const valuation = await writeValuation(model, parsed.data, research, request.signal);
      console.info(
        "[autoval] valued with",
        JSON.stringify({ model, search: served(search), valuation: served(valuation) }),
      );
      return Response.json({ valuation: valuation.output });
    } catch (err) {
      lastError = err;
      console.error("[autoval] valuation failed on", model, err);
    }
  }

  console.error("[autoval] valuation fallback failed", lastError);
  return Response.json({ error: AUTOVAL_VALUATION_FAILED }, { status: 502 });
}
