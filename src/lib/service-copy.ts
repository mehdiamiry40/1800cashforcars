import type { ContentPage } from "./copy";

const QUOTE = "/quote";
const PRICES = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";
const PHONE = "tel:+61423514111";

export const cashForCarsPage: ContentPage = {
  slug: "cash-for-cars",
  intro: "Sell any car or work vehicle. Free pickup, paid on collection.",
  title: "Cash for cars",
  metaTitle: "Sell Your Car for Cash in QLD",
  description:
    "How selling a car for cash works in Queensland and the Tweed. We price it from the details you send, pay on pickup, and the tow is free.",
  blocks: [],
  sections: [
    {
      heading: "How do I sell my car for cash?",
      paragraphs: [
        {
          text: "Tell us what the car is, running or not, and we send a firm price, usually within minutes. Quotes are sent very fast, sometimes in under a minute. If you accept, we book a time Monday to Saturday, check the car matches what you said, pay you, and tow it free.",
        },
        {
          text: "Selling privately means ads, phone calls, people not turning up and haggling over the price. 1800-CASH-FOR-CARS skips that. Tell us what you've got, running or not, and we'll give you a price the same day. A firm price usually comes back within minutes.",
        },
        {
          text: "If you're happy with it, we book a pickup time that suits you, Monday to Saturday. The driver checks the car matches what you told us, pays you, and tows it away. There's no charge for the tow, and nothing is taken off at the kerb when the car is as described.",
        },
        {
          text: "Where the truck can come is on the free car removal page. Brisbane addresses are on car removal Brisbane.",
          links: [
            { phrase: "free car removal page", href: "/car-removals" },
            { phrase: "car removal Brisbane", href: "/car-removal-brisbane" },
          ],
        },
      ],
    },
    {
      heading: "What we buy",
      paragraphs: [
        {
          text: "Cars and hatchbacks, 4WDs and SUVs, utes and vans. Makes we see every week include Toyota, Holden, Ford, Mazda, Hyundai, Nissan, Mitsubishi and Kia, and we buy the rest as well. Registered or not makes no difference to whether we can collect it.",
        },
        {
          text: "That includes cars that run and cars that don't, crashed and written-off cars, flood and hail damage, rusty cars, and cars that failed a roadworthy. When the repair quote is more than the car is worth, you don't have to fix it before we price it. Trucks are quoted on the cash for trucks page.",
          links: [{ phrase: "cash for trucks page", href: "/truck-removal" }],
        },
      ],
    },
    {
      heading: "What changes the price you pay?",
      paragraphs: [
        {
          text: "The price uses what you send: make, model, year, kilometres if you know them, what is wrong, and what is missing. A car that runs is worth more, but one that does not still has a price. Towing is not a line on the quote. The price we quote is the price we pay when the car is as described.",
        },
        {
          text: "Every car gets its own price. The quote uses what you send: make, model, year, kilometres if you know them, what is wrong, and what is missing.",
        },
        {
          text: "For scrap and non-running cars, the Brisbane scrap car prices page is the guide, and the same guide applies on the Gold Coast, the Sunshine Coast, in Logan, Ipswich and Tweed Heads. Towing is not a line on that quote. The price we quote is the price we pay, as long as the car is as described. If you want a market estimate first, check what your car is worth. That figure is not a cash offer.",
          links: [
            { phrase: "Brisbane scrap car prices page", href: PRICES },
            { phrase: "check what your car is worth", href: "/autoval" },
          ],
        },
      ],
      list: [
        { bold: "Make, model and year", text: "Popular and newer models are worth more for resale and parts." },
        { bold: "Condition", text: "A car that runs is worth more, but we still pay for ones that don't." },
        { bold: "Parts", text: "A good engine, gearbox or panels can add a fair bit." },
        { bold: "Metal prices", text: "For cars at the end of the road, the scrap metal price sets the floor." },
      ],
    },
    {
      heading: "How do I get paid?",
      paragraphs: [
        {
          text: "In Queensland, including Brisbane, the Gold Coast, Logan, Ipswich and the Sunshine Coast, you choose cash or a bank transfer. We pay before the car leaves and give you a receipt. In NSW, including Tweed Heads, scrap vehicles are paid by bank transfer only.",
        },
        {
          text: "In Queensland, including Brisbane, the Gold Coast, Logan, Ipswich and the Sunshine Coast, you choose cash or bank transfer. We pay before the car leaves, and we give you a receipt.",
        },
        {
          text: "In NSW, including Tweed Heads, the law doesn't allow cash for scrap vehicles, so it's bank transfer only. Have your bank details with you. The Tweed Heads page has the local notes for that side of the border.",
          links: [{ phrase: "Tweed Heads page", href: "/locations/tweed-heads" }],
        },
        {
          text: "The car shouldn't have finance owing on it. If it does, call 0423 514 111 and we'll discuss that car. We don't publish a process for financed cars on this page.",
          links: [{ phrase: "0423 514 111", href: PHONE }],
        },
      ],
    },
    {
      heading: "Paperwork on the day",
      paragraphs: [
        {
          text: "Bring photo ID (a driver's licence or passport) and proof of ownership, such as the rego papers. If the papers are lost, say so when you ask for a price. We still need ID and to be sure the car is yours. Bring the keys if you've got them, and clear out belongings and any toll tag.",
        },
        {
          text: "After pickup, cancel Queensland rego with Transport and Main Roads. You can do it online, and you may get a refund for unused time. In NSW, cancel it with Service NSW. Then tell your insurer.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
      ],
    },
    {
      heading: "Where we buy",
      paragraphs: [
        {
          text: "The yard is at 79B Breadwell St, Rocklea. Brisbane, Logan and Ipswich are often same-day. The Gold Coast is often the same day and usually within a day or two. The Sunshine Coast is further away, so it is booked, usually within a day or two. Local notes are on the Gold Coast, Sunshine Coast, Logan and Ipswich pages. Start with the quote form.",
          links: [
            { phrase: "Gold Coast", href: "/locations/gold-coast" },
            { phrase: "Sunshine Coast", href: "/locations/sunshine-coast" },
            { phrase: "Logan", href: "/locations/logan" },
            { phrase: "Ipswich", href: "/locations/ipswich" },
            { phrase: "quote form", href: QUOTE },
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "How much will I get for my car?",
      a: "It depends on the make, model, year, condition, and what parts and scrap metal are worth at the moment. Tell us about the car and we'll give you a firm price, usually within minutes. Towing fees are not taken off. Scrap and non-running ranges are on the scrap car prices page.",
      links: [{ phrase: "scrap car prices page", href: PRICES }],
    },
    {
      q: "Do you buy cars that don't run?",
      a: "Yes. We buy cars that run and cars that don't, plus crashed, flood-damaged, unregistered, rusty and scrap cars. Trucks are quoted separately on cash for trucks.",
      links: [{ phrase: "cash for trucks", href: "/truck-removal" }],
    },
    {
      q: "Can I choose cash?",
      a: "In Queensland, yes. Cash or bank transfer, paid before the car leaves. In NSW, including Tweed Heads, it's bank transfer only, because the law doesn't allow cash for scrap vehicles.",
    },
    {
      q: "What if I've lost the rego papers?",
      a: "Tell us when you use the quote form. We still need photo ID and to be sure the car is yours. We can usually sort the missing papers out from there.",
      links: [{ phrase: "quote form", href: QUOTE }],
    },
  ],
};

export const carRemovalsPage: ContentPage = {
  slug: "car-removals",
  intro: "Free car pickup across South East Queensland and the Tweed. Any condition.",
  title: "Free car removal across South East Queensland",
  // Overview for every area. Brisbane stays on /car-removal-brisbane. No redirect or canonical between them.
  metaTitle: "Free Car Removal Across SEQ",
  description:
    "Free car removal across South East Queensland and the Tweed. Any condition, paid on pickup. Brisbane car removal has its own page.",
  blocks: [],
  sections: [
    {
      heading: "Is car removal free across South East Queensland?",
      paragraphs: [
        {
          text: "Yes. Car removal is free in Brisbane, Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads. We do not charge a removal fee, and we do not take towing off your price. We pay you for the car as well, including scrap, damaged and unregistered cars.",
        },
        {
          text: "This is the free car removal overview for South East Queensland and the Tweed. It sets out where we collect, what the tow includes, and what to have ready. Brisbane has its own page, with that city's suburbs and the notes for pickups from our Rocklea yard: car removal Brisbane.",
          links: [{ phrase: "car removal Brisbane", href: "/car-removal-brisbane" }],
        },
        {
          text: "If you want to know how a car is priced before you book the truck, start with cash for cars. Removal and payment happen on the same visit. We pay you for the car, then we take it.",
          links: [{ phrase: "cash for cars", href: "/cash-for-cars" }],
        },
      ],
    },
    {
      heading: "How soon can you collect the car?",
      paragraphs: [
        {
          text: "Often the same day, and nearly always within a day or two. You choose the time, Monday to Saturday. Brisbane, Logan and Ipswich are closest to the Rocklea yard, so those jobs are often same day. The Sunshine Coast is further, so it is booked, usually within a day or two.",
        },
        {
          text: "We come to you Monday to Saturday. The car can be in a garage, on the street, at a mechanic's, or broken down roadside. Towing is free in every area on this page, and we pay you as well, including for scrap, damaged and unregistered cars. The quoted price is what we pay when the car is as described.",
        },
        {
          text: "Most pickups happen within a day of your call, and often the same day. The Sunshine Coast is further from the yard, so those jobs are booked, usually within a day or two.",
        },
        {
          text: "Start with the quote form, or call 0423 514 111. The Rocklea yard answers weekdays 8am to 5pm and Saturdays 8am to 2pm. If you want a market estimate before the cash offer, check what your car is worth. That estimate is not the offer.",
          links: [
            { phrase: "quote form", href: QUOTE },
            { phrase: "0423 514 111", href: PHONE },
            { phrase: "check what your car is worth", href: "/autoval" },
          ],
        },
      ],
    },
    {
      heading: "Which areas do you remove cars from?",
      paragraphs: [
        {
          text: "Brisbane, Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads. Brisbane has its own page. Logan and Ipswich each have one too. The Gold Coast run goes south to Coolangatta, and the Tweed is over the border in NSW, where payment is by bank transfer.",
        },
        {
          text: "Brisbane, Logan and Ipswich are the closest to the Rocklea yard, so pickups there are often the same day. Suburb-by-suburb Brisbane removal stays on the Brisbane page. Logan and Ipswich each have their own page, including the acreage notes for those cities.",
          links: [
            { phrase: "Logan", href: "/locations/logan" },
            { phrase: "Ipswich", href: "/locations/ipswich" },
          ],
        },
        {
          text: "The Gold Coast run goes from Ormeau and Coomera down to Coolangatta, including the hinterland around Nerang and Mudgeeraba. Most of those pickups happen within a day or two, and often the same day. Suburbs and unit-access notes are on the Gold Coast page.",
          links: [{ phrase: "Gold Coast page", href: "/locations/gold-coast" }],
        },
        {
          text: "The Sunshine Coast runs from Caloundra and Kawana up to Maroochydore, Coolum and Noosa, and inland to Nambour. We agree a time with you. See the Sunshine Coast page for the towns and the hinterland driveways.",
          links: [{ phrase: "Sunshine Coast page", href: "/locations/sunshine-coast" }],
        },
        {
          text: "Tweed Heads, Banora Point, Kingscliff, Pottsville, Terranora and Murwillumbah are over the border in NSW. The tow is still free. Payment there is by bank transfer only. Timing is usually within a day or two, and often sooner. The Tweed Heads page covers the NSW rego and transfer notes.",
          links: [{ phrase: "Tweed Heads page", href: "/locations/tweed-heads" }],
        },
      ],
    },
    {
      heading: "What we can remove",
      paragraphs: [
        {
          text: "No keys, flat tyres, or a car that will not roll: we bring a tilt tray and winch it on. Tell us about tight access when you ask for a price. A steep driveway, a basement car park, a height bar, or a car in the backyard all change which truck we send. They don't add a removal fee.",
        },
      ],
      list: [
        { bold: "Cars and hatchbacks", text: "Any make, any age, running or not." },
        { bold: "4WDs and SUVs", text: "Including high-kilometre and damaged ones." },
        { bold: "Utes and vans", text: "Work vehicles, and several from the same business on a schedule that suits you." },
        { bold: "Trucks", text: "Light, medium and heavy. Those are quoted on cash for trucks.", links: [{ phrase: "cash for trucks", href: "/truck-removal" }] },
        { bold: "Unregistered vehicles", text: "No rego is fine. We tow the car, so it doesn't need a roadworthy." },
      ],
    },
    {
      heading: "What to have ready",
      paragraphs: [
        {
          text: "Photo ID, a driver's licence or passport, and proof of ownership such as the rego papers. Keys if you've got them. If the papers are lost, tell us with the quote. We still need the ID and to be sure the car is yours.",
        },
        {
          text: "In Queensland we pay cash or by bank transfer before the car leaves. In the Tweed, have bank details ready because NSW is transfer only. You get a receipt. If finance is owing, call and we'll discuss that car. Afterwards, cancel Queensland rego with Transport and Main Roads (you may get a refund for unused time) or NSW rego with Service NSW, then tell your insurer.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Is car removal free in every area you cover?",
      a: "Yes. Pickup is free in Brisbane, Logan, Ipswich, the Gold Coast, the Sunshine Coast and Tweed Heads. We don't charge a removal fee and we don't take towing off your price.",
    },
    {
      q: "Should I use this page or the Brisbane car removal page?",
      a: "Use car removal Brisbane if the car is in Brisbane. It lists the Brisbane suburbs and the same-day notes from our Rocklea yard. Use this page for the full service across South East Queensland and the Tweed.",
      links: [{ phrase: "car removal Brisbane", href: "/car-removal-brisbane" }],
    },
    {
      q: "How do I get paid outside Queensland?",
      a: "Tweed Heads is in NSW, so payment there is by bank transfer before the car leaves. Cash isn't available for scrap vehicles in NSW. Everywhere we cover in Queensland, you can choose cash or a transfer.",
    },
    {
      q: "When do you collect?",
      a: "Monday to Saturday, at a time that suits you. Most pickups happen within a day of your call, and often the same day. Sunshine Coast jobs are usually within a day or two because the coast is further from Rocklea.",
    },
  ],
};

export const truckRemovalPage: ContentPage = {
  slug: "truck-removal",
  intro: "Light, medium and heavy trucks. Running or not.",
  title: "Cash for trucks",
  metaTitle: "Cash for Trucks Brisbane & Gold Coast",
  description:
    "Cash for light, medium and heavy trucks across South East Queensland and the Tweed. Tippers, trays, pantechs and rigids, running or not. Paid on pickup.",
  blocks: [],
  sections: [
    {
      heading: "Do you pay cash for trucks in Brisbane?",
      paragraphs: [
        {
          text: "Yes, in Queensland. Cash for trucks in Brisbane is paid in cash or by bank transfer when we collect the truck, before it leaves. In NSW, including Tweed Heads, the law does not allow cash for scrap vehicles, so a truck there is paid by bank transfer only.",
        },
        {
          text: "1800-CASH-FOR-CARS buys trucks on this page. Cars, utes and vans are priced on cash for cars. The suburb-by-suburb tow, for any vehicle, is on free car removal across South East Queensland. If the vehicle is a truck, start here.",
          links: [
            { phrase: "cash for cars", href: "/cash-for-cars" },
            { phrase: "free car removal across South East Queensland", href: "/car-removals" },
          ],
        },
        {
          text: "Light, medium or heavy, running or not. A retired work truck, one that's failed its inspection, or a wreck that's been sitting in the yard: tell us about it and we'll give you a price. Photos help a lot with trucks, so text a few through to 0423 514 111 if you can.",
          links: [{ phrase: "0423 514 111", href: PHONE }],
        },
      ],
    },
    {
      heading: "Trucks we buy",
      paragraphs: [
        {
          text: "Send the make, model, year, kilometres or hours, and what's wrong with it. A truck with a blown engine, crash damage or flood damage is still in scope. So is one that has been off the road for years. Say what's missing so the price we give is the price we pay on the day.",
        },
      ],
      list: [
        { bold: "Light trucks", text: "Isuzu NPR, Hino 300, Fuso Canter, Iveco Daily and similar." },
        { bold: "Medium and heavy rigids", text: "Tippers, tray tops, pantechs, curtainsiders and refrigerated trucks." },
        { bold: "Damaged or non-running", text: "Blown engines, crash damage, flood damage and trucks parked up for years." },
        { bold: "Fleets", text: "Several trucks from one business, picked up on a schedule that suits you." },
      ],
    },
    {
      heading: "Is the tow free when you buy a truck?",
      paragraphs: [
        {
          text: "Pickup is free for most trucks. We arrange the right tow for the job and confirm any pickup details for a large heavy vehicle when we give the price, so there is no surprise fee on the day. You are paid before the truck leaves.",
        },
        {
          text: "We arrange the right tow truck or tilt tray for the job. Pickup is free for most trucks. For large heavy vehicles we'll confirm any pickup details when we give you the price, so there are no surprises on the day.",
        },
        {
          text: "You're paid in cash or by bank transfer when we collect the truck, before it leaves. In NSW, including Tweed Heads, it's bank transfer only. Have the account details ready if the truck is on that side of the border. The Tweed Heads page explains that rule for cars and trucks alike.",
          links: [{ phrase: "Tweed Heads page", href: "/locations/tweed-heads" }],
        },
        {
          text: "Collections run Monday to Saturday. Brisbane, Logan and Ipswich are often the same day, because the yard is in Rocklea. Gold Coast trucks are often the same day and usually within a day or two. Sunshine Coast and Tweed Heads trucks are booked with you, usually within a day or two. The Gold Coast and Sunshine Coast pages cover those runs.",
          links: [
            { phrase: "Gold Coast", href: "/locations/gold-coast" },
            { phrase: "Sunshine Coast", href: "/locations/sunshine-coast" },
          ],
        },
      ],
    },
    {
      heading: "How are trucks in NSW paid?",
      paragraphs: [
        {
          text: "By bank transfer. NSW law does not allow cash for scrap vehicles, and that includes trucks in Tweed Heads. Have the account details ready on the day. In Queensland you can choose cash or a transfer, paid when we collect the truck and before it leaves.",
        },
        {
          text: "Bring photo ID and proof of ownership, the same as for a car. Rego papers if you have them. An unregistered truck is fine, because we tow it and it doesn't need a roadworthy. The truck shouldn't have finance owing. If it does, call us and we'll discuss that truck. We don't publish a finance process on this page.",
        },
        {
          text: "After collection, cancel the registration and the insurance, and keep the receipt. Queensland trucks are cancelled with Transport and Main Roads, online, and you may get a refund for unused rego. NSW trucks are cancelled with Service NSW.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
        {
          text: "The yard is at 79B Breadwell St, Rocklea QLD 4106, open weekdays 8am to 5pm and Saturdays 8am to 2pm. 1800-CASH-FOR-CARS is part of A Plus Car Removal, and we share that yard. You can visit or call the Rocklea yard, or send the truck's details through the quote form.",
          links: [
            { phrase: "visit or call the Rocklea yard", href: "/contact-us" },
            { phrase: "quote form", href: QUOTE },
          ],
        },
      ],
    },
    {
      heading: "What happens to the truck",
      paragraphs: [
        {
          text: "Back at the yard, fluids are drained and disposed of properly. Parts we can reuse are pulled and resold. The shell goes to a metal recycler, so the truck doesn't end up dumped. That's why a non-running truck still has a price: the parts and the metal are worth something to us, which is also why the tow is free for most trucks.",
        },
        {
          text: "A car that is only scrap, rather than a truck, is on the scrap car removal page. If you want guide ranges for scrap cars, those are published on the scrap car prices page and apply across the areas we cover, with free towing never deducted.",
          links: [
            { phrase: "scrap car removal page", href: "/scrap-car-removal" },
            { phrase: "scrap car prices page", href: PRICES },
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Do you buy trucks that don't run?",
      a: "Yes. Blown engines, crash damage, flood damage and trucks that have been off the road for years. Tell us what's wrong, and send photos if you can, so the quote matches the truck.",
    },
    {
      q: "Is truck pickup free?",
      a: "Pickup is free for most trucks. For large heavy vehicles we confirm any pickup details when we give you the price. We don't add a surprise tow fee on the day.",
    },
    {
      q: "Which trucks do you take?",
      a: "Light trucks such as Isuzu NPR, Hino 300, Fuso Canter and Iveco Daily, plus medium and heavy rigids: tippers, tray tops, pantechs, curtainsiders and refrigerated trucks.",
    },
    {
      q: "Can a business sell more than one truck?",
      a: "Yes. Several trucks from one business can be picked up on a schedule that suits you. Tell us how many, and where they are parked, when you ask for a price.",
    },
    {
      q: "How are trucks in NSW paid?",
      a: "By bank transfer, including in Tweed Heads. NSW law doesn't allow cash for scrap vehicles. In Queensland you can choose cash or a transfer, paid when we collect the truck.",
    },
  ],
};
