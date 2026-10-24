// Copy for the inner content pages. Each entry becomes a page at /<slug>.

import type { ContentPage } from "./copy";
import { carRemovalsPage, cashForCarsPage, truckRemovalPage } from "./service-copy";

export type { Block, ContentPage, CopyFaq, CopySection } from "./copy";

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
  cashForCarsPage,
  carRemovalsPage,
  {
    slug: "services",
    intro: "Cars, scrap and work vehicles. Quote, pickup, payment.",
    title: "Our services",
    metaTitle: "Car Removal & Cash For Cars Services",
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
  truckRemovalPage,
  {
    slug: "scrap-car-removal",
    intro: "Paid pickup for old, damaged or unwanted cars.",
    title: "Scrap car removal",
    metaTitle: "Scrap Car Removal Brisbane & Gold Coast",
    description: "Free scrap car removal across Brisbane, the Gold Coast and South East QLD. We pay cash for scrap, junk and wrecked cars in any condition, often same day.",
    blocks: [
      {
        heading: "Will you pay for a scrap car in Brisbane?",
        summary: "Yes. A Brisbane scrap car is still worth the metal and any parts we can reuse, and we pay you before it is towed. The tow is free and is never taken off that price. Tell us the make, model, year and what is wrong, and a firm price usually comes back within minutes.",
        icon: "car",
        paras: [
          "A car that isn't worth fixing still has value in its metal and parts. We'll give you a price based on what it's worth today, tow it away for free, and make sure it's recycled properly.",
          "Rust, missing parts, flat tyres, no keys. Tell us about it and we'll still make you an offer.",
        ],
      },
      {
        heading: "Do you take scrap cars with no keys or no wheels?",
        summary: "Yes. Scrap cars with no keys, no wheels, flat tyres or missing parts are still bought. Say what is missing when you ask for a price, so we know what is there and send a truck that can load it. The tow stays free and is never deducted.",
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
        heading: "Is scrap car towing free?",
        summary: "Yes. Scrap car towing is free across Brisbane, the Gold Coast, Logan, Ipswich, the Sunshine Coast and Tweed Heads. We never take that cost off your price. The figure we quote is the figure we pay when the car is as you described it.",
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
    metaTitle: "Car Wreckers Brisbane & Gold Coast",
    description: "Local car wreckers buying wrecked, damaged and unwanted cars across Brisbane, the Gold Coast and SEQ. We pay for usable parts and metal, with free removal.",
    blocks: [
      {
        heading: "Do car wreckers pay for a damaged car?",
        summary: "Yes. We wreck cars ourselves, so a damaged car can still be worth its usable parts and its metal. A working engine, gearbox, panels or lights can add to the price. We pay you before the car leaves, and the tow is free and never deducted.",
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
        summary: "A private sale usually brings more for a clean car that still runs, though it means an ad and test drives. A dealer trade-in is quick when you are buying another car, and it pays little for something damaged or old. A wrecker suits a damaged, non-running or end-of-life car: we pay for the parts and the metal, and the tow is free.",
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
        heading: "How do I get paid when a wrecker collects?",
        summary: "Cash or bank transfer, before the wrecked car leaves, and you get a receipt. In Queensland you choose which. In NSW, including Tweed Heads, scrap vehicles are paid by bank transfer only. The price we quote is the price we pay when the car matches what you told us.",
        icon: "paperwork",
        list: [
          { bold: "Get a price", text: "tell us the make, model, year and what's wrong with it. Photos help." },
          { bold: "Book a pickup", text: "Monday to Saturday, at your home, work, a mechanic's or the roadside." },
          { bold: "Get paid", text: "cash or bank transfer before the car leaves. In NSW it's bank transfer only." },
          { bold: "Cancel the rego", text: "once the car's gone, cancel the registration and your insurance. We give you a receipt." },
        ],
      },
      {
        heading: "Is towing free from Brisbane car wreckers?",
        summary: "Yes. Towing from our Rocklea yard is free across Brisbane, Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads. We do not charge a removal fee and we do not take the tow off your price. You pick a time, Monday to Saturday.",
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
    metaTitle: "Car Disposal Brisbane & Gold Coast",
    description: "Free car disposal across Brisbane, the Gold Coast and South East QLD. We collect unwanted cars, pay you before they leave and recycle them properly.",
    blocks: [
      {
        heading: "Does car disposal cost anything?",
        summary: "No. Disposing of a car with us does not cost you a fee. We tow it away free and we pay you for it, whether it runs or not. Nothing is taken off for the tow. You choose cash or a bank transfer in Queensland, paid before the car leaves.",
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
        heading: "How do I get paid when you collect?",
        summary: "Cash or bank transfer, before the car leaves, plus a receipt. In Queensland that is your choice. In NSW, including Tweed Heads, the law does not allow cash for scrap vehicles, so payment there is a bank transfer. Have your details ready if the car is on that side of the border.",
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
        heading: "Can you dispose of a car with no keys or no wheels?",
        summary: "Yes. A car with no keys or no wheels can still be disposed of. Tell us what is missing when you ask for a price. It does not need to run, and it does not need rego. The tow is free and is never taken off what we pay you.",
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
