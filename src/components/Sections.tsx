import Link from "next/link";
import { areas, faqs, site } from "@/lib/site";
import {
  ArrowIcon, CarIcon, CashIcon, CheckIcon, ClipboardIcon, ClockIcon, LeafIcon, PhoneIcon, PinIcon, ShieldIcon, TruckIcon,
} from "./icons";

export function TrustStrip() {
  const items = [
    { icon: CashIcon, title: "Paid on the spot", text: "Instant transfer before we tow" },
    { icon: TruckIcon, title: "Free removal", text: "No towing fees, ever" },
    { icon: ClockIcon, title: "Same-day pickup", text: "Often within hours" },
    { icon: ShieldIcon, title: "Any condition", text: "Running, wrecked or scrap" },
  ];
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 md:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <p className="font-bold leading-tight">{title}</p>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: ClipboardIcon, title: "Tell us about your car", text: `Fill in our 60-second form or call ${site.phoneDisplay}. Make, model, year, condition — that's it.` },
    { icon: CashIcon, title: "Get a firm cash offer", text: "We'll call or text you with a no-obligation offer. The price we quote is the price we pay." },
    { icon: TruckIcon, title: "We pick up & pay you", text: "Choose a time. Our driver checks the car, pays you on the spot and tows it away — free." },
  ];
  return (
    <section id="how-it-works" className="scroll-mt-28 bg-paper py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading kicker="How it works" title="Sold in 3 easy steps" sub="No ads, no tyre-kickers, no haggling. Just a fair price and a free pickup." />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-3xl bg-white p-7 shadow-sm ring-1 ring-line">
              <span className="absolute -top-4 left-7 grid h-9 w-9 place-items-center rounded-full bg-navy-900 font-display text-lg font-black text-cash-400">
                {i + 1}
              </span>
              <Icon className="mt-2 h-10 w-10 text-brand-500" />
              <h3 className="mt-4 font-display text-xl font-black">{title}</h3>
              <p className="mt-2 text-muted">{text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link href="/quote" className="btn-cash">
            Start my free quote <ArrowIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WhatWeBuy() {
  const types = ["Cars & sedans", "Hatchbacks", "SUVs & 4WDs", "Utes", "Vans", "Light trucks", "Buses & campers", "Commercial fleets"];
  const conditions = [
    "Old & unwanted cars", "Damaged or crashed", "Non-running or broken down", "Unregistered", "Flood & fire damaged",
    "Written-off / scrap", "High kilometres", "Failed roadworthy",
  ];
  return (
    <section id="what-we-buy" className="scroll-mt-28 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <SectionHeading align="left" kicker="Cars we buy" title="Any make. Any model. Any condition." sub="From a near-new SUV to a rusty wreck in the backyard — if it's taking up space, we'll turn it into cash." />
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {conditions.map((c) => (
              <li key={c} className="flex items-start gap-2 font-semibold">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-money-500" /> {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
          {types.map((t) => (
            <div key={t} className="flex items-center gap-3 rounded-2xl bg-navy-900 p-4 text-white">
              <CarIcon className="h-7 w-7 shrink-0 text-cash-400" />
              <span className="font-bold">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUs() {
  const reasons = [
    { icon: CashIcon, title: "Top dollar, no games", text: "We price on today's parts and metal values so you get a fair offer — not a lowball." },
    { icon: ShieldIcon, title: "Hassle-free paperwork", text: "Friendly, professional drivers. We handle the paperwork and give you a disposal receipt." },
    { icon: ClockIcon, title: "On your schedule", text: "7 days a week, including same-day pickups. We come to your home, work or roadside." },
    { icon: LeafIcon, title: "Eco-friendly recycling", text: "Fluids drained safely, parts reused, metal recycled. Up to 95% of your car gets a second life." },
  ];
  return (
    <section className="bg-navy-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading dark kicker="Why choose us" title="The easiest way to sell your car" sub="Skip the private sale hassle. No listings, no strangers, no test drives." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cash-400 text-navy-950">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-black">{title}</h3>
              <p className="mt-2 text-sm text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Areas() {
  return (
    <section id="areas" className="scroll-mt-28 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading kicker="Service areas" title="Free car removal near you" sub="Our tow trucks cover South East Queensland and the Northern Rivers." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a) => (
            <Link key={a.slug} href={`/locations/${a.slug}`} className="group rounded-3xl p-6 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-brand-500">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-xl font-black">
                  <PinIcon className="h-5 w-5 text-brand-500" /> {a.name} <span className="text-sm font-bold text-muted">{a.state}</span>
                </h3>
                <ArrowIcon className="h-5 w-5 text-muted transition group-hover:translate-x-1 group-hover:text-brand-500" />
              </div>
              <p className="mt-3 text-sm text-muted">{a.suburbs.slice(0, 5).join(" · ")} & surrounds</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 bg-paper py-20">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHeading kicker="FAQ" title="Questions? We've got answers." />
        <div className="mt-10 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white p-5 ring-1 ring-line open:ring-brand-500">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-paper text-lg transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="bg-cash-400 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <h2 className="font-display text-3xl font-black text-navy-950 sm:text-4xl">Turn that old car into cash today.</h2>
          <p className="mt-2 text-lg font-semibold text-navy-900/80">Free quote in 60 seconds. Free pickup. Paid on the spot.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={site.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 font-bold text-white hover:bg-navy-800">
            <PhoneIcon className="h-5 w-5 text-cash-400" /> {site.phoneDisplay}
          </a>
          <Link href="/quote" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-bold text-navy-950 hover:bg-white/90">
            Get my offer online <ArrowIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker, title, sub, dark = false, align = "center",
}: { kicker: string; title: string; sub?: string; dark?: boolean; align?: "center" | "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : ""}>
      <p className={`text-sm font-extrabold uppercase tracking-[0.18em] ${dark ? "text-cash-400" : "text-brand-600"}`}>{kicker}</p>
      <h2 className={`mt-2 font-display text-3xl font-black sm:text-4xl ${dark ? "text-white" : "text-navy-950"}`}>{title}</h2>
      {sub && <p className={`mt-3 text-lg ${dark ? "text-white/70" : "text-muted"}`}>{sub}</p>}
    </div>
  );
}
