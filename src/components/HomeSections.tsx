import Image from "next/image";
import Link from "next/link";
import pickupPhoto from "@/assets/hero-kangaroo-tow.jpg";
import { areaHref, areas, site } from "@/lib/site";
import { vehicleVisuals } from "@/lib/vehicle-visuals";
import { Faq } from "./Blocks";
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

const serviceCards = [
  {
    title: "Cash for cars",
    href: "/cash-for-cars",
    visual: vehicleVisuals.cars,
    Icon: CashIcon,
  },
  {
    title: "Free car removal",
    href: "/car-removal-brisbane",
    visual: vehicleVisuals.cars,
    Icon: TruckIcon,
  },
  {
    title: "Truck removal",
    href: "/truck-removal",
    visual: vehicleVisuals.commercial,
    Icon: TruckIcon,
  },
  {
    title: "Scrap car removal",
    href: "/scrap-car-removal",
    visual: vehicleVisuals.scrap,
    Icon: CarIcon,
  },
  {
    title: "Car wreckers",
    href: "/car-wreckers",
    visual: vehicleVisuals.scrap,
    Icon: LeafIcon,
  },
  {
    title: "Car disposal",
    href: "/car-disposal",
    visual: vehicleVisuals.scrap,
    Icon: CarIcon,
  },
];

export function HomeServices() {
  return (
    <section id="services" className="section-site">
      <div className="container-site">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10 lg:mb-12">
          <h2 className="h-section !text-brand">Our services</h2>
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            Explore all services{" "}
            <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <ServiceGrid />
      </div>
    </section>
  );
}

export function ServiceGrid() {
  return (
    <div className="service-grid grid grid-cols-2 gap-x-3 gap-y-5 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-3">
      {serviceCards.map(({ title, href, visual, Icon }) => (
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
            <h3 className="min-w-0 flex-1 text-[17px] font-semibold leading-snug sm:text-[20px]">
              {title}
            </h3>
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
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover object-[65%_50%]"
          />
        </div>
        <div>
          <TruckIcon
            aria-hidden="true"
            className="mb-5 h-10 w-10 text-brand"
            strokeWidth={1.5}
          />
          <h2 className="h-section">
            <span className="text-brand">Your car.</span> Collected for free.
          </h2>
          <p className="mt-4 text-[18px] sm:text-[20px]">
            From home, work or the mechanic. Running or not, we arrange the
            pickup.
          </p>
          <p className="mb-6 mt-3">
            Tell us where it is and choose a time that suits you. There are no
            towing fees taken off your price.
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
        <h2 className="h-section mb-8 !text-brand">Your car. Your way.</h2>
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
      visual: vehicleVisuals.cars,
      Icon: CarIcon,
    },
    {
      title: "For businesses",
      text: "Utes, vans and trucks. Arrange collection for a work vehicle or fleet.",
      href: "/truck-removal",
      link: "Explore truck removal",
      visual: vehicleVisuals.commercial,
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
            src={pickupPhoto}
            alt="An old blue car loaded on a white tow truck"
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover object-[80%_50%]"
          />
        </div>
        <div>
          <h2 className="h-section">
            <span className="text-brand">Straightforward</span> from start to
            finish.
          </h2>
          <p className="mt-4 max-w-md text-[18px] sm:text-[20px]">
            A local team in Rocklea. A clear quote. Pickup at a time that suits
            you.
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
              <h2 className="text-[24px] font-bold leading-snug">{title}</h2>
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
      text: "Make, model, condition and usable parts all affect the price. Here’s how we work it out.",
      href: "/cash-for-cars",
      visual: vehicleVisuals.cars,
      link: "How pricing works",
    },
    {
      title: "Getting ready for pickup",
      text: "Have your photo ID and ownership papers ready, and remove your personal belongings.",
      href: "/car-removals",
      visual: vehicleVisuals.scrap,
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

export function HomeFaq() {
  return (
    <section id="faq" className="section-site scroll-mt-32">
      <div className="container-site grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <QuoteIcon
            aria-hidden="true"
            className="mb-5 h-10 w-10 text-brand"
            strokeWidth={1.5}
          />
          <h2 className="h-section !text-brand">A few helpful answers.</h2>
          <p className="mb-5 mt-4 max-w-sm">
            Selling a car or arranging pickup? Start here.
          </p>
          <Link
            href="/cash-for-cars"
            className="inline-flex min-h-11 items-center gap-2 font-semibold"
          >
            More about selling your car{" "}
            <ArrowIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <Faq bare />
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
