import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fitValuation } from "@/lib/autoval/fit-valuation";

const valid = {
  vehicleSummary: "2018 Toyota Corolla Ascent Sport hatch",
  privateSale: { low: 17500, high: 20500 },
  tradeIn: { low: 13000, high: 15500 },
  dealerRetail: { low: 20000, high: 23500 },
  recommendedListPrice: 19900,
  confidence: "medium",
  confidenceReason: "Engine year is uncertain.",
  valueFactors: [{ factor: "Kilometres", impact: "positive", detail: "Below average." }],
  sellingPoints: [{ title: "Service history", detail: "Full logbook." }],
  partsToCheck: [{ part: "CVT", why: "Judder", priority: "high", estimatedCostAud: "$800–$2,000", fixBeforeSelling: false }],
  engine: {
    name: "2ZR-FE",
    summary: "1.8L petrol",
    matchNote: "Could be the 2.0L.",
    specs: [{ label: "Power", value: "103 kW" }],
    maintenance: ["Oil every 10,000 km"],
    commonIssues: [],
    reputation: "Strong.",
    whereToFindCode: "On the block.",
  },
  knownModelIssues: ["CVT fluid"],
  paperwork: ["QLD safety certificate"],
  listingTitle: "2018 Toyota Corolla Ascent Sport",
  listingDescription: "One owner, full service history.",
  marketEvidence: [{ source: "carsales", detail: "2018 Ascent Sport asking $21,900" }],
};

describe("fitValuation", () => {
  it("keeps a schema-valid valuation", () => {
    const fitted = fitValuation(valid);
    assert.equal(fitted?.repaired, false);
    assert.equal(fitted?.valuation.recommendedListPrice, 19900);
    assert.equal(fitted?.valuation.marketEvidence[0]?.source, "carsales");
  });

  it("repairs the shapes DeepSeek returns instead of the schema", () => {
    const fitted = fitValuation({
      ...valid,
      confidence: "Medium",
      confidenceReason: null,
      privateSale: { low: "$17,500", high: "20500" },
      valueFactors: [{ factor: "Kilometres", impact: "Positive", detail: "Below average." }],
      partsToCheck: [{ part: "CVT", why: "Judder", priority: "High", estimatedCostAud: 800, fixBeforeSelling: "no" }],
      engine: {
        ...valid.engine,
        matchNote: null,
        specs: { power: "103 kW", torque: "173 Nm" },
        maintenance: [{ item: "Oil", interval: "10,000 km" }],
      },
      paperwork: null,
      marketEvidence: ["carsales asking $21,900", { title: "Drive", url: "https://drive.com.au/x", price: "$22,000" }],
    });
    assert.equal(fitted?.repaired, true);
    assert.equal(fitted?.valuation.confidence, "medium");
    assert.equal(fitted?.valuation.privateSale.low, 17500);
    assert.equal(fitted?.valuation.partsToCheck[0]?.estimatedCostAud, "800");
    assert.equal(fitted?.valuation.partsToCheck[0]?.fixBeforeSelling, false);
    assert.deepEqual(fitted?.valuation.engine.specs, [
      { label: "power", value: "103 kW" },
      { label: "torque", value: "173 Nm" },
    ]);
    assert.deepEqual(fitted?.valuation.engine.maintenance, ["Oil: 10,000 km"]);
    assert.equal(fitted?.valuation.marketEvidence[0]?.detail, "carsales asking $21,900");
    assert.equal(fitted?.valuation.marketEvidence[1]?.source, "Drive");
    assert.match(fitted?.valuation.marketEvidence[1]?.detail ?? "", /22,000/);
  });

  it("rejects a printed tool call and a zero-price object", () => {
    assert.equal(
      fitValuation({ query: "2018 Toyota Corolla price", country: "AU", max_results: 10 }),
      undefined,
    );
    assert.equal(fitValuation({ ...valid, privateSale: { low: 0, high: 0 }, recommendedListPrice: 0 }), undefined);
  });
});
