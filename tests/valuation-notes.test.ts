import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sitemap from "../src/app/sitemap";
import { areas, site } from "../src/lib/site";
import { AUTOVAL_PATH, valuationNotes } from "../src/lib/valuation-notes";

const notes: Record<string, { text: string; links: { phrase: string; href: string }[] }> = valuationNotes;

describe("location pages link to AutoVal", () => {
  it("has a note for every location URL in the sitemap", () => {
    const paths = sitemap()
      .map((item) => item.url.slice(site.url.length))
      .filter((path) => path === "/locations" || path.startsWith("/locations/"));
    assert.ok(paths.includes("/locations"));
    assert.ok(paths.includes("/locations/toowong"));
    for (const path of paths) assert.ok(notes[path], `${path} has no AutoVal note`);
  });

  it("links one phrase in each note to /autoval", () => {
    for (const [path, note] of Object.entries(notes)) {
      assert.equal(note.links.length, 1, path);
      assert.equal(note.links[0].href, AUTOVAL_PATH, path);
      assert.ok(note.text.includes(note.links[0].phrase), `${path}: the linked phrase is not in the text`);
    }
  });

  it("uses a different anchor on every page", () => {
    const anchors = Object.values(notes).map((note) => note.links[0].phrase.toLowerCase());
    assert.equal(new Set(anchors).size, anchors.length);
  });

  it("says on every page that the estimate is not the cash offer", () => {
    for (const [path, note] of Object.entries(notes)) assert.match(note.text, /not our cash offer/, path);
  });

  it("puts the note in the copy of each templated area", () => {
    const templated = areas.filter((area) => area.local?.sections);
    assert.ok(templated.length > 0);
    for (const area of templated) {
      const note = notes[`/locations/${area.slug}`];
      const paragraphs = area.local?.sections?.flatMap((section) => section.paragraphs) ?? [];
      assert.ok(paragraphs.some((paragraph) => paragraph.text === note.text), `${area.name} copy has no AutoVal note`);
    }
  });
});
