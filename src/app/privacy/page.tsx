import type { Metadata } from "next";
import { regoLookupEnabled } from "@/lib/autoval/rego";
import { pageOpenGraph, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, stores and protects the personal information you give us when you ask for a quote or sell us your car.`,
  alternates: { canonical: "/privacy" },
  openGraph: pageOpenGraph("/privacy"),
};

// Keep this page matching what the site actually does. Update it, and the date below, whenever a
// provider that receives visitor or lead data is added or removed: src/lib/quote.ts (email, database,
// logs), src/lib/openai-ads-capi.ts and src/app/layout.tsx (ad tags), and src/app/api/autoval (AutoVal).
const LAST_UPDATED = "15 November 2026";

// The number plate only goes to the lookup service while that service is switched on.
const regoLookup = regoLookupEnabled();

const link = "font-semibold text-navy";
const list = "mt-3 list-disc space-y-1.5 pl-5 text-body";

export default function PrivacyPage() {
  return (
    <article className="section-site mx-auto max-w-3xl px-5 text-navy sm:px-6 [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-[25px] [&_h2]:font-bold [&_h2]:leading-tight [&_p]:mt-3 [&_p]:text-body">
      <h1 className="h-page">Privacy policy</h1>
      <p>
        {site.name}{site.abn ? ` (ABN ${site.abn})` : ""} (&quot;we&quot;, &quot;us&quot;) respects your privacy and handles personal information in line with the
        Australian Privacy Principles under the Privacy Act 1988 (Cth).
      </p>
      <p>Last updated {LAST_UPDATED}.</p>

      <h2>What we collect</h2>
      <p>
        When you request a quote we collect your name, phone number, email address (if provided), suburb, details
        about your vehicle, the price you&apos;re hoping for (if you tell us) and the page you sent the form from. Our
        website also receives technical details your browser sends, such as your IP address and browser type. When
        we buy your car we may also record your ID and proof of ownership, as required by law.
      </p>
      <p>
        AutoVal, our free valuation tool, collects the car details you enter, which can include the VIN
        {regoLookup ? " or number plate" : ""}. It doesn&apos;t ask for your name or contact details.
      </p>

      <h2>How we use it</h2>
      <p>
        We use your information to prepare your offer, contact you about it, arrange pickup and payment, and meet our
        legal record-keeping obligations. We also use limited details to measure which of our ads lead to quote
        requests, as described under Cookies and advertising. We don&apos;t sell your information or use it for
        unrelated marketing.
      </p>

      <h2>Who we share it with</h2>
      <p>
        {site.name} is part of {site.googleBusinessName}, and the two share a yard. Quote requests go to that shared
        team so we can prepare your offer. Apart from that, we share information only with the service providers
        that help us run the business, and with government authorities where the law requires it. Those providers are:
      </p>
      <ul className={list}>
        <li>Vercel, which hosts this website and keeps its system logs.</li>
        <li>Supabase, which hosts the database where quote requests are saved.</li>
        <li>Resend, which emails quote requests to our business inbox.</li>
        <li>Google and OpenAI, for measuring our ads. See Cookies and advertising below.</li>
        <li>
          For AutoVal only: AI and web search services reached through Vercel&apos;s AI Gateway (at present DeepSeek
          and Anthropic models and Perplexity search), which receive the car details you enter so they can find
          comparable listings and write the estimate, and the VIN decoder run by the US National Highway Traffic
          Safety Administration, which receives a VIN you enter.
          {regoLookup ? " A number plate and state you enter go to CarRegistrationAPI.com.au, which looks up the vehicle." : ""}
        </li>
      </ul>

      <h2>Where it&apos;s stored and for how long</h2>
      <p>
        Quote requests are emailed to our business inbox and saved in our quote database. If the database
        can&apos;t be reached, a copy is kept for a short time in our website host&apos;s system logs as a backup.
        The providers listed above may store or process this information on servers outside Australia, including
        in the United States. We use providers that
        protect personal information to a standard similar to the Australian Privacy Principles. We keep records of
        vehicles we buy for as long as the law requires, and other quote details only as long as we need them to deal
        with your enquiry.
      </p>
      <p>
        AutoVal requests are not saved in our quote database. The searches made for an estimate can appear in our
        website host&apos;s system logs for a short time.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        We advertise on Google and in ChatGPT. Our website uses a Google Ads tag and OpenAI&apos;s ChatGPT ads
        measurement tag, and the cookies they set, to measure which ads lead to quote requests and calls. We use
        Vercel Web Analytics (which doesn&apos;t use cookies) to count visits.
      </p>
      <p>
        When you send a quote request, our server also tells OpenAI that a request was made, so it can be matched
        to an ad. That message includes your quote reference, the page you sent the form from, your email address
        and phone number in hashed form (a one-way code that OpenAI can match against its own records, but that
        doesn&apos;t show the address or number itself), your IP address, your browser type and any ad identifiers
        stored in OpenAI&apos;s cookies. It doesn&apos;t include your name or anything you typed about your car.
      </p>
      <p>
        You can manage Google ad settings at <a className={link} href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>,
        and you can block or delete cookies in your browser&apos;s settings. The quote form still works with cookies blocked.
      </p>

      <h2>Access and correction</h2>
      <p>
        You can ask to see or correct the information we hold about you, or make a privacy complaint, by calling or texting us
        (<a className={link} href={site.phoneHref}>call us</a>)
        {site.showEmail && (
          <>
            {" "}or emailing <a className={link} href={`mailto:${site.email}`}>{site.email}</a>
          </>
        )}
        .
      </p>
    </article>
  );
}
