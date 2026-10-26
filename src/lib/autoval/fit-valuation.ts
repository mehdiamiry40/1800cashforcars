import { valuationSchema, type Valuation } from "@/lib/autoval/valuation";

/**
 * The provider accepts JSON mode but does not enforce this schema, so a
 * usable valuation can still fail `Output.object`. Reshape the model's JSON
 * into the schema without inventing prices.
 */
export function fitValuation(value: unknown): { valuation: Valuation; repaired: boolean } | undefined {
  const parsed = typeof value === "string" ? parseLooseJson(value) : unwrap(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return undefined;
  const record = parsed as Record<string, unknown>;
  const strict = valuationSchema.safeParse(record);
  if (strict.success && priced(strict.data)) return { valuation: strict.data, repaired: false };

  const built = build(record);
  if (!built) return undefined;
  const fitted = valuationSchema.safeParse(built);
  if (!fitted.success || !priced(fitted.data)) return undefined;
  return { valuation: fitted.data, repaired: true };
}

export function valuationIssueSummary(value: unknown): string {
  const parsed = typeof value === "string" ? parseLooseJson(value) : value;
  const result = valuationSchema.safeParse(parsed);
  if (result.success) return "";
  return result.error.issues
    .slice(0, 8)
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(" | ");
}

function priced(valuation: Valuation): boolean {
  return valuation.privateSale.high > 0 && valuation.tradeIn.high > 0 && valuation.dealerRetail.high > 0 && valuation.recommendedListPrice > 0;
}

function build(value: Record<string, unknown>): Valuation | undefined {
  const privateSale = priceRange(value.privateSale);
  const tradeIn = priceRange(value.tradeIn);
  const dealerRetail = priceRange(value.dealerRetail);
  const recommended = wholeDollars(value.recommendedListPrice) ?? midpoint(privateSale);
  const vehicleSummary = text(value.vehicleSummary ?? value.summary);
  if (!privateSale || !tradeIn || !dealerRetail || recommended === undefined || !vehicleSummary) return undefined;
  return {
    vehicleSummary,
    privateSale,
    tradeIn,
    dealerRetail,
    recommendedListPrice: recommended,
    confidence: confidence(value.confidence),
    confidenceReason: text(value.confidenceReason),
    valueFactors: factors(value.valueFactors),
    sellingPoints: points(value.sellingPoints),
    partsToCheck: parts(value.partsToCheck),
    engine: engine(value.engine),
    knownModelIssues: texts(value.knownModelIssues),
    paperwork: texts(value.paperwork),
    listingTitle: text(value.listingTitle),
    listingDescription: text(value.listingDescription),
    marketEvidence: evidence(value.marketEvidence),
  };
}

function unwrap(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const record = value as Record<string, unknown>;
  if ("privateSale" in record || "vehicleSummary" in record) return record;
  const nested = record.valuation;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) return nested;
  return record;
}

function parseLooseJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = (fenced?.[1] ?? text).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) return undefined;
  try {
    return unwrap(JSON.parse(body.slice(start, end + 1)));
  } catch {
    return undefined;
  }
}

function priceRange(value: unknown): { low: number; high: number } | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const record = value as Record<string, unknown>;
  const low = wholeDollars(record.low);
  const high = wholeDollars(record.high);
  if (low === undefined || high === undefined) return undefined;
  return low <= high ? { low, high } : { low: high, high: low };
}

function midpoint(range: { low: number; high: number } | undefined): number | undefined {
  if (!range || range.high <= 0) return undefined;
  return Math.round((range.low + range.high) / 2);
}

function wholeDollars(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value !== "string") return undefined;
  const match = value.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/);
  if (!match) return undefined;
  const amount = Number(match[0]);
  return Number.isFinite(amount) ? Math.round(amount) : undefined;
}

function text(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((item) => text(item)).filter(Boolean).join("; ");
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => `${key}: ${text(item)}`)
      .filter((item) => !item.endsWith(": "))
      .join("; ");
  }
  return "";
}

function texts(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap((item) => texts(item));
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (typeof record.item === "string") {
      const interval = text(record.interval ?? record.value);
      return [interval ? `${record.item}: ${interval}` : record.item];
    }
    return Object.values(record).flatMap((item) => texts(item));
  }
  return [];
}

