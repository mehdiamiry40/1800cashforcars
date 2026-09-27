// Central business details. Edit these values and every page updates.
export const site = {
  name: "1800 Cash For Cars",
  domain: "1800cashforcars.com.au",
  url: "https://1800cashforcars.com.au",
  tagline: "Top cash for any car. Free pickup, paid on the spot.",
  // TODO: replace with your real 1800 number before launch.
  phoneDisplay: "1800 CASH 4 CARS",
  phoneHref: "tel:1800000000",
  email: "quotes@1800cashforcars.com.au",
  hours: "7 days, 7am – 7pm",
  hoursSchema: "Mo-Su 07:00-19:00",
  abn: "", // e.g. "12 345 678 901"
  address: "", // e.g. "12 Example St, Molendinar QLD 4214" (shown in footer + contact page)
  // Headline figure, e.g. "$15,000" → "GET UP TO $15,000". Leave blank to show "GET TOP CASH".
  // Only use a figure you genuinely pay — it's an advertised claim under Australian Consumer Law.
  maxPayout: "",
  // Mobile number that can receive texts, e.g. "0400000000". Blank hides the SMS button.
  smsNumber: "",
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
  state: string;
  suburbs: string[];
};

export const areas: Area[] = [
  {
    slug: "gold-coast",
    name: "Gold Coast",
    state: "QLD",
    suburbs: ["Southport", "Surfers Paradise", "Robina", "Nerang", "Coomera", "Burleigh Heads", "Helensvale", "Coolangatta", "Mudgeeraba", "Ormeau"],
  },
  {
    slug: "brisbane",
    name: "Brisbane",
    state: "QLD",
    suburbs: ["Brisbane City", "Chermside", "Carindale", "Indooroopilly", "Sunnybank", "Wynnum", "Aspley", "Mt Gravatt", "Kenmore", "Nundah"],
  },
  {
    slug: "logan",
    name: "Logan",
    state: "QLD",
    suburbs: ["Springwood", "Beenleigh", "Browns Plains", "Shailer Park", "Logan Central", "Slacks Creek", "Jimboomba", "Loganholme"],
  },
  {
    slug: "ipswich",
    name: "Ipswich",
    state: "QLD",
    suburbs: ["Ipswich Central", "Springfield", "Goodna", "Redbank Plains", "Booval", "Rosewood", "Yamanto", "Ripley"],
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    state: "QLD",
    suburbs: ["Maroochydore", "Caloundra", "Noosa", "Nambour", "Mooloolaba", "Buderim", "Kawana", "Coolum Beach"],
  },
  {
    slug: "tweed-heads",
    name: "Tweed Heads",
    state: "NSW",
    suburbs: ["Tweed Heads", "Kingscliff", "Banora Point", "Murwillumbah", "Pottsville", "Terranora"],
  },
];

export const faqs = [
  {
    q: "How much will I get for my car?",
    a: "It depends on the make, model, year, condition and current scrap-metal and parts prices. Tell us about your car and we'll give you a firm offer — usually within minutes. The price we quote is the price we pay, with no hidden towing fees.",
  },
  {
    q: "Do you buy cars that don't run?",
    a: "Yes. We buy running and non-running cars, crashed, flood-damaged, unregistered, rusty and scrap vehicles. If it has wheels (or used to), call us.",
  },
  {
    q: "Is the car removal really free?",
    a: "Yes. Pickup and towing are always free within our service areas. We never deduct towing costs from your offer.",
  },
  {
    q: "How and when do I get paid?",
    a: "You're paid on the spot when we collect the car — by instant bank transfer or cash where permitted by state law.",
  },
  {
    q: "What paperwork do I need?",
    a: "Photo ID (driver's licence) and proof of ownership such as the registration papers. If you've lost the rego papers, let us know — we can usually still help.",
  },
  {
    q: "How fast can you pick up my car?",
    a: "Often the same day, and almost always within 24–48 hours. You choose a pickup time that suits you.",
  },
  {
    q: "What happens to my car after you take it?",
    a: "Usable parts are recycled and resold, fluids are drained and disposed of responsibly, and the metal is recycled. Up to 95% of a vehicle can be reused.",
  },
  {
    q: "Do I need to cancel my rego and insurance?",
    a: "Yes — once we've collected your car, cancel your registration and insurance. You may be entitled to a refund on any unused rego. We'll give you a receipt and notice of disposal.",
  },
];
