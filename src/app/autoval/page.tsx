import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, BreadcrumbTrail, JsonLd } from "@/components/JsonLd";
import { Roo } from "@/components/Roo";
import { CheckIcon } from "@/components/icons";
import { regoLookupEnabled } from "@/lib/autoval/rego";
import { areas, pageOpenGraph, site } from "@/lib/site";
import { AutoValuer } from "./AutoValuer";

// Rego lookup needs REGO_API_USERNAME. Without it the page must not offer a lookup that fails, so the
// Rego tab and every mention of it are left out. This page is prerendered, so the value is read at build
// time: after adding or removing the variable, redeploy.
const regoLookup = regoLookupEnabled();

// The searches this page is found for are "car valuation brisbane", "free car valuation" and "value my car qld".
// The root layout appends " | 1800-CASH-FOR-CARS", so the title stays under 60 characters.
export const metadata: Metadata = {
  title: "Free Car Valuation Brisbane & QLD",
  description:
    `${regoLookup ? "Free car valuation for Brisbane and QLD by rego, VIN or the car's details." : "Free car valuation for Brisbane and QLD from a VIN or the car's details."} Private-sale, trade-in and dealer price ranges. An estimate, not a cash offer.`,
  alternates: { canonical: "/autoval" },
  openGraph: pageOpenGraph("/autoval"),
};

