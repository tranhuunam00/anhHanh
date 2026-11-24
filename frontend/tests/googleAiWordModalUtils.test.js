import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { cleanGoogleAiWord, shouldShowGoogleAiModal } from "../src/utils/googleAiWordModalUtils.js";

describe("cleanGoogleAiWord", () => {
  test("returns plain word unchanged (happy path)", () => {
    assert.equal(cleanGoogleAiWord("burial ground"), "burial ground");
  });
  test("trims whitespace and edge punctuation", () => {
    assert.equal(cleanGoogleAiWord('  "excavated," '), "excavated");
    assert.equal(cleanGoogleAiWord("’curiosity.’"), "curiosity");
  });
  test("keeps inner punctuation", () => {
    assert.equal(cleanGoogleAiWord("well-known"), "well-known");
    assert.equal(cleanGoogleAiWord("Hawkins'"), "Hawkins");
  });
  test("empty / whitespace / punctuation-only become empty string", () => {
    assert.equal(cleanGoogleAiWord(""), "");
    assert.equal(cleanGoogleAiWord("   "), "");
    assert.equal(cleanGoogleAiWord("?!..."), "");
  });
  test("non-string inputs return empty string", () => {
    assert.equal(cleanGoogleAiWord(null), "");
    assert.equal(cleanGoogleAiWord(undefined), "");
    assert.equal(cleanGoogleAiWord(42), "");
    assert.equal(cleanGoogleAiWord({ word: "x" }), "");
  });
});

describe("shouldShowGoogleAiModal", () => {
  test("open with a word shows the modal", () => {
    assert.equal(shouldShowGoogleAiModal(true, "monument"), true);
  });
  test("closed never shows, even with a word (regression: modal stuck open)", () => {
    assert.equal(shouldShowGoogleAiModal(false, "monument"), false);
  });
  test("open but no word does not show (regression: empty loading modal on tab load)", () => {
    assert.equal(shouldShowGoogleAiModal(true, null), false);
    assert.equal(shouldShowGoogleAiModal(true, ""), false);
    assert.equal(shouldShowGoogleAiModal(true, "  ,. "), false);
  });
  test("non-boolean truthy isOpen is not treated as open", () => {
    assert.equal(shouldShowGoogleAiModal("true", "word"), false);
    assert.equal(shouldShowGoogleAiModal(1, "word"), false);
    assert.equal(shouldShowGoogleAiModal(undefined, "word"), false);
  });
  test("returns a boolean", () => {
    assert.equal(typeof shouldShowGoogleAiModal(true, "a"), "boolean");
  });
});

import { buildGoogleSearchUrl, buildGoogleEmbedUrl, GOOGLE_QUERY_SUFFIX } from "../src/utils/googleAiWordModalUtils.js";

const decodeQ = (url) => new URL(url).searchParams.get("q");

describe("buildGoogleSearchUrl", () => {
  test("builds a normal Google search for the word + Vietnamese suffix (happy path)", () => {
    const url = buildGoogleSearchUrl("incredibly powerful");
    assert.ok(url.startsWith("https://www.google.com/search?q="));
    assert.equal(decodeQ(url), "incredibly powerful" + GOOGLE_QUERY_SUFFIX);
    assert.equal(new URL(url).searchParams.has("igu"), false);
  });
  test("cleans punctuation and encodes special characters", () => {
    assert.equal(decodeQ(buildGoogleSearchUrl(' "rock & roll?" ')), "rock & roll" + GOOGLE_QUERY_SUFFIX);
    assert.ok(!buildGoogleSearchUrl("a&b").includes("a&b"));
  });
  test("empty / bad input returns empty string", () => {
    for (const bad of ["", "   ", "?!", null, undefined, 5]) assert.equal(buildGoogleSearchUrl(bad), "");
  });
});

