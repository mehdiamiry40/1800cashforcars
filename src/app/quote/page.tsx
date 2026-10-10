import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { Breadcrumbs } from "@/components/JsonLd";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Cash Offer For Your Car",
  description:
    "Tell us about your car and get a free, no-obligation cash offer by text, usually within the hour. Free removal and paid on pickup.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Get a free quote", path: "/quote" }]} />
      <section className="container-site grid gap-12 py-14 md:grid-cols-[1fr_1.5fr] md:gap-16 md:py-20">
        <div>
          <p className="eyebrow">Free quote</p>
          <h1 className="h-page mt-3">
            <span className="text-brand">Let’s talk</span> about your car.
          </h1>
          <p className="mt-5 text-[20px]">
            Tell us what you’ve got and we’ll text or call you with a price,
            usually within the hour.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Free pickup, even if it doesn’t run",
              "No obligation to accept",
              "Paid before your car leaves",
            ].map((text) => (
              <li key={text} className="flex gap-3 font-medium">
                <CheckIcon
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 shrink-0 text-brand"
                />
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10 border-t border-line pt-8">
            <p className="text-[16px] font-semibold">Prefer to talk?</p>
            <a
              href={site.phoneHref}
              className="mt-2 inline-flex min-h-11 items-center gap-3 text-[28px] font-bold"
            >
              <PhoneIcon aria-hidden="true" className="h-5 w-5 text-brand" />
              {site.phoneDisplay}
            </a>
            <p className="mt-3">{site.pickups}</p>
          </div>
        </div>
        <div
          id="quote"
          data-quote
          className="min-w-0 scroll-mt-32 self-start md:px-6 lg:px-10"
        >
          <h2 className="h-sub mb-6">Tell us about your vehicle</h2>
          <QuoteForm />
        </div>
      </section>
    </>
  );
}
