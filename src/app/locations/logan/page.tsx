import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta, RelatedLinks, ReviewsBand } from "@/components/Blocks";
import { AreaHero, FaqList, GuideTable, RichText, SuburbGroups, TextCta } from "@/components/AreaPage";
import { PhoneIcon } from "@/components/icons";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { QuoteLink } from "@/components/QuoteLink";
import { areaServiceGraph } from "@/lib/area-schema";
import { loganSuburbGroups, loganSuburbLabel, loganSuburbs } from "@/lib/areas/logan-suburbs";
import { site } from "@/lib/site";

const PATH = "/locations/logan";
const PRICE = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";
const COUNCIL = "https://www.logan.qld.gov.au/community/vehicles-and-parking/abandoned-vehicles";
const DESCRIPTION =
  "Cash for cars in Logan: scrap, old and damaged cars, utes, 4x4s, vans and trucks. Free towing, never deducted. Fast quotes on 0423 514 111.";
const DIRECT_ANSWER =
  "1800 Cash For Cars buys scrap, old and damaged cars, utes, vans and trucks right across the City of Logan, from Springwood and Beenleigh to Browns Plains, Jimboomba and Yarrabilba. Towing is always free and never taken off your price. Most scrap or non-running cars fetch $150 to $800, and running or damaged utes $1,000 to $5,500.";

const priceRows = [
  { vehicle: "Sedan, not running", price: "$300 – $800" },
  { vehicle: "SUV or 4WD, scrap", price: "$500 – $1,200" },
  { vehicle: "SUV or 4WD, late-model damaged", price: "$2,500 – $6,000+" },
  { vehicle: "Ute, scrap", price: "$300 – $1,400" },
  { vehicle: "Ute, running or damaged", price: "$1,000 – $5,500" },
  { vehicle: "Truck", price: "From $1,000" },
];

const faqs = [
  {
    q: "How much will you pay for my car in Logan?",
    a: "A non-running sedan is $300 to $800, a scrap ute is $300 to $1,400, and a running or damaged ute is $1,000 to $5,500. Every car is quoted individually, and towing is never deducted. Other rows are in our full scrap car price guide.",
    links: [{ phrase: "our full scrap car price guide", href: PRICE }],
  },
  {
    q: "Is car removal in Logan really free?",
    a: "Yes, always. Towing is free wherever the car is in Logan, and it is never deducted from the price. There is no removal fee and no charge by the kilometre. You are paid the quoted amount, by cash or bank transfer, before the car leaves.",
  },
  {
    q: "Can I sell an unregistered car that's parked on the street?",
    a: "Yes. Bring photo ID and proof of ownership and we tow it without registration or a roadworthy. A car left on a Logan road can be fined and impounded, as covered under an unregistered car in Logan. If the rego has lapsed, selling it and moving it is the simpler option. Pickups are often the same day.",
    links: [{ phrase: "unregistered car in Logan", href: "#unregistered-logan" }],
  },
  {
    q: "Will you take a car with no wheels or no keys?",
    a: "Yes. We buy cars with no wheels and cars with no keys across the City of Logan. Tell us which applies when you ask for a price, so the right truck is sent. A car that cannot roll can still be priced. Towing stays free and is never deducted. Payment is cash or bank transfer before the car leaves.",
  },
  {
    q: "Do you buy old utes and 4x4s in Logan?",
    a: "Yes. A scrap ute is $300 to $1,400 and a running or damaged ute is $1,000 to $5,500. A scrap SUV or 4WD is $500 to $1,200, and a late-model damaged one is $2,500 to $6,000+. A complete ute or 4x4 sits higher in its range when the engine and gearbox are intact. Each one is quoted on its own.",
  },
  {
    q: "Which parts of Logan do you cover?",
    a: "All 69 suburbs, from Rochedale South and Springwood down to Jimboomba, Flagstone and Yarrabilba. The names follow Logan City Council, including Beenleigh, Browns Plains and the southern acreage. Towing is free across that area and is never deducted. See Logan suburbs we cover for every name.",
    links: [{ phrase: "Logan suburbs we cover", href: "#logan-suburbs" }],
  },
];

export const metadata: Metadata = {
  title: { absolute: "Cash for Cars Logan | Free Car Removal, Any Condition" },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { url: PATH },
};

