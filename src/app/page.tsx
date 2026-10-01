import type { Metadata } from "next";
import Link from "next/link";
import { QuoteLink } from "@/components/QuoteLink";
import { AreasGrid, BrisbaneSuburbs, Faq, FinalCta, HowItWorks, MakesRow, ReviewsBand, SectionHead, WhatWeBuy } from "@/components/Blocks";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Cash for Cars Brisbane | Free Car Removal | 1800 Cash For Cars" },
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
        title="Cash for Cars Brisbane."
        lead="Any car. Any condition."
        sub="Scrap, old, broken or rusted out. We pay cash for it and tow it away free, anywhere in Brisbane and South East QLD."
      />
      <HowItWorks />
      <WhatWeBuy />

      <section className="py-16 sm:py-24">
        <div className="container-site">
          <SectionHead
            title="Cash for cars across Brisbane"
            intro="We're based in Rocklea, so we get to most Brisbane suburbs the same day. North, south, east or west, we'll pay cash for your car and tow it away free."
          />
          <BrisbaneSuburbs />
          <p className="mt-8 text-center">
            Just need it gone? See{" "}
            <Link href="/car-removal-brisbane" className="font-bold text-brand underline underline-offset-2">
              free car removal Brisbane
            </Link>
            .
          </p>
        </div>
      </section>

      <AreasGrid />
      <ReviewsBand />

      <section id="faq" className="scroll-mt-24 bg-sand py-16 sm:py-24">
        <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className="h-section">Questions?</h2>
            <p className="mt-3 text-[18px]">
              Quick answers here. Still unsure?{" "}
              <QuoteLink from="faq" className="font-bold text-brand underline underline-offset-2">
                Get a free price
              </QuoteLink>
              , no obligation.
            </p>
          </div>
          <Faq bare limit={6} />
        </div>
      </section>

      <MakesRow />
      <FinalCta />
    </>
  );
}
