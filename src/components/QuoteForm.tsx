"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { Roo } from "./Roo";
import { ArrowIcon, ChevronLeft } from "./icons";

const CONDITIONS = ["Runs", "Doesn't run", "Damaged", "Scrap"];

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

  // Placeholders do the labelling; the real labels are kept for screen readers only.
  const input = "field !py-2.5";
  const grid = narrow ? "grid gap-2.5" : "grid gap-2.5 sm:grid-cols-2";
  const wide = narrow ? "" : "sm:col-span-2";
  const enterNext = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }
  };

  return (
    <form action={action} onInput={onInput}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="e" ref={elapsed} defaultValue="" />

      <div ref={step1} hidden={step !== 1} className={grid}>
        <label className={wide}>
          <span className="sr-only">Year, make and model</span>
          <input name="vehicle" className={input} placeholder="Year, make & model" required enterKeyHint="next" onKeyDown={enterNext} />
        </label>
        <Chips name="condition" legend="Condition" options={CONDITIONS} className={wide} />
        <label className={wide}>
          <span className="sr-only">Suburb</span>
          <input name="address" className={input} placeholder="Suburb" autoComplete="address-level2" enterKeyHint="next" onKeyDown={enterNext} />
        </label>
        <button type="button" onClick={next} className={`btn-brand w-full !py-3.5 ${wide}`}>
          Next <ArrowIcon className="h-5 w-5" />
        </button>
      </div>

      <div hidden={step !== 2} className={grid}>
        <label>
          <span className="sr-only">Your name</span>
          <input ref={nameInput} name="name" className={input} placeholder="Your name" required autoComplete="name" enterKeyHint="next" />
        </label>
        <label>
          <span className="sr-only">Mobile</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            className={input}
            placeholder="Mobile"
            required
            autoComplete="tel"
            pattern="[\d\s\(\)\+\-]{8,}"
          />
        </label>
        {full && (
          <label>
            <span className="sr-only">Email (optional)</span>
            <input name="email" type="email" className={input} placeholder="Email (optional)" autoComplete="email" />
          </label>
        )}
        <PriceField className={input} wide={full ? "" : wide} />
        {full && (
          <label className={wide}>
            <span className="sr-only">Anything else (optional)</span>
            <textarea name="notes" rows={2} className="field !py-2.5" placeholder="Anything else? (optional)" />
          </label>
        )}
        {state && !state.ok && <p className={`bg-red-50 px-3 py-2 text-[15px] font-bold text-red-800 ${wide}`}>{state.message}</p>}
        <div className={`flex items-center gap-3 ${wide}`}>
          <button type="button" onClick={() => setStep(1)} aria-label="Back to car details" className="grid h-[52px] w-12 shrink-0 place-items-center border-2 border-ink text-ink">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="submit" disabled={pending} className="btn-brand w-full !py-3.5 disabled:opacity-60">
            {pending ? "Sending..." : "Get my price"}
          </button>
        </div>
      </div>

      <p className="mt-3 text-[13px] text-body">
        Free, no obligation. <Link href="/privacy" className="underline">Privacy</Link>
      </p>
    </form>
  );
}

function Chips({ name, legend, options, className = "" }: { name: string; legend: string; options: string[]; className?: string }) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <label
            key={o}
            className="cursor-pointer border-2 border-[#cfc4b2] bg-white px-2.5 py-1 font-heading text-[14px] font-bold text-ink transition hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand"
          >
            <input type="radio" name={name} value={o} className="sr-only" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function PriceField({ className, wide }: { className: string; wide: string }) {
  return (
    <label className={`relative block ${wide}`}>
      <span className="sr-only">Price you&apos;re hoping for (optional)</span>
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-bold text-ink" aria-hidden>
        $
      </span>
      <input name="expected" inputMode="decimal" className={`${className} !pl-8`} placeholder="Price you want (optional)" maxLength={40} autoComplete="off" />
    </label>
  );
}
