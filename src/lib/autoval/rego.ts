import { AU_STATES, type AuState, type LookupResult, type VehicleDetails } from "./types";
import { stripUndefined } from "./vin";

export class RegoLookupUnavailableError extends Error {}

export function normaliseRego(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function isAuState(s: string): s is AuState {
  return (AU_STATES as readonly string[]).includes(s);
}

/** Pulls a text value out of the provider's `{ CurrentTextValue }` wrappers or plain strings. */
function text(v: unknown): string | undefined {
  if (typeof v === "string") return v.trim() || undefined;
  if (typeof v === "number") return String(v);
  if (v && typeof v === "object" && "CurrentTextValue" in v) return text((v as { CurrentTextValue: unknown }).CurrentTextValue);
  return undefined;
}

/**
 * Australian rego → vehicle via CarRegistrationAPI.com.au (paid, per-lookup credits).
 * There is no free national rego API in Australia, so this is opt-in through REGO_API_USERNAME.
 */
export async function lookupRego(rawRego: string, state: string): Promise<LookupResult> {
  const rego = normaliseRego(rawRego);
  if (rego.length < 2 || rego.length > 9) throw new Error("Enter a valid Australian number plate.");
  if (!isAuState(state)) throw new Error("Choose the state the car is registered in.");

  const username = process.env.REGO_API_USERNAME;
  if (!username) {
    throw new RegoLookupUnavailableError(
      "Rego lookup isn't configured on this server (set REGO_API_USERNAME). Use the VIN or enter the car details instead.",
    );
  }

  const url = new URL("https://www.carregistrationapi.com.au/api/reg.asmx/CheckAustralia");
  url.searchParams.set("RegistrationNumber", rego);
  url.searchParams.set("State", state);
  url.searchParams.set("username", username);

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(
      res.status === 500 && /not found|no result/i.test(body)
        ? `No vehicle found for ${rego} in ${state}.`
        : `Rego service error (${res.status}).`,
    );
  }

  const match = body.match(/<vehicleJson>([\s\S]*?)<\/vehicleJson>/);
  if (!match) throw new Error(`No vehicle found for ${rego} in ${state}.`);
  const json = JSON.parse(decodeXmlEntities(match[1])) as Record<string, unknown>;

  const vehicle: VehicleDetails = stripUndefined({
    rego,
    state,
    make: text(json.MakeDescription) ?? text(json.CarMake),
    model: text(json.ModelDescription) ?? text(json.CarModel),
    variant: text(json.Variant) ?? text(json.Series),
    year: Number(text(json.RegistrationYear) ?? text(json.ManufactureYearFrom)) || undefined,
    bodyType: text(json.BodyStyle),
    transmission: text(json.Transmission),
    fuelType: text(json.Fuel) ?? text(json.FuelType),
    engine: text(json.EngineSize),
    colour: text(json.Colour),
    vin: text(json.VechileIdentificationNumber) ?? text(json.VehicleIdentificationNumber),
  });

  const notes: string[] = [];
  const description = text(json.Description);
  if (description) notes.push(`Registry description: ${description}`);
  const expiry = text(json.Expiry) ?? text(json.RegistrationExpiry);
  if (expiry) notes.push(`Registration expiry: ${expiry}`);

  return { source: "rego", provider: "CarRegistrationAPI.com.au", vehicle, notes };
}

function decodeXmlEntities(s: string) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}
