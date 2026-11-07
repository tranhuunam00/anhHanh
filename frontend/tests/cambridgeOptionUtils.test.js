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
});

