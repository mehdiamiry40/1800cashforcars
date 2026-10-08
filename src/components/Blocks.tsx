import Image from "next/image";
import Link from "next/link";
import {
  siAudi, siBmw, siFord, siHonda, siHyundai, siJeep, siKia, siMazda, siMitsubishi, siNissan,
  siSubaru, siSuzuki, siTesla, siToyota, siVolkswagen, siVolvo,
} from "simple-icons";
import type { Block } from "@/lib/content";
import { areaHref, areas, brisbaneSuburbs, faqs, reviews, site } from "@/lib/site";
import { vehicleVisuals } from "@/lib/vehicle-visuals";
import { QuoteForm } from "./QuoteForm";
import { QuoteLink } from "./QuoteLink";
import { Roo } from "./Roo";
import { ArrowIcon, CarIcon, CashIcon, CheckIcon, ChevronRight, ClipboardIcon, LeafIcon, PhoneIcon, PinIcon, QuoteIcon, TruckIcon } from "./icons";

const blockIcons = { car: CarIcon, truck: TruckIcon, cash: CashIcon, recycle: LeafIcon, paperwork: ClipboardIcon };

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
    { icon: ClipboardIcon, title: "Tell us about it", text: "Call, text or use the form." },
    { icon: CashIcon, title: "Get your price", text: "A firm quote. No obligation." },
    { icon: TruckIcon, title: "Paid & picked up", text: "Paid before we tow it away." },
  ];
  return (
    <section className="section-site">
      <div className="container-site">
        <SectionHead eyebrow="How it works" title="Three simple steps" />
        <ol className="mt-9 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="card-site flex flex-col items-center p-6 text-center">
              <div className="relative mb-5 grid h-28 w-28 place-items-center bg-brand/5 text-brand">
                <Icon aria-hidden="true" className="h-16 w-16" strokeWidth={1.5} />
                <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center bg-navy text-[13px] font-bold text-white">0{i + 1}</span>
              </div>
              <h3 className="h-sub">{title}</h3>
              <p className="mt-2 text-[15px]">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhatWeBuy() {
  const categories = [
    { visual: vehicleVisuals.cars, icon: CarIcon, title: "Cars & 4WDs", caption: "All makes. Running or not." },
    { visual: vehicleVisuals.commercial, icon: TruckIcon, title: "Utes, vans & trucks", caption: "Work vehicles and fleets." },
    { visual: vehicleVisuals.scrap, icon: LeafIcon, title: "Scrap & damaged", caption: "Old, crashed or unregistered." },
  ];
  return (
    <section className="section-site border-y border-line bg-sand">
      <div className="container-site">
        <SectionHead eyebrow="What we buy" title="Any vehicle. Any condition." />
        <ul className="mt-9 grid gap-5 sm:grid-cols-3">
          {categories.map(({ visual, icon: Icon, title, caption }) => (
            <li key={title} className="card-site overflow-hidden">
              <Image src={visual.image} alt={visual.alt} sizes="(min-width: 1160px) 357px, (min-width: 640px) calc((100vw - 88px) / 3), calc(100vw - 40px)" placeholder="blur" className="aspect-[3/2] h-auto w-full object-contain" />
              <div className="border-t border-line p-5">
                <div className="flex items-center gap-2.5">
                  <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-brand" />
                  <h3 className="h-sub text-[20px]">{title}</h3>
                </div>
                <p className="mt-2 text-[14px]">{caption}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center">
          <Link href="/truck-removal" className="text-[15px] font-semibold text-brand underline underline-offset-4">Truck removal</Link>
          <span className="mx-3 text-line">|</span>
          <Link href="/scrap-car-removal" className="text-[15px] font-semibold text-brand underline underline-offset-4">Scrap car removal</Link>
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
          <article key={b.heading} className="card-site p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center bg-brand/5 text-brand">
                <Icon aria-hidden="true" className="h-8 w-8" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <h2 className="h-sub">{b.heading}</h2>
                {(b.summary || b.paras?.[0]) && <p className="mt-2 text-[15px]">{b.summary ?? b.paras?.[0]}</p>}
              </div>
            </div>
            {b.list && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {b.list.map((l) => <li key={l.bold} className="border border-line bg-sand px-3 py-1.5 text-[13px] font-semibold text-navy">{l.bold}</li>)}
              </ul>
            )}
            {(b.paras?.length || b.list?.length) ? (
              <details className="group mt-4 border-t border-line pt-3">
                <summary aria-label={`Full details about ${b.heading}`} className="flex w-fit cursor-pointer list-none items-center gap-2 text-[14px] font-semibold text-brand">
                  Full details <ChevronRight aria-hidden="true" className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <div className="prose-site text-[15px]">
                  {b.paras?.map((p) => <p key={p}>{p}</p>)}
                  {b.list && <ul className="mt-4 space-y-3">{b.list.map((l) => <li key={l.bold}><b className="text-navy">{l.bold}.</b> {l.text.charAt(0).toUpperCase() + l.text.slice(1)}</li>)}</ul>}
                </div>
              </details>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function AreasGrid({ showBrisbane = false }: { showBrisbane?: boolean }) {
  return (
    <section id="areas" className="section-site scroll-mt-24 border-t border-line">
      <div className="container-site">
        <SectionHead eyebrow="Our service areas" title="We come to you" intro="Brisbane, the Gold Coast and South East Queensland." />
        <ul className="mx-auto mt-9 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={areaHref(a)}
                className="card-site flex h-full flex-col items-center gap-3 px-4 py-5 text-center text-[15px] font-semibold text-navy transition-colors hover:border-brand hover:bg-sand"
              >
                <PinIcon aria-hidden="true" className="h-9 w-9 text-brand" strokeWidth={1.5} /> {a.name}
              </Link>
            </li>
          ))}
        </ul>
        {showBrisbane && (
          <details className="group/coverage mx-auto mt-5 max-w-4xl border border-line bg-sand px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-navy">
              Brisbane suburb coverage <ChevronRight aria-hidden="true" className="h-4 w-4 text-brand transition-transform group-open/coverage:rotate-90" />
            </summary>
            <BrisbaneSuburbs />
          </details>
        )}
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
        <CashIcon aria-hidden="true" className="mb-4 h-10 w-10 text-brand" strokeWidth={1.5} />
        <h2 className="h-sub">Getting paid</h2>
        <p className="mt-2">
          Paid before your car leaves. Cash or bank transfer; bank transfer only in NSW.
        </p>
      </div>
      <div className="border border-line bg-sand p-6">
        <ClipboardIcon aria-hidden="true" className="mb-4 h-10 w-10 text-brand" strokeWidth={1.5} />
        <h2 className="h-sub">What you&apos;ll need</h2>
        <ul className="mt-2 space-y-1.5">
          {["Ownership papers, with no finance owing", "Photo ID", "Bank details for a transfer"].map((t) => (
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
          <span className="mx-auto grid h-28 w-28 place-items-center bg-white/5 text-brand-light lg:mx-0">
            <QuoteIcon aria-hidden="true" className="h-16 w-16" strokeWidth={1.5} />
          </span>
          <h2 className="mt-6 h-section !text-white">Your price. By text.</h2>
          <p className="mt-4 text-[17px] text-white/80">Usually within the hour. Free, with no obligation.</p>
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
    <div className={`mt-5 grid items-start gap-3 sm:grid-cols-2 ${narrow ? "" : "lg:grid-cols-4"}`}>
      {brisbaneSuburbs.map((g) => (
        <details key={g.region} className="group border border-line bg-white px-4 open:border-brand/40">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-[14px] font-semibold text-navy">
            <span className="flex items-center gap-2"><PinIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand" />{g.region}</span>
            <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-brand transition-transform group-open:rotate-90" />
          </summary>
          <p className="border-t border-line py-4 text-[14px] leading-relaxed">{g.suburbs.join(", ")}</p>
        </details>
      ))}
    </div>
  );
}
