import Link from "next/link";
import { services } from "@/lib/content";
import { site } from "@/lib/site";
import { AskForPrice, MakesRow, ReviewsBand } from "./Blocks";
import { ArrowDownCircle, ChevronRight, PhoneIcon } from "./icons";

// Layout for inner pages: title band, content + sidebar, then the price form and reviews band.
export function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <section className="container-site mt-8">
        <div className="bg-hero px-6 py-8 sm:px-10">
          <p className="text-sm">
            <Link href="/" className="text-green hover:underline">Home</Link> <span className="mx-1">»</span> {title}
          </p>
          <h1 className="mt-2 font-heading text-[30px] font-bold uppercase leading-tight text-ink sm:text-[38px]">{title}</h1>
        </div>
      </section>

      <section className="container-site grid gap-10 py-12 lg:grid-cols-[1fr_300px]">
        <div>{children}</div>
        <aside className="space-y-6">
          <div className="bg-charcoal p-6 text-white">
            <p className="font-heading text-xl font-bold uppercase">Get a free quote</p>
            <p className="mt-2 text-sm text-white/80">Top cash, free towing and paid on pickup.</p>
            <Link href="#ask-for-our-price" className="btn-green mt-4 w-full justify-between">
              Ask for our price <ArrowDownCircle className="h-6 w-6" />
            </Link>
            <a href={site.phoneHref} className="mt-3 flex items-center justify-center gap-2 bg-phone py-3 font-heading font-bold">
              <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
            </a>
          </div>
          <div className="border border-line p-6">
            <p className="font-heading text-lg font-bold uppercase text-ink">Our services</p>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/cash-for-cars", label: "Cash For Cars" },
                { href: "/car-removals", label: "Free Car Removals" },
                ...services.map((s) => ({ href: `/${s.slug}`, label: s.tile })),
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-2 hover:text-green">
                    <ChevronRight className="h-3 w-3 text-green" /> {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <AskForPrice />
      <ReviewsBand />
      <MakesRow />
    </>
  );
}
