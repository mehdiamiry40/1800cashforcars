import Link from "next/link";
import {
  siAudi, siBmw, siFord, siHonda, siHyundai, siJeep, siKia, siMazda, siMitsubishi, siNissan,
  siSubaru, siSuzuki, siTesla, siToyota, siVolkswagen, siVolvo,
} from "simple-icons";
import type { Block } from "@/lib/content";
import { areaHref, areas, brisbaneSuburbs, faqs, reviews, site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";
import { Roo } from "./Roo";
import { VehicleIcon, vehicleTypes } from "./VehicleIcons";
import { ArrowIcon, CheckIcon, PhoneIcon, PinIcon } from "./icons";

export function SectionHead({ title, intro, eyebrow, light = false, center = true }: { title: string; intro?: string; eyebrow?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className={`eyebrow mb-3 ${light ? "text-brand-light" : ""}`}>{eyebrow}</p>}
      <h2 className={`h-section ${light ? "!text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-4 text-[17px] leading-relaxed sm:text-[18px] ${light ? "text-white/80" : ""}`}>{intro}</p>}
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    { roo: <Roo hand="phone" className="h-24 w-auto" />, title: "Tell us about it", text: "Call, text a photo, or fill in the form." },
    { roo: <Roo hand="cash" className="h-24 w-auto" />, title: "Get a firm price", text: "No obligation. What we quote is what we pay." },
    { roo: <Roo pouchCar hop className="h-24 w-auto" />, title: "We pick it up", text: "We pay you, then tow it away for free." },
  ];
  return (
    <section className="section-site">
      <div className="container-site">
        <SectionHead eyebrow="How it works" title="Sell your car in three simple steps" />
        <ol className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {steps.map((s, i) => (
            <li key={s.title} className="card-site flex flex-col p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="font-display text-[40px] font-semibold leading-none text-brand">0{i + 1}</span>
                {s.roo}
              </div>
              <h3 className="h-sub">{s.title}</h3>
              <p className="mt-3">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhatWeBuy() {
  return (
    <section className="section-site border-y border-line bg-sand">
      <div className="container-site">
        <SectionHead eyebrow="What we buy" title="Scrap, old or unwanted. We buy it." intro="Running or not, crashed, flooded, unregistered or rusted out. If it's taking up space, it's worth something." />
        <ul className="mx-auto mt-9 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {vehicleTypes.map((v) => (
            <li key={v.key} className="card-site flex flex-col items-center gap-3 px-3 py-6">
              <VehicleIcon type={v.key} className="h-12 w-auto" />
              <span className="text-[14px] font-semibold text-navy">{v.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/truck-removal" className="text-[15px] font-semibold text-brand underline underline-offset-4">Selling a truck?</Link>
          <span className="mx-3 text-line">|</span>
          <Link href="/scrap-car-removal" className="text-[15px] font-semibold text-brand underline underline-offset-4">Got a wreck?</Link>
        </p>
      </div>
    </section>
  );
}

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-12">
      {blocks.map((b) => (
        <div key={b.heading}>
          <h2 className="h-content">{b.heading}</h2>
          <div className="prose-site text-[16px] sm:text-[17px]">
            {b.paras?.map((p) => <p key={p}>{p}</p>)}
          </div>
          {b.list && (
            <ul className="mt-5 grid gap-3">
              {b.list.map((l) => (
                <li key={l.bold} className="flex gap-3 border border-line bg-sand px-5 py-4">
                  <CheckIcon className="mt-1 h-5 w-5 shrink-0 text-brand" />
                  <span>
                    <b className="text-ink">{l.bold}.</b> {l.text.charAt(0).toUpperCase() + l.text.slice(1)}
                  </span>
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
    <section id="areas" className="section-site scroll-mt-24 border-t border-line">
      <div className="container-site">
        <SectionHead eyebrow="Our service areas" title="Free pickup across South East Queensland" intro="Local pickup, at a time that suits you." />
        <ul className="mx-auto mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={areaHref(a)}
                className="btn-line h-full w-full justify-start px-4 text-[14px] sm:text-[15px]"
              >
                <PinIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" /> {a.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ bare = false, limit, items = faqs }: { bare?: boolean; limit?: number; items?: { q: string; a: string }[] }) {
  const list = limit ? items.slice(0, limit) : items;
  return (
    <div id={bare ? undefined : "faq"} className="scroll-mt-24">
      {!bare && <SectionHead title="Questions" center={false} />}
      <div className={`space-y-3 ${bare ? "" : "mt-6"}`}>
        {list.map((f) => (
          <details key={f.q} className="group border border-line bg-white px-5 open:border-brand/40 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[15px] font-semibold leading-relaxed text-navy sm:text-[16px]">
              {f.q}
              <span className="grid h-7 w-7 shrink-0 place-items-center bg-sand text-xl font-semibold text-brand transition-transform group-open:rotate-45" aria-hidden="true">+</span>
            </summary>
            <p className="pb-5 pr-6 text-[15px]">{f.a}</p>
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
        <h2 className="h-sub">Getting paid</h2>
        <p className="mt-2">
          Cash or bank transfer, your choice, paid before the car leaves. In NSW (including Tweed Heads) it&apos;s bank transfer
          only.
        </p>
      </div>
      <div className="border border-line bg-sand p-6">
        <h2 className="h-sub">What you&apos;ll need</h2>
        <ul className="mt-2 space-y-1.5">
          {["Proof you own it (e.g. rego papers), with no finance owing", "Photo ID", "Bank details if you'd like a transfer"].map((t) => (
            <li key={t} className="flex gap-2">
              <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AskForPrice() {
  return (
    <section className="section-site bg-navy text-white">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="text-center lg:text-left">
          <p className="eyebrow text-brand-light">Your next step</p>
          <Roo hand="cash" className="mx-auto mt-5 h-28 w-auto lg:mx-0" />
          <h2 className="mt-5 h-section !text-white">Get a free quote</h2>
          <p className="mt-4 text-[17px] text-white/80">
            Tell us about the car and we&apos;ll text you a price, usually within the hour. No phone call needed.
          </p>
          <ul className="mx-auto mt-6 inline-grid gap-3 text-left text-[15px] lg:mx-0">
            {["Free and no obligation", "The price we quote is the price we pay", "Free towing, paid on pickup"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 shrink-0 text-brand-light" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px] text-white/70">
            Prefer to talk?{" "}
            <a href={site.phoneHref} className="font-bold text-white underline underline-offset-4">
              Call us
            </a>
            .
          </p>
        </div>
        <div id="get-price" data-quote className="quote-panel scroll-mt-24 text-body">
          <QuoteForm />
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
            <figure key={r.name + r.text.slice(0, 10)} className="card-site p-6">
              <blockquote className="text-[18px] text-ink">&ldquo;{r.text}&rdquo;</blockquote>
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
  siToyota, siMazda, siFord, siHyundai, siMitsubishi, siNissan, siKia, siSubaru,
  siVolkswagen, siHonda, siSuzuki, siBmw, siAudi, siJeep, siTesla, siVolvo,
];

export function MakesRow() {
  return (
    <section id="makes" className="section-site border-t border-line">
      <div className="container-site">
        <h2 className="h-sub text-center">Every make, every model</h2>
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-4 gap-y-7 sm:grid-cols-8">
          {makes.map((m) => (
            <li key={m.slug} className="flex justify-center" title={m.title}>
              <svg role="img" viewBox="0 0 24 24" className="h-9 w-9 text-body/65 transition-colors hover:text-navy sm:h-10 sm:w-10" fill="currentColor" aria-label={`${m.title} logo`}>
                <path d={m.path} />
              </svg>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-body">
          Logos are trademarks of their owners and only show which vehicles we buy. We&apos;re not affiliated with any manufacturer.
        </p>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section-site overflow-hidden border-b border-white/10 bg-navy text-white">
      <div className="container-site grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="text-center sm:text-left">
          <p className="eyebrow mb-3 text-brand-light">Ready when you are</p>
          <h2 className="h-section !text-white">Old car taking up space?</h2>
          <p className="mt-4 max-w-xl text-[17px] text-white/80">Get a free quote. We&apos;ll arrange pickup and pay you before your car leaves.</p>
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <QuoteLink from="final-cta" className="btn-brand">
              Get a free quote <ArrowIcon aria-hidden="true" className="h-4 w-4" />
            </QuoteLink>
            <a href={site.phoneHref} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-white underline underline-offset-4">
              <PhoneIcon aria-hidden="true" className="h-4 w-4 text-brand-light" /> {site.phoneDisplay}
            </a>
          </div>
        </div>
        <Roo hand="cash" pouchCar flip className="mx-auto hidden h-40 w-auto sm:block" />
      </div>
    </section>
  );
}

export function BrisbaneSuburbs({ narrow = false }: { narrow?: boolean }) {
  return (
    <div className={`mt-8 grid gap-8 sm:grid-cols-2 ${narrow ? "" : "lg:grid-cols-4"}`}>
      {brisbaneSuburbs.map((g) => (
        <div key={g.region} className="border-t-2 border-brand/60 pt-4">
          <h3 className="h-sub text-[20px]">{g.region}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{g.suburbs.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
