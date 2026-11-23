import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import {
  BrisbaneCashForCars,
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
import { ReviewsBand } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { brisbaneSuburbs, faqs, pageOpenGraph, site } from "@/lib/site";

export const metadata: Metadata = {
  // The home page shares the root layout's route segment, so the title template does not apply here.
  title: {
    absolute: "Cash for Cars Brisbane | 1800-CASH-FOR-CARS",
  },
  description:
    "Cash for cars Brisbane: we buy scrap, old and unwanted cars in any condition. Free car removal, usually within a day or two, and you're paid on pickup.",
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/"),
};

// Brisbane questions first, then the general ones.
const homeFaqs = [
  {
    q: "Who pays the most cash for cars in Brisbane?",
    a: "Compare a few quotes, and check whether towing comes off the price. We buy, wreck and recycle cars from our own Rocklea yard, so we can pay for usable parts as well as the metal, and our towing is always free.",
  },
  {
    q: "Do you buy cars all over Brisbane?",
    a: "Yes. Northside, southside, the western suburbs and the bayside, plus Logan and Ipswich. Our yard is in Rocklea, so Brisbane pickups are usually within a day or two.",
  },
  {
    // A hand-off, not a target. The scrap car removal page owns this search and the price guide owns the ranges.
    q: "Do you pay cash for scrap cars in Brisbane?",
    a: "Yes. In Queensland, including Brisbane, you can choose cash or bank transfer, paid before the car leaves. Towing is free and never deducted. How we collect the car and pay you is on the cash for scrap cars in Brisbane page, and the guide ranges are on scrap car prices in Brisbane.",
    links: [
      { phrase: "cash for scrap cars in Brisbane", href: "/scrap-car-removal" },
      { phrase: "scrap car prices in Brisbane", href: "/scrap-car-prices-brisbane" },
    ],
  },
  ...faqs,
];

// Home page only. Google reads this WebSite node for the site name on every result.
const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  alternateName: site.domain,
  url: `${site.url}/`,
  publisher: { "@id": `${site.url}/#business` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map((f) => ({
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
    ...brisbaneSuburbs.flatMap((g) => g.suburbs.map((name) => ({ "@type": "Place", name: `${name}, QLD` }))),
  ],
  offers: { "@type": "Offer", priceCurrency: "AUD", description: "Free quote, free car removal and payment on pickup" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={websiteLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
      <Hero title="Cash for cars Brisbane." />
      <HomeServices />
      <PickupSection />
      <BrisbaneCashForCars />
      <QuoteOptions />
      <SellerSection />
      <VehicleGallery />
      <WhyChooseSection />
      <ReviewsBand />
      <ProcessStrip />
      <SellingAdvice />
      <HomeFaq items={homeFaqs} />
      <HomeAreas />
    </>
  );
}