export default function LoganLocationPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Areas", path: "/locations" }, { name: "Logan", path: PATH }]} />
      <JsonLd data={areaServiceGraph({ path: PATH, name: "Cash for cars and free car removal in Logan", description: DESCRIPTION, city: "Logan, QLD", suburbs: loganSuburbs, faqs })} />

      <AreaHero h1="Cash for cars in Logan, with free car removal">
        <p className="mt-4 text-[18px] leading-relaxed">{DIRECT_ANSWER}</p>
        <p className="mt-3 text-[18px] leading-relaxed">
          Prices from our{" "}
          <Link href={PRICE} className="font-semibold text-navy underline underline-offset-4">
            price guide
          </Link>
          , updated <time dateTime="2026-10-20">20 October 2026</time>.
        </p>
        <div className="mt-4 flex flex-wrap gap-3" data-cta>
          <QuoteLink from="logan-hero" className="btn-brand">
            Get your price
          </QuoteLink>
          <a href={site.phoneHref} className="btn-line">
            <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            Call {site.phoneDisplay}
          </a>
        </div>
        <p className="mt-4 text-[18px] leading-relaxed">
          1800 Cash For Cars is part of{" "}
          <a href={site.parentUrl} className="font-semibold text-navy underline underline-offset-4">
            A Plus Car Removal
          </a>
          . We share its yard at 79B Breadwell St, Rocklea.
        </p>
      </AreaHero>

      <article className="container-site section-site max-w-3xl text-body" data-prose>
        <h2 id="where-logan" className="h-content scroll-mt-24">
          Where in Logan do we pick up from?
        </h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="We collect from all 69 suburbs of the City of Logan. The yard is in Rocklea, on Brisbane's southside, north of Logan, and it is not a Logan address. Free car removal in Brisbane runs from that yard. Pickups are often the same day. We book a time that suits you."
            links={[{ phrase: "Free car removal in Brisbane", href: "/car-removal-brisbane" }]}
          />
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Down Beaudesert Road and the Mount Lindesay Highway</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          West and south-west Logan follows Beaudesert Road onto the Mount Lindesay Highway: Browns Plains, Park Ridge, Greenbank, Jimboomba and Flagstone. Browns Plains is about 17 km by road from the yard. Jimboomba is about 36 km by road.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Along the Pacific Motorway</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Eastern Logan sits on the Pacific Motorway, reached via Kessels Road: Springwood, Shailer Park, Loganholme, Beenleigh and Eagleby. Springwood is about 18 km by road. Beenleigh is about 31 km by road.
        </p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Acreage and the semi-rural south</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          Munruben, Chambers Flat, Logan Village, Cedar Vale and Jimboomba acreage are larger blocks. A car or farm ute in a paddock can still be priced. Mention a gate, a long track or soft ground.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          <a href="#logan-suburbs" className="font-semibold text-navy underline underline-offset-4">
            See every Logan suburb we cover ↓
          </a>
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">How much will I get for my car in Logan?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">It depends on the vehicle and its condition. Here is what we typically pay.</p>
        <GuideTable
          rows={priceRows}
          caption={
            <>
              Guide prices, updated <time dateTime="2026-10-20">20 October 2026</time>. Every car is quoted individually; free towing is never deducted. Full table:{" "}
              <Link href={PRICE} className="font-semibold underline underline-offset-4">
                our full scrap car price guide
              </Link>
              .
            </>
          }
        />
        <p className="mt-4 text-[18px] leading-relaxed">The same guide applies in Logan as in Brisbane. Distance does not add a towing fee.</p>
        <h3 className="mt-8 font-heading text-[22px] font-semibold leading-tight text-navy">Old utes and 4x4s</h3>
        <p className="mt-3 text-[18px] leading-relaxed">
          A scrap ute is $300 to $1,400, and a running or damaged ute is $1,000 to $5,500. A scrap SUV or 4WD is $500 to $1,200, and a late-model damaged SUV or 4WD is $2,500 to $6,000+. A complete ute or 4x4 sits higher in that range when the engine and gearbox are intact and the parts are in demand.
        </p>
        <TextCta from="logan-price">Your car&apos;s not in the table? Send the rego and a few photos.</TextCta>

        <h2 id="unregistered-logan" className="h-content mt-12 scroll-mt-24">
          Can I sell an unregistered car in Logan?
        </h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="Yes. We tow it, so it does not need registration or a roadworthy. Have photo ID and proof of ownership ready. Logan City Council says it is an offence to park an unregistered vehicle on a road, or to abandon a vehicle on a road or in a public place, under Local Law No. 10 (Public Health) 1999. Council can fine the owner and impound the vehicle. If the registration has lapsed and the car is on the street, selling it and having it moved is simpler than leaving it there. After we collect the car, cancel your registration with the Queensland Government. The page explains the form and when number plates need to be handed in."
            links={[
              { phrase: "Logan City Council", href: COUNCIL },
              { phrase: "cancel your registration", href: QLD_CANCEL },
            ]}
          />
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">What cars do we buy in Logan?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          We buy scrap, old and damaged cars in Logan, plus utes, vans and trucks. Rust, a blown engine or accident damage does not rule a car out, and none of that adds a fee for the tow. We collect from houses, workplaces and the roadside.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          If it has failed a roadworthy and the repair quote is more than the car is worth, we price it as it is. You do not have to pay for those repairs first.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          No wheels, or it cannot roll: we buy cars with no wheels and cars with no keys. Tell us when you ask for a price, so the right truck comes.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Work utes, vans and trucks from Logan businesses are welcome, one vehicle or several. Vans start from $500 and trucks from $1,000. See{" "}
          <Link href="/truck-removal" className="font-semibold text-navy underline underline-offset-4">
            cash for trucks
          </Link>
          .
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          Junk and written-off cars are bought as well. See{" "}
          <Link href="/scrap-car-removal" className="font-semibold text-navy underline underline-offset-4">
            scrap car removal
          </Link>
          .
        </p>

        <h2 className="h-content mt-12 scroll-mt-24">How does selling your car in Logan work?</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-[18px] leading-relaxed">
          <li>Send the make, model, year, condition, suburb and how we reach the car, plus photos if you can. The rego helps. A photo of where it is parked helps too. Access includes a gate, a unit car park, or a car that sits off the street.</li>
          <li>Get your price. Quotes are fast, sometimes under a minute.</li>
          <li>Pick a pickup time. Pickups are often the same day, and you choose when we come.</li>
          <li>Get paid before the car leaves, in cash or by bank transfer. Towing is not deducted from that payment.</li>
        </ol>
        <p className="mt-4 text-[18px] leading-relaxed">
          Describe the car accurately, including damage and anything missing, so the price does not change when we arrive.
        </p>
        <TextCta from="logan-process">
          <QuoteLink from="logan-process-text" className="font-semibold text-navy underline underline-offset-4">
            Send us your car&apos;s details
          </QuoteLink>
        </TextCta>

        <h2 id="logan-suburbs" className="h-content mt-12 scroll-mt-24">
          Which Logan suburbs do we cover?
        </h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          The names follow Logan City Council&apos;s suburb list, each once. Tamborine is listed as the Logan side.
        </p>
        <SuburbGroups groups={loganSuburbGroups} label={loganSuburbLabel} />
        <p className="mt-6 text-[18px] leading-relaxed">
          See{" "}
          <Link href="/locations" className="font-semibold text-navy underline underline-offset-4">
            all the areas we cover
          </Link>
          .
        </p>

        <h2 id="logan-faq" className="h-content mt-12 scroll-mt-24">
          Logan car removal FAQs
        </h2>
        <FaqList items={faqs} />

        <h2 className="h-content mt-12 scroll-mt-24">Who is 1800 Cash For Cars?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          <RichText
            text="1800 Cash For Cars is part of A Plus Car Removal. We work only from the shared yard at 79B Breadwell St, Rocklea QLD 4106. Licensed through our parent company, A Plus Car Removal (QLD motor dealer licence 4253110). Call 0423 514 111 or email quotes@1800cashforcars.com.au. ABN 62 351 619 456. The yard opens Monday to Friday, 8am to 5pm, and Saturday, 8am to 2pm. Our yard is listed on Google as A Plus Car Removal. For cash for cars across Brisbane and South East QLD, use the homepage, or contact our Rocklea yard."
            links={[
              { phrase: "part of A Plus Car Removal", href: site.parentUrl },
              { phrase: "0423 514 111", href: site.phoneHref },
              { phrase: "quotes@1800cashforcars.com.au", href: `mailto:${site.email}` },
              { phrase: "cash for cars across Brisbane and South East QLD", href: "/" },
              { phrase: "our Rocklea yard", href: "/contact-us" },
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
