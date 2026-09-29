import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} for a free cash offer and free car removal. Call us or send us your car's details.`,
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  const rows = [
    { label: "Phone", value: <a href={site.phoneHref} className="font-semibold text-brand underline">Call us</a> },
    ...(site.showEmail ? [{ label: "Email", value: <a href={`mailto:${site.email}`} className="font-semibold text-brand hover:underline">{site.email}</a> }] : []),
    { label: "Hours", value: `${site.hours}. ${site.pickups}.` },
    ...(site.address
      ? [
          {
            label: "Address",
            value: (
              <>
                {site.address}
                <br />
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand underline underline-offset-2">
                  Get directions
                </a>
              </>
            ),
          },
        ]
      : []),
    ...(site.abn ? [{ label: "ABN", value: site.abn }] : []),
  ];
  return (
    <PageShell title="Contact Us" path="/contact-us" roo={{ hand: "phone" }} intro="Call, text, or send us the details of your car and we'll give you a price.">
      <h2 className="h-section">Get in touch</h2>
      <p className="mt-3">
        Calling is quickest. You can also text us photos of the car, or use the form below and we&apos;ll get back to
        you, usually within the hour.
      </p>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[80px_minmax(0,1fr)] gap-3 py-3 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-4">
            <dt className="font-heading font-bold text-ink">{r.label}</dt>
            <dd className="break-words [overflow-wrap:anywhere]">{r.value}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
