import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { Roo } from "@/components/Roo";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="container-site grid items-center gap-8 py-16 sm:grid-cols-[1fr_auto] sm:py-24">
        <div>
        <p className="font-heading text-[18px] font-black uppercase tracking-[0.2em] text-brand">Page not found</p>
        <h1 className="mt-3 font-heading text-[40px] font-black leading-tight tracking-[-0.03em] text-ink sm:text-[56px]">
          Roo can&apos;t find that page.
        </h1>
        <p className="mt-4 max-w-xl text-[18px]">
          It may have moved. If you&apos;re after a price for your car, the quickest way is to give us a call.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.phoneHref} className="btn-brand !px-7 !py-4 !text-[18px]">
            <PhoneIcon className="h-5 w-5" /> Call {site.phoneDisplay}
          </a>
          <Link href="/" className="btn-line !px-7 !py-4 !text-[18px]">
            Go to the home page
          </Link>
        </div>
        </div>
        <Roo confused className="mx-auto h-72 w-auto" />
      </div>
    </section>
  );
}
