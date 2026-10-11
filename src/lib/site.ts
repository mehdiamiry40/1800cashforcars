// Central business details. Edit these values and every page updates.
export const site = {
  name: "1800-CASH-FOR-CARS",
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
  // Keep the address exactly as it is on the Google Business Profile (79B), so Google sees one consistent business.
  address: "79B Breadwell St, Rocklea QLD 4106", // shown in footer + contact page
  addressParts: { street: "79B Breadwell St", locality: "Rocklea", region: "QLD", postcode: "4106", country: "AU" },
  // Opens the Google Business Profile, so "Get directions" lands on the listing with reviews.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=A+Plus+Car+Removal&query_place_id=ChIJRzxkE1tFkWsRoM6OVb6TIAw",
  geo: { latitude: -27.5474913, longitude: 153.006389 }, // pin on the Google Business Profile
  // Google Business Profile. The yard is listed on Google as A Plus Car Removal (same owner, phone and yard).
  // Adds a "Read our reviews on Google" link and tells Google the profile and this site are the same business.
  // Blank hides it.
  googleBusinessUrl: "https://www.google.com/maps?cid=873860773398367904",
  googleBusinessName: "A Plus Car Removal",
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
  /** Local copy for the /locations page, so each area page says something specific to that area. */
  local?: {
    intro: string;
    pickup: string;
    notes: { bold: string; text: string }[];
    faqs: { q: string; a: string }[];
  };
};

export const areaHref = (a: Area) => a.href ?? `/locations/${a.slug}`;

