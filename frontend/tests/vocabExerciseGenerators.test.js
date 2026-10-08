import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  EXERCISE_FORMATS,
  EXERCISE_CATEGORIES,
  maskTargetWordInSentence,
  generateD1Options,
  generateD2Options,
  generateD3Options,
  generateD4Options,
  getD3ClozeSentence,
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

  test("incorporates extraDistractors from system bank into options", () => {
    const currentItem = { id: 101, word: "meticulous", meaning: "tỉ mỉ, cẩn thận", source_lang: "en" };
    const bankDistractors = [
      { id: 201, word: "pragmatic", meaning: "thực dụng" },
      { id: 202, word: "innovative", meaning: "đột phá, sáng tạo" },
      { id: 203, word: "resilient", meaning: "kiên cường" },
    ];
    const options = generateD1Options(currentItem, [currentItem], bankDistractors);

    assert.equal(options.length, 4);
    assert.equal(options.includes(currentItem.meaning), true);
    // Extra distractors meanings should be present among the options
    const bankMatches = options.filter((opt) =>
      bankDistractors.some((bd) => bd.meaning === opt)
    );
    assert.equal(bankMatches.length >= 2, true);
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

  test("incorporates extraDistractors matching source language into D2 options", () => {
    const currentItem = { id: 102, word: "développement", meaning: "phát triển", source_lang: "fr" };
    const bankDistractors = [
      { id: 201, word: "croissance", meaning: "tăng trưởng", source_lang: "fr" },
      { id: 202, word: "progrès", meaning: "tiến bộ", source_lang: "fr" },
      { id: 203, word: "changement", meaning: "thay đổi", source_lang: "fr" },
    ];
    const options = generateD2Options(currentItem, [currentItem], bankDistractors);

    assert.equal(options.length, 4);
    assert.equal(options.includes("développement"), true);
    const bankMatches = options.filter((opt) =>
      bankDistractors.some((bd) => bd.word === opt)
    );
    assert.equal(bankMatches.length >= 2, true);
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

  test("verifies Dạng 3 answers correctly (case & whitespace insensitive)", () => {
    assert.equal(isAnswerCorrect("Resilient", item, EXERCISE_FORMATS.D3), true);
    assert.equal(isAnswerCorrect("  resilient  ", item, EXERCISE_FORMATS.D3), true);
    assert.equal(isAnswerCorrect("vulnerable", item, EXERCISE_FORMATS.D3), false);
  });
});

describe("vocabExerciseGenerators - generateD3Options (Context Cloze)", () => {
  const clozePool = [
    { id: 1, word: "solidarity", meaning: "tinh thần đoàn kết", context_sentence: "Special solidarity was reaffirmed.", source_lang: "en" },
    { id: 2, word: "sustainable", meaning: "bền vững", context_sentence: "Sustainable development is key.", source_lang: "en" },
    { id: 3, word: "delegation", meaning: "phái đoàn", context_sentence: "The delegation arrived safely.", source_lang: "en" },
    { id: 4, word: "vital", meaning: "thiết yếu", context_sentence: "Water is vital for life.", source_lang: "en" },
  ];

  test("generates 4 distinct options containing the correct target word", () => {
    const current = clozePool[0];
    const options = generateD3Options(current, clozePool);
    assert.equal(options.length, 4);
    assert.equal(options.includes("solidarity"), true);
    const unique = new Set(options);
    assert.equal(unique.size, 4);
  });

  test("incorporates extraDistractors into D3 options", () => {
    const current = clozePool[0];
    const bankDistractors = [
      { id: 301, word: "cooperation", source_lang: "en" },
      { id: 302, word: "partnership", source_lang: "en" },
      { id: 303, word: "alliance", source_lang: "en" },
    ];
    const options = generateD3Options(current, [current], bankDistractors);
    assert.equal(options.length, 4);
    assert.equal(options.includes(current.word), true);
    const bankMatches = options.filter((opt) =>
      bankDistractors.some((bd) => bd.word === opt)
    );
    assert.equal(bankMatches.length >= 2, true);
  });

  test("handles null or missing item safely without throwing", () => {
    assert.deepEqual(generateD3Options(null, []), []);
    assert.deepEqual(generateD3Options({}, []), []);
  });
});

describe("vocabExerciseGenerators - getD3ClozeSentence", () => {
  test("masks target word in context_sentence accurately", () => {
    const item = {
      word: "delegation",
      meaning: "phái đoàn",
      context_sentence: "A high-ranking delegation arrived in Vientiane yesterday.",
      source_lang: "en",
    };
    const res = getD3ClozeSentence(item);
    assert.equal(res.clozeSentence.includes("[ ______ ]"), true);
    assert.equal(res.clozeSentence, "A high-ranking [ ______ ] arrived in Vientiane yesterday.");
    assert.equal(res.originalSentence, "A high-ranking delegation arrived in Vientiane yesterday.");
  });

  test("extracts bilingual translation from context_sentence bracket syntax", () => {
    const item = {
      word: "armed forces",
      meaning: "lực lượng vũ trang",
      context_sentence: '"Traditional Day of the Capital Armed Forces" [Ngày truyền thống lực lượng vũ trang Thủ đô]',
      source_lang: "en",
    };
    const res = getD3ClozeSentence(item);
    assert.equal(res.clozeSentence.includes("[ ______ ]"), true);
    assert.equal(res.translation, "Ngày truyền thống lực lượng vũ trang Thủ đô");
  });

  test("provides multi-language fallback template when context_sentence is missing", () => {
    const itemEn = { word: "crucial", meaning: "then chốt", source_lang: "en" };
    const resEn = getD3ClozeSentence(itemEn);
    assert.equal(resEn.clozeSentence.includes("[ ______ ]"), true);
    assert.equal(resEn.translation, "Nghĩa: then chốt");

    const itemFr = { word: "essentiel", meaning: "thiết yếu", source_lang: "fr" };
    const resFr = getD3ClozeSentence(itemFr);
    assert.equal(resFr.clozeSentence.includes("[ ______ ]"), true);
    assert.equal(resFr.clozeSentence.includes("souligné"), true);
  });

  test("handles null or empty item gracefully", () => {
    const res = getD3ClozeSentence(null);
    assert.equal(res.clozeSentence, "[ ______ ]");
    assert.equal(res.originalSentence, "");
    assert.equal(res.translation, "");
  });
});

describe("vocabExerciseGenerators - generateD4Options & isAnswerCorrect (Listening Recall)", () => {
  const listeningPool = [
    { id: 1, word: "pronunciation", meaning: "cách phát âm", source_lang: "en" },
    { id: 2, word: "accent", meaning: "giọng điệu", source_lang: "en" },
    { id: 3, word: "fluency", meaning: "sự lưu loát", source_lang: "en" },
    { id: 4, word: "intonation", meaning: "ngữ điệu", source_lang: "en" },
  ];

  test("generates 4 distinct options containing the correct target word for listening test", () => {
    const current = listeningPool[0];
    const options = generateD4Options(current, listeningPool);
    assert.equal(Array.isArray(options), true);
    assert.equal(options.length, 4);
    assert.equal(options.includes("pronunciation"), true);
    const unique = new Set(options);
    assert.equal(unique.size, 4);
  });

  test("utilizes fallback distractors when pool has single item", () => {
    const single = { id: 10, word: "listening", meaning: "kỹ năng nghe", source_lang: "en" };
    const options = generateD4Options(single, [single]);
    assert.equal(options.length, 4);
    assert.equal(options.includes("listening"), true);
    const unique = new Set(options);
    assert.equal(unique.size, 4);
  });

  test("handles null or missing item safely without crashing", () => {
    assert.deepEqual(generateD4Options(null, []), []);
    assert.deepEqual(generateD4Options({}, []), []);
  });

  test("verifies Dạng 4 answers correctly (case & whitespace insensitive)", () => {
    const item = { id: 5, word: "Fluency", meaning: "sự lưu loát" };
    assert.equal(isAnswerCorrect("Fluency", item, EXERCISE_FORMATS.D4), true);
    assert.equal(isAnswerCorrect("  fluency  ", item, EXERCISE_FORMATS.D4), true);
    assert.equal(isAnswerCorrect("wrongWord", item, EXERCISE_FORMATS.D4), false);
    assert.equal(isAnswerCorrect(null, item, EXERCISE_FORMATS.D4), false);
    assert.equal(isAnswerCorrect("", item, EXERCISE_FORMATS.D4), false);
  });
});

