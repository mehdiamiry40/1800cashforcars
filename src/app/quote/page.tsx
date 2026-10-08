import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { QuoteForm } from "@/components/QuoteForm";
import { CheckIcon } from "@/components/icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Cash Offer For Your Car",
  description: "Tell us about your car and get a free, no-obligation cash offer by text, usually within the hour. Free removal and paid on pickup.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <PageShell
      title="Get a free quote"
      path="/quote"
      roo={{ hand: "cash" }}
      intro="Tell us about your car and we'll text you a price, usually within the hour. No obligation."
      forms={false}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
        <div data-quote className="quote-panel scroll-mt-24">
          <QuoteForm />
        </div>
        <div className="border border-line bg-sand p-6 lg:self-start">
          <h2 className="h-sub">What happens next</h2>
          <ul className="mt-3 space-y-2">
            {[
              "We text or call you with a price, usually within the hour",
              "No obligation. If the price isn't right, say no",
              "The price we quote is the price we pay",
              "Free towing, even if the car doesn't run",
              "Paid on pickup, cash or bank transfer",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-brand" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[15px]">
            Rather talk to someone? <a href={site.phoneHref} className="font-semibold text-brand underline">Call us</a>.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
