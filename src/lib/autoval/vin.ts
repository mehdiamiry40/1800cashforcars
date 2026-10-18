import type { LookupResult, VehicleDetails } from "./types";

const VIN_RE = /^[A-HJ-NPR-Z0-9]{17}$/;

// 10th character → model year (30-year cycle; we pick the most recent year not in the future).
const YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";

export function normaliseVin(raw: string) {
  return raw.toUpperCase().replace(/[\s-]/g, "");
}

export function isValidVin(vin: string) {
  return VIN_RE.test(vin);
}

function yearFromVin(vin: string): number | undefined {
  const idx = YEAR_CODES.indexOf(vin[9]);
  if (idx < 0) return undefined;
  const thisYear = new Date().getFullYear() + 1;
  let year = 1980 + idx;
  while (year + 30 <= thisYear) year += 30;
  return year;
}

interface VpicResult {
  Make?: string;
  Model?: string;
  Trim?: string;
  Series?: string;
  ModelYear?: string;
  BodyClass?: string;
  TransmissionStyle?: string;
  FuelTypePrimary?: string;
  DisplacementL?: string;
  EngineCylinders?: string;
  DriveType?: string;
  ErrorCode?: string;
  ErrorText?: string;
}

const clean = (v?: string) => (v && v.trim() && v !== "Not Applicable" ? v.trim() : undefined);
// vPIC uses US terms; map to what Australian sellers/buyers use.
const FUEL_AU: Record<string, string> = { Gasoline: "Petrol", "Flexible Fuel Vehicle (FFV)": "Petrol" };
const auFuel = (f?: string) => (f && FUEL_AU[f]) || f;
function auTransmission(t?: string) {
  if (!t) return undefined;
  if (/CVT|Continuously/i.test(t)) return "CVT";
  if (/Dual-Clutch|DCT/i.test(t)) return "Dual-clutch";
  if (/Manual/i.test(t)) return "Manual";
  if (/Automatic/i.test(t)) return "Automatic";
  return t;
}
const titleCase = (s?: string) =>
  s?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Decodes a 17-character VIN with the free NHTSA vPIC service.
 * vPIC is US-centric, so Australian-delivered vehicles usually decode make + year
 * but may miss model/variant — the user can fill those in afterwards.
 */
export async function decodeVin(rawVin: string): Promise<LookupResult> {
  const vin = normaliseVin(rawVin);
  if (!isValidVin(vin)) {
    throw new Error(
      "A VIN is 17 characters (letters and numbers, no I, O or Q). Older Japanese imports use a shorter chassis number — enter details manually instead.",
    );
  }

  const notes: string[] = [];
  const vehicle: VehicleDetails = { vin, year: yearFromVin(vin) };

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!res.ok) throw new Error(`vPIC returned ${res.status}`);
    const data = (await res.json()) as { Results?: VpicResult[] };
    const r = data.Results?.[0];
    if (r) {
      const displacement = clean(r.DisplacementL);
      const cylinders = clean(r.EngineCylinders);
      Object.assign(vehicle, {
        make: titleCase(clean(r.Make)),
        model: clean(r.Model),
        variant: clean(r.Trim) ?? clean(r.Series),
        year: Number(clean(r.ModelYear)) || vehicle.year,
        bodyType: clean(r.BodyClass),
        transmission: auTransmission(clean(r.TransmissionStyle)),
        fuelType: auFuel(clean(r.FuelTypePrimary)),
        engine: displacement
          ? `${Number(displacement).toFixed(1)}L${cylinders ? ` ${cylinders}-cyl` : ""}`
          : undefined,
        drivetrain: clean(r.DriveType),
      } satisfies VehicleDetails);
    }
  } catch (err) {
    notes.push(`VIN database unavailable (${(err as Error).message}); only the model year was decoded.`);
  }

  if (!vehicle.model) {
    notes.push("Model wasn't found in the VIN database (common for Australian-delivered cars). Please confirm the model and variant.");
  }

  return { source: "vin", provider: "NHTSA vPIC", vehicle: stripUndefined(vehicle), notes };
}

export function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== "")) as T;
}
