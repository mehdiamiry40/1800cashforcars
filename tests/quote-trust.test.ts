import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AutoValuer } from "../src/app/autoval/AutoValuer";
import { CashOfferPrompt } from "../src/app/autoval/CashOfferPrompt";
import QuotePage from "../src/app/quote/page";
import { Footer } from "../src/components/Footer";
import { QuoteTrustLine } from "../src/components/ParentBrand";
import { site } from "../src/lib/site";

const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");

// Outside a Next.js page there is no current path, so the quote form's hidden "page" field renders with a
// null value and React says so. That one message is expected here. Anything else is still printed.
function render(element: ReactElement): string {
  const report = console.error;
  console.error = (...args: unknown[]) => {
    if (!String(args[0]).includes("should not be null")) report(...args);
  };
  try {
    return renderToStaticMarkup(element);
  } finally {
    console.error = report;
  }
}

const trust = render(createElement(QuoteTrustLine));
const trustText = text(trust);

// The licence, the ABN and the yard address, where a seller decides whether to send their details.
describe("trust line beside a quote form or quote button", () => {
  it("states the licence, the yard address and the ABN, word for word from site.ts", () => {
    assert.ok(trustText.includes(site.licenceLine), "the licence line is missing or reworded");
    assert.ok(trustText.includes(site.address), "the yard address is missing");
    assert.ok(trustText.includes(`ABN ${site.abn}`), "the ABN is missing");
  });

  // Anything not read from site.ts would be a claim this file cannot vouch for.
  it("adds nothing but the sentence that joins those three facts", () => {
    assert.equal(trustText, `${site.licenceLine} We share its yard at ${site.address}. ABN ${site.abn}.`);
  });

  it("is plain text, so nothing beside the form links away from it", () => {
    assert.doesNotMatch(trust, /<a\b/);
  });

  it("is in the quote box on /quote, under the form", () => {
    const page = render(createElement(QuotePage));
    const box = page.slice(page.indexOf("data-quote"));
    const afterForm = box.slice(box.indexOf("</form>"));
    assert.ok(box.includes("</form>") && text(afterForm).includes(trustText), "the trust line is not under the form on /quote");
  });

  // The hero imports a photo, which only the Next.js build can load, so this one reads the source.
  it("is in the hero quote card, which the homepage uses, under the form", () => {
    const hero = readFileSync("src/components/Hero.tsx", "utf8");
    const card = hero.slice(hero.indexOf("data-quote"));
    assert.ok(card.indexOf("<QuoteForm ") > 0 && card.indexOf("<QuoteTrustLine") > card.indexOf("<QuoteForm "), "the trust line is not under the form in the hero card");
    assert.match(readFileSync("src/app/page.tsx", "utf8"), /<Hero\b/);
  });
});

describe("site footer", () => {
  const footer = text(render(createElement(Footer)));

  it("still states the licence, the ABN and the yard address", () => {
    assert.ok(footer.includes(site.licenceLine), "the licence line is missing from the footer");
    assert.ok(footer.includes(`ABN ${site.abn}`), "the ABN is missing from the footer");
    assert.ok(footer.includes(site.address), "the yard address is missing from the footer");
    assert.ok(footer.includes(`${site.name} is part of ${site.googleBusinessName}`), "the parent line is missing from the footer");
  });
});

// On a desktop there is no bottom bar, and the quote form on /autoval only appears after a valuation.
describe("cash offer block beside the AutoVal tool", () => {
  const block = render(createElement(CashOfferPrompt));
  const classes = (html: string) => html.match(/class="([^"]*)"/)?.[1].split(/\s+/) ?? [];

  it("has a 'Get a free quote' button that opens the quote form", () => {
    const link = block.match(/<a\b[^>]*>.*?<\/a>/)?.[0] ?? "";
    assert.match(link, /\shref="\/quote"/);
    assert.equal(text(link), "Get a free quote");
    assert.ok(classes(link).includes("btn-brand"), "the button does not use the site's button style");
  });

  it("is not hidden at any screen width", () => {
    const hiding = classes(block).filter((name) => /(^|:)(hidden|invisible|sr-only)$/.test(name));
    assert.deepEqual(hiding, []);
  });

  // Both sentences are answers already on the AutoVal page. If the page's wording changes, change the block
  // to match, so the block never says more than the page does.
  it("says only what the AutoVal page already says about a damaged car", () => {
    const page = readFileSync("src/app/autoval/page.tsx", "utf8");
    for (const sentence of ["AutoVal is an estimate, not an offer to buy the car.", "For a damaged, non-running or scrap car, ask for a cash offer."]) {
      assert.ok(text(block).includes(sentence), `the block no longer says: ${sentence}`);
      assert.ok(page.includes(sentence), `the AutoVal page no longer says: ${sentence}`);
    }
    assert.doesNotMatch(text(block), /same.day|\$\s?\d|up to/i, "the block makes a timing or price promise");
  });

  it("carries the trust line", () => {
    assert.ok(text(block).includes(trustText));
  });

  it("is part of the tool whether or not the rego lookup is on, with no quote form before a valuation", () => {
    for (const regoLookup of [true, false]) {
      const tool = render(createElement(AutoValuer, { regoLookup }));
      const mode = `rego lookup ${regoLookup ? "on" : "off"}`;
      const placed = tool.match(/<aside\b[^>]*>.*?<\/aside>/)?.[0] ?? "";
      assert.equal(text(placed), text(block), `the cash offer block is missing from the tool (${mode})`);
      const hiding = classes(placed).filter((name) => /(^|:)(hidden|invisible|sr-only)$/.test(name));
      assert.deepEqual(hiding, [], `the tool hides the cash offer block at some width (${mode})`);
      assert.doesNotMatch(tool, /data-quote/);
    }
  });
});
