import type { Metadata } from "next";
import Link from "next/link";
import { BrisbaneSuburbs, ContentBlocks, Faq } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Car Removal Brisbane | Free Scrap Car Removal | 1800 Cash For Cars" },
  description:
    "Free car removal Brisbane wide. We pick up scrap, old, broken and unwanted cars, pay you cash on the spot and tow them away free. Same-day pickups from Rocklea.",
  alternates: { canonical: "/car-removal-brisbane" },
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
  areaServed: { "@type": "City", name: "Brisbane" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "AUD", description: "Free pickup and towing" },
};

export default function CarRemovalBrisbane() {
  return (
    <PageShell
      title="Car Removal Brisbane"
      path="/car-removal-brisbane"
      intro="Free car removal anywhere in Brisbane. We pick up scrap, old and unwanted cars, pay you on the spot, and tow them away at no cost."
      roo={{ pouchCar: true, hop: true }}
    >
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
      <ContentBlocks
        blocks={[
          {
            heading: "Free car removal, anywhere in Brisbane",
            paras: [
              "Our yard is in Rocklea, on Brisbane's southside, so we can get a tow truck or tilt tray to most Brisbane suburbs the same day. We'll collect the car from your driveway, the street, a workshop, a car park or the side of the road.",
              "Car removal is always free. On top of that, we pay you for the car, even if it's only fit for scrap.",
            ],
          },
          {
            heading: "Cars we remove",
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
            list: [
              { bold: "Get a price", text: "call us, text a photo, or send the form below." },
              { bold: "Book a time", text: "same day or whenever suits you, 7 days." },
              { bold: "Get paid, we tow it", text: "cash or bank transfer before the car leaves, and the tow is free." },
            ],
          },
        ]}
      />

      <div className="mt-12">
        <h2 className="font-heading text-[28px] font-extrabold leading-tight text-ink sm:text-[32px]">Brisbane suburbs we cover</h2>
        <p className="mt-3 text-[18px]">We cover all of Brisbane, plus Logan and Ipswich. Here are some of the suburbs we pick up from most:</p>
        <BrisbaneSuburbs narrow />
      </div>

      <div className="mt-12">
        <h2 className="font-heading text-[28px] font-extrabold leading-tight text-ink sm:text-[32px]">Car removal Brisbane FAQs</h2>
        <div className="mt-6">
          <Faq bare items={faqs} />
        </div>
      </div>

      <p className="mt-10 text-[18px]">
        Want to know what your car is worth first? See{" "}
        <Link href="/" className="font-bold text-brand underline underline-offset-2">cash for cars Brisbane</Link>, or check out{" "}
        <Link href="/truck-removal" className="font-bold text-brand underline underline-offset-2">cash for trucks</Link>.
      </p>
    </PageShell>
  );
}
