// Copy for the inner content pages. Each entry becomes a page at /<slug>.

export type Block = {
  heading: string;
  summary?: string;
  icon?: "car" | "truck" | "cash" | "recycle" | "paperwork";
  paras?: string[];
  list?: { bold: string; text: string }[];
};

export type ContentPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro?: string;
  blocks: Block[];
  /** Shown as an FAQ list under the blocks, with FAQ schema. */
  faqs?: { q: string; a: string }[];
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
    intro: "Sell any car or work vehicle. Free pickup, paid on collection.",
    title: "Cash for cars",
    metaTitle: "Sell Your Car for Cash in QLD | How It Works | 1800-CASH-FOR-CARS",
    description:
      "Sell your car for cash. We buy cars, utes, vans, 4WDs and trucks in any condition across Brisbane, the Gold Coast and SEQ. Free pickup, paid on the day.",
    blocks: [
      {
        heading: "Selling your car to us",
        summary: "Get a price, choose a pickup time, and get paid before your car leaves.",
        icon: "car",
        paras: [
          "Selling privately means ads, phone calls, people not turning up and haggling over the price. We skip all of that. Tell us what you've got, running or not, and we'll give you a price the same day.",
          "If you're happy with it, we book a pickup time that suits you. The driver checks the car matches what you told us, pays you in cash or by bank transfer, and tows it away. There's no charge for the tow.",
        ],
      },
      {
        heading: "What decides the price",
        summary: "Your vehicle's details, condition, parts and metal value.",
        icon: "cash",
        list: [
          { bold: "Make, model and year", text: "popular and newer models are worth more for resale and parts." },
          { bold: "Condition", text: "a car that runs is worth more, but we still pay for ones that don't." },
          { bold: "Parts", text: "a good engine, gearbox or panels can add a fair bit." },
          { bold: "Metal prices", text: "for cars at the end of the road, the scrap metal price sets the floor." },
        ],
      },
      {
        heading: "No hidden fees",
        summary: "No towing fees. We pay the quoted price when your car is as described.",
        icon: "cash",
        paras: [
          "The price we quote is the price we pay, as long as the car is as described. We don't charge for towing and we don't take anything off at pickup.",
        ],
      },
    ],
  },
  {
    slug: "car-removals",
    intro: "Free car pickup across South East Queensland. Any condition.",
    title: "Free car removal",
    // The SEQ-wide page. Each area has its own /locations page, so this title doesn't name them and compete.
    metaTitle: "Free Car Removal South East QLD | Any Car, Paid on Pickup",
    description:
      "Free car removal across South East QLD: Brisbane, Gold Coast, Logan, Ipswich, Sunshine Coast and the Tweed. Any condition, and we pay you for the car.",
    blocks: [
      {
        heading: "We come to you, 6 days a week",
        summary: "Free pickup from home, work, your mechanic or the roadside.",
        icon: "truck",
        paras: [
          "We pick up across South East Queensland and the Tweed. The car can be in your garage, on the street, at a mechanic's or broken down on the side of the road. Wherever it is, the towing is free.",
          "Most pickups happen within a day of your call, and often the same day.",
        ],
      },
      {
        heading: "Where we pick up",
        summary: "Brisbane, Gold Coast, Logan, Ipswich, Sunshine Coast and the Tweed.",
        icon: "truck",
        paras: [
          "Our yard is in Rocklea, so pickups in Brisbane, Logan and Ipswich are often the same day. We also cover the Gold Coast from Ormeau down to Coolangatta, the Sunshine Coast up to Noosa, and Tweed Heads over the border.",
          "Each area has its own page with the suburbs we cover and anything local to know, like bank transfer being the only way we can pay in NSW.",
        ],
      },
      {
        heading: "What we pick up",
        summary: "Cars, work vehicles and trucks, registered or not.",
        icon: "car",
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
        summary: "Photo ID, ownership papers and keys if you have them.",
        icon: "paperwork",
        paras: [
          "Photo ID (driver's licence or passport), proof of ownership such as the rego papers, and the keys if you've got them. We'll give you a receipt for your records.",
        ],
      },
    ],
  },
  {
    slug: "services",
    intro: "Cars, scrap and work vehicles. Quote, pickup, payment.",
    title: "Our services",
    metaTitle: "Car Removal & Cash For Cars Services | 1800-CASH-FOR-CARS",
    description:
      "Cash for cars, free car removal, scrap car removal, car wrecking, truck removal and car disposal across Brisbane, the Gold Coast and South East Queensland.",
    blocks: [
      {
        heading: "Getting rid of a car, sorted",
        summary: "One free quote. Pickup arranged. Payment on collection.",
        icon: "car",
        paras: [
          "Whether it's a near-new car you don't want to trade in or a rusted-out wreck, we'll make you an offer. Every job includes a free quote, free towing and payment at pickup.",
        ],
        list: [
          { bold: "Cash for cars", text: "sell any car, ute, van or 4WD to us for a fair price." },
          { bold: "Free car removal", text: "we tow it away at no cost, Monday to Saturday." },
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
    intro: "Light, medium and heavy trucks. Running or not.",
    title: "Cash for trucks",
    metaTitle: "Cash For Trucks Gold Coast & Brisbane | Truck Removal & Wreckers",
    description:
      "We buy light, medium and heavy trucks in any condition across South East QLD. Tippers, tray tops, pantechs and rigids, running or not. Paid on pickup.",
    blocks: [
      {
        heading: "We buy trucks of all sizes",
        summary: "Light, medium and heavy trucks, running or not.",
        icon: "truck",
        paras: [
          "Light, medium or heavy, running or not. Whether it's a retired work truck, one that's failed its inspection, or a wreck that's been sitting in the yard, we'll give you a price for it.",
          "Tell us the make, model, year, kilometres or hours, and what's wrong with it. Photos help a lot with trucks, so text a few through if you can.",
        ],
      },
      {
        heading: "Trucks we buy",
        summary: "Work trucks, damaged trucks and business fleets.",
        icon: "truck",
        list: [
          { bold: "Light trucks", text: "Isuzu NPR, Hino 300, Fuso Canter, Iveco Daily and similar." },
          { bold: "Medium and heavy rigids", text: "tippers, tray tops, pantechs, curtainsiders and refrigerated trucks." },
          { bold: "Damaged or non-running", text: "blown engines, crash damage, flood damage and trucks off the road for years." },
          { bold: "Fleets", text: "several trucks from one business, picked up on a schedule that suits you." },
        ],
      },
      {
        heading: "Pickup and payment",
        summary: "Free pickup for most trucks; heavy-vehicle pickup details are confirmed with your quote.",
        icon: "cash",
        paras: [
          "We arrange the right tow truck or tilt tray for the job. Pickup is free for most trucks; for large heavy vehicles we'll confirm any pickup details when we give you the price, so there are no surprises.",
          "You're paid in cash or by bank transfer when we collect the truck. In NSW it's bank transfer only.",
        ],
      },
    ],
  },
  {
    slug: "scrap-car-removal",
    intro: "Paid pickup for old, damaged or unwanted cars.",
    title: "Scrap car removal",
    metaTitle: "Scrap Car Removal Gold Coast & Brisbane | Cash For Scrap Cars",
    description: "Free scrap car removal across Brisbane, the Gold Coast and South East QLD. We pay cash for scrap, junk and wrecked cars in any condition, often same day.",
    blocks: [
      {
        heading: "Your scrap car is still worth something",
        summary: "Turn unwanted metal and parts into a paid pickup.",
        icon: "car",
        paras: [
          "A car that isn't worth fixing still has value in its metal and parts. We'll give you a price based on what it's worth today, tow it away for free, and make sure it's recycled properly.",
          "Rust, missing parts, flat tyres, no keys. Tell us about it and we'll still make you an offer.",
        ],
      },
      {
        heading: "What counts as a scrap car",
        summary: "If it's not worth fixing or selling privately, it's a scrap car to us.",
        icon: "car",
        list: [
          { bold: "Rusted out", text: "body rust, rusted floors or a rusty chassis." },
          { bold: "Written off", text: "insurance write-offs and cars with heavy crash damage." },
          { bold: "Doesn't run", text: "blown engine, dead gearbox, flat battery or no keys." },
          { bold: "Failed a roadworthy", text: "when the repair quote is more than the car is worth." },
          { bold: "Sitting for years", text: "in a backyard, garage, shed or paddock, with or without rego." },
          { bold: "Stripped or incomplete", text: "missing wheels, seats or parts is fine. Tell us what's there." },
        ],
      },
      {
        heading: "How we price a scrap car",
        summary: "Metal sets the floor. Usable parts add to it.",
        icon: "cash",
        list: [
          { bold: "Metal", text: "the weight of the car and what scrap metal is worth this week set the minimum we'll pay." },
          { bold: "Parts", text: "a working engine, gearbox, panels or lights add value, because we pull and resell them." },
          { bold: "Make and model", text: "popular models are worth more, because their parts are in demand." },
          { bold: "No towing fee", text: "the tow is free and never comes off your price." },
        ],
        paras: [
          "Tell us the make, model, year and what's wrong with it, and we'll give you a firm price, usually within minutes. Photos help, so text a few through if you can.",
        ],
      },
      {
        heading: "How it works",
        summary: "Quote, pickup, payment. We give you a receipt.",
        icon: "paperwork",
        list: [
          { bold: "Get a quote", text: "fill in the quick form with the car's details, or call us." },
          { bold: "Book a pickup", text: "pick a time, Monday to Saturday, and we'll bring the right truck." },
          { bold: "Get paid", text: "cash or bank transfer before the car leaves, and we give you a receipt." },
        ],
      },
      {
        heading: "Free scrap car removal across SEQ",
        summary: "From our Rocklea yard to Brisbane, the Gold Coast, Sunshine Coast and the Tweed.",
        icon: "truck",
        paras: [
          "Our yard is in Rocklea, on Brisbane's southside, so scrap car pickups in Brisbane, Logan and Ipswich are often the same day. We also collect across the Gold Coast, the Sunshine Coast and Tweed Heads, where we pay by bank transfer because NSW doesn't allow cash for scrap vehicles.",
          "We bring a tilt tray and winch the car on, so it doesn't need to run, roll or have keys. Tell us about tight access, like a steep driveway or a car in the backyard, when you ask for a price.",
        ],
      },
      {
        heading: "What happens to your scrap car",
        summary: "Drained, stripped and recycled. Nothing dumped.",
        icon: "recycle",
        paras: [
          "Back at the yard, the oil, coolant and fuel are drained and disposed of properly. Anything still usable is pulled and resold, and the shell goes to a metal recycler, so your old car doesn't end up in landfill.",
        ],
      },
    ],
    faqs: [
      {
        q: "Will I get paid for a scrap car?",
        a: "Yes. Even a car that will never run again is worth something for its metal and parts. We pay you before we tow it away, and the tow is free.",
      },
      {
        q: "Can you take a car with no keys or flat tyres?",
        a: "Yes. We bring a tilt tray and winch it on. Let us know when you ask for a price so we bring the right truck.",
      },
      {
        q: "Does a scrap car need to be registered?",
        a: "No. We tow it, so it doesn't need rego or a roadworthy. You'll need photo ID and proof that the car is yours.",
      },
      {
        q: "How quickly can you remove a scrap car?",
        a: "Often the same day, and nearly always within a day or two. We do pickups Monday to Saturday, at a time that suits you.",
      },
      {
        q: "What if I've lost the papers?",
        a: "Tell us when you ask for a price. We still need to see photo ID and be sure the car is yours, but we can usually sort it out.",
      },
    ],
  },
  {
    slug: "car-wreckers",
    intro: "Parts reused. Metal recycled. Paid collection.",
    title: "Car wreckers",
    metaTitle: "Car Wreckers Gold Coast & Brisbane | We Buy Wrecked Cars",
    description: "Local car wreckers buying wrecked, damaged and unwanted cars across Brisbane, the Gold Coast and SEQ. We pay for usable parts and metal, with free removal.",
    blocks: [
      {
        heading: "Wreckers who pay you",
        summary: "Usable parts give damaged cars value.",
        icon: "car",
        paras: [
          "Because we wreck cars ourselves, we can see value other buyers miss. A working engine, gearbox, panels, lights or interior all get pulled and reused, so we can often pay more for a damaged car than a dealer or private buyer would.",
        ],
      },
      {
        heading: "Cars we wreck",
        summary: "Damaged, worn out or just not worth fixing.",
        icon: "car",
        list: [
          { bold: "Accident damage", text: "crashed cars and insurance write-offs." },
          { bold: "Mechanical failure", text: "blown engines, dead gearboxes and cars that won't start." },
          { bold: "Flood and hail damage", text: "bought as they are. Tell us how bad the damage is." },
          { bold: "Old and high-kilometre cars", text: "family cars and utes at the end of the road." },
          { bold: "Utes, 4WDs and vans", text: "work vehicles too, one or several. See cash for trucks for bigger vehicles." },
        ],
      },
      {
        heading: "Wrecker, private sale or trade-in?",
        summary: "The right buyer depends on the car's condition.",
        icon: "cash",
        list: [
          { bold: "Private sale", text: "usually gets the most for a clean car that runs well, but it means ads, calls and test drives." },
          { bold: "Trade-in", text: "quick if you're buying another car, but dealers offer little for damaged or old cars." },
          { bold: "Wrecker", text: "the best fit for damaged, non-running or end-of-life cars. We pay for the parts and metal and tow it away free." },
        ],
      },
      {
        heading: "Recycled properly",
        summary: "Fluids handled safely. Parts reused. Metal recycled.",
        icon: "recycle",
        list: [
          { bold: "Fluids", text: "oil, coolant and fuel are drained and disposed of safely." },
          { bold: "Parts", text: "anything usable is cleaned, tested and resold." },
          { bold: "Metal", text: "the shell goes to a metal recycler." },
        ],
      },
      {
        heading: "Selling your car to our wreckers",
        summary: "Quote, pickup and payment, usually within a day or two.",
        icon: "paperwork",
        list: [
          { bold: "Get a price", text: "tell us the make, model, year and what's wrong with it. Photos help." },
          { bold: "Book a pickup", text: "Monday to Saturday, at your home, work, a mechanic's or the roadside." },
          { bold: "Get paid", text: "cash or bank transfer before the car leaves. In NSW it's bank transfer only." },
          { bold: "Cancel the rego", text: "once the car's gone, cancel the registration and your insurance. We give you a receipt." },
        ],
      },
      {
        heading: "Local wreckers in Rocklea",
        summary: "Brisbane's southside, covering South East QLD and the Tweed.",
        icon: "truck",
        paras: [
          "Our wrecking yard is in Rocklea, so you deal with the people who actually collect and wreck the car. We buy cars across Brisbane, Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads, with free towing everywhere we go.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do car wreckers pay more than scrap metal yards?",
        a: "Often, when the car still has usable parts. A scrap metal yard pays for the weight of the metal. We wreck cars ourselves, so we can also pay for a good engine, gearbox, panels or lights.",
      },
      {
        q: "Will you buy a written-off car?",
        a: "Yes. We buy insurance write-offs and crash-damaged cars as they are. Tell us what's damaged when you ask for a price.",
      },
      {
        q: "Will you take a car that's been sitting for years?",
        a: "Yes. Flat tyres, no battery or no rego is fine. We winch it onto a tilt tray.",
      },
      {
        q: "What should I take out of the car before you collect it?",
        a: "Your personal belongings, any toll tag, and anything in the glovebox or boot. Once the car's gone, cancel the rego and let your insurer know.",
      },
      {
        q: "Is towing free?",
        a: "Yes. Pickup is free anywhere in our service areas, and we never take the cost of towing off your price.",
      },
    ],
  },
  {
    slug: "car-disposal",
    intro: "Unwanted car? We collect it and pay you.",
    title: "Car disposal",
    metaTitle: "Car Disposal Gold Coast & Brisbane | Free Vehicle Disposal",
    description: "Free car disposal across Brisbane, the Gold Coast and South East QLD. We collect unwanted cars, pay you before they leave and recycle them properly.",
    blocks: [
      {
        heading: "Getting rid of a car you don't want",
        summary: "One call, a fair price and a free pickup.",
        icon: "truck",
        paras: [
          "Moving house, upgrading, or just tired of looking at it? One call, a fair price and a free pickup at a time that suits you.",
          "Car disposal shouldn't cost you anything. We tow the car away for free and pay you for it, whether it runs or not.",
        ],
      },
      {
        heading: "When people dispose of a car",
        summary: "Whatever the reason, the process is the same.",
        icon: "car",
        list: [
          { bold: "Moving", text: "interstate, overseas or into a place with less parking. Tell us your moving date and we'll book around it." },
          { bold: "Upgrading", text: "when the dealer offers next to nothing for your old car as a trade-in." },
          { bold: "Repairs cost too much", text: "a failed roadworthy or a big repair quote that's more than the car is worth." },
          { bold: "Taking up space", text: "a second car, or one that's sat unused in the driveway, garage or backyard." },
        ],
      },
      {
        heading: "How to dispose of a car in Queensland",
        summary: "Six simple steps, and we do the heavy lifting.",
        icon: "paperwork",
        list: [
          { bold: "Get a price", text: "fill in the quick form or call us with the car's make, model, year and condition." },
          { bold: "Find your paperwork", text: "photo ID (driver's licence or passport) and proof of ownership, like the rego papers." },
          { bold: "Empty the car", text: "take out your belongings and any toll tag." },
          { bold: "Book the pickup", text: "Monday to Saturday, at a time that suits you." },
          { bold: "Get paid", text: "cash or bank transfer before the car leaves, plus a receipt." },
          { bold: "Cancel rego and insurance", text: "cancel the registration with Transport and Main Roads online, and let your insurer know." },
        ],
      },
      {
        heading: "After we pick it up",
        summary: "Cancel your registration and insurance after collection.",
        icon: "paperwork",
        paras: [
          "Once we've collected the car, cancel the registration and insurance. In Queensland you can cancel your rego online, and you may get a refund for the time left on it. In NSW, cancel it with Service NSW.",
        ],
      },
      {
        heading: "Disposed of properly",
        summary: "Your car is recycled, not dumped.",
        icon: "recycle",
        paras: [
          "Every car we collect comes back to our Rocklea yard. Fluids are drained and disposed of properly, working parts are pulled and resold, and the rest goes to a metal recycler.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does it cost anything to dispose of my car?",
        a: "No. The pickup is free, and we pay you for the car. We don't take towing costs off your price.",
      },
      {
        q: "Can you dispose of a car that doesn't run?",
        a: "Yes. We bring a tilt tray and winch it on, so it doesn't need to run or have keys.",
      },
      {
        q: "Can I dispose of a car without rego?",
        a: "Yes. Unregistered cars are fine because we tow them. You'll still need photo ID and proof the car is yours.",
      },
      {
        q: "Where do you collect from?",
        a: "Anywhere in Brisbane, Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads. Home, work, a mechanic's or the roadside.",
      },
      {
        q: "How do I get paid?",
        a: "Cash or bank transfer, your choice, before the car leaves. In NSW, including Tweed Heads, it's bank transfer only.",
      },
    ],
  },
];
