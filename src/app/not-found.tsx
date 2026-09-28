import Link from "next/link";
import { PhoneIcon } from "@/components/icons";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="container-site py-16 sm:py-24">
        <p className="font-display text-[64px] font-extrabold leading-none text-brand">404</p>
        <h1 className="mt-4 font-heading text-[36px] font-extrabold leading-tight tracking-[-0.02em] text-ink sm:text-[48px]">
          That page doesn&apos;t exist.
        </h1>
        <p className="mt-4 max-w-xl text-[18px]">
          It may have moved. If you&apos;re after a price for your car, the quickest way is to give us a call.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={site.phoneHref} className="btn-brand !px-6 !py-4 !text-[19px]">
            <PhoneIcon className="h-5 w-5" /> Call {site.phoneDisplay}
          </a>
          <Link href="/" className="btn-line !px-6 !py-4 !text-[19px]">
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
