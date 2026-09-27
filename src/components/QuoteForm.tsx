"use client";

import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { CheckIcon, PhoneIcon } from "./icons";

export function QuoteForm() {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const pathname = usePathname();

  if (state?.ok) {
    return (
      <div className="mx-auto max-w-[760px] border border-green bg-green/5 p-8 text-center">
        <CheckIcon className="mx-auto h-12 w-12 text-green" />
        <p className="mt-3 font-heading text-2xl font-bold text-ink">Thanks — we&apos;ve got your details!</p>
        <p className="mt-2">We&apos;ll call or text you shortly with your cash offer. Need it faster?</p>
        <a href={site.phoneHref} className="btn-green mt-5">
          <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="mx-auto max-w-[760px]">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" className="field" placeholder="Name *" aria-label="Name" required autoComplete="name" />
        <input name="email" type="email" className="field" placeholder="Email" aria-label="Email" autoComplete="email" />
        <input name="phone" type="tel" className="field" placeholder="Phone *" aria-label="Phone" required autoComplete="tel" pattern="[\d\s()+\-]{8,}" />
        <input name="address" className="field" placeholder="Suburb / address of the car" aria-label="Suburb or address" autoComplete="street-address" />
      </div>
      <textarea
        name="vehicle"
        rows={6}
        className="field mt-4"
        placeholder={"Vehicle details * — make, model, year, kms and condition\ne.g. 2009 Toyota Corolla, 250,000 km, doesn't start"}
        aria-label="Vehicle details"
        required
      />
      {state && !state.ok && <p className="mt-3 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-green mt-4 min-w-[160px] disabled:opacity-60">
        {pending ? "Sending…" : "Submit »"}
      </button>
    </form>
  );
}
