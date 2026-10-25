import { goldCoastLocal, goldCoastSuburbs } from "./areas/gold-coast";
import { ipswichSuburbs } from "./areas/ipswich-suburbs";
import { loganSuburbs } from "./areas/logan-suburbs";
import { sunshineCoastLocal, sunshineCoastSuburbs } from "./areas/sunshine-coast";
import { tweedHeadsLocal, tweedHeadsSuburbs } from "./areas/tweed-heads";
import type { CopyFaq, CopySection } from "./copy";

// Central business details. Edit these values and every page updates.
export const site = {
  name: "1800-CASH-FOR-CARS",
  domain: "1800cashforcars.com.au",
  url: "https://1800cashforcars.com.au",
  tagline: "We buy cars in any condition. Free pickup, paid on the day.",
  // Slowest timing already promised on the site. Faster lines are rewritten to these.
  quoteTurnaround: "usually within the hour",
  pickupTurnaround: "usually within a day or two",
  phoneDisplay: "0423 514 111",
  phoneHref: "tel:+61423514111",
  email: "quotes@1800cashforcars.com.au",
  // Only show the email address on the site once the mailbox (or forwarding) is set up, otherwise emails bounce.
  showEmail: true,
  pickups: "Pickups Monday to Saturday, at a time that suits you",
  // Yard opening hours, copied from the Google Business Profile (keep the two matching). Used in the business schema.
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
    { days: ["Saturday"], opens: "08:00", closes: "14:00" },
  ],
  abn: "62 351 619 456",
  // The motor dealer licence is held by the parent, not by this brand. Legal name and ABN
  // for A Plus are omitted until the owner confirms them.
  parentLicence: "Queensland motor dealer licence 4253110",
  licenceLine: "Licensed through our parent company, A Plus Car Removal (QLD motor dealer licence 4253110).",
  // Keep the address exactly as it is on the Google Business Profile (79B), so Google sees one consistent business.
  address: "79B Breadwell St, Rocklea QLD 4106", // shown in footer + contact page
  addressParts: { street: "79B Breadwell St", locality: "Rocklea", region: "QLD", postcode: "4106", country: "AU" },
  // Opens the Google Business Profile, so "Get directions" lands on the listing with reviews.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=A+Plus+Car+Removal&query_place_id=ChIJRzxkE1tFkWsRoM6OVb6TIAw",
  geo: { latitude: -27.5474913, longitude: 153.006389 }, // pin on the Google Business Profile
  // Google Business Profile of the parent business. The yard is listed on Google as A Plus Car Removal.
  // This brand is part of A Plus Car Removal; they share this yard. Blank hides the reviews link.
  googleBusinessUrl: "https://www.google.com/maps?cid=873860773398367904",
  googleBusinessName: "A Plus Car Removal",
  parentUrl: "https://apluscarremoval.com.au",
  // Star rating and review count on the A Plus Car Removal Google listing. Update now and then; blank count hides the quote-card line.
  // The quote card shows the count as plain text. It is not in structured data.
  // Do not mark it up as AggregateRating or Review.
  googleRating: { score: "5.0", count: 438 },
  // Headline figure, e.g. "$15,000" → "GET UP TO $15,000". Leave blank to show "GET TOP CASH".
  // Only use a figure you genuinely pay; it's an advertised claim under Australian Consumer Law.
  maxPayout: "",
  // Mobile number that can receive texts, e.g. "0400000000". Blank hides the SMS button.
  smsNumber: "+61423514111",
  social: {
    facebook: "",
    instagram: "",
  },
};

// Existing generated share image (app/opengraph-image.tsx). Same artwork on every page.
export const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "1800-CASH-FOR-CARS. Cash for scrap cars. Any car, any condition.",
};

// Next.js shallow-merges metadata, so a page that sets `openGraph` replaces the
// root object and drops og:site_name and og:image. Every route should use this helper.
export function pageOpenGraph(path: string) {
  return {
    type: "website" as const,
    locale: "en_AU",
    siteName: site.name,
    url: path,
    images: [shareImage],
  };
}

export const pageTwitter = {
  card: "summary_large_image" as const,
  images: [shareImage],
};

// Real customer reviews only (e.g. copied from your Google Business profile with permission).
// While this is empty the reviews band shows "why choose us" cards instead.
export const reviews: { name: string; text: string; suburb?: string }[] = [];

export type Area = {
  slug: string;
  name: string;
  where: string; // e.g. "on the Gold Coast", "in Brisbane"
  state: string;
  suburbs: string[];
  /** Overrides the default /locations/<slug> page (Brisbane has dedicated pages). */
  href?: string;
  /**
   * Short blurb on /locations, plus the older templated area page.
   * Logan and Ipswich only set `intro` here. Their pages are dedicated routes.
   */
  local?: {
    intro: string;
    pickup?: string;
    notes?: { bold: string; text: string }[];
    sections?: CopySection[];
    cta?: { text: string; from: string };
    faqs?: CopyFaq[];
  };
};

