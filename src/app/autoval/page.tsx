import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/JsonLd";
import { Roo } from "@/components/Roo";
import { CheckIcon } from "@/components/icons";
import { AutoValuer } from "./AutoValuer";

export const metadata: Metadata = {
  title: "AutoVal: Free AI Car Valuation",
  description:
    "Find out what your car is worth in about a minute. Enter your rego or VIN. AutoVal checks live Australian listings for trade-in, private and dealer prices.",
  alternates: { canonical: "/autoval" },
  openGraph: { url: "/autoval" },
};

export default function AutoValPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "AutoVal car valuation", path: "/autoval" }]} />

      <section className="relative overflow-hidden bg-navy text-white">
        <div className="container-site grid items-end gap-8 pb-28 pt-10 sm:pb-36 sm:pt-16 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-sans text-[14px] font-bold uppercase tracking-[0.14em] text-brand">AutoVal · Free AI valuation</p>
            <h1 className="mt-4 font-heading text-[40px] font-bold leading-[1.05] tracking-[-0.02em] sm:text-[56px] lg:text-[64px]">
              What&apos;s your car <span className="text-brand">really</span> worth?
            </h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-white/85 sm:text-[20px]">
              Enter your rego, VIN or just the details. AutoVal checks live Australian listings and price guides, then
              shows what it&apos;s worth and what to fix before you sell.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[16px] font-semibold">
              {["Free, no sign-up", "Ready in about a minute", "Live Australian market data"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckIcon aria-hidden="true" className="h-5 w-5 text-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <Roo hand="cash" className="mx-auto hidden h-56 w-auto md:block lg:h-64" />
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="sr-only">
        <Link href="/">Home</Link> › <span>AutoVal car valuation</span>
      </nav>

      <div className="container-site relative -mt-20 pb-16 sm:-mt-28 sm:pb-24">
        <AutoValuer />
      </div>
    </>
  );
}
