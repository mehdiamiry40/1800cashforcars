import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ReviewsBand } from "@/components/Blocks";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { ParentBrandLine } from "@/components/ParentBrand";
import { QuoteForm, QuoteFormHeading } from "@/components/QuoteForm";
import { QuoteLink } from "@/components/QuoteLink";
import { ArrowIcon, PhoneIcon, SmsIcon } from "@/components/icons";
import { pageOpenGraph, site } from "@/lib/site";
import { servicePhotos } from "@/lib/vehicle-visuals";

const PATH = "/scrap-car-prices-brisbane";
const UPDATED_ISO = "2026-10-20";
const UPDATED_LABEL = "20 October 2026";
const DESCRIPTION =
  "Scrap car prices in Brisbane for 2026: guide ranges by car type and condition, what changes the price, and free towing. Quotes on 0423 514 111.";
const H1 = "How much is my scrap car worth in Brisbane?";
const DIRECT_ANSWER =
  "Most scrap and non-running cars we buy in Brisbane are worth $150 to $800. Older cars that still run usually fetch $500 to $1,600. Running or accident-damaged utes bring $1,000 to $5,500, and late-model damaged SUVs and 4WDs $2,500 to $6,000. These are guides: we quote every car individually, and free towing is never taken off the price.";
const QUOTE_SPEED = "Quotes are usually within the hour.";

export const metadata: Metadata = {
  title: "Scrap Car Prices Brisbane 2026",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

const priceRows: { vehicle: string; price: string }[] = [
  { vehicle: "Stripped shell / burnt / no engine (any small–mid car)", price: "$150 – $500" },
  { vehicle: "Small hatch, complete, non-running / scrap", price: "$150 – $400" },
  { vehicle: "Sedan, complete, non-running", price: "$300 – $800" },
  { vehicle: "Small/medium sedan or hatch, older, running (high km, minor faults)", price: "$500 – $1,600" },
  { vehicle: "SUV / 4WD, non-running / scrap", price: "$500 – $1,200" },
  { vehicle: "SUV / 4WD, late model, damaged or written off but mostly intact", price: "$2,500 – $6,000 (quote above this case by case)" },
  { vehicle: "Ute, non-running / scrap", price: "$300 – $1,400" },
  { vehicle: "Ute, running or accident-damaged (popular diesel models)", price: "$1,000 – $5,500" },
  { vehicle: "Van", price: "From $500; quote individually" },
  { vehicle: "Light / medium truck", price: "From $1,000; quote individually" },
];

const metalRows: { vehicle: string; weight: string; value: string }[] = [
  { vehicle: "Small hatch", weight: "~1.1 t", value: "≈ $165–$226" },
  { vehicle: "Sedan", weight: "~1.4 t", value: "≈ $210–$287" },
  { vehicle: "Large 4WD / ute", weight: "1.8–2.5 t", value: "≈ $270–$513" },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How much is a scrap car worth in Brisbane?",
    a: "Most scrap and non-running cars we buy in Brisbane are worth $150 to $800. Older cars that still run usually fetch $500 to $1,600. Running or accident-damaged utes are often $1,000 to $5,500, and late-model damaged SUVs and 4WDs $2,500 to $6,000. We quote every car individually, and free towing is never taken off.",
  },
  {
    q: "How much will I get for a car that doesn't run?",
    a: "It depends on the type. A complete small hatch is $150 to $400, a complete sedan $300 to $800, a non-running SUV or 4WD $500 to $1,200, and a non-running ute $300 to $1,400. A stripped shell, a burnt car or a car with no engine is $150 to $500. An intact engine and gearbox help the price.",
  },
  {
    q: "Are scrap cars priced by weight?",
    a: "Partly. Weight sets the scrap floor, not the whole price. At about A$150 to $205 a tonne for whole scrap vehicles in October 2026, a 1.4 tonne sedan holds roughly $210 to $287 of metal. Parts and the catalytic converter add on top. Rates move week to week, and this metal value is not what we pay you per tonne.",
  },
  {
    q: "Do you take towing off the price?",
    a: "No. Towing is always free across our service areas, and it is never deducted from the price. The price we quote is the price we pay, as long as the car is as described. Nothing comes off for the tow. We pay by cash or bank transfer before the car leaves. In NSW, including Tweed Heads, payment is by bank transfer only.",
  },
  {
    q: "Should I remove parts before selling my scrap car?",
    a: "Usually no. A complete car is worth more than the same car with parts missing. Taking off the catalytic converter, the engine, the gearbox or the wheels lowers the offer. Aftermarket accessories are the exception: a stereo, a bull bar or other extras you fitted can be sold separately. Leave the factory parts on the car.",
  },
  {
    q: "Can I sell an unregistered car or one without papers?",
    a: "Yes. An unregistered car is fine if you can show it is yours. We ask for photo ID, a driver's licence or passport, and proof of ownership, like the rego papers. If you've lost the papers, tell us. We can usually still sort it out. The car does not need a roadworthy for us to buy it and tow it away free.",
  },
  {
    q: "Can I sell a car with finance still owing?",
    a: "Call us and we'll discuss it. Finance is different on every car, so this page doesn't set out a process or say that it changes the guide price. Phone 0423 514 111, tell us the make and model, and say that finance is owing. We'll talk it through with you before we quote that car.",
  },
  {
    q: "Why do scrap car prices change?",
    a: "Steel and aluminium prices move, sometimes week to week, and parts demand shifts with the model. Condition, what's missing, and how we can get to the car also change an individual quote. That's why this is a dated guide, reviewed by our Rocklea yard team, not a fixed price list. The figures on this page were updated on 20 October 2026.",
  },
  {
    q: "How and when do I get paid?",
    a: "You're paid by cash or bank transfer when we pick the car up, before it leaves. You choose which, except in NSW. Tweed Heads is in NSW, so payment there is by bank transfer only. We confirm the pickup time after you accept the price. Have photo ID and proof of ownership ready on the day.",
  },
  {
    q: "Is the AutoVal estimate the same as your cash offer?",
    a: "No. AutoVal estimates trade-in, private-sale and dealer prices from live listings. Our cash offer is a firm price to buy your car as it is, including scrap or damaged cars. You can check your car's market value with AutoVal if you might sell privately, or get a firm quote for your car from us. The two numbers are not the same.",
  },
];

