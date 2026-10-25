import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, RelatedLinks, ReviewsBand } from "@/components/Blocks";
import { AreaHero, FaqList, GuideTable, RichText, TextCta } from "@/components/AreaPage";
import { PhoneIcon } from "@/components/icons";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { QuoteLink } from "@/components/QuoteLink";
import { areaServiceGraph } from "@/lib/area-schema";
import { pageOpenGraph, site } from "@/lib/site";

const PATH = "/car-wreckers-gold-coast";
const PRICE = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";
const COUNCIL = "https://www.goldcoast.qld.gov.au/Services/Neighbourhood-issues/Abandoned-vehicles-goods";
const DESCRIPTION =
  "Sell your damaged, dead or old car to a Gold Coast car wrecker. Cars, utes, vans and trucks, keys or no keys. Free towing, paid before it leaves.";
const DIRECT_ANSWER =
  "We buy whole cars, utes, vans and trucks for cash, damaged or not. If your car is crashed, dead, flooded or worn out, we will pay for it anywhere on the Gold Coast, from Ormeau to Coolangatta. Towing is free and never deducted, and you are paid by cash or bank transfer before the car leaves.";

const priceRows = [
  { vehicle: "Stripped shell", price: "$150 – $500" },
  { vehicle: "Sedan, not running", price: "$300 – $800" },
  { vehicle: "Ute, scrap", price: "$300 – $1,400" },
  { vehicle: "Ute, running or damaged", price: "$1,000 – $5,500" },
  { vehicle: "SUV or 4WD, late-model damaged", price: "$2,500 – $6,000+" },
];

const faqs = [
  {
    q: "Do car wreckers on the Gold Coast pay for cars?",
    a: "Yes. A damaged or dead car usually still has value in its parts and its metal. We quote every car individually and pay before it leaves. The tow is free on the Gold Coast and is never taken off the price. Cash or bank transfer is your choice, with a receipt. A crashed, flooded or worn-out car can still be quoted.",
  },
  {
    q: "How much will a wrecker pay for my car?",
    a: "It depends on the car. A non-running sedan is $300 to $800, a scrap ute is $300 to $1,400, and a late-model damaged SUV or 4WD is $2,500 to $6,000+. Every vehicle is quoted on its own, and free towing is never deducted. The other rows, including a stripped shell at $150 to $500, are in the scrap car prices guide.",
    links: [{ phrase: "scrap car prices", href: PRICE }],
  },
  {
    q: "Will you buy a car with no keys or no wheels?",
    a: "Yes. We buy a car that has no keys, no wheels, or neither. Say what is missing in the quote so the collection matches the car. The detail sits on cars with no keys or no wheels. The Gold Coast tow is free and never deducted. Payment is cash or bank transfer before the car leaves.",
    links: [{ phrase: "cars with no keys or no wheels", href: "/car-removal-no-keys-no-wheels" }],
  },
  {
    q: "Is there a towing fee to Ashmore, Southport or Nerang?",
    a: `No. Towing is free anywhere on the Gold Coast, including Ashmore, Southport and Nerang, and it is never taken off the price. The yard is in Rocklea, about 69 km by road from Ashmore, and that distance does not add a fee. You pick the time. Pickups are ${site.pickupTurnaround}.`,
  },
  {
    q: "When do I get paid?",
    a: "Before the car leaves. You choose cash or a bank transfer on the Gold Coast, and you get a receipt. In NSW, including Tweed Heads, a scrap vehicle is paid by bank transfer only. The price we quote is the price we pay when the damage matches what you told us. Nothing is deducted for the tow.",
  },
];