export const areas: Area[] = [
  {
    slug: "gold-coast",
    name: "Gold Coast",
    where: "on the Gold Coast",
    state: "QLD",
    suburbs: ["Southport", "Surfers Paradise", "Robina", "Nerang", "Coomera", "Burleigh Heads", "Helensvale", "Coolangatta", "Mudgeeraba", "Ormeau"],
    local: {
      intro: "Selling an old, broken or unwanted car on the Gold Coast? We buy cars, utes, 4WDs and vans from Ormeau and Coomera down to Coolangatta, running or not, and tow them away free.",
      pickup: "Most Gold Coast pickups happen within a day or two, and often the same day. We collect from houses, unit complexes, workshops and roadside breakdowns, from the northern suburbs through to the hinterland around Nerang and Mudgeeraba.",
      notes: [
        { bold: "Coastal rust", text: "salt air is hard on older cars. Rust lowers the price, but we still buy rusty cars and pay for the metal and parts." },
        { bold: "Unregistered cars", text: "a car that's been sitting in a garage or driveway without rego is fine. We tow it, so it doesn't need to be roadworthy." },
        { bold: "Moving away", text: "selling before a move? Tell us your moving date and we'll book the pickup around it." },
      ],
      faqs: [
        { q: "Do you charge extra to come to the Gold Coast?", a: "No. Pickup is free anywhere on the Gold Coast, and we don't take towing costs off your price." },
        { q: "Which Gold Coast suburbs do you cover?", a: "All of them, from Ormeau and Coomera in the north to Coolangatta in the south, and out to the hinterland. If you're not sure, put your suburb in the quote form." },
        { q: "Can you pick up a car from a unit complex?", a: "Yes. Tell us where the car is parked and about any height limits, so we bring the right truck." },
      ],
    },
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
    local: {
      intro: "We buy unwanted cars across Logan, from Springwood and Slacks Creek to Browns Plains, Beenleigh and Jimboomba. Any make, any condition, with free removal.",
      pickup: "Logan is just down the road from our Rocklea yard, so pickups are quick, often the same day you accept our price. We collect from your driveway, the street, your work or a mechanic's.",
      notes: [
        { bold: "Failed a roadworthy", text: "if the repair quote is more than the car is worth, we'll make you an offer for it as it is." },
        { bold: "Acreage blocks", text: "a car sitting in a paddock around Jimboomba for years is fine. Tell us how we get to it." },
        { bold: "Work vehicles", text: "utes, vans and trucks from Logan businesses, one vehicle or several." },
      ],
      faqs: [
        { q: "How fast can you collect a car in Logan?", a: "Logan is close to our yard in Rocklea, so it's often the same day. You choose the time." },
        { q: "Do you buy cars without rego in Logan?", a: "Yes. We tow it, so it doesn't need rego or a roadworthy. Have your photo ID and proof of ownership ready." },
        { q: "What if the car is stuck in a backyard?", a: "Tell us when you ask for a price. If a tilt tray can reach it, we can usually winch it on." },
      ],
    },
  },
  {
    slug: "ipswich",
    name: "Ipswich",
    where: "in Ipswich",
    state: "QLD",
    suburbs: ["Ipswich Central", "Springfield", "Goodna", "Redbank Plains", "Booval", "Rosewood", "Yamanto", "Ripley"],
    local: {
      intro: "Cash for cars in Ipswich and surrounds: Springfield, Goodna, Redbank Plains, Booval, Yamanto, Ripley and out to Rosewood. Running or not, we pay you and tow it away free.",
      pickup: "Ipswich is a short drive from our Rocklea yard, so pickups are often the same day and nearly always within a day or two. We collect from homes, workshops and rural properties west of Ipswich.",
      notes: [
        { bold: "Older family cars and utes", text: "Commodores, Falcons, Camrys and older utes are still worth something for their parts and metal." },
        { bold: "Rural properties", text: "cars and old work vehicles on acreage around Rosewood are fine. Tell us about access when you ask for a price." },
        { bold: "Flood-damaged cars", text: "we buy water-damaged cars as they are. Let us know how high the water came." },
      ],
      faqs: [
        { q: "Do you pick up in Springfield and Ripley?", a: "Yes. We cover Springfield, Ripley and the rest of Greater Ipswich, with free towing." },
        { q: "Will you buy a flood-damaged car?", a: "Yes. Flood damage lowers the value, but we still pay for the metal and any usable parts." },
        { q: "How do I get paid in Ipswich?", a: "Cash or bank transfer, your choice, before the car leaves." },
      ],
    },
  },
  {
    slug: "sunshine-coast",
    name: "Sunshine Coast",
    where: "on the Sunshine Coast",
    state: "QLD",
    suburbs: ["Maroochydore", "Caloundra", "Noosa", "Nambour", "Mooloolaba", "Buderim", "Kawana", "Coolum Beach"],
    local: {
      intro: "We buy scrap, old and unwanted cars across the Sunshine Coast, from Caloundra and Kawana up to Maroochydore, Coolum and Noosa, and inland to Nambour.",
      pickup: "The Sunshine Coast is further from our Rocklea yard, so we book a pickup time with you, usually within a day or two. Tell us the day that suits you.",
      notes: [
        { bold: "Hinterland properties", text: "cars on rural blocks behind Nambour and Buderim are fine. Let us know about the driveway or access." },
        { bold: "Beach rust", text: "salt air takes a toll on older cars. We still pay for rusty cars, based on their metal and parts." },
        { bold: "Downsizing", text: "selling a second car you no longer need? We handle the pickup and give you a receipt." },
      ],
      faqs: [
        { q: "Is pickup free on the Sunshine Coast?", a: "Yes. There's no charge for towing and we don't take it off your price." },
        { q: "How soon can you come to the Sunshine Coast?", a: "Usually within a day or two. Tell us when suits you and we'll book a time." },
        { q: "Do you go as far as Noosa?", a: "Yes, we cover Noosa and the northern Sunshine Coast. Put your suburb in the quote form and we'll confirm." },
      ],
    },
  },
  {
    slug: "tweed-heads",
    name: "Tweed Heads",
    where: "in Tweed Heads",
    state: "NSW",
    suburbs: ["Tweed Heads", "Kingscliff", "Banora Point", "Murwillumbah", "Pottsville", "Terranora"],
    local: {
      intro: "Just over the border? We buy unwanted cars in Tweed Heads, Banora Point, Kingscliff, Pottsville, Terranora and Murwillumbah, in any condition, with free removal.",
      pickup: "Pickups in the Tweed usually happen within a day or two, and often sooner. You pick the time.",
      notes: [
        { bold: "Paid by bank transfer", text: "NSW law doesn't allow cash for scrap vehicles, so in the Tweed we pay by bank transfer before the car leaves." },
        { bold: "NSW or QLD rego", text: "we buy NSW and QLD registered cars, and unregistered ones too." },
        { bold: "After pickup", text: "cancel the registration with Service NSW and let your insurer know." },
      ],
      faqs: [
        { q: "Can you pay cash in Tweed Heads?", a: "No. NSW law doesn't allow cash payments for scrap vehicles, so we pay by bank transfer, before the car leaves." },
        { q: "Do you buy NSW-registered cars?", a: "Yes. NSW rego, QLD rego or no rego at all. Just have photo ID and proof of ownership ready." },
        { q: "Is towing free in the Tweed?", a: "Yes. Pickup is free across the Tweed and we don't take it off your price." },
      ],
    },
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
