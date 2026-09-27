import Image from "next/image";
import Link from "next/link";
import {
  siAudi, siBmw, siFord, siHonda, siHyundai, siJeep, siKia, siMazda, siMitsubishi, siNissan,
  siSubaru, siSuzuki, siTesla, siToyota, siVolkswagen, siVolvo,
} from "simple-icons";
import type { Block } from "@/lib/content";
import { services } from "@/lib/content";
import { areas, faqs, reviews, site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import {
  ArrowIcon, CashIcon, CheckIcon, ClipboardIcon, ClockIcon, LeafIcon, MailIcon, PhoneIcon, PinIcon, QuoteIcon,
  ShieldIcon, SmsIcon, StarIcon, TruckIcon,
} from "./icons";

export function SectionHead({ eyebrow, title, sub, light = false, center = true }: { eyebrow: string; title: string; sub?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${light ? "!text-brand-light" : ""}`}>{eyebrow}</p>
      <h2 className={`h-section mt-2 ${light ? "!text-white" : ""}`}>{title}</h2>
      {sub && <p className={`mt-3 text-lg ${light ? "text-white/75" : ""}`}>{sub}</p>}
    </div>
  );
}

export function TrustStrip() {
  const items = [
    { icon: CashIcon, title: "Paid on pickup", text: "Instant transfer before we tow" },
    { icon: TruckIcon, title: "Free towing", text: "No fees, no deductions" },
    { icon: ClockIcon, title: "Same-day pickup", text: "7 days a week" },
    { icon: ShieldIcon, title: "Any condition", text: "Running, wrecked or scrap" },
  ];
  return (
    <section className="relative z-10 -mt-8">
      <div className="container-site">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line shadow-xl lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3 bg-white p-4 sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-heading text-lg font-bold uppercase leading-tight text-navy">{title}</span>
                <span className="block text-sm">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const tileImages: Record<string, { image: string; alt: string }> = {
  "scrap-car-removal": { image: "/images/tile-scrap.jpg", alt: "Pile of crushed scrap cars" },
  "car-wreckers": { image: "/images/tile-wreckers.jpg", alt: "Salvaged car engines and parts" },
  "car-disposal": { image: "/images/tile-disposal.jpg", alt: "Old rusted car awaiting disposal" },
};

export function ServiceTiles() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHead eyebrow="What we do" title="Car removal services" sub="Whatever shape it's in, we'll make you an offer and tow it away for free." />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((s) => {
            const img = tileImages[s.slug];
            return (
              <Link key={s.slug} href={`/${s.slug}`} className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl text-white shadow-lg">
                <Image src={img.image} alt={img.alt} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/5" />
                <div className="relative p-6">
                  <h3 className="font-heading text-3xl font-extrabold uppercase leading-none">{s.tile}</h3>
                  <p className="mt-2 text-[15px] text-white/85">{s.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-2 font-heading font-bold uppercase tracking-wide text-brand-light">
                    Learn more <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: ClipboardIcon, title: "Ask for our price", text: `Call ${site.phoneDisplay} or send your car's make, model, year and condition.` },
    { icon: CashIcon, title: "Accept your offer", text: "Get a firm, no-obligation offer. The price we quote is the price we pay." },
    { icon: TruckIcon, title: "Get paid & towed", text: "Pick a time. We pay you on pickup and tow the car away for free." },
  ];
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="container-site">
        <SectionHead eyebrow="How it works" title="Sold in 3 easy steps" sub="No ads, no tyre-kickers, no haggling." />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card relative p-7 pt-9">
              <span className="absolute -top-5 left-7 grid h-10 w-10 place-items-center rounded-xl bg-navy font-heading text-xl font-extrabold text-brand-light">{i + 1}</span>
              <Icon className="h-10 w-10 text-brand" />
              <h3 className="mt-4 font-heading text-2xl font-bold uppercase text-navy">{title}</h3>
              <p className="mt-2">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link href="#ask-for-our-price" className="btn-brand">Get my free quote <ArrowIcon className="h-5 w-5" /></Link>
        </div>
      </div>
    </section>
  );
}

