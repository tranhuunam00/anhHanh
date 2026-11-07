import test from "node:test";
import assert from "node:assert/strict";
import {
  parseOption,
  extractMatchingOptions,
  isChooseTwoSelected
} from "../src/utils/cambridgeOptionUtils.js";

test("cambridgeOptionUtils - Unit Tests", async (t) => {
  await t.test("parseOption - standard formats and happy paths", () => {
    // "A. in a hotel."
    const res1 = parseOption("A. in a hotel.");
    assert.deepEqual(res1, { letter: "A", text: "in a hotel." });

    // "B experiencing a river trip."
    const res2 = parseOption("B experiencing a river trip.");
    assert.deepEqual(res2, { letter: "B", text: "experiencing a river trip." });

    // "C: visiting a cheese factory"
    const res3 = parseOption("C: visiting a cheese factory");
    assert.deepEqual(res3, { letter: "C", text: "visiting a cheese factory" });

    // "D - Retailers should do more"
    const res4 = parseOption("D - Retailers should do more");
    assert.deepEqual(res4, { letter: "D", text: "Retailers should do more" });

    // Object format
    const res5 = parseOption({ letter: "A", text: "going to a theme park" });
    assert.deepEqual(res5, { letter: "A", text: "going to a theme park" });

    // Roman numerals (e.g. Reading headings "vii. Paragraph B")
    const res6 = parseOption("vii. The rise of ancient pirates");
    assert.deepEqual(res6, { letter: "VII", text: "The rise of ancient pirates" });
  });

  await t.test("parseOption - edge cases and boundary inputs", () => {
    assert.deepEqual(parseOption(null), { letter: "", text: "" });
    assert.deepEqual(parseOption(undefined), { letter: "", text: "" });
    assert.deepEqual(parseOption(""), { letter: "", text: "" });
    assert.deepEqual(parseOption("   "), { letter: "", text: "" });
    assert.deepEqual(parseOption({}), { letter: "", text: "" });

    // Standalone letter
    assert.deepEqual(parseOption("A"), { letter: "A", text: "A" });
  });

  await t.test("extractMatchingOptions - precedence and fallbacks", () => {
    // 1. From item.options
    const itemWithOptions = { options: ["A 1", "B 2"] };
    assert.deepEqual(extractMatchingOptions(itemWithOptions, null), ["A 1", "B 2"]);

    // 2. From part.boxOptions
    const partWithBox = { boxOptions: ["A box", "B box"] };
    assert.deepEqual(extractMatchingOptions({}, partWithBox), ["A box", "B box"]);

    // 3. From part.matchingOptions
    const partWithMatch = { matchingOptions: ["A match", "B match"] };
    assert.deepEqual(extractMatchingOptions({}, partWithMatch), ["A match", "B match"]);

    // 4. From part.mapLetters
    const partWithMap = { mapLetters: ["A", "B", "C"] };
    assert.deepEqual(extractMatchingOptions({}, partWithMap), ["A", "B", "C"]);

    // 5. Default fallback
    assert.deepEqual(extractMatchingOptions(null, null), ["A", "B", "C", "D", "E", "F", "G", "H"]);
  });

  await t.test("isChooseTwoSelected - verification", () => {
    const answers = { 11: "B", 12: "D" };

    // Matches first number
    assert.equal(isChooseTwoSelected(answers, 11, 12, "B"), true);
    assert.equal(isChooseTwoSelected(answers, 11, 12, "b"), true);

    // Matches pair number
    assert.equal(isChooseTwoSelected(answers, 11, 12, "D"), true);

    // Neither
    assert.equal(isChooseTwoSelected(answers, 11, 12, "A"), false);

    // Missing pair number or empty answers
    assert.equal(isChooseTwoSelected(answers, 11, null, "B"), true);
    assert.equal(isChooseTwoSelected(answers, 11, null, "D"), false);
    assert.equal(isChooseTwoSelected(null, 11, 12, "B"), false);
    assert.equal(isChooseTwoSelected(answers, 11, 12, ""), false);
  });

  await t.test("matching box options target index placement", () => {
    const getBoxOptionsTargetIndex = (items) => {
      if (!Array.isArray(items) || items.length === 0) return 0;
      const idx = items.findIndex((it) => it.type === "matching");
      return idx !== -1 ? idx : 0;
    };

    // Test 1 Part 3: Q21-24 choose_two, Q25-30 matching
    const test1Part3Items = [
      { number: 21, type: "choose_two" },
      { number: 22, type: "choose_two" },
      { number: 23, type: "choose_two" },
      { number: 24, type: "choose_two" },
      { number: 25, type: "matching" },
      { number: 26, type: "matching" },
      { number: 27, type: "matching" },
      { number: 28, type: "matching" },
      { number: 29, type: "matching" },
      { number: 30, type: "matching" }
    ];
    // Box options MUST be placed at index 4 (right before Q25 matching), NOT at index 0 (before Q21)
    assert.equal(getBoxOptionsTargetIndex(test1Part3Items), 4);

    // Test 2 Part 3: Q21-24 multiple_choice, Q25-28 matching, Q29-30 multiple_choice
    const test2Part3Items = [
      { number: 21, type: "multiple_choice" },
      { number: 22, type: "multiple_choice" },
      { number: 23, type: "multiple_choice" },
      { number: 24, type: "multiple_choice" },
      { number: 25, type: "matching" },
      { number: 26, type: "matching" },
      { number: 27, type: "matching" },
      { number: 28, type: "matching" },
      { number: 29, type: "multiple_choice" },
      { number: 30, type: "multiple_choice" }
    ];
    assert.equal(getBoxOptionsTargetIndex(test2Part3Items), 4);

    // Test 3 Part 2: Q11-16 matching, Q17-20 choose_two
    const test3Part2Items = [
      { number: 11, type: "matching" },
      { number: 12, type: "matching" },
      { number: 17, type: "choose_two" },
      { number: 18, type: "choose_two" }
    ];
    assert.equal(getBoxOptionsTargetIndex(test3Part2Items), 0);

    // No matching items
    const noMatchingItems = [
      { number: 1, type: "fill_notes" },
      { number: 2, type: "fill_notes" }
    ];
    assert.equal(getBoxOptionsTargetIndex(noMatchingItems), 0);
  });
});

