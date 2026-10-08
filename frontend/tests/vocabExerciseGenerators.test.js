import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  EXERCISE_FORMATS,
  EXERCISE_CATEGORIES,
  maskTargetWordInSentence,
  generateD1Options,
  generateD2Options,
  isAnswerCorrect,
  FALLBACK_DISTRACTORS_VI,
  FALLBACK_DISTRACTORS_BY_LANG,
} from "../src/utils/vocabExerciseGenerators.js";

describe("vocabExerciseGenerators - maskTargetWordInSentence", () => {
  test("masks target word in English sentence accurately (happy path)", () => {
    const sentence = "The family was in desperate need of urgent shelter.";
    const masked = maskTargetWordInSentence(sentence, "desperate need");
    assert.equal(masked, "The family was in [ ______ ] of urgent shelter.");
  });

  test("masks target word case-insensitively", () => {
    const sentence = "Desperate Need arises during crisis.";
    const masked = maskTargetWordInSentence(sentence, "desperate need");
    assert.equal(masked, "[ ______ ] arises during crisis.");
  });

  test("handles empty, null, and non-string inputs safely without crashing", () => {
    assert.equal(maskTargetWordInSentence("", "word"), "");
    assert.equal(maskTargetWordInSentence(null, "word"), "");
    assert.equal(maskTargetWordInSentence(undefined, "word"), "");
    assert.equal(maskTargetWordInSentence("Hello world", ""), "Hello world");
    assert.equal(maskTargetWordInSentence("Hello world", null), "Hello world");
  });

  test("masks words in non-Latin scripts (e.g. Japanese/Chinese)", () => {
    const sentence = "持続可能な開発が重要です。";
    const masked = maskTargetWordInSentence(sentence, "持続可能");
    assert.equal(masked, "[ ______ ]な開発が重要です。");
  });
});

describe("vocabExerciseGenerators - generateD1Options (Từ vựng -> Nghĩa VN)", () => {
  const samplePool = [
    { id: 1, word: "sustainable", meaning: "bền vững", source_lang: "en" },
    { id: 2, word: "comprehensive", meaning: "toàn diện", source_lang: "en" },
    { id: 3, word: "vital", meaning: "sống còn, thiết yếu", source_lang: "en" },
    { id: 4, word: "inevitable", meaning: "không thể tránh khỏi", source_lang: "en" },
  ];

  test("generates 4 distinct options containing the correct Vietnamese meaning", () => {
    const currentItem = samplePool[0];
    const options = generateD1Options(currentItem, samplePool);

    assert.equal(Array.isArray(options), true);
    assert.equal(options.length, 4);
    assert.equal(options.includes(currentItem.meaning), true);

    // Ensure all 4 options are unique
    const unique = new Set(options);
    assert.equal(unique.size, 4);
  });

  test("utilizes fallback Vietnamese distractors when pool has fewer than 4 items", () => {
    const currentItem = { id: 10, word: "unique", meaning: "độc nhất vô nhị" };
    const tinyPool = [currentItem];
    const options = generateD1Options(currentItem, tinyPool);

    assert.equal(options.length, 4);
    assert.equal(options.includes("độc nhất vô nhị"), true);
    // At least 3 options must come from fallback distractors
    const fallbackMatches = options.filter((opt) => FALLBACK_DISTRACTORS_VI.includes(opt));
    assert.equal(fallbackMatches.length >= 3, true);
  });

  test("handles null or missing item safely", () => {
    assert.deepEqual(generateD1Options(null, []), []);
    assert.deepEqual(generateD1Options({}, []), []);
  });
});

describe("vocabExerciseGenerators - generateD2Options (Nghĩa VN -> Chọn Từ vựng - Multi-language)", () => {
  const multiLangPool = [
    { id: 1, word: "bonjour", meaning: "xin chào", source_lang: "fr" },
    { id: 2, word: "merci", meaning: "cảm ơn", source_lang: "fr" },
    { id: 3, word: "durable", meaning: "bền vững", source_lang: "fr" },
    { id: 4, word: "chat", meaning: "con mèo", source_lang: "fr" },
  ];

  test("generates 4 distinct options containing the correct target word (French)", () => {
    const currentItem = multiLangPool[0];
    const options = generateD2Options(currentItem, multiLangPool);

    assert.equal(Array.isArray(options), true);
    assert.equal(options.length, 4);
    assert.equal(options.includes(currentItem.word), true);

    const unique = new Set(options);
    assert.equal(unique.size, 4);
  });

  test("utilizes language-specific fallbacks when pool is small", () => {
    const currentItem = { id: 99, word: "essential", meaning: "thiết yếu", source_lang: "en" };
    const options = generateD2Options(currentItem, [currentItem]);

    assert.equal(options.length, 4);
    assert.equal(options.includes("essential"), true);
    const unique = new Set(options);
    assert.equal(unique.size, 4);
  });

  test("handles null or missing item safely", () => {
    assert.deepEqual(generateD2Options(null, []), []);
    assert.deepEqual(generateD2Options({ meaning: "test" }, []), []);
  });
});

describe("vocabExerciseGenerators - isAnswerCorrect", () => {
  const item = {
    id: 1,
    word: "Resilient",
    meaning: "Kiên cường, có khả năng phục hồi",
  };

  test("verifies Dạng 1 answers correctly (case & whitespace insensitive)", () => {
    assert.equal(isAnswerCorrect("Kiên cường, có khả năng phục hồi", item, EXERCISE_FORMATS.D1), true);
    assert.equal(isAnswerCorrect("  kiên cường, có khả năng phục hồi  ", item, EXERCISE_FORMATS.D1), true);
    assert.equal(isAnswerCorrect("sai rồi", item, EXERCISE_FORMATS.D1), false);
  });

  test("verifies Dạng 2 answers correctly (case & whitespace insensitive)", () => {
    assert.equal(isAnswerCorrect("Resilient", item, EXERCISE_FORMATS.D2), true);
    assert.equal(isAnswerCorrect("  resilient  ", item, EXERCISE_FORMATS.D2), true);
    assert.equal(isAnswerCorrect("fragile", item, EXERCISE_FORMATS.D2), false);
  });

  test("handles null and boundary inputs safely", () => {
    assert.equal(isAnswerCorrect(null, item, EXERCISE_FORMATS.D1), false);
    assert.equal(isAnswerCorrect("", item, EXERCISE_FORMATS.D2), false);
    assert.equal(isAnswerCorrect("test", null, EXERCISE_FORMATS.D1), false);
  });
});
