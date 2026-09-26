import { site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { TowTruck } from "./TowTruck";
import { CheckIcon, PhoneIcon } from "./icons";

export function Hero({
  eyebrow = "Cash for cars · South East QLD",
  title = (
    <>
      Top cash for your car.
      <span className="block text-cash-400">We&apos;ll even pick it up.</span>
    </>
  ),
  sub = "Old, damaged, broken down or just unwanted — get a free offer in 60 seconds, choose a pickup time, and get paid on the spot.",
  defaultArea = "",
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  sub?: string;
  defaultArea?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(29,111,224,.45),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(255,210,31,.15),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div>
          <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cash-300 ring-1 ring-white/15">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{sub}</p>
          <ul className="mt-6 grid max-w-lg grid-cols-2 gap-2.5 text-sm font-semibold">
            {["Free towing & removal", "Paid before we leave", "Same-day pickups", "Any make, any condition"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-money-500" /> {t}
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className="mt-8 inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-cash-400 text-navy-950">
              <PhoneIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-white/60">Prefer to talk? Call now</span>
              <span className="block font-display text-2xl font-black">{site.phoneDisplay}</span>
            </span>
          </a>
          <TowTruck className="mt-10 hidden w-full max-w-md lg:block" />
        </div>
        <div id="quote">
          <QuoteForm defaultArea={defaultArea} />
        </div>
      </div>
    </section>
  );
}
