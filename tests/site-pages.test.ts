import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { createElement } from "react";
import { AutoValuer } from "../src/app/autoval/AutoValuer";
import { GET as llmsTxt } from "../src/app/llms.txt/route";
import { Footer } from "../src/components/Footer";
import { Header } from "../src/components/Header";
import { nav } from "../src/lib/navigation";
import { areas, reviews, site } from "../src/lib/site";
import { htmlOf, jsonLdIn, linksIn, metadataOf, render, routes, text } from "./helpers/site-pages";

// These tests render each page the way the server does and read the result. They hold the findings of the
// 26 November 2026 audits in place, so a later edit cannot quietly undo one.

const header = render(createElement(Header));
const footer = render(createElement(Footer));
// The phone menu is a <dialog> after the header bar. Everything before it is the bar a desktop visitor sees.
const headerBar = header.slice(0, header.indexOf("<dialog"));
const phoneMenu = header.slice(header.indexOf("<dialog"));

const tidy = (value: string) => value.replace(/\s+/g, " ").trim();
const headings = (html: string, level: number) => [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>(.*?)</h${level}>`, "g"))].map((m) => tidy(text(m[1])));
const css = readFileSync("src/app/globals.css", "utf8");

async function everyPage(check: (path: string, html: string) => void | Promise<void>) {
  for (const route of routes) await check(route.path, await htmlOf(route.path));
}

describe("titles and descriptions", () => {
  // Search results cut a title at about 60 characters and a description at about 155.
  it("keeps every page's title to 60 characters, with the site name", async () => {
    for (const route of routes) {
      const { title } = await metadataOf(route.path);
      const full = typeof title === "string" ? `${title} | ${site.name}` : title && "absolute" in title ? title.absolute : "";
      assert.ok(full, `${route.path} has no title`);
      assert.ok(full.length <= 60, `${route.path}: "${full}" is ${full.length} characters`);
    }
  });

  it("gives every page a title no other page has", async () => {
    const seen = new Map<string, string>();
    for (const route of routes) {
      const { title } = await metadataOf(route.path);
      const key = JSON.stringify(title);
      assert.ok(!seen.has(key), `${route.path} and ${seen.get(key)} share the title ${key}`);
      seen.set(key, route.path);
    }
  });

  it("keeps every page's description to 155 characters", async () => {
    for (const route of routes) {
      const description = (await metadataOf(route.path)).description ?? "";
      assert.ok(description.length > 0, `${route.path} has no description`);
      assert.ok(description.length <= 155, `${route.path}: the description is ${description.length} characters`);
    }
  });

  it("has exactly one h1 on every page", async () => {
    await everyPage((path, html) => {
      assert.equal(headings(html, 1).length, 1, `${path} has ${headings(html, 1).length} h1 headings`);
    });
  });
});

// "cash for cars brisbane" was ranking on /cash-for-cars, because the site's own links called that page
// "Cash for cars". The homepage owns the phrase. /cash-for-cars is the page about how the sale works.
describe("the homepage owns 'cash for cars Brisbane'", () => {
  const headTerm = /cash for cars\s+(in\s+)?brisbane/i;

  it("carries the phrase in its title, h1, description, FAQ heading and schema", async () => {
    const meta = await metadataOf("/");
    const html = await htmlOf("/");
    assert.deepEqual(meta.title, { absolute: "Cash for Cars Brisbane | 1800-CASH-FOR-CARS" });
    assert.deepEqual(headings(html, 1), ["Cash for cars Brisbane"]);
    assert.match(meta.description ?? "", /^Cash for cars Brisbane/);
    assert.ok(headings(html, 2).includes("Cash for cars Brisbane FAQs"));
    assert.ok(headings(html, 2).some((heading) => headTerm.test(heading) && heading !== "Cash for cars Brisbane FAQs"), "no h2 over the main copy carries the phrase");
    const service = jsonLdIn(html).find((node) => node["@type"] === "Service");
    assert.equal(service?.name, "Cash for Cars Brisbane");
    assert.equal(service?.url, `${site.url}/`);
  });

  it("leaves the phrase out of the title and h1 of /cash-for-cars", async () => {
    const meta = await metadataOf("/cash-for-cars");
    const html = await htmlOf("/cash-for-cars");
    assert.equal(meta.title, "Sell Your Car for Cash in Brisbane");
    assert.deepEqual(headings(html, 1), ["Sell your car for cash in Brisbane"]);
    assert.doesNotMatch(String(meta.title), headTerm);
  });

  it("points every link that reads 'cash for cars Brisbane' at the homepage", async () => {
    const check = (where: string, html: string) => {
      for (const link of linksIn(html)) {
        if (headTerm.test(link.label) && link.label.length < 60) assert.equal(link.href, "/", `${where}: "${link.label}" goes to ${link.href}`);
      }
    };
    check("header", header);
    check("footer", footer);
    await everyPage(check);
  });

  it("never calls /cash-for-cars 'cash for cars' in a link", async () => {
    const check = (where: string, html: string) => {
      for (const link of linksIn(html)) {
        if (link.href === "/cash-for-cars") assert.doesNotMatch(link.label, /cash for cars/i, `${where}: a link to /cash-for-cars reads "${link.label}"`);
      }
    };
    check("header", header);
    check("footer", footer);
    await everyPage(check);
    assert.equal(nav.find((item) => item.href === "/cash-for-cars")?.label, "Sell your car");
  });

  it("links to the homepage as 'Cash for cars Brisbane' from the footer of every page", () => {
    assert.ok(linksIn(footer).some((link) => link.href === "/" && link.label === "Cash for cars Brisbane"));
  });

  // The tests above check /cash-for-cars. Since the 28 November 2026 ownership pass every other page is held to the same rule.
  it("leaves the phrase out of every other page's title, h1, description and schema name", async () => {
    for (const route of routes.filter((r) => r.path !== "/")) {
      const meta = await metadataOf(route.path);
      const html = await htmlOf(route.path);
      assert.doesNotMatch(JSON.stringify(meta.title), headTerm, `${route.path}: the title carries the homepage's phrase`);
      assert.doesNotMatch(meta.description ?? "", headTerm, `${route.path}: the description carries the homepage's phrase`);
      for (const h1 of headings(html, 1)) assert.doesNotMatch(h1, headTerm, `${route.path}: the h1 carries the homepage's phrase`);
      for (const node of jsonLdIn(html).filter((n) => n["@type"] === "Service" || n["@type"] === "WebPage")) {
        assert.doesNotMatch(String(node.name), headTerm, `${route.path}: its ${node["@type"]} schema is named "${node.name}"`);
      }
    }
  });

  it("gives the phrase to no menu link but one to the homepage", () => {
    for (const item of nav) {
      if (/cash for cars/i.test(item.label)) assert.equal(item.href, "/", `the menu calls ${item.href} "${item.label}"`);
    }
  });

  it("lists only the homepage under the phrase in llms.txt", async () => {
    const entries = [...(await llmsTxt().text()).matchAll(/^- \[([^\]]+)\]\(([^)]+)\)/gm)].map((m) => ({ label: m[1], url: m[2] }));
    assert.ok(entries.length >= 20, `only ${entries.length} pages are listed in llms.txt`);
    assert.deepEqual(entries.filter((entry) => headTerm.test(entry.label)), [{ label: "Cash for cars Brisbane", url: `${site.url}/` }]);
    assert.equal(entries.find((entry) => entry.url === `${site.url}/cash-for-cars`)?.label, "Sell your car for cash in Brisbane");
  });
});

