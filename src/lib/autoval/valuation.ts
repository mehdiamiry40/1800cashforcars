import { z } from "zod";
import { AU_STATES } from "./types";

export const valuationRequestSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  variant: z.string().optional(),
  bodyType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  engine: z.string().optional(),
  drivetrain: z.string().optional(),
  colour: z.string().optional(),
  vin: z.string().optional(),
  rego: z.string().optional(),
  state: z.enum(AU_STATES).optional(),
  odometerKm: z.coerce.number().int().min(0).max(2_000_000),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  serviceHistory: z.enum(["full", "partial", "none", "unknown"]).default("unknown"),
  owners: z.coerce.number().int().min(1).max(20).optional(),
  accidentHistory: z.boolean().default(false),
  extras: z.string().max(1000).optional(),
  knownIssues: z.string().max(1000).optional(),
});
export type ValuationRequest = z.infer<typeof valuationRequestSchema>;

const priceRange = z.object({
  low: z.number().describe("Low end in AUD, whole dollars"),
  high: z.number().describe("High end in AUD, whole dollars"),
});

export const valuationSchema = z.object({
  vehicleSummary: z.string().describe("One line, e.g. '2018 Toyota Corolla Ascent Sport hatch, 1.8L auto'"),
  privateSale: priceRange.describe("Realistic private-sale price range in AUD"),
  tradeIn: priceRange.describe("Likely dealer trade-in offer range in AUD"),
  dealerRetail: priceRange.describe("Typical dealer retail asking price range in AUD"),
  recommendedListPrice: z.number().describe("Suggested private-sale asking price in AUD (leaves room to negotiate)"),
  confidence: z.enum(["high", "medium", "low"]),
  confidenceReason: z.string(),
  valueFactors: z
    .array(
      z.object({
        factor: z.string(),
        impact: z.enum(["positive", "negative", "neutral"]),
        detail: z.string(),
      }),
    )
    .describe("What pushes this car's value up or down versus the average example"),
  sellingPoints: z
    .array(z.object({ title: z.string(), detail: z.string() }))
    .describe("Features/parts buyers of this model value most — what to highlight in the ad and photos"),
  partsToCheck: z
    .array(
      z.object({
        part: z.string(),
        why: z.string().describe("Why buyers/inspectors look at it on this model"),
        priority: z.enum(["high", "medium", "low"]),
        estimatedCostAud: z.string().describe("Typical repair/replace cost range, e.g. '$300–$600'"),
        fixBeforeSelling: z.boolean().describe("True if fixing likely returns more than it costs"),
      }),
    )
    .describe("Important parts to inspect or fix before selling, including model-specific known issues"),
  knownModelIssues: z.array(z.string()).describe("Common faults/recalls for this make/model/generation"),
  paperwork: z
    .array(z.string())
    .describe("Documents needed to sell in the given Australian state (roadworthy/safety cert, transfer form, PPSR, etc.)"),
  listingTitle: z.string(),
  listingDescription: z.string().describe("Ready-to-paste ad text, 80–150 words, honest, no made-up features"),
  marketEvidence: z
    .array(z.object({ source: z.string(), detail: z.string() }))
    .describe("Comparable listings or price guides found while researching; empty if none"),
});
export type Valuation = z.infer<typeof valuationSchema>;
