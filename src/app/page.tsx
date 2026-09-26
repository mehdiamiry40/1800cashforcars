import { Hero } from "@/components/Hero";
import { Areas, Faq, FinalCta, HowItWorks, TrustStrip, WhatWeBuy, WhyUs } from "@/components/Sections";
import { faqs } from "@/lib/site";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <WhatWeBuy />
      <WhyUs />
      <Areas />
      <Faq />
      <FinalCta />
    </>
  );
}