// "Car removal Brisbane" and "car removals Brisbane" are searches the parent company's site answers, on the
// A Plus Car Removal homepage. This site's two removal pages are about free car removal, and are named that
// way wherever the site names them. Until 28 November 2026 the footer of every page, the related links, the
// areas hub, the about page and the Brisbane page's own schema called it "Car removal Brisbane".
describe("the removal pages keep to 'free car removal'", () => {
  const bareTerm = /^car removals?\s+(in\s+)?brisbane\b/i;
  const bareLabel = /^car removals?\s+(in\s+)?brisbane$/i;
  const serviceOf = (html: string) => jsonLdIn(html).find((node) => node["@type"] === "Service");

  it("leads the title, h1 and schema name of both pages with 'Free car removal'", async () => {
    const brisbane = await htmlOf("/car-removal-brisbane");
    assert.equal((await metadataOf("/car-removal-brisbane")).title, "Free Car Removal Brisbane, Cash Paid");
    assert.deepEqual(headings(brisbane, 1), ["Free car removal in Brisbane"]);
    assert.equal(serviceOf(brisbane)?.name, "Free car removal in Brisbane");
    assert.ok(headings(brisbane, 2).includes("Free car removal Brisbane FAQs"));

    const region = await htmlOf("/car-removals");
    assert.equal((await metadataOf("/car-removals")).title, "Free Car Removal Across SEQ");
    assert.deepEqual(headings(region, 1), ["Free car removal across South East Queensland"]);
    assert.equal(serviceOf(region)?.name, "Free car removal across South East Queensland");
  });

  it("opens no page's title, heading or schema name with the bare phrase", async () => {
    for (const route of routes) {
      const { title } = await metadataOf(route.path);
      const html = await htmlOf(route.path);
      const shown = typeof title === "string" ? title : title && "absolute" in title ? title.absolute : "";
      assert.doesNotMatch(shown, bareTerm, `${route.path}: the title opens with "${shown}"`);
      for (const level of [1, 2]) {
        for (const heading of headings(html, level)) assert.doesNotMatch(heading, bareTerm, `${route.path}: an h${level} reads "${heading}"`);
      }
      const service = serviceOf(html);
      if (service) assert.doesNotMatch(String(service.name), bareTerm, `${route.path}: its Service schema is named "${service.name}"`);
    }
  });

  it("never names a page with the bare phrase in a link", async () => {
    const check = (where: string, html: string) => {
      for (const link of linksIn(html)) assert.doesNotMatch(link.label, bareLabel, `${where}: a link to ${link.href} reads "${link.label}"`);
    };
    check("header", header);
    check("footer", footer);
    await everyPage(check);
    const listed = [...(await llmsTxt().text()).matchAll(/^- \[([^\]]+)\]/gm)].map((m) => m[1]);
    for (const label of listed) assert.doesNotMatch(label, bareLabel, `llms.txt lists a page as "${label}"`);
  });

  it("links to the Brisbane page as 'Free car removal Brisbane' from the footer, the related links, the areas hub and the about page", async () => {
    const named = (html: string) => linksIn(html).some((link) => link.href === "/car-removal-brisbane" && link.label === "Free car removal Brisbane");
    assert.ok(named(footer), "the footer does not name the Brisbane removal page");
    for (const path of ["/cash-for-cars", "/car-removals", "/locations", "/about"]) assert.ok(named(await htmlOf(path)), `${path} does not name the Brisbane removal page`);
    // The short menu label is the topic, not the search.
    assert.equal(nav.find((item) => item.href === "/car-removal-brisbane")?.label, "Car removal");
  });
});