const autovalFaqs = [
  {
    q: "How do I get a free car valuation in Brisbane?",
    a: `Use the form on this page. ${regoLookup ? "Enter a number plate, a VIN or the car's details" : "Enter the make, model and year, or a VIN"}, then the kilometres and the condition. The form starts on Queensland, so a Brisbane car needs no change there. The estimate is free, there is no sign-up, and it is usually ready in about a minute. You do not bring the car to our Rocklea yard for it.`,
  },
  {
    q: "How do I value my car in QLD?",
    a: `Leave the state on Queensland, then ${regoLookup ? "enter the number plate, the VIN, or the make, model and year" : "enter the make, model and year, or the VIN"}. Add the kilometres and pick a condition from excellent to poor. The report gives a private-sale range, a trade-in range and a dealer retail range for the car, and its paperwork list is written for Queensland.`,
  },
  {
    q: "Is AutoVal free?",
    a: `Yes. ${regoLookup ? "Looking up a rego, decoding a VIN" : "Decoding a VIN"} and reading the estimate are free. You do not pay to see the result, and you do not have to sell the car to us afterwards.`,
  },
  {
    q: "Do I need to sign up?",
    a: `No. There is no account and no login. ${regoLookup ? "Enter a number plate and the state, a VIN, or type the car's details yourself." : "Type the car's details yourself, or enter a VIN to fill some of them in."} That is the whole form.`,
  },
  {
    q: "Does AutoVal work outside Queensland?",
    a: `${regoLookup ? "The rego lookup accepts any Australian state or territory listed on the form." : "AutoVal can estimate a car from any Australian state or territory."} A cash offer from ${site.name} is only for Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. A car outside those areas can still be estimated here, and we cannot collect it.`,
  },
  {
    q: "Is the valuation an offer?",
    a: `No. AutoVal is an estimate, not an offer to buy the car. It uses ${regoLookup ? "a registration lookup or a VIN decode" : "the details you enter or a VIN decode"}, then an estimate that searches current Australian listings and price guides. The condition is what you report yourself. A cash offer is a separate price we send after you describe the car.`,
  },
  {
    q: "How accurate is the valuation?",
    a: "It is a guide, not a formal appraisal. Each report shows a confidence level of high, medium or low, with the reason for it. The condition is whatever you report and nobody inspects the car, so a buyer may see it differently. If few similar cars are advertised, the estimate has less to go on.",
  },
  {
    q: "Does the valuation show a trade-in value?",
    a: "Yes. The report has a trade-in range next to the private-sale range and the dealer retail range, so you can see the gap between trading the car in and selling it yourself. It is an estimate. A dealer makes its own offer once it has seen the car.",
  },
  {
    q: "Is AutoVal a car value calculator?",
    a: "It does the job of one: you enter the car's details and get price ranges back. To work them out, AutoVal searches current Australian listings and price guides for similar cars, and an AI model writes the estimate from what the search found and from your answers. When the search finds little, the estimate has less to go on and the confidence level is lower.",
  },
  {
    q: "Can I use AutoVal for an insurance or finance valuation?",
    a: "No. AutoVal is a guide for someone who is thinking about selling a car. It is not a formal appraisal, and it is not written for an insurer, a lender or a court.",
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

const TRAIL = [{ name: "AutoVal car valuation", path: "/autoval" }];

export default function AutoValPage() {
  return (
    <>
      <Breadcrumbs trail={TRAIL} />

      {/* A short heading band, so the form's first field is on the first screen of a phone and of a laptop.
          The three promises that used to sit here are under the tool, with the scrap car link. */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="container-site pb-14 pt-5 sm:pb-[4.5rem] sm:pt-7">
          <p className="font-sans text-[14px] font-bold uppercase tracking-[0.14em] text-white">AutoVal · Free AI valuation</p>
          <h1 className="mt-1.5 font-heading text-[28px] font-bold leading-[1.1] tracking-[-0.02em] sm:mt-2 sm:text-[40px] lg:text-[44px]">
            Free car valuation for Brisbane and Queensland
          </h1>
          <p className="mt-2.5 max-w-3xl text-[16px] leading-normal text-white/85 sm:mt-3 sm:text-[18px] sm:leading-relaxed">
            What&apos;s your car really worth? {regoLookup ? "Enter your rego, VIN or just the details." : "Enter your car's details, or a VIN."} AutoVal checks live Australian listings and price guides, then
            shows what it&apos;s worth and what to fix before you sell.
          </p>
        </div>
        <Roo hand="cash" className="pointer-events-none absolute bottom-16 right-[max(3rem,calc((100vw-80rem)/2+3rem))] hidden h-36 w-auto xl:block" />
      </section>

      <div className="container-site relative -mt-10 pb-10 sm:-mt-12 sm:pb-14">
        <AutoValuer regoLookup={regoLookup} />
      </div>

      <section className="container-site max-w-3xl pb-12 sm:pb-16">
        {/* Under the tool, so the tool's first field stays on the first screen. It was a screen-reader-only
            trail, which left a keyboard user tabbing to a link they could not see. */}
        <BreadcrumbTrail trail={TRAIL} className="mb-3" />
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[16px] font-semibold">
          {["Free, no sign-up", "Ready in about a minute", "Live Australian market data"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <CheckIcon aria-hidden="true" className="h-5 w-5 text-brand" />
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[16px] leading-relaxed sm:text-[18px]">
          For a scrap or wrecked car, see our{" "}
          <Link href="/scrap-car-prices-brisbane" className="font-semibold text-navy underline underline-offset-4">
            scrap car prices in Brisbane
          </Link>
          .
        </p>
      </section>

      <section className="container-site max-w-3xl pb-16 sm:pb-24">
        <h2 className="h-content">How AutoVal works</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          {regoLookup
            ? "AutoVal is a free estimate for an Australian car. You can start with a number plate. Choose the state the car is registered in and AutoVal looks it up through a registration API, which fills in the make, model and other details the lookup returns. You can start with a VIN instead. That number is decoded so the form has a vehicle to value. You can also type the details yourself if you do not have a plate or a VIN handy, or if the lookup misses a variant."
            : "AutoVal is a free estimate for an Australian car. You start by typing the make, model and year. If you have the VIN, you can enter that instead. The number is decoded so the form has a vehicle to value, and you can correct anything the decode misses, such as the variant."}
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          After the car is identified, AutoVal builds an estimate by searching current Australian listings and price guides. The search is there to see what similar cars are being advertised for, not to invent a market. You then say how the car is: kilometres, condition, service history and whether it has been in an accident. Those answers are yours. The tool does not inspect the car, and it does not visit it.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          The result is a guide to a private sale, a trade-in and a dealer price for a car in the condition you described. It is meant for someone who still might sell the car themselves. It is not a contract, and it is not the amount {site.name} will pay.
        </p>

        <h2 className="h-content mt-12">What do I need to value my car?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Four things: the make, the model, the year and the kilometres on the odometer. {regoLookup ? "A number plate or a VIN can fill in some of the car's details for you." : "A VIN can fill in some of the car's details for you."} You
          also pick a condition, from excellent to poor. That rating is your own call, and the form starts on good.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          The rest is optional: the variant, body, transmission, fuel, engine and colour, the number of owners, the service history, whether the car has been in an accident or had panel repairs, any extras, and any known issues. The more of it you fill in, the more the estimate has to go on.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          You are not asked for a name, a phone number or an email address to see the result.
        </p>

        <h2 className="h-content mt-12">How do I value my car in Queensland, step by step?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          The tool at the top of this page has two steps, and the report follows them.
        </p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[18px] leading-relaxed">
          <li>
            Find the car.{" "}
            {regoLookup
              ? "Use the Rego tab with the number plate and the state the car is registered in, the VIN tab with the 17-character VIN, or the Details tab to type the car in yourself."
              : "Type the car in on the Details tab, or use the VIN tab with the 17-character VIN."}{" "}
            The VIN is on the compliance plate, at the bottom of the windscreen, or on the rego papers.
          </li>
          <li>
            Check the car&apos;s details. The make, model, year and kilometres are needed. The variant, body, transmission, fuel, engine and colour are optional, and you can correct anything a lookup got wrong.
          </li>
          <li>
            Leave the state on Queensland for a QLD car. Change it only if the car is registered somewhere else.
          </li>
          <li>
            Describe the condition. Pick excellent, good, fair or poor, then add the service history, whether the car has been in an accident or had panel repairs, any extras and any known issues.
          </li>
          <li>
            Read the report. It is usually ready in about a minute, and you are not asked for a name, a phone number or an email address to see it.
          </li>
        </ol>
        <p className="mt-4 text-[18px] leading-relaxed">
          Kilometres and condition make the biggest difference to the figure, so those two are worth getting right.
        </p>

        <h2 className="h-content mt-12">What the valuation shows</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          The headline is a private-sale price range with a suggested asking price. With it are a trade-in range and a dealer retail range, so you can see the gap between selling the car yourself and trading it in. The report also has:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[18px] leading-relaxed">
          <li>a confidence level of high, medium or low, with the reason for it</li>
          <li>what pushes the price up or down for your car</li>
          <li>parts worth checking before you sell, each with a typical repair cost and whether to fix it first or disclose it</li>
          <li>the engine fitted, its service items and its known faults</li>
          <li>known issues for the model, and the paperwork for the state you chose</li>
          <li>a draft ad you can copy, and the listings or price guides the estimate drew on when the search found any</li>
        </ul>
        <p className="mt-4 text-[18px] leading-relaxed">
          The report is written by an AI model from those search results and your answers. It is for guidance only and is not a formal appraisal. Use it as a starting point for your own checks.
        </p>

        <h2 className="h-content mt-12">Private sale, trade-in or dealer retail: which figure do I use?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          The report puts the three ranges on one scale, with trade-in at the low end, dealer retail at the high end and private sale between them. Which one matters depends on how you plan to sell.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[18px] leading-relaxed">
          <li>
            <b className="text-navy">Private sale.</b> The headline range, with a suggested asking price. Use it if you plan to advertise the car yourself.
          </li>
          <li>
            <b className="text-navy">Trade-in.</b> The range to compare a dealer&apos;s offer with when the car is going in as part of buying another one.
          </li>
          <li>
            <b className="text-navy">Dealer retail.</b> What a similar car might be advertised for by a dealer. It is there for comparison, and it is not what a dealer would pay you.
          </li>
        </ul>
        <p className="mt-4 text-[18px] leading-relaxed">
          None of the three is a cash offer from {site.name}, and none is a formal appraisal for an insurer or a lender.
        </p>

        <h2 className="h-content mt-12">What it can&apos;t tell you</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          It is an estimate, not an offer. Condition is self-reported, so a car you describe as good will be estimated as good even if a buyer would mark it down. Rust, a noisy gearbox, a warning light or worn tyres only affect the figure if you include them. The tool cannot see photos and it cannot drive the car.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          {regoLookup
            ? "A registration lookup can miss a variant, and a VIN decode can miss the exact model sold in Australia."
            : "A VIN decode can miss the variant or the exact model sold in Australia."}{" "}
          You can correct the details before the estimate runs. If listings for that car are thin, the estimate has less to go on. None of this is a promise that the car will sell for the figure on the screen.
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

        <h2 className="h-content mt-12">Does my car need a valuation or a quote?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          A valuation suits a car that runs and that you could advertise or trade in. It tells you what to ask, and what a trade-in might look like, before you decide how to sell.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          A quote suits a car that does not run, has been written off, has a repair bill bigger than its value, or has sat for years. AutoVal will still give a figure for a car like that, but the figure is a market estimate, and a car in that state is priced on its parts and its metal. For that price, ask us. How we collect and pay for an end-of-life car is on{" "}
          <Link href="/scrap-car-removal" className="font-semibold text-navy underline underline-offset-4">
            cash for scrap cars in Brisbane
          </Link>
          , and a damaged car with usable parts is covered by our{" "}
          <Link href="/car-wreckers" className="font-semibold text-navy underline underline-offset-4">
            car wreckers
          </Link>{" "}
          page.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          If the car runs and you would still rather not advertise it,{" "}
          <Link href="/cash-for-cars" className="font-semibold text-navy underline underline-offset-4">
            sell your car for cash in Brisbane
          </Link>{" "}
          sets out the cash sale, step by step.
        </p>

        <h2 className="h-content mt-12">Car valuation in Brisbane and across Queensland</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          AutoVal is a free online tool from {site.name}. Our yard is in Rocklea, on Brisbane&apos;s southside, and you do not bring the car in for a valuation. It is done on this page, whether the car is in Brisbane, elsewhere in Queensland or in another state.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          The form starts on Queensland, so to value a car registered in QLD you leave the state as it is. For a car registered somewhere else, change it. The state you choose goes into the estimate with the rest of the car&apos;s details, and the paperwork list in the report is written for that state.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Cash offers cover {areas.map((area) => area.name).join(", ")} only. The suburbs are listed under the{" "}
          <Link href="/locations" className="font-semibold text-navy underline underline-offset-4">
            areas we cover
          </Link>
          . AutoVal can estimate a car registered in another state, and we cannot collect a car outside those areas. If the car is in range and it is scrap, old or damaged, ask for the offer rather than treating the estimate as the price.
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
