import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QuoteForm, QuoteFormHeading } from "../src/components/QuoteForm";

// The owner's rules for the quote card. Each has been changed by an earlier edit and had to be put back.
const text = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'");

// Outside a Next.js page there is no current path, so the hidden "page" field renders with a null value
// and React says so. That one message is expected here. Anything else is still printed.
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

const heading = render(createElement(QuoteFormHeading, { className: "h-sub" }));
const form = render(createElement(QuoteForm));
const field = (name: string) => form.match(new RegExp(`<(?:input|textarea)[^>]*\\sname="${name}"[^>]*>`))?.[0] ?? "";

describe("quote card", () => {
  it("is headed exactly 'Get a free quote (Instant)', with nothing else in the heading", () => {
    assert.match(heading, /^<h2[^>]*>.*<\/h2>$/);
    assert.equal(text(heading), "Get a free quote (Instant)");
  });

  it("asks for make, model and year as three separate required fields", () => {
    for (const name of ["make", "model", "year"]) {
      assert.ok(field(name), `${name} field is missing`);
      assert.match(field(name), /\srequired(=""|\s|\/?>)/, `${name} is not required`);
    }
  });

  it("always has the price field, optional, with its exact placeholder", () => {
    const price = field("expected");
    assert.ok(price, "price field is missing");
    assert.equal(price.match(/placeholder="([^"]*)"/)?.[1].replace(/&#x27;/g, "'"), "Price you're hoping for (optional)");
    assert.doesNotMatch(price, /\srequired/);
    assert.doesNotMatch(field("email"), /\srequired/);
  });

  // Nothing folds the price, or any other field, away on a phone: no wrapper, no toggle, no rule for either.
  it("has no fold or toggle around the optional fields", () => {
    assert.doesNotMatch(form, /quote-more|aria-expanded|Add email/);
    const css = readFileSync("src/app/globals.css", "utf8");
    assert.doesNotMatch(css, /quote-more/);
    assert.match(css, /\.quote-instant\s*\{/);
  });
});
