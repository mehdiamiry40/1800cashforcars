import Link from "next/link";
import { areaHref, areas, site } from "@/lib/site";
import { Logo } from "./Logo";
import { ParentBrandLine } from "./ParentBrand";
import { nav } from "@/lib/navigation";
import { MailIcon, PhoneIcon } from "./icons";

export function Footer() {
  return (
    <footer className="bg-white pb-24 text-body md:pb-0">
      <div className="bg-navy text-white">
        <div className="container-site flex flex-col items-start justify-between gap-5 py-8 lg:flex-row lg:items-center">
          {site.showEmail && (
            <a
              href={`mailto:${site.email}`}
              className="inline-flex min-w-0 items-center gap-3 text-[18px] font-semibold sm:text-[24px] lg:text-[28px]"
            >
              <MailIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
              <span className="break-all">{site.email}</span>
            </a>
          )}
          <a
            href={site.phoneHref}
            className="inline-flex min-h-11 shrink-0 items-center gap-3 text-[20px] font-semibold"
          >
            <PhoneIcon aria-hidden="true" className="h-5 w-5" />
            {site.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="container-site py-9">
        <div className="flex flex-wrap items-center justify-between gap-7">
          <Link href="/" className="inline-flex items-center">
            <Logo />
            <span className="sr-only">home</span>
          </Link>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="inline-flex min-h-11 items-center text-[16px] font-semibold text-navy hover:underline hover:decoration-brand hover:underline-offset-4"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Descriptive links to the main local pages, so every page points at them with the words people search. */}
        <nav aria-label="Popular pages" className="mt-7 border-t border-line pt-5 text-[14px]">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link href="/" className="inline-flex min-h-11 items-center hover:underline">Cash for cars Brisbane</Link></li>
            <li><Link href="/car-removal-brisbane" className="inline-flex min-h-11 items-center hover:underline">Car removal Brisbane</Link></li>
            <li><Link href="/scrap-car-prices-brisbane" className="inline-flex min-h-11 items-center hover:underline">Scrap car prices Brisbane</Link></li>
            {areas.filter((a) => !a.href).map((a) => (
              <li key={a.slug}>
                <Link href={areaHref(a)} className="inline-flex min-h-11 items-center hover:underline">Cash for cars {a.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ParentBrandLine className="mt-4 text-[14px]" />
        <div className="mt-4 flex flex-wrap justify-between gap-3 text-[14px]">
          <p>
            © {new Date().getFullYear()} {site.name} · ABN {site.abn}
          </p>
          <Link
            href="/privacy"
            className="inline-flex min-h-11 items-center underline underline-offset-4"
          >
            Privacy policy
          </Link>
        </div>
        <p className="mt-3 text-[14px]">
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {site.address}
          </a>{" "}
          · {site.pickups}
        </p>
      </div>
    </footer>
  );
}
