"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroArt } from "./HeroArt";
import { ArrowDownCircle, ChevronLeft, ChevronRight } from "./icons";

export type Slide = {
  pre: string;
  highlight: string;
  post: string;
  bullets: React.ReactNode[];
  car: string;
};

export function HeroSlider({ slides, h1 = true }: { slides: Slide[]; h1?: boolean }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((x) => (x + d + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length, i]);

  const Heading = h1 ? "h1" : "h2";

  return (
    <section className="container-site mt-8">
      <div className="relative bg-hero px-4 py-8 sm:px-14 lg:py-10">
        {slides.map((s, idx) => (
          <div key={idx} className={idx === i ? "grid items-center gap-6 lg:grid-cols-2" : "hidden"} aria-hidden={idx !== i}>
            <HeroArt car={s.car} className="mx-auto w-full max-w-[520px]" />
            <div>
              {idx === 0 ? (
                <Heading className="font-heading text-[28px] font-bold uppercase leading-tight text-ink sm:text-[34px]">
                  {s.pre} <span className="text-green">{s.highlight}</span> <span className="normal-case">{s.post}</span>
                </Heading>
              ) : (
                <p className="font-heading text-[28px] font-bold uppercase leading-tight text-ink sm:text-[34px]">
                  {s.pre} <span className="text-green">{s.highlight}</span> <span className="normal-case">{s.post}</span>
                </p>
              )}
              <Link href="#ask-for-our-price" className="btn-green mt-6 w-full max-w-[360px] justify-between whitespace-nowrap !py-3.5 text-xl sm:text-[22px]">
                Ask for our price <ArrowDownCircle className="h-10 w-10" />
              </Link>
              <ul className="mt-6 space-y-3 text-lg text-ink sm:text-xl">
                {s.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-3">
                    <ChevronRight className="mt-1.5 h-4 w-4 shrink-0" /> <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-ink/70 bg-white/70 text-ink sm:grid">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-ink/70 bg-white/70 text-ink sm:grid">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="mt-6 flex justify-center gap-2">
              {slides.map((_, idx) => (
                <button key={idx} type="button" aria-label={`Slide ${idx + 1}`} onClick={() => setI(idx)} className={`h-2.5 w-2.5 rounded-full ${idx === i ? "bg-green" : "bg-ink/25"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
