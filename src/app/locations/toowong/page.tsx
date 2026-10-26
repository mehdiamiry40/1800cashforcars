import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, RelatedLinks, ReviewsBand } from "@/components/Blocks";
import { AreaHero, FaqList, GuideTable, RichText, TextCta } from "@/components/AreaPage";
import { PhoneIcon } from "@/components/icons";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { QuoteLink } from "@/components/QuoteLink";
import { areaServiceGraph } from "@/lib/area-schema";
import { pageOpenGraph, site } from "@/lib/site";

const PATH = "/locations/toowong";
const PRICE = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";
const COUNCIL = "https://www.brisbane.qld.gov.au/transport-and-parking/parking/illegally-parked-and-unmanaged-vehicles";
const DESCRIPTION =
  "Free car removal in Toowong, Auchenflower, Taringa and St Lucia. We buy scrap, old and damaged cars, utes, vans and trucks. Towing is never deducted.";
const DIRECT_ANSWER =
  "Yes, we collect cars free from anywhere in Toowong, from riverside unit blocks to the steep streets up towards Mount Coot-tha. Our Rocklea yard is about 11 km away by road. We buy scrap, old and damaged cars, utes, vans and trucks, and the towing is never taken off your price.";

const priceRows = [
  { vehicle: "Small hatch, scrap", price: "$150 – $400" },
  { vehicle: "Older sedan or hatch, running", price: "$500 – $1,600" },
  { vehicle: "SUV or 4WD, late-model damaged", price: "$2,500 – $6,000+" },
  { vehicle: "Van", price: "From $500" },
  { vehicle: "Truck", price: "From $1,000" },
];

const faqs = [
  {
    q: "Is car removal in Toowong really free?",
    a: "Yes. Towing is free anywhere in Toowong, and it is never taken off the price we quote. Payment is cash or bank transfer before the car leaves. Distance from the river up to the hills does not add a charge.",
  },
  {
    q: "How much cash will I get for my car in Toowong?",
    a: "It depends on the car. A scrap small hatch is $150 to $400, an older car that still runs is $500 to $1,600, and vans start from $500. Every car is quoted individually, and free towing is never deducted. See our price guide for the other rows.",
    links: [{ phrase: "our price guide", href: PRICE }],
  },
  {
    q: "How soon can you collect my car?",
    a: `Pickups are ${site.pickupTurnaround}. You choose a time, Monday to Saturday, and we book around that choice. Quotes are ${site.quoteTurnaround} once we have the make, model, year and where the car is parked in Toowong.`,
  },
  {
    q: "Do you buy unregistered cars or cars with no keys?",
    a: "Yes to both. We tow the car, so it does not need registration or a roadworthy, and a missing key does not stop the sale. Bring photo ID and proof of ownership. An unregistered car on a Toowong street can draw a fine under Brisbane City Council's Health, Safety and Amenity Local Law 2021.",
    links: [{ phrase: "unregistered car on a Toowong street", href: "#unregistered-toowong" }],
  },
  {
    q: "How do I get paid?",
    a: "You choose cash or a bank transfer, paid before the car leaves, and you receive a receipt. That applies to a Toowong pickup the same way it does across Queensland. The tow is not deducted. Describe the car accurately and the quoted price is the price paid.",
  },
];

const places = [
  "Toowong, QLD 4066",
  "Auchenflower, QLD",
  "Bardon, QLD",
  "Mount Coot-tha, QLD",
  "Taringa, QLD",
  "St Lucia, QLD",
  "Milton, QLD",
  "Paddington, QLD",
  "Indooroopilly, QLD",
];

