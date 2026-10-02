"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { Roo } from "./Roo";

// One short form: the car, then how to reach you, then a single submit button.
// `narrow` keeps everything in one column, for the sidebar.
export function QuoteForm({ variant = "full", narrow = false }: { variant?: "full" | "compact"; narrow?: boolean }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const pathname = usePathname();
  const full = variant === "full";

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

  return (
    <form action={action} onInput={onInput} className={grid}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="e" ref={elapsed} defaultValue="" />

      <label className={wide}>
        <span className="sr-only">Year, make and model</span>
        <input name="vehicle" className={input} placeholder="Year, make & model" maxLength={120} required />
      </label>
      <label className={wide}>
        <span className="sr-only">Condition</span>
        <input name="condition" className={input} placeholder="Condition (runs, won't start...)" maxLength={200} required />
      </label>
      <label className={wide}>
        <span className="sr-only">Suburb</span>
        <input name="address" className={input} placeholder="Suburb" autoComplete="address-level2" />
      </label>
      <div className={`grid grid-cols-2 gap-2 ${wide}`}>
        <label>
          <span className="sr-only">Your name</span>
          <input name="name" className={`${input} !px-3`} placeholder="Your name" required autoComplete="name" />
        </label>
        <label>
          <span className="sr-only">Mobile</span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            className={`${input} !px-3`}
            placeholder="Mobile"
            required
            autoComplete="tel"
            pattern="[\d\s\(\)\+\-]{8,}"
          />
        </label>
      </div>
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
      <button type="submit" disabled={pending} className={`btn-brand w-full !py-3.5 disabled:opacity-60 ${wide}`}>
        {pending ? "Sending..." : "Get my price"}
      </button>
      <p className={`text-[13px] text-body ${wide}`}>
        Free, no obligation. <Link href="/privacy" className="underline">Privacy</Link>
      </p>
    </form>
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
