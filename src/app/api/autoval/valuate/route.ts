import { gateway, generateText, isStepCount, NoObjectGeneratedError, Output } from "ai";
import { fitValuation, valuationIssueSummary } from "@/lib/autoval/fit-valuation";
import {
  fallbackSearchQueries,
  parseSearchQueries,
  researchFromToolOutputs,
  runSearchesInParallel,
  SEARCH_TIMEOUT_MS,
} from "@/lib/autoval/market-search";
import { autovalAttempts, autovalDeepseekOptions, autovalModel } from "@/lib/autoval/model";
import { AUTOVAL_DETAILS_INVALID, AUTOVAL_VALUATION_FAILED } from "@/lib/autoval/messages";
import { autovalRateLimitResponse } from "@/lib/autoval/limit";
import { valuationRequestSchema, valuationSchema, type ValuationRequest } from "@/lib/autoval/valuation";

export const maxDuration = 120;

const MODEL = autovalModel();
const VALUATION_JSON_SCHEMA = JSON.stringify(valuationSchema.toJSONSchema());

const QUERY_SYSTEM = `You write web search queries for the Australian used-car market.
Return one JSON object and nothing else: {"queries":["...","...","..."]}
Exactly three short queries for this exact make, model, year and kilometres:
private-sale asking prices, dealer or trade-in prices, and known faults.
Name carsales.com.au, gumtree.com.au, redbook.com.au, drive.com.au or a dealer site in a query when that is the right source.
Do not invent prices and do not write a valuation.`;

const SEARCH_SYSTEM = `Call the web_search tool once.
Set the query argument to the user text, unchanged.
Do not write a valuation and do not invent prices.`;

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

const SEARCH_PLAN_TIMEOUT_MS = 8_000;

function webSearchTool() {
  return gateway.tools.perplexitySearch({ country: "AU", maxResults: 8, searchLanguageFilter: ["en"] });
}

async function planQueries(model: string, vehicle: ValuationRequest, signal: AbortSignal) {
  const planSignal = AbortSignal.any([signal, AbortSignal.timeout(SEARCH_PLAN_TIMEOUT_MS)]);
  try {
    const planned = await generateText({
      model,
      system: QUERY_SYSTEM,
      prompt: `Today's date: ${new Date().toISOString().slice(0, 10)}\n\n${describe(vehicle)}\n\nReturn the three search queries.`,
      output: Output.json(),
      abortSignal: planSignal,
      maxRetries: 0,
      ...autovalDeepseekOptions(model, "search"),
    });
    const queries = parseSearchQueries(planned.output);
    if (queries) return { queries, planned: true };
    console.error("[autoval] search queries unusable", model);
  } catch (err) {
    if (signal.aborted) throw err;
    const recovered = NoObjectGeneratedError.isInstance(err) ? parseSearchQueries(err.text) : undefined;
    if (recovered) return { queries: recovered, planned: true };
    console.error("[autoval] search query plan failed", model, planSignal.aborted ? "timed out" : err);
  }
  return { queries: fallbackSearchQueries(vehicle), planned: false };
}

function searchOne(model: string, query: string, signal: AbortSignal) {
  return generateText({
    model,
    system: SEARCH_SYSTEM,
    prompt: query,
    tools: { web_search: webSearchTool() },
    toolChoice: { type: "tool", toolName: "web_search" },
    stopWhen: isStepCount(1),
    abortSignal: signal,
    maxRetries: 0,
    // The query is already written. Skip search reasoning so the tool call
    // is only the time Perplexity needs.
    ...autovalDeepseekOptions(model, "output"),
  }).then((result) => ({
    outputs: result.toolResults.map((call) => call.output),
    toolCalls: result.toolCalls.length,
    served: served(result),
  }));
}

async function researchMarket(model: string, vehicle: ValuationRequest, signal: AbortSignal) {
  const planStarted = Date.now();
  const { queries, planned } = await planQueries(model, vehicle, signal);
  const planMs = Date.now() - planStarted;
  const searchStarted = Date.now();
  const attempts = await runSearchesInParallel(queries, (query, searchSignal) => searchOne(model, query, searchSignal), signal);
  const outputs = attempts.flatMap((attempt) => (attempt.status === "ok" ? attempt.value.outputs : []));
  const toolCalls = attempts.reduce((sum, attempt) => sum + (attempt.status === "ok" ? attempt.value.toolCalls : 0), 0);
  const finished = attempts.find((attempt) => attempt.status === "ok");
  const research = researchFromToolOutputs(outputs);
  return {
    research,
    toolCalls,
    search: {
      planned,
      planMs,
      searchMs: Date.now() - searchStarted,
      timeoutMs: SEARCH_TIMEOUT_MS,
      queries,
      toolCalls,
      attempts: attempts.map((attempt) => ({
        query: attempt.query,
        status: attempt.status,
        elapsedMs: attempt.elapsedMs,
        toolCalls: attempt.status === "ok" ? attempt.value.toolCalls : 0,
        ...(attempt.status === "error" ? { message: attempt.message } : {}),
      })),
      served: finished?.status === "ok" ? finished.value.served : undefined,
    },
  };
}

function writeValuation(model: string, vehicle: ValuationRequest, research: string, signal: AbortSignal) {
  return generateText({
    model,
    system: VALUATION_SYSTEM,
    prompt: `Today's date: ${new Date().toISOString().slice(0, 10)}\n\n${describe(vehicle)}\n\nMarket research from web search:\n${research}\n\nJSON schema:\n${VALUATION_JSON_SCHEMA}`,
    // JSON mode without a response schema. This provider does not apply a
    // schema unless structuredOutputs is enabled, and Output.object then
    // rejects a usable object. The schema is in the prompt and checked here.
    output: Output.json(),
    abortSignal: signal,
    ...autovalDeepseekOptions(model, "output"),
  });
}

async function readValuation(model: string, vehicle: ValuationRequest, research: string, signal: AbortSignal) {
  try {
    const written = await writeValuation(model, vehicle, research, signal);
    const fitted = fitValuation(written.output);
    if (!fitted) {
      console.error("[autoval] schema", model, valuationIssueSummary(written.output));
      throw new Error("AutoVal JSON did not match the schema");
    }
    return { ...fitted, served: served(written) };
  } catch (err) {
    if (!NoObjectGeneratedError.isInstance(err) || !err.text) throw err;
    const fitted = fitValuation(err.text);
    if (!fitted) {
      console.error("[autoval] schema", model, valuationIssueSummary(err.text));
      throw err;
    }
    return {
      ...fitted,
      served: {
        responseModelId: err.response?.modelId,
        finishReason: err.finishReason,
        steps: 1,
        toolCalls: 0,
      },
    };
  }
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
      const found = await researchMarket(model, parsed.data, request.signal);
      if (!found.research || found.toolCalls === 0) {
        console.error("[autoval] web search returned no results", JSON.stringify({ model, search: found.search }));
        throw new Error("AutoVal web search returned no results");
      }
      const written = await readValuation(model, parsed.data, found.research, request.signal);
      console.info(
        "[autoval] valued with",
        JSON.stringify({ model, search: found.search, valuation: written.served, repaired: written.repaired }),
      );
      return Response.json({ valuation: written.valuation });
    } catch (err) {
      lastError = err;
      console.error("[autoval] valuation failed on", model, err);
    }
  }

  console.error("[autoval] valuation fallback failed", lastError);
  return Response.json({ error: AUTOVAL_VALUATION_FAILED }, { status: 502 });
}