describe("breadcrumbs", () => {
  const withTrail = [
    "/locations/logan",
    "/locations/ipswich",
    "/locations/toowong",
    "/locations/gold-coast",
    "/locations/sunshine-coast",
    "/locations/tweed-heads",
    "/car-wreckers-gold-coast",
    "/car-removal-no-keys-no-wheels",
    "/about",
    "/contact-us",
    "/quote",
    "/autoval",
  ];

  // Search Console listed each breadcrumb as "Unnamed item" while the list had no name of its own.
  it("names every breadcrumb list, from the names of its own items", async () => {
    let lists = 0;
    await everyPage((path, html) => {
      for (const list of jsonLdIn(html).filter((node) => node["@type"] === "BreadcrumbList")) {
        lists += 1;
        const items = list.itemListElement as { name: string }[];
        assert.equal(list.name, items.map((item) => item.name).join(" › "), `${path}: the breadcrumb list has no name, or the wrong one`);
      }
    });
    assert.ok(lists >= 22, `only ${lists} pages have a breadcrumb list`);
  });

  // Eleven pages sent breadcrumb markup with no trail on the page, and /autoval's trail was hidden.
  it("shows on the page the trail its markup describes", async () => {
    await everyPage((path, html) => {
      const list = jsonLdIn(html).find((node) => node["@type"] === "BreadcrumbList");
      if (!list) return;
      const names = (list.itemListElement as { name: string }[]).map((item) => item.name);
      const trail = html.match(/<nav aria-label="Breadcrumb"([^>]*)>(.*?)<\/nav>/);
      assert.ok(trail, `${path} has breadcrumb markup and no trail on the page`);
      assert.doesNotMatch(trail[1], /sr-only|hidden/, `${path} hides its trail`);
      assert.deepEqual(text(trail[2]).split("›").map(tidy), names, `${path}: the trail on the page is not the trail in the markup`);
    });
  });

  it("has a trail on each page the audit named", async () => {
    for (const path of withTrail) assert.match(await htmlOf(path), /<nav aria-label="Breadcrumb"/, `${path} has no trail`);
  });

  it("links every step of a trail but the last", async () => {
    const html = await htmlOf("/locations/toowong");
    const trail = html.match(/<nav aria-label="Breadcrumb"[^>]*>(.*?)<\/nav>/)?.[1] ?? "";
    assert.deepEqual(
      linksIn(trail),
      [
        { href: "/", label: "Home" },
        { href: "/locations", label: "Areas" },
        { href: "/car-removal-brisbane", label: "Brisbane" },
      ],
    );
    assert.match(trail, /<span aria-current="page"[^>]*>Toowong<\/span>/);
  });
});

