import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { QuoteThanks } from "@/components/QuoteThanks";
import { SentReference } from "./SentReference";

// Reached only by a redirect from /api/quote, when the browser sent the form itself.
export const metadata: Metadata = {
  title: "Quote Request Sent",
  robots: { index: false, follow: false },
};

export default function QuoteSentPage() {
  return (
    <section className="container-site max-w-2xl py-10 sm:py-14 md:py-20">
      <h1 className="h-page">Quote request sent</h1>
      <div className="mt-6">
        <QuoteThanks>
          {/* The reference is in the address, so it is filled in by the browser. The page stays prerendered. */}
          <Suspense fallback={null}>
            <SentReference />
          </Suspense>
        </QuoteThanks>
      </div>
      <p className="mt-6">
        <Link href="/" className="font-semibold text-navy underline underline-offset-4">Back to the home page</Link>
      </p>
    </section>
  );
}
