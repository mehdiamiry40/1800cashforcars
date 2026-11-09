import assert from "node:assert/strict";
import { test } from "node:test";
import { MESSAGES, leadSubject, leadText, validateQuote } from "../src/lib/quote";
import { createRateLimiter } from "../src/lib/rate-limit";
import { search, renderSearchMain } from "../src/lib/search";
import { sitemapIndex, urlSet } from "../src/lib/sitemap";

const valid = {
  Name: "Sam Lee",
  "your-email": "sam@example.com",
  phone: "0400 000 000",
  suburb: "Rocklea",
  "make-model": "Toyota Corolla",
  price: "$2,000",
  description: "2009, runs, no rego",
};

test("a complete quote passes and is trimmed", () => {
  const { quote, invalid } = validateQuote({ ...valid, Name: "  Sam Lee  " });
  assert.deepEqual(invalid, []);
  assert.equal(quote.Name, "Sam Lee");
  assert.equal(leadSubject(quote), "New quote request: Toyota Corolla (Rocklea)");
  assert.match(leadText(quote, "https://www.apluscarremoval.com.au/faq/"), /Make & Model: Toyota Corolla\n/);
});

test("every field is required, as on the WordPress form", () => {
  const { invalid } = validateQuote({});
  assert.equal(invalid.length, 7);
  assert.ok(invalid.every((field) => field.message === MESSAGES.required));
});

test("email must look like an email and long input is rejected", () => {
  assert.deepEqual(validateQuote({ ...valid, "your-email": "sam@example" }).invalid, [
    { field: "your-email", message: MESSAGES.email },
  ]);
  assert.deepEqual(validateQuote({ ...valid, phone: "1".repeat(401) }).invalid, [
    { field: "phone", message: MESSAGES.tooLong },
  ]);
  assert.deepEqual(validateQuote({ ...valid, description: 42 }).invalid, [
    { field: "description", message: MESSAGES.required },
  ]);
});

test("rate limiter allows a burst then blocks until the window passes", () => {
  const allow = createRateLimiter(2, 1000);
  assert.ok(allow("a", 0));
  assert.ok(allow("a", 10));
  assert.ok(!allow("a", 20));
  assert.ok(allow("b", 20));
  assert.ok(allow("a", 1011));
});

test("search finds posts and pages and escapes the query", () => {
  assert.ok(search("electric").some((entry) => entry.path.includes("electric-vehicle")));
  assert.ok(search("caboolture").some((entry) => entry.path === "/cash-for-cars-caboolture/"));
  assert.deepEqual(search("zzzzqqq"), []);
  assert.deepEqual(search("   "), []);
  const html = renderSearchMain('<script>alert("x")</script>');
  assert.ok(!html.includes("<script>alert"));
  assert.match(html, /Nothing Found/);
});

test("sitemaps list every page and post at the www origin", async () => {
  const pages = await urlSet("page").text();
  const posts = await urlSet("post").text();
  assert.equal(pages.match(/<url>/g)?.length, 27);
  assert.equal(posts.match(/<url>/g)?.length, 14);
  assert.match(pages, /<loc>https:\/\/www\.apluscarremoval\.com\.au\/<\/loc>/);
  const index = await sitemapIndex().text();
  assert.match(index, /post-sitemap\.xml/);
  assert.match(index, /page-sitemap\.xml/);
});
