// Central business details. Edit these values and every page updates.
export const site = {
  name: "1800 Cash For Cars",
  domain: "1800cashforcars.com.au",
  url: "https://1800cashforcars.com.au",
  tagline: "We buy cars in any condition. Free pickup, paid on the day.",
  phoneDisplay: "0423 514 111",
  phoneHref: "tel:+61423514111",
  email: "quotes@1800cashforcars.com.au",
  // Only show the email address on the site once the mailbox (or forwarding) is set up, otherwise emails bounce.
  showEmail: true,
  pickups: "Pickups 7 days, at a time that suits you",
  abn: "62 351 619 456",
  address: "79 Breadwell St, Rocklea QLD 4106", // shown in footer + contact page
  addressParts: { street: "79 Breadwell St", locality: "Rocklea", region: "QLD", postcode: "4106", country: "AU" },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=79+Breadwell+St+Rocklea+QLD+4106",
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
};

export const areaHref = (a: Area) => a.href ?? `/locations/${a.slug}`;

export const areas: Area[] = [
  {
    slug: "gold-coast",
    name: "Gold Coast",
    where: "on the Gold Coast",
    state: "QLD",
    suburbs: ["Southport", "Surfers Paradise", "Robina", "Nerang", "Coomera", "Burleigh Heads", "Helensvale", "Coolangatta", "Mudgeeraba", "Ormeau"],
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
    suburbs: ["Springwood", "Beenleigh", "Browns Plains", "Shailer Park", "Logan Central", "Slacks Creek", "Jimboomba", "Loganholme"],
  },
  {
    slug: "ipswich",
    name: "Ipswich",
    where: "in Ipswich",
    state: "QLD",
    suburbs: ["Ipswich Central", "Springfield", "Goodna", "Redbank Plains", "Booval", "Rosewood", "Yamanto", "Ripley"],
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    where: "on the Sunshine Coast",
    state: "QLD",
    suburbs: ["Maroochydore", "Caloundra", "Noosa", "Nambour", "Mooloolaba", "Buderim", "Kawana", "Coolum Beach"],
  },
  {
    slug: "tweed-heads",
    name: "Tweed Heads",
    where: "in Tweed Heads",
    state: "NSW",
    suburbs: ["Tweed Heads", "Kingscliff", "Banora Point", "Murwillumbah", "Pottsville", "Terranora"],
  },
];

export const faqs = [
  {
    q: "How much will I get for my car?",
    a: "It depends on the make, model, year, condition, and what parts and scrap metal are worth at the moment. Tell us about the car and we'll give you a firm price, usually within minutes. There are no towing fees taken off.",
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
    a: "Often the same day, and nearly always within a day or two. You choose the time.",
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
