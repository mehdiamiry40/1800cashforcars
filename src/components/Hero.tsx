"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroCopy, heroImages } from "@/lib/slides";
import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CheckIcon, PhoneIcon } from "./icons";

export function Hero({ place }: { place?: string }) {
  const copy = heroCopy(place);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % heroImages.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      {heroImages.map((img, idx) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          priority={idx === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/45" />

      <div className="container-site relative grid items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 font-heading text-sm font-semibold uppercase tracking-widest text-brand-light ring-1 ring-white/15">
            <span className="h-2 w-2 rounded-full bg-brand-light" /> {copy.eyebrow}
          </p>
          <h1 className="mt-5 font-heading text-[44px] font-extrabold uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
            {copy.pre} <span className="text-brand-light">{copy.highlight}</span>
            <span className="block text-[0.62em] leading-tight text-white/95">{copy.post}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{copy.sub}</p>
          <ul className="mt-6 grid max-w-lg grid-cols-2 gap-x-4 gap-y-2.5 font-semibold">
            {copy.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand"><CheckIcon className="h-3.5 w-3.5" /></span> {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#hero-quote" className="btn-brand lg:hidden">Get my cash offer</a>
            <a href={site.phoneHref} className="btn-ghost">
              <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
            </a>
          </div>
          <div className="mt-8 flex gap-2" aria-hidden>
            {heroImages.map((img, idx) => (
              <span key={img.src} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-brand-light" : "w-3 bg-white/40"}`} />
            ))}
          </div>
        </div>

        <div id="hero-quote" className="scroll-mt-32 rounded-2xl bg-white p-6 text-body shadow-2xl sm:p-7">
          <p className="font-heading text-3xl font-extrabold uppercase leading-none text-navy">Get your cash offer</p>
          <p className="mt-1.5 text-sm">Free · No obligation · Reply within the hour</p>
          <div className="mt-5">
            <QuoteForm variant="compact" />
          </div>
        </div>
      </div>
    </section>
  );
}
