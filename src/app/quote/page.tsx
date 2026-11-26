import type { Metadata } from "next";
import { GoogleReviewsSignal } from "@/components/GoogleReviewsSignal";
import { QuoteTrustLine } from "@/components/ParentBrand";
import { QuoteForm, QuoteFormHeading } from "@/components/QuoteForm";
import { Breadcrumbs, BreadcrumbTrail } from "@/components/JsonLd";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { pageOpenGraph, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Cash Offer For Your Car",
  description:
    "Tell us about your car and get a free, no-obligation cash offer by text, usually within the hour. Free removal and paid on pickup.",
  alternates: { canonical: "/quote" },
  openGraph: pageOpenGraph("/quote"),
  // Same form as /contact-us; keep only the contact page in search results so the two don't compete.
  robots: { index: false, follow: true },
};

const TRAIL = [{ name: "Get a free quote", path: "/quote" }];

export default function QuotePage() {
  return (
    <>
      <Breadcrumbs trail={TRAIL} />
      {/* The trail is 44px tall and stands where that much of the section's top padding was, so the form stays put. */}
      <BreadcrumbTrail trail={TRAIL} className="container-site" />
      <section className="container-site grid gap-8 pb-10 pt-1 sm:pb-14 sm:pt-3 md:grid-cols-[1fr_1.5fr] md:gap-x-16 md:pb-20 md:pt-9">
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow">Free quote</p>
          <h1 className="h-page mt-3">
            <span className="text-brand">Let’s talk</span> about your car.
          </h1>
          <p className="mt-4 text-[18px] sm:mt-5 sm:text-[20px]">
            Tell us what you’ve got and we’ll text or call you with a price,
            usually within the hour.
          </p>
        </div>
        <div
          id="quote"
          data-quote
          className="quote-box min-w-0 scroll-mt-32 self-start md:col-start-2 md:row-span-2 md:row-start-1"
        >
          <QuoteFormHeading className="h-sub quote-head" />
          <GoogleReviewsSignal />
          <QuoteForm />
          <QuoteTrustLine className="mt-4" />
        </div>
        <div className="md:col-start-1 md:row-start-2">
          <ul className="space-y-3">
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
      </section>
    </>
  );
}
