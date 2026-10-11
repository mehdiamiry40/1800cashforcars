import Image from "next/image";
import heroPhoto from "@/assets/hero-car-truck-cash.png";
import { heroCopy } from "@/lib/slides";
import { QuoteForm } from "./QuoteForm";
import { CashIcon, PinIcon, TruckIcon } from "./icons";

export function Hero({
  where,
  title,
  lead,
  sub,
}: {
  where?: string;
  title?: string;
  lead?: string;
  sub?: string;
}) {
  const copy = heroCopy(where, { title, lead, sub });
  const promises = [
    { Icon: TruckIcon, title: "Free pickup" },
    { Icon: CashIcon, title: "Paid on collection" },
    {
      Icon: PinIcon,
      title:
        where?.replace(/^(?:in|on|across)\s+(?:the\s+)?/i, "") ??
        "Brisbane & SEQ",
    },
  ];

  return (
    <section
      aria-label="Cash for cars and free quote"
      className="hero-section bg-white text-navy"
    >
      <div className="container-site grid items-center gap-5 py-6 sm:gap-7 sm:py-9 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 lg:py-8">
        <div className="min-w-0">
          <h1 className="hero-heading">{copy.title.replace(/\.$/, "")}</h1>
          <p className="mt-3 text-[24px] font-medium leading-snug text-brand">
            {copy.lead}
          </p>
          <Image
            src={heroPhoto}
            alt="A white tow truck carrying an old blue car, with cash in the foreground on a white background"
            preload
            placeholder="blur"
            sizes="(min-width: 1280px) 724px, (min-width: 1024px) calc(100vw - 556px), calc(100vw - 40px)"
            style={{ objectFit: "contain" }}
            className="hero-image mt-4 h-auto w-full"
          />
          <ul className="hero-benefits mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-navy/15 pt-4 text-[15px] font-semibold">
            {promises.map(({ Icon, title }) => (
              <li key={title} className="flex items-center gap-2">
                <Icon
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-brand"
                  strokeWidth={1.5}
                />
                <span>{title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          id="quote"
          data-quote
          className="hero-quote min-w-0 scroll-mt-32 border border-navy/15 border-t-[3px] border-t-brand p-4 sm:p-6"
        >
          <h2 className="mb-5 text-[25px] font-semibold leading-tight">
            Get a free quote
          </h2>
          <QuoteForm variant="compact" />
        </div>
      </div>
    </section>
  );
}
