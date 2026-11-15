import type { Metadata } from "next";
import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

// Reached only by a redirect from /api/quote, when the browser sent the form itself and it was not accepted.
export const metadata: Metadata = {
  title: "Quote Request Not Sent",
  robots: { index: false, follow: false },
};

export default function QuoteNotSentPage() {
  return (
    <section className="container-site max-w-2xl py-10 sm:py-14 md:py-20">
      <h1 className="h-page">Sorry, that didn&apos;t go through</h1>
      <p className="mt-5 text-[18px]">
        We couldn&apos;t take your quote request. Some details may be missing or not valid: we need your name, a
        mobile number, the suburb, and the make, model and year of the car.
      </p>
      <p className="mt-3 text-[18px]">
        Go back to the form and check it, or call or text us and we&apos;ll give you a price.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/quote" className="btn-brand">Back to the quote form</Link>
        <a href={site.phoneHref} className="btn-line">
          <PhoneIcon aria-hidden="true" className="h-5 w-5" />
          Call {site.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
