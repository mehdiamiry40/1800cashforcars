import Image from "next/image";
import quotePhoto from "@/assets/hero-car-truck-cash.png";
import Link from "next/link";
import {
  siAudi,
  siBmw,
  siFord,
  siHonda,
  siHyundai,
  siJeep,
  siKia,
  siMazda,
  siMitsubishi,
  siNissan,
  siSubaru,
  siSuzuki,
  siTesla,
  siToyota,
  siVolkswagen,
  siVolvo,
} from "simple-icons";
import type { Block } from "@/lib/content";
import {
  areaHref,
  areas,
  brisbaneSuburbs,
  faqs,
  reviews,
  site,
} from "@/lib/site";
import { vehicleVisuals } from "@/lib/vehicle-visuals";
import { QuoteForm } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";
import {
  CarIcon,
  CashIcon,
  CheckIcon,
  ChevronRight,
  ClipboardIcon,
  LeafIcon,
  PhoneIcon,
  PinIcon,
  TruckIcon,
} from "./icons";

const blockIcons = {
  car: CarIcon,
  truck: TruckIcon,
  cash: CashIcon,
  recycle: LeafIcon,
  paperwork: ClipboardIcon,
};

export function SectionHead({
  title,
  intro,
  eyebrow,
  light = false,
  center = false,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className={`eyebrow mb-3 ${light ? "text-white" : ""}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`h-section ${light ? "!text-white" : "!text-brand"}`}>
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-[17px] leading-relaxed sm:text-[18px] ${light ? "text-white/80" : ""}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    { Icon: ClipboardIcon, title: "Tell us about your car" },
    { Icon: CashIcon, title: "Get your price" },
    { Icon: TruckIcon, title: "Get paid. We collect." },
  ];
  return (
    <section aria-label="How it works" className="bg-brand text-white">
      <ol className="container-site grid gap-8 py-10 sm:grid-cols-3 sm:py-12">
        {steps.map(({ Icon, title }, i) => (
          <li key={title} className="flex items-center gap-4">
            <Icon
              aria-hidden="true"
              className="h-10 w-10 shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <span className="text-[24px] font-bold">0{i + 1}</span>
              <h2 className="text-[24px] font-bold leading-snug">{title}</h2>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function WhatWeBuy() {
  const categories = [
    {
      visual: vehicleVisuals.cars,
      icon: CarIcon,
      title: "Cars & 4WDs",
      caption: "All makes. Running or not.",
    },
    {
      visual: vehicleVisuals.commercial,
      icon: TruckIcon,
      title: "Utes, vans & trucks",
      caption: "Work vehicles and fleets.",
    },
    {
      visual: vehicleVisuals.scrap,
      icon: LeafIcon,
      title: "Scrap & damaged",
      caption: "Old, crashed or unregistered.",
    },
  ];
  return (
    <section className="section-site border-y border-line bg-sand">
      <div className="container-site">
        <SectionHead
          eyebrow="What we buy"
          title="Any vehicle. Any condition."
        />
        <ul className="mt-9 grid gap-5 sm:grid-cols-3">
          {categories.map(({ visual, icon: Icon, title, caption }) => (
            <li key={title} className="card-site overflow-hidden">
              <Image
                src={visual.image}
                alt={visual.alt}
                sizes="(min-width: 1160px) 357px, (min-width: 640px) calc((100vw - 88px) / 3), calc(100vw - 40px)"
                placeholder="blur"
                className="aspect-[3/2] h-auto w-full object-contain"
              />
              <div className="border-t border-line p-5">
                <div className="flex items-center gap-2.5">
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-brand"
                  />
                  <h3 className="h-sub text-[20px]">{title}</h3>
                </div>
                <p className="mt-2 text-[14px]">{caption}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link
            href="/truck-removal"
            className="text-[15px] font-semibold text-navy underline underline-offset-4"
          >
            Truck removal
          </Link>
          <span className="mx-3 text-line">|</span>
          <Link
            href="/scrap-car-removal"
            className="text-[15px] font-semibold text-navy underline underline-offset-4"
          >
            Scrap car removal
          </Link>
        </p>
      </div>
    </section>
  );
}

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b) => {
        const Icon = blockIcons[b.icon ?? "car"];
        return (
          <article key={b.heading} className="border-t-4 border-brand py-6">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center text-brand">
                <Icon
                  aria-hidden="true"
                  className="h-8 w-8"
                  strokeWidth={1.5}
                />
              </span>
              <div className="min-w-0">
                <h2 className="h-sub">{b.heading}</h2>
                {(b.summary || b.paras?.[0]) && (
                  <p className="mt-2 text-[18px]">
                    {b.summary ?? b.paras?.[0]}
                  </p>
                )}
              </div>
            </div>
            {b.list && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.list.map((l) => (
                  <li
                    key={l.bold}
                    className="border border-line bg-sand px-3 py-1.5 text-[13px] font-semibold text-navy"
                  >
                    {l.bold}
                  </li>
                ))}
              </ul>
            )}
            {b.paras?.length || b.list?.length ? (
              <details className="group mt-4 border-t border-line pt-3">
                <summary
                  aria-label={`Full details about ${b.heading}`}
                  className="flex w-fit cursor-pointer list-none items-center gap-2 text-[14px] font-semibold text-navy"
                >
                  Full details{" "}
                  <ChevronRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform group-open:rotate-90"
                  />
                </summary>
                <div className="prose-site text-[18px]">
                  {b.paras?.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  {b.list && (
                    <ul className="mt-4 space-y-3">
                      {b.list.map((l) => (
                        <li key={l.bold}>
                          <b className="text-navy">{l.bold}.</b>{" "}
                          {l.text.charAt(0).toUpperCase() + l.text.slice(1)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function AreasGrid({
  showBrisbane = false,
}: {
  showBrisbane?: boolean;
}) {
  return (
    <section
      id="areas"
      className="section-site scroll-mt-24 border-t border-line"
    >
      <div className="container-site">
        <SectionHead
          eyebrow="Our service areas"
          title="We come to you"
          intro="Brisbane, the Gold Coast and South East Queensland."
        />
        <ul className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={areaHref(a)}
                className="card-site flex h-full flex-col items-center gap-3 px-4 py-5 text-center text-[15px] font-semibold text-navy transition-colors hover:border-brand hover:bg-sand"
              >
                <PinIcon
                  aria-hidden="true"
                  className="h-9 w-9 text-brand"
                  strokeWidth={1.5}
                />{" "}
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
        {showBrisbane && (
          <details className="group/coverage mx-auto mt-5 max-w-4xl border border-line bg-sand px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-navy">
              Brisbane suburb coverage{" "}
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4 text-brand transition-transform group-open/coverage:rotate-90"
              />
            </summary>
            <BrisbaneSuburbs />
          </details>
        )}
      </div>
    </section>
  );
}

export function Faq({
  bare = false,
  limit,
  items = faqs,
}: {
  bare?: boolean;
  limit?: number;
  items?: { q: string; a: string }[];
}) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <div id={bare ? undefined : "faq"} className="scroll-mt-24">
      {!bare && <SectionHead title="Questions" center={false} />}
      <div className={`divide-y divide-line ${bare ? "" : "mt-6"}`}>
        {list.map((f) => (
          <details key={f.q} className="group bg-white px-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[18px] font-semibold leading-relaxed text-navy sm:text-[20px]">
              {f.q}
              <span
                className="grid h-8 w-8 shrink-0 place-items-center border border-line text-xl font-semibold text-navy transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="pb-5 pr-6 text-[18px]">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CallUsAndTerms({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={`grid gap-5 ${stacked ? "" : "md:grid-cols-2"}`}>
      <div className="border border-line bg-sand p-6">
        <CashIcon
          aria-hidden="true"
          className="mb-4 h-10 w-10 text-brand"
          strokeWidth={1.5}
        />
        <h2 className="h-sub">Getting paid</h2>
        <p className="mt-2">
          Paid before your car leaves. Cash or bank transfer; bank transfer only
          in NSW.
        </p>
      </div>
      <div className="border border-line bg-sand p-6">
        <ClipboardIcon
          aria-hidden="true"
          className="mb-4 h-10 w-10 text-brand"
          strokeWidth={1.5}
        />
        <h2 className="h-sub">What you&apos;ll need</h2>
        <ul className="mt-2 space-y-1.5">
          {[
            "Ownership papers, with no finance owing",
            "Photo ID",
            "Bank details for a transfer",
          ].map((t) => (
            <li key={t} className="flex gap-2">
              <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AskForPrice({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section-site">
      <div className="container-site grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative min-h-72 lg:min-h-[460px]">
          <Image
            src={quotePhoto}
            alt="A tow truck, an old blue car and cash on a white background"
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-contain"
          />
        </div>
        <div id="get-price" data-quote className="min-w-0 scroll-mt-32">
          <h2 className="h-section">
            <span className="text-brand">Let’s talk</span> about your car.
          </h2>
          <p className="mb-6 mt-3">Free quote. Free pickup. No obligation.</p>
          <QuoteForm variant={compact ? "compact" : "full"} />
        </div>
      </div>
    </section>
  );
}

export function ReviewsBand() {
  if (reviews.length === 0) return null;
  return (
    <section className="section-site bg-sand">
      <div className="container-site">
        <SectionHead title="Happy sellers" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure
              key={r.name + r.text.slice(0, 10)}
              className="card-site p-6"
            >
              <blockquote className="text-[18px] text-ink">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 font-semibold text-navy">
                {r.name}
                {r.suburb && `, ${r.suburb}`}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const makes = [
  siToyota,
  siMazda,
  siFord,
  siHyundai,
  siMitsubishi,
  siNissan,
  siKia,
  siSubaru,
  siVolkswagen,
  siHonda,
  siSuzuki,
  siBmw,
  siAudi,
  siJeep,
  siTesla,
  siVolvo,
];

export function MakesRow() {
  return (
    <section id="makes" className="section-site border-t border-line">
      <div className="container-site">
        <h2 className="h-sub text-center">Every make, every model</h2>
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-4 gap-y-7 sm:grid-cols-8">
          {makes.map((m) => (
            <li key={m.slug} className="flex justify-center" title={m.title}>
              <svg
                role="img"
                viewBox="0 0 24 24"
                className="h-9 w-9 text-body/65 transition-colors hover:text-navy sm:h-10 sm:w-10"
                fill="currentColor"
                aria-label={`${m.title} logo`}
              >
                <path d={m.path} />
              </svg>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-body">
          Logos are trademarks of their owners and only show which vehicles we
          buy. We&apos;re not affiliated with any manufacturer.
        </p>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section-site bg-navy text-white">
      <div className="container-site grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="font-heading text-[34px] font-bold leading-tight sm:text-[42px]">
            Old car taking up space?
          </h2>
          <p className="mt-3 max-w-lg text-[20px]">
            Get a free quote. We’ll arrange pickup and pay you before your car
            leaves.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <QuoteLink from="final-cta" className="btn-brand">
            Get a free quote
          </QuoteLink>
          <a
            href={site.phoneHref}
            className="btn border border-white hover:bg-white hover:text-navy"
          >
            <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function BrisbaneSuburbs({ narrow = false }: { narrow?: boolean }) {
  return (
    <div
      className={`mt-5 grid items-start gap-3 sm:grid-cols-2 ${narrow ? "" : "lg:grid-cols-4"}`}
    >
      {brisbaneSuburbs.map((g) => (
        <details
          key={g.region}
          className="group border border-line bg-white px-4 open:border-brand/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[14px] font-semibold text-navy">
            <span className="flex items-center gap-2">
              <PinIcon
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-brand"
              />
              {g.region}
            </span>
            <ChevronRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-brand transition-transform group-open:rotate-90"
            />
          </summary>
          <p className="border-t border-line py-4 text-[14px] leading-relaxed">
            {g.suburbs.join(", ")}
          </p>
        </details>
      ))}
    </div>
  );
}
