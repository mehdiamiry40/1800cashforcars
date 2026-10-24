import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, RelatedLinks, ReviewsBand } from "@/components/Blocks";
import { AreaHero, FaqList, GuideTable, RichText, SuburbGroups, TextCta } from "@/components/AreaPage";
import { PhoneIcon } from "@/components/icons";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { QuoteLink } from "@/components/QuoteLink";
import { areaServiceGraph } from "@/lib/area-schema";
import { ipswichSuburbGroups, ipswichSuburbs } from "@/lib/areas/ipswich-suburbs";
import { pageOpenGraph, site } from "@/lib/site";

const PATH = "/locations/ipswich";
const PRICE = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";
const COUNCIL = "https://www.ipswich.qld.gov.au/Live/Roads-and-Parking/Abandoned-Vehicles";
const DESCRIPTION =
  "Cash for cars and car removal in Ipswich, Springfield, Ripley and Rosewood. Free towing, never deducted. Scrap and running cars, utes, trucks. 0423 514 111.";
const DIRECT_ANSWER =
  "Yes, we pay cash for unwanted cars, utes, vans and trucks anywhere in the City of Ipswich, from Goodna and Springfield to Rosewood and Marburg. Our Rocklea yard sits at the Brisbane end of the Ipswich Motorway, and towing is always free. A non-running sedan typically brings $300 to $800; trucks start from $1,000.";

const priceRows = [
  { vehicle: "Stripped shell", price: "$150 – $500" },
  { vehicle: "Small hatch, scrap", price: "$150 – $400" },
  { vehicle: "Sedan, not running", price: "$300 – $800" },
  { vehicle: "Older sedan or hatch, running", price: "$500 – $1,600" },
  { vehicle: "Van", price: "From $500" },
  { vehicle: "Truck", price: "From $1,000" },
];

const faqs = [
  {
    q: "How much cash can I get for my car in Ipswich?",
    a: "A scrap small hatch is $150 to $400, a non-running sedan is $300 to $800, and an older car that still runs is $500 to $1,600. Trucks start from $1,000. Every vehicle is quoted individually, and towing is free and never deducted. You can see all vehicle types in our price guide.",
    links: [{ phrase: "see all vehicle types in our price guide", href: PRICE }],
  },
  {
    q: "Do I need a roadworthy or current rego to sell my car?",
    a: "No. We tow the car, so a roadworthy and current registration are not required. You do need photo ID and proof of ownership. If an unregistered car is on a road or footpath, Ipswich City Council can treat it as abandoned and impound it for auction at Riverview. Payment is cash or bank transfer before the car is loaded.",
    links: [{ phrase: "Ipswich City Council", href: COUNCIL }],
  },
  {
    q: "Will you buy a car that's been in a flood?",
    a: "Yes, we buy a flood-damaged car as it is. The damage pulls the value toward scrap, because fewer parts can be reused. Tell us how high the water came. A non-running sedan is guided by $300 to $800, and a shell with little left is guided by $150 to $500.",
  },
  {
    q: "Do you collect from Rosewood, Marburg and Grandchester?",
    a: "Yes. Rural Ipswich is included, not only the localities near Goodna and Springfield. Rosewood, Marburg and Grandchester are on the run, and towing is free and never deducted however far out the car sits. Tell us about gates, tracks and soft ground before we book. Collection is usually within a day or two, at a time you choose.",
  },
  {
    q: "Is Ipswich covered by your Brisbane car removal service?",
    a: "Ipswich is its own city, west of Brisbane, and we cover both from the one yard. That yard sits at the Brisbane end of the Ipswich Motorway in Rocklea. See car removal across Brisbane for the Brisbane suburbs. This page is the Ipswich service. Towing is free in both cities and is never deducted.",
    links: [{ phrase: "car removal across Brisbane", href: "/car-removal-brisbane" }],
  },
  {
    q: "What documents do I need to sell my car in Ipswich?",
    a: "Bring photo ID and proof of ownership, such as the registration papers. If the papers are lost, tell us when you ask for a price. We can usually still sort it out once it is clear the car is yours. After collection, cancel the registration and your insurance. Use the Queensland registration cancellation page for the steps. You are paid before the car leaves.",
    links: [{ phrase: "Queensland registration cancellation page", href: QLD_CANCEL }],
  },
];

