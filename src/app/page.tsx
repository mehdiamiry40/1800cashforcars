import { AreasGrid, Faq, FinalCta, HowItWorks, MakesRow, ReviewsBand, WhatWeBuy } from "@/components/Blocks";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { faqs, site } from "@/lib/site";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <Hero />
      <HowItWorks />
      <WhatWeBuy />
      <AreasGrid />
      <ReviewsBand />

      <section id="faq" className="scroll-mt-24 bg-sand py-16 sm:py-24">
        <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className="h-section">Questions?</h2>
            <p className="mt-3 text-[18px]">
              Quick answers here, or <a href={site.phoneHref} className="font-bold text-brand underline underline-offset-2">call us</a>.
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
