import Link from "next/link";
import type { Block } from "@/lib/content";
import { services } from "@/lib/content";
import { faqs, reviews, site } from "@/lib/site";
import { QuoteForm } from "./QuoteForm";
import { CashIcon, ClockIcon, LeafIcon, StarIcon } from "./icons";

const tileStyles = [
  { overlay: "bg-[#2b2c2e]/45", band: "bg-black/55", cars: ["#6b7075", "#8d4a3c", "#5a6f86"] },
  { overlay: "bg-green/70", band: "bg-green-dark/70", cars: ["#2f5d2a", "#556b52", "#3e4a3c"] },
  { overlay: "bg-[#8a8f94]/50", band: "bg-black/45", cars: ["#c9ccd0", "#a5aab0", "#7b8187"] },
];

// Stylised pile of car silhouettes used behind each service tile.
function TileArt({ cars }: { cars: string[] }) {
  const car = "M8 34Q7 26 16 24L34 22 46 12Q49 9 55 9H82Q88 9 91 13L102 22 114 24Q122 26 122 33V38Q122 41 119 41H11Q8 41 8 38Z";
  return (
    <svg viewBox="0 0 260 180" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="260" height="180" fill="#6d737a" />
      <g transform="translate(-10 110) scale(1.2)"><path d={car} fill={cars[0]} /></g>
      <g transform="translate(120 118) scale(1.15)"><path d={car} fill={cars[1]} /></g>
      <g transform="translate(55 62) scale(1.05) rotate(-4)"><path d={car} fill={cars[2]} /></g>
      <rect y="150" width="260" height="30" fill="#000" opacity=".25" />
    </svg>
  );
}

export function ServiceTiles() {
  return (
    <section className="container-site">
      <div className="grid md:grid-cols-3">
        {services.map((s, i) => {
          const st = tileStyles[i];
          return (
            <div key={s.slug} className="relative flex min-h-[250px] flex-col justify-end overflow-hidden text-white">
              <TileArt cars={st.cars} />
              <div className={`absolute inset-0 ${st.overlay} mix-blend-multiply`} />
              <div className="relative">
                <h2 className="px-4 text-center font-heading text-[28px] font-bold leading-tight drop-shadow sm:text-[30px]">{s.tile}</h2>
                <div className={`mt-3 ${st.band} px-4 pb-5 pt-3 text-center`}>
                  <p className="text-left text-sm leading-relaxed">{s.blurb}</p>
                  <Link href={`/${s.slug}`} className="mt-3 inline-block border-2 border-black/60 bg-green px-3 py-1 font-heading text-sm font-bold text-black underline hover:bg-green-light">
                    Read more &gt;
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ContentBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((b) => (
        <div key={b.heading}>
          <h2 className="h-section">{b.heading}</h2>
          <div className="prose-site">
            {b.paras?.map((p) => <p key={p}>{p}</p>)}
          </div>
          {b.list && (
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {b.list.map((l) => (
                <li key={l.bold}>
                  <b className="text-ink">{l.bold}</b> – {l.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <div id="faq" className="scroll-mt-6">
      <h2 className="h-section">FAQ</h2>
      <ol className="mt-4 space-y-5">
        {faqs.map((f, i) => (
          <li key={f.q}>
            <h3 className="font-bold text-ink">
              {i + 1}. {f.q}
            </h3>
            <p className="mt-1">{f.a}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function CallUsAndTerms() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="h-sub">Call us today</h2>
        <p className="mt-2">
          Get in touch today on <a href={site.phoneHref} className="font-bold text-green hover:underline">{site.phoneDisplay}</a> for fast,
          friendly car removal and a fair cash offer. We&apos;re open {site.hours.toLowerCase()}.
        </p>
      </div>
      <p className="font-bold italic text-ink">
        Important information: payment is made on pickup by instant bank transfer. Where state law restricts cash payments for
        scrap vehicles (such as in NSW), we pay by electronic transfer only.
      </p>
      <div>
        <h2 className="h-sub">Terms and conditions:</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 font-bold text-ink">
          <li>The seller must be the owner of the vehicle, and the vehicle must be free of any debt, finance or encumbrance.</li>
          <li>We need proof of ownership of the vehicle (e.g. registration papers).</li>
          <li>We need photo ID (valid driver&apos;s licence or passport) for verification and our records.</li>
          <li>We need your BSB and account number to make payment by bank transfer.</li>
        </ol>
      </div>
    </div>
  );
}

export function AskForPrice() {
  return (
    <section id="ask-for-our-price" className="container-site scroll-mt-4 py-12">
      <h2 className="text-center font-heading text-[28px] font-medium uppercase text-phone sm:text-[32px]">Ask for our price</h2>
      <p className="mb-8 mt-1 text-center">Fill in the form and we&apos;ll get back to you with a cash offer — usually within the hour.</p>
      <QuoteForm />
    </section>
  );
}

export function ReviewsBand() {
  const hasReviews = reviews.length > 0;
  const why = [
    { icon: CashIcon, title: "Top cash, paid on pickup", text: "Fair offers based on today's parts and metal prices. The price we quote is the price we pay." },
    { icon: ClockIcon, title: "Same-day removals", text: "Pickups 7 days a week across the Gold Coast, Brisbane and South East Queensland." },
    { icon: LeafIcon, title: "Eco-friendly recycling", text: "Fluids drained safely, good parts reused and metal recycled — nothing dumped." },
  ];
  return (
    <section className="bg-green py-12">
      <div className="container-site">
        <h2 className="text-center font-heading text-[30px] font-medium uppercase text-white sm:text-[36px]">
          {hasReviews ? "Customer reviews" : "Why customers choose us"}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {hasReviews
            ? reviews.slice(0, 3).map((r) => (
                <figure key={r.name + r.text.slice(0, 10)} className="bg-white p-6">
                  <div className="flex gap-0.5 text-[#f5b301]">
                    {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} className="h-4 w-4" />)}
                  </div>
                  <blockquote className="mt-3 text-[15px]">{r.text}</blockquote>
                  <figcaption className="mt-3 font-heading text-lg font-bold text-ink">
                    {r.name}
                    {r.suburb && <span className="font-normal text-body">, {r.suburb}</span>}
                  </figcaption>
                </figure>
              ))
            : why.map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-white p-6">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-green/10 text-green">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-bold text-ink">{title}</h3>
                  <p className="mt-2">{text}</p>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export function MakesRow() {
  const makes = ["Toyota", "Mazda", "Ford", "Holden", "Hyundai", "Nissan", "Mitsubishi", "Kia", "Subaru", "Volkswagen"];
  return (
    <section className="border-b border-line py-8">
      <div className="container-site">
        <p className="text-center font-heading text-sm font-bold uppercase tracking-widest text-body/70">We buy all makes and models</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-3 font-heading text-xl font-bold uppercase text-[#9a9ea3] sm:text-2xl">
          {makes.map((m) => <li key={m}>{m}</li>)}
        </ul>
      </div>
    </section>
  );
}