// The same question was asked on more than one of these pages. Each question now belongs to one page.
describe("FAQ questions on the head-term pages", () => {
  it("asks each question on one page only", async () => {
    const asked = new Map<string, string>();
    for (const path of ["/", "/cash-for-cars", "/scrap-car-removal", "/scrap-car-prices-brisbane"]) {
      const faq = jsonLdIn(await htmlOf(path)).flatMap((node) => [node, ...((node["@graph"] as Record<string, unknown>[] | undefined) ?? [])]).find((node) => node["@type"] === "FAQPage");
      assert.ok(faq, `${path} has no FAQ markup`);
      for (const question of faq.mainEntity as { name: string }[]) {
        const key = question.name.toLowerCase();
        assert.ok(!asked.has(key), `"${question.name}" is asked on ${asked.get(key)} and on ${path}`);
        asked.set(key, path);
      }
    }
    assert.equal(asked.get("do you pay cash for scrap cars in brisbane?"), "/scrap-car-removal");
  });

  it("still links the homepage and the price guide to the page that owns the scrap question", async () => {
    for (const path of ["/", "/scrap-car-prices-brisbane"]) {
      assert.ok(linksIn(await htmlOf(path)).some((link) => link.href === "/scrap-car-removal"), `${path} no longer links to /scrap-car-removal`);
    }
  });
});

