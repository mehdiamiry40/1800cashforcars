"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { ArrowIcon, CheckIcon, PhoneIcon } from "./icons";

export function QuoteForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const pathname = usePathname();
  const compact = variant === "compact";

  if (state?.ok) {
    return (
      <div className="rounded-2xl bg-brand-soft p-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-money text-white">
          <CheckIcon className="h-8 w-8" />
        </span>
        <p className="mt-3 font-heading text-2xl font-extrabold uppercase text-navy">Thanks — we&apos;ve got it!</p>
        <p className="mt-1">We&apos;ll call or text you shortly with your cash offer. Need it faster?</p>
        <a href={site.phoneHref} className="btn-navy mt-4">
          <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form action={action}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2"}>
        {compact ? (
          <>
            <input name="vehicle" className="field" placeholder="Car — year, make, model (e.g. 2009 Corolla) *" aria-label="Vehicle" required />
            <input name="address" className="field" placeholder="Suburb" aria-label="Suburb" autoComplete="address-level2" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="name" className="field" placeholder="Your name *" aria-label="Name" required autoComplete="name" />
              <input name="phone" type="tel" className="field" placeholder="Mobile *" aria-label="Phone" required autoComplete="tel" pattern="[\d\s()+\-]{8,}" />
            </div>
          </>
        ) : (
          <>
            <input name="name" className="field" placeholder="Name *" aria-label="Name" required autoComplete="name" />
            <input name="phone" type="tel" className="field" placeholder="Phone *" aria-label="Phone" required autoComplete="tel" pattern="[\d\s()+\-]{8,}" />
            <input name="email" type="email" className="field" placeholder="Email" aria-label="Email" autoComplete="email" />
            <input name="address" className="field" placeholder="Suburb / address of the car" aria-label="Suburb or address" autoComplete="street-address" />
            <textarea
              name="vehicle"
              rows={5}
              className="field sm:col-span-2"
              placeholder={"Vehicle details * — make, model, year, kms and condition\ne.g. 2009 Toyota Corolla, 250,000 km, doesn't start"}
              aria-label="Vehicle details"
              required
            />
          </>
        )}
      </div>
      {state && !state.ok && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.message}</p>}
      <button type="submit" disabled={pending} className={`btn-brand mt-4 disabled:opacity-60 ${compact ? "w-full" : "min-w-[220px]"}`}>
        {pending ? "Sending…" : compact ? "Get my offer" : "Send my details"} {!pending && <ArrowIcon className="h-5 w-5" />}
      </button>
      <p className="mt-3 text-xs text-body/80">We only use your details to prepare your offer. See our <Link href="/privacy" className="underline">privacy policy</Link>.</p>
    </form>
  );
}
