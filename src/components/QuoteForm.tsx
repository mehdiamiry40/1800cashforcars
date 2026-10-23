"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { QuoteState } from "@/lib/quote-state";
import { site } from "@/lib/site";
import { Roo } from "./Roo";
import { ArrowIcon } from "./icons";

// One short form: the car, then how to reach you, then a single submit button.
// `defaults` pre-fills the car fields, e.g. from an AutoVal valuation.
export function QuoteForm({
  variant = "full",
  defaults,
}: {
  variant?: "full" | "compact";
  defaults?: { vehicle?: string; description?: string };
}) {
  const [state, setState] = useState<QuoteState>(null);
  const [pending, setPending] = useState(false);
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

  const sending = useRef(false);
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setPending(true);
    const body = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/quote", { method: "POST", body });
      const data = (await res.json().catch(() => null)) as QuoteState | null;
      if (!data || typeof data.ok !== "boolean" || typeof data.message !== "string") {
        setState({
          ok: false,
          message: `Sorry, something went wrong. Please call or text ${site.phoneDisplay} and we'll give you a price straight away.`,
        });
        return;
      }
      setState({ ok: data.ok, message: data.message, lead: data.lead });
    } catch {
      setState({
        ok: false,
        message: `Sorry, something went wrong. Please call or text ${site.phoneDisplay} and we'll give you a price straight away.`,
      });
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  useEffect(() => {
    if (!state?.ok || !state.lead) return;
    track("quote_submitted", { page: pathname, form: variant });
    // Google Ads conversion: "1800CFC - Quote form".
    (window as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "conversion", {
      send_to: "AW-11027669589/ZYZ_CMOYvYwdENXEs4op",
    });
  }, [state, pathname, variant]);

  if (state?.ok) {
    return (
      <div className="border border-line bg-sand p-5" role="status">
        <div className="flex items-center gap-4">
          <Roo hand="cash" className="h-24 w-auto shrink-0" />
          <div>
            <p className="h-sub">Thanks, we&apos;re on it!</p>
            <p className="mt-1">We&apos;ll text or call you with a price, usually within the hour.</p>
          </div>
        </div>
        <ol className="mt-4 space-y-1.5 border-t border-line pt-4 text-[15px]">
          {["We look over your car's details", "We send you a price, no obligation", "Happy with it? We pick it up and pay you on the spot"].map(
            (t, i) => (
              <li key={t} className="flex gap-2">
                <span className="font-heading font-extrabold text-navy">{i + 1}.</span> {t}
              </li>
            ),
          )}
        </ol>
        <p className="mt-3 text-[14px]">
          In a hurry? <a href={site.phoneHref} className="font-bold text-navy underline">Call us</a>.
        </p>
      </div>
    );
  }

  // Placeholders keep the form compact. Each label is screen-reader only until the field has a value, then it
  // floats onto the field's border (globals.css) so people can still see what they typed where.
  const input = "field";

  return (
    <form action="/api/quote" method="POST" onSubmit={onSubmit} onInput={onInput} className="quote-form grid gap-3">
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="page" value={pathname} />
      <input type="hidden" name="e" ref={elapsed} defaultValue="" />

      <label className="min-w-0">
        <span className="field-float">Year, make and model</span>
        <input name="vehicle" className={input} placeholder="Year, make and model" maxLength={120} required defaultValue={defaults?.vehicle} />
      </label>
      <div className="quote-field-row grid items-end gap-3">
        <label className="min-w-0">
          <span className="field-float">Suburb</span>
          <input name="address" className={input} placeholder="Suburb" autoComplete="address-level2" maxLength={100} required />
        </label>
        <PriceField className={input} />
      </div>
      <div className="quote-contact-row grid gap-3">
      <label className="min-w-0">
        <span className="field-float">Your name</span>
        <input name="name" className={input} placeholder="Your name" required autoComplete="name" />
      </label>
      <label className="min-w-0">
        <span className="field-float">Mobile</span>
        <input name="phone" type="tel" inputMode="tel" className={input} placeholder="Mobile" required autoComplete="tel" pattern="[\d\s\(\)\+\-]{8,}" />
      </label>
      </div>
      {full && (
        <label className="min-w-0">
          <span className="field-float">Email (optional)</span>
          <input name="email" type="email" className={input} placeholder="Email (optional)" autoComplete="email" />
        </label>
      )}
      <label className="min-w-0">
        <span className="field-float">Car condition</span>
        <textarea
          name="description"
          rows={2}
          className={`${input} block resize-y`}
          placeholder="Does it run? Any damage?"
          maxLength={1000}
          required
          defaultValue={defaults?.description}
        />
      </label>
      {state && !state.ok && <p role="alert" className="bg-red-50 px-3 py-2 text-[14px] font-semibold text-red-800">{state.message}</p>}
      <button type="submit" disabled={pending} className="btn-brand mt-1 w-full disabled:opacity-60">
        {pending ? "Sending..." : "Get a free quote"}
        {!pending && <ArrowIcon aria-hidden="true" className="h-4 w-4" />}
      </button>
      <p className="text-[14px] text-body">
        Free, no obligation. Pickups across South East QLD and the Tweed.{" "}
        <Link href="/privacy" className="inline-flex min-h-6 items-center underline">Privacy</Link>
      </p>
    </form>
  );
}

function PriceField({ className }: { className: string }) {
  return (
    <label className="block min-w-0">
      <span className="field-float">Price (optional)</span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-navy" aria-hidden="true">$</span>
        <input name="expected" inputMode="decimal" className={`${className} pl-7`} placeholder="Price (optional)" maxLength={40} autoComplete="off" />
      </span>
    </label>
  );
}
