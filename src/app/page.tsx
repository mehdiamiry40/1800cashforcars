import Image from "next/image";
import Link from "next/link";
import {
  AreasGrid, AskForPrice, CallUsAndTerms, Faq, HowItWorks, MakesRow, ReviewsBand, SectionHead, ServiceTiles,
} from "@/components/Blocks";
import { Hero } from "@/components/Hero";
import { faqs, site } from "@/lib/site";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const conditions = [
  "Cars that don't start", "Crashed or written off", "Flood, hail or fire damage", "Unregistered",
  "Failed roadworthy", "High kilometres", "Rusted out or scrap", "Lost keys",
];

const priceFactors = [
  { bold: "Make, model and year", text: "Popular and newer models are worth more for resale and parts." },
  { bold: "Condition", text: "A car that runs is worth more, but we still pay for ones that don't." },
  { bold: "Parts", text: "A good engine, gearbox or panels can add a fair bit." },
  { bold: "Metal prices", text: "For cars at the end of the road, the scrap metal price sets the floor." },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <HowItWorks />

      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3]">
            <Image src="/images/cash.jpg" alt="Australian banknotes" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
          </div>
          <div>
            <SectionHead title="Cars we buy" />
            <div className="prose-site">
              <p>
                Pretty much anything. Cars, utes, vans, 4WDs and light trucks, from nearly new to completely stuffed. We buy{" "}
                <Link href="/cash-for-cars">cars for cash</Link> across the Gold Coast, Brisbane, Logan, Ipswich, the Sunshine
                Coast and the Tweed.
              </p>
            </div>
            <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {conditions.map((c) => (
                <li key={c} className="flex gap-2.5 text-ink before:mt-[0.6em] before:h-2 before:w-2 before:shrink-0 before:bg-brand before:content-['']">
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-6">
              Unlike a wrecking yard that charges you to take it, <Link href="/car-removals" className="font-semibold text-brand-dark underline underline-offset-2">our car removal</Link> is free. We pay you for the car.
            </p>
          </div>
        </div>
      </section>

      <ServiceTiles />

      <section className="bg-paper py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHead title="What decides your price" intro="Every car is different, so we price each one on its own. These are the main things we look at." />
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {priceFactors.map((f) => (
                <li key={f.bold} className="py-3.5"><b className="text-ink">{f.bold}.</b> {f.text}</li>
              ))}
            </ul>
            <p className="mt-5">
              The price we quote is the price we pay, as long as the car is as described. We don&apos;t take anything off for towing.
            </p>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-12">
            <CallUsAndTerms stacked />
          </div>
        </div>
      </section>

      <AreasGrid />
      <ReviewsBand />

      <section id="faq" className="scroll-mt-32 bg-paper py-16 sm:py-20">
        <div className="container-site grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <h2 className="h-section">Common questions</h2>
            <p className="mt-4 text-[19px]">
              Can&apos;t see yours? Call <a href={site.phoneHref} className="font-semibold text-brand-dark underline underline-offset-2">{site.phoneDisplay}</a> and
              ask.
            </p>
          </div>
          <Faq bare />
        </div>
      </section>

      <AskForPrice />
      <MakesRow />
    </>
  );
}
