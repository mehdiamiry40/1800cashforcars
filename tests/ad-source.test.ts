import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  adSourceFromVisit,
  cleanAdSource,
  describeAdSource,
  hasAdTags,
  parseAdSource,
  rememberAdSource,
  storedAdSource,
} from "@/lib/ad-source";
import { GOOGLE_ADS_CALL_CONVERSION, reportCallTap } from "@/lib/quote-conversion";

type Browser = {
  location?: { search: string; pathname: string; hostname: string };
  document?: { referrer: string };
  sessionStorage?: { getItem(key: string): string | null; setItem(key: string, value: string): void };
  window?: { gtag?: (...args: unknown[]) => void };
};
const browser = globalThis as Browser;

function visit(search: string, pathname: string, referrer = "") {
  browser.location = { search, pathname, hostname: "1800cashforcars.com.au" };
  browser.document = { referrer };
}

function memoryStorage() {
  const values = new Map<string, string>();
  browser.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
  };
}

afterEach(() => {
  delete browser.location;
  delete browser.document;
  delete browser.sessionStorage;
  delete browser.window;
});

describe("where a quote came from", () => {
  it("reads the ad click ID, campaign tags, landing page and outside referrer from a page view", () => {
    const source = adSourceFromVisit(
      "?gclid=Cj0KCQtest&utm_source=google&utm_medium=cpc&utm_campaign=brisbane&other=1",
      "/cash-for-cars",
      "https://www.google.com/search?q=cash+for+cars",
      "1800cashforcars.com.au",
    );
    assert.deepEqual(source, {
      gclid: "Cj0KCQtest",
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "brisbane",
      landing: "/cash-for-cars",
      referrer: "www.google.com",
    });
    assert.equal(hasAdTags(source), true);
  });

  it("does not count our own pages as a referrer, and keeps only the referrer's host", () => {
    const own = adSourceFromVisit("", "/quote", "https://1800cashforcars.com.au/", "1800cashforcars.com.au");
    assert.deepEqual(own, { landing: "/quote" });
    assert.equal(hasAdTags(own), false);
    assert.deepEqual(adSourceFromVisit("", "/", "https://chatgpt.com/c/abc?x=1", "1800cashforcars.com.au"), {
      landing: "/",
      referrer: "chatgpt.com",
    });
    assert.deepEqual(adSourceFromVisit("", "/", "not a url", "1800cashforcars.com.au"), { landing: "/" });
  });

  it("keeps only known keys as short printable text", () => {
    assert.deepEqual(
      cleanAdSource({ utm_source: "  google\n", utm_campaign: "x".repeat(500), landing: "javascript:1", referrer: "bad host!", gclid: 42, extra: "no" }),
      { utm_source: "google", utm_campaign: "x".repeat(200) },
    );
    assert.equal(cleanAdSource({}), null);
    assert.equal(cleanAdSource(null), null);
    assert.equal(cleanAdSource(["gclid"]), null);
    assert.equal(cleanAdSource("gclid"), null);
  });

  it("treats an unreadable or oversized form value as no source", () => {
    assert.equal(parseAdSource(""), null);
    assert.equal(parseAdSource("{oops"), null);
    assert.equal(parseAdSource(JSON.stringify({ utm_source: "x".repeat(5000) })), null);
    assert.deepEqual(parseAdSource('{"utm_source":"chatgpt"}'), { utm_source: "chatgpt" });
  });

  it("describes the source in one line for the lead email", () => {
    assert.equal(describeAdSource(null), "");
    assert.equal(describeAdSource({ gbraid: "abc", landing: "/" }), "Google Ads · landed on /");
    assert.equal(
      describeAdSource({ utm_source: "chatgpt", utm_medium: "paid", utm_campaign: "spring", utm_term: "scrap car", utm_content: "ad-2", landing: "/scrap-car-removal" }),
      "chatgpt / paid · campaign spring · keyword scrap car · ad ad-2 · landed on /scrap-car-removal",
    );
    assert.equal(describeAdSource({ referrer: "www.google.com", landing: "/" }), "Link from www.google.com · landed on /");
    assert.equal(describeAdSource({ landing: "/locations/logan" }), "Direct visit · landed on /locations/logan");
  });

  it("keeps the first page view of a visit, unless a later one arrives from an ad", () => {
    memoryStorage();
    assert.equal(storedAdSource(), "");

    visit("", "/locations/logan", "https://www.google.com/");
    rememberAdSource();
    assert.deepEqual(JSON.parse(storedAdSource()), { landing: "/locations/logan", referrer: "www.google.com" });

    visit("", "/quote", "https://1800cashforcars.com.au/locations/logan");
    rememberAdSource();
    assert.deepEqual(JSON.parse(storedAdSource()), { landing: "/locations/logan", referrer: "www.google.com" });

    visit("?gclid=abc123", "/", "");
    rememberAdSource();
    assert.deepEqual(JSON.parse(storedAdSource()), { gclid: "abc123", landing: "/" });
  });

  it("does nothing when the browser blocks storage", () => {
    visit("?gclid=abc123", "/");
    browser.sessionStorage = {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    };
    assert.doesNotThrow(() => rememberAdSource());
    assert.equal(storedAdSource(), "");
  });
});

describe("phone tap conversion", () => {
  it("sends nothing until a Google Ads conversion is set", () => {
    const sent: unknown[][] = [];
    browser.window = { gtag: (...args) => void sent.push(args) };
    assert.equal(GOOGLE_ADS_CALL_CONVERSION, "");
    assert.equal(reportCallTap(), false);
    assert.equal(sent.length, 0);
  });

  it("reports the tap to Google Ads once a conversion is set", () => {
    const sent: unknown[][] = [];
    browser.window = { gtag: (...args) => void sent.push(args) };
    assert.equal(reportCallTap("AW-11027669589/abcDEF"), true);
    assert.deepEqual(sent, [["event", "conversion", { send_to: "AW-11027669589/abcDEF" }]]);
    delete browser.window.gtag;
    assert.equal(reportCallTap("AW-11027669589/abcDEF"), false);
  });
});
