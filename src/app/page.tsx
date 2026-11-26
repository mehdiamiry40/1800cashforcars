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
import { JsonLd, websiteNode } from "@/components/JsonLd";
import { brisbaneSuburbs, faqs, pageOpenGraph, site } from "@/lib/site";

export const metadata: Metadata = {
  // The home page shares the root layout's route segment, so the title template does not apply here.
  title: {
    absolute: "Cash for Cars Brisbane | 1800-CASH-FOR-CARS",
  },
  // "Free car removal" and "scrap cars" are left to the pages that own those searches.
  description:
    "Cash for cars Brisbane: we buy cars, utes, vans and 4WDs in any condition. Firm price usually within the hour, free pickup, paid before the car leaves.",
  alternates: { canonical: "/" },
  openGraph: pageOpenGraph("/"),
};

// Brisbane questions first, then the general ones. The answers are plain text: the visible list links
// the phrases in `links`, and the FAQ schema below uses the same sentences.
const homeFaqs = [
  {
    // The step-by-step version belongs to /cash-for-cars, so this answer is short and hands off.
    q: "How does cash for cars work in Brisbane?",
    a: "Tell us the make, model, year and condition of the car. We send a firm price, usually within the hour. If you accept it, we collect the car from your address, usually within a day or two, and pay you in cash or by bank transfer before it leaves. The pickup is free. Each step is set out on sell your car for cash in Brisbane.",
    links: [{ phrase: "sell your car for cash", href: "/cash-for-cars" }],
  },
  {
    q: "Who pays the most cash for cars in Brisbane?",
    a: "Compare a few quotes, and check whether towing comes off the price. We buy, wreck and recycle cars from our own Rocklea yard, so we can pay for usable parts as well as the metal, and our towing is always free.",
  },
  {
    q: "Is the price you quote the price I get?",
    a: "Yes, when the car is as you described it. Tell us about any damage and anything that is missing when you ask, and the price we quote is the price we pay. Nothing comes off for towing.",
  },
  {
    q: "Do you buy cars all over Brisbane?",
    a: "Yes. Northside, southside, the western suburbs and the bayside, plus Logan and Ipswich. Our yard is in Rocklea, so Brisbane pickups are usually within a day or two.",
    links: [
      { phrase: "Logan", href: "/locations/logan" },
      { phrase: "Ipswich", href: "/locations/ipswich" },
    ],
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
  {
    // Another hand-off. AutoVal owns the valuation searches.
    q: "Can I get a valuation before I ask for a cash offer?",
    a: "Yes. AutoVal is our free car valuation for Brisbane and Queensland cars. It estimates private-sale, trade-in and dealer prices for a car you could still advertise. That estimate is not our cash offer. For a damaged, non-running or scrap car, ask us for a quote instead.",
    links: [{ phrase: "free car valuation", href: "/autoval" }],
  },
  ...faqs,
];

// Google reads this WebSite node on the home page for the site name on every result.
const websiteLd = { "@context": "https://schema.org", ...websiteNode };

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
  "@id": `${site.url}/#service`,
  serviceType: "Cash for cars",
  name: "Cash for Cars Brisbane",
  description:
    "We buy scrap, old, damaged and unwanted cars for cash across Brisbane, with free car removal.",
  url: `${site.url}/`,
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
      {/* The "cash for cars Brisbane" copy comes straight after the service links, ahead of the towing section. */}
      <BrisbaneCashForCars />
      <PickupSection />
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
