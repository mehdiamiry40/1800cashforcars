import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { Roo } from "@/components/Roo";
import { CheckIcon } from "@/components/icons";
import { areas, pageOpenGraph, site } from "@/lib/site";
import { AutoValuer } from "./AutoValuer";

export const metadata: Metadata = {
  title: "Free Car Valuation | AutoVal",
  description:
    `Free car valuation by rego or VIN for Australian cars. AutoVal is an estimate, not a cash offer. Damaged and non-running cars can go to a ${site.name} quote.`,
  alternates: { canonical: "/autoval" },
  openGraph: pageOpenGraph("/autoval"),
};

const autovalFaqs = [
  {
    q: "Is AutoVal free?",
    a: "Yes. Looking up a rego, decoding a VIN and reading the estimate are free. You do not pay to see the result, and you do not have to sell the car to us afterwards.",
  },
  {
    q: "Do I need to sign up?",
    a: "No. There is no account and no login. Enter a number plate and the state, a VIN, or type the car's details yourself. That is the whole form.",
  },
  {
    q: "Does AutoVal work outside Queensland?",
    a: `The rego lookup accepts any Australian state or territory listed on the form. A cash offer from ${site.name} is only for Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. A car outside those areas can still be estimated here, and we cannot collect it.`,
  },
  {
    q: "Is the valuation an offer?",
    a: "No. AutoVal is an estimate, not an offer to buy the car. It uses a registration lookup or a VIN decode, then an estimate that searches current Australian listings and price guides. The condition is what you report yourself. A cash offer is a separate price we send after you describe the car.",
  },
  {
    q: "What if my car doesn't run?",
    a: "You can still run an estimate for a car that does not run. That figure is not a promise to buy it. For a damaged, non-running or scrap car, ask for a cash offer. The scrap car prices page has the guide ranges, and the quote form is where the offer starts. Towing on a cash offer is free and is never deducted.",
  },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: autovalFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function AutoValPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "AutoVal car valuation", path: "/autoval" }]} />

      <section className="relative overflow-hidden bg-navy text-white">
        <div className="container-site grid items-end gap-8 pb-28 pt-10 sm:pb-36 sm:pt-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-sans text-[14px] font-bold uppercase tracking-[0.14em] text-white">AutoVal · Free AI valuation</p>
            <h1 className="mt-4 font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
              What&apos;s your car <span className="text-white">really</span> worth?
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-white/85 sm:text-[20px]">
              Enter your rego, VIN or just the details. AutoVal checks live Australian listings and price guides, then
              shows what it&apos;s worth and what to fix before you sell.
            </p>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white sm:text-[18px]">
              For a scrap or wrecked car, see our{" "}
              <Link href="/scrap-car-prices-brisbane" className="font-semibold underline underline-offset-4">
                scrap car prices in Brisbane
              </Link>
              .
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[16px] font-semibold">
              {["Free, no sign-up", "Ready in about a minute", "Live Australian market data"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckIcon aria-hidden="true" className="h-5 w-5 text-white" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Roo hand="cash" className="mx-auto hidden h-56 w-auto md:block lg:h-64" />
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="sr-only">
        <Link href="/">Home</Link> › <span>AutoVal car valuation</span>
      </nav>

      <div className="container-site relative -mt-20 pb-16 sm:-mt-28 sm:pb-24">
        <AutoValuer />
      </div>

      <section className="container-site max-w-3xl pb-16 sm:pb-24">
        <h2 className="h-content">How AutoVal works</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          AutoVal is a free estimate for an Australian car. You can start with a number plate. Choose the state the car is registered in and AutoVal looks it up through a registration API, which fills in the make, model and other details the lookup returns. You can start with a VIN instead. That number is decoded so the form has a vehicle to value. You can also type the details yourself if you do not have a plate or a VIN handy, or if the lookup misses a variant.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          After the car is identified, AutoVal builds an estimate by searching current Australian listings and price guides. The search is there to see what similar cars are being advertised for, not to invent a market. You then say how the car is: kilometres, condition, service history and whether it has been in an accident. Those answers are yours. The tool does not inspect the car, and it does not visit it.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          The result is a guide to a private sale, a trade-in and a dealer price for a car in the condition you described. It is meant for someone who still might sell the car themselves. It is not a contract, and it is not the amount {site.name} will pay.
        </p>

        <h2 className="h-content mt-12">What it can&apos;t tell you</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          It is an estimate, not an offer. Condition is self-reported, so a car you describe as good will be estimated as good even if a buyer would mark it down. Rust, a noisy gearbox, a warning light or worn tyres only affect the figure if you include them. The tool cannot see photos and it cannot drive the car.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          A registration lookup can miss a variant, and a VIN decode can miss the exact model sold in Australia. You can correct the details before the estimate runs. If listings for that car are thin, the estimate has less to go on. None of this is a promise that the car will sell for the figure on the screen.
        </p>

        <h2 className="h-content mt-12">How does a valuation differ from a cash offer?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          A valuation is what the wider market might pay for a car you could still advertise. A cash offer is the price we will pay to buy the car and tow it away. For a damaged, non-running or scrap car, the cash offer is the relevant number. Read the{" "}
          <Link href="/scrap-car-prices-brisbane" className="font-semibold text-navy underline underline-offset-4">
            scrap car prices in Brisbane
          </Link>{" "}
          for the guide ranges, then use the{" "}
          <Link href="/quote" className="font-semibold text-navy underline underline-offset-4">
            quote form
          </Link>{" "}
          if you want that offer. Towing on the offer is free and is never deducted. We pay before the car leaves.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Cash offers cover {areas.map((area) => area.name).join(", ")} only. AutoVal can estimate a car registered in another state, and we cannot collect a car outside those areas. If the car is in range and it is scrap, old or damaged, ask for the offer rather than treating the estimate as the price.
        </p>

        <h2 className="h-content mt-12">AutoVal questions</h2>
        <div className="mt-6 divide-y divide-line">
          {autovalFaqs.map((faq) => (
            <div key={faq.q} className="py-4">
              <h3 className="text-[20px] font-semibold text-navy">{faq.q}</h3>
              <p className="mt-2 text-[18px] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
      <JsonLd data={faqLd} />
    </>
  );
}
