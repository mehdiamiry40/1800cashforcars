import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import {
  HomeAreas,
  HomeFaq,
  HomeServices,
  PickupSection,
  ProcessStrip,
  QuoteOptions,
  SellerSection,
  SellingAdvice,
  VehicleGallery,
  WhyChooseSection,
} from "@/components/HomeSections";
import { JsonLd } from "@/components/JsonLd";
import { faqs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Cash for Cars Brisbane | Free Car Removal | 1-800-CASH-FOR-CARS",
  },
  description:
    "Cash for cars Brisbane: we pay cash for scrap, old and unwanted cars in any condition, with free car removal across Brisbane and SEQ. Based in Rocklea.",
  alternates: { canonical: "/" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Cash for cars",
  name: "Cash for Cars Brisbane",
  description:
    "We buy scrap, old, damaged and unwanted cars for cash across Brisbane, with free car removal.",
  provider: { "@id": `${site.url}/#business` },
  areaServed: [
    { "@type": "City", name: "Brisbane" },
    { "@type": "State", name: "Queensland" },
  ],
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
      <Hero title="Cash for cars Brisbane." />
      <HomeServices />
      <PickupSection />
      <QuoteOptions />
      <SellerSection />
      <VehicleGallery />
      <WhyChooseSection />
      <ProcessStrip />
      <SellingAdvice />
      <HomeFaq />
      <HomeAreas />
    </>
  );
}
