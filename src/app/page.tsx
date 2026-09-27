import Image from "next/image";
import Link from "next/link";
import {
  AreasGrid, AskForPrice, CallUsAndTerms, ConditionChips, Faq, FinalCta, HowItWorks, MakesRow, ReviewsBand, SectionHead,
  ServiceTiles, TrustStrip,
} from "@/components/Blocks";
import { Hero } from "@/components/Hero";
import { CheckIcon } from "@/components/icons";
import { faqs, site } from "@/lib/site";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const removalTypes = [
  { title: "Scrap car removal", text: "End-of-life vehicles collected and recycled, however old or rusty.", href: "/scrap-car-removal" },
  { title: "Accident car removal", text: "Repairs cost more than the car is worth? We buy crashed cars as they are." },
  { title: "Damaged car removal", text: "Flood, hail and fire-damaged vehicles removed and paid for." },
  { title: "Junk car removal", text: "Whether it stopped last week or last decade, we'll collect it." },
  { title: "Used car removal", text: "Skip the trade-in lowball and get a fair cash price for your used car." },
  { title: "Ute, van & 4WD removal", text: "Work vehicles, 4WDs and light trucks — single vehicles or whole fleets." },
];

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <TrustStrip />

      <section className="py-16 sm:py-20">
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead center={false} eyebrow="Cash for cars Gold Coast & Brisbane" title="Free car removal. Real cash. Zero hassle." />
            <div className="prose-site mt-2 text-[17px]">
              <p>
                Got a broken, old, unwanted, crashed or scrap car you need gone? {site.name} makes it simple: one call, a fair
                cash offer, and a free tow away at a time that suits you. We buy <Link href="/cash-for-cars">cars for cash</Link>{" "}
                right across the Gold Coast, Brisbane, Logan, Ipswich, the Sunshine Coast and the Tweed.
              </p>
              <p>
                Unlike junkyards that charge you to take a car away, <Link href="/car-removals">our car removal</Link> is free and we
                pay you for it. Every vehicle has value in its parts and metal, and we pass that value on to you.
              </p>
            </div>
            <h3 className="mt-8 font-heading text-xl font-bold uppercase text-navy">We accept cars in any condition</h3>
            <ConditionChips />
          </div>
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-3xl bg-brand" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image src="/images/cash.jpg" alt="Australian banknotes" fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 rounded-2xl bg-navy px-6 py-4 text-white shadow-xl">
              <p className="font-heading text-3xl font-extrabold text-brand-light">$0</p>
              <p className="text-sm font-semibold">towing fees — ever</p>
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <ServiceTiles />

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-site">
          <SectionHead eyebrow="Every kind of vehicle" title="Car removal services we offer" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {removalTypes.map((r) => (
              <li key={r.title} className="card flex gap-4 p-6">
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand text-white"><CheckIcon className="h-5 w-5" /></span>
                <span>
                  <span className="block font-heading text-xl font-bold uppercase text-navy">{r.title}</span>
                  <span className="mt-1 block text-[15px]">{r.text}</span>
                  {r.href && <Link href={r.href} className="mt-2 inline-block text-sm font-semibold text-brand-dark hover:underline">Learn more →</Link>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AreasGrid />
      <ReviewsBand />

      <section className="py-16 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Faq />
          <div className="lg:pt-24">
            <CallUsAndTerms stacked />
          </div>
        </div>
      </section>

      <AskForPrice />
      <MakesRow />
      <FinalCta />
    </>
  );
}
