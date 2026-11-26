import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { plainText } from "@/lib/plain-text";
import { areaHref, areas, pageOpenGraph, site } from "@/lib/site";

const PATH = "/about";

export const metadata: Metadata = {
  title: "About Us, Our Rocklea Yard",
  description:
    `${site.name} is part of A Plus Car Removal and shares the Rocklea yard. Free towing, paid before the car leaves, cash offers across South East QLD.`,
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${site.url}${PATH}#webpage`,
  name: "About Us, Our Rocklea Yard",
  url: `${site.url}${PATH}`,
  about: { "@id": `${site.url}/#business` },
};

const linkClass = "font-semibold text-navy underline underline-offset-4";

// The page is ten questions, each with its answer. `answer` is the paragraph under the heading. The FAQ
// schema takes its words from that same paragraph, so the markup cannot say anything the page does not.
// `more` is whatever else sits under the answer. It is on the page and not in the schema.
const questions: { q: string; answer: ReactNode; more?: ReactNode }[] = [
  {
    q: `Who is ${site.name}?`,
    answer: (
      <>
        {site.name} is the name on this website. It is part of{" "}
        <a href={site.parentUrl} className={linkClass}>
          A Plus Car Removal
        </a>
        , and the two share a yard rather than working from separate sites. When the yard is looked up on Google, the listing is published as A Plus Car Removal. That is the parent business. Selling a car through this site still means dealing with that Rocklea yard.
      </>
    ),
  },
  {
    q: "Are you licensed?",
    answer: (
      <>
        {site.licenceLine} The licence belongs to the parent company. {site.name} does not hold that dealer licence in its own name. The ABN for {site.name} is {site.abn}.
      </>
    ),
  },
  {
    q: "Where is your yard?",
    answer: (
      <>
        The shared yard is at{" "}
        <a href={site.mapsUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
          {site.address}
        </a>
        . Rocklea sits on Brisbane&apos;s southside. Brisbane, Logan and Ipswich collections are usually within a day or two. Visits are to this address.
      </>
    ),
    more: (
      <p className="mt-2 text-[18px]">
        <a href={site.mapsUrl} className={`inline-flex min-h-11 items-center ${linkClass}`} target="_blank" rel="noopener noreferrer">
          Get directions
        </a>
      </p>
    ),
  },
  {
    q: "What do you buy?",
    answer: (
      <>
        Scrap cars, old cars and damaged cars. Utes, vans and trucks as well. A car can be running or not, and it can be unregistered. It can have no keys, or no wheels, or both. Say what is missing when you ask for a price. The detail is on the{" "}
        <Link href="/car-removal-no-keys-no-wheels" className={linkClass}>
          no keys or no wheels
        </Link>{" "}
        page.
      </>
    ),
  },
  {
    q: "How do you work out a price?",
    answer: (
      <>
        Every car gets its own price. It depends on the make, model, year and condition, and on what the parts and the scrap metal are worth at the time. There is no single figure that covers every car. For scrap and non-running cars, the guide is the{" "}
        <Link href="/scrap-car-prices-brisbane" className={linkClass}>
          scrap car prices in Brisbane
        </Link>{" "}
        page. Those ranges are a guide. The firm price is the one we send for your car. Towing is not taken off that price.
      </>
    ),
    more: (
      <p className="mt-4 text-[18px] leading-relaxed">
        If you want a market estimate before you ask for a cash offer, you can{" "}
        <Link href="/autoval" className={linkClass}>
          check what your car is worth
        </Link>
        . That estimate is not an offer from us. The offer is the price we send after you tell us about the car.
      </p>
    ),
  },
  {
    q: "Is the towing really free?",
    answer:
      "Yes. Towing is always free, and it is never deducted. We do not add a removal fee, and we do not charge by the kilometre inside the areas we cover. The quoted amount is the amount paid when the car matches what you told us. Free towing applies to scrap and damaged cars as well as to cars that still run.",
  },
  {
    q: "How do you pay?",
    answer:
      "Cash or bank transfer, and the payment happens before the car leaves. You get a receipt. In Queensland you choose cash or a transfer. In NSW, including Tweed Heads, the law does not allow cash for scrap vehicles, so payment there is by bank transfer only. Bring bank details if the car is on that side of the border.",
  },
  {
    q: "How fast can you pick up?",
    answer:
      "Pickups are usually within a day or two. You choose the time. Quotes are usually within the hour. Collections run Monday to Saturday. Brisbane, Logan and Ipswich are the closest runs to Rocklea. The Sunshine Coast and the Tweed are booked with you on that same timing.",
  },
  {
    q: "Which areas do you cover?",
    answer:
      "Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. Each area has its own page. Brisbane removal is written up as free car removal. The others explain the local run, including bank transfer in the Tweed.",
    more: (
      // Each link is a 44px row, so the six are easy to tap apart on a phone.
      <ul className="mt-2 text-[18px]">
        {areas.map((area) => (
          <li key={area.slug}>
            <Link href={areaHref(area)} className={`inline-flex min-h-11 items-center ${linkClass}`}>
              Cash for cars {area.name}
            </Link>
          </li>
        ))}
      </ul>
    ),
  },
  {
    q: "How do I contact you?",
    answer: (
      <>
        Call or text{" "}
        <a href={site.phoneHref} className={linkClass}>
          {site.phoneDisplay}
        </a>
        {site.showEmail ? (
          <>
            , or email{" "}
            <a href={`mailto:${site.email}`} className={linkClass}>
              {site.email}
            </a>
          </>
        ) : null}
        . The{" "}
        <Link href="/quote" className={linkClass}>
          quote form
        </Link>{" "}
        is the other way to ask for a price. Yard details, including how to get directions, are on the{" "}
        <Link href="/contact-us" className={linkClass}>
          contact page
        </Link>
        .
      </>
    ),
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${site.url}${PATH}#faq`,
  isPartOf: { "@id": `${site.url}${PATH}#webpage` },
  mainEntity: questions.map(({ q, answer }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: plainText(answer) },
  })),
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "About", path: PATH }]} />
      <JsonLd data={aboutLd} />
      <JsonLd data={faqLd} />
      {/* TODO(owner): yard, truck and team photos, a founding year, and reviews you are allowed to quote. */}
      <article className="container-site section-site max-w-3xl">
        <p className="eyebrow">About us</p>
        <h1 className="h-page mt-3">About our Rocklea yard</h1>
        <p className="mt-5 text-[18px] leading-relaxed">
          {site.name} buys scrap, old and damaged cars, and it also buys utes, vans and trucks. The business is part of A Plus Car Removal. Both names use the same yard, at{" "}
          <a href={site.mapsUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
            {site.address}
          </a>
          .
        </p>

        {questions.map(({ q, answer, more }) => (
          <Fragment key={q}>
            <h2 className="h-content mt-12">{q}</h2>
            <p className="mt-4 text-[18px] leading-relaxed">{answer}</p>
            {more}
          </Fragment>
        ))}
      </article>
    </>
  );
}
