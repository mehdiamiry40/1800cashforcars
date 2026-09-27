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
import { ArrowIcon, PhoneIcon, SmsIcon } from "./icons";

export function SectionHead({ title, intro, light = false }: { title: string; intro?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      <h2 className={`h-section ${light ? "!text-white" : ""}`}>{title}</h2>
      {intro && <p className={`mt-3 text-[19px] ${light ? "text-white/80" : ""}`}>{intro}</p>}
    </div>
  );
}

export function HowItWorks() {
  const steps = [
    { title: "Tell us about the car", text: `Call ${site.phoneDisplay}, send a text, or fill in the form. Year, make, model and what's wrong with it is enough.` },
    { title: "Get a price", text: "We'll give you a firm price. No obligation, and the price we quote is the price we pay." },
    { title: "We pick it up and pay you", text: "Choose a time. We check the car, pay you by bank transfer, and tow it away. No towing fee." },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHead title="How it works" />
        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t-4 border-navy pt-5">
              <span className="font-display text-[64px] font-extrabold leading-none text-brand">{i + 1}</span>
              <h3 className="h-sub mt-3">{s.title}</h3>
              <p className="mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const tileImages: Record<string, { image: string; alt: string }> = {
  "scrap-car-removal": { image: "/images/tile-scrap.jpg", alt: "Pile of crushed scrap cars" },
  "car-wreckers": { image: "/images/tile-wreckers.jpg", alt: "Salvaged car engines and parts" },
  "car-disposal": { image: "/images/tile-disposal.jpg", alt: "Old rusted car" },
};

export function ServiceTiles() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-site">
        <SectionHead title="Scrap, wrecked or just unwanted" intro="If it's taking up space, we'll make you an offer on it." />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {services.map((s) => {
            const img = tileImages[s.slug];
            return (
              <Link key={s.slug} href={`/${s.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={img.image} alt={img.alt} fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <h3 className="h-sub mt-4 group-hover:text-brand-dark">{s.tile}</h3>
                <p className="mt-1.5">{s.blurb}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand-dark underline underline-offset-2">
                  Read more <ArrowIcon className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-12">
      {blocks.map((b) => (
        <div key={b.heading}>
          <h2 className="h-section !text-[28px] sm:!text-[32px]">{b.heading}</h2>
          <div className="prose-site">
            {b.paras?.map((p) => <p key={p}>{p}</p>)}
          </div>
          {b.list && (
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {b.list.map((l) => (
                <li key={l.bold} className="py-3">
                  <b className="text-ink">{l.bold}.</b> {l.text.charAt(0).toUpperCase() + l.text.slice(1)}
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
        <SectionHead title="Where we pick up" intro="Free towing anywhere in these areas. If you're just outside them, call us anyway." />
        <ul className="mt-8 grid border-t border-line sm:grid-cols-2">
          {areas.map((a) => (
            <li key={a.slug} className="border-b border-line py-4 sm:odd:pr-8 sm:even:pl-8">
              <Link href={`/locations/${a.slug}`} className="font-heading text-[20px] font-bold text-ink underline decoration-line underline-offset-4 hover:text-brand-dark hover:decoration-brand">
                {a.name}, {a.state}
              </Link>
              <p className="mt-1 text-[15px]">{a.suburbs.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ bare = false }: { bare?: boolean }) {
  return (
    <div id={bare ? undefined : "faq"} className="scroll-mt-32">
      {!bare && <SectionHead title="Common questions" />}
      <div className={`border-t border-line ${bare ? "" : "mt-6"}`}>
        {faqs.map((f) => (
          <details key={f.q} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading text-[19px] font-semibold text-ink hover:text-brand-dark">
              {f.q}
              <span className="text-2xl font-normal text-brand-dark transition group-open:rotate-45">+</span>
            </summary>
            <p className="pb-5 pr-8">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function CallUsAndTerms({ stacked = false }: { stacked?: boolean }) {
  return (
    <div className={`grid gap-10 ${stacked ? "" : "md:grid-cols-2"}`}>
      <div>
        <h2 className="h-sub">Getting paid</h2>
        <p className="mt-2">
          We pay by bank transfer when we pick the car up, before it leaves your place. The money usually lands straight away,
          depending on your bank.
        </p>
      </div>
      <div>
        <h2 className="h-sub">What you&apos;ll need</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 marker:font-bold marker:text-brand-dark">
          <li>You need to own the car, and it can&apos;t have finance owing on it.</li>
          <li>Proof of ownership, like the rego papers.</li>
          <li>Photo ID (driver&apos;s licence or passport).</li>
          <li>Your BSB and account number so we can pay you.</li>
        </ol>
      </div>
    </div>
  );
}

export function AskForPrice() {
  return (
    <section id="ask-for-our-price" className="scroll-mt-32 bg-navy py-16 text-white sm:py-20">
      <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="h-section !text-white">Want a price for your car?</h2>
          <p className="mt-4 text-[19px] text-white/80">
            The quickest way is to call. You can also text us a couple of photos, or fill in the form and we&apos;ll get back to you.
          </p>
          <a href={site.phoneHref} className="mt-8 flex items-center gap-3 font-display text-[40px] font-extrabold tracking-[0.01em] text-white sm:text-[48px]">
            <PhoneIcon className="h-8 w-8 text-brand-light" /> {site.phoneDisplay}
          </a>
          <p className="mt-1 text-white/70">Open {site.hours}</p>
          {site.smsNumber && (
            <a href={`sms:${site.smsNumber}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-white underline underline-offset-4">
              <SmsIcon className="h-5 w-5" /> Text photos to {site.phoneDisplay}
            </a>
          )}
        </div>
        <div className="bg-white p-6 text-body sm:p-8">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

export function ReviewsBand() {
  if (reviews.length === 0) return null;
  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="container-site">
        <SectionHead title="What customers say" />
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.name + r.text.slice(0, 10)} className="border-l-4 border-brand pl-5">
              <blockquote className="text-[18px] text-ink">&ldquo;{r.text}&rdquo;</blockquote>
              <figcaption className="mt-3 font-semibold">
                {r.name}{r.suburb && `, ${r.suburb}`}
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
    <section id="makes" className="border-t border-line py-14">
      <div className="container-site">
        <h2 className="h-sub">We buy every make and model</h2>
        <ul className="mt-6 grid grid-cols-4 gap-y-6 sm:grid-cols-8">
          {makes.map((m) => (
            <li key={m.slug} className="flex flex-col items-center gap-2" title={m.title}>
              <svg role="img" viewBox="0 0 24 24" className="h-11 w-11 sm:h-12 sm:w-12" fill={`#${m.hex}`} aria-label={`${m.title} logo`}>
                <path d={m.path} />
              </svg>
              <span className="text-[13px]">{m.title}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[13px] text-body/80">
          Also Holden, Isuzu, Lexus, Land Rover, Great Wall, LDV and anything else on four wheels. Logos are trademarks of their
          owners and are only shown to identify the vehicles we buy. We&apos;re not affiliated with any manufacturer.
        </p>
      </div>
    </section>
  );
}