describe("reviews", () => {
  const contractHeading = '<h2 class="[^"]*">Get a free quote <span class="quote-instant">\\(Instant\\)</span></h2>';

  // The band was headed "See what our customers say" and held no customer's words.
  it("does not promise customer words while there are none to show", async () => {
    const html = await htmlOf("/");
    if (reviews.length > 0) return;
    await everyPage((path, page) => assert.doesNotMatch(text(page), /See what our customers say/, path));
    assert.ok(headings(html, 2).includes("Our Google reviews"));
    assert.doesNotMatch(html, /<blockquote/);
  });

  it("shows the reviews line under the heading of every quote card that carries the contract heading", async () => {
    const line = `${site.googleRating.count} reviews on Google`;
    let cards = 0;
    await everyPage((path, html) => {
      for (const match of html.matchAll(new RegExp(`${contractHeading}(.{0,900})`, "g"))) {
        cards += 1;
        const next = match[1];
        assert.match(next, /^<(a|p)\b[^>]*class="google-reviews-signal /, `${path}: the reviews line is not straight after the quote heading`);
        assert.ok(text(next).includes(line), `${path}: the reviews line does not read "${line}"`);
      }
    });
    assert.ok(cards >= 19, `only ${cards} quote cards were found`);
  });
});

// The hub printed every suburb of every area, and outranked the Logan and Ipswich pages for their own searches.
describe("/locations hub", () => {
  it("names a few suburbs for each area and links to the area page for the rest", async () => {
    const html = await htmlOf("/locations");
    const words = text(html);
    // One "Suburbs include: ..." sentence for each area, in the order the areas are listed.
    const samples = [...words.matchAll(/Suburbs include:\s*([^.]*)\./g)].map((m) => m[1].split(",").map(tidy));
    assert.equal(samples.length, areas.length);
    areas.forEach((area, index) => {
      assert.ok(samples[index].length <= 6, `the hub lists ${samples[index].length} ${area.name} suburbs`);
      for (const suburb of samples[index]) assert.ok(area.suburbs.includes(suburb), `${suburb} is not a ${area.name} suburb`);
      if (area.href || area.suburbs.length <= 6) return;
      assert.ok(!words.includes(area.suburbs.join(", ")), `the hub still prints every ${area.name} suburb`);
      assert.ok(linksIn(html).some((link) => link.href === `/locations/${area.slug}` && link.label === `Cash for cars ${area.name}`), `no "Cash for cars ${area.name}" link`);
      assert.ok(words.includes(`The full list is on the ${area.name} page`), `the hub does not say where ${area.name}'s full list is`);
    });
  });

  it("leaves the full list on each area page", async () => {
    for (const area of areas.filter((a) => !a.href)) {
      const words = text(await htmlOf(`/locations/${area.slug}`));
      for (const suburb of area.suburbs) assert.ok(words.includes(suburb), `/locations/${area.slug} no longer lists ${suburb}`);
    }
  });
});

describe("ways to a quote", () => {
  const quoteButton = (html: string, label: string) => linksIn(html).some((link) => link.href === "/quote" && link.label === label);

  // A desktop visitor had no quote button once the hero had scrolled away. Phones have the bottom bar.
  it("puts a 'Get a free quote' button in the desktop header bar", () => {
    assert.ok(quoteButton(headerBar, "Get a free quote"), "the header bar has no quote button");
    assert.match(headerBar, /<a[^>]*class="[^"]*btn-brand[^"]*"[^>]*href="\/quote"|<a[^>]*href="\/quote"[^>]*class="[^"]*btn-brand/);
  });

  it("ends the homepage with a quote button and the phone number, after the FAQ", async () => {
    const html = await htmlOf("/");
    const afterFaq = html.slice(html.indexOf('id="faq"'));
    assert.ok(html.includes('id="faq"') && quoteButton(afterFaq, "Get a free quote"), "no quote button after the homepage FAQ");
    assert.ok(linksIn(afterFaq).some((link) => link.href === site.phoneHref), "no phone link after the homepage FAQ");
  });

  // AutoVal was reachable from the footer only.
  it("lists 'Free car valuation' in the phone menu, and leaves the desktop menu as it was", () => {
    assert.ok(linksIn(phoneMenu).some((link) => link.href === "/autoval" && link.label === "Free car valuation"));
    assert.ok(!linksIn(headerBar).some((link) => link.href === "/autoval"), "the desktop header now links to /autoval");
    assert.deepEqual(
      linksIn(headerBar).filter((link) => nav.some((item) => item.href === link.href)).map((link) => link.label),
      nav.map((item) => item.label),
    );
  });

  // On a phone the only form on this page is at the foot of it, and there was no button before it.
  it("gives the no-keys page a price button and a call button under its intro", async () => {
    const html = await htmlOf("/car-removal-no-keys-no-wheels");
    const beforeFirstH2 = html.slice(0, html.indexOf("<h2"));
    assert.ok(quoteButton(beforeFirstH2, "Get your price"), "no 'Get your price' button under the intro");
    assert.ok(linksIn(beforeFirstH2).some((link) => link.href === site.phoneHref && link.label === `Call ${site.phoneDisplay}`), "no call button under the intro");
  });

  // On /cash-for-cars the form started 820px down a 1280 screen. It now sits beside the opening copy.
  it("puts the quote card in the opening section of /cash-for-cars, as the location pages do", async () => {
    const html = await htmlOf("/cash-for-cars");
    const hero = html.match(/<section aria-label="Cash for cars and free quote"[^>]*>(.*?)<\/section>/)?.[1] ?? "";
    assert.ok(hero.includes("<h1"), "/cash-for-cars does not open with the location-page hero");
    assert.ok(hero.includes("data-quote") && hero.includes("<form"), "the quote form is not in the opening section");
    assert.ok(quoteButton(hero, "Get a free quote") && linksIn(hero).some((link) => link.href === site.phoneHref), "the opening section lost its quote and call buttons");
    // Links in the opening copy must be readable on its white background.
    assert.doesNotMatch(hero, /text-white underline/);
  });
});

