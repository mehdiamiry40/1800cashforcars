import type { Metadata } from "next";
import { QuoteLink } from "@/components/QuoteLink";
import { AreasGrid, Faq, FinalCta, HowItWorks, MakesRow, ReviewsBand, WhatWeBuy } from "@/components/Blocks";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { ChevronRight, QuoteIcon } from "@/components/icons";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Cash for Cars Brisbane | Free Car Removal | 1-800-CASH-FOR-CARS" },
  description:
    "Cash for cars Brisbane: we pay cash for scrap, old and unwanted cars in any condition, with free car removal across Brisbane and SEQ. Based in Rocklea.",
  alternates: { canonical: "/" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cash for cars",
  name: "Cash for Cars Brisbane",
  description: "We buy scrap, old, damaged and unwanted cars for cash across Brisbane, with free car removal.",
  provider: { "@id": `${site.url}/#business` },
  areaServed: [{ "@type": "City", name: "Brisbane" }, { "@type": "State", name: "Queensland" }],
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
      <Hero
        title="Cash for cars Brisbane."
        lead="Any car. Any condition."
        sub="Free pickup across Brisbane and South East QLD. Paid on pickup."
      />
      <HowItWorks />
      <WhatWeBuy />

      <AreasGrid showBrisbane />
      <ReviewsBand />

      <section id="faq" className="section-site scroll-mt-24 border-y border-line bg-sand">
        <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <QuoteIcon aria-hidden="true" className="mb-5 h-16 w-16 text-brand" strokeWidth={1.5} />
            <h2 className="h-section">Your questions, answered</h2>
            <p className="mt-4 text-[17px]">
              Need a hand?{" "}
              <QuoteLink from="faq" className="font-bold text-brand underline underline-offset-2">
                Get a free quote
              </QuoteLink>
              .
            </p>
          </div>
          <div>
            <Faq bare limit={4} />
            <details className="group/more-faq mt-3 border border-line bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15px] font-semibold text-navy">More questions <ChevronRight aria-hidden="true" className="h-4 w-4 text-brand transition-transform group-open/more-faq:rotate-90" /></summary>
              <div className="mt-4"><Faq bare items={faqs.slice(4)} /></div>
            </details>
          </div>
        </div>
      </section>

      <MakesRow />
      <FinalCta />
    </>
  );
}
