"use client";

import { useState } from "react";
import { QuoteForm } from "@/components/QuoteForm";
import { CashIcon, CheckIcon, PhoneIcon, TruckIcon } from "@/components/icons";
import type { Valuation } from "@/lib/autoval/valuation";
import { site } from "@/lib/site";

/** What the visitor told us, used to pre-fill the cash offer form. */
export interface ValuedCar {
  name: string;
  odometerKm: number;
  condition: string;
  knownIssues: string;
}

const aud = (n: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(n);
const short = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : aud(n));

const PRIORITY = {
  high: { cls: "bg-red-50 text-red-800", label: "High priority" },
  medium: { cls: "bg-amber-50 text-amber-800", label: "Medium" },
  low: { cls: "bg-[#f2f3fb] text-muted", label: "Low" },
} as const;

const IMPACT = {
  positive: { sign: "+", cls: "bg-emerald-50 text-emerald-700" },
  negative: { sign: "−", cls: "bg-red-50 text-red-700" },
  neutral: { sign: "~", cls: "bg-[#f2f3fb] text-muted" },
} as const;

export function ValuationReport({ valuation: v, car }: { valuation: Valuation; car: ValuedCar }) {
  const order = ["high", "medium", "low"];
  const parts = [...v.partsToCheck].sort((a, b) => order.indexOf(a.priority) - order.indexOf(b.priority));

  return (
    <div id="report" className="scroll-mt-32 space-y-8">
      {/* Headline */}
      <section className="bg-navy p-6 text-white sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-[14px] font-bold uppercase tracking-[0.14em] text-white">Your AutoVal valuation</p>
          <span className="border border-white/40 px-3 py-1 text-[14px] font-semibold capitalize">{v.confidence} confidence</span>
        </div>
        <p className="mt-3 max-w-3xl text-[17px] text-white/80">{v.vehicleSummary}</p>

        <p className="mt-8 text-[14px] font-bold uppercase tracking-[0.14em] text-white/70">Private sale</p>
        <p className="mt-1 font-display text-[44px] font-bold leading-none tracking-[-0.02em] sm:text-[72px]">
          {aud(v.privateSale.low)} <span className="text-white/50">–</span> {aud(v.privateSale.high)}
        </p>
        <p className="mt-4 text-[17px] text-white/85">
          Suggested asking price: <strong className="text-white">{aud(v.recommendedListPrice)}</strong>
        </p>

        <RangeBar v={v} />

        <p className="mt-8 border-t border-white/20 pt-5 text-[16px] leading-relaxed text-white/80">{v.confidenceReason}</p>
      </section>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card eyebrow="Analysis" title="What moves the price" className="lg:col-span-3">
          <ul className="divide-y divide-line/10">
            {v.valueFactors.map((f) => (
              <li key={f.factor} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <span className={`grid h-7 w-7 shrink-0 place-items-center text-[16px] font-bold ${IMPACT[f.impact].cls}`}>{IMPACT[f.impact].sign}</span>
                <div className="text-[16px]">
                  <p className="font-bold">{f.factor}</p>
                  <p className="mt-0.5 text-muted">{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card eyebrow="Your ad" title="Highlight these" className="lg:col-span-2">
          <ol className="space-y-5">
            {v.sellingPoints.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="font-display text-[26px] font-extrabold leading-none text-logo">{String(i + 1).padStart(2, "0")}</span>
                <div className="text-[16px]">
                  <p className="font-bold">{s.title}</p>
                  <p className="mt-0.5 text-muted">{s.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <EngineCard engine={v.engine} />

      <Card eyebrow="Before you sell" title="Important parts to check">
        <div className="grid gap-4 md:grid-cols-2">
          {parts.map((p) => (
            <article key={p.part} className="border border-line/15 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block px-2 py-0.5 text-[13px] font-bold uppercase tracking-wide ${PRIORITY[p.priority].cls}`}>
                    {PRIORITY[p.priority].label}
                  </span>
                  <h4 className="mt-2 text-[18px] font-bold">{p.part}</h4>
                </div>
                <span className={`shrink-0 px-2.5 py-1 text-[13px] font-bold ${p.fixBeforeSelling ? "bg-logo text-white" : "border border-line/25 text-muted"}`}>
                  {p.fixBeforeSelling ? "Fix first" : "Disclose"}
                </span>
              </div>
              <p className="mt-3 text-[16px] text-muted">{p.why}</p>
              <p className="mt-4 border-t border-line/10 pt-3 text-[15px] font-semibold">{p.estimatedCostAud}</p>
            </article>
          ))}
        </div>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card eyebrow="Model watch" title="Known issues">
          <BulletList items={v.knownModelIssues} empty="No widely reported issues found for this model." />
        </Card>
        <Card eyebrow="Checklist" title="Paperwork you'll need">
          <BulletList items={v.paperwork} numbered />
        </Card>
      </div>

      <CashOfferCta car={car} />

      <ListingDraft title={v.listingTitle} description={v.listingDescription} price={v.recommendedListPrice} />

      {v.marketEvidence.length > 0 && (
        <Card eyebrow="Sources" title="Market evidence">
          <ul className="grid gap-3 md:grid-cols-2">
            {v.marketEvidence.map((m, i) => (
              <li key={i} className="border border-line/15 p-4 text-[16px]">
                <p className="text-[13px] font-bold uppercase tracking-wide text-logo">{m.source}</p>
                <p className="mt-1 text-muted">{m.detail}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="text-[14px] text-muted">
        AutoVal gives an AI-generated estimate for guidance only, not a formal appraisal. Prices vary with location, timing
        and the individual car.
      </p>
    </div>
  );
}

/** Engine name/code, specs, servicing and engine-specific faults. */
function EngineCard({ engine: e }: { engine: Valuation["engine"] }) {
  return (
    <section className="border border-line/15 bg-white p-6 sm:p-8">
      <p className="eyebrow text-logo">Under the bonnet</p>
      <h3 className="h-sub mt-1">{e.name}</h3>
      <p className="mt-2 text-[17px]">{e.summary}</p>
      <p className="mt-3 border-l-4 border-navy bg-[#f2f3fb] px-4 py-2.5 text-[15px] text-muted">{e.matchNote}</p>

      {e.specs.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 border-l border-t border-line/15 md:grid-cols-4">
          {e.specs.map((s) => (
            <div key={s.label} className="border-b border-r border-line/15 p-4">
              <dt className="text-[13px] font-bold uppercase tracking-wide text-muted">{s.label}</dt>
              <dd className="mt-1 text-[17px] font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h4 className="mb-4 text-[18px] font-bold">Servicing</h4>
          <BulletList items={e.maintenance} numbered empty="No engine-specific service items found." />
        </div>
        <div>
          <h4 className="mb-4 text-[18px] font-bold">Known engine issues</h4>
          <BulletList items={e.commonIssues} empty="No widely reported faults for this engine." />
        </div>
      </div>

      <div className="mt-8 grid gap-4 border-t border-line/10 pt-6 text-[16px] md:grid-cols-2">
        <p>
          <span className="font-bold">Reputation: </span>
          <span className="text-muted">{e.reputation}</span>
        </p>
        <p>
          <span className="font-bold">Finding the engine code: </span>
          <span className="text-muted">{e.whereToFindCode}</span>
        </p>
      </div>
    </section>
  );
}

/** The selling alternative: a firm cash offer from 1800-CASH-FOR-CARS, with the car pre-filled. */
function CashOfferCta({ car }: { car: ValuedCar }) {
  const description = [
    `${car.odometerKm.toLocaleString("en-AU")} km, ${car.condition} condition.`,
    car.knownIssues && `Issues: ${car.knownIssues}`,
    "Valued with AutoVal.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="grid gap-8 border-2 border-brand bg-white p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
      <div>
        <p className="eyebrow text-logo">Skip the hassle</p>
        <h3 className="h-section mt-2">Rather sell it this week?</h3>
        <p className="mt-4 text-[18px]">
          No ads, no tyre-kickers, no roadworthy. Get a firm cash offer from {site.name}, usually within the hour.
        </p>
        <ul className="mt-6 space-y-3">
          {[
            { icon: CashIcon, text: "Paid before your car leaves" },
            { icon: TruckIcon, text: "Free pickup, even if it doesn't run" },
            { icon: CheckIcon, text: "No obligation to accept" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 font-semibold">
              <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-logo" />
              {text}
            </li>
          ))}
        </ul>
        <a href={site.phoneHref} className="mt-8 inline-flex min-h-11 items-center gap-3 text-[24px] font-bold">
          <PhoneIcon aria-hidden="true" className="h-6 w-6 text-logo" />
          {site.phoneDisplay}
        </a>
      </div>
      <div id="quote" data-quote className="min-w-0 scroll-mt-32">
        <h4 className="h-sub mb-5">Get a cash offer for your car</h4>
        <QuoteForm variant="compact" defaults={{ vehicle: car.name, description }} />
      </div>
    </section>
  );
}

/** Trade-in → private → retail on one scale, with the suggested list price marked. */
function RangeBar({ v }: { v: Valuation }) {
  const min = Math.min(v.tradeIn.low, v.privateSale.low, v.dealerRetail.low);
  const max = Math.max(v.tradeIn.high, v.privateSale.high, v.dealerRetail.high);
  const span = Math.max(max - min, 1);
  const pct = (n: number) => ((n - min) / span) * 100;
  const segments = [
    { label: "Trade-in", r: v.tradeIn, cls: "bg-white/35" },
    { label: "Private sale", r: v.privateSale, cls: "z-10 bg-brand" },
    { label: "Dealer retail", r: v.dealerRetail, cls: "bg-white/60" },
  ];
  const listPct = Math.min(Math.max(pct(v.recommendedListPrice), 0), 100);

  return (
    <div className="mt-14">
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/20" />
        {segments.map((s) => (
          <div
            key={s.label}
            className={`absolute top-1/2 h-2.5 -translate-y-1/2 ${s.cls}`}
            style={{ left: `${pct(s.r.low)}%`, width: `${Math.max(pct(s.r.high) - pct(s.r.low), 1.5)}%` }}
          />
        ))}
        <div className="absolute inset-y-0 z-20 w-0.5 bg-white" style={{ left: `${listPct}%` }}>
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] font-bold">
            List {short(v.recommendedListPrice)}
          </span>
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[13px] text-white/60">
        <span>{short(min)}</span>
        <span>{short(max)}</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {segments.map((s, i) => (
          <div key={s.label} className={`p-4 ${i === 1 ? "bg-white text-navy" : "border border-white/25"}`}>
            <p className={`flex items-center gap-2 text-[14px] font-semibold ${i === 1 ? "text-navy" : "text-white/75"}`}>
              <span className={`h-2 w-4 ${i === 1 ? "bg-brand" : s.cls}`} />
              {s.label}
            </p>
            <p className="mt-1 font-display text-[22px] font-bold">
              {aud(s.r.low)} – {aud(s.r.high)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ eyebrow, title, children, className = "" }: { eyebrow: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-line/15 bg-white p-6 sm:p-8 ${className}`}>
      <p className="eyebrow text-logo">{eyebrow}</p>
      <h3 className="h-sub mb-6 mt-1">{title}</h3>
      {children}
    </section>
  );
}

function BulletList({ items, empty, numbered }: { items: string[]; empty?: string; numbered?: boolean }) {
  if (!items.length) return <p className="text-[16px] text-muted">{empty}</p>;
  return (
    <ul className="space-y-3 text-[16px]">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3">
          {numbered ? (
            <span className="grid h-6 w-6 shrink-0 place-items-center bg-navy text-[13px] font-bold text-white">{i + 1}</span>
          ) : (
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-brand" />
          )}
          {item}
        </li>
      ))}
    </ul>
  );
}

function ListingDraft({ title, description, price }: { title: string; description: string; price: number }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(`${title}\n${aud(price)}\n\n${description}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <section className="border border-line/15 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-logo">Selling it yourself?</p>
          <h3 className="h-sub mt-1">Your draft listing</h3>
        </div>
        <button type="button" onClick={copy} className="min-h-11 border border-navy px-4 text-[16px] font-bold hover:bg-navy hover:text-white">
          {copied ? "Copied" : "Copy listing"}
        </button>
      </div>
      <div className="mt-6 bg-[#f7f8fc] p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[18px] font-bold">{title}</p>
          <p className="font-display text-[24px] font-bold text-logo">{aud(price)}</p>
        </div>
        <p className="mt-3 whitespace-pre-line text-[16px] text-muted">{description}</p>
      </div>
    </section>
  );
}
