import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, JsonLd } from "@/components/JsonLd";
import { areaHref, areas, pageOpenGraph, site } from "@/lib/site";

const PATH = "/about";

export const metadata: Metadata = {
  title: "About Us, Our Rocklea Yard",
  description:
    "1800 Cash For Cars is part of A Plus Car Removal and shares the Rocklea yard. Free towing, payment before the car leaves, and cash offers across South East Queensland.",
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

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "About", path: PATH }]} />
      <JsonLd data={aboutLd} />
      {/* TODO(owner): yard, truck and team photos, a founding year, and reviews you are allowed to quote. */}
      <article className="container-site section-site max-w-3xl">
        <p className="eyebrow">About us</p>
        <h1 className="h-page mt-3">About our Rocklea yard</h1>
        <p className="mt-5 text-[18px] leading-relaxed">
          1800 Cash For Cars buys scrap, old and damaged cars, and it also buys utes, vans and trucks. The business is part of A Plus Car Removal. Both names use the same yard. This page says who we are, how a car is priced, and how to reach the yard.
        </p>

        <h2 className="h-content mt-12">Who is 1800 Cash For Cars?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          1800 Cash For Cars is the name on this website. It is part of{" "}
          <a href={site.parentUrl} className={linkClass}>
            A Plus Car Removal
          </a>
          , and the two share a yard rather than working from separate sites. When the yard is looked up on Google, the listing is published as A Plus Car Removal. That is the parent business. Selling a car through this site still means dealing with that Rocklea yard.
        </p>

        <h2 className="h-content mt-12">Are you licensed?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          {site.licenceLine} The licence belongs to the parent company. 1800 Cash For Cars does not hold that dealer licence in its own name, and this page does not say that it does. The ABN for 1800 Cash For Cars is {site.abn}. That is the number printed with this brand.
        </p>

        <h2 className="h-content mt-12">Where is your yard?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          The shared yard is at{" "}
          <a href={site.mapsUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
            {site.address}
          </a>
          . Rocklea sits on Brisbane&apos;s southside, which is why Brisbane, Logan and Ipswich collections are often the same day. Visits are to this address. We do not describe a second yard on this site.
        </p>

        <h2 className="h-content mt-12">What do you buy?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Scrap cars, old cars and damaged cars. Utes, vans and trucks as well. A car can be running or not, and it can be unregistered. It can have no keys, or no wheels, or both. Say what is missing when you ask for a price. The detail is on the{" "}
          <Link href="/car-removal-no-keys-no-wheels" className={linkClass}>
            no keys or no wheels
          </Link>{" "}
          page.
        </p>

        <h2 className="h-content mt-12">How do you work out a price?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Every car gets its own price. It depends on the make, model, year and condition, and on what the parts and the scrap metal are worth at the time. There is no single figure that covers every car. For scrap and non-running cars, the guide is the{" "}
          <Link href="/scrap-car-prices-brisbane" className={linkClass}>
            scrap car prices in Brisbane
          </Link>{" "}
          page. Those ranges are a guide. The firm price is the one we send for your car. Towing is not taken off that price.
        </p>
        <p className="mt-4 text-[18px] leading-relaxed">
          If you want a market estimate before you ask for a cash offer, you can{" "}
          <Link href="/autoval" className={linkClass}>
            check what your car is worth
          </Link>
          . That estimate is not an offer from us. The offer is the price we send after you tell us about the car.
        </p>

        <h2 className="h-content mt-12">Is the towing really free?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Yes. Towing is always free, and it is never deducted. We do not add a removal fee, and we do not charge by the kilometre inside the areas we cover. The quoted amount is the amount paid when the car matches what you told us. Free towing applies to scrap and damaged cars as well as to cars that still run.
        </p>

        <h2 className="h-content mt-12">How do you pay?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Cash or bank transfer, and the payment happens before the car leaves. You get a receipt. In Queensland you choose cash or a transfer. In NSW, including Tweed Heads, the law does not allow cash for scrap vehicles, so payment there is by bank transfer only. Bring bank details if the car is on that side of the border.
        </p>

        <h2 className="h-content mt-12">How fast can you pick up?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Pickups are often the same day. You choose the time. Quotes are sent very fast, sometimes in under a minute, and usually within minutes. Collections run Monday to Saturday. Brisbane, Logan and Ipswich are the closest runs to Rocklea. The Sunshine Coast and the Tweed are booked with you, usually within a day or two, and are often sooner on the Tweed.
        </p>

        <h2 className="h-content mt-12">Which areas do you cover?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
          Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. Each area has its own page. Brisbane removal is written up as free car removal. The others explain the local run, including bank transfer in the Tweed.
        </p>
        <ul className="mt-4 space-y-2 text-[18px]">
          {areas.map((area) => (
            <li key={area.slug}>
              <Link href={areaHref(area)} className={linkClass}>
                Cash for cars {area.name}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="h-content mt-12">How do I contact you?</h2>
        <p className="mt-4 text-[18px] leading-relaxed">
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
        </p>
      </article>
    </>
  );
}
