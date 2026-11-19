import type { CopyParagraph } from "./copy";

export const AUTOVAL_PATH = "/autoval";

// The line on each location page that sends "what is it worth on the open market" to AutoVal.
// Every page has its own wording, so the links into /autoval do not all carry one anchor.
// Say only what AutoVal does: a free estimate of private-sale, trade-in and dealer prices. It is not our cash offer.
//
// A new page under /locations needs an entry here and has to show it: the three templated areas
// take theirs from src/lib/areas/<slug>.ts, the other pages render <ValuationNote path="..." />.
// tests/valuation-notes.test.ts fails when a location in the sitemap has no entry.
export const valuationNotes = {
  "/locations": {
    text: "Want a market figure before you ask for a price? AutoVal is our free car valuation. It estimates private-sale, trade-in and dealer prices for a car you could still advertise. That estimate is not our cash offer.",
    links: [{ phrase: "free car valuation", href: AUTOVAL_PATH }],
  },
  "/locations/gold-coast": {
    text: "If the car still runs and you are weighing up a private sale first, AutoVal is a free online car valuation. It estimates private-sale, trade-in and dealer prices, and it is not our cash offer.",
    links: [{ phrase: "free online car valuation", href: AUTOVAL_PATH }],
  },
  "/locations/logan": {
    text: "If your car still runs and you might sell it privately, you can value your car with AutoVal before you ask us. It is free, it estimates private-sale, trade-in and dealer prices, and it is not our cash offer.",
    links: [{ phrase: "value your car with AutoVal", href: AUTOVAL_PATH }],
  },
  "/locations/ipswich": {
    text: "A car that still runs and could be advertised has a market value as well. AutoVal estimates what your car is worth on the open market, as private-sale, trade-in and dealer prices. It is free, and that figure is not our cash offer.",
    links: [{ phrase: "what your car is worth on the open market", href: AUTOVAL_PATH }],
  },
  "/locations/sunshine-coast": {
    text: "If the car still runs and you have not decided between a private sale and a cash offer, our car valuation tool is free to use. AutoVal estimates private-sale, trade-in and dealer prices. It is an estimate only, not our cash offer.",
    links: [{ phrase: "car valuation tool", href: AUTOVAL_PATH }],
  },
  "/locations/tweed-heads": {
    text: "AutoVal works for NSW cars as well as Queensland ones. Choose NSW as the state and it gives a free car value estimate: private-sale, trade-in and dealer prices for a car you could still advertise. That estimate is not our cash offer.",
    links: [{ phrase: "free car value estimate", href: AUTOVAL_PATH }],
  },
  "/locations/toowong": {
    text: "If the car still runs and you might advertise it yourself, start with a free Brisbane car valuation. AutoVal estimates private-sale, trade-in and dealer prices online. That estimate is not our cash offer.",
    links: [{ phrase: "free Brisbane car valuation", href: AUTOVAL_PATH }],
  },
} satisfies Record<string, CopyParagraph>;

export type ValuationNotePath = keyof typeof valuationNotes;