const inlineLinks: { phrase: string; href: string }[] = [
  { phrase: "check your car's market value with AutoVal", href: "/autoval" },
  { phrase: "get a firm quote for your car", href: "/quote" },
  { phrase: site.phoneDisplay, href: site.phoneHref },
];

function linkChunks(text: string) {
  const chunks: { text: string; href?: string }[] = [];
  let rest = text;
  while (rest.length) {
    let at = -1;
    let found: (typeof inlineLinks)[number] | undefined;
    for (const link of inlineLinks) {
      const i = rest.indexOf(link.phrase);
      if (i !== -1 && (at === -1 || i < at)) {
        at = i;
        found = link;
      }
    }
    if (!found || at === -1) {
      chunks.push({ text: rest });
      break;
    }
    if (at > 0) chunks.push({ text: rest.slice(0, at) });
    chunks.push({ text: found.phrase, href: found.href });
    rest = rest.slice(at + found.phrase.length);
  }
  return chunks;
}

function AnswerText({ text }: { text: string }) {
  return (
    <>
      {linkChunks(text).map((chunk, i) =>
        chunk.href ? (
          chunk.href === "/quote" ? (
            <QuoteLink key={i} from="price-faq" className="font-semibold underline underline-offset-4">
              {chunk.text}
            </QuoteLink>
          ) : chunk.href.startsWith("/") ? (
            <Link key={i} href={chunk.href} className="font-semibold underline underline-offset-4">
              {chunk.text}
            </Link>
          ) : (
            <a key={i} href={chunk.href} className="font-semibold underline underline-offset-4">
              {chunk.text}
            </a>
          )
        ) : (
          <span key={i}>{chunk.text}</span>
        ),
      )}
    </>
  );
}

function clock(time: string) {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, "0")}${suffix}` : `${hour}${suffix}`;
}

function hoursSentence() {
  return site.hours
    .map((h) => {
      const days = h.days.length > 1 ? `${h.days[0]} to ${h.days[h.days.length - 1]}` : h.days[0];
      return `${days}, ${clock(h.opens)} to ${clock(h.closes)}`;
    })
    .join(", and ");
}

const pageLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${site.url}${PATH}#webpage`,
      url: `${site.url}${PATH}`,
      name: H1,
      description: DESCRIPTION,
      inLanguage: "en-AU",
      isPartOf: { "@id": `${site.url}/#website` },
      about: { "@id": `${site.url}/#business` },
      publisher: { "@id": `${site.url}/#business` },
      datePublished: UPDATED_ISO,
      dateModified: UPDATED_ISO,
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}${PATH}#faq`,
      isPartOf: { "@id": `${site.url}${PATH}#webpage` },
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

