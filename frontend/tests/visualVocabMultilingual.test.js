import test from "node:test";
import assert from "node:assert/strict";
import {
  VISUAL_VOCAB_LANGUAGES,
  getLocalizedItem,
  getLocalizedDistractor,
  getLocalizedTopic,
  VISUAL_VOCAB_TOPICS,
} from "../src/data/visualVocab/index.js";
import {
  stripDiacritics,
  isSpellingMatch,
  filterItemsByQuery,
} from "../src/utils/visualVocabUtils.js";

// ============================================================================
// 1. Tests for getLocalizedItem
// ============================================================================
test("getLocalizedItem - English default (happy path)", () => {
  const item = {
    id: "landscape",
    word: "landscape",
    ipa: "/ˈlændskeɪp/",
    meaning: "Phong cảnh",
    pos: "noun",
  };
  const res = getLocalizedItem(item, "en");
  assert.equal(res.word, "landscape");
  assert.equal(res.lang, "en");
});

test("getLocalizedItem - French translation resolution", () => {
  const item = {
    id: "landscape",
    word: "landscape",
    ipa: "/ˈlændskeɪp/",
    meaning: "Phong cảnh",
  };
  const res = getLocalizedItem(item, "fr");
  assert.equal(res.word, "paysage");
  assert.equal(res.lang, "fr");
  assert.ok(res.example && res.example.includes("paysage"));
});

test("getLocalizedItem - Chinese translation and Pinyin resolution", () => {
  const item = {
    id: "peak",
    word: "peak",
    ipa: "/piːk/",
    meaning: "Đỉnh núi",
  };
  const res = getLocalizedItem(item, "zh");
  assert.equal(res.word, "山峰");
  assert.equal(res.pinyin, "shān fēng");
  assert.equal(res.lang, "zh");
});

test("getLocalizedItem - handles null and unknown items safely", () => {
  assert.equal(getLocalizedItem(null, "fr"), null);
  const unknown = { id: "unknown_id", word: "foo", ipa: "/f/", meaning: "bar" };
  const res = getLocalizedItem(unknown, "fr");
  assert.equal(res.word, "foo");
  assert.equal(res.lang, "en");
});

// ============================================================================
// 2. Tests for getLocalizedDistractor
// ============================================================================
test("getLocalizedDistractor - resolves French and Chinese distractors", () => {
  const dist = { id: "dist_volcano", word: "volcano", meaning: "Núi lửa" };
  const frDist = getLocalizedDistractor(dist, "fr");
  assert.equal(frDist.word, "volcan");
  assert.equal(frDist.lang, "fr");

  const zhDist = getLocalizedDistractor(dist, "zh");
  assert.equal(zhDist.word, "火山");
  assert.equal(zhDist.pinyin, "huǒ shān");
  assert.equal(zhDist.lang, "zh");
});

test("getLocalizedDistractor - handles null and empty inputs safely", () => {
  assert.equal(getLocalizedDistractor(null, "zh"), null);
  const unknown = { id: "unknown_dist", word: "test" };
  const res = getLocalizedDistractor(unknown, "zh");
  assert.equal(res.word, "test");
});

// ============================================================================
// 3. Tests for getLocalizedTopic
// ============================================================================
test("getLocalizedTopic - localizes entire topic items and distractors", () => {
  const topic = VISUAL_VOCAB_TOPICS[0]; // mountain
  const localizedFr = getLocalizedTopic(topic, "fr");

  assert.equal(localizedFr.currentLang, "fr");
  assert.ok(localizedFr.items.length > 0);
  assert.equal(localizedFr.items[0].word, "paysage");
  assert.ok(localizedFr.distractors.length > 0);

  const localizedZh = getLocalizedTopic(topic, "zh");
  assert.equal(localizedZh.currentLang, "zh");
  assert.equal(localizedZh.items[0].word, "风景");
  assert.equal(localizedZh.items[0].pinyin, "fēng jǐng");
});