export const metadata: Metadata = {
  title: "Car Wreckers Gold Coast, We Buy Your Car",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

export default function GoldCoastWreckersPage() {
  return (
    <>
      <Breadcrumbs
        trail={[
          { name: "Car wreckers", path: "/car-wreckers" },
          { name: "Gold Coast", path: PATH },
        ]}
      />
      <JsonLd
        data={areaServiceGraph({
          path: PATH,
          name: "Car wreckers on the Gold Coast",
          description: DESCRIPTION,
          serviceType: "Car wrecking and vehicle purchase",
          faqs,
          areaServed: [
            { "@type": "City", name: "Gold Coast, QLD" },
            { "@type": "Place", name: "Ashmore, QLD 4214" },
            { "@type": "Place", name: "Southport, QLD" },
            { "@type": "Place", name: "Bundall, QLD" },
            { "@type": "Place", name: "Benowa, QLD" },
            { "@type": "Place", name: "Carrara, QLD" },
            { "@type": "Place", name: "Nerang, QLD" },
            { "@type": "Place", name: "Molendinar, QLD" },
          ],
        })}
      />

      <AreaHero h1="Car wreckers on the Gold Coast: sell us your damaged car">
        <p className="mt-4 text-[18px] leading-relaxed">{DIRECT_ANSWER}</p>
        <p className="mt-3 text-[18px] leading-relaxed">
          Guide prices from our{" "}
          <Link href={PRICE} className="font-semibold text-navy underline underline-offset-4">
            price guide
          </Link>
          , updated <time dateTime="2026-10-20">20 October 2026</time>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3" data-cta>
          <QuoteLink from="gc-wreckers-hero" className="btn-brand">
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
          . Collection for the Gold Coast leaves from the yard at 79B Breadwell St, Rocklea.
        </p>
        <p className="mt-3 text-[18px] leading-relaxed">{site.licenceLine}</p>
      </AreaHero>

      <article className="container-site section-site max-w-3xl text-body" data-prose>
        <h2 className="h-content scroll-mt-24">What will a wrecker pay for my car on the Gold Coast?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">It depends on what is still worth something: the parts, the metal, or both.</p>
        <GuideTable
          rows={priceRows}
          caption={
            <>
              Guide prices, updated <time dateTime="2026-10-20">20 October 2026</time>. Every vehicle is quoted individually; free towing is never deducted. Full table:{" "}
              <Link href={PRICE} className="font-semibold underline underline-offset-4">
                scrap car prices
              </Link>
              .
            </>
          }
        />
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Parts value against metal value</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          The metal in the car sets a floor. A complete car, still with its engine, gearbox and catalytic converter, sits higher in the range than a stripped shell. Flood or fire damage pushes the offer toward that floor. Nothing on this page is a price for a named model.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="Gold Coast cars are priced on the same guide as Brisbane. The distance does not add a towing fee. Damaged cars in Brisbane are covered on our car wreckers page for Brisbane."
            links={[{ phrase: "our car wreckers page for Brisbane", href: "/car-wreckers" }]}
          />
        </p>
        <TextCta from="gc-wreckers-price">
          <QuoteLink from="gc-wreckers-price-text" className="font-semibold text-navy underline underline-offset-4">
            Send photos of the damage
          </QuoteLink>{" "}
          for a firmer price.
        </TextCta>

        <h2 className="h-content mt-12 scroll-mt-24">What condition can the car be in?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Crash damage and insurance write-offs are bought as they are. Tell us what is damaged, and the quote follows that description.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">A blown engine, a dead gearbox, or a car that will not start can still be priced.</p>
        <p className="mt-4 text-[18px] leading-relaxed">Flood damage and hail damage are included. Say how bad it is when you ask.</p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="A car with no keys or no wheels is bought too. The notes for that are on cars with no keys or no wheels."
            links={[{ phrase: "cars with no keys or no wheels", href: "/car-removal-no-keys-no-wheels" }]}
          />
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">Unregistered cars, and cars without a roadworthy, are towed. Registration is not required for the sale.</p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Utes, vans and trucks are bought as well as cars. Vans start from $500 and trucks from $1,000, each quoted on its own. See{" "}
          <Link href="/truck-removal" className="font-semibold text-navy underline underline-offset-4">
            cash for trucks
          </Link>
          .
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">Do you collect from Ashmore and the rest of the Gold Coast?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">Yes. Towing is free anywhere on the Gold Coast, including Ashmore and the suburbs around it.</p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Ashmore, postcode 4214, is bordered by Southport, Bundall, Benowa, Carrara, Nerang and Molendinar. Southport–Nerang Road runs along its northern edge, and the Pacific Motorway forms its short western boundary. The Nerang River bounds it to the south-west.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          The drive from the Rocklea yard follows the Pacific Motorway, then Southport–Nerang Road. Ashmore is about 69 km by road, Nerang about 66 km and Southport about 68 km. It is a long way from Rocklea, and the tow is still free.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Pickups are {site.pickupTurnaround}. We book a time that suits you. From Ormeau and Coomera down to Coolangatta and out through the hinterland, the places are listed under{" "}
          <Link href="/locations/gold-coast" className="font-semibold text-navy underline underline-offset-4">
            the Gold Coast suburbs we collect from
          </Link>
          .
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="Tweed Heads is in New South Wales, so payment there is by bank transfer only."
            links={[{ phrase: "Tweed Heads", href: "/locations/tweed-heads" }]}
          />
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">What if my car is unregistered or has a council sticker on it?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          We buy unregistered cars on the Gold Coast. The car is towed, so registration and a roadworthy are not required. Bring photo ID and proof of ownership.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="The City of Gold Coast says over 7,000 vehicles are reported abandoned across the city each year. A vehicle left on public land, such as a road or a nature strip, may be treated as abandoned, and most of them are unregistered. Officers may apply a bright yellow decal. If the owner does not move the vehicle onto private property, the City impounds it. The process can take up to 21 days. A vehicle still unclaimed a month after it is impounded is auctioned or disposed of. The holding yard is at Pimpama."
            links={[{ phrase: "City of Gold Coast", href: COUNCIL }]}
          />
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Selling a dead, unregistered car before that impound avoids the City&apos;s storage and release fees.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="After the pickup, cancel your registration and your insurance. The Queensland Government page explains how to lodge the cancellation and when the plates are handed in."
            links={[{ phrase: "cancel your registration", href: QLD_CANCEL }]}
          />
        </p>
        <TextCta from="gc-wreckers-sticker">Yellow decal already on the car? Tell us and we will book the pickup.</TextCta>

        <h2 className="h-content mt-12 scroll-mt-24">How does selling a car to a wrecker work?</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[18px] leading-relaxed">
          <li>Send the make, model, year, what is wrong with it, the suburb, and how a truck reaches it. Photos of the damage help.</li>
          <li>Get a firm price. Quotes are {site.quoteTurnaround}.</li>
          <li>Choose a pickup time. Pickups are {site.pickupTurnaround}.</li>
          <li>Get paid by cash or bank transfer before the car leaves, with a receipt. In Tweed Heads, which is in NSW, payment is by bank transfer only.</li>
          <li>Cancel the registration and the insurance.</li>
        </ol>
        <p className="mt-4 text-[18px] leading-relaxed">Describe the damage accurately and the price we quote is what we pay.</p>

        <h2 id="gc-wreckers-faq" className="h-content mt-12 scroll-mt-24">
          Gold Coast car wrecker questions
        </h2>
        <FaqList items={faqs} />

        <h2 className="h-content mt-12 scroll-mt-24">Who is {site.name}?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text={`Selling to ${site.name} means dealing with A Plus Car Removal at the Rocklea yard, 79B Breadwell St, Rocklea QLD 4106. ${site.licenceLine} The ABN is ${site.abn}. Reach the yard on ${site.phoneDisplay} or ${site.email}, weekdays 8am to 5pm and Saturday 8am to 2pm. Read about our Rocklea yard.`}
            links={[
              { phrase: "A Plus Car Removal", href: site.parentUrl },
              { phrase: site.phoneDisplay, href: site.phoneHref },
              { phrase: site.email, href: `mailto:${site.email}` },
              { phrase: "about our Rocklea yard", href: "/about" },
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