export const areaHref = (a: Area) => a.href ?? `/locations/${a.slug}`;

export const areas: Area[] = [
  {
    slug: "gold-coast",
    name: "Gold Coast",
    where: "on the Gold Coast",
    state: "QLD",
    suburbs: goldCoastSuburbs,
    local: goldCoastLocal,
  },
  {
    slug: "brisbane",
    name: "Brisbane",
    where: "in Brisbane",
    state: "QLD",
    href: "/car-removal-brisbane",
    suburbs: ["Brisbane City", "Chermside", "Carindale", "Indooroopilly", "Sunnybank", "Wynnum", "Aspley", "Mt Gravatt", "Kenmore", "Nundah"],
  },
  {
    slug: "logan",
    name: "Logan",
    where: "in Logan",
    state: "QLD",
    suburbs: loganSuburbs,
    local: {
      intro: "We buy scrap, old and damaged cars across all 69 suburbs of Logan, and tow them free from our Rocklea yard.",
    },
  },
  {
    slug: "ipswich",
    name: "Ipswich",
    where: "in Ipswich",
    state: "QLD",
    suburbs: ipswichSuburbs,
    local: {
      intro: "We buy unwanted cars across the City of Ipswich, from Springfield and Ripley out to rural Rosewood, and the tow is free.",
    },
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    where: "on the Sunshine Coast",
    state: "QLD",
    suburbs: sunshineCoastSuburbs,
    local: sunshineCoastLocal,
  },
  {
    slug: "tweed-heads",
    name: "Tweed Heads",
    where: "in Tweed Heads",
    state: "NSW",
    suburbs: tweedHeadsSuburbs,
    local: tweedHeadsLocal,
  },
];

export const faqs = [
  {
    q: "How much will I get for my car?",
    a: "It depends on the make, model, year, condition, and what parts and scrap metal are worth at the moment. Tell us about the car and we'll give you a firm price, usually within the hour. There are no towing fees taken off.",
  },
  {
    q: "Do you buy cars that don't run?",
    a: "Yes. We buy cars that run and cars that don't, plus crashed, flood-damaged, unregistered, rusty and scrap cars. We buy trucks too, from light trucks to heavy rigids.",
  },
  {
    q: "Is the towing really free?",
    a: "Yes. Pickup is free anywhere in our service areas, and we never take the cost of towing off your price.",
  },
  {
    q: "How do I get paid?",
    a: "In cash or by bank transfer, your choice, when we pick the car up and before it leaves. In NSW (including Tweed Heads) the law doesn't allow cash for scrap vehicles, so it's bank transfer there.",
  },
  {
    q: "What paperwork do I need?",
    a: "Photo ID (driver's licence or passport) and proof of ownership, like the rego papers. If you've lost the papers, tell us. We can usually still sort it out.",
  },
  {
    q: "How quickly can you pick it up?",
    a: "Usually within a day or two. You choose the time, Monday to Saturday.",
  },
  {
    q: "What happens to the car?",
    a: "Anything usable gets pulled and resold, the fluids are drained and disposed of properly, and the rest goes to a metal recycler.",
  },
  {
    q: "Do I need to cancel my rego and insurance?",
    a: "Yes. Once we've collected the car, cancel both. You may get a refund on unused rego. We'll give you a receipt for your records.",
  },
];

// Brisbane suburbs we cover, grouped for the Brisbane pages (our yard is in Rocklea).
export const brisbaneSuburbs: { region: string; suburbs: string[] }[] = [
  {
    region: "Southside",
    suburbs: ["Rocklea", "Moorooka", "Salisbury", "Acacia Ridge", "Coopers Plains", "Sunnybank", "Runcorn", "Eight Mile Plains", "Mt Gravatt", "Annerley", "Yeronga", "Calamvale", "Algester"],
  },
  {
    region: "Northside",
    suburbs: ["Chermside", "Aspley", "Zillmere", "Geebung", "Nundah", "Kedron", "Stafford", "Everton Park", "Mitchelton", "Bracken Ridge", "Carseldine", "Bald Hills"],
  },
  {
    region: "Western suburbs",
    suburbs: ["Oxley", "Darra", "Inala", "Forest Lake", "Richlands", "Jindalee", "Mt Ommaney", "Indooroopilly", "Toowong", "Kenmore", "Chapel Hill"],
  },
  {
    region: "Eastern suburbs & bayside",
    suburbs: ["Carindale", "Cannon Hill", "Morningside", "Coorparoo", "Camp Hill", "Tingalpa", "Murarrie", "Hemmant", "Wynnum", "Manly", "Belmont"],
  },
];