function list(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function choice<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  if (typeof value !== "string") return undefined;
  const normal = value.trim().toLowerCase();
  return allowed.find((item) => item === normal);
}

function confidence(value: unknown): Valuation["confidence"] {
  const direct = choice(value, ["high", "medium", "low"] as const);
  if (direct) return direct;
  if (typeof value === "string" && /high|strong/.test(value.toLowerCase())) return "high";
  if (typeof value === "string" && /med|moderat/.test(value.toLowerCase())) return "medium";
  return "low";
}

function impact(value: unknown): "positive" | "negative" | "neutral" {
  return choice(value, ["positive", "negative", "neutral"] as const) ?? (typeof value === "string" && /pos|up|help/.test(value.toLowerCase()) ? "positive" : typeof value === "string" && /neg|down|hurt/.test(value.toLowerCase()) ? "negative" : "neutral");
}

function priority(value: unknown): "high" | "medium" | "low" {
  return choice(value, ["high", "medium", "low"] as const) ?? "medium";
}

function flag(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normal = value.trim().toLowerCase();
    if (["true", "yes", "y"].includes(normal)) return true;
    if (["false", "no", "n"].includes(normal)) return false;
  }
  return false;
}

function factors(value: unknown): Valuation["valueFactors"] {
  return list(value).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const factor = text(record.factor ?? record.name ?? record.title);
    const detail = text(record.detail ?? record.reason ?? record.description);
    if (!factor && !detail) return [];
    return [{ factor: factor || detail, impact: impact(record.impact), detail: detail || factor }];
  });
}

function points(value: unknown): Valuation["sellingPoints"] {
  return list(value).flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [{ title: item.trim(), detail: item.trim() }];
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const title = text(record.title ?? record.name ?? record.point);
    const detail = text(record.detail ?? record.description ?? record.reason);
    if (!title && !detail) return [];
    return [{ title: title || detail, detail: detail || title }];
  });
}

function parts(value: unknown): Valuation["partsToCheck"] {
  return list(value).flatMap((item) => {
    if (typeof item === "string" && item.trim()) {
      return [{ part: item.trim(), why: item.trim(), priority: "medium" as const, estimatedCostAud: "", fixBeforeSelling: false }];
    }
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const part = text(record.part ?? record.name ?? record.component);
    const why = text(record.why ?? record.reason ?? record.detail ?? record.description);
    if (!part && !why) return [];
    return [{
      part: part || why,
      why: why || part,
      priority: priority(record.priority),
      estimatedCostAud: text(record.estimatedCostAud ?? record.cost ?? record.estimatedCost),
      fixBeforeSelling: flag(record.fixBeforeSelling),
    }];
  });
}

function specs(value: unknown): Valuation["engine"]["specs"] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string" && item.includes(":")) {
        const [label, ...rest] = item.split(":");
        return [{ label: label.trim(), value: rest.join(":").trim() }];
      }
      if (!item || typeof item !== "object") return [];
      const record = item as Record<string, unknown>;
      const label = text(record.label ?? record.name ?? record.spec);
      const spec = text(record.value ?? record.amount);
      if (!label && !spec) return [];
      return [{ label: label || "spec", value: spec || label }];
    });
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([label, item]) => {
      const spec = text(item);
      return spec ? [{ label, value: spec }] : [];
    });
  }
  return [];
}

function engine(value: unknown): Valuation["engine"] {
  const record = value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  return {
    name: text(record.name ?? record.code ?? record.engine),
    summary: text(record.summary ?? record.description),
    matchNote: text(record.matchNote ?? record.note),
    specs: specs(record.specs),
    maintenance: texts(record.maintenance),
    commonIssues: texts(record.commonIssues ?? record.issues),
    reputation: text(record.reputation),
    whereToFindCode: text(record.whereToFindCode ?? record.location),
  };
}

function evidence(value: unknown): Valuation["marketEvidence"] {
  return list(value).flatMap((item) => {
    if (typeof item === "string" && item.trim()) return [{ source: "listing", detail: item.trim() }];
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    const source = text(record.source ?? record.title ?? record.name ?? record.site ?? record.url);
    const detail = text(record.detail ?? record.snippet ?? record.summary ?? record.price ?? record.asking);
    if (!source && !detail) return [];
    return [{ source: source || "listing", detail: detail || source }];
  });
}