describe("buildGoogleEmbedUrl", () => {
  test("uses frame-embeddable igu=1 mode with Vietnamese UI by default", () => {
    const u = new URL(buildGoogleEmbedUrl("burial ground"));
    assert.equal(u.origin + u.pathname, "https://www.google.com/search");
    assert.equal(u.searchParams.get("igu"), "1");
    assert.equal(u.searchParams.get("hl"), "vi");
    assert.equal(u.searchParams.get("q"), "burial ground" + GOOGLE_QUERY_SUFFIX);
  });
  test("accepts valid language codes", () => {
    assert.equal(new URL(buildGoogleEmbedUrl("x", "en")).searchParams.get("hl"), "en");
    assert.equal(new URL(buildGoogleEmbedUrl("x", "zh-CN")).searchParams.get("hl"), "zh-CN");
  });
  test("invalid language codes fall back to vi (no parameter injection)", () => {
    for (const bad of ["", "english", "vi&igu=0", null, 3, "e"]) {
      const u = new URL(buildGoogleEmbedUrl("x", bad));
      assert.equal(u.searchParams.get("hl"), "vi");
      assert.equal(u.searchParams.getAll("igu").length, 1);
    }
  });
  test("empty / bad word returns empty string", () => {
    for (const bad of ["", "  ", "...", null, undefined, {}]) assert.equal(buildGoogleEmbedUrl(bad), "");
  });
});

import { normalizeOverviewKeyWords, MAX_OVERVIEW_KEY_WORDS } from "../src/utils/googleAiWordModalUtils.js";

describe("normalizeOverviewKeyWords", () => {
  test("keeps valid items with all six string fields (happy path)", () => {
    const out = normalizeOverviewKeyWords([
      { word: " reward ", pos: "noun", meaning: "phần thưởng", example_en: "A reward.", example_vi: "Một phần thưởng.", extra: 1 },
    ]);
    assert.deepEqual(out, [
      { word: "reward", pos: "noun", phonetic: "", meaning: "phần thưởng", example_en: "A reward.", example_vi: "Một phần thưởng." },
    ]);
  });
  test("non-string fields become empty strings; numbers are stringified", () => {
    const [kw] = normalizeOverviewKeyWords([{ word: 42, pos: null, meaning: { a: 1 }, phonetic: ["x"] }]);
    assert.deepEqual(kw, { word: "42", pos: "", phonetic: "", meaning: "", example_en: "", example_vi: "" });
  });
  test("skips non-objects, arrays, empty and duplicate (case-insensitive) words", () => {
    const out = normalizeOverviewKeyWords([null, "str", 3, ["a"], { word: "" }, { word: "  " }, { word: "Defined" }, { word: "defined" }]);
    assert.deepEqual(out.map((k) => k.word), ["Defined"]);
  });
  test("caps at MAX_OVERVIEW_KEY_WORDS", () => {
    const out = normalizeOverviewKeyWords(Array.from({ length: 9 }, (_, i) => ({ word: `w${i}` })));
    assert.equal(out.length, MAX_OVERVIEW_KEY_WORDS);
    assert.equal(out[3].word, "w3");
  });
  test("non-array input returns empty array", () => {
    for (const bad of [undefined, null, "", "reward", 5, { word: "x" }]) assert.deepEqual(normalizeOverviewKeyWords(bad), []);
  });
});

import {
  resolveGoogleLookupMode,
  GOOGLE_LOOKUP_MODE_GOOGLE,
  GOOGLE_LOOKUP_MODE_AI,
} from "../src/utils/googleAiWordModalUtils.js";

describe("resolveGoogleLookupMode", () => {
  test("defaults to real Google when nothing is passed (no API key call)", () => {
    assert.equal(resolveGoogleLookupMode(), GOOGLE_LOOKUP_MODE_GOOGLE);
    assert.equal(resolveGoogleLookupMode(undefined), "google");
  });
  test("false / null stay on Google", () => {
    assert.equal(resolveGoogleLookupMode(false), "google");
    assert.equal(resolveGoogleLookupMode(null), "google");
  });
  test("only an explicit true opts into the AI overview", () => {
    assert.equal(resolveGoogleLookupMode(true), GOOGLE_LOOKUP_MODE_AI);
    assert.equal(resolveGoogleLookupMode(true), "ai");
  });
  test("truthy non-boolean values do not enable AI (strict opt-in)", () => {
    assert.equal(resolveGoogleLookupMode("true"), "google");
    assert.equal(resolveGoogleLookupMode(1), "google");
    assert.equal(resolveGoogleLookupMode({}), "google");
    assert.equal(resolveGoogleLookupMode([]), "google");
  });
  test("always returns one of the two known mode strings", () => {
    for (const v of [true, false, null, undefined, 0, "", "ai", NaN]) {
      const mode = resolveGoogleLookupMode(v);
      assert.equal(typeof mode, "string");
      assert.ok([GOOGLE_LOOKUP_MODE_GOOGLE, GOOGLE_LOOKUP_MODE_AI].includes(mode));
    }
  });
});
