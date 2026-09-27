import Link from "next/link";
import { AskForPrice, CallUsAndTerms, ContentBlocks, Faq, MakesRow, ReviewsBand, ServiceTiles } from "@/components/Blocks";
import { HeroArt } from "@/components/HeroArt";
import { HeroSlider } from "@/components/HeroSlider";
import { areas, faqs, site } from "@/lib/site";
import { heroSlides } from "@/lib/slides";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      <HeroSlider slides={heroSlides()} />
      <ServiceTiles />

      <section className="mt-10 bg-band py-10">
        <div className="container-site prose-site">
          <h2 className="h-section">Cash for cars Gold Coast &amp; Brisbane car removal</h2>
          <p>
            Got a broken, old, unwanted, crashed or scrap car you need gone? {site.name} makes it simple: one call, a fair
            cash offer, and a free tow away at a time that suits you. We buy <Link href="/cash-for-cars">cars for cash</Link>{" "}
            right across the Gold Coast, Brisbane, Logan, Ipswich, the Sunshine Coast and the Tweed.
          </p>
          <p>
            Call us on <a href={site.phoneHref}>{site.phoneDisplay}</a> or send us your car&apos;s details below, and we&apos;ll
            come back with an offer — usually within the hour.
          </p>
        </div>
      </section>

      <section className="container-site py-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="prose-site">
            <h2 className="h-section">Free car removal services across South East QLD</h2>
            <p>
              Our <Link href="/car-removals">car removal service</Link> is completely free. We never charge for towing and we
              never deduct it from your offer — even if the car doesn&apos;t start, has flat tyres or has been sitting for years.
            </p>
            <p>
              Unlike junkyards that charge you to take a car away, we pay you for it. Every vehicle has value in its parts and
              metal, and we pass that value on to you.
            </p>
          </div>
          <HeroArt cashOnly className="mx-auto w-full max-w-[380px]" />
        </div>

        <div className="mt-12">
          <ContentBlocks
            blocks={[
              {
                heading: "Simple, fast car removal process",
                paras: ["Selling your car to us takes three easy steps:"],
                list: [
                  { bold: "Ask for our price", text: "call us or fill in the quote form with your car's make, model, year and condition." },
                  { bold: "Accept or decline the offer", text: "we'll work out what your car is worth and give you a no-obligation offer. You're free to say no." },
                  { bold: "Get paid and towed", text: "accept the offer and we'll book a pickup time. We pay you on the spot and tow the car away for free." },
                ],
              },
              {
                heading: "We accept cars in any condition",
                paras: [
                  "Every make, every model, every condition. Whether it's roadworthy or not, running or not, registered or not — your car is worth something to us, and we'll make you an offer.",
                ],
              },
            ]}
          />
        </div>

        <div className="mt-10">
          <h2 className="h-sub">Car removal services we offer</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li><b className="text-ink">Scrap car removal</b> – end-of-life vehicles collected and recycled, however old or rusty. <Link className="font-semibold text-green hover:underline" href="/scrap-car-removal">Learn more</Link></li>
            <li><b className="text-ink">Accident car removal</b> – repairs cost more than the car is worth? We buy crashed cars as they are.</li>
            <li><b className="text-ink">Damaged car removal</b> – flood, hail and fire-damaged vehicles removed and paid for.</li>
            <li><b className="text-ink">Junk car removal</b> – whether it stopped last week or last decade, we&apos;ll collect it.</li>
            <li><b className="text-ink">Used car removal</b> – skip the trade-in lowball and get a fair cash price for your used car.</li>
          </ul>
        </div>

        <div id="areas" className="mt-10 scroll-mt-6">
          <h2 className="h-sub">Areas we service</h2>
          <p className="mt-2">Free car removal and cash for cars in:</p>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <li key={a.slug}>
                <Link href={`/locations/${a.slug}`} className="font-semibold text-green hover:underline">
                  Cash for cars {a.name}
                </Link>{" "}
                <span className="text-sm">({a.suburbs.slice(0, 3).join(", ")} &amp; more)</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12">
          <Faq />
        </div>
        <div className="mt-12">
          <CallUsAndTerms />
        </div>
      </section>

      <AskForPrice />
      <ReviewsBand />
      <MakesRow />
    </>
  );
}