export const metadata: Metadata = {
  title: "Free Car Removal Toowong & Cash for Cars",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

export default function ToowongLocationPage() {
  return (
    <>
      <Breadcrumbs
        trail={[
          { name: "Areas", path: "/locations" },
          { name: "Brisbane", path: "/car-removal-brisbane" },
          { name: "Toowong", path: PATH },
        ]}
      />
      <JsonLd
        data={areaServiceGraph({
          path: PATH,
          name: "Free car removal and cash for cars in Toowong",
          description: DESCRIPTION,
          faqs,
          areaServed: places.map((name) => ({ "@type": "Place", name })),
        })}
      />

      <AreaHero h1="Free car removal and cash for cars in Toowong">
        <p className="mt-4 text-[18px] leading-relaxed">{DIRECT_ANSWER}</p>
        <p className="mt-3 text-[18px] leading-relaxed">
          Prices from our{" "}
          <Link href={PRICE} className="font-semibold text-navy underline underline-offset-4">
            price guide
          </Link>
          , updated <time dateTime="2026-10-20">20 October 2026</time>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3" data-cta>
          <QuoteLink from="toowong-hero" className="btn-brand">
            Get your price
          </QuoteLink>
          <a href={site.phoneHref} className="btn-line">
            <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            Call {site.phoneDisplay}
          </a>
        </div>
        <p className="mt-4 text-[18px] leading-relaxed">
          {site.name} is part of{" "}
          <a href={site.parentUrl} className="font-semibold text-navy underline underline-offset-4">
            A Plus Car Removal
          </a>
          , and we work from the same yard at 79B Breadwell St, Rocklea.
        </p>
        <p className="mt-3 text-[18px] leading-relaxed">{site.licenceLine}</p>
      </AreaHero>

      <article className="container-site section-site max-w-3xl text-body" data-prose>
        <h2 className="h-content scroll-mt-24">Do you pick up cars in Toowong?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">Yes. We collect free from all of Toowong.</p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Toowong sits between Mount Coot-tha and the Brisbane River, about 6 km south-west of the CBD. Apartments line the river near Coronation Drive, and houses rise west toward the foothills.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Rocklea is about 11 km by road, up Sherwood Road and Oxley Road, then across the river. Pickups are {site.pickupTurnaround}.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Cash for trucks and vans in Toowong</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          We also buy utes, vans and trucks, one vehicle or several. Vans start from $500 and trucks from $1,000. See{" "}
          <Link href="/truck-removal" className="font-semibold text-navy underline underline-offset-4">
            cash for trucks
          </Link>
          .
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">Can you collect a car from a Toowong unit, basement or steep driveway?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Tell us about access when you ask for a price. The ground rises from the river toward Mount Coot-tha, and a steep driveway or tight street parking changes the booking.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[18px] leading-relaxed">
          <li>A steep or narrow driveway, a backyard, or a carport.</li>
          <li>Street parking, and whether a loading spot is nearby.</li>
          <li>Whether the car starts, steers and rolls.</li>
          <li>Whether it has keys and wheels.</li>
          <li>A unit complex: whether a fob, swipe or body corporate approval is needed.</li>
        </ul>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="We buy cars with no keys or no wheels. Say which is missing in the same message."
            links={[{ phrase: "cars with no keys or no wheels", href: "/car-removal-no-keys-no-wheels" }]}
          />
        </p>
        <TextCta from="toowong-access">Send a photo if the way in is tight.</TextCta>

        <h2 className="h-content mt-12 scroll-mt-24">How much will I get for my car in Toowong?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">It depends on the vehicle and its condition. Here is what we typically pay.</p>
        <GuideTable
          rows={priceRows}
          caption={
            <>
              Guide prices, updated <time dateTime="2026-10-20">20 October 2026</time>. Every vehicle is quoted individually, and free towing is never deducted. All vehicle types:{" "}
              <Link href={PRICE} className="font-semibold underline underline-offset-4">
                scrap car prices
              </Link>
              .
            </>
          }
        />
        <p className="mt-4 text-[18px] leading-relaxed">
          A Toowong car is priced on the same guide as the rest of Brisbane. An apartment block or a hill does not add a fee.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Make, model and year move the price, along with whether the car runs, whether the engine, gearbox and catalytic converter are still there, and the type of damage.
        </p>
        <TextCta from="toowong-price">Not sure which row fits? Send the rego and a few photos.</TextCta>

        <h2 id="unregistered-toowong" className="h-content mt-12 scroll-mt-24">
          Can I sell an unregistered car that&apos;s parked on a Toowong street?
        </h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Yes. We tow it, so it does not need registration or a roadworthy. Have photo ID and proof of ownership with you.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="Brisbane City Council says parking an unregistered vehicle on a road is an offence under the Health, Safety and Amenity Local Law 2021. The owner or last known registered owner may be fined. An unregistered, abandoned, unsightly or hazardous vehicle on a road, a footpath or in a park is unmanaged, and council can sticker, tow and impound it."
            links={[{ phrase: "Brisbane City Council", href: COUNCIL }]}
          />
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          A lapsed-rego car at the kerb can draw that fine, and selling it before council acts is simpler. If a yellow sticker is already on the windscreen, phone council, quote the reference number, and mention the sticker when you ask for a price.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="After the car is collected, cancel your registration and your insurance. The Queensland Government page explains the form and when number plates need to be handed in."
            links={[{ phrase: "cancel your registration", href: QLD_CANCEL }]}
          />
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">What cars do you buy in Toowong?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          We buy scrap, old and damaged cars, plus utes, vans and trucks, including cars that do not run, have no keys or wheels, or have no registration or roadworthy.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Crash-damaged cars and write-offs are bought as they are. See{" "}
          <Link href="/car-wreckers" className="font-semibold text-navy underline underline-offset-4">
            damaged cars our wreckers buy
          </Link>
          . Junk and end-of-life cars sit with{" "}
          <Link href="/scrap-car-removal" className="font-semibold text-navy underline underline-offset-4">
            scrap car removal
          </Link>
          .
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Moving out of a Toowong flat, or leaving after study at the University of Queensland in St Lucia? Tell us the date and we will book around it.
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">How does free car removal in Toowong work?</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[18px] leading-relaxed">
          <li>Message the make, model, year and condition, where the car is parked in Toowong, and how a truck gets to it.</li>
          <li>We reply with a firm price. Quotes are {site.quoteTurnaround}.</li>
          <li>Choose the pickup. Pickups are {site.pickupTurnaround}, at a time that suits you.</li>
          <li>Payment is cash or bank transfer before the car leaves, and you get a receipt.</li>
          <li>Cancel the registration and the insurance after the car has gone.</li>
        </ol>
        <p className="mt-4 text-[18px] leading-relaxed">Describe the car accurately and the price we quote is the price we pay.</p>
        <TextCta from="toowong-process">
          <QuoteLink from="toowong-process-text" className="font-semibold text-navy underline underline-offset-4">
            Send us the car&apos;s details
          </QuoteLink>
        </TextCta>

        <h2 className="h-content mt-12 scroll-mt-24">Which suburbs near Toowong do you cover?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="Toowong is part of the City of Brisbane, so this is the same service as free car removal across Brisbane."
            links={[{ phrase: "free car removal across Brisbane", href: "/car-removal-brisbane" }]}
          />
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Neighbouring suburbs are Auchenflower, Bardon, Mount Coot-tha, Taringa and St Lucia. Toowong is split between Paddington Ward and Walter Taylor Ward. Paddington Ward also covers Milton and Paddington. Walter Taylor Ward also covers Indooroopilly.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          By road from the Rocklea yard, Indooroopilly is about 9 km and Bardon is about 14 km.
        </p>

        <h2 id="toowong-faq" className="h-content mt-12 scroll-mt-24">
          Toowong car removal questions
        </h2>
        <FaqList items={faqs} />

        <h2 className="h-content mt-12 scroll-mt-24">Who is {site.name}?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text={`The crew who collect a Toowong car work from 79B Breadwell St, Rocklea QLD 4106, as ${site.name}, part of A Plus Car Removal. ${site.licenceLine} The ABN is ${site.abn}. Phone ${site.phoneDisplay} or email ${site.email}. Yard hours are weekdays 8am to 5pm and Saturday 8am to 2pm. Read more about our Rocklea yard.`}
            links={[
              { phrase: "part of A Plus Car Removal", href: site.parentUrl },
              { phrase: site.phoneDisplay, href: site.phoneHref },
              { phrase: site.email, href: `mailto:${site.email}` },
              { phrase: "more about our Rocklea yard", href: "/about" },
            ]}
          />
        </p>
      </article>

      <div className="container-site max-w-3xl pb-4">
        <RelatedLinks current={PATH} />
      </div>
      <ReviewsBand />
      <FinalCta />
    </>
  );
}
