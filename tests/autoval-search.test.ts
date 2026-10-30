import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  fallbackSearchQueries,
  parseSearchQueries,
  researchFromToolOutputs,
  runSearchesInParallel,
  SEARCH_TIMEOUT_MS,
} from "@/lib/autoval/market-search";
import type { ValuationRequest } from "@/lib/autoval/valuation";

const corolla: ValuationRequest = {
  make: "Toyota",
  model: "Corolla",
  year: 2012,
  variant: "Ascent",
  state: "QLD",
  odometerKm: 175000,
  condition: "good",
  serviceHistory: "partial",
  accidentHistory: false,
};

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("The operation was aborted", "AbortError"));
    };
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
  });
}

describe("AutoVal market search", () => {
  it("keeps a per-search timeout short enough that one call cannot use the whole budget", () => {
    assert.equal(SEARCH_TIMEOUT_MS, 10_000);
    assert.ok(SEARCH_TIMEOUT_MS < 20_000);
  });

  it("reads three queries from planner JSON, including fenced text", () => {
    assert.deepEqual(
      parseSearchQueries({
        queries: [
          "2012 Toyota Corolla private sale price carsales",
          "2012 Toyota Corolla trade-in redbook",
          "2012 Toyota Corolla common problems",
          "extra query that is not used",
        ],
      }),
      [
        "2012 Toyota Corolla private sale price carsales",
        "2012 Toyota Corolla trade-in redbook",
        "2012 Toyota Corolla common problems",
      ],
    );
    const fenced = parseSearchQueries(
      '```json\n{"queries":["2012 Corolla private sale Australia","2012 Corolla dealer price Australia"]}\n```',
    );
    assert.equal(fenced?.length, 2);
  });

  it("rejects a plan that is not two real queries", () => {
    assert.equal(parseSearchQueries({ queries: ["short", "bad"] }), undefined);
    assert.equal(parseSearchQueries({ queries: ["2012 Toyota Corolla private sale price"] }), undefined);
    assert.equal(parseSearchQueries("not json"), undefined);
  });

  it("builds live-search queries from the vehicle when the planner does not", () => {
    const queries = fallbackSearchQueries(corolla);
    assert.equal(queries.length, 3);
    for (const query of queries) {
      assert.match(query, /2012 Toyota Corolla Ascent/);
    }
    assert.match(queries[0], /175,000 km/);
    assert.match(queries[0], /QLD/);
    assert.match(queries[2], /common problems/);
  });

  it("keeps only tool outputs that contain listings", () => {
    const research = researchFromToolOutputs([
      { error: "timeout", message: "slow" },
      { results: [] },
      { results: [{ title: "Corolla", url: "https://www.carsales.com.au/car", snippet: "$8,900" }] },
      null,
    ]);
    assert.equal(research, JSON.stringify([{ title: "Corolla", url: "https://www.carsales.com.au/car", snippet: "$8,900" }]));
    assert.equal(researchFromToolOutputs([{ error: "api_error", message: "down" }]), undefined);
  });

  it("runs the searches together and gives up on one that exceeds its timeout", async () => {
    const started: number[] = [];
    const origin = Date.now();
    const attempts = await runSearchesInParallel(
      ["prices", "faults", "trade"],
      async (query, signal) => {
        started.push(Date.now() - origin);
        await wait(query === "faults" ? 250 : 30, signal);
        return query;
      },
      new AbortController().signal,
      80,
    );
    assert.ok(Math.max(...started) - Math.min(...started) < 50);
    assert.deepEqual(
      attempts.filter((attempt) => attempt.status === "ok").map((attempt) => attempt.value),
      ["prices", "trade"],
    );
    const faults = attempts.find((attempt) => attempt.query === "faults");
    assert.equal(faults?.status, "timeout");
    assert.ok(faults && faults.elapsedMs < 200);
  });

  it("keeps the searches that returned when one throws", async () => {
    const attempts = await runSearchesInParallel(
      ["prices", "faults"],
      async (query) => {
        if (query === "faults") throw new Error("perplexity down");
        return query;
      },
      new AbortController().signal,
      1_000,
    );
    assert.equal(attempts[0]?.status, "ok");
    assert.equal(attempts[1]?.status, "error");
    if (attempts[1]?.status === "error") assert.match(attempts[1].message, /perplexity down/);
  });

  it("cancels every search when the valuation request is aborted", async () => {
    const parent = new AbortController();
    const pending = runSearchesInParallel(
      ["prices", "faults"],
      (query, signal) => wait(5_000, signal).then(() => query),
      parent.signal,
      20_000,
    );
    parent.abort();
    await assert.rejects(pending);
  });
});
