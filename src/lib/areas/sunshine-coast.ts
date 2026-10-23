import type { CopyFaq, CopySection } from "../copy";

const QUOTE = "/quote";
const PRICES = "/scrap-car-prices-brisbane";
const QLD_CANCEL = "https://www.qld.gov.au/transport/registration/cancel";

// First three names are used in the page's meta description. Keep that order.
export const sunshineCoastSuburbs = [
  "Maroochydore",
  "Caloundra",
  "Noosa",
  "Nambour",
  "Mooloolaba",
  "Buderim",
  "Kawana",
  "Coolum Beach",
  "Golden Beach",
  "Pelican Waters",
  "Currimundi",
  "Battery Hill",
  "Aroona",
  "Little Mountain",
  "Buddina",
  "Warana",
  "Bokarina",
  "Birtinya",
  "Alexandra Headland",
  "Mountain Creek",
  "Sippy Downs",
  "Bli Bli",
  "Mudjimba",
  "Marcoola",
  "Peregian Beach",
  "Peregian Springs",
  "Noosa Heads",
  "Noosaville",
  "Tewantin",
  "Sunshine Beach",
  "Woombye",
  "Palmwoods",
  "Yandina",
  "Eumundi",
];

export const sunshineCoastLocal = {
  intro:
    "1800-CASH-FOR-CARS buys scrap, old and unwanted cars across the Sunshine Coast, from Caloundra and Kawana up to Maroochydore, Coolum and Noosa, and inland to Nambour. The tow is free.",
  sections: [
    {
      heading: "Coastal towns and the hinterland behind them",
      paragraphs: [
        {
          text: "Caloundra is the southern start: Golden Beach, Pelican Waters, Currimundi, Aroona and Little Mountain, then Kawana at Buddina, Warana, Bokarina and Birtinya. Through the middle we collect in Maroochydore, Alexandra Headland, Mooloolaba, Mountain Creek, Buderim and Sippy Downs, and north of the river at Mudjimba, Marcoola, Coolum Beach, Peregian Beach and Peregian Springs.",
        },
        {
          text: "Noosa is the northern end of this page: Noosa Heads, Noosaville, Tewantin and Sunshine Beach. Inland we come to Nambour, Bli Bli, Woombye, Palmwoods, Yandina and Eumundi. A car on a rural block behind Nambour or Buderim is fine. Mention a gate, a long driveway or soft ground on the quote form.",
          links: [{ phrase: "quote form", href: QUOTE }],
        },
      ],
    },
    {
      heading: "Booking a pickup from further up the coast",
      paragraphs: [
        {
          text: "The Sunshine Coast is further from our Rocklea yard than Brisbane or the Gold Coast, so we book a time with you, usually within a day or two. Tell us the day that suits. Collections run Monday to Saturday. That extra distance changes the timing. It does not add a towing fee, and the tow is never taken off the price.",
        },
        {
          text: "The price guide is the same one we use in Brisbane. Access and distance can change an individual quote. They are not a surcharge. The current guide is the scrap car prices page, if you want the ranges before you send the car's details.",
          links: [{ phrase: "scrap car prices page", href: PRICES }],
        },
        {
          text: "We still bring a tilt tray and winch. The car can be at home, at work, at a mechanic in Maroochydore or Caloundra, or broken down on the roadside. It does not need to start, and it does not need keys. Flat tyres are fine. Say which applies so we send a truck that can load it.",
        },
      ],
    },
    {
      heading: "Beach rust, second cars and work utes",
      paragraphs: [
        {
          text: "Salt air takes a toll on older cars parked near Mooloolaba, Coolum and Noosa. We still pay for rusty cars, based on the metal and the parts. A second car you no longer drive, sitting in a Buderim garage or a Kawana lock-up, is a straightforward collection: we pick it up and give you a receipt.",
        },
        {
          text: "Sedans, hatchbacks, 4WDs, utes and vans are all in scope, running or not, with rego or without. A farm ute that has not moved for years can still be priced. If the repair quote is already more than the car is worth, you do not have to fix it before we come. Car disposal sets out that path if you are moving house or clearing a driveway.",
          links: [{ phrase: "Car disposal", href: "/car-disposal" }],
        },
        {
          text: "Vans and trucks from Sunshine Coast businesses are welcome, one vehicle or several. Heavier trucks are quoted on cash for trucks. If you want the detail on how we decide a price, that sits on the cash for cars page. This page is about getting the vehicle collected up here.",
          links: [
            { phrase: "cash for trucks", href: "/truck-removal" },
            { phrase: "cash for cars page", href: "/cash-for-cars" },
          ],
        },
      ],
    },
    {
      heading: "Queensland paperwork on the Sunshine Coast",
      paragraphs: [
        {
          text: "Bring photo ID and proof the car is yours, usually the rego papers. Unregistered cars are accepted because we tow them, so a roadworthy is not required. Lost papers are worth mentioning up front. Have the photo ID ready either way.",
        },
        {
          text: "Empty the glovebox, the boot and any toll tag before the truck arrives. Ring 0423 514 111 first if finance is still on the car. We'll discuss it. Those steps aren't set out here.",
          links: [{ phrase: "0423 514 111", href: "tel:+61423514111" }],
        },
        {
          text: "Payment here is cash or bank transfer, whichever you prefer, and it happens before the car leaves. Once we have collected it, cancel the Queensland registration online with Transport and Main Roads. Unused rego may be refunded. Cancel the insurance as well. Calls to the Rocklea yard are answered on weekdays until 5pm and on Saturdays until 2pm.",
          links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
        },
      ],
    },
  ] satisfies CopySection[],
  cta: {
    text: "Tell us the town, the vehicle and whether a truck can reach it. We will book a Sunshine Coast time around that.",
    from: "sunshine-coast-body",
  },
  faqs: [
    {
      q: "Is pickup free on the Sunshine Coast?",
      a: "Yes. There is no charge for towing from Caloundra through Kawana and Maroochydore to Noosa, or inland to Nambour. We do not take that tow off your price.",
    },
    {
      q: "How soon can you come to the Sunshine Coast?",
      a: "Usually within a day or two. The coast is further from our Rocklea yard, so we book a time with you. Tell us the day that suits. Pickups run Monday to Saturday.",
    },
    {
      q: "Do you go as far as Noosa Heads and Tewantin?",
      a: "Yes. Noosa Heads, Noosaville, Tewantin, Sunshine Beach and the beaches back to Coolum are included. Put the suburb in the quote form and we will confirm it.",
      links: [{ phrase: "quote form", href: QUOTE }],
    },
    {
      q: "Can you collect from a property behind Nambour or Buderim?",
      a: "Yes. Rural blocks are part of this area. Tell us about the driveway, any gate, or soft ground, so we allow enough time and bring a truck that can reach the car.",
    },
    {
      q: "Does the car need Queensland rego?",
      a: "No. We tow it, so current rego and a roadworthy are not required. You still need photo ID and proof of ownership. After collection, cancel any live rego with Transport and Main Roads.",
      links: [{ phrase: "Transport and Main Roads", href: QLD_CANCEL }],
    },
  ] satisfies CopyFaq[],
};