describe("AutoVal tool layout", () => {
  const tool = render(createElement(AutoValuer, { regoLookup: false }));
  const step2 = tool.slice(tool.indexOf("Tell us about it"));
  const firstButton = step2.indexOf('type="submit"');
  const optionalHeading = step2.indexOf("More detail (optional)");
  const labels = (html: string) => [...html.matchAll(/<span class="field-label">(.*?)<\/span>/g)].map((m) => tidy(text(m[1])));

  // The button was two screens down, after eleven optional fields.
  it("asks for the four required fields first, then shows the button", () => {
    assert.ok(firstButton > 0, "Step 2 has no submit button");
    assert.deepEqual(labels(step2.slice(0, firstButton)), ["Make *", "Model *", "Year *", "Kilometres *"]);
    assert.equal([...step2.slice(0, firstButton).matchAll(/<input[^>]*\srequired=""/g)].length, 4);
  });

  it("puts everything optional under 'More detail (optional)', with a second button at the end", () => {
    assert.ok(optionalHeading > firstButton, "'More detail (optional)' is missing, or is above the first button");
    const optional = step2.slice(optionalHeading);
    assert.deepEqual(labels(optional).slice(0, 8), ["Variant", "Body", "Transmission", "Fuel", "Engine", "State", "Colour", "Owners"]);
    assert.doesNotMatch(optional, /\srequired=""/, "a field under 'More detail (optional)' is required");
    assert.equal([...step2.matchAll(/type="submit"/g)].length, 2);
    assert.ok(optional.lastIndexOf('type="submit"') > optional.indexOf("Known issues"), "the second button is not at the end of the form");
  });

  it("still asks for everything it asked for before", () => {
    for (const label of ["Condition", "Service history", "Extras and upgrades", "Known issues", "been in an accident or had panel repairs"]) {
      assert.ok(text(step2).includes(label), `"${label}" is gone from the tool`);
    }
    for (const condition of ["Excellent", "Good", "Fair", "Poor"]) assert.ok(text(step2).includes(condition));
  });
});

// Small things a thumb has to hit, and the bars that take room on a phone.
describe("phone layout", () => {
  const source = (file: string) => readFileSync(file, "utf8");

  it("gives the remaining small links and the checkbox a 44px target", () => {
    assert.match(source("src/components/QuoteForm.tsx"), /<Link href="\/privacy" className="[^"]*\bmin-h-11\b[^"]*">Privacy<\/Link>/);
    assert.match(source("src/app/contact-us/page.tsx"), /<a href=\{`mailto:\$\{site\.email\}`\} className="[^"]*\bmin-h-11\b/);
    assert.match(source("src/app/locations/[slug]/page.tsx"), /<summary className="[^"]*\bmin-h-11\b[^"]*">View covered suburbs/);
    // A suburb link inside a sentence: padding makes it 17px + 28px tall without changing the line.
    assert.match(source("src/components/Blocks.tsx"), /<Link href=\{href\} className="py-3\.5 /);
    // The accident checkbox covers its 44px row.
    const tool = render(createElement(AutoValuer, { regoLookup: false }));
    assert.match(tool, /<label class="relative [^"]*\bmin-h-11\b[^"]*"><input type="checkbox" class="peer absolute inset-0 h-full w-full /);
    assert.match(footer, /<a href="mailto:[^"]*" class="[^"]*\bmin-h-11\b/);
    assert.match(footer, /<a class="[^"]*\bmin-h-11\b[^"]*" href="\/"|<a href="\/" class="[^"]*\bmin-h-11\b/);
  });

  it("stops the reviews link's tap area short of the Make, Model and Year row", () => {
    const rule = css.match(/\.hero-quote \.google-reviews-signal \{[^}]*margin-top: -16px;[^}]*\}/)?.[0] ?? "";
    assert.match(rule, /margin-bottom: 0;/);
    assert.match(rule, /padding-top: 8px;/);
  });

  it("hides the bottom bar while an AutoVal field has focus, as it does for the quote form", () => {
    assert.match(css, /body:has\(\.quote-form:focus-within\) \.mobile-actions,\s*body:has\(\.autoval-tool :is\(.*?\):focus\) \.mobile-actions \{\s*visibility: hidden;/);
    assert.match(render(createElement(AutoValuer, { regoLookup: false })), /class="autoval-tool /);
  });

  // The stylesheet reaches these by class name. If a name changes on one side only, the rule stops working.
  it("keeps the class names the phone rules depend on", async () => {
    const home = await htmlOf("/");
    assert.match(home, /class="hero-section hero-tight /);
    assert.match(home, /class="hero-lead /);
    for (const name of ["hero-tight", "hero-lead", "quote-head", "autoval-tool"]) assert.ok(css.includes(`.${name}`), `globals.css has no rule for .${name}`);
    assert.match(await htmlOf("/quote"), /<h2 class="h-sub quote-head">/);
  });

  // An empty send printed every message twice: under each field, and again in the box above the button.
  it("shows one line in the quote form's error box and keeps the list for a screen reader", () => {
    const form = source("src/components/QuoteForm.tsx");
    const box = form.slice(form.indexOf('<div role="alert"'), form.indexOf("</div>", form.indexOf('<div role="alert"')));
    assert.match(box, /<p>Check the highlighted fields\.<\/p>\s*<ul className="sr-only">/);
    assert.match(box, /Object\.entries\(errors\)\.map/);
  });
});
