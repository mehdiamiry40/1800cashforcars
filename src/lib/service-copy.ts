import type { ContentPage } from "./copy";

const QUOTE = "/quote";
const PRICES = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";
const PHONE = "tel:+61423514111";

export const cashForCarsPage: ContentPage = {
  slug: "cash-for-cars",
  updated: "2026-11-26T11:35:18+10:00",
  // The process page for "sell your car for cash in Brisbane". The homepage owns "cash for cars
  // Brisbane", so that phrase is never this page's title, H1, label or opening line, and it links
  // back to "/". The label is what the breadcrumb, the related links and the FAQ heading call this page.
  intro:
    "Yes, you can sell your car for cash in Brisbane. Tell us the make, model, year and condition, and we send a firm price, usually within the hour. If you accept, we collect from your address, pay you in cash or by bank transfer before the car leaves, and towing is free. Pickups are usually within a day or two.",
  introNote: {
    text: "This page is the sale, step by step. For what we buy and pay across the city, see cash for cars Brisbane.",
    links: [{ phrase: "cash for cars Brisbane", href: "/" }],
  },
  title: "Sell your car for cash in Brisbane",
  label: "Sell your car for cash",
  metaTitle: "Sell Your Car for Cash in Brisbane",
  description:
    "Sell your car for cash in Brisbane: send the make, model and year, get a firm price usually within the hour, and be paid before the car leaves. Free tow.",
  blocks: [],
  sections: [
    {
      heading: "How do I sell my car for cash in Brisbane?",
      paragraphs: [
        {
          text: "Selling a car for cash takes five steps: send the car's details, get a firm price, book a pickup, get paid, then cancel the rego. You don't write an ad, take calls or arrange test drives, and the car doesn't have to run or be registered.",
        },
      ],
      list: [
        {
          bold: "1. Send the details",
          text: "The make, model and year are the three we need. Add the kilometres if you know them, what is wrong with the car and anything that is missing. Use the quote form, or call or text 0423 514 111.",
          links: [
            { phrase: "quote form", href: QUOTE },
            { phrase: "0423 514 111", href: PHONE },
          ],
        },
        { bold: "2. Get a firm price", text: "It is usually back within the hour. The quote is free, and there is no obligation to accept it." },
        { bold: "3. Book the pickup", text: "You choose the time, Monday to Saturday. Pickups are usually within a day or two." },
        { bold: "4. Get paid", text: "The driver checks the car matches what you told us, then pays you in cash or by bank transfer before the car leaves, and gives you a receipt." },
        { bold: "5. Cancel the rego", text: "Once the car is gone, cancel the registration and tell your insurer." },
      ],
    },
    {
      heading: "Should I sell for cash, sell privately or trade it in?",
      paragraphs: [
        {
          text: "A private sale usually brings the most for a clean car that runs well, but it means an ad, phone calls, test drives, people not turning up and haggling over the price. A trade-in is quick when you are buying another car, and a dealer offers little for one that is damaged or old. Selling for cash suits a car you want gone without the ads and the waiting, and a car that is damaged, unregistered or not worth repairing.",
        },
        {
          text: "Not sure which way to go? If the car still runs and you could advertise it, check what your car is worth first. AutoVal estimates private-sale, trade-in and dealer prices. That figure is a market estimate, not a cash offer from us.",
          links: [{ phrase: "check what your car is worth", href: "/autoval" }],
        },
      ],
    },
    {
      heading: "What do you need to know to price my car?",
      paragraphs: [
        {
          text: "The make, model and year, and it helps to have the kilometres, what is wrong and what is missing. A car that runs is worth more, but one that does not still has a price. Towing is not a line on the quote. The price we quote is the price we pay when the car is as described.",
        },
        {
          text: "For scrap and non-running cars, the Brisbane scrap car prices page is the guide, and the same guide applies on the Gold Coast, the Sunshine Coast, in Logan, Ipswich and Tweed Heads.",
          links: [{ phrase: "Brisbane scrap car prices page", href: PRICES }],
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
      heading: "What happens on pickup day?",
      paragraphs: [
        {
          text: "The driver comes at the time you booked, checks the car matches what you told us, pays you, and tows it away. There's no charge for the tow, and nothing is taken off at the kerb when the car is as described.",
        },
        {
          text: "Have photo ID ready (a driver's licence or passport) and proof of ownership, such as the rego papers. If the papers are lost, say so when you ask for a price. We still need ID and to be sure the car is yours. Bring the keys if you've got them, and clear out belongings and any toll tag.",
        },
        {
          text: "The car doesn't need to run or roll. Where the truck can collect from in the city is on free car removal in Brisbane, and the wider South East Queensland run is on the free car removal page.",
          links: [
            { phrase: "free car removal in Brisbane", href: "/car-removal-brisbane" },
            { phrase: "free car removal page", href: "/car-removals" },
          ],
        },
      ],
    },
    {
      heading: "How am I paid when I sell my car?",
      paragraphs: [
        {
          text: "In Queensland you choose cash or a bank transfer. We pay before the car leaves and give you a receipt. That applies in Brisbane, Logan, Ipswich, the Gold Coast and the Sunshine Coast.",
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
      heading: "What do I do after the car is sold?",
      paragraphs: [
        {
          text: "Cancel the registration, then tell your insurer. For a Queensland car, cancel the rego with Transport and Main Roads. You can do it online, and you may get a refund for unused time. In NSW, cancel it with Service NSW. Keep the receipt we give you for your records.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
      ],
    },
    {
      heading: "Which cars can I sell for cash?",
      paragraphs: [
        {
          text: "Cars and hatchbacks, 4WDs and SUVs, utes and vans, of any make. Registered or not makes no difference to whether we can collect it. Cars that run and cars that don't, crashed and written-off cars, flood and hail damage, rusty cars, and cars that failed a roadworthy are all bought as they are. When the repair quote is more than the car is worth, you don't have to fix it before we price it.",
        },
        {
          text: "Some vehicles have a page of their own. Trucks are quoted on the cash for trucks page. A car that is only worth scrap is covered on cash for scrap cars, and a car with no keys or no wheels is still collected.",
          links: [
            { phrase: "cash for trucks page", href: "/truck-removal" },
            { phrase: "cash for scrap cars", href: "/scrap-car-removal" },
            { phrase: "no keys or no wheels", href: "/car-removal-no-keys-no-wheels" },
          ],
        },
      ],
    },
    {
      heading: "Where can I sell my car for cash?",
      paragraphs: [
        {
          text: "Anywhere in Brisbane. We buy from our yard at 79B Breadwell St, Rocklea, on the city's southside, and pickups are usually within a day or two. What we buy and what we pay across the city is on cash for cars Brisbane.",
          links: [{ phrase: "cash for cars Brisbane", href: "/" }],
        },
        {
          text: "From the same yard we also buy in Logan, Ipswich, the Gold Coast and Tweed Heads, and each has its own page with local notes. So does the Sunshine Coast, which is further away, so that run is booked with you. Start with the quote form.",
          links: [
            { phrase: "Logan", href: "/locations/logan" },
            { phrase: "Ipswich", href: "/locations/ipswich" },
            { phrase: "Gold Coast", href: "/locations/gold-coast" },
            { phrase: "Tweed Heads", href: "/locations/tweed-heads" },
            { phrase: "Sunshine Coast", href: "/locations/sunshine-coast" },
            { phrase: "quote form", href: QUOTE },
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      q: "Can I sell my car for cash in Brisbane?",
      a: "Yes. We buy cars in Brisbane in any of the conditions listed on this page, pay cash or bank transfer before the car leaves, and the tow is free. A firm price is usually within the hour, and pickups are usually within a day or two. The tow is covered on free car removal in Brisbane, and the local overview is on cash for cars Brisbane.",
      links: [
        { phrase: "free car removal in Brisbane", href: "/car-removal-brisbane" },
        { phrase: "cash for cars Brisbane", href: "/" },
      ],
    },
    {
      q: "How long does it take to sell a car for cash?",
      a: "A firm price is usually within the hour, and pickups are usually within a day or two. You choose the pickup time, Monday to Saturday, and you are paid on that visit, before the car leaves.",
    },
    {
      q: "Do I have to accept the price you quote?",
      a: "No. The quote is free and there is no obligation. If you do accept, the price we quote is the price we pay when the car is as described, and towing fees are not taken off.",
    },
    {
      q: "Can I sell a car that doesn't run or isn't registered?",
      a: "Yes. Cars that don't run, unregistered cars, and crashed, flood-damaged or rusty cars are bought as they are. We tow the car, so it doesn't need rego or a roadworthy. Scrap and non-running ranges are on the scrap car prices page, and trucks are quoted separately on cash for trucks.",
      links: [
        { phrase: "scrap car prices page", href: PRICES },
        { phrase: "cash for trucks", href: "/truck-removal" },
      ],
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
    {
      q: "Can I sell a car that has finance owing?",
      a: "The car shouldn't have finance owing on it. If it does, call 0423 514 111 and we'll discuss that car.",
      links: [{ phrase: "0423 514 111", href: PHONE }],
    },
  ],
};

export const carRemovalsPage: ContentPage = {
  slug: "car-removals",
  updated: "2026-11-24T14:10:00+10:00",
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
          text: "Yes. Logan, Ipswich, both coasts, Brisbane and the border town are all on the free run. No removal invoice is raised, and the agreed figure is not trimmed afterwards. Scrap, damaged and unregistered vehicles are paid for, not merely hauled away.",
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
          text: "Pickups are usually within a day or two. You choose the time. Jobs nearest Rocklea, meaning Brisbane plus Logan and Ipswich, are on that same timing. The northern coast is booked, because that drive is longer.",
        },
        {
          text: "We come to you Monday to Saturday. The car can be in a garage, on the street, at a mechanic's, or broken down roadside. Towing is free in every area on this page, and we pay you as well, including for scrap, damaged and unregistered cars. The quoted price is what we pay when the car is as described.",
        },
        {
          text: "Pickups are usually within a day or two. The Sunshine Coast is further from the yard, so those jobs are booked on that same timing.",
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
          text: "Six places. This city's suburbs, Logan and Ipswich each have a page. The southern strip runs to Coolangatta and is written up on its own. So is the northern coast. Past the state line, around Tweed Heads, notes are not used and only a transfer is offered.",
        },
        {
          text: "Brisbane, Logan and Ipswich are the closest to the Rocklea yard. Pickups there are usually within a day or two. Suburb-by-suburb Brisbane removal stays on the Brisbane page. Logan and Ipswich each have their own page, including the acreage notes for those cities.",
          links: [
            { phrase: "Logan", href: "/locations/logan" },
            { phrase: "Ipswich", href: "/locations/ipswich" },
          ],
        },
        {
          text: "The Gold Coast run goes from Ormeau and Coomera down to Coolangatta, including the hinterland around Nerang and Mudgeeraba. Those pickups are usually within a day or two. Suburbs and unit-access notes are on the Gold Coast page.",
          links: [{ phrase: "Gold Coast page", href: "/locations/gold-coast" }],
        },
        {
          text: "The Sunshine Coast runs from Caloundra and Kawana up to Maroochydore, Coolum and Noosa, and inland to Nambour. We agree a time with you. See the Sunshine Coast page for the towns and the hinterland driveways.",
          links: [{ phrase: "Sunshine Coast page", href: "/locations/sunshine-coast" }],
        },
        {
          text: "Tweed Heads, Banora Point, Kingscliff, Pottsville, Terranora and Murwillumbah are over the border in NSW. The tow is still free. Payment there is by bank transfer only. Timing is usually within a day or two. The Tweed Heads page covers the NSW rego and transfer notes.",
          links: [{ phrase: "Tweed Heads page", href: "/locations/tweed-heads" }],
        },
      ],
    },
    {
      heading: "What we can remove",
      paragraphs: [
        {
          text: "No keys, flat tyres, or a car that will not roll: we bring a tilt tray and winch it on. Tell us about tight access when you ask for a price. A steep driveway, a basement car park, a height bar, or a car in the backyard all change which truck we send. They don't add a removal fee. Cars with no keys or no wheels have their own page.",
          links: [{ phrase: "Cars with no keys or no wheels", href: "/car-removal-no-keys-no-wheels" }],
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
      a: "Use car removal Brisbane if the car is in Brisbane. It lists the Brisbane suburbs and the pickup timing from our Rocklea yard. Use this page for the full service across South East Queensland and the Tweed.",
      links: [{ phrase: "car removal Brisbane", href: "/car-removal-brisbane" }],
    },
    {
      q: "How do I get paid outside Queensland?",
      a: "Tweed Heads is in NSW, so payment there is by bank transfer before the car leaves. Cash isn't available for scrap vehicles in NSW. Everywhere we cover in Queensland, you can choose cash or a transfer.",
    },
    {
      q: "When do you collect?",
      a: "Monday to Saturday, at a time that suits you. Pickups are usually within a day or two. Sunshine Coast jobs are booked on that same timing because the coast is further from Rocklea.",
    },
  ],
};

export const truckRemovalPage: ContentPage = {
  slug: "truck-removal",
  updated: "2026-11-26T11:37:26+10:00",
  // This page owns "cash for old trucks". Those searches were landing on the homepage, which now
  // links here. The Gold Coast and the other areas stay in the copy, not in the title.
  intro:
    "Yes, we pay cash for old trucks in Brisbane and South East Queensland. Light, medium and heavy trucks are bought, running or not, including retired work trucks that have sat for years. Payment is before the truck leaves. Pickup is free for most trucks, and pickups are usually within a day or two.",
  title: "Cash for old trucks in Brisbane",
  label: "Cash for trucks",
  metaTitle: "Cash for Old Trucks Brisbane",
  description:
    "Cash for old trucks in Brisbane and South East QLD. Light, medium and heavy trucks, running or not. Paid before it leaves. Pickup free for most trucks.",
  blocks: [],
  sections: [
    {
      heading: "Do you pay cash for trucks in Brisbane?",
      paragraphs: [
        {
          text: "Yes, in Queensland. Cash for trucks in Brisbane is paid in cash or by bank transfer when we collect the truck, before it leaves. In NSW, including Tweed Heads, the law does not allow cash for scrap vehicles, so a truck there is paid by bank transfer only.",
        },
        {
          text: "1800-CASH-FOR-CARS buys trucks on this page. Selling a car, ute or van is set out on sell your car for cash. The suburb-by-suburb tow, for any vehicle, is on free car removal across South East Queensland. If the vehicle is a truck, start here.",
          links: [
            { phrase: "sell your car for cash", href: "/cash-for-cars" },
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
      heading: "Cash for old trucks",
      paragraphs: [
        {
          text: "Old trucks are in scope: a retired work truck, a truck that failed an inspection, a wreck that has been sitting, or a truck that has been off the road for years. Running or not does not rule a truck out. Say what is wrong and what is missing, so the price we give is the price we pay.",
        },
        {
          text: "Payment is before the truck leaves: cash or bank transfer in Queensland, bank transfer only in NSW. Pickup is free for most trucks. For a large heavy vehicle, pickup details are confirmed with the price. Brisbane, Logan, Ipswich and Gold Coast trucks are usually collected within a day or two. For Logan suburbs, see cash for trucks in Logan.",
          links: [{ phrase: "cash for trucks in Logan", href: "/locations/logan" }],
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
          text: "Collections run Monday to Saturday. Brisbane, Logan, Ipswich and Gold Coast trucks are usually within a day or two. Sunshine Coast and Tweed Heads trucks are booked with you, usually within a day or two. The Gold Coast and Sunshine Coast pages cover those runs.",
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
      q: "Do you pay cash for old trucks?",
      a: "Yes. In Queensland, including Brisbane, you can choose cash or bank transfer, paid before the truck leaves. In NSW, including Tweed Heads, payment is by bank transfer only. We buy light, medium and heavy trucks, running or not, including old trucks that have been off the road for years. Pickup is free for most trucks.",
    },
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
