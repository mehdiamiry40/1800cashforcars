import type { ValuationRequest } from "./valuation";

/**
 * A stuck Perplexity call used to hold the whole valuation, because every
 * query ran inside one model request. Each search now has its own limit.
 */
export const SEARCH_TIMEOUT_MS = 10_000;

/** Planner asks for this many live searches, then they run together. */
export const SEARCH_QUERY_COUNT = 3;

const MIN_QUERY_LENGTH = 8;
const MAX_QUERY_LENGTH = 180;

export function fallbackSearchQueries(vehicle: ValuationRequest): string[] {
  const car = [vehicle.year, vehicle.make, vehicle.model, vehicle.variant].filter(Boolean).join(" ");
  const km = `${vehicle.odometerKm.toLocaleString("en-AU")} km`;
  const place = vehicle.state ?? "Australia";
  return [
    `${car} ${km} private sale asking price ${place} carsales gumtree`,
    `${car} dealer trade-in price ${place} redbook`,
    `${car} common problems faults Australia`,
  ];
}

/** Accepts the planner's JSON object, a raw array, or a fenced JSON string. */
export function parseSearchQueries(value: unknown): string[] | undefined {
  const parsed = typeof value === "string" ? parseLooseJson(value) : value;
  const raw = unwrapQueries(parsed);
  if (!raw) return undefined;
  const queries: string[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const query = item.replace(/\s+/g, " ").trim();
    if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) continue;
    const key = query.toLocaleLowerCase("en-AU");
    if (seen.has(key)) continue;
    seen.add(key);
    queries.push(query);
    if (queries.length === SEARCH_QUERY_COUNT) break;
  }
  return queries.length >= 2 ? queries : undefined;
}

export function researchFromToolOutputs(outputs: readonly unknown[]): string | undefined {
  const chunks: string[] = [];
  for (const output of outputs) {
    if (!output || typeof output !== "object" || Array.isArray(output)) continue;
    const results = (output as { results?: unknown }).results;
    if (!Array.isArray(results) || results.length === 0) continue;
    chunks.push(JSON.stringify(results));
  }
  if (chunks.length === 0) return undefined;
  return chunks.join("\n\n").slice(0, 20_000);
}

export type ParallelSearch<T> =
  | { query: string; status: "ok"; value: T; elapsedMs: number }
  | { query: string; status: "timeout"; elapsedMs: number }
  | { query: string; status: "error"; elapsedMs: number; message: string };

/**
 * Starts every search immediately. One timeout or error does not cancel the
 * others. Cancelling the parent request cancels all of them.
 */
export async function runSearchesInParallel<T>(
  queries: readonly string[],
  run: (query: string, signal: AbortSignal) => Promise<T>,
  parent: AbortSignal,
  timeoutMs = SEARCH_TIMEOUT_MS,
): Promise<ParallelSearch<T>[]> {
  if (parent.aborted) throw parent.reason ?? new Error("Aborted");
  return Promise.all(queries.map((query) => runOne(query, run, parent, timeoutMs)));
}

async function runOne<T>(
  query: string,
  run: (query: string, signal: AbortSignal) => Promise<T>,
  parent: AbortSignal,
  timeoutMs: number,
): Promise<ParallelSearch<T>> {
  const controller = new AbortController();
  const onParent = () => controller.abort(parent.reason);
  parent.addEventListener("abort", onParent, { once: true });
  if (parent.aborted) {
    parent.removeEventListener("abort", onParent);
    throw parent.reason ?? new Error("Aborted");
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    const value = await run(query, controller.signal);
    return { query, status: "ok", value, elapsedMs: Date.now() - started };
  } catch (err) {
    const elapsedMs = Date.now() - started;
    if (parent.aborted) throw err;
    if (controller.signal.aborted) return { query, status: "timeout", elapsedMs };
    const message = err instanceof Error ? err.message : "Search failed";
    return { query, status: "error", elapsedMs, message: message.slice(0, 300) };
  } finally {
    clearTimeout(timer);
    parent.removeEventListener("abort", onParent);
  }
}

function unwrapQueries(value: unknown): unknown[] | undefined {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return undefined;
  const record = value as Record<string, unknown>;
  if (Array.isArray(record.queries)) return record.queries;
  if (Array.isArray(record.searches)) return record.searches;
  return undefined;
}

function parseLooseJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fenced?.[1] ?? text).trim();
  const objectAt = body.indexOf("{");
  const arrayAt = body.indexOf("[");
  const asArray = arrayAt >= 0 && (objectAt < 0 || arrayAt < objectAt);
  const start = asArray ? arrayAt : objectAt;
  const end = body.lastIndexOf(asArray ? "]" : "}");
  if (start < 0 || end <= start) return undefined;
  try {
    return JSON.parse(body.slice(start, end + 1));
  } catch {
    return undefined;
  }
}
