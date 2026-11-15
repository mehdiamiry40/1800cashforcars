import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { VEHICLE_TEXT_MAX } from "@/lib/autoval/types";
import { valuationRequestSchema } from "@/lib/autoval/valuation";

const car = { make: "Toyota", model: "Corolla", year: 2018, odometerKm: 85000, condition: "good" };

describe("AutoVal valuation request", () => {
  it("cuts over-long vehicle text instead of sending it all to the model", () => {
    const parsed = valuationRequestSchema.parse({
      ...car,
      variant: "x".repeat(5000),
      engine: "y".repeat(5000),
      vin: "V".repeat(200),
      rego: "R".repeat(200),
    });
    assert.equal(parsed.variant?.length, VEHICLE_TEXT_MAX);
    assert.equal(parsed.engine?.length, VEHICLE_TEXT_MAX);
    assert.equal(parsed.vin?.length, 20);
    assert.equal(parsed.rego?.length, 12);
  });

  it("leaves normal details as they were typed", () => {
    const parsed = valuationRequestSchema.parse({ ...car, variant: "Ascent Sport", colour: "White" });
    assert.equal(parsed.make, "Toyota");
    assert.equal(parsed.variant, "Ascent Sport");
    assert.equal(parsed.colour, "White");
    assert.equal(parsed.vin, undefined);
  });

  it("still refuses a blank make or model, and free text over its limit", () => {
    assert.equal(valuationRequestSchema.safeParse({ ...car, make: "   " }).success, false);
    assert.equal(valuationRequestSchema.safeParse({ ...car, model: "" }).success, false);
    assert.equal(valuationRequestSchema.safeParse({ ...car, knownIssues: "z".repeat(1001) }).success, false);
  });
});
