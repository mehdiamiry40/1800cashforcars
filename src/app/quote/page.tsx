import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get a Free Cash Offer For Your Car",
  description: "Tell us about your car and get a free, no-obligation cash offer. Free removal and paid on pickup.",
  alternates: { canonical: "/quote" },
};

export default function QuotePage() {
  return (
    <PageShell title="Get a Free Quote" intro="Tell us about your car and we'll give you a price. No obligation." image="/images/hero-towing.jpg">
      <h2 className="h-section">How to get a price</h2>
      <p className="mt-3">
        Fill in the form below with the year, make, model, kilometres and condition of the car. We&apos;ll call or text you
        with a price, usually within the hour during opening hours.
      </p>
      <ul className="mt-4 list-disc space-y-1 pl-5">
        <li>No obligation. If the price isn&apos;t right, say no.</li>
        <li>The price we quote is the price we pay</li>
        <li>Free towing, even if the car doesn&apos;t run</li>
        <li>Paid on pickup</li>
      </ul>
      <p className="mt-4">
        Rather talk to someone? Call <a href={site.phoneHref} className="font-bold text-brand-dark hover:underline">{site.phoneDisplay}</a>.
      </p>
    </PageShell>
  );
}
