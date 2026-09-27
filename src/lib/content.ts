// Copy for the inner content pages. Each entry becomes a page at /<slug>.

export type Block = {
  heading: string;
  paras?: string[];
  list?: { bold: string; text: string }[];
};

export type ContentPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  blocks: Block[];
};

export const services = [
  {
    slug: "scrap-car-removal",
    tile: "Scrap Car Removal",
    blurb: "Old wreck sitting in the yard? We tow scrap cars away free and pay you for the metal and parts.",
  },
  {
    slug: "car-wreckers",
    tile: "Car Wreckers",
    blurb: "We wreck and recycle cars responsibly — and pay you top dollar for the parts that still have life.",
  },
  {
    slug: "car-disposal",
    tile: "Car Disposal",
    blurb: "The easy way to dispose of an unwanted vehicle: one call, a fair offer and a free pickup.",
  },
] as const;

export const pages: ContentPage[] = [
  {
    slug: "cash-for-cars",
    title: "Cash For Cars",
    metaTitle: "Cash For Cars Gold Coast & Brisbane | Top Cash Paid Today",
    description:
      "Get top cash for your car today. We buy cars, utes, vans and 4WDs in any condition across the Gold Coast, Brisbane and South East QLD — free pickup and paid on the spot.",
    blocks: [
      {
        heading: "Sell your car for cash — the easy way",
        paras: [
          "Selling a car privately means ads, phone calls, no-shows and haggling. We skip all of that. Tell us what you're driving (or what's sitting in the driveway not driving), and we'll make you a fair cash offer the same day.",
          "Accept the offer and we'll book a pickup time that suits you. Our driver checks the car matches the description, pays you on the spot and tows it away at no cost.",
        ],
      },
      {
        heading: "What affects your cash offer?",
        list: [
          { bold: "Make, model and year", text: "popular models and newer vehicles have more resale and parts value." },
          { bold: "Condition", text: "running cars are worth more, but we still pay for non-runners, crashed and scrap vehicles." },
          { bold: "Parts demand", text: "engines, gearboxes, panels and catalytic converters all add value." },
          { bold: "Metal prices", text: "for end-of-life vehicles, the current scrap-metal price sets the floor of your offer." },
        ],
      },
      {
        heading: "No hidden fees — ever",
        paras: [
          "The price we quote is the price we pay. There are no towing fees, admin charges or last-minute deductions, as long as the car matches the details you gave us.",
        ],
      },
    ],
  },
  {
    slug: "car-removals",
    title: "Free Car Removals",
    metaTitle: "Free Car Removals Gold Coast & Brisbane | Same-Day Pickup",
    description:
      "Free car removal across the Gold Coast, Brisbane, Logan, Ipswich and the Sunshine Coast. Same-day pickups, any condition, and we pay you for your car.",
    blocks: [
      {
        heading: "Free car removal, 7 days a week",
        paras: [
          "Our tow trucks cover South East Queensland and the Tweed. Whether the car is in your garage, on the street, at a workshop or broken down on the roadside, we'll come to you — and the towing is always free.",
          "Most removals happen within 24 hours of your call, and often the same day.",
        ],
      },
      {
        heading: "Vehicles we remove",
        list: [
          { bold: "Cars and hatchbacks", text: "any make, any age." },
          { bold: "4WDs and SUVs", text: "including high-kilometre and damaged vehicles." },
          { bold: "Utes, vans and light trucks", text: "work vehicles and fleet disposals welcome." },
          { bold: "Unregistered vehicles", text: "no rego? No problem — we can still remove it." },
        ],
      },
      {
        heading: "What to have ready",
        paras: [
          "Photo ID (driver's licence or passport), proof of ownership such as your registration papers, and the keys if you have them. We'll handle the rest and give you a receipt for your records.",
        ],
      },
    ],
  },
  {
    slug: "services",
    title: "Our Services",
    metaTitle: "Car Removal & Cash For Cars Services | 1800 Cash For Cars",
    description:
      "Cash for cars, free car removal, scrap car removal, car wrecking and vehicle disposal across South East Queensland.",
    blocks: [
      {
        heading: "Everything you need to get rid of a car",
        paras: [
          "From a near-new trade-in alternative to a rusted-out wreck, we have a service that fits. Every service includes a free quote, free towing and payment on pickup.",
        ],
        list: [
          { bold: "Cash for cars", text: "sell any car, ute, van or 4WD for an instant cash offer." },
          { bold: "Free car removals", text: "we tow your vehicle away at no cost, 7 days a week." },
          { bold: "Scrap car removal", text: "end-of-life vehicles collected and recycled responsibly." },
          { bold: "Car wreckers", text: "we dismantle vehicles and reuse the parts that still work." },
          { bold: "Accident and damaged cars", text: "crashed, hail, flood and fire-damaged vehicles bought as-is." },
          { bold: "Fleet and commercial disposal", text: "multiple vehicles removed on a schedule that suits your business." },
        ],
      },
    ],
  },
  {
    slug: "scrap-car-removal",
    title: "Scrap Car Removal",
    metaTitle: "Scrap Car Removal Gold Coast & Brisbane | Cash For Scrap Cars",
    description: "Free scrap car removal across South East QLD. We pay cash for scrap and junk cars in any condition.",
    blocks: [
      {
        heading: "Turn your scrap car into cash",
        paras: [
          "A car that's no longer worth repairing still has value in its metal and parts. We'll give you an offer based on today's prices, tow the car away for free, and make sure it's recycled properly.",
          "Rust, missing parts, flat tyres, no keys — tell us about it and we'll still make you an offer.",
        ],
      },
      {
        heading: "How scrap car removal works",
        list: [
          { bold: "Get a quote", text: "call us or send the quote form with the car's details." },
          { bold: "Book a pickup", text: "choose a time; we bring the right truck for the job." },
          { bold: "Get paid", text: "we pay you at pickup and give you a disposal receipt." },
        ],
      },
    ],
  },
  {
    slug: "car-wreckers",
    title: "Car Wreckers",
    metaTitle: "Car Wreckers Gold Coast & Brisbane | We Buy Wrecked Cars",
    description: "Local car wreckers buying wrecked, damaged and unwanted cars across South East QLD. Free removal and cash on pickup.",
    blocks: [
      {
        heading: "Car wreckers who pay you",
        paras: [
          "As wreckers, we can see value other buyers miss. Working engines, gearboxes, panels, lights and interiors are salvaged and reused, which means we can often offer more for a damaged car than a dealer or private buyer.",
        ],
      },
      {
        heading: "Responsible recycling",
        list: [
          { bold: "Fluids", text: "oil, coolant and fuel are drained and disposed of safely." },
          { bold: "Parts", text: "usable parts are cleaned, tested and resold." },
          { bold: "Metal", text: "the remaining shell is recycled into new steel." },
        ],
      },
    ],
  },
  {
    slug: "car-disposal",
    title: "Car Disposal",
    metaTitle: "Car Disposal Gold Coast & Brisbane | Free Vehicle Disposal",
    description: "Fast, free car disposal across South East QLD. We collect unwanted vehicles and pay you for them.",
    blocks: [
      {
        heading: "Hassle-free vehicle disposal",
        paras: [
          "Moving house, upgrading, or just tired of looking at it? We make disposing of an unwanted vehicle simple: one call, a fair offer and a free pickup at a time that suits you.",
        ],
      },
      {
        heading: "After we collect your car",
        paras: [
          "Once we've collected your car, cancel your registration and insurance. In Queensland you can cancel your rego online and may be entitled to a refund for the unused period.",
        ],
      },
    ],
  },
];