export function ConditionChips() {
  const chips = ["Running or not", "Accident damaged", "Flood & hail damaged", "Fire damaged", "Unregistered", "No roadworthy", "High kilometres", "Rusty & scrap", "Written-off", "Missing keys"];
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {chips.map((c) => (
        <li key={c} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-navy">
          <CheckIcon className="h-4 w-4 text-money" /> {c}
        </li>
      ))}
    </ul>
  );
}

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-12">
      {blocks.map((b) => (
        <div key={b.heading}>
          <h2 className="h-section">{b.heading}</h2>
          <div className="prose-site">
            {b.paras?.map((p) => <p key={p}>{p}</p>)}
          </div>
          {b.list && (
            <ul className="mt-5 grid gap-3">
              {b.list.map((l) => (
                <li key={l.bold} className="flex gap-3 rounded-xl bg-cream p-4">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white"><CheckIcon className="h-4 w-4" /></span>
                  <span><b className="text-navy">{l.bold}</b> — {l.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function AreasGrid() {
  return (
    <section id="areas" className="scroll-mt-32 py-16 sm:py-20">
      <div className="container-site">
        <SectionHead eyebrow="Service areas" title="Free car removal near you" sub="Our tow trucks cover South East Queensland and the Tweed." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <Link key={a.slug} href={`/locations/${a.slug}`} className="card group p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-heading text-2xl font-bold uppercase text-navy">
                  <PinIcon className="h-5 w-5 text-brand" /> {a.name}
                  <span className="text-sm font-semibold text-body">{a.state}</span>
                </h3>
                <ArrowIcon className="h-5 w-5 text-body transition group-hover:translate-x-1 group-hover:text-brand" />
              </div>
              <p className="mt-2 text-sm">{a.suburbs.slice(0, 5).join(" · ")} &amp; surrounds</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <div id="faq" className="scroll-mt-32">
      <SectionHead eyebrow="FAQ" title="Questions? Answered." center={false} />
      <div className="mt-8 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="card group p-5 open:border-brand open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-xl font-bold uppercase text-navy">
              {f.q}
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-xl text-brand transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CallUsAndTerms({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={`grid gap-6 ${stacked ? "" : "md:grid-cols-2"}`}>
      <div className="rounded-2xl bg-navy p-7 text-white/80">
        <h2 className="font-heading text-2xl font-bold uppercase text-white">How you get paid</h2>
        <p className="mt-3">
          Payment is made on pickup by instant bank transfer, before we tow. Where state law restricts cash payments for scrap
          vehicles (such as in NSW), we pay by electronic transfer only.
        </p>
        <a href={site.phoneHref} className="mt-5 inline-flex items-center gap-2 font-heading text-2xl font-bold text-brand-light">
          <PhoneIcon className="h-6 w-6" /> {site.phoneDisplay}
        </a>
        <p className="text-sm">Open {site.hours}</p>
      </div>
      <div className="card p-7">
        <h2 className="font-heading text-2xl font-bold uppercase text-navy">What to have ready</h2>
        <ol className="mt-3 space-y-2">
          {[
            "You must own the vehicle, and it must be free of any debt, finance or encumbrance.",
            "Proof of ownership (e.g. registration papers).",
            "Photo ID — a valid driver's licence or passport.",
            "Your BSB and account number for payment by bank transfer.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3">
              <span className="font-heading text-lg font-extrabold text-brand">{i + 1}.</span> <span>{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function AskForPrice() {
  return (
    <section id="ask-for-our-price" className="scroll-mt-32 bg-cream py-16 sm:py-20">
      <div className="container-site">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative min-w-0 bg-navy p-6 text-white sm:p-10">
            <p className="eyebrow !text-brand-light">Free quote</p>
            <h2 className="mt-2 font-heading text-4xl font-extrabold uppercase leading-none sm:text-5xl">Ask for our price</h2>
            <p className="mt-4 text-white/75">Send us your car&apos;s details and we&apos;ll come back with a cash offer — usually within the hour.</p>
            <ul className="mt-8 space-y-4">
              <li>
                <a href={site.phoneHref} className="flex items-center gap-3 font-heading text-2xl font-bold">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand"><PhoneIcon className="h-5 w-5" /></span> {site.phoneDisplay}
                </a>
              </li>
              {site.smsNumber && (
                <li>
                  <a href={`sms:${site.smsNumber}`} className="flex items-center gap-3 font-semibold">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><SmsIcon className="h-5 w-5" /></span> Text us photos of your car
                  </a>
                </li>
              )}
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 font-semibold">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10"><MailIcon className="h-5 w-5" /></span> <span className="break-all">{site.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 font-semibold">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10"><ClockIcon className="h-5 w-5" /></span> {site.hours}
              </li>
            </ul>
          </div>
          <div className="min-w-0 p-6 sm:p-10">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function ReviewsBand() {
  const hasReviews = reviews.length > 0;
  const why = [
    { icon: CashIcon, title: "Top cash, paid on pickup", text: "Fair offers based on today's parts and metal prices. The price we quote is the price we pay." },
    { icon: ClockIcon, title: "Same-day removals", text: "Pickups 7 days a week across the Gold Coast, Brisbane and South East Queensland." },
    { icon: LeafIcon, title: "Eco-friendly recycling", text: "Fluids drained safely, good parts reused and metal recycled — nothing dumped." },
  ];
  return (
    <section className="bg-navy py-16 sm:py-20">
      <div className="container-site">
        <SectionHead light eyebrow={hasReviews ? "Reviews" : "Why us"} title={hasReviews ? "What our customers say" : "Why customers choose us"} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {hasReviews
            ? reviews.slice(0, 3).map((r) => (
                <figure key={r.name + r.text.slice(0, 10)} className="rounded-2xl bg-white p-7">
                  <QuoteIcon className="h-8 w-8 text-brand" />
                  <div className="mt-3 flex gap-0.5 text-[#f5b301]">
                    {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} className="h-4 w-4" />)}
                  </div>
                  <blockquote className="mt-3">{r.text}</blockquote>
                  <figcaption className="mt-4 font-heading text-lg font-bold uppercase text-navy">
                    {r.name}{r.suburb && <span className="font-semibold normal-case text-body">, {r.suburb}</span>}
                  </figcaption>
                </figure>
              ))
            : why.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl bg-navy-800 p-7 ring-1 ring-white/10">
                  <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand text-white">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-heading text-2xl font-bold uppercase text-white">{title}</h3>
                  <p className="mt-2 text-white/70">{text}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

const makes = [
  siToyota, siMazda, siFord, siHyundai, siMitsubishi, siNissan, siKia, siSubaru,
  siVolkswagen, siHonda, siSuzuki, siBmw, siAudi, siJeep, siTesla, siVolvo,
];

export function MakesRow() {
  return (
    <section id="makes" className="py-16">
      <div className="container-site">
        <SectionHead eyebrow="All makes & models" title="We buy every make" />
        <ul className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {makes.map((m) => (
            <li key={m.slug} className="card flex flex-col items-center justify-center gap-2 px-2 py-4 transition hover:border-brand hover:shadow-md" title={m.title}>
              <svg role="img" viewBox="0 0 24 24" className="h-12 w-12 sm:h-14 sm:w-14" fill={`#${m.hex}`} aria-label={`${m.title} logo`}>
                <path d={m.path} />
              </svg>
              <span className="text-xs font-semibold">{m.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-body/70">
          Plus Holden, Isuzu, Lexus, Land Rover, Great Wall, LDV and every other make. Logos are trademarks of their
          respective owners and are shown only to identify the vehicles we buy; no affiliation is implied.
        </p>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-brand">
      <div className="container-site flex flex-col items-center gap-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <h2 className="font-heading text-4xl font-extrabold uppercase leading-none text-white sm:text-5xl">Turn that car into cash today</h2>
          <p className="mt-2 text-lg font-medium text-white/90">Free quote · Free towing · Paid on pickup</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={site.phoneHref} className="btn bg-navy text-white hover:bg-navy-800">
            <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
          </a>
          <Link href="#ask-for-our-price" className="btn bg-white text-navy hover:bg-white/90">
            Get my offer <ArrowIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
