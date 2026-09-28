"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { MenuIcon, PhoneIcon } from "./icons";

export const nav = [
  { href: "/cash-for-cars", label: "Cash for cars" },
  { href: "/truck-removal", label: "Trucks" },
  { href: "/#areas", label: "Areas" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact-us", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-40 border-b border-line/70 bg-white/95 backdrop-blur md:sticky md:top-0">
      <div className="container-site flex items-center justify-between gap-3 py-3">
        <Link href="/">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 font-heading text-[16px] font-extrabold">
            {nav.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`rounded-full px-3.5 py-2 transition ${n.href === pathname ? "bg-sand text-brand" : "text-ink hover:bg-sand"}`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.phoneHref} className="hidden items-center gap-2 px-2 font-heading text-[18px] font-black text-ink hover:text-brand md:flex">
            <PhoneIcon className="h-5 w-5 text-brand" /> {site.phoneDisplay}
          </a>
          <Link href="/#quote" className="btn-brand hidden !px-5 !py-2.5 !text-[16px] !shadow-[0_4px_0_0_#17603c] sm:inline-flex">
            Get a price
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Menu"
            className="grid h-11 w-11 place-items-center rounded-full bg-sand text-ink lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line lg:hidden">
          <ul className="container-site grid gap-1 py-3 font-heading text-[18px] font-extrabold">
            {[{ href: "/", label: "Home" }, ...nav].map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className="block rounded-2xl px-3 py-2.5 text-ink hover:bg-sand">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
