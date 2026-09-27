"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";

export function QuoteForm({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitQuote, null);
  const pathname = usePathname();
  const compact = variant === "compact";

  if (state?.ok) {
    return (
      <div className="border-l-4 border-money bg-[#f0f7f2] p-5">
        <p className="font-heading text-[20px] font-bold text-ink">Thanks, we&apos;ve got your details.</p>
        <p className="mt-1">
          We&apos;ll call or text you shortly with a price. If you need it sooner, call us on{" "}
          <a href={site.phoneHref} className="font-bold text-brand-dark underline">{site.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  const label = "mb-1 block text-[15px] font-semibold text-ink";

  return (
    <form action={action}>
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      {compact ? (
        <div className="grid gap-4">
          <label>
            <span className={label}>Your car</span>
            <input name="vehicle" className="field" placeholder="e.g. 2009 Toyota Corolla, doesn't start" required />
          </label>
          <label>
            <span className={label}>Suburb</span>
            <input name="address" className="field" placeholder="Where is the car?" autoComplete="address-level2" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={label}>Name</span>
              <input name="name" className="field" required autoComplete="name" />
            </label>
            <label>
              <span className={label}>Mobile</span>
              <input name="phone" type="tel" className="field" required autoComplete="tel" pattern="[\d\s()+\-]{8,}" />
            </label>
          </div>
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
      {state && !state.ok && <p className="mt-3 border-l-4 border-red-600 bg-red-50 px-3 py-2 text-[15px] font-semibold text-red-800">{state.message}</p>}
      <button type="submit" disabled={pending} className={`btn-brand mt-5 !py-3.5 !text-[18px] disabled:opacity-60 ${compact ? "w-full" : "min-w-[200px]"}`}>
        {pending ? "Sending..." : "Get my price"}
      </button>
      <p className="mt-3 text-[14px] text-body">
        No obligation. We only use your details to give you a price (<Link href="/privacy" className="underline">privacy policy</Link>).
      </p>
    </form>
  );
}
