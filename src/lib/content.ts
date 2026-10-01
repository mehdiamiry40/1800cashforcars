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
    tile: "Scrap car removal",
    blurb: "Old wreck sitting in the yard? We'll tow it away for free and pay you for the metal and parts.",
  },
  {
    slug: "car-wreckers",
    tile: "Car wreckers",
    blurb: "We strip and recycle cars properly, and pay you for the parts that still have some life in them.",
  },
  {
    slug: "car-disposal",
    tile: "Car disposal",
    blurb: "Moving, upgrading, or just sick of looking at it. One call, a fair price and a free pickup.",
  },
] as const;

export const pages: ContentPage[] = [
  {
    slug: "cash-for-cars",
    title: "Cash for cars",
    metaTitle: "Sell Your Car for Cash in QLD | How It Works | 1800 Cash For Cars",
    description:
      "Sell your car for cash. We buy cars, utes, vans, 4WDs and trucks in any condition across the Gold Coast, Brisbane and South East QLD, with free pickup and payment on the day.",
    blocks: [
      {
        heading: "Selling your car to us",
        paras: [
          "Selling privately means ads, phone calls, people not turning up and haggling over the price. We skip all of that. Tell us what you've got, running or not, and we'll give you a price the same day.",
          "If you're happy with it, we book a pickup time that suits you. The driver checks the car matches what you told us, pays you in cash or by bank transfer, and tows it away. There's no charge for the tow.",
        ],
      },
      {
        heading: "What decides the price",
        list: [
          { bold: "Make, model and year", text: "popular and newer models are worth more for resale and parts." },
          { bold: "Condition", text: "a car that runs is worth more, but we still pay for ones that don't." },
          { bold: "Parts", text: "a good engine, gearbox or panels can add a fair bit." },
          { bold: "Metal prices", text: "for cars at the end of the road, the scrap metal price sets the floor." },
        ],
      },
      {
        heading: "No hidden fees",
        paras: [
          "The price we quote is the price we pay, as long as the car is as described. We don't charge for towing and we don't take anything off at pickup.",
        ],
      },
    ],
  },
  {
    slug: "car-removals",
    title: "Free car removal",
    metaTitle: "Free Car Removal Gold Coast, Logan & Ipswich | 1800 Cash For Cars",
    description:
      "Free car removal across the Gold Coast, Brisbane, Logan, Ipswich and the Sunshine Coast. Same-day pickups, any condition, and we pay you for the car.",
    blocks: [
      {
        heading: "We come to you, 7 days a week",
        paras: [
          "We pick up across South East Queensland and the Tweed. The car can be in your garage, on the street, at a mechanic's or broken down on the side of the road. Wherever it is, the towing is free.",
          "Most pickups happen within a day of your call, and often the same day.",
        ],
      },
      {
        heading: "What we pick up",
        list: [
          { bold: "Cars and hatchbacks", text: "any make, any age." },
          { bold: "4WDs and SUVs", text: "including high-kilometre and damaged ones." },
          { bold: "Utes and vans", text: "work vehicles and whole fleets." },
          { bold: "Trucks", text: "light, medium and heavy. See cash for trucks." },
          { bold: "Unregistered vehicles", text: "no rego is fine, we can still take it." },
        ],
      },
      {
        heading: "What to have ready",
        paras: [
          "Photo ID (driver's licence or passport), proof of ownership such as the rego papers, and the keys if you've got them. We'll give you a receipt for your records.",
        ],
      },
    ],
  },
  {
    slug: "services",
    title: "Our services",
    metaTitle: "Car Removal & Cash For Cars Services | 1800 Cash For Cars",
    description:
      "Cash for cars, free car removal, scrap car removal, car wrecking and vehicle disposal across South East Queensland.",
    blocks: [
      {
        heading: "Getting rid of a car, sorted",
        paras: [
          "Whether it's a near-new car you don't want to trade in or a rusted-out wreck, we'll make you an offer. Every job includes a free quote, free towing and payment at pickup.",
        ],
        list: [
          { bold: "Cash for cars", text: "sell any car, ute, van or 4WD to us for a fair price." },
          { bold: "Free car removal", text: "we tow it away at no cost, 7 days a week." },
          { bold: "Scrap car removal", text: "end-of-life cars collected and recycled properly." },
          { bold: "Car wreckers", text: "we strip cars and reuse the parts that still work." },
          { bold: "Accident and damaged cars", text: "crashed, hail, flood and fire-damaged cars bought as they are." },
          { bold: "Cash for trucks", text: "light, medium and heavy trucks, running or not." },
          { bold: "Fleet and business vehicles", text: "several vehicles picked up on a schedule that suits you." },
        ],
      },
    ],
  },
  {
    slug: "truck-removal",
    title: "Cash for trucks",
    metaTitle: "Cash For Trucks Gold Coast & Brisbane | Truck Removal & Wreckers",
    description:
      "We buy light, medium and heavy trucks in any condition across South East QLD. Tippers, tray tops, pantechs and rigids, running or not. Paid on pickup.",
    blocks: [
      {
        heading: "We buy trucks of all sizes",
        paras: [
          "Light, medium or heavy, running or not. Whether it's a retired work truck, one that's failed its inspection, or a wreck that's been sitting in the yard, we'll give you a price for it.",
          "Tell us the make, model, year, kilometres or hours, and what's wrong with it. Photos help a lot with trucks, so text a few through if you can.",
        ],
      },
      {
        heading: "Trucks we buy",
        list: [
          { bold: "Light trucks", text: "Isuzu NPR, Hino 300, Fuso Canter, Iveco Daily and similar." },
          { bold: "Medium and heavy rigids", text: "tippers, tray tops, pantechs, curtainsiders and refrigerated trucks." },
          { bold: "Damaged or non-running", text: "blown engines, crash damage, flood damage and trucks off the road for years." },
          { bold: "Fleets", text: "several trucks from one business, picked up on a schedule that suits you." },
        ],
      },
      {
        heading: "Pickup and payment",
        paras: [
          "We arrange the right tow truck or tilt tray for the job. Pickup is free for most trucks; for large heavy vehicles we'll confirm any pickup details when we give you the price, so there are no surprises.",
          "You're paid in cash or by bank transfer when we collect the truck. In NSW it's bank transfer only.",
        ],
      },
    ],
  },
  {
    slug: "scrap-car-removal",
    title: "Scrap car removal",
    metaTitle: "Scrap Car Removal Gold Coast & Brisbane | Cash For Scrap Cars",
    description: "Free scrap car removal across South East QLD. We pay cash for scrap and junk cars in any condition.",
    blocks: [
      {
        heading: "Your scrap car is still worth something",
        paras: [
          "A car that isn't worth fixing still has value in its metal and parts. We'll give you a price based on what it's worth today, tow it away for free, and make sure it's recycled properly.",
          "Rust, missing parts, flat tyres, no keys. Tell us about it and we'll still make you an offer.",
        ],
      },
      {
        heading: "How it works",
        list: [
          { bold: "Get a price", text: "fill in the quick form with the car's details, or call us." },
          { bold: "Book a pickup", text: "pick a time and we'll bring the right truck." },
          { bold: "Get paid", text: "we pay you at pickup and give you a receipt." },
        ],
      },
    ],
  },
  {
    slug: "car-wreckers",
    title: "Car wreckers",
    metaTitle: "Car Wreckers Gold Coast & Brisbane | We Buy Wrecked Cars",
    description: "Local car wreckers buying wrecked, damaged and unwanted cars across South East QLD. Free removal and payment on pickup.",
    blocks: [
      {
        heading: "Wreckers who pay you",
        paras: [
          "Because we wreck cars ourselves, we can see value other buyers miss. A working engine, gearbox, panels, lights or interior all get pulled and reused, so we can often pay more for a damaged car than a dealer or private buyer would.",
        ],
      },
      {
        heading: "Recycled properly",
        list: [
          { bold: "Fluids", text: "oil, coolant and fuel are drained and disposed of safely." },
          { bold: "Parts", text: "anything usable is cleaned, tested and resold." },
          { bold: "Metal", text: "the shell goes to a metal recycler." },
        ],
      },
    ],
  },
  {
    slug: "car-disposal",
    title: "Car disposal",
    metaTitle: "Car Disposal Gold Coast & Brisbane | Free Vehicle Disposal",
    description: "Fast, free car disposal across South East QLD. We collect unwanted vehicles and pay you for them.",
    blocks: [
      {
        heading: "Getting rid of a car you don't want",
        paras: [
          "Moving house, upgrading, or just tired of looking at it? One call, a fair price and a free pickup at a time that suits you.",
        ],
      },
      {
        heading: "After we pick it up",
        paras: [
          "Once we've collected the car, cancel the registration and insurance. In Queensland you can cancel your rego online, and you may get a refund for the time left on it.",
        ],
      },
    ],
  },
];