export const metadata: Metadata = {
  title: "Cash for Cars & Car Removal Ipswich",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: pageOpenGraph(PATH),
};

export default function IpswichLocationPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Areas", path: "/locations" }, { name: "Ipswich", path: PATH }]} />
      <JsonLd
        data={areaServiceGraph({
          path: PATH,
          name: "Cash for cars and car removal in Ipswich",
          description: DESCRIPTION,
          city: "Ipswich, QLD",
          suburbs: ipswichSuburbs,
          faqs,
        })}
      />

      <AreaHero h1="Cash for cars and car removal in Ipswich">
        <p className="mt-4 text-[18px] leading-relaxed">{DIRECT_ANSWER}</p>
        <p className="mt-3 text-[18px] leading-relaxed">
          Guide prices from our{" "}
          <Link href={PRICE} className="font-semibold text-navy underline underline-offset-4">
            price guide
          </Link>
          , updated <time dateTime="2026-10-20">20 October 2026</time>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3" data-cta>
          <QuoteLink from="ipswich-hero" className="btn-brand">
            Get your price
          </QuoteLink>
          <a href={site.phoneHref} className="btn-line">
            <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            Call {site.phoneDisplay}
          </a>
        </div>
        <p className="mt-4 text-[18px] leading-relaxed">
          We&apos;re part of{" "}
          <a href={site.parentUrl} className="font-semibold text-navy underline underline-offset-4">
            A Plus Car Removal
          </a>{" "}
          and work from the same yard at 79B Breadwell St, Rocklea.
        </p>
      </AreaHero>

      <article className="container-site section-site max-w-3xl" data-prose>
        <h2 className="h-content scroll-mt-24">How far into Ipswich do we come?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="We cover every locality in the City of Ipswich, including the rural west. The Ipswich Motorway starts at the Granard Road interchange in Rocklea and runs to Dinmore. Our yard is at the Rocklea end of that motorway, not on it, and we have no Ipswich address. Car removal across Brisbane includes Oxley and Darra on the way. Collection is usually within a day or two."
            links={[{ phrase: "Car removal across Brisbane", href: "/car-removal-brisbane" }]}
          />
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Goodna, Redbank and Springfield</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Goodna is about 16 km by road. Springfield Central is about 24 km by road, via the Ipswich Motorway and then the Centenary Motorway.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Central Ipswich, from Booval to Brassall</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Booval, the CBD and Brassall are further along. The CBD is about 30 km by road. Brassall continues on the Warrego Highway, and Dinmore is where the motorway meets the Warrego and Cunningham highways.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Ripley, Yamanto and the Cunningham Highway</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Ripley is about 34 km by road, with Yamanto on the same Cunningham Highway run. Deebing Heights and the estates around Ripley are included.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Rosewood, Marburg and the rural west</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Rosewood is about 52 km by road. Marburg and Grandchester are further west, off the Warrego and the Ipswich–Rosewood Road. Sheds, paddocks and old work vehicles are fine. Mention gates, tracks and soft ground. Distance does not add a towing fee.
        </p>
        <TextCta from="ipswich-rural">
          Out past Rosewood?{" "}
          <QuoteLink from="ipswich-rural-text" className="font-semibold text-navy underline underline-offset-4">
            Tell us about the vehicle
          </QuoteLink>
          . The tow&apos;s still free.
        </TextCta>

        <h2 className="h-content mt-12 scroll-mt-24">What is my car worth in Ipswich?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">What you get depends on the vehicle and the condition it is in.</p>
        <GuideTable
          rows={priceRows}
          caption={
            <>
              Guide prices, updated <time dateTime="2026-10-20">20 October 2026</time>. Every vehicle is quoted individually; towing is free and never deducted.{" "}
              <Link href={PRICE} className="font-semibold underline underline-offset-4">
                See all vehicle types in our scrap car price guide
              </Link>
              .
            </>
          }
        />
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Old and scrap cars</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          A complete car with its engine and catalytic converter sits higher than a stripped shell, which is $150 to $500. An older sedan or hatch that still runs is $500 to $1,600. Commodores, Falcons and Camrys can still hold parts and metal value. That is not a model price. See{" "}
          <Link href="/scrap-car-removal" className="font-semibold text-navy underline underline-offset-4">
            free scrap car removal
          </Link>{" "}
          if the car is only scrap.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Work vans and farm trucks</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Vans start from $500 and trucks from $1,000, each quoted on its own, including a farm truck parked up for years. See{" "}
          <Link href="/truck-removal" className="font-semibold text-navy underline underline-offset-4">
            cash for trucks
          </Link>{" "}
          for heavier vehicles. Ute and 4WD rows are not in this excerpt.
        </p>
        <TextCta from="ipswich-price">Not sure which row fits? Send a few photos.</TextCta>

        <h2 className="h-content mt-12 scroll-mt-24">Flood-damaged, unregistered and long-parked cars</h2>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Flood-damaged cars</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          We buy flood-damaged cars as they are. Water limits which parts can be reused, so the price moves toward the scrap end of the range. Tell us how high the water came. A non-running sedan is guided by $300 to $800.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">An unregistered car on the street</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          <RichText
            text="Ipswich City Council treats an unregistered vehicle parked on a road or footpath as abandoned. It can impound the vehicle, and impounded vehicles are auctioned from the council depot at Riverview. Selling and towing it first is usually simpler. You still need photo ID and proof of ownership."
            links={[{ phrase: "Ipswich City Council", href: COUNCIL }]}
          />
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">A car that hasn&apos;t moved in years</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Flat tyres or a seized engine are fine. Missing wheels or a missing key does not stop the purchase. Mention either one in the request and we will send a truck that can load the car. Describe shed or backyard access and we will set a time that suits you.
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">Car removal in Ipswich, step by step</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[18px] leading-relaxed">
          <li>Tell us the make, model, year and condition, where the vehicle is, and how a tow truck reaches it. On a rural block, add gates, tracks and soft ground.</li>
          <li>We send a price, and quotes are usually within the hour.</li>
          <li>Choose a day and time. Collection is usually within a day or two.</li>
          <li>You are paid before the car is loaded, in cash or by bank transfer. The tow is not deducted.</li>
          <li>
            <RichText
              text="Have photo ID with you on the day. If wheels or the key are missing, put that in the same message. Then cancel the registration and the insurance. The Queensland registration cancellation page sets out the form and when plates are handed in."
              links={[{ phrase: "Queensland registration cancellation page", href: QLD_CANCEL }]}
            />
          </li>
        </ol>

        <h2 id="ipswich-suburbs" className="h-content mt-12 scroll-mt-24">
          Ipswich suburbs we collect from
        </h2>
        <p className="mt-4 text-[18px] leading-relaxed">We follow Ipswich City Council&apos;s locality list, grouped by council division. Each locality is listed once.</p>
        <SuburbGroups groups={ipswichSuburbGroups} />
        <p className="mt-6 text-[18px] leading-relaxed">
          See{" "}
          <Link href="/locations" className="font-semibold text-navy underline underline-offset-4">
            every area we cover
          </Link>
          .
        </p>

        <h2 id="ipswich-faq" className="h-content mt-12 scroll-mt-24">
          Cash for cars Ipswich: common questions
        </h2>
        <FaqList items={faqs} />

        <h2 className="h-content mt-12 scroll-mt-24">About {site.name} and A Plus Car Removal</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text={`${site.name} is part of A Plus Car Removal. They share the yard at 79B Breadwell St, Rocklea QLD 4106. Most of these services differ from A Plus Car Removal's own pages, and towing here is always free and never deducted. ${site.licenceLine} Phone 0423 514 111, email quotes@1800cashforcars.com.au, ABN 62 351 619 456. Open weekdays 8am to 5pm and Saturdays 8am to 2pm. Our yard is listed on Google as A Plus Car Removal. See ${site.name}, or visit or call the Rocklea yard.`}
            links={[
              { phrase: "part of A Plus Car Removal", href: site.parentUrl },
              { phrase: "0423 514 111", href: site.phoneHref },
              { phrase: "quotes@1800cashforcars.com.au", href: `mailto:${site.email}` },
              { phrase: site.name, href: "/" },
              { phrase: "visit or call the Rocklea yard", href: "/contact-us" },
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
