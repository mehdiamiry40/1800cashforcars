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
      <div className="container-site py-16 sm:py-24">
        <h1 className="font-heading text-[36px] font-extrabold leading-tight tracking-[-0.03em] text-ink sm:text-[48px]">
          Something went wrong on our end.
        </h1>
        <p className="mt-4 max-w-xl text-[18px]">Sorry about that. Try again, or call us and we&apos;ll sort you out over the phone.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className="btn-navy !px-7 !py-4 !text-[18px]">
            Try again
          </button>
          <a href={site.phoneHref} className="btn-brand !px-7 !py-4 !text-[18px]">
            <PhoneIcon className="h-5 w-5" /> Call Us
          </a>
          <Link href="/" className="btn-line !px-7 !py-4 !text-[18px]">
            Home page
          </Link>
        </div>
      </div>
    </section>
  );
}
