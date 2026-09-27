import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowIcon, CheckIcon, PhoneIcon } from "./icons";

export type Slide = {
  pre: string;
  highlight: string;
  post: string;
  bullets: React.ReactNode[];
  car: string;
};

// Keep the existing page API, but use one stable message: no rotating H1 or motion.
export function HeroSlider({
  slides,
  h1 = true,
}: {
  slides: Slide[];
  h1?: boolean;
}) {
  const slide = slides[0];
  if (!slide) return null;
  const Heading = h1 ? "h1" : "h2";
  return (
    <section className="hero-section">
      <div className="container-site grid items-center gap-10 py-10 lg:grid-cols-[1.05fr_1fr] lg:py-16">
        <div>
          <p className="eyebrow">A fresh start for your driveway</p>
          <Heading className="mt-4 font-heading text-[clamp(2.4rem,4.5vw,4.1rem)] font-bold leading-[1.08] tracking-tight text-ink">
            {slide.pre} <span className="text-green">{slide.highlight}</span>{" "}
            {slide.post}.
          </Heading>
          <p className="mt-6 max-w-xl text-lg">
            Old, damaged or simply unwanted? Get a fair offer, free pickup and
            payment on collection. We make moving on easy.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#ask-for-our-price" className="btn-green">
              Get my free quote <ArrowIcon className="h-5 w-5" />
            </Link>
            <a href={site.phoneHref} className="btn-outline">
              <PhoneIcon className="h-5 w-5" /> {site.phoneDisplay}
            </a>
          </div>
          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink">
            {["Free towing", "No obligation", "Any condition"].map((text) => (
              <li key={text} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-green" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <figure className="hero-photo">
          <Image
            src="/images/car-removal-truck.webp"
            alt="Illustration of a silver car secured on a flatbed tow truck on a leafy Queensland street"
            width={1536}
            height={1024}
            sizes="(max-width: 1023px) 100vw, 560px"
            preload
            className="aspect-[6/5] w-full object-cover"
          />
          <figcaption className="flex items-center justify-between gap-3 bg-charcoal px-5 py-4 text-sm text-white">
            <span>From your driveway to its next chapter.</span>
            <span className="shrink-0 text-xs text-white/80">
              AI illustration
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="border-y border-green/15 bg-white/70">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4 text-sm text-ink">
          <span className="font-semibold">
            Gold Coast · Brisbane · South East QLD
          </span>
          <span>{site.hours}</span>
          <span className="font-semibold text-green">
            You get paid. We take care of the tow.
          </span>
        </div>
      </div>
    </section>
  );
}
