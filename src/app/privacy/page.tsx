import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="section-site mx-auto max-w-3xl px-5 text-navy sm:px-6 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-[25px] [&_h2]:font-bold [&_h2]:leading-tight [&_p]:mt-3 [&_p]:text-body">
      <h1 className="h-page">Privacy policy</h1>
      <p>
        {site.name}{site.abn ? ` (ABN ${site.abn})` : ""} (&quot;we&quot;, &quot;us&quot;) respects your privacy and handles personal information in line with the
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
        Only with service providers that help us run the business (such as our website host, email provider and Google for ad measurement) and with
        government authorities where the law requires it.
      </p>
      <h2>Cookies and advertising</h2>
      <p>
        We advertise on Google. Our website uses Google Ads tags and cookies to measure which ads lead to quote
        requests, and Vercel Web Analytics (which doesn&apos;t use cookies) to count visits. You can manage Google
        ad settings at <a className="font-semibold text-navy" href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
      </p>
      <h2>Access and correction</h2>
      <p>
        You can ask to see or correct the information we hold about you, or make a privacy complaint, by calling or texting us
        (<a className="font-semibold text-navy" href={site.phoneHref}>call us</a>)
        {site.showEmail && (
          <>
            {" "}or emailing <a className="font-semibold text-navy" href={`mailto:${site.email}`}>{site.email}</a>
          </>
        )}
        .
      </p>
    </article>
  );
}
