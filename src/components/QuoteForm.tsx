"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitQuote, type QuoteState } from "@/app/actions";
import { site } from "@/lib/site";
import { ArrowIcon, CheckIcon, PhoneIcon } from "./icons";

export function QuoteForm() {
  const [state, action, pending] = useActionState<QuoteState, FormData>(
    submitQuote,
    null,
  );
  const pathname = usePathname();
  const feedback = useRef<HTMLDivElement>(null);
  // Controlled values survive a failed Server Action, so visitors can retry.
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    vehicle: "",
  });
  const update = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    setValues((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  useEffect(() => {
    if (state) feedback.current?.focus();
  }, [state]);

  if (state?.ok)
    return (
      <div
        ref={feedback}
        tabIndex={-1}
        role="status"
        className="rounded-xl border border-green bg-hero p-8 text-center"
      >
        <CheckIcon className="mx-auto h-12 w-12 text-green" />
        <h3 className="mt-3 font-heading text-2xl font-bold text-ink">
          Thanks — we&apos;ve got your details!
        </h3>
        <p className="mt-2">
          We&apos;ll be in touch with your offer. Need to speak to us?
        </p>
        <a href={site.phoneHref} className="btn-green mt-5">
          <PhoneIcon className="h-5 w-5" />
          {site.phoneDisplay}
        </a>
      </div>
    );
  return (
    <form
      action={action}
      aria-label="Request a free car quote"
      aria-busy={pending}
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <input type="hidden" name="page" value={pathname} />
      <p className="mb-5 text-sm">Fields marked * are required.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="quote-name">
            Your name *
          </label>
          <input
            id="quote-name"
            name="name"
            className="field"
            required
            autoComplete="name"
            maxLength={100}
            value={values.name}
            onChange={update}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="quote-phone">
            Phone number *
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="field"
            required
            autoComplete="tel"
            maxLength={25}
            value={values.phone}
            onChange={update}
            aria-describedby="phone-hint"
          />
          <p id="phone-hint" className="mt-1 text-xs">
            So we can contact you about your offer.
          </p>
        </div>
        <div>
          <label className="field-label" htmlFor="quote-address">
            Vehicle suburb (optional)
          </label>
          <input
            id="quote-address"
            name="address"
            className="field"
            autoComplete="address-level2"
            maxLength={150}
            value={values.address}
            onChange={update}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="quote-email">
            Email (optional)
          </label>
          <input
            id="quote-email"
            name="email"
            type="email"
            className="field"
            autoComplete="email"
            maxLength={254}
            value={values.email}
            onChange={update}
          />
        </div>
      </div>
      <div className="mt-5">
        <label className="field-label" htmlFor="quote-vehicle">
          Tell us about your vehicle *
        </label>
        <p id="vehicle-hint" className="mb-2 text-sm">
          Make, model, year and condition. Kilometres if you know them.
        </p>
        <textarea
          id="quote-vehicle"
          name="vehicle"
          rows={3}
          className="field"
          placeholder="e.g. 2009 Toyota Corolla, 250,000 km, doesn't start"
          required
          maxLength={2000}
          aria-describedby="vehicle-hint"
          value={values.vehicle}
          onChange={update}
        />
      </div>
      {state && !state.ok && (
        <div
          ref={feedback}
          tabIndex={-1}
          role="alert"
          className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-900"
        >
          <p>{state.message}</p>
          <a
            href={site.phoneHref}
            className="mt-1 inline-flex min-h-11 items-center font-bold underline"
          >
            Call {site.phoneDisplay}
          </a>
        </div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-green mt-5 w-full disabled:opacity-70"
      >
        {pending ? "Sending your request…" : "Get my free quote"}
        <ArrowIcon className="h-5 w-5" />
      </button>
      <p role="status" className="sr-only">
        {pending ? "Sending your quote request. Please wait." : ""}
      </p>
      <p className="mt-3 text-xs">
        No obligation. We use your details to respond to your enquiry.{" "}
        <Link href="/privacy" className="font-semibold text-green underline">
          Privacy policy
        </Link>
      </p>
    </form>
  );
}
