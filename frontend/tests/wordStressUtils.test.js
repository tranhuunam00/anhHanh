import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeStressWord,
  splitWordIntoSyllables,
  extractStressFromPhonetic,
  getStressRuleExplanation,
  analyzeWordStress,
} from "../src/utils/wordStressUtils.js";

test("wordStressUtils - sanitizeStressWord", async (t) => {
  await t.test("happy path: cleans simple alphabetic words", () => {
    assert.strictEqual(sanitizeStressWord("Photograph"), "photograph");
    assert.strictEqual(sanitizeStressWord("  IMPORTANT  "), "important");
  });

  await t.test("edge case: strips special symbols, dashes, numbers", () => {
    assert.strictEqual(sanitizeStressWord("hello-world!"), "helloworld");
    assert.strictEqual(sanitizeStressWord("word123"), "word");
  });

  await t.test("boundary case: handles null, undefined, and empty string", () => {
    assert.strictEqual(sanitizeStressWord(""), "");
    assert.strictEqual(sanitizeStressWord(null), "");
    assert.strictEqual(sanitizeStressWord(undefined), "");
    assert.strictEqual(sanitizeStressWord(12345), "");
  });
});

test("wordStressUtils - splitWordIntoSyllables", async (t) => {
  await t.test("happy path: splits common multisyllabic words with overrides", () => {
    assert.deepStrictEqual(splitWordIntoSyllables("photograph"), ["pho", "to", "graph"]);
    assert.deepStrictEqual(splitWordIntoSyllables("environment"), ["en", "vi", "ron", "ment"]);
    assert.deepStrictEqual(splitWordIntoSyllables("success"), ["suc", "cess"]);
    assert.deepStrictEqual(splitWordIntoSyllables("important"), ["im", "por", "tant"]);
  });

  await t.test("short words (<= 3 chars) return single syllable array", () => {
    assert.deepStrictEqual(splitWordIntoSyllables("cat"), ["cat"]);
    assert.deepStrictEqual(splitWordIntoSyllables("in"), ["in"]);
  });

  await t.test("boundary case: empty or invalid inputs return empty array", () => {
    assert.deepStrictEqual(splitWordIntoSyllables(""), []);
    assert.deepStrictEqual(splitWordIntoSyllables(null), []);
  });
});

test("wordStressUtils - extractStressFromPhonetic", async (t) => {
  await t.test("happy path: extracts primary stress correctly from IPA with ˈ", () => {
    // /ˈfəʊtəɡrɑːf/ -> stress at index 0 (1st syllable)
    const res1 = extractStressFromPhonetic("/ˈfəʊtəɡrɑːf/");
    assert.strictEqual(res1.stressIndex, 0);

    // /ɪmˈpɔːtnt/ -> stress at index 1 (2nd syllable)
    const res2 = extractStressFromPhonetic("/ɪmˈpɔːtnt/");
    assert.strictEqual(res2.stressIndex, 1);

    // /ˌɪntəˈnæʃnəl/ -> stress at index 2 (3rd syllable: næʃ)
    const res3 = extractStressFromPhonetic("/ˌɪntəˈnæʃnəl/");
    assert.strictEqual(res3.stressIndex, 2);
  });

  await t.test("supports straight quote ' as stress indicator", () => {
    const res = extractStressFromPhonetic("/sək'ses/");
    assert.strictEqual(res.stressIndex, 1);
  });

  await t.test("fallback: phonetic without stress mark defaults to 0", () => {
    const res = extractStressFromPhonetic("/kæt/");
    assert.strictEqual(res.stressIndex, 0);
  });

  await t.test("boundary: handles null, empty, non-string safely", () => {
    assert.deepStrictEqual(extractStressFromPhonetic(""), { stressIndex: 0, totalSyllables: 1 });
    assert.deepStrictEqual(extractStressFromPhonetic(null), { stressIndex: 0, totalSyllables: 1 });
  });
});

test("wordStressUtils - getStressRuleExplanation", async (t) => {
  await t.test("explains -tion/-sion rule", () => {
    const exp = getStressRuleExplanation("education", 3, 4);
    assert.match(exp, /-tion/);
  });

  await t.test("explains -ic/-ity rule", () => {
    const exp = getStressRuleExplanation("economic", 3, 4);
    assert.match(exp, /-ic/);
  });

  await t.test("explains 2-syllable noun/verb general rule", () => {
    const exp1 = getStressRuleExplanation("table", 1, 2);
    assert.match(exp1, /danh từ & tính từ 2 âm tiết/);

    const exp2 = getStressRuleExplanation("arrive", 2, 2);
    assert.match(exp2, /động từ 2 âm tiết/);
  });
});

test("wordStressUtils - analyzeWordStress", async (t) => {
  await t.test("happy path: complete analysis for 'important'", () => {
    const analysis = analyzeWordStress("important", "/ɪmˈpɔːtnt/");
    assert.strictEqual(analysis.cleanWord, "important");
    assert.deepStrictEqual(analysis.syllables, ["im", "por", "tant"]);
    assert.strictEqual(analysis.stressIndex, 1);
    assert.strictEqual(analysis.stressNumber, 2);
    assert.strictEqual(analysis.stressSyllable, "por");
    assert.strictEqual(analysis.totalSyllables, 3);
    assert.strictEqual(analysis.options.length, 3);
    assert.strictEqual(analysis.options[1].isCorrect, true);
    assert.strictEqual(analysis.options[0].isCorrect, false);
  });

  await t.test("happy path: complete analysis for 'photograph'", () => {
    const analysis = analyzeWordStress("photograph", "/ˈfəʊtəɡrɑːf/");
    assert.strictEqual(analysis.stressIndex, 0);
    assert.strictEqual(analysis.stressNumber, 1);
    assert.strictEqual(analysis.stressSyllable, "pho");
  });

  await t.test("boundary: handles empty word gracefully", () => {
    const analysis = analyzeWordStress("", null);
    assert.strictEqual(analysis.totalSyllables, 0);
    assert.deepStrictEqual(analysis.options, []);
  });
});
