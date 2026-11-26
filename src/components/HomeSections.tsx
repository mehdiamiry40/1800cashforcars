import Image from "next/image";
import Link from "next/link";
import pickupPhoto from "@/assets/hero-kangaroo-tow.jpg";
import type { CopyFaq } from "@/lib/copy";
import { areaHref, areas, site } from "@/lib/site";
import {
  advicePhotos,
  collectionPhoto,
  sellerPhotos,
  servicePhotos,
  vehicleVisuals,
} from "@/lib/vehicle-visuals";
import { RichText } from "./AreaPage";
import { BrisbaneSuburbs, Faq } from "./Blocks";
import { QuoteLink } from "./QuoteLink";
import {
  ArrowIcon,
  CarIcon,
  CashIcon,
  ClipboardIcon,
  LeafIcon,
  PhoneIcon,
  QuoteIcon,
  ShieldIcon,
  SmsIcon,
  TruckIcon,
} from "./icons";

// `homeTitle` is the label on the homepage only. It sends the how-to, old-truck and scrap queries
// to their own pages, so the homepage can stay the "cash for cars Brisbane" hub.
// `title` is the label on /services. If you change one, also change the `updated` date of the
// services page in src/lib/content.ts.
const serviceCards: {
  title: string;
  homeTitle?: string;
  href: string;
  visual: (typeof servicePhotos)[keyof typeof servicePhotos];
  Icon: typeof CashIcon;
}[] = [
  {
    title: "Cash for cars",
    homeTitle: "Sell your car for cash in Brisbane",
    href: "/cash-for-cars",
    visual: servicePhotos.cash,
    Icon: CashIcon,
  },
  {
    title: "Free car removal Brisbane",
    href: "/car-removal-brisbane",
    visual: servicePhotos.removal,
    Icon: TruckIcon,
  },
  {
    title: "Truck removal",
    homeTitle: "Cash for old trucks in Brisbane",
    href: "/truck-removal",
    visual: servicePhotos.truck,
    Icon: TruckIcon,
  },
  {
    title: "Cash for scrap cars",
    homeTitle: "Cash for scrap cars in Brisbane",
    href: "/scrap-car-removal",
    visual: servicePhotos.scrap,
    Icon: CarIcon,
  },
  {
    title: "Car wreckers",
    href: "/car-wreckers",
    visual: servicePhotos.wreckers,
    Icon: LeafIcon,
  },
  {
    title: "Car disposal",
    href: "/car-disposal",
    visual: servicePhotos.disposal,
    Icon: CarIcon,
  },
];

export function HomeServices() {
  return (
    <section id="services" className="section-site">
      <div className="container-site">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10 lg:mb-12">
          <h2 className="h-section !text-brand">Our Brisbane services</h2>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Explore all services{" "}
            <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <ServiceGrid home />
      </div>
    </section>
  );
}

/**
 * `heading` is the level of each card's title: "h2" where the grid sits straight under the page's h1.
 * `home` uses the homepage labels.
 */
