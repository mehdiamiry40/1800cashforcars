import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Fragment, createElement as h } from "react";
import { plainText } from "../src/lib/plain-text";

describe("plain text of JSX", () => {
  it("reads the words in order and drops the markup", () => {
    const answer = h(
      Fragment,
      null,
      "The shared yard is at",
      " ",
      h("a", { href: "https://example.com", className: "underline" }, "79B Breadwell St"),
      ". Visits are to this address.",
    );
    assert.equal(plainText(answer), "The shared yard is at 79B Breadwell St. Visits are to this address.");
  });

  it("reads through nested elements, arrays and numbers", () => {
    assert.equal(plainText(h("p", null, ["Open ", h("b", { key: "b" }, h("span", null, 6)), " days"])), "Open 6 days");
  });

  it("leaves out what React does not render", () => {
    assert.equal(plainText(h(Fragment, null, "Call us", null, false, undefined, true, ".")), "Call us.");
    assert.equal(plainText(null), "");
  });

  it("passes a plain string through", () => {
    assert.equal(plainText("Yes. Towing is always free."), "Yes. Towing is always free.");
  });
});
