import Image from "next/image";
import Link from "next/link";
import {
  AskForPrice,
  CallUsAndTerms,
  Faq,
  MakesRow,
  ReviewsBand,
  ServiceTiles,
} from "@/components/Blocks";
import { HeroSlider } from "@/components/HeroSlider";
import { ArrowIcon, PinIcon } from "@/components/icons";
import { areas, faqs, site } from "@/lib/site";
import { heroSlides } from "@/lib/slides";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};
const steps = [
  {
    title: "Tell us about your car",
    text: "Share the make, model and condition online, or give us a call. No long forms or appointments.",
  },
  {
    title: "Choose what works for you",
    text: "Review your no-obligation offer. Happy with the price? We’ll arrange a convenient pickup time.",
  },
  {
    title: "Get paid. Get your space back.",
    text: "We confirm the details, pay you on collection and tow your car away. The towing is free.",
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />
      <HeroSlider slides={heroSlides()} />
      <section
        className="container-site py-14 sm:py-20"
        aria-labelledby="steps-title"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Less hassle. More driveway.</p>
            <h2 id="steps-title" className="h-section mt-3">
              Three steps. One less thing to worry about.
            </h2>
          </div>
        </div>
        <ol className="mt-9 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-line pt-5">
              <span className="font-heading text-3xl font-bold text-green">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-heading text-xl font-bold text-ink">
                {step.title}
              </h3>
              <p className="mt-3 text-sm">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <AskForPrice />
      <ServiceTiles />
      <section className="bg-band py-14 sm:py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <figure>
            <Image
              src="/images/vehicle-recycling.webp"
              alt="Illustration of an older white sedan beside neatly stored reusable wheels and car parts"
              width={1200}
              height={800}
              sizes="(max-width: 1023px) 100vw, 560px"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <figcaption className="mt-2 text-xs">
              AI-generated vehicle recycling illustration.
            </figcaption>
          </figure>
          <div className="prose-site">
            <p className="eyebrow">There’s value in moving on</p>
            <h2 className="h-section mt-3">Old car. New possibilities.</h2>
            <p>
              Got a broken, old, unwanted or accident-damaged car? {site.name}{" "}
              buys vehicles in any condition across the Gold Coast, Brisbane and
              South East Queensland.
            </p>
            <p>
              We arrange <Link href="/car-removals">free car removal</Link>,
              even if your vehicle doesn’t start. Usable parts get another life,
              and materials are recovered through vehicle recycling.
            </p>
            <p>
              Cars, utes, vans and 4WDs — registered or not. Tell us what you
              have and we’ll talk you through the next step.
            </p>
            <Link
              href="/car-wreckers"
              className="mt-5 inline-flex min-h-11 items-center gap-2"
            >
              Learn about car recycling <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <section
        id="areas"
        className="container-site py-14 sm:py-20"
        aria-labelledby="areas-title"
      >
        <p className="eyebrow">Local pickups, made simple</p>
        <h2 id="areas-title" className="h-section mt-3">
          From Brisbane to the coast. We come to you.
        </h2>
        <p className="mt-4">
          Free car removal across South East Queensland and Tweed Heads. Select
          your area for local details.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area.slug}>
              <Link
                href={`/locations/${area.slug}`}
                className="group flex h-full items-start gap-4 rounded-xl border border-line p-5 transition hover:border-green hover:bg-hero"
              >
                <PinIcon className="mt-1 h-6 w-6 shrink-0 text-green" />
                <span>
                  <span className="font-heading text-xl font-bold text-ink group-hover:underline">
                    {area.name}
                  </span>
                  <span className="mt-1 block text-sm">
                    {area.suburbs.slice(0, 3).join(", ")} &amp; surrounds
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <ReviewsBand />
      <section className="container-site py-14 sm:py-20">
        <Faq />
        <div className="mt-12 rounded-xl bg-band p-6 sm:p-8">
          <CallUsAndTerms />
        </div>
      </section>
      <section className="bg-hero py-12">
        <div className="container-site flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="h-section">Ready to make some space?</h2>
            <p className="mt-2">A fair offer and a free pickup start here.</p>
          </div>
          <Link href="#ask-for-our-price" className="btn-green">
            Get my free quote <ArrowIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>
      <MakesRow />
    </>
  );
}
