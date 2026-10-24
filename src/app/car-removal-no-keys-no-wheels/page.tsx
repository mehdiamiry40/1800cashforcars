import type { Metadata } from "next";
import Link from "next/link";
import { QuoteForm } from "@/components/QuoteForm";
import { Breadcrumbs, JsonLd, ServiceLd } from "@/components/JsonLd";
import { areaHref, areas, pageOpenGraph, site } from "@/lib/site";

const PATH = "/car-removal-no-keys-no-wheels";

export const metadata: Metadata = {
  title: "Car Removal With No Keys or No Wheels",
  description:
    "We buy cars with no keys or no wheels across Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. Free towing, never deducted, paid before the car leaves.",
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

const faqs = [
  {
    q: "Do you buy a car with no keys?",
    a: "Yes. A missing key does not stop the purchase. Say so when you ask for a price, so the quote matches that car. Photo ID and proof it is yours are still required. The tow is free and is never deducted, and payment happens before the car leaves.",
  },
  {
    q: "Do you buy a car with no wheels?",
    a: "Yes. A car that cannot roll is still bought. Say how many wheels are missing, and whether it is at home, at a workshop, or where it has been sitting. Towing stays free. Queensland payment is cash or bank transfer. In NSW, including Tweed Heads, it is bank transfer only, and it happens before the car leaves.",
  },
  {
    q: "Is towing still free if the car has no keys or no wheels?",
    a: "Yes. The tow is free in Brisbane, on the Gold Coast, in Logan, Ipswich, on the Sunshine Coast and at Tweed Heads. A missing key or missing wheels does not add a fee, and that cost is never taken off the price.",
  },
  {
    q: "What do I need if the papers are missing too?",
    a: "Photo ID, such as a driver's licence or passport, and proof of ownership, like the rego papers. If you have lost the papers, tell us when you ask for a price. We still need to see photo ID and be sure the car is yours, and we can usually still sort it out.",
  },
  {
    q: "Will a missing key or missing wheels change the price?",
    a: "It can. Less to reuse, or a car that is harder to move, can mean a lower figure than the same car complete. There is no fixed deduction. Each quote uses what you tell us. Guide ranges sit on the scrap car prices page, and the tow is not taken off.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

const linkClass = "font-semibold text-navy underline underline-offset-4";

export default function NoKeysNoWheelsPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Car removal with no keys or no wheels", path: PATH }]} />
      <JsonLd data={faqLd} />
      <ServiceLd
        name="Car removal with no keys or no wheels"
        serviceType="Car removal"
        description="We buy and remove cars with no keys or no wheels. Towing is free and is never deducted. Payment is made before the car leaves."
        path={PATH}
        areaServed={areas.map((area) => `${area.name}, ${area.state}`)}
      />
      {/* TODO(owner): confirm how a car that cannot roll is loaded before describing any equipment. */}
      <article className="container-site section-site grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <div className="min-w-0 max-w-3xl">
          <p className="eyebrow">No keys, no wheels</p>
          <h1 className="h-page mt-3">Car removal with no keys or no wheels</h1>
          <p className="mt-5 text-[18px] leading-relaxed">
            Yes. 1800 Cash For Cars buys cars with no keys, cars with no wheels, and cars missing both. The car does not have to start, and it does not have to roll. Tell us what is missing and where the car is sitting. We still pay you for it, and the tow is free.
          </p>

          <h2 className="h-content mt-12">Do you buy cars with no keys?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            Yes. A key is useful when you still have one, and a sale does not depend on it. People lose keys, the only key can be locked inside, or a car has sat so long that nobody knows where it went. None of that is a reason to refuse the car. Mention the missing key so the price is for a car without one. A boot that will not open, or a steering lock you cannot undo, belongs in that same note. The quoted price holds when the car is as you described it.
          </p>

          <h2 className="h-content mt-12">Do you buy cars with no wheels?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            Yes. Wheels go missing from cars that have been sitting in a yard, a shed or on a block. A car up on bricks, a car with perished tyres, or a car with only some wheels left is still a car we can buy. It does not need to roll out to the street. Say how many wheels are missing, and whether it is in mud, on grass, or hard against a fence. A steep slope, a narrow side path, a backyard or a unit basement changes the plan for the visit. Those details do not add a removal fee. If you are unsure we can reach it, describe the spot and we will say so in the quote.
          </p>

          <h2 className="h-content mt-12">What do you need from me?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            Photo ID and proof of ownership. A driver&apos;s licence or passport covers the ID. Rego papers are the usual proof the car is yours. If those papers were lost with the keys, say so when you ask. We still need to see the ID and be satisfied the car is yours, and missing papers can usually be sorted. Bring any key you do have, and clear out belongings and a toll tag before we arrive.
          </p>
          <p className="mt-4 text-[18px] leading-relaxed">
            The car should not have finance owing. If it does, call {site.phoneDisplay} and we will talk about that car. This page does not set out a finance process. After collection, cancel the registration and the insurance. Queensland rego can be cancelled online with Transport and Main Roads, and unused time may be refunded. NSW rego is cancelled with Service NSW. You get a receipt.
          </p>

          <h2 className="h-content mt-12">Is the towing free?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            Yes. Towing is always free, and it is never deducted from the price. That includes a car with no keys and a car with no wheels. We do not add a call-out fee because the car cannot move itself. The areas are Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. Outside those areas we do not offer this collection.
          </p>
          <p className="mt-4 text-[18px] leading-relaxed">
            Free car removal across Brisbane is written up on the{" "}
            <Link href="/car-removal-brisbane" className={linkClass}>
              free car removal Brisbane
            </Link>{" "}
            page. Scrap cars more generally, including rusty and incomplete ones, are on{" "}
            <Link href="/scrap-car-removal" className={linkClass}>
              scrap car removal
            </Link>
            . This page is only about cars that are missing keys, wheels, or both.
          </p>

          <h2 className="h-content mt-12">How do missing keys or wheels affect the price?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            Only in a qualitative way. A complete car is worth more than the same car with a key, a wheel or a corner already gone, because there is less to reuse. A car that cannot roll can also take more work to collect. There is no published dollar amount off for that. Make, model, year and the rest of the condition sit in the same individual quote.
          </p>
          <p className="mt-4 text-[18px] leading-relaxed">
            If you want the guide ranges for scrap and damaged cars before you ask, read{" "}
            <Link href="/scrap-car-prices-brisbane" className={linkClass}>
              scrap car prices in Brisbane
            </Link>
            . The ranges there are guides, not a quote for your car, and free towing is never taken off them. Photos help. If you can text a few of the car, the missing wheels, and where it is parked, the price we send is more likely to match the car on the day.
          </p>

          <h2 className="h-content mt-12">When do you pay, and how fast is pickup?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            We pay before the car leaves. In Queensland that is cash or bank transfer, your choice. In NSW, including Tweed Heads, the law does not allow cash for scrap vehicles, so it is bank transfer only. Have the account details with you if the car is in the Tweed. You get a receipt either way.
          </p>
          <p className="mt-4 text-[18px] leading-relaxed">
            Pickups are often the same day, and you choose the time. Brisbane, Logan and Ipswich are the short runs from Rocklea. Gold Coast jobs are often that day. Sunshine Coast and Tweed Heads visits are agreed with you, and Tweed jobs are often sooner. A price can come back very fast, sometimes in under a minute.
          </p>

          <h2 className="h-content mt-12">Where will you collect a car like this?</h2>
          <p className="mt-4 text-[18px] leading-relaxed">
            From the same places as any other car we buy. The yard we leave from is {site.address}, shared with A Plus Car Removal. {site.licenceLine} Home, work, a mechanic, a backyard or the roadside are all fine if we can reach the car. Put the suburb in the quote.
          </p>
          <ul className="mt-4 space-y-2 text-[18px]">
            {areas.map((area) => (
              <li key={area.slug}>
                <Link href={areaHref(area)} className={linkClass}>
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>

          <h2 className="h-content mt-12">Questions about cars with no keys or no wheels</h2>
          <div className="mt-6 divide-y divide-line">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-4">
                <h3 className="text-[20px] font-semibold text-navy">{faq.q}</h3>
                <p className="mt-2 text-[18px] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
        <div id="quote" data-quote className="min-w-0 scroll-mt-32 self-start lg:sticky lg:top-28">
          <h2 className="h-sub mb-6">Get a free quote</h2>
          <QuoteForm />
        </div>
      </article>
    </>
  );
}
