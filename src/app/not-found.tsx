import Link from "next/link";
import { Roo } from "@/components/Roo";

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="container-site section-site grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
        <p className="eyebrow">Page not found</p>
        <h1 className="h-page mt-3">
          Roo can&apos;t find that page.
        </h1>
        <p className="mt-4 max-w-xl text-[18px]">
          It may have moved. If you&apos;re after a price for your car, it only takes 30 seconds.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/quote" className="btn-brand">
            Get a free quote
          </Link>
          <Link href="/" className="btn-line">
            Go to the home page
          </Link>
        </div>
        </div>
        <Roo confused className="mx-auto h-40 w-auto" />
      </div>
    </section>
  );
}
