import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { Roo } from "./Roo";

/**
 * Shown once a quote request is accepted: inside the form, and on /quote/sent when the browser sent
 * the form itself. `children` is the reference line, when there is one.
 */
export function QuoteThanks({ children }: { children?: ReactNode }) {
  return (
    <div className="border border-line bg-sand p-5" role="status">
      <div className="flex items-center gap-4">
        <Roo hand="cash" className="h-24 w-auto shrink-0" />
        <div>
          <p className="h-sub">Thanks, we&apos;re on it!</p>
          <p className="mt-1">We&apos;ll text or call you with a price, {site.quoteTurnaround}.</p>
          {children}
        </div>
      </div>
      <ol className="mt-4 space-y-1.5 border-t border-line pt-4 text-[15px]">
        {["We look over your car's details", "We send you a price, no obligation", "Happy with it? We pick it up and pay you on the day"].map(
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
