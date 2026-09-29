"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { Roo } from "./Roo";

export function QuoteForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const pathname = usePathname();
  const compact = variant === "compact";
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

  if (state?.ok) {
    return (
      <div className="flex items-center gap-4 border-2 border-line bg-sand p-5">
        <Roo hand="cash" className="h-28 w-auto shrink-0" />
        <div>
          <p className="font-heading text-[22px] font-extrabold text-ink">Thanks, we&apos;re on it!</p>
          <p className="mt-1">
            We&apos;ll call or text you shortly with a price. Need it sooner? Call{" "}
            <a href={site.phoneHref} className="font-bold text-brand underline">{site.phoneDisplay}</a>.
          </p>
        </div>
      </div>
    );
  }

  const label = "mb-1.5 block font-heading text-[15px] font-extrabold text-ink";

  return (
    <form action={action} onInput={onInput}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="e" ref={elapsed} defaultValue="" />
      {compact ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={label}>Your car</span>
            <input name="vehicle" className="field" placeholder="e.g. 2009 Corolla, won't start" required />
          </label>
            <label>
              <span className={label}>Suburb</span>
              <input name="address" className="field" placeholder="Where is the car?" autoComplete="address-level2" />
            </label>
            <PriceField labelClass={label} />
          <label>
            <span className={label}>Name</span>
            <input name="name" className="field" required autoComplete="name" />
          </label>
          <label>
            <span className={label}>Mobile</span>
            <input name="phone" type="tel" className="field" required autoComplete="tel" pattern="[\d\s()+\-]{8,}" />
          </label>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className={label}>Name</span>
            <input name="name" className="field" required autoComplete="name" />
          </label>
          <label>
            <span className={label}>Mobile</span>
            <input name="phone" type="tel" className="field" required autoComplete="tel" pattern="[\d\s()+\-]{8,}" />
          </label>
          <label>
            <span className={label}>Email <span className="font-normal text-body">(optional)</span></span>
            <input name="email" type="email" className="field" autoComplete="email" />
          </label>
          <label>
            <span className={label}>Suburb</span>
            <input name="address" className="field" autoComplete="address-level2" />
          </label>
          <PriceField labelClass={label} />
          <label className="sm:col-span-2">
            <span className={label}>About the car</span>
            <textarea
              name="vehicle"
              rows={4}
              className="field"
              placeholder="Year, make, model, kms, and what's wrong with it (if anything)"
              required
            />
          </label>
        </div>
      )}
      {state && !state.ok && <p className="mt-4 bg-red-50 px-4 py-2.5 text-[15px] font-bold text-red-800">{state.message}</p>}
      <button type="submit" disabled={pending} className={`btn-brand mt-6 !py-4 !text-[18px] disabled:opacity-60 ${compact ? "w-full" : "min-w-[200px]"}`}>
        {pending ? "Sending..." : "Get my price"}
      </button>
      <p className="mt-3 text-[14px] text-body">
        No obligation. We only use your details to give you a price (<Link href="/privacy" className="underline">privacy policy</Link>).
      </p>
    </form>
  );
}

function PriceField({ labelClass }: { labelClass: string }) {
  return (
    <label>
      <span className={labelClass}>
        Expected price <span className="font-normal text-body">(optional)</span>
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-bold text-ink" aria-hidden>
          $
        </span>
        <input
          name="expected"
          inputMode="decimal"
          className="field !pl-8"
          placeholder="e.g. 2,500"
          maxLength={40}
          autoComplete="off"
        />
      </span>
    </label>
  );
}
