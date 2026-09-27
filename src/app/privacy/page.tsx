import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 leading-relaxed text-ink [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:text-2xl [&_p]:mt-3 [&_p]:text-body">
      <h1 className="font-heading text-5xl font-extrabold uppercase text-navy">Privacy Policy</h1>
      <p>
        {site.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy and handles personal information in line with the
        Australian Privacy Principles under the Privacy Act 1988 (Cth).
      </p>
      <h2>What we collect</h2>
      <p>
        When you request a quote we collect your name, phone number, email address (if provided), location and details
        about your vehicle. When we buy your car we may also record your ID and proof of ownership, as required by law.
      </p>
      <h2>How we use it</h2>
      <p>
        We use your information to prepare your offer, contact you about it, arrange pickup and payment, and meet our
        legal record-keeping obligations. We don&apos;t sell your information or use it for unrelated marketing.
      </p>
      <h2>Who we share it with</h2>
      <p>
        Only with service providers that help us run the business (such as our website host and email provider) and with
        government authorities where the law requires it.
      </p>
      <h2>Access and correction</h2>
      <p>
        You can ask to see or correct the information we hold about you, or make a privacy complaint, by emailing{" "}
        <a className="font-semibold text-brand-dark" href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </article>
  );
}
