"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { Roo } from "./Roo";
import { ArrowIcon, CheckIcon, ChevronLeft } from "./icons";

const TYPES = ["Car", "Ute", "Van", "4WD", "Truck", "Other"];
const CONDITIONS = ["Runs", "Doesn't run", "Damaged", "Scrap / wreck"];

// Two short steps (the car, then how to reach you): people finish a form more often once they've started it.
// Both steps live in one <form>, so the server action gets every field in a single submit.
// `narrow` keeps everything in one column, for the sidebar.
export function QuoteForm({ variant = "full", narrow = false }: { variant?: "full" | "compact"; narrow?: boolean }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const [step, setStep] = useState<1 | 2>(1);
  const pathname = usePathname();
  const full = variant === "full";
  const step1 = useRef<HTMLDivElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  // Spam check: records how long after the page loaded the visitor last typed (a relative time, so clock
  // differences don't matter). The server drops forms filled in under ~2.5 seconds, which only bots manage.
  const mountedAt = useRef(0);
  const elapsed = useRef<HTMLInputElement>(null);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);
  const onInput = () => {
    if (elapsed.current && mountedAt.current) elapsed.current.value = String(Math.round(performance.now() - mountedAt.current));
  };

  useEffect(() => {
    if (state?.ok) track("quote_submitted", { page: pathname, form: variant });
  }, [state, pathname, variant]);

  const next = () => {
    const fields = step1.current?.querySelectorAll<HTMLInputElement>("input[required]") ?? [];
    for (const f of fields) if (!f.reportValidity()) return;
    setStep(2);
    track("quote_step_1_done", { page: pathname, form: variant });
    requestAnimationFrame(() => nameInput.current?.focus());
  };

  if (state?.ok) {
    return (
      <div className="border-2 border-line bg-sand p-5" role="status">
        <div className="flex items-center gap-4">
          <Roo hand="cash" className="h-24 w-auto shrink-0" />
          <div>
            <p className="font-heading text-[22px] font-extrabold text-ink">Thanks, we&apos;re on it!</p>
            <p className="mt-1">We&apos;ll text or call you with a price, usually within the hour.</p>
          </div>
        </div>
        <ol className="mt-4 space-y-1.5 border-t border-line pt-4 text-[15px]">
          {["We look over your car's details", "We send you a price, no obligation", "Happy with it? We pick it up and pay you on the spot"].map(
            (t, i) => (
              <li key={t} className="flex gap-2">
                <span className="font-heading font-extrabold text-brand">{i + 1}.</span> {t}
              </li>
            ),
          )}
        </ol>
        <p className="mt-3 text-[14px]">
          In a hurry? <a href={site.phoneHref} className="font-bold text-brand underline">Call us</a>.
        </p>
      </div>
    );
  }

  const label = "mb-1 block font-heading text-[15px] font-extrabold text-ink";
  const grid = narrow ? "grid gap-3.5" : "grid gap-3.5 sm:grid-cols-2";
  const wide = narrow ? "" : "sm:col-span-2";

  return (
    <form action={action} onInput={onInput}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="e" ref={elapsed} defaultValue="" />

      <p className="mb-3 flex items-center gap-2 font-heading text-[13px] font-extrabold uppercase tracking-wider text-body">
        <span className={step === 1 ? "text-brand" : ""}>1. Your car</span>
        <span aria-hidden className="h-0.5 w-6 bg-line" />
        <span className={step === 2 ? "text-brand" : ""}>2. Your price</span>
      </p>

      <div ref={step1} hidden={step !== 1} className={grid}>
        <Chips name="type" legend="What is it?" options={TYPES} defaultValue="Car" className={wide} labelClass={label} />
        <label className={wide}>
          <span className={label}>Year, make &amp; model</span>
          <input
            name="vehicle"
            className="field"
            placeholder="e.g. 2009 Toyota Corolla"
            required
            enterKeyHint="next"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                next();
              }
            }}
          />
        </label>
        <Chips name="condition" legend="Condition" options={CONDITIONS} className={wide} labelClass={label} />
        <label className={wide}>
          <span className={label}>Suburb</span>
          <input
            name="address"
            className="field"
            placeholder="Where's the car?"
            autoComplete="address-level2"
            enterKeyHint="next"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                next();
              }
            }}
          />
        </label>
        <div className={wide}>
          <button type="button" onClick={next} className="btn-brand w-full !py-4 !text-[18px]">
            Next: get my price <ArrowIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div hidden={step !== 2} className={grid}>
        <label>
          <span className={label}>Your name</span>
          <input ref={nameInput} name="name" className="field" required autoComplete="name" enterKeyHint="next" />
        </label>
        <label>
          <span className={label}>Mobile</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            className="field"
            required
            autoComplete="tel"
            pattern="[\d\s\(\)\+\-]{8,}"
            placeholder="04xx xxx xxx"
          />
        </label>
        {full && (
          <label>
            <span className={label}>
              Email <span className="font-normal text-body">(optional)</span>
            </span>
            <input name="email" type="email" className="field" autoComplete="email" />
          </label>
        )}
        <PriceField labelClass={label} />
        {full && (
          <label className={wide}>
            <span className={label}>
              Anything else? <span className="font-normal text-body">(optional)</span>
            </span>
            <textarea name="notes" rows={3} className="field" placeholder="Kms, what's wrong with it, rego, keys..." />
          </label>
        )}
        <div className={wide}>
          {state && !state.ok && <p className="mb-4 bg-red-50 px-4 py-2.5 text-[15px] font-bold text-red-800">{state.message}</p>}
          <button type="submit" disabled={pending} className="btn-brand w-full !py-4 !text-[18px] disabled:opacity-60">
            {pending ? "Sending..." : "Get my price"}
          </button>
          <button type="button" onClick={() => setStep(1)} className="mt-2 inline-flex items-center gap-1 py-1 text-[15px] font-bold text-body underline underline-offset-2">
            <ChevronLeft className="h-4 w-4" /> Change car details
          </button>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-body">
        {["Free", "No obligation", "Takes 30 seconds"].map((t) => (
          <li key={t} className="flex items-center gap-1">
            <CheckIcon className="h-3.5 w-3.5 text-brand" /> {t}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] text-body">
        We only use your details to give you a price (<Link href="/privacy" className="underline">privacy policy</Link>).
      </p>
    </form>
  );
}

function Chips({
  name,
  legend,
  options,
  defaultValue,
  className = "",
  labelClass,
}: {
  name: string;
  legend: string;
  options: string[];
  defaultValue?: string;
  className?: string;
  labelClass: string;
}) {
  return (
    <fieldset className={className}>
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label
            key={o}
            className="cursor-pointer border-2 border-[#cfc4b2] bg-white px-3 py-1.5 font-heading text-[14px] font-bold text-ink transition hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
          >
            <input type="radio" name={name} value={o} defaultChecked={o === defaultValue} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PriceField({ labelClass }: { labelClass: string }) {
  return (
    <label>
      <span className={labelClass}>
        Price you&apos;re hoping for <span className="font-normal text-body">(optional)</span>
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-bold text-ink" aria-hidden>
          $
        </span>
        <input name="expected" inputMode="decimal" className="field !pl-8" placeholder="e.g. 2,500" maxLength={40} autoComplete="off" />
      </span>
    </label>
  );
}
