"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-paper">
      <div className="container-site section-site">
        <h1 className="h-page">
          Something went wrong on our end.
        </h1>
        <p className="mt-4 max-w-xl text-[18px]">Sorry about that. Try again, or call us and we&apos;ll sort you out over the phone.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="btn-navy">
            Try again
          </button>
          <a href={site.phoneHref} className="btn-brand">
            <PhoneIcon aria-hidden="true" className="h-4 w-4" /> Call us
          </a>
          <Link href="/" className="btn-line">
            Home page
          </Link>
        </div>
      </div>
    </section>
  );
}
