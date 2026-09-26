import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { CheckIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Cash Offer For Your Car",
  description: "Tell us about your car and get a free, no-obligation cash offer in 60 seconds. Free removal and paid on the spot.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <section className="bg-navy-900 py-14 text-white">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="lg:pt-6">
          <h1 className="font-display text-4xl font-black leading-tight sm:text-5xl">
            Your free cash offer is <span className="text-cash-400">60 seconds away.</span>
          </h1>
          <p className="mt-4 text-lg text-white/80">Answer a few quick questions and we&apos;ll call or text you with a firm offer — usually within minutes during business hours.</p>
          <ul className="mt-6 space-y-3 font-semibold">
            {["No obligation — say no if it's not right", "The price we quote is the price we pay", "Free towing, even if it doesn't run", "Paid on the spot at pickup"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <CheckIcon className="h-5 w-5 text-money-500" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <p className="text-sm text-white/70">Rather speak to someone?</p>
            <a href={site.phoneHref} className="mt-1 flex items-center gap-2 font-display text-2xl font-black text-cash-400">
              <PhoneIcon className="h-6 w-6" /> {site.phoneDisplay}
            </a>
            <p className="text-sm text-white/70">{site.hours}</p>
          </div>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}