function PriceActions({
  from,
  light = false,
  sms = false,
  speed = false,
}: {
  from: string;
  light?: boolean;
  sms?: boolean;
  speed?: boolean;
}) {
  const secondary = light
    ? "btn border border-white text-white hover:bg-white hover:text-navy"
    : "btn-line";
  return (
    <div>
      <div className={light ? "page-hero-actions mt-7 flex flex-wrap gap-3" : "mt-4 flex flex-wrap gap-3"}>
        <QuoteLink from={from} className="btn-brand">
          Get your firm price <ArrowIcon aria-hidden="true" className="h-5 w-5" />
        </QuoteLink>
        <a href={site.phoneHref} className={secondary}>
          <PhoneIcon aria-hidden="true" className="h-5 w-5" />
          {light ? site.phoneDisplay : `Call ${site.phoneDisplay}`}
        </a>
        {sms && site.smsNumber && (
          <a href={`sms:${site.smsNumber}`} className={secondary}>
            <SmsIcon aria-hidden="true" className="h-5 w-5" />
            Text us
          </a>
        )}
      </div>
      {speed && <p className="mt-4 max-w-xl text-[16px] leading-relaxed">{QUOTE_SPEED}</p>}
    </div>
  );
}

export default function ScrapCarPricesBrisbane() {
  const photo = servicePhotos.scrap;
  return (
    <>
      <Breadcrumbs trail={[{ name: "Scrap car prices Brisbane", path: PATH }]} />
      <JsonLd data={pageLd} />

      <section className="page-hero relative bg-navy text-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-[1.2fr_1fr]">
          <div className="page-hero-media relative aspect-[16/9] overflow-hidden bg-white md:order-2 md:aspect-auto md:min-h-80">
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              preload
              placeholder="blur"
              sizes="(max-width: 767px) 96px, (pointer: coarse) and (max-width: 1023px) 96px, 45vw"
              style={{ objectFit: "contain" }}
              className="object-contain"
            />
          </div>
          <div className="page-hero-copy container-site py-8 sm:py-14 md:order-1">
            <h1 className="font-heading text-[34px] font-bold leading-tight sm:text-[42px] lg:text-[48px]">{H1}</h1>
            <p className="mt-5 max-w-2xl text-[18px] leading-relaxed sm:text-[20px]">{DIRECT_ANSWER}</p>
            <p className="mt-4 text-[16px] font-semibold">
              Prices updated <time dateTime={UPDATED_ISO}>{UPDATED_LABEL}</time> · Set by our Rocklea yard team
            </p>
            <PriceActions from="price-hero" light sms speed />
          </div>
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="border-b border-line">
        <div className="container-site flex flex-wrap items-center gap-2 py-4 text-[16px]">
          <Link href="/" className="inline-flex min-h-11 items-center">
            Home
          </Link>
          <span aria-hidden="true" className="text-brand">
            ›
          </span>
          <span className="font-semibold">Scrap car prices Brisbane</span>
        </div>
      </nav>

      <section className="container-site section-site grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
        <aside className="min-w-0 lg:col-start-2 lg:row-start-1">
          <div id="quote" data-quote className="quote-box page-quote quote-panel scroll-mt-32 lg:sticky lg:top-32">
            <QuoteFormHeading className="h-sub mb-5" />
            <QuoteForm />
          </div>
        </aside>

        <div className="prose-site min-w-0 text-[18px] lg:col-start-1 lg:row-start-1 [&>p:first-child]:mt-0">
          <p>Not sure which row your car fits? Send us the rego and a few photos and we&apos;ll tell you.</p>

          <h2 className="h-content mt-10">Scrap car prices in Brisbane: our price guide (October 2026)</h2>
          <p>Here&apos;s what we typically pay, by vehicle type and condition.</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[16px] leading-snug sm:text-[18px]">
              <caption className="mb-3 text-left text-[16px] leading-relaxed text-navy">
                Guide prices paid by {site.name}, Brisbane and South East QLD. Updated {UPDATED_LABEL}. Every car is quoted individually; free towing is not deducted.
              </caption>
              <thead>
                <tr className="border-b-2 border-navy">
                  <th scope="col" className="py-3 pr-4 align-bottom font-semibold text-navy">
                    Vehicle / condition
                  </th>
                  <th scope="col" className="w-[42%] py-3 align-bottom font-semibold text-navy sm:w-[38%]">
                    Guide price (AUD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map((row) => (
                  <tr key={row.vehicle} className="border-b border-line align-top odd:bg-sand">
                    <th scope="row" className="py-3 pr-4 font-semibold text-navy">
                      {row.vehicle}
                    </th>
                    <td className="py-3">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>These are guide ranges, not offers. Each car is quoted on its own details.</li>
            <li>Free towing is included and is not deducted. Towing is always free.</li>
            <li>Vans and trucks are quoted individually, from the stated floors.</li>
          </ul>
          <p>
            Light and medium trucks start from $1,000 and are quoted one by one. For bigger vehicles, see our{" "}
            <Link href="/truck-removal">cash for trucks</Link> page.
          </p>

          <h3 className="h-sub mt-8">Running vs non-running: how big is the gap?</h3>
          <p>
            Across the wider market, older non-running cars are typically $200–$800, against $500–$2,500 for older cars that still run. Those figures are market observations, not a record of cars we have bought. The gap is often smaller than people expect when the engine and gearbox are intact.
          </p>
          <p>
            Our guide is the table above. An older small or medium sedan or hatch that still runs, with high kilometres and minor faults, is $500 – $1,600. A complete non-running hatch is $150 – $400, and a complete non-running sedan is $300 – $800.
          </p>

          <div className="mt-8 border border-line bg-sand p-5">
            <p className="!mt-0 font-semibold text-navy">
              Your car&apos;s not in the table, or you want an exact number? Send the rego and a few photos.
            </p>
            <PriceActions from="after-table" speed />
          </div>

          <h2 className="h-content mt-12">What changes the price of a scrap car?</h2>
          <p>
            The price moves with the car, not with a fixed menu. Make, model, whether it runs, what&apos;s missing, the metal price and how we reach the car all sit inside the guide ranges above.
          </p>

          <h3 className="h-sub mt-8">Make, model and year</h3>
          <p>
            Popular Queensland models have stronger parts demand: HiLux, Ranger, Corolla, Commodore, Camry, CX-5 and Japanese brands generally. A complete non-running Corolla and a slow-selling sedan can both sit on the $300 – $800 row, with the Corolla more likely toward the top. We still quote the actual car.
          </p>

          <h3 className="h-sub mt-8">Condition and completeness</h3>
          <p>
            A missing engine, gearbox, wheels, battery or catalytic converter lowers the offer. A complete small hatch that doesn&apos;t run is on the $150 – $400 row. The same size of car as a stripped shell, burnt, or with no engine is on the $150 – $500 row. Tell us what is missing.
          </p>

          <h3 className="h-sub mt-8">Running or not</h3>
          <p>
            A car that runs is worth more than the same car that doesn&apos;t. An older running sedan or hatch is typically $500 – $1,600, against $150 – $400 for a complete non-running hatch or $300 – $800 for a complete non-running sedan. The gap is often smaller when the engine and gearbox are intact.
          </p>

          <h3 className="h-sub mt-8">Weight</h3>
          <p>
            Weight sets the scrap floor, before parts are counted. A hatch is about 1.1 tonnes, a sedan about 1.4 tonnes, and a 4×4 or ute about 1.8 to 2.5 tonnes, at roughly A$150–$205 a tonne for a whole scrap vehicle. Guide prices sit above that floor when parts can be reused.
          </p>

          <h3 className="h-sub mt-8">Parts demand</h3>
          <p>
            The engine, gearbox, catalytic converter, panels and glass add value on top of the metal. Platinum, palladium and rhodium in the converter are why a complete Corolla with the cat on is worth more than the same car with it cut off: a complete non-running sedan can reach $800, while a shell with no engine may be closer to $150. This is{" "}
            <Link href="/car-wreckers">how we wreck and recycle cars</Link>.
          </p>

          <h3 className="h-sub mt-8">Scrap metal market</h3>
          <p>
            Steel and aluminium prices move week to week, so the floor under a scrap-only car moves too. Industry estimates put the swing in Australian steel at about 15–25% between peak and trough years. That is an industry estimate, not our own figure, which is why this guide is dated.
          </p>

          <h3 className="h-sub mt-8">Location and access</h3>
          <p>
            The same guide applies everywhere we collect, and towing is always free. An underground car park or a ute in a paddock can affect an individual quote, because it takes more time than a driveway pickup. We don&apos;t add a towing surcharge, and towing is never taken off the price.
          </p>

          <h3 className="h-sub mt-8">Paperwork and registration</h3>
          <p>
            Unregistered is fine with photo ID and proof of ownership, such as the rego papers. If you&apos;ve lost the papers, tell us. We can usually still sort it out. If finance is owing, call {site.phoneDisplay} and we&apos;ll discuss that car. We don&apos;t set out a finance process here.
          </p>

          <h3 className="h-sub mt-8">Damage type</h3>
          <p>
            A late-model SUV or 4WD that is damaged or written off but mostly intact can bring $2,500 – $6,000, and we quote above that case by case. Fire or flood damage limits reusable parts, so a small or mid-size car often falls to the $150 – $500 shell row. Photos show us which one it is.
          </p>

          <h2 className="h-content mt-12">How much is a scrap car worth just for its metal?</h2>
          <p>
            The scrap floor is the weight of the car times the whole-vehicle scrap rate. On {UPDATED_LABEL}, whole scrap vehicles were trading at roughly A$150–$205 a tonne at yard level. Most scrap-only offers in the market sit near that metal value. The catalytic converter, engine, gearbox and other parts are what lift a car above it.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[16px] leading-snug sm:text-[18px]">
              <caption className="mb-3 text-left text-[16px] leading-relaxed text-navy">
                Approximate metal value of a whole scrap vehicle at A$150–$205 a tonne. Not a payout.
              </caption>
              <thead>
                <tr className="border-b-2 border-navy">
                  <th scope="col" className="py-3 pr-4 font-semibold text-navy">
                    Vehicle
                  </th>
                  <th scope="col" className="py-3 pr-4 font-semibold text-navy">
                    Typical weight
                  </th>
                  <th scope="col" className="py-3 font-semibold text-navy">
                    Metal value to a yard (approx.)
                  </th>
                </tr>
              </thead>
              <tbody>
                {metalRows.map((row) => (
                  <tr key={row.vehicle} className="border-b border-line align-top odd:bg-sand">
                    <th scope="row" className="py-3 pr-4 font-semibold text-navy">
                      {row.vehicle}
                    </th>
                    <td className="py-3 pr-4">{row.weight}</td>
                    <td className="py-3">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>This is gross metal value before towing and processing, not a payout.</li>
            <li>Rates for prepared or sorted steel, around A$370–$450 a tonne, don&apos;t apply to a whole car. A whole car is mixed material.</li>
            <li>Rates move week to week.</li>
          </ul>
          <p>Indicative rates seen {UPDATED_LABEL} from OnlineScrapYard and OzScrap.</p>
          <p>
            Our own towing is still free, and it is never deducted from the price we quote. If the car is only worth the metal, we still collect it. Read about{" "}
            <Link href="/scrap-car-removal">scrap car removal</Link>.
          </p>

          <h2 className="h-content mt-12">How do we work out your offer?</h2>
          <p>We price each car on parts demand plus metal value, and we take nothing off for towing.</p>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>You give us the make, model, year, approximate kilometres, condition, what&apos;s missing and the suburb. The rego or VIN helps.</li>
            <li>Photos let us confirm the condition and give a firm price.</li>
            <li>We price it on parts demand plus metal value, less nothing for towing. Towing is always free.</li>
            <li>We confirm the pickup time.</li>
            <li>You&apos;re paid by cash or bank transfer before the car leaves. NSW, including Tweed Heads, is bank transfer only.</li>
          </ol>
          <p>
            Describe the car accurately, including what&apos;s missing, so the price doesn&apos;t change at pickup. The price we quote is the price we pay, as long as the car is as described.
          </p>
          <p>
            This table is our current price guide, reviewed by our yard team on {UPDATED_LABEL}. It is built from parts demand, metal value and current Brisbane market prices. For a market valuation of a car you might sell privately,{" "}
            <Link href="/autoval">check your car&apos;s market value with AutoVal</Link>. That estimate is not our cash offer.
          </p>

          <h2 className="h-content mt-12">How can I get the most for my scrap car?</h2>
          <p>
            A complete, accurately described car with the catalytic converter still on is the simplest way to sit higher in the guide range. A few practical points:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Be accurate about the condition, the damage, and what is missing. The quote is based on what you tell us.</li>
            <li>Leave the car complete. Removing parts usually lowers the offer. Aftermarket accessories are the exception, and you can sell those separately.</li>
            <li>Keep the catalytic converter on. Cutting it off drops a complete car toward the shell row.</li>
            <li>Have proof of ownership ready, with photo ID. Unregistered is fine.</li>
            <li>Mention access. An underground car park, a steep driveway or a paddock can affect the quote. It does not add a towing fee.</li>
            <li>If finance is owing, call us and we&apos;ll discuss that car. We don&apos;t publish a process for it on this page.</li>
          </ul>

          <h2 className="h-content mt-12">
            Do prices differ across Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads?
          </h2>
          <p>
            No. The same guide applies across all of those areas, with free towing in every one. Access and distance can affect an individual quote. They are not a surcharge, and towing is never taken off the price.
          </p>
          <p>
            Brisbane: our Rocklea yard does <Link href="/car-removal-brisbane">free car removal across Brisbane</Link> on this same guide. Pickups are usually within a day or two.
          </p>
          <p>
            Gold Coast: <Link href="/locations/gold-coast">cash for cars on the Gold Coast</Link> uses this guide, with free towing from Ormeau to Coolangatta.
          </p>
          <p>
            Logan: <Link href="/locations/logan">cash for cars in Logan</Link> uses the same ranges. The yard is close, and pickups are usually within a day or two.
          </p>
          <p>
            Ipswich: <Link href="/locations/ipswich">cash for cars in Ipswich</Link> uses the same guide. Tell us if the car is on acreage.
          </p>
          <p>
            Sunshine Coast: <Link href="/locations/sunshine-coast">cash for cars on the Sunshine Coast</Link> uses the same guide. Distance can affect the pickup time, not a towing fee.
          </p>
          <p>
            Tweed Heads: <Link href="/locations/tweed-heads">cash for cars in Tweed Heads</Link> uses the same guide, paid by bank transfer only because it is in NSW.
          </p>
          <p>
            See <Link href="/locations">all the areas we cover</Link>.
          </p>

          <h2 className="h-content mt-12" id="faq">
            Scrap car price FAQs
          </h2>
          <p>The ranges above are guides, and every car is quoted on its own.</p>
          <div className="mt-6 divide-y divide-line">
            {faqs.map((f) => (
              <details key={f.q} className="group bg-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[17px] font-semibold leading-relaxed text-navy sm:text-[20px]">
                  {f.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center border border-line text-xl font-semibold text-navy transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-[16px] sm:pb-5 sm:pr-6 sm:text-[18px]">
                  <AnswerText text={f.a} />
                </p>
              </details>
            ))}
          </div>

          <h2 className="h-content mt-12">Who is {site.name}?</h2>
          <ParentBrandLine />
          <p>
            We share the yard at {site.address}. The yard is open {hoursSentence()}. Call{" "}
            <a href={site.phoneHref}>{site.phoneDisplay}</a>.{" "}
            <a href={site.googleBusinessUrl} target="_blank" rel="noopener noreferrer">
              Our yard is on Google as {site.googleBusinessName}
            </a>
            . That listing is rated {site.googleRating.score} from {site.googleRating.count} Google reviews. The reviews sit on the {site.googleBusinessName} listing.
          </p>
          <p>
            We buy cars, utes, vans, 4WDs and trucks, running or not, including scrap, crashed and unregistered vehicles. You can{" "}
            <Link href="/contact-us">visit or call our Rocklea yard</Link>. This guide was reviewed by our yard team on {UPDATED_LABEL}, from parts demand, metal value and current Brisbane market prices.
          </p>
        </div>
      </section>

      <section className="section-site bg-sand">
        <div className="container-site grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="font-heading text-[34px] font-semibold leading-tight text-navy sm:text-[42px]">Get a firm price for your car.</p>
            <p className="mt-3 max-w-xl text-[18px]">
              Send the rego, the suburb and a few photos, or call {site.phoneDisplay}. {QUOTE_SPEED}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={site.phoneHref} className="btn-line">
                <PhoneIcon aria-hidden="true" className="h-5 w-5" />
                Call {site.phoneDisplay}
              </a>
              {site.smsNumber && (
                <a href={`sms:${site.smsNumber}`} className="btn-line">
                  <SmsIcon aria-hidden="true" className="h-5 w-5" />
                  Text us
                </a>
              )}
            </div>
          </div>
          <div data-quote className="quote-box scroll-mt-32">
            <QuoteForm />
          </div>
        </div>
      </section>

      <ReviewsBand />
    </>
  );
}
