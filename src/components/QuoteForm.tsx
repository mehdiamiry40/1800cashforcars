"use client";

import { useActionState, useRef, useState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { ArrowIcon, CheckIcon, PhoneIcon } from "./icons";

const makes = [
  "Toyota", "Mazda", "Ford", "Holden", "Hyundai", "Mitsubishi", "Nissan", "Kia", "Volkswagen", "Subaru",
  "Honda", "Isuzu", "Suzuki", "BMW", "Mercedes-Benz", "Audi", "Jeep", "Land Rover", "Lexus", "Tesla", "Other",
];
const conditions = [
  "Runs & drives",
  "Runs, needs work",
  "Doesn't start",
  "Accident damaged",
  "Flood / fire damaged",
  "Scrap / wreck",
];
const thisYear = new Date().getFullYear();
const years = Array.from({ length: 40 }, (_, i) => String(thisYear - i));
const steps = ["Your car", "Location", "Your details"];

export function QuoteForm({ compact = false, defaultArea = "" }: { compact?: boolean; defaultArea?: string }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const [step, setStep] = useState(0);
  const [condition, setCondition] = useState(conditions[0]);
  const stepRefs = useRef<(HTMLFieldSetElement | null)[]>([]);

  const next = () => {
    const fields = stepRefs.current[step]?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select");
    for (const f of fields ?? []) if (!f.reportValidity()) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  if (state?.ok) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center text-ink shadow-2xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-money-500 text-white">
          <CheckIcon className="h-9 w-9" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-black">Got it — your offer is on its way!</h3>
        <p className="mt-2 text-muted">
          One of our team will call or text you shortly with your cash offer. Need it faster?
        </p>
        <a href={site.phoneHref} className="btn-cash mt-6">
          <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-3xl bg-white p-6 text-ink shadow-2xl sm:p-7" noValidate={false}>
      <div className="flex items-baseline justify-between">
        <h2 className={`font-display font-black ${compact ? "text-xl" : "text-2xl"}`}>Get your cash offer</h2>
        <span className="text-xs font-semibold text-muted">Free · 60 seconds</span>
      </div>

      <ol className="mt-4 grid grid-cols-3 gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} className="text-center">
            <span className={`block h-1.5 rounded-full ${i <= step ? "bg-brand-500" : "bg-line"}`} />
            <span className={`mt-1.5 block text-[11px] font-semibold ${i === step ? "text-brand-600" : "text-muted"}`}>{s}</span>
          </li>
        ))}
      </ol>

      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <fieldset ref={(el) => { stepRefs.current[0] = el; }} hidden={step !== 0} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="year">Year</label>
            <select id="year" name="year" className="field" required defaultValue="">
              <option value="" disabled>Select</option>
              {years.map((y) => <option key={y}>{y}</option>)}
              <option value="Older">Older</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="make">Make</label>
            <select id="make" name="make" className="field" required defaultValue="">
              <option value="" disabled>Select</option>
              {makes.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="model">Model</label>
          <input id="model" name="model" className="field" placeholder="e.g. Corolla, Ranger, CX-5" required />
        </div>
        <div>
          <span className="label">Condition</span>
          <input type="hidden" name="condition" value={condition} />
          <div className="grid grid-cols-2 gap-2">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={`rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition ${
                  condition === c ? "border-brand-500 bg-brand-500/10 text-brand-600" : "border-line hover:border-brand-500/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset ref={(el) => { stepRefs.current[1] = el; }} hidden={step !== 1} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="postcode">Where&apos;s the car? (suburb or postcode)</label>
          <input id="postcode" name="postcode" className="field" placeholder="e.g. Southport 4215" defaultValue={defaultArea} required autoComplete="postal-code" />
        </div>
        <div>
          <label className="label" htmlFor="rego">Rego or VIN <span className="font-normal text-muted">(optional)</span></label>
          <input id="rego" name="rego" className="field" placeholder="Helps us give a firmer offer" />
        </div>
        <div>
          <label className="label" htmlFor="notes">Anything else? <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="notes" name="notes" rows={2} className="field" placeholder="Kms, damage, missing parts, preferred pickup time…" />
        </div>
      </fieldset>

      <fieldset ref={(el) => { stepRefs.current[2] = el; }} hidden={step !== 2} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="name">Your name</label>
          <input id="name" name="name" className="field" required autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Mobile number</label>
          <input id="phone" name="phone" type="tel" className="field" required autoComplete="tel" placeholder="04xx xxx xxx" pattern="[\d\s()+\-]{8,}" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email <span className="font-normal text-muted">(optional)</span></label>
          <input id="email" name="email" type="email" className="field" autoComplete="email" />
        </div>
      </fieldset>

      {state && !state.ok && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.message}</p>}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full px-4 py-3 text-sm font-bold text-muted hover:text-ink">
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" onClick={next} className="btn-cash flex-1">
            Next <ArrowIcon className="h-5 w-5" />
          </button>
        ) : (
          <button type="submit" disabled={pending} className="btn-cash flex-1 disabled:opacity-60">
            {pending ? "Sending…" : "Get my cash offer"}
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted">No obligation. We never share your details.</p>
    </form>
  );
}
