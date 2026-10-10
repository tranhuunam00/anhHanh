import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeStructureItem,
  normalizeStructureList,
  mergeStructureLists,
  splitPhraseParts,
  getBandDisplayLabel,
} from "../src/utils/writingStructureUtils.js";

describe("writingStructureUtils Unit Tests", () => {
  describe("normalizeStructureItem", () => {
    it("normalizes a standard item correctly (happy path)", () => {
      const raw = {
        kind: "collocation",
        category: "intro",
        band: "band8",
        phrase: "exponential urbanization",
        meaning: "đô thị hóa chóng mặt",
        template: "exponential urbanization",
        usage: "Mở đầu bối cảnh",
      };
      const res = normalizeStructureItem(raw);
      assert.deepEqual(res, {
        kind: "collocation",
        category: "intro",
        band: "band8",
        phrase: "exponential urbanization",
        meaning: "đô thị hóa chóng mặt",
        template: "exponential urbanization",
        usage: "Mở đầu bối cảnh",
      });
    });

    it("handles alternative property keys from Gemini", () => {
      const raw = {
        type: "structure",
        category: "counter_argument",
        sentence_frame: "While some argue that [X], others contend that [Y].",
        translation: "Trong khi một số lập luận [X], người khác cho rằng [Y].",
        level: "Band 8.5",
        context: "Dùng cho đoạn phản biện",
      };
      const res = normalizeStructureItem(raw);
      assert.equal(res.kind, "structure");
      assert.equal(res.category, "counter");
      assert.equal(res.band, "band8");
      assert.equal(res.phrase, "While some argue that [X], others contend that [Y].");
      assert.equal(res.meaning, "Trong khi một số lập luận [X], người khác cho rằng [Y].");
      assert.equal(res.template, "While some argue that [X], others contend that [Y].");
      assert.equal(res.usage, "Dùng cho đoạn phản biện");
    });

    it("applies heuristics for kind and band detection", () => {
      // Bracket in phrase -> structure
      const itemWithBrackets = {
        phrase: "There is substantial evidence that [claim]",
        vietnamese: "Có bằng chứng đáng kể rằng...",
        target_band: "7.5",
      };
      const res1 = normalizeStructureItem(itemWithBrackets);
      assert.equal(res1.kind, "structure");
      assert.equal(res1.band, "band7");

      // Short phrase -> collocation
      const itemShort = {
        expression: "mitigate climate change",
        meaning_vi: "giảm thiểu biến đổi khí hậu",
        band: "6.5",
      };
      const res2 = normalizeStructureItem(itemShort);
      assert.equal(res2.kind, "collocation");
      assert.equal(res2.band, "band6");

      // Long phrase (>5 words) without brackets -> structure
      const itemLong = {
        text: "This phenomenon can be primarily attributed to several factors",
        meaning: "Hiện tượng này có thể quy cho một vài yếu tố",
      };
      const res3 = normalizeStructureItem(itemLong);
      assert.equal(res3.kind, "structure");
    });

    it("handles boundary, empty, and invalid inputs gracefully", () => {
      assert.equal(normalizeStructureItem(null), null);
      assert.equal(normalizeStructureItem(undefined), null);
      assert.equal(normalizeStructureItem(""), null);
      assert.equal(normalizeStructureItem(123), null);
      assert.equal(normalizeStructureItem([]), null);
      assert.equal(normalizeStructureItem({}), null);
      assert.equal(normalizeStructureItem({ phrase: "", meaning: "" }), null);

      // Phrase missing but meaning present -> phrase falls back to meaning
      const itemOnlyMeaning = { meaning: "chú thích ý nghĩa" };
      const resMeaning = normalizeStructureItem(itemOnlyMeaning);
      assert.equal(resMeaning.phrase, "chú thích ý nghĩa");
      assert.equal(resMeaning.meaning, "chú thích ý nghĩa");
    });
  });

  describe("normalizeStructureList", () => {
    it("filters out invalid items and normalizes valid ones", () => {
      const rawList = [
        { phrase: "foster innovation", meaning: "thúc đẩy đổi mới", band: "band8" },
        null,
        {},
        { sentence_frame: "It cannot be denied that [fact]", meaning: "Không thể phủ nhận rằng..." },
      ];
      const list = normalizeStructureList(rawList);
      assert.equal(list.length, 2);
      assert.equal(list[0].phrase, "foster innovation");
      assert.equal(list[1].phrase, "It cannot be denied that [fact]");
    });

    it("returns empty array for non-array inputs", () => {
      assert.deepEqual(normalizeStructureList(null), []);
      assert.deepEqual(normalizeStructureList(undefined), []);
      assert.deepEqual(normalizeStructureList("not an array"), []);
    });
  });

  describe("mergeStructureLists", () => {
    it("merges new items and deduplicates existing ones by phrase", () => {
      const existing = [
        { phrase: "foster economic growth", meaning: "thúc đẩy tăng trưởng" },
        { phrase: "curb emissions", meaning: "cắt giảm khí thải" },
      ];
      const incoming = [
        { phrase: "Curb Emissions", meaning: "cắt giảm khí thải trùng" }, // duplicate (case-insensitive)
        { phrase: "pave the way for [outcome]", meaning: "mở đường cho" }, // new
      ];
      const merged = mergeStructureLists(existing, incoming);
      assert.equal(merged.length, 3);
      assert.equal(merged[0].phrase, "foster economic growth");
      assert.equal(merged[1].phrase, "curb emissions");
      assert.equal(merged[2].phrase, "pave the way for [outcome]");
    });

    it("handles empty or invalid lists without throwing", () => {
      assert.deepEqual(mergeStructureLists([], []), []);
      assert.deepEqual(mergeStructureLists(null, null), []);
    });
  });

  describe("splitPhraseParts", () => {
    it("splits brackets placeholder slots accurately", () => {
      const parts = splitPhraseParts("It is widely argued that [view], however [counter]");
      assert.deepEqual(parts, [
        "It is widely argued that ",
        "[view]",
        ", however ",
        "[counter]",
        "",
      ]);
    });

    it("handles string without brackets and empty inputs", () => {
      assert.deepEqual(splitPhraseParts("simple collocation"), ["simple collocation"]);
      assert.deepEqual(splitPhraseParts(""), []);
      assert.deepEqual(splitPhraseParts(null), []);
    });
  });

  describe("getBandDisplayLabel", () => {
    it("returns correct user-friendly labels", () => {
      assert.equal(getBandDisplayLabel("band8"), "Band 8.0 – 9.0");
      assert.equal(getBandDisplayLabel("band7"), "Band 7.0 – 7.5");
      assert.equal(getBandDisplayLabel("band6"), "Band 6.0 – 6.5");
      assert.equal(getBandDisplayLabel("unknown"), "Band 6.0 – 6.5");
    });
  });
});
