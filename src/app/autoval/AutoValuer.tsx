"use client";

import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { AU_STATES, type LookupResult, type VehicleDetails } from "@/lib/autoval/types";
import type { Valuation, ValuationRequest } from "@/lib/autoval/valuation";
import { ValuationReport, type ValuedCar } from "./ValuationReport";

type Mode = "rego" | "vin" | "details";

type FormState = Omit<VehicleDetails, "year"> & {
  year: string;
  odometerKm: string;
  condition: ValuationRequest["condition"];
  serviceHistory: ValuationRequest["serviceHistory"];
  owners: string;
  accidentHistory: boolean;
  extras: string;
  knownIssues: string;
};

const EMPTY: FormState = {
  year: "",
  odometerKm: "",
  state: "QLD",
  condition: "good",
  serviceHistory: "unknown",
  owners: "",
  accidentHistory: false,
  extras: "",
  knownIssues: "",
};

const TABS: { id: Mode; label: string }[] = [
  { id: "rego", label: "Rego" },
  { id: "vin", label: "VIN" },
  { id: "details", label: "Details" },
];

const STATE_NAMES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  WA: "Western Australia",
  SA: "South Australia",
  TAS: "Tasmania",
  ACT: "Australian Capital Territory",
  NT: "Northern Territory",
};

const CONDITIONS: { id: FormState["condition"]; label: string; hint: string }[] = [
  { id: "excellent", label: "Excellent", hint: "Like new" },
  { id: "good", label: "Good", hint: "Minor wear" },
  { id: "fair", label: "Fair", hint: "Visible wear" },
  { id: "poor", label: "Poor", hint: "Needs work" },
];

const SERVICE: { id: FormState["serviceHistory"]; label: string }[] = [
  { id: "full", label: "Full logbook" },
  { id: "partial", label: "Partial" },
  { id: "none", label: "None" },
  { id: "unknown", label: "Not sure" },
];

const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Dual-clutch"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Plug-in hybrid", "Electric", "LPG"];