export function ServiceGrid({ heading: Heading = "h3", home = false }: { heading?: "h2" | "h3"; home?: boolean }) {
  const cards = serviceCards.map((card) => ({ ...card, title: (home && card.homeTitle) || card.title }));
  return (
    <div className="service-grid grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3">
      {cards.map(({ title, href, visual, Icon }) => (
        <Link key={href} href={href} className="service-card group block">
          <div className="service-media relative aspect-[4/3] overflow-hidden">
            <Image
              src={visual.image}
              alt={visual.alt}
              fill
              placeholder="blur"
              sizes="(max-width: 767px) 96px, (pointer: coarse) and (max-width: 1023px) 96px, (min-width: 1280px) 380px, (min-width: 1024px) 30vw, 45vw"
              style={{ objectFit: "contain" }}
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="service-caption flex min-h-16 items-center gap-2 border-b-2 border-brand py-3 sm:gap-3 sm:py-4">
            <Icon
              aria-hidden="true"
              className="hidden h-7 w-7 shrink-0 text-brand sm:block"
              strokeWidth={1.5}
            />
            <Heading className="min-w-0 flex-1 text-[17px] font-semibold leading-snug sm:text-[20px]">
              {title}
            </Heading>
            <ArrowIcon
              aria-hidden="true"
              className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

export function PickupSection() {
  return (
    <section className="section-site">
      <div className="container-site grid gap-8 md:grid-cols-2 md:items-center md:gap-14">
        <div className="pickup-media relative aspect-[4/3] overflow-hidden">
          <Image
            src={pickupPhoto}
            alt="A tow truck carrying an old car on a leafy Queensland street"
            fill
            placeholder="blur"
            quality={55}
            sizes="(max-width: 767px) 360px, (min-width: 1280px) 640px, 45vw"
            className="object-cover object-[65%_50%]"
          />
        </div>
        <div>
          <TruckIcon
            aria-hidden="true"
            className="mb-5 h-10 w-10 text-brand"
            strokeWidth={1.5}
          />
          <h2 className="h-section !text-brand">Is the towing really free?</h2>
          <p className="mt-4 text-[18px] sm:text-[20px]">
            Yes. We don&apos;t charge for the tow from our Rocklea yard, and we don&apos;t take it off your price after you accept. That&apos;s the same whether the car runs or not. We pick up from homes, workplaces and repair shops, Monday to Saturday.
          </p>
          <p className="mb-6 mt-3">
            Tell us where it is and choose a time that suits you. You&apos;re
            paid on pickup, with no towing fees taken off your price.
          </p>
          <div className="pickup-actions flex flex-wrap gap-3">
            <Link href="/car-removals" className="btn-brand">
              <span className="sm:hidden">Car removal</span>
              <span className="hidden sm:inline">Explore car removal</span>{" "}
              <ArrowIcon aria-hidden="true" className="h-5 w-5" />
            </Link>
            <QuoteLink from="pickup" className="btn-line">
              Get a free quote
            </QuoteLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// The main written content for "cash for cars Brisbane", the search the homepage owns. Kept visible
// (not behind accordions) so it reads as the page's core copy. Free car removal, scrap cars, selling
// step by step and the valuation tool each have their own page, so they get a link here, not a heading.
export function BrisbaneCashForCars() {
  const topics: { title: string; paras: string[]; note?: { text: string; links: { phrase: string; href: string }[] } }[] = [
    {
      title: "Who we buy cars from in Brisbane",
      paras: [
        "Car owners and businesses. An owner might be clearing the driveway, moving on from a second car nobody drives, or holding a repair quote that is more than the car is worth. A business might have a work ute, a van or a small fleet that has reached the end of its working life.",
        "You don't need to bring the car anywhere. We come to your home, your workplace or the repair shop, anywhere in Brisbane.",
      ],
    },
    {
      title: "What we pay for cars in Brisbane",
      paras: [
        "Every car gets its own price. We look at the make, model, year and kilometres, whether it runs, the condition of the engine, gearbox and panels, and what scrap metal is worth this week. A late-model car that runs is worth the most, but even a rusted-out wreck has value in its parts and metal.",
        "Tell us about the car and we'll give you a firm price, usually within the hour. The price we quote is the price we pay when the car is as described. Nothing comes off for towing.",
      ],
      note: {
        text: "Wondering how much your scrap car is worth? Our current Brisbane guide sets out the ranges, and cash for scrap cars in Brisbane is handled on the scrap car removal page. If the car still runs and you might sell it privately, a Brisbane car valuation gives you a market estimate first. That estimate is not our cash offer.",
        links: [
          { phrase: "how much your scrap car is worth", href: "/scrap-car-prices-brisbane" },
          { phrase: "cash for scrap cars in Brisbane", href: "/scrap-car-removal" },
          { phrase: "Brisbane car valuation", href: "/autoval" },
        ],
      },
    },
    {
      title: "Cars we buy across Brisbane",
      paras: [
        "We buy sedans, hatchbacks, 4WDs, SUVs, utes, vans and trucks, from every make: Toyota, Holden, Ford, Mazda, Hyundai, Nissan, Mitsubishi, Kia and the rest. Running or not, registered or not.",
        "That includes crashed and written-off cars, flood and hail damaged cars, cars that failed a roadworthy, cars with a blown engine or no keys, and old cars that have been sitting in the backyard for years.",
      ],
      note: {
        text: "We also collect cars with no keys or no wheels. Selling a truck? See cash for old trucks.",
        links: [
          { phrase: "cars with no keys or no wheels", href: "/car-removal-no-keys-no-wheels" },
          { phrase: "cash for old trucks", href: "/truck-removal" },
        ],
      },
    },
    {
      title: "How fast can you pick up in Brisbane?",
      paras: [
        "Pickups are usually within a day or two. Our yard is in Rocklea, on Brisbane's southside, and you set the time, Monday to Saturday. A firm price is usually within the hour.",
        "We pick up from houses, units, workshops, car parks and the roadside. The pickup is free, and nothing comes off your price for it.",
      ],
      note: {
        text: "The tow itself, and the suburbs it covers, is on free car removal in Brisbane.",
        links: [{ phrase: "free car removal in Brisbane", href: "/car-removal-brisbane" }],
      },
    },
    {
      title: "Paperwork and rego when you sell",
      paras: [
        "Have your photo ID and proof of ownership ready, such as the rego papers. The car shouldn't have finance owing on it. We pay you in cash or by bank transfer before the car leaves, and give you a receipt.",
        "After pickup, cancel the registration with Transport and Main Roads (you can do it online) and you may get a refund on the rego you haven't used. Then cancel your insurance.",
      ],
      note: {
        text: "Each step of the sale, from the quote to the receipt, is on sell your car for cash in Brisbane.",
        links: [{ phrase: "sell your car for cash", href: "/cash-for-cars" }],
      },
    },
    {
      title: "Logan, Ipswich and the rest of South East Queensland",
      paras: [
        "The same Rocklea yard buys cars outside Brisbane as well: in Logan and Ipswich, on the Gold Coast and the Sunshine Coast, and over the border in Tweed Heads. The pickup is free in each of them.",
      ],
      note: {
        text: "The suburbs and local notes are on cash for cars in Logan and cash for cars in Ipswich. The rest are listed under the areas we cover.",
        links: [
          { phrase: "cash for cars in Logan", href: "/locations/logan" },
          { phrase: "cash for cars in Ipswich", href: "/locations/ipswich" },
          { phrase: "areas we cover", href: "/locations" },
        ],
      },
    },
  ];

  return (
    <section id="brisbane" className="section-site scroll-mt-32 border-t border-line">
      <div className="container-site">
        <div className="max-w-3xl">
          <h2 className="h-section !text-brand">Cash for cars in Brisbane, paid on pickup</h2>
          <p className="mt-4 text-[18px] sm:text-[20px]">
            {site.name} pays cash for cars across Brisbane and South East Queensland, from our own yard in Rocklea. We buy cars, utes, vans and 4WDs in any condition: running or not, registered or not, damaged, rusted or simply no longer needed.
          </p>
          <p className="mt-3 text-[18px]">
            Tell us the make, model, year and condition, and we send a firm price, usually within the hour. If you accept it, we collect the car, usually within a day or two, and pay you in cash or by bank transfer before it leaves. The pickup is free.
          </p>
        </div>
        <div className="mt-10 grid gap-x-14 gap-y-10 md:grid-cols-2">
          {topics.map((t) => (
            <div key={t.title} className="border-t-4 border-brand pt-5">
              <h3 className="h-sub">{t.title}</h3>
              <div className="prose-site">
                {t.paras.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {t.note && (
                  <p>
                    <RichText text={t.note.text} links={t.note.links} />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h3 className="h-sub">Brisbane suburbs we buy cars in</h3>
          <p className="mt-3">
            Every Brisbane suburb: the northside, the southside, the western suburbs and the bayside. Select a region to see the suburbs.
          </p>
          <BrisbaneSuburbs />
        </div>
      </div>
    </section>
  );
}

export function QuoteOptions() {
  const options = [
    {
      Icon: ClipboardIcon,
      title: "Get a quote online",
      text: "Tell us the make, model, year and condition. We’ll send you a price.",
      href: "/quote",
      link: "Get your price",
    },
    {
      Icon: PhoneIcon,
      title: "Give us a call",
      text: "Talk through your vehicle and arrange a pickup with our team.",
      href: site.phoneHref,
      link: site.phoneDisplay,
    },
    ...(site.smsNumber
      ? [
          {
            Icon: SmsIcon,
            title: "Send us a text",
            text: "Send your car’s details and suburb. Photos help us work out the price.",
            href: `sms:${site.smsNumber}`,
            link: "Text your car’s details",
          },
        ]
      : []),
  ];
  return (
    <section className="section-site">
      <div className="container-site">
        <h2 className="h-section !text-brand">Your car. Your way.</h2>
        <p className="mb-8 max-w-3xl text-[18px]">
          Call, text, or send the car&apos;s details. If you want a market estimate before a cash offer,{" "}
          <Link href="/autoval" className="font-semibold underline underline-offset-4">
            check what your car is worth
          </Link>
          .
        </p>
        <div className="quote-options grid gap-7 md:grid-cols-3">
          {options.map(({ Icon, title, text, href, link }) => {
            const content = (
              <>
                <Icon
                  aria-hidden="true"
                  className="mb-5 h-10 w-10 text-brand"
                  strokeWidth={1.5}
                />
                <h3 className="text-[24px] font-semibold sm:text-[28px]">
                  {title}
                </h3>
                <p className="mb-4 mt-3">{text}</p>
                <span className="inline-flex min-h-11 items-center gap-3 font-semibold">
                  {link}
                  <ArrowIcon aria-hidden="true" className="h-5 w-5" />
                </span>
              </>
            );
            return href === "/quote" ? (
              <QuoteLink
                key={href}
                from="quote-options"
                className="quote-option group border-t-4 border-brand py-6"
              >
                {content}
              </QuoteLink>
            ) : (
              <a
                key={href}
                href={href}
                className="quote-option group border-t-4 border-brand py-6"
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SellerSection() {
  const sellers = [
    {
      title: "For car owners",
      text: "Clear the driveway, sell a damaged car or move on from one you no longer use.",
      href: "/cash-for-cars",
      link: "Sell your car",
      visual: sellerPhotos.owner,
      Icon: CarIcon,
    },
    {
      title: "For businesses",
      text: "Utes, vans and trucks. Arrange collection for a work vehicle or fleet.",
      href: "/truck-removal",
      link: "Explore cash for old trucks",
      visual: sellerPhotos.business,
      Icon: TruckIcon,
    },
  ];
  return (
    <section className="section-site">
      <div className="container-site">
        <h2 className="h-section mb-8 !text-brand sm:mb-10">
          Your vehicle. Our expertise.
        </h2>
        <div className="grid gap-9 md:grid-cols-2 md:gap-8">
          {sellers.map(({ title, text, href, link, visual, Icon }) => (
            <Link href={href} key={href} className="seller-card group block">
              <div className="seller-media relative aspect-[16/10] overflow-hidden">
                <Image
                  src={visual.image}
                  alt={visual.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 767px) 96px, (pointer: coarse) and (max-width: 1023px) 96px, 45vw"
                  style={{ objectFit: "contain" }}
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Icon
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0 text-brand"
                  strokeWidth={1.5}
                />
                <h3 className="flex-1 text-[24px] font-semibold sm:text-[28px]">
                  {title}
                </h3>
                <ArrowIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
              </div>
              <p className="mt-3 max-w-lg">{text}</p>
              <span className="mt-4 inline-flex min-h-11 items-center text-[16px] font-semibold underline underline-offset-4">
                {link}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VehicleGallery() {
  const vehicles = [
    {
      title: "Cars & 4WDs",
      visual: vehicleVisuals.cars,
      href: "/cash-for-cars",
    },
    {
      title: "Utes, vans & trucks",
      visual: vehicleVisuals.commercial,
      href: "/truck-removal",
    },
    {
      title: "Scrap & damaged cars",
      visual: vehicleVisuals.scrap,
      href: "/scrap-car-removal",
    },
  ];
  return (
    <section className="section-site">
      <div className="container-site">
        <h2 className="h-section mb-8 !text-brand sm:mb-10 lg:mb-12">
          A price for every vehicle
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {vehicles.map(({ title, visual, href }) => (
            <Link key={href} href={href} className="vehicle-card group block">
              <div className="vehicle-media relative aspect-[16/9] overflow-hidden md:aspect-[4/5]">
                <Image
                  src={visual.image}
                  alt={visual.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 767px) 104px, (pointer: coarse) and (max-width: 1023px) 104px, 30vw"
                  style={{ objectFit: "contain" }}
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <span className="mt-4 flex items-center justify-between gap-3 text-[20px] font-semibold">
                {title}
                <ArrowIcon aria-hidden="true" className="h-5 w-5 shrink-0" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseSection() {
  const promises = [
    {
      Icon: ShieldIcon,
      title: "A clear price",
      text: "The quoted price is what we pay when the car is as described.",
    },
    {
      Icon: TruckIcon,
      title: "Free collection",
      text: "No towing fees, even when your car doesn’t run.",
    },
    {
      Icon: CashIcon,
      title: "Paid before it leaves",
      text: "Payment on pickup, before we tow your car away.",
    },
  ];
  return (
    <section className="section-site">
      <div className="container-site grid gap-8 md:grid-cols-2 md:items-center md:gap-14">
        <div className="team-media relative aspect-[4/3] overflow-hidden md:aspect-[4/5]">
          <Image
            src={collectionPhoto.image}
            alt={collectionPhoto.alt}
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="h-section !text-brand">How do I get paid?</h2>
          <p className="mt-4 max-w-3xl text-[18px] sm:text-[20px]">
            We pay you when we collect the car, before it leaves, and give you a receipt. In Queensland you choose cash or a bank transfer. In NSW, including Tweed Heads, the law doesn&apos;t allow cash for scrap vehicles, so we pay by bank transfer there. Nothing comes off the price for towing.
          </p>
          <ul className="my-7 space-y-6">
            {promises.map(({ Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon
                  aria-hidden="true"
                  className="mt-1 h-8 w-8 shrink-0 text-brand"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="text-[20px] font-semibold">{title}</h3>
                  <p className="mt-1 text-[16px]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/contact-us"
            className="inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Talk to our team{" "}
            <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProcessStrip() {
  const steps = [
    { Icon: ClipboardIcon, title: "Tell us about your car" },
    { Icon: CashIcon, title: "Get your price" },
    { Icon: TruckIcon, title: "Get paid. We collect." },
  ];
  return (
    <section aria-label="How it works" className="bg-brand text-white">
      <ol className="container-site grid gap-8 py-10 sm:grid-cols-3 sm:py-12">
        {steps.map(({ Icon, title }, i) => (
          <li key={title} className="flex items-center gap-4">
            <Icon
              aria-hidden="true"
              className="h-10 w-10 shrink-0"
              strokeWidth={1.5}
            />
            <div>
              <span className="text-[24px] font-bold">0{i + 1}</span>
              <p className="text-[24px] font-bold leading-snug">{title}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function SellingAdvice() {
  const advice = [
    {
      title: "What is your car worth?",
      text: "The price depends on the make, model and year, and on what still works. A sound engine or good panels add to it, and a car that starts is worth more than one that doesn't. Towing isn't taken off. Tell us about the car and we'll send a firm price, usually within the hour.",
      href: "/cash-for-cars",
      visual: advicePhotos.value,
      link: "How pricing works",
    },
    {
      title: "Getting ready for pickup",
      text: "Have your photo ID and ownership papers ready, and remove your personal belongings.",
      href: "/car-removals",
      visual: advicePhotos.preparation,
      link: "What to expect",
    },
  ];
  return (
    <section className="section-site">
      <div className="container-site">
        <h2 className="h-section mb-8 !text-brand">Sell with confidence.</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {advice.map(({ title, text, href, visual, link }) => (
            <Link key={href} href={href} className="advice-card group block">
              <div className="advice-media relative aspect-[16/9] overflow-hidden">
                <Image
                  src={visual.image}
                  alt={visual.alt}
                  fill
                  placeholder="blur"
                  sizes="(max-width: 767px) 96px, (pointer: coarse) and (max-width: 1023px) 96px, 45vw"
                  style={{ objectFit: "contain" }}
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-5 flex items-start justify-between gap-4 text-[24px] font-semibold sm:text-[28px]">
                {title}
                <ArrowIcon
                  aria-hidden="true"
                  className="mt-2 h-5 w-5 shrink-0"
                />
              </h3>
              <p className="mt-3">{text}</p>
              <span className="mt-5 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                {link}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeFaq({ items }: { items?: CopyFaq[] }) {
  return (
    <section id="faq" className="section-site scroll-mt-32">
      <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <QuoteIcon
            aria-hidden="true"
            className="mb-5 h-10 w-10 text-brand"
            strokeWidth={1.5}
          />
          <h2 className="h-section !text-brand">Cash for cars Brisbane FAQs</h2>
          <p className="mb-5 mt-4 max-w-sm">
            Selling a car in Brisbane or arranging a pickup? Start here.
          </p>
          <Link
            href="/cash-for-cars"
            className="inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Sell your car for cash in Brisbane{" "}
            <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <Faq bare items={items} />
      </div>
    </section>
  );
}

export function HomeAreas() {
  return (
    <section id="areas" className="scroll-mt-32">
      <div className="container-site flex flex-wrap items-center justify-between gap-5 pb-12">
        <h2 className="text-[24px] font-semibold">
          Brisbane &amp; South East QLD
        </h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link
                href={areaHref(a)}
                className="inline-flex min-h-11 items-center text-[16px] font-semibold underline underline-offset-4"
              >
                {a.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
