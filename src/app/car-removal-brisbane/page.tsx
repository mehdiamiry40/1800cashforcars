import type { Metadata } from "next";
import Link from "next/link";
import { BrisbaneSuburbs, ContentBlocks, Faq, RelatedLinks } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { brisbaneSuburbs, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Car Removal Brisbane | Free Pickup, Cash Paid | 1800-CASH-FOR-CARS" },
  description:
    "Free car removal Brisbane wide. We pick up scrap, old and unwanted cars, pay you before they leave and tow them free. Same-day pickups from our Rocklea yard.",
  alternates: { canonical: "/car-removal-brisbane" },
  openGraph: { url: "/car-removal-brisbane" },
};

const faqs = [
  {
    q: "Is car removal in Brisbane really free?",
    a: "Yes. We don't charge for pickup or towing anywhere in Brisbane, and we don't take it off the price we pay you.",
  },
  {
    q: "How quickly can you remove my car?",
    a: "We're based in Rocklea, so most Brisbane pickups happen the same day or the next day. You pick the time.",
  },
  {
    q: "Can you remove a car that doesn't run?",
    a: "Yes. Dead battery, blown engine, flat tyres or no keys, we bring a tilt tray and winch it on.",
  },
  {
    q: "Do you pay for the car, or just take it away?",
    a: "We pay you. Cash or bank transfer, before the car leaves. Even scrap cars are worth something in parts and metal.",
  },
  {
    q: "Does the car need to be registered?",
    a: "No. We remove unregistered cars and cars that wouldn't pass a roadworthy. Just have your photo ID and proof you own it.",
  },
  {
    q: "How much does car removal cost in Brisbane?",
    a: "Nothing. Some removal companies charge a towing fee or take it off your price. We don't do either: the tow is free, and we pay you for the car.",
  },
  {
    q: "Can you remove a car with no keys or no papers?",
    a: "No keys is fine, we winch it on. If you've lost the rego papers, tell us when you ask for a price. We still need to see photo ID and be sure the car is yours, but we can usually sort it out.",
  },
  {
    q: "What happens to my car after it's removed?",
    a: "It comes back to our Rocklea yard. Fluids are drained and disposed of properly, usable parts are pulled and resold, and the shell goes to a metal recycler.",
  },
  {
    q: "What should I do with the rego after you take the car?",
    a: "Cancel the registration with Transport and Main Roads (you can do it online) and you may get a refund for the time left. We'll give you a receipt for your records.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Car removal",
  name: "Car Removal Brisbane",
  description: "Free car removal across Brisbane. We pay for scrap, old and unwanted cars and tow them away at no cost.",
  provider: { "@id": `${site.url}/#business` },
  areaServed: [
    { "@type": "City", name: "Brisbane" },
    ...brisbaneSuburbs.flatMap((g) => g.suburbs.map((name) => ({ "@type": "Place", name: `${name}, QLD` }))),
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD", description: "Free pickup and towing" },
};

export default function CarRemovalBrisbane() {
  return (
    <PageShell
      title="Car removal Brisbane"
      path="/car-removal-brisbane"
      intro="Free pickup across Brisbane. Paid before your car leaves."
      roo={{ pouchCar: true, hop: true }}
    >
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
      <div className="prose-site mb-10 text-[18px] [&>p:first-child]:mt-0">
        <p>
          Need an old, broken or unwanted car gone? We offer free car removal right across Brisbane, and we pay you for the
          car as well. Scrap cars, wrecks, crashed cars, cars that don&apos;t run and cars without rego: we tow them all
          away at no cost, usually the same day you call.
        </p>
        <p>
          We&apos;re a local Brisbane business with our own yard in Rocklea, so you deal with the people who actually
          pick up the car. Call <a href={site.phoneHref}>{site.phoneDisplay}</a> or get a free quote online.
        </p>
      </div>
      <ContentBlocks
        blocks={[
          {
            heading: "Free car removal, anywhere in Brisbane",
            summary: "From your driveway, work, mechanic or the roadside.",
            icon: "truck",
            paras: [
              "Our yard is in Rocklea, on Brisbane's southside, so we can get a tow truck or tilt tray to most Brisbane suburbs the same day. We'll collect the car from your driveway, the street, a workshop, a car park or the side of the road.",
              "Car removal is always free. On top of that, we pay you for the car, even if it's only fit for scrap.",
            ],
          },
          {
            heading: "Cars we remove",
            summary: "Running or not, registered or not. We buy all conditions.",
            icon: "car",
            list: [
              { bold: "Scrap and wrecked cars", text: "rusted out, stripped or sitting in the yard for years." },
              { bold: "Crashed and written-off cars", text: "insurance write-offs and accident damage." },
              { bold: "Cars that don't run", text: "flat battery, blown engine, flat tyres or no keys." },
              { bold: "Unregistered cars", text: "no rego and no roadworthy is fine." },
              { bold: "Flood and hail damaged cars", text: "we'll take them as they are." },
              { bold: "Utes, vans, 4WDs and trucks", text: "see cash for trucks for bigger vehicles." },
            ],
          },
          {
            heading: "How Brisbane car removal works",
            summary: "Get a quote, choose a time, and get paid on pickup.",
            icon: "cash",
            list: [
              { bold: "Get a quote", text: "fill in the quick form with the car's details (or call us) and we'll text you a price." },
              { bold: "Book a time", text: "same day or whenever suits you, Monday to Saturday." },
              { bold: "Get paid, we tow it", text: "cash or bank transfer before the car leaves, and the tow is free." },
            ],
          },
          {
            heading: "Why our car removal is free",
            summary: "We make our money from parts and metal, not towing fees.",
            icon: "recycle",
            paras: [
              "We wreck and recycle the cars we collect, so a car is worth something to us even when it doesn't run. That's why we can tow it away for free and still pay you for it, instead of charging a removal fee.",
              "Back at the yard, fluids are drained and disposed of properly, working parts are pulled and resold, and the rest goes to a metal recycler. Your old car doesn't end up dumped or sitting in landfill.",
            ],
          },
          {
            heading: "Car removal anywhere in Brisbane",
            summary: "Northside, southside, west and bayside, Monday to Saturday.",
            icon: "truck",
            paras: [
              "From Rocklea we reach the southside suburbs like Moorooka, Sunnybank and Mt Gravatt quickly, and we cover the northside (Chermside, Aspley, Nundah), the western suburbs (Indooroopilly, Kenmore, Forest Lake) and the bayside (Wynnum, Manly, Carindale) too.",
              "Tell us where the car is and about any tight access, like a steep driveway, a basement car park or a car in the backyard, and we'll bring the right truck.",
            ],
          },
        ]}
      />

      <div className="mt-12">
        <h2 className="h-content">Brisbane suburbs we cover</h2>
        <p className="mt-3">
          Brisbane, plus Logan and Ipswich. Select a region for suburbs. Southside pickups continue{" "}
          <Link href="/locations/logan" className="font-semibold text-navy underline underline-offset-2">
            heading south into Logan
          </Link>
          . From Oxley, Darra, Inala and Forest Lake we also collect{" "}
          <Link href="/locations/ipswich" className="font-semibold text-navy underline underline-offset-2">
            further west into Ipswich
          </Link>
          .
        </p>
        <BrisbaneSuburbs narrow />
      </div>

      <div className="mt-12">
        <h2 className="h-content">Car removal Brisbane FAQs</h2>
        <div className="mt-6">
          <Faq bare items={faqs} />
        </div>
      </div>

      <p className="mt-10 text-[17px]">
        Want to know what your car is worth first? See{" "}
        <Link href="/" className="font-bold text-navy underline underline-offset-2">cash for cars Brisbane</Link>, or check out{" "}
        <Link href="/truck-removal" className="font-bold text-navy underline underline-offset-2">cash for trucks</Link>.
      </p>
      <RelatedLinks current="/car-removal-brisbane" />
    </PageShell>
  );
}
