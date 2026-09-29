import Link from "next/link";
import {
  siAudi, siBmw, siFord, siHonda, siHyundai, siJeep, siKia, siMazda, siMitsubishi, siNissan,
  siSubaru, siSuzuki, siTesla, siToyota, siVolkswagen, siVolvo,
} from "simple-icons";
import type { Block } from "@/lib/content";
import { areaHref, areas, brisbaneSuburbs, faqs, reviews, site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { Roo } from "./Roo";
import { VehicleIcon, vehicleTypes } from "./VehicleIcons";
import { ArrowIcon, CheckIcon, PhoneIcon, PinIcon, SmsIcon } from "./icons";

export function SectionHead({ title, intro, light = false, center = true }: { title: string; intro?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <h2 className={`h-section ${light ? "!text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-3 text-[18px] sm:text-[19px] ${light ? "text-white/80" : ""}`}>{intro}</p>}
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    { roo: <Roo hand="phone" className="relative h-64 w-auto" />, title: "Tell us about it", text: "Call, text a photo, or fill in the form." },
    { roo: <Roo hand="cash" className="relative h-64 w-auto" />, title: "Get a firm price", text: "No obligation. What we quote is what we pay." },
    { roo: <Roo pouchCar hop className="relative h-64 w-auto" />, title: "We hop over", text: "We pay you, then tow it away for free." },
  ];
  return (
    <section className="py-16 sm:py-24">
      <div className="container-site">
        <SectionHead title="Easy as 1, 2, 3" />
        <ol className="mt-12 grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="flex flex-col items-center border-t-4 border-ink pt-6 text-center">
              <div className="relative flex h-64 w-60 items-end justify-center">
                {s.roo}
              </div>
              <p className="mt-5 font-heading text-[15px] font-extrabold uppercase tracking-[0.15em] text-brand">Step {i + 1}</p>
              <h3 className="mt-1 font-heading text-[24px] font-extrabold text-ink">{s.title}</h3>
              <p className="mt-1 max-w-[260px]">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhatWeBuy() {
  return (
    <section className="bg-sand py-16 sm:py-24">
      <div className="container-site">
        <SectionHead title="Scrap, old or unwanted. We buy it." intro="Running or not, crashed, flooded, unregistered or rusted out. If it's taking up space, it's worth something." />
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-3 gap-4 sm:grid-cols-6">
          {vehicleTypes.map((v) => (
            <li key={v.key} className="flex flex-col items-center gap-2 border-2 border-line bg-white px-2 py-5">
              <VehicleIcon type={v.key} className="h-12 w-auto" />
              <span className="font-heading text-[15px] font-extrabold text-ink">{v.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/truck-removal" className="font-heading font-extrabold text-brand underline underline-offset-4">Selling a truck?</Link>
          <span className="mx-3 text-line">|</span>
          <Link href="/scrap-car-removal" className="font-heading font-extrabold text-brand underline underline-offset-4">Got a wreck?</Link>
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
          <h2 className="font-heading text-[28px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">{b.heading}</h2>
          <div className="prose-site text-[18px]">
            {b.paras?.map((p) => <p key={p}>{p}</p>)}
          </div>
          {b.list && (
            <ul className="mt-5 grid gap-3">
              {b.list.map((l) => (
                <li key={l.bold} className="flex gap-3 bg-sand px-5 py-4">
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
    <section id="areas" className="scroll-mt-24 py-16 sm:py-24">
      <div className="container-site">
        <SectionHead title="We hop all over South East Queensland" intro="Free pickup anywhere in these areas." />
        <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={areaHref(a)}
                className="flex items-center gap-2 border-2 border-ink bg-white px-5 py-3 font-heading text-[17px] font-bold text-ink transition hover:bg-ink hover:text-white"
              >
                <PinIcon className="h-5 w-5 text-rust" /> {a.name}
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
          <details key={f.q} className="group border-2 border-line bg-white px-6 open:border-ink">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-heading text-[18px] font-extrabold text-ink">
              {f.q}
              <span className="grid h-8 w-8 shrink-0 place-items-center bg-sand text-xl font-extrabold text-brand transition group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="pb-5 pr-6">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CallUsAndTerms({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={`grid gap-5 ${stacked ? "" : "md:grid-cols-2"}`}>
      <div className="border-2 border-line bg-sand p-7">
        <h2 className="h-sub">Getting paid</h2>
        <p className="mt-2">
          Cash or bank transfer, your choice, paid before the car leaves. In NSW (including Tweed Heads) it&apos;s bank transfer
          only.
        </p>
      </div>
      <div className="border-2 border-line bg-sand p-7">
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
    <section id="ask-for-our-price" className="scroll-mt-24 bg-navy py-16 text-white sm:py-24">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="text-center lg:text-left">
          <Roo hand="phone" className="mx-auto h-56 w-auto lg:mx-0" />
          <h2 className="mt-6 h-section !text-white">Let&apos;s talk cars</h2>
          <p className="mt-3 text-[18px] text-white/80">Calling is quickest. We answer 24/7.</p>
          <p className="mt-6">
            <a href={site.phoneHref} className="btn-brand !px-8 !py-4 !text-[20px]">
              <PhoneIcon className="h-6 w-6" /> Call Us
            </a>
          </p>
          {site.smsNumber && (
            <p>
              <a href={`sms:${site.smsNumber}`} className="inline-flex items-center gap-2 py-2 font-bold text-brand-light underline underline-offset-4">
                <SmsIcon className="h-5 w-5" /> Or text us a photo
              </a>
            </p>
          )}
        </div>
        <div className="bg-white p-6 text-body sm:p-9">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

export function ReviewsBand() {
  if (reviews.length === 0) return null;
  return (
    <section className="bg-sand py-16 sm:py-24">
      <div className="container-site">
        <SectionHead title="Happy sellers" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.name + r.text.slice(0, 10)} className="border-2 border-line bg-white p-7">
              <blockquote className="text-[18px] text-ink">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-3 font-heading font-extrabold">
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
    <section id="makes" className="py-14 sm:py-20">
      <div className="container-site">
        <h2 className="text-center font-heading text-[22px] font-extrabold text-ink">Every make, every model</h2>
        <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-4 gap-y-7 sm:grid-cols-8">
          {makes.map((m) => (
            <li key={m.slug} className="flex justify-center" title={m.title}>
              <svg role="img" viewBox="0 0 24 24" className="h-10 w-10 opacity-80 transition hover:opacity-100 sm:h-11 sm:w-11" fill={`#${m.hex}`} aria-label={`${m.title} logo`}>
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
    <section className="relative overflow-hidden border-t-4 border-ink bg-sand">
      <div className="container-site grid items-end gap-6 pt-12 sm:grid-cols-[1fr_auto] sm:pt-16">
        <div className="pb-12 text-center sm:pb-16 sm:text-left">
          <h2 className="h-section">Old car taking up space?</h2>
          <p className="mt-3 text-[18px]">Call Roo. We&apos;ll take it off your hands today.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
            <a href={site.phoneHref} className="btn-brand !px-7 !py-4 !text-[18px]">
              <PhoneIcon className="h-5 w-5" /> Call Us
            </a>
            <Link href="/#quote" className="btn-line !px-7 !py-4 !text-[18px]">
              Get a price online <ArrowIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <Roo hand="cash" pouchCar flip className="mx-auto h-64 w-auto sm:h-80" />
      </div>
    </section>
  );
}

// Brisbane suburbs grouped by side of town (used on the Brisbane-focused pages).
export function BrisbaneSuburbs({ narrow = false }: { narrow?: boolean }) {
  return (
    <div className={`mt-8 grid gap-8 sm:grid-cols-2 ${narrow ? "" : "lg:grid-cols-4"}`}>
      {brisbaneSuburbs.map((g) => (
        <div key={g.region} className="border-t-4 border-ink pt-4">
          <h3 className="font-heading text-[19px] font-bold text-ink">{g.region}</h3>
          <p className="mt-2 text-[15px] leading-relaxed">{g.suburbs.join(", ")}</p>
        </div>
      ))}
    </div>
  );
}
