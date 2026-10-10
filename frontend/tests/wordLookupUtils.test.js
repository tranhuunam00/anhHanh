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
});

