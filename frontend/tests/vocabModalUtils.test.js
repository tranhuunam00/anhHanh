import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  cleanContextSentenceForSpeech,
  buildVocabPayload,
} from "../src/utils/vocabModalUtils.js";

describe("vocabModalUtils Unit Tests", () => {
  describe("cleanContextSentenceForSpeech", () => {
    it("1. Happy path: extracts and trims standard sentence", () => {
      const input = "A driver may brake hard because a pedestrian has stepped onto the road.";
      const result = cleanContextSentenceForSpeech(input);
      assert.equal(result, "A driver may brake hard because a pedestrian has stepped onto the road.");
    });

    it("2. Input coverage: strips surrounding quotes of all types", () => {
      assert.equal(cleanContextSentenceForSpeech('"Hello world"'), "Hello world");
      assert.equal(cleanContextSentenceForSpeech("'Single quoted'"), "Single quoted");
      assert.equal(cleanContextSentenceForSpeech("“Smart quotes”"), "Smart quotes");
      assert.equal(cleanContextSentenceForSpeech("«French quotes»"), "French quotes");
    });

    it("3. Logic coverage: truncates translations on newline or custom delimiters", () => {
      const withNewline = "This is the original sentence.\nĐây là câu dịch tiếng Việt.";
      assert.equal(cleanContextSentenceForSpeech(withNewline), "This is the original sentence.");

      const withDashes = "Drive safely --- Lái xe an toàn";
      assert.equal(cleanContextSentenceForSpeech(withDashes), "Drive safely");

      const withColons = "Focus on your goals :: Tập trung vào mục tiêu";
      assert.equal(cleanContextSentenceForSpeech(withColons), "Focus on your goals");
    });

    it("4. Boundary & error handling: handles empty, null, undefined and non-string inputs safely", () => {
      assert.equal(cleanContextSentenceForSpeech(""), "");
      assert.equal(cleanContextSentenceForSpeech("   "), "");
      assert.equal(cleanContextSentenceForSpeech(null), "");
      assert.equal(cleanContextSentenceForSpeech(undefined), "");
      assert.equal(cleanContextSentenceForSpeech(12345), "");
      assert.equal(cleanContextSentenceForSpeech({}), "");
    });
  });

  describe("buildVocabPayload", () => {
    it("1. Happy path: builds clean payload with all fields present", () => {
      const payload = buildVocabPayload({
        word: "  manoeuvre  ",
        phonetic: "  /mənˈuːvər/ ",
        partOfSpeech: "noun, verb",
        meaning: "sự cơ động",
        imageUrl: "https://example.com/image.jpg",
        contextSentence: "A sudden manoeuvre was required.",
        status: "LEARNING",
        sourceLang: "en",
      });

      assert.deepEqual(payload, {
        word: "manoeuvre",
        phonetic: "/mənˈuːvər/",
        part_of_speech: "noun, verb",
        meaning: "sự cơ động",
        image_url: "https://example.com/image.jpg",
        context_sentence: "A sudden manoeuvre was required.",
        status: "LEARNING",
        source_lang: "en",
      });
    });

    it("2. Internal logic: sets image_url to empty string when not provided or whitespace", () => {
      const payload = buildVocabPayload({
        word: "resilience",
        imageUrl: "   ",
      });
      assert.equal(payload.image_url, "");
    });

    it("3. Internal logic: falls back to word if meaning is empty or missing", () => {
      const payload = buildVocabPayload({
        word: "apple",
        meaning: "",
      });
      assert.equal(payload.meaning, "apple");
    });

    it("4. Input coverage & defaults: handles Chinese words and custom sourceLang", () => {
      const payload = buildVocabPayload({
        word: "苹果",
        meaning: "quả táo",
        sourceLang: "zh",
      });
      assert.equal(payload.word, "苹果");
      assert.equal(payload.source_lang, "zh");
      assert.equal(payload.status, "LEARNING");
    });

    it("5. Boundary & error handling: handles undefined parameters gracefully without throwing", () => {
      const payload = buildVocabPayload({});
      assert.equal(payload.word, "");
      assert.equal(payload.meaning, "");
      assert.equal(payload.image_url, "");
      assert.equal(payload.status, "LEARNING");
      assert.equal(payload.source_lang, "en");
    });
  });
});
