import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} for a free cash offer and free car removal. Call ${site.phoneDisplay} or send us your car's details.`,
  alternates: { canonical: "/contact-us" },
};

export default function ContactPage() {
  const rows = [
    { label: "Phone", value: <a href={site.phoneHref} className="font-bold text-green hover:underline">{site.phoneDisplay}</a> },
    { label: "Email", value: <a href={`mailto:${site.email}`} className="font-bold text-green hover:underline">{site.email}</a> },
    { label: "Hours", value: site.hours },
    ...(site.address ? [{ label: "Address", value: site.address }] : []),
    ...(site.abn ? [{ label: "ABN", value: site.abn }] : []),
  ];
  return (
    <PageShell title="Contact Us">
      <h2 className="h-section">Get in touch</h2>
      <p className="mt-3">
        The fastest way to get an offer is to call us. You can also email us or fill in the &quot;Ask for our price&quot; form
        below with your car&apos;s details, and we&apos;ll get back to you with a cash offer — usually within the hour.
      </p>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[110px_1fr] gap-4 py-3">
            <dt className="font-heading font-bold uppercase text-ink">{r.label}</dt>
            <dd>{r.value}</dd>
          </div>
        ))}
      </dl>
    </PageShell>
  );
}