export function AutoValuer() {
  const [mode, setMode] = useState<Mode>("rego");
  const [rego, setRego] = useState("");
  const [regoState, setRegoState] = useState<string>("QLD");
  const [vin, setVin] = useState("");
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [valuing, setValuing] = useState(false);
  const [result, setResult] = useState<{ valuation: Valuation; car: ValuedCar } | null>(null);
  const [valuationError, setValuationError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function switchMode(next: Mode) {
    setMode(next);
    setLookupError(null);
    if (next === "details") setShowForm(true);
  }

  async function runLookup(e: React.FormEvent) {
    e.preventDefault();
    setLookingUp(true);
    setLookupError(null);
    setLookup(null);
    try {
      const res = await fetch("/api/autoval/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "vin" ? { type: "vin", vin } : { type: "rego", rego, state: regoState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      const found = data as LookupResult;
      setLookup(found);
      const v = found.vehicle;
      setForm((f) => ({
        ...f,
        ...v,
        year: v.year ? String(v.year) : f.year,
        state: v.state ?? (mode === "rego" ? (regoState as VehicleDetails["state"]) : f.state),
      }));
      setShowForm(true);
    } catch (err) {
      setLookupError((err as Error).message);
      // Still let them continue manually, keeping what they typed.
      setForm((f) => ({
        ...f,
        ...(mode === "vin" ? { vin } : { rego, state: regoState as VehicleDetails["state"] }),
      }));
    } finally {
      setLookingUp(false);
    }
  }

  async function runValuation(e: React.FormEvent) {
    e.preventDefault();
    setValuing(true);
    setValuationError(null);
    setResult(null);
    const payload = {
      ...form,
      year: Number(form.year),
      odometerKm: Number(form.odometerKm.replace(/[^\d]/g, "")),
      owners: form.owners ? Number(form.owners) : undefined,
      state: form.state || undefined,
    };
    // Drop empty strings so optional fields stay optional.
    const body = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== "" && v !== undefined));
    track("autoval_started", { mode });
    try {
      const res = await fetch("/api/autoval/valuate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Valuation failed");
      setResult({
        valuation: data.valuation,
        car: {
          name: [form.year, form.make, form.model, form.variant].filter(Boolean).join(" "),
          odometerKm: payload.odometerKm,
          condition: form.condition,
          knownIssues: form.knownIssues,
        },
      });
      track("autoval_completed", { confidence: data.valuation.confidence });
      requestAnimationFrame(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      setValuationError((err as Error).message);
    } finally {
      setValuing(false);
    }
  }

  const vinClean = vin.toUpperCase().replace(/[\s-]/g, "");
  const found = lookup && [lookup.vehicle.year, lookup.vehicle.make, lookup.vehicle.model].filter(Boolean).join(" ");

  return (
    <div className="space-y-8">
      {/* Step 1: identify the car */}
      <section className="border border-line/15 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(30,37,164,0.45)] sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-logo">Step 1</p>
            <h2 className="h-sub mt-1 sm:text-[34px]">Find your car</h2>
          </div>
          <div role="tablist" aria-label="How to find your car" className="grid grid-cols-3 border border-navy">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={mode === t.id}
                onClick={() => switchMode(t.id)}
                className={`min-h-12 px-4 text-[16px] font-bold transition-colors sm:px-7 ${
                  mode === t.id ? "bg-navy text-white" : "bg-white text-navy hover:bg-[#f2f3fb]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          {mode === "rego" && (
            <form onSubmit={runLookup} className="flex flex-col gap-5 md:flex-row md:items-end">
              <PlateInput value={rego} onChange={setRego} state={regoState} />
              <label className="min-w-0 flex-1">
                <span className="field-label">Registered in</span>
                <select className="field" value={regoState} onChange={(e) => setRegoState(e.target.value)}>
                  {AU_STATES.map((s) => (
                    <option key={s} value={s}>{STATE_NAMES[s]}</option>
                  ))}
                </select>
              </label>
              <button type="submit" disabled={lookingUp} className="btn-brand disabled:opacity-60">
                {lookingUp ? "Searching…" : "Find my car"}
                {!lookingUp && <ArrowIcon aria-hidden="true" className="h-5 w-5" />}
              </button>
            </form>
          )}

          {mode === "vin" && (
            <form onSubmit={runLookup} className="flex flex-col gap-4 md:flex-row md:items-end">
              <label className="min-w-0 flex-1">
                <span className="field-label flex justify-between gap-4">
                  <span>VIN (17 characters)</span>
                  <span className={`font-display ${vinClean.length === 17 ? "text-logo" : "text-muted"}`}>{vinClean.length}/17</span>
                </span>
                <input
                  className="field font-display text-[20px] uppercase tracking-[0.18em]"
                  placeholder="JTDKB3FU503012345"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  required
                  maxLength={20}
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <button type="submit" disabled={lookingUp} className="btn-brand disabled:opacity-60">
                {lookingUp ? "Decoding…" : "Decode VIN"}
                {!lookingUp && <ArrowIcon aria-hidden="true" className="h-5 w-5" />}
              </button>
            </form>
          )}
          {mode === "vin" && (
            <p className="mt-2 text-[15px] text-muted">On the compliance plate, the bottom of the windscreen or your rego papers.</p>
          )}

          {mode === "details" && (
            <p className="max-w-xl text-[18px]">No rego or VIN handy? Fill in the details below and we&apos;ll do the rest.</p>
          )}

          {lookupError && (
            <div className="mt-6 flex flex-col gap-3 border-l-4 border-brand bg-[#fdf3ee] p-4 text-[16px] sm:flex-row sm:items-center sm:justify-between">
              <p>{lookupError}</p>
              <button type="button" className="shrink-0 font-bold text-navy underline underline-offset-4" onClick={() => setShowForm(true)}>
                Enter details manually
              </button>
            </div>
          )}

          {lookup && (
            <div className="mt-6 flex items-start gap-4 border-l-4 border-navy bg-[#f2f3fb] p-4">
              <CheckIcon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-navy" />
              <div className="text-[16px]">
                <p className="font-bold">
                  {found || "Partial match"}
                  {lookup.vehicle.variant && <span className="font-medium text-muted"> · {lookup.vehicle.variant}</span>}
                </p>
                {lookup.notes.map((n) => <p key={n} className="mt-1 text-muted">{n}</p>)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Step 2: details */}
      {showForm && (
        <form onSubmit={runValuation} className="border border-line/15 bg-white p-6 sm:p-10">
          <p className="eyebrow text-logo">Step 2</p>
          <h2 className="h-sub mt-1 sm:text-[34px]">Tell us about it</h2>
          <p className="mt-1 text-[16px] text-muted">Kilometres and condition make the biggest difference to the price.</p>

          <FormSection title="The car">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Field label="Make" required><input className="field" required value={form.make ?? ""} onChange={(e) => set("make", e.target.value)} placeholder="Toyota" /></Field>
              <Field label="Model" required><input className="field" required value={form.model ?? ""} onChange={(e) => set("model", e.target.value)} placeholder="Corolla" /></Field>
              <Field label="Year" required><input className="field" required inputMode="numeric" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2018" /></Field>
              <Field label="Variant"><input className="field" value={form.variant ?? ""} onChange={(e) => set("variant", e.target.value)} placeholder="Ascent Sport" /></Field>
              <Field label="Body"><input className="field" value={form.bodyType ?? ""} onChange={(e) => set("bodyType", e.target.value)} placeholder="Hatch" /></Field>
              <Field label="Transmission">
                <select className="field" value={form.transmission ?? ""} onChange={(e) => set("transmission", e.target.value)}>
                  <option value="">Select</option>
                  {withCurrent(TRANSMISSIONS, form.transmission).map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Fuel">
                <select className="field" value={form.fuelType ?? ""} onChange={(e) => set("fuelType", e.target.value)}>
                  <option value="">Select</option>
                  {withCurrent(FUELS, form.fuelType).map((o) => <option key={o}>{o}</option>)}
                </select>
              </Field>
              <Field label="Engine"><input className="field" value={form.engine ?? ""} onChange={(e) => set("engine", e.target.value)} placeholder="1.8L 4-cyl or 2ZR-FE" /></Field>
              <Field label="State">
                <select className="field" value={form.state ?? ""} onChange={(e) => set("state", (e.target.value || undefined) as VehicleDetails["state"])}>
                  <option value="">Select</option>
                  {AU_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Colour"><input className="field" value={form.colour ?? ""} onChange={(e) => set("colour", e.target.value)} placeholder="White" /></Field>
              <Field label="Kilometres" required>
                <input className="field" required inputMode="numeric" value={form.odometerKm} onChange={(e) => set("odometerKm", e.target.value)} placeholder="85,000" />
              </Field>
              <Field label="Owners"><input className="field" inputMode="numeric" value={form.owners} onChange={(e) => set("owners", e.target.value)} placeholder="2" /></Field>
            </div>
          </FormSection>

          <FormSection title="Condition">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={form.condition === c.id}
                  onClick={() => set("condition", c.id)}
                  className={`relative border-2 p-4 text-left transition-colors ${
                    form.condition === c.id ? "border-brand bg-[#fdf3ee]" : "border-line/15 bg-white hover:border-navy"
                  }`}
                >
                  {form.condition === c.id && <CheckIcon aria-hidden="true" className="absolute right-3 top-3 h-5 w-5 text-logo" />}
                  <span className="block text-[18px] font-bold">{c.label}</span>
                  <span className="block text-[15px] text-muted">{c.hint}</span>
                </button>
              ))}
            </div>

            <p className="field-label mt-6">Service history</p>
            <div className="flex flex-wrap gap-2">
              {SERVICE.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={form.serviceHistory === s.id}
                  onClick={() => set("serviceHistory", s.id)}
                  className={`min-h-11 border px-4 text-[16px] font-semibold transition-colors ${
                    form.serviceHistory === s.id ? "border-navy bg-navy text-white" : "border-line/25 bg-white hover:border-navy"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <label className="mt-6 flex min-h-11 cursor-pointer items-center gap-3 text-[16px] font-semibold">
              <input
                type="checkbox"
                className="h-5 w-5 accent-[var(--color-brand)]"
                checked={form.accidentHistory}
                onChange={(e) => set("accidentHistory", e.target.checked)}
              />
              It&apos;s been in an accident or had panel repairs
            </label>
          </FormSection>

          <FormSection title="Extras and issues">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Extras and upgrades">
                <textarea className="field min-h-24 resize-y" value={form.extras} onChange={(e) => set("extras", e.target.value)} placeholder="New tyres, tow bar, dash cam, two keys…" />
              </Field>
              <Field label="Known issues">
                <textarea className="field min-h-24 resize-y" value={form.knownIssues} onChange={(e) => set("knownIssues", e.target.value)} placeholder="Scratch on rear bumper, aircon weak…" />
              </Field>
            </div>
          </FormSection>

          <div className="mt-10 border-t border-line/15 pt-8">
            {valuing ? (
              <ResearchProgress />
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[16px] text-muted">We check live Australian listings. It usually takes under a minute.</p>
                <button type="submit" className="btn-brand">
                  Get my valuation <ArrowIcon aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>
            )}
            {valuationError && (
              <p role="alert" className="mt-6 bg-red-50 px-4 py-3 text-[16px] font-semibold text-red-800">{valuationError}</p>
            )}
          </div>
        </form>
      )}

      {result && <ValuationReport valuation={result.valuation} car={result.car} />}
    </div>
  );
}

/** Australian-style number plate input. */
function PlateInput({ value, onChange, state }: { value: string; onChange: (v: string) => void; state: string }) {
  return (
    <label className="block w-full shrink-0 md:w-80">
      <span className="field-label">Number plate</span>
      <span className="block rounded-md border-[3px] border-navy bg-white px-4 pb-2 pt-1.5 text-center shadow-[inset_0_0_0_2px_#fff,inset_0_0_0_3px_rgba(30,37,164,0.25)] focus-within:border-brand">
        <span className="block text-[11px] font-bold uppercase tracking-[0.28em] text-navy">{STATE_NAMES[state]}</span>
        <input
          className="w-full bg-transparent text-center font-display text-[40px] font-extrabold uppercase leading-tight tracking-[0.14em] text-navy outline-none placeholder:text-navy/20"
          placeholder="ABC123"
          aria-label="Number plate"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          required
          maxLength={9}
          autoComplete="off"
          spellCheck={false}
        />
      </span>
    </label>
  );
}

const RESEARCH_STEPS = [
  "Confirming the exact model and generation",
  "Checking carsales, Drive, RedBook and marketplace listings",
  "Adjusting for kilometres, condition and history",
  "Identifying the engine and its specs",
  "Checking known issues and inspection points",
  "Writing your report",
];

function ResearchProgress() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, RESEARCH_STEPS.length - 1)), 9000);
    return () => clearInterval(id);
  }, []);
  return (
    <div role="status" aria-live="polite">
      <div className="mb-5 h-2 bg-[#f2f3fb]">
        <div
          className="h-full bg-brand transition-all duration-[9000ms] ease-linear"
          style={{ width: `${((step + 1) / RESEARCH_STEPS.length) * 92}%` }}
        />
      </div>
      <ol className="space-y-2.5">
        {RESEARCH_STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 text-[16px] ${i <= step ? "font-semibold text-navy" : "text-muted/70"}`}>
            <span className={`grid h-6 w-6 shrink-0 place-items-center border-2 ${i < step ? "border-logo bg-logo text-white" : i === step ? "border-logo" : "border-line/20"}`}>
              {i < step ? <CheckIcon aria-hidden="true" className="h-3.5 w-3.5" /> : i === step ? <span className="h-2 w-2 animate-pulse bg-brand" /> : null}
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-10">
      <legend className="mb-4 flex w-full items-center gap-4 text-[14px] font-bold uppercase tracking-[0.14em] text-navy">
        {title}
        <span className="h-px flex-1 bg-line/15" />
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="field-label">
        {label}
        {required && <span className="text-logo"> *</span>}
      </span>
      {children}
    </label>
  );
}

function withCurrent(options: string[], current?: string) {
  return current && !options.includes(current) ? [...options, current] : options;
}
