import Link from "next/link";
import Image from "next/image";
import type { Block } from "@/lib/content";
import { services } from "@/lib/content";
import { faqs, reviews, site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CashIcon, ClockIcon, LeafIcon, StarIcon } from "./icons";

export function ServiceTiles() {
  const pictures = [
    "/images/vehicle-recycling.webp",
    "/images/vehicle-recycling.webp",
    "/images/car-removal-truck.webp",
  ];
  return (
    <section className="container-site py-16" aria-labelledby="services-title">
      <p className="eyebrow">A solution for every vehicle</p>
      <h2 id="services-title" className="h-section mt-3">
        Whatever its condition, let’s talk.
      </h2>
      <p className="mt-4 max-w-2xl">
        From the car that won’t start to the one you just don’t need. Explore
        how we can help.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => (
          <article
            key={service.slug}
            className="overflow-hidden rounded-xl border border-line bg-white"
          >
            <Image
              src={pictures[i]}
              alt=""
              width={600}
              height={400}
              sizes="(max-width: 767px) 100vw, 380px"
              className="aspect-[3/2] w-full object-cover"
            />
            <div className="p-6">
              <h3 className="h-sub">{service.tile}</h3>
              <p className="mt-3 text-sm">{service.blurb}</p>
              <Link
                href={`/${service.slug}`}
                className="mt-4 inline-flex min-h-11 items-center font-bold text-green underline underline-offset-4"
              >
                Explore {service.tile.toLowerCase()}{" "}
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs">AI-generated service illustrations.</p>
    </section>
  );
}

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((b) => (
        <div key={b.heading}>
          <h2 className="h-section">{b.heading}</h2>
          <div className="prose-site">
            {b.paras?.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {b.list && (
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {b.list.map((l) => (
                <li key={l.bold}>
                  <b className="text-ink">{l.bold}</b> – {l.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-6" aria-labelledby="faq-title">
      <p className="eyebrow">Good questions. Straight answers.</p>
      <h2 id="faq-title" className="h-section mt-3">
        Before you say goodbye to your car.
      </h2>
      <div className="mt-7 divide-y divide-line border-y border-line">
        {faqs.map((faq) => (
          <details key={faq.q}>
            <summary>{faq.q}</summary>
            <p className="max-w-3xl px-8 pb-6">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CallUsAndTerms() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="h-sub">Call us today</h2>
        <p className="mt-2">
          Get in touch today on{" "}
          <a
            href={site.phoneHref}
            className="font-bold text-green hover:underline"
          >
            {site.phoneDisplay}
          </a>{" "}
          for fast, friendly car removal and a fair cash offer. We&apos;re open{" "}
          {site.hours.toLowerCase()}.
        </p>
      </div>
      <p className="font-bold italic text-ink">
        Important information: payment is made on pickup by instant bank
        transfer. Where state law restricts cash payments for scrap vehicles
        (such as in NSW), we pay by electronic transfer only.
      </p>
      <div>
        <h2 className="h-sub">Terms and conditions:</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 font-bold text-ink">
          <li>
            The seller must be the owner of the vehicle, and the vehicle must be
            free of any debt, finance or encumbrance.
          </li>
          <li>
            We need proof of ownership of the vehicle (e.g. registration
            papers).
          </li>
          <li>
            We need photo ID (valid driver&apos;s licence or passport) for
            verification and our records.
          </li>
          <li>
            We need your BSB and account number to make payment by bank
            transfer.
          </li>
        </ol>
      </div>
    </div>
  );
}

export function AskForPrice() {
  return (
    <section
      id="ask-for-our-price"
      className="scroll-mt-6 bg-band py-14 sm:py-20"
      aria-labelledby="quote-title"
    >
      <div className="container-site grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">Let’s put a price on it</p>
          <h2 id="quote-title" className="h-section mt-3">
            Your next chapter
            <br />
            starts with a quote.
          </h2>
          <p className="mt-5 max-w-md">
            Tell us a little about your car. We’ll get back to you with a
            no-obligation offer and arrange pickup if you’re happy to go ahead.
          </p>
          <ul className="mt-7 space-y-3 text-sm font-semibold text-ink">
            <li>✓ Running or not, all makes and models</li>
            <li>✓ Free collection across our service areas</li>
            <li>✓ Payment when we collect your vehicle</li>
          </ul>
          <p className="mt-8 text-sm">
            Prefer a conversation?
            <br />
            <a
              href={site.phoneHref}
              className="inline-flex min-h-11 items-center font-heading text-2xl font-bold text-green underline underline-offset-4"
            >
              {site.phoneDisplay}
            </a>
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-8">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

export function ReviewsBand() {
  const hasReviews = reviews.length > 0;
  const why = [
    {
      icon: CashIcon,
      title: "Top cash, paid on pickup",
      text: "Fair offers based on today's parts and metal prices. The price we quote is the price we pay.",
    },
    {
      icon: ClockIcon,
      title: "Same-day removals",
      text: "Pickups 7 days a week across the Gold Coast, Brisbane and South East Queensland.",
    },
    {
      icon: LeafIcon,
      title: "Eco-friendly recycling",
      text: "Fluids drained safely, good parts reused and metal recycled — nothing dumped.",
    },
  ];
  return (
    <section className="bg-green py-12">
      <div className="container-site">
        <h2 className="text-center font-heading text-[30px] font-medium uppercase text-white sm:text-[36px]">
          {hasReviews ? "Customer reviews" : "Why customers choose us"}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hasReviews
            ? reviews.slice(0, 3).map((r) => (
                <figure
                  key={r.name + r.text.slice(0, 10)}
                  className="rounded-xl bg-white p-6"
                >
                  <div className="flex gap-0.5 text-[#f5b301]">
                    {Array.from({ length: 5 }, (_, i) => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-[15px]">{r.text}</blockquote>
                  <figcaption className="mt-3 font-heading text-lg font-bold text-ink">
                    {r.name}
                    {r.suburb && (
                      <span className="font-normal text-body">
                        , {r.suburb}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))
            : why.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl bg-white p-6">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-green/10 text-green">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold text-ink">
                    {title}
                  </h3>
                  <p className="mt-2">{text}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export function MakesRow() {
  const makes = [
    "Toyota",
    "Mazda",
    "Ford",
    "Holden",
    "Hyundai",
    "Nissan",
    "Mitsubishi",
    "Kia",
    "Subaru",
    "Volkswagen",
  ];
  return (
    <section className="border-b border-line py-8">
      <div className="container-site">
        <p className="text-center font-heading text-sm font-bold uppercase tracking-widest text-body">
          We buy all makes and models
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 font-heading text-xl font-bold uppercase text-[#59675e] sm:text-2xl">
          {makes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
