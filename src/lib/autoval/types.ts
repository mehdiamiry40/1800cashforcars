export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
export type AuState = (typeof AU_STATES)[number];

/** Vehicle details as known after a lookup and/or manual entry. All optional so lookups can partially fill. */
export interface VehicleDetails {
  make?: string;
  model?: string;
  variant?: string;
  year?: number;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  engine?: string;
  drivetrain?: string;
  colour?: string;
  vin?: string;
  rego?: string;
  state?: AuState;
}

export interface LookupResult {
  source: "vin" | "rego";
  provider: string;
  vehicle: VehicleDetails;
  notes: string[];
}