test("getLocalizedTopic - handles null safely", () => {
  assert.equal(getLocalizedTopic(null, "fr"), null);
});

// ============================================================================
// 4. Tests for stripDiacritics
// ============================================================================
test("stripDiacritics - strips accents from French and tone marks from Pinyin", () => {
  assert.equal(stripDiacritics("crête"), "crete");
  assert.equal(stripDiacritics("bibliothèque"), "bibliotheque");
  assert.equal(stripDiacritics("shān fēng"), "shan feng");
  assert.equal(stripDiacritics(""), "");
  assert.equal(stripDiacritics(null), "");
  assert.equal(stripDiacritics(undefined), "");
});

// ============================================================================
// 5. Tests for isSpellingMatch (Multilingual & Pinyin)
// ============================================================================
test("isSpellingMatch - French accent insensitivity", () => {
  assert.equal(isSpellingMatch("crête", "crête"), true);
  assert.equal(isSpellingMatch("crete", "crête"), true);
  assert.equal(isSpellingMatch("bibliotheque", "bibliothèque"), true);
  assert.equal(isSpellingMatch("falaise", "falaise"), true);
  assert.equal(isSpellingMatch("wrong", "crête"), false);
});

test("isSpellingMatch - Chinese character and Pinyin matching", () => {
  // Matching direct Chinese characters
  assert.equal(isSpellingMatch("山峰", "山峰", { pinyin: "shān fēng" }), true);
  // Matching Pinyin with tone marks
  assert.equal(isSpellingMatch("shān fēng", "山峰", { pinyin: "shān fēng" }), true);
  assert.equal(isSpellingMatch("shānfēng", "山峰", { pinyin: "shān fēng" }), true);
  // Matching plain Pinyin without tone marks
  assert.equal(isSpellingMatch("shanfeng", "山峰", { pinyin: "shān fēng" }), true);
  assert.equal(isSpellingMatch("shan feng", "山峰", { pinyin: "shān fēng" }), true);
  // Wrong input
  assert.equal(isSpellingMatch("gaoshan", "山峰", { pinyin: "shān fēng" }), false);
});

test("isSpellingMatch - boundary and invalid inputs", () => {
  assert.equal(isSpellingMatch("", "山峰"), false);
  assert.equal(isSpellingMatch(null, "山峰"), false);
  assert.equal(isSpellingMatch("山峰", null), false);
  assert.equal(isSpellingMatch("   ", "山峰"), false);
});

// ============================================================================
// 6. Tests for filterItemsByQuery (Multilingual)
// ============================================================================
test("filterItemsByQuery - matches French word, Chinese character and Pinyin", () => {
  const items = [
    { id: "1", word: "paysage", pinyin: "", meaning: "Phong cảnh", ipa: "/pe.i.zaʒ/" },
    { id: "2", word: "山峰", pinyin: "shān fēng", meaning: "Đỉnh núi", ipa: "/ʂan/" },
    { id: "3", word: "crête", pinyin: "", meaning: "Sống núi", ipa: "/kʁɛt/" },
  ];

  // Matches French without accents
  const matchFr = filterItemsByQuery(items, "crete");
  assert.equal(matchFr.length, 1);
  assert.equal(matchFr[0].id, "3");

  // Matches Chinese character
  const matchZh = filterItemsByQuery(items, "山峰");
  assert.equal(matchZh.length, 1);
  assert.equal(matchZh[0].id, "2");

  // Matches Chinese Pinyin (even without tones)
  const matchPinyin = filterItemsByQuery(items, "shanfeng");
  assert.equal(matchPinyin.length, 1);
  assert.equal(matchPinyin[0].id, "2");

  // Matches Vietnamese meaning
  const matchVn = filterItemsByQuery(items, "phong cảnh");
  assert.equal(matchVn.length, 1);
  assert.equal(matchVn[0].id, "1");
});
