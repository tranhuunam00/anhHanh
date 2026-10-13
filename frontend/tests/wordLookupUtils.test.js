import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveInitialMeaning,
  isMeaningModified,
  getMeaningSavePayload,
  calculateAutoTextareaHeight,
  computePopoverCoords,
  parsePosTokens,
  formatPosDisplay,
  togglePosInList,
  resolveInitialContextSentence,
  isContextModified,
  hasVocabChanges,
  escapeRegex,
  highlightWordInSentence,
} from "../src/utils/wordLookupUtils.js";

describe("wordLookupUtils - Unit Tests", () => {
  describe("resolveInitialMeaning", () => {
    it("prioritizes savedItem meaning when available", () => {
      const result = resolveInitialMeaning(
        "possible",
        { meaning: "có thể" },
        { meaning: "khả thi" }
      );
      assert.equal(result, "khả thi");
    });

    it("falls back to lookupData meaning when savedItem has no meaning", () => {
      const result = resolveInitialMeaning("election", { meaning: "cuộc bầu cử" }, null);
      assert.equal(result, "cuộc bầu cử");
    });

    it("falls back to cleanWord when neither savedItem nor lookupData provide meaning", () => {
      const result = resolveInitialMeaning("ahead", null, null);
      assert.equal(result, "ahead");
    });

    it("handles whitespace-only meanings by falling back appropriately", () => {
      const result = resolveInitialMeaning("vote", { meaning: "   " }, { meaning: "" });
      assert.equal(result, "vote");
    });

    it("handles undefined and null inputs safely", () => {
      assert.equal(resolveInitialMeaning(null, null, null), "");
      assert.equal(resolveInitialMeaning(undefined, undefined, undefined), "");
    });
  });

  describe("isMeaningModified", () => {
    it("returns false when word is not saved yet", () => {
      assert.equal(isMeaningModified(false, "nghĩa mới", "nghĩa cũ"), false);
    });

    it("returns true when word is saved and custom meaning differs from saved meaning", () => {
      assert.equal(isMeaningModified(true, "trước thềm cuộc bầu cử", "trước một cuộc bầu cử"), true);
    });

    it("returns false when custom meaning matches saved meaning (ignoring outer whitespace)", () => {
      assert.equal(isMeaningModified(true, "  cuộc bầu cử  ", "cuộc bầu cử"), false);
    });

    it("returns false when custom meaning is empty or whitespace", () => {
      assert.equal(isMeaningModified(true, "   ", "cuộc bầu cử"), false);
      assert.equal(isMeaningModified(true, "", "cuộc bầu cử"), false);
    });

    it("handles null and undefined values safely", () => {
      assert.equal(isMeaningModified(null, null, null), false);
      assert.equal(isMeaningModified(true, null, "nghĩa cũ"), false);
    });
  });

  describe("getMeaningSavePayload", () => {
    it("constructs full payload with custom meaning and part_of_speech when provided", () => {
      const payload = getMeaningSavePayload({
        cleanWord: "ahead of a possible election",
        customMeaning: "trước một cuộc bầu cử có thể xảy ra",
        lookupMeaning: "trước cuộc bầu cử",
        partOfSpeech: "phrase",
        contextSentence: "This comes ahead of a possible election.",
        phonetic: "/ʌhˈɛd/",
        videoId: "vid_123",
        timestamp: 45.6,
        sourceLang: "EN",
        targetLang: "VI",
      });

      assert.deepEqual(payload, {
        word: "ahead of a possible election",
        context_sentence: "This comes ahead of a possible election.",
        meaning: "trước một cuộc bầu cử có thể xảy ra",
        phonetic: "/ʌhˈɛd/",
        part_of_speech: "phrase",
        video_id: "vid_123",
        timestamp: 45.6,
        source_lang: "en",
        target_lang: "vi",
      });
    });

    it("falls back to lookupMeaning when customMeaning is empty", () => {
      const payload = getMeaningSavePayload({
        cleanWord: "election",
        customMeaning: "   ",
        lookupMeaning: "cuộc bầu cử",
        partOfSpeech: "noun",
      });
      assert.equal(payload.meaning, "cuộc bầu cử");
      assert.equal(payload.part_of_speech, "noun");
    });

    it("falls back to cleanWord when both customMeaning and lookupMeaning are empty", () => {
      const payload = getMeaningSavePayload({
        cleanWord: "candidate",
        customMeaning: "",
        lookupMeaning: "",
      });
      assert.equal(payload.meaning, "candidate");
      assert.equal(payload.part_of_speech, "");
    });

    it("handles missing optional arguments with proper defaults", () => {
      const payload = getMeaningSavePayload();
      assert.equal(payload.word, "");
      assert.equal(payload.context_sentence, "");
      assert.equal(payload.meaning, "");
      assert.equal(payload.phonetic, "");
      assert.equal(payload.part_of_speech, "");
      assert.equal(payload.video_id, "");
      assert.equal(payload.timestamp, 0);
      assert.equal(payload.source_lang, "en");
      assert.equal(payload.target_lang, "vi");
    });

    it("coerces timestamp string to number correctly", () => {
      const payload = getMeaningSavePayload({ timestamp: "120.5" });
      assert.equal(payload.timestamp, 120.5);
    });
  });

  describe("POS Utility Functions", () => {
    it("parsePosTokens extracts and canonicalizes tokens correctly", () => {
      assert.deepEqual(parsePosTokens("noun, verb"), ["noun", "verb"]);
      assert.deepEqual(parsePosTokens("n; v / adj"), ["noun", "verb", "adjective"]);
      assert.deepEqual(parsePosTokens("Danh từ, Động từ"), ["noun", "verb"]);
      assert.deepEqual(parsePosTokens(""), []);
      assert.deepEqual(parsePosTokens(null), []);
    });

    it("formatPosDisplay converts tokens to friendly display format", () => {
      assert.equal(formatPosDisplay("noun, verb", "vi"), "Danh từ, Động từ");
      assert.equal(formatPosDisplay("adjective", "vi"), "Tính từ");
      assert.equal(formatPosDisplay("", "vi"), "");
    });

    it("togglePosInList adds and removes tokens cleanly for multi-POS", () => {
      assert.equal(togglePosInList("noun", "verb"), "noun, verb");
      assert.equal(togglePosInList("noun, verb", "noun"), "verb");
      assert.equal(togglePosInList("", "noun"), "noun");
    });
  });

  describe("calculateAutoTextareaHeight", () => {
    it("clamps scrollHeight within min and max height bounds", () => {
      assert.equal(calculateAutoTextareaHeight(20, 38, 120), 38);
      assert.equal(calculateAutoTextareaHeight(75, 38, 120), 75);
      assert.equal(calculateAutoTextareaHeight(200, 38, 120), 120);
    });

    it("handles invalid inputs by falling back to minHeight", () => {
      assert.equal(calculateAutoTextareaHeight(null, 38, 120), 38);
      assert.equal(calculateAutoTextareaHeight(NaN, 38, 120), 38);
      assert.equal(calculateAutoTextareaHeight("invalid", 38, 120), 38);
    });
  });

  describe("computePopoverCoords", () => {
    it("handles null or zero rect safely", () => {
      const res = computePopoverCoords(null);
      assert.deepEqual(res, { top: 0, left: 12, placement: "bottom", arrowLeft: 140 });

      const resZero = computePopoverCoords({ width: 0, height: 0 });
      assert.deepEqual(resZero, { top: 0, left: 12, placement: "bottom", arrowLeft: 140 });
    });

    it("places popover at bottom by default when enough vertical space exists", () => {
      const rect = { left: 100, top: 100, bottom: 120, width: 80, height: 20 };
      const res = computePopoverCoords(rect, 1000, 800);
      assert.equal(res.placement, "bottom");
      assert.equal(res.top, 128); // 120 + 8
    });

    it("flips placement to top when not enough bottom space exists", () => {
      const rect = { left: 100, top: 600, bottom: 620, width: 80, height: 20 };
      const res = computePopoverCoords(rect, 1000, 700);
      assert.equal(res.placement, "top");
      assert.equal(res.top, 592); // 600 - 8
    });

    it("clamps horizontal position to viewport boundaries", () => {
      // Off left
      const rectLeft = { left: 5, top: 100, bottom: 120, width: 10, height: 20 };
      const resLeft = computePopoverCoords(rectLeft, 1000, 800);
      assert.equal(resLeft.left, 12);

      // Off right
      const rectRight = { left: 980, top: 100, bottom: 120, width: 10, height: 20 };
      const resRight = computePopoverCoords(rectRight, 1000, 800);
      assert.equal(resRight.left, 1000 - 12 - 320);
    });
  });

  describe("resolveInitialContextSentence", () => {
    it("prioritizes contextSentence prop when provided as non-empty string", () => {
      const sentence = "The people of this country voted today.";
      const saved = { context_sentence: "Old context sentence from notebook." };
      const res = resolveInitialContextSentence(sentence, saved);
      assert.equal(res, "The people of this country voted today.");
    });

    it("falls back to savedItem.context_sentence when contextSentence is empty or whitespace", () => {
      const saved = { context_sentence: "Human beings have lived here for centuries." };
      assert.equal(resolveInitialContextSentence("", saved), "Human beings have lived here for centuries.");
      assert.equal(resolveInitialContextSentence("   ", saved), "Human beings have lived here for centuries.");
    });

    it("returns empty string when neither contextSentence nor savedItem provide context", () => {
      assert.equal(resolveInitialContextSentence("", null), "");
      assert.equal(resolveInitialContextSentence(null, null), "");
      assert.equal(resolveInitialContextSentence(undefined, undefined), "");
      assert.equal(resolveInitialContextSentence("", { context_sentence: "" }), "");
    });

    it("handles boundary, non-string, and invalid types safely", () => {
      assert.equal(resolveInitialContextSentence(12345, null), "");
      assert.equal(resolveInitialContextSentence(null, { context_sentence: 999 }), "");
    });
  });

  describe("isContextModified", () => {
    it("returns false when word is not saved yet", () => {
      assert.equal(isContextModified(false, "New context", "Old context"), false);
      assert.equal(isContextModified(null, "New context", "Old context"), false);
    });

    it("returns true when word is saved and custom context differs from initial context", () => {
      assert.equal(
        isContextModified(true, "Many people attended.", "Few people attended."),
        true
      );
    });

    it("returns false when custom context matches initial context (ignoring outer whitespace)", () => {
      assert.equal(
        isContextModified(true, "   Many people attended.   ", "Many people attended."),
        false
      );
    });

    it("returns true when custom context is emptied compared to initial context", () => {
      assert.equal(
        isContextModified(true, "", "Original context sentence."),
        true
      );
    });

    it("handles null and undefined values safely", () => {
      assert.equal(isContextModified(true, null, null), false);
      assert.equal(isContextModified(true, "Context", null), true);
    });
  });

  describe("hasVocabChanges", () => {
    it("returns false when item is not saved", () => {
      const res = hasVocabChanges({
        isSaved: false,
        customMeaning: "new",
        savedMeaning: "old",
      });
      assert.equal(res, false);
    });

    it("returns false when item is saved and no field changed", () => {
      const res = hasVocabChanges({
        isSaved: true,
        customMeaning: "dân tộc",
        savedMeaning: "dân tộc",
        customPos: "noun",
        initialPos: "noun",
        customContext: "People are friendly.",
        initialContext: "People are friendly.",
      });
      assert.equal(res, false);
    });

    it("returns true when meaning changed", () => {
      const res = hasVocabChanges({
        isSaved: true,
        customMeaning: "con người; dân chúng",
        savedMeaning: "dân tộc",
        customPos: "noun",
        initialPos: "noun",
        customContext: "People are friendly.",
        initialContext: "People are friendly.",
      });
      assert.equal(res, true);
    });

    it("returns true when POS changed", () => {
      const res = hasVocabChanges({
        isSaved: true,
        customMeaning: "dân tộc",
        savedMeaning: "dân tộc",
        customPos: "noun, phrase",
        initialPos: "noun",
        customContext: "People are friendly.",
        initialContext: "People are friendly.",
      });
      assert.equal(res, true);
    });

    it("returns true when context sentence changed", () => {
      const res = hasVocabChanges({
        isSaved: true,
        customMeaning: "dân tộc",
        savedMeaning: "dân tộc",
        customPos: "noun",
        initialPos: "noun",
        customContext: "These people showed great courage.",
        initialContext: "People are friendly.",
      });
      assert.equal(res, true);
    });

    it("handles missing or empty parameter object safely", () => {
      assert.equal(hasVocabChanges(), false);
      assert.equal(hasVocabChanges({}), false);
    });
  });

  describe("escapeRegex", () => {
    it("escapes regex meta-characters properly", () => {
      assert.equal(escapeRegex("word (test) [abc] *+?"), "word \\(test\\) \\[abc\\] \\*\\+\\?");
      assert.equal(escapeRegex("sleep-deprived"), "sleep-deprived");
    });

    it("handles non-string and empty inputs safely", () => {
      assert.equal(escapeRegex(""), "");
      assert.equal(escapeRegex(null), "");
      assert.equal(escapeRegex(undefined), "");
      assert.equal(escapeRegex(123), "");
    });
  });

  describe("highlightWordInSentence", () => {
    it("splits sentence and matches target word case-insensitively (happy path)", () => {
      const sentence = "These spectacular bursts of electrical activity are called sleep spindles.";
      const target = "spectacular bursts";
      const res = highlightWordInSentence(sentence, target);

      assert.equal(Array.isArray(res), true);
      assert.equal(res.length, 3);
      assert.deepEqual(res[0], { text: "These ", isMatch: false });
      assert.deepEqual(res[1], { text: "spectacular bursts", isMatch: true });
      assert.deepEqual(res[2], { text: " of electrical activity are called sleep spindles.", isMatch: false });
    });

    it("handles multiple occurrences in the same sentence", () => {
      const sentence = "Burst after burst happened quickly.";
      const res = highlightWordInSentence(sentence, "burst");
      assert.equal(res.length, 4);
      assert.equal(res[0].isMatch, true);
      assert.equal(res[0].text, "Burst");
      assert.equal(res[1].isMatch, false);
      assert.equal(res[2].isMatch, true);
      assert.equal(res[2].text, "burst");
    });

    it("handles empty or missing targetWord safely", () => {
      const res1 = highlightWordInSentence("A simple sentence", "");
      assert.deepEqual(res1, [{ text: "A simple sentence", isMatch: false }]);

      const res2 = highlightWordInSentence("A simple sentence", "   ");
      assert.deepEqual(res2, [{ text: "A simple sentence", isMatch: false }]);

      const res3 = highlightWordInSentence("A simple sentence", null);
      assert.deepEqual(res3, [{ text: "A simple sentence", isMatch: false }]);
    });

    it("handles empty or invalid sentence inputs safely", () => {
      assert.deepEqual(highlightWordInSentence("", "word"), []);
      assert.deepEqual(highlightWordInSentence(null, "word"), []);
      assert.deepEqual(highlightWordInSentence(undefined, "word"), []);
      assert.deepEqual(highlightWordInSentence(42, "word"), []);
    });
  });
});



