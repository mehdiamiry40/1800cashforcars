import type { Metadata } from "next";
import Link from "next/link";
import { BrisbaneSuburbs, ContentBlocks, Faq, RelatedLinks } from "@/components/Blocks";
import { JsonLd } from "@/components/JsonLd";
import { heroLinkClass, PageShell } from "@/components/PageShell";
import { brisbaneSuburbs, pageOpenGraph, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Car Removal Brisbane, Cash Paid",
  description:
    "Free car removal in Brisbane: we collect scrap, old and unwanted cars and pay you before they leave. Pickups are usually within a day or two.",
  alternates: { canonical: "/car-removal-brisbane" },
  openGraph: pageOpenGraph("/car-removal-brisbane"),
};

const faqs = [
  {
    q: "Is car removal in Brisbane really free?",
    a: "Yes. We don't charge for pickup or towing anywhere in Brisbane, and we don't take it off the price we pay you.",
  },
  {
    q: "What does free car removal in Brisbane include?",
    a: "Free towing from the collection address anywhere in Brisbane, no deduction from the price, and payment in cash or by bank transfer before the car leaves. You still need photo ID and proof of ownership. Pickups are usually within a day or two.",
  },
  {
    q: "How quickly can you remove my car?",
    a: "We're based in Rocklea. Most Brisbane pickups are usually within a day or two. You pick the time.",
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
  {
    // Keeps the generic "free car removal" query honest about where the truck goes.
    q: "Do you offer free car removal outside Brisbane?",
    a: "Yes, in the rest of South East Queensland and just over the NSW border. From the same Rocklea yard we cover Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads. Towing is free in each of them. Payment over the border is by bank transfer only. We do not collect outside these areas.",
    links: [
      { phrase: "Logan", href: "/locations/logan" },
      { phrase: "Ipswich", href: "/locations/ipswich" },
      { phrase: "Gold Coast", href: "/locations/gold-coast" },
      { phrase: "Sunshine Coast", href: "/locations/sunshine-coast" },
      { phrase: "Tweed Heads", href: "/locations/tweed-heads" },
    ],
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
      title="Free car removal in Brisbane"
      path="/car-removal-brisbane"
      intro="Yes, car removal in Brisbane is free. We collect scrap, old and unwanted cars from across the city, the towing is never charged or taken off your price, and we pay you in cash or by bank transfer before the car leaves. Pickups are usually within a day or two from our Rocklea yard."
      introNote={
        <>
          Guide prices are on our{" "}
          <Link href="/scrap-car-prices-brisbane" className={heroLinkClass}>
            scrap car prices in Brisbane
          </Link>{" "}
          page.
        </>
      }
      roo={{ pouchCar: true, hop: true }}
    >
      <JsonLd data={faqLd} />
      <JsonLd data={serviceLd} />
      <div className="prose-site mb-10 text-[18px] [&>p:first-child]:mt-0">
        <p>
          Need an old, broken or unwanted car gone? We offer free car removal right across Brisbane, and we pay you for the
          car as well. Scrap cars, wrecks, crashed cars, cars that don&apos;t run and cars without rego: we tow them all
          away at no cost. Pickups are usually within a day or two.
        </p>
        <p>
          We&apos;re a local Brisbane business with our own yard in Rocklea, so you deal with the people who actually
          pick up the car. Call <a href={site.phoneHref}>{site.phoneDisplay}</a> or get a free quote online.
        </p>
      </div>
      <ContentBlocks
        blocks={[
          {
            heading: "Is car removal in Brisbane free?",
            summary: "Yes. Free car removal in Brisbane means no pickup fee, no call-out fee and nothing taken off the price. Towing is always free on the northside, the southside, in the west and on the bayside, not only near our Rocklea yard. We still pay you for the car, in cash or by bank transfer before it leaves, even when it is only fit for scrap. That case is covered on scrap car removal, and we also collect cars with no keys or no wheels. Pickups are usually within a day or two.",
            links: [
              { phrase: "scrap car removal", href: "/scrap-car-removal" },
              { phrase: "cars with no keys or no wheels", href: "/car-removal-no-keys-no-wheels" },
            ],
            icon: "truck",
            paras: [
              "Our yard is in Rocklea, on Brisbane's southside, so we can get a tow truck or tilt tray to most Brisbane suburbs, usually within a day or two. We'll collect the car from your driveway, the street, a workshop, a car park or the side of the road.",
              "Car removal is always free. On top of that, we pay you for the car, even if it's only fit for scrap.",
            ],
          },
          {
            heading: "Do you remove cars with no keys or no wheels?",
            summary: "Yes. A Brisbane car that is missing its keys, its wheels, or both is still bought. Tell us which when you ask for a price, so the right truck is sent. The car does not need to roll. The tow is free, and you are paid before the car leaves.",
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
            heading: "How fast can you collect a car in Brisbane?",
            summary: "Pickups are usually within a day or two. The yard is in Rocklea, on Brisbane's southside, and you set the time, Monday to Saturday. A firm price is usually within the hour.",
            icon: "cash",
            list: [
              { bold: "Get a quote", text: "fill in the quick form with the car's details (or call us) and we'll text you a price." },
              { bold: "Book a time", text: "usually within a day or two, Monday to Saturday, at a time that suits you." },
              { bold: "Get paid, we tow it", text: "cash or bank transfer before the car leaves, and the tow is free." },
            ],
          },
          {
            heading: "Why our car removal is free",
            summary: "Because the car itself has value. Even one that does not run is worth its metal, and the price we quote covers whatever else the vehicle is worth as it stands. That is why the tow is included and never taken off the price, and why there is no removal fee. Guide ranges are in the Brisbane scrap car price guide. A car at the end of its life is covered on cash for scrap cars.",
            links: [
              { phrase: "Brisbane scrap car price guide", href: "/scrap-car-prices-brisbane" },
              { phrase: "cash for scrap cars", href: "/scrap-car-removal" },
            ],
            icon: "recycle",
            paras: [
              "We wreck and recycle the cars we collect, so a car is worth something to us even when it doesn't run. That's why we can tow it away for free and still pay you for it, instead of charging a removal fee.",
              "Back at the yard, fluids are drained and disposed of properly, working parts are pulled and resold, and the rest goes to a metal recycler. Your old car doesn't end up dumped or sitting in landfill.",
            ],
          },
          {
            heading: "Car removal anywhere in Brisbane",
            summary: "Free car removal covers all four sides of Brisbane: the northside, the southside, the western suburbs and the bayside, Monday to Saturday. The suburb groups are listed below. Logan and Ipswich are separate cities served from the same Rocklea yard, and each has its own page. Car removal in Logan carries on south from the southside, and car removal in Ipswich carries on west from Oxley, Darra, Inala and Forest Lake.",
            links: [
              { phrase: "Car removal in Logan", href: "/locations/logan" },
              { phrase: "car removal in Ipswich", href: "/locations/ipswich" },
            ],
            icon: "truck",
            paras: [
              "From Rocklea we cover the southside suburbs like Moorooka, Sunnybank and Mt Gravatt, and we cover the northside (Chermside, Aspley, Nundah), the western suburbs (Indooroopilly, Kenmore, Forest Lake) and the bayside (Wynnum, Manly, Carindale) too.",
              "Tell us where the car is and about any tight access, like a steep driveway, a basement car park or a car in the backyard, and we'll bring the right truck.",
            ],
          },
        ]}
      />

      <div className="mt-12">
        <h2 className="h-content">Brisbane suburbs we cover</h2>
        {/* Logan and Ipswich are linked once, in "Car removal anywhere in Brisbane" above. */}
        <p className="mt-3">
          Select a region to see the suburbs. Toowong and the inner west have their own page:{" "}
          <Link href="/locations/toowong" className="font-semibold text-navy underline underline-offset-2">
            free car removal in Toowong
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
        A car with no keys or no wheels is still collected. Read{" "}
        <Link href="/car-removal-no-keys-no-wheels" className="font-bold text-navy underline underline-offset-2">car removal with no keys or no wheels</Link>.
        Want to know what your car is worth first? See{" "}
        <Link href="/" className="font-bold text-navy underline underline-offset-2">cash for cars Brisbane</Link>, or check out{" "}
        <Link href="/truck-removal" className="font-bold text-navy underline underline-offset-2">cash for trucks</Link>.
        The sale itself, step by step, is on{" "}
        <Link href="/cash-for-cars" className="font-bold text-navy underline underline-offset-2">sell your car for cash in Brisbane</Link>.
      </p>
      <RelatedLinks current="/car-removal-brisbane" />
    </PageShell>
  );
}
