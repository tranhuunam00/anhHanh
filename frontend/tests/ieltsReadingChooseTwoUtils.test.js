import test from "node:test";
import assert from "node:assert/strict";
import { cleanChooseTwoQuestion, getChooseTwoBlocks } from "../src/utils/ieltsReadingChooseTwoUtils.js";
import { usesDataDrivenReadingRenderer } from "../src/utils/ieltsReadingRendererRouting.js";

const OPTIONS = ["A one", "B two", "C three", "D four", "E five"];

test("cleanChooseTwoQuestion", async (t) => {
  await t.test("removes trailing pair markers", () => {
    assert.equal(cleanChooseTwoQuestion("Which TWO points? (Second choice)"), "Which TWO points?");
    assert.equal(cleanChooseTwoQuestion("Factors (2 of 2)"), "Factors");
    assert.equal(cleanChooseTwoQuestion("Factors (1 OF 2)"), "Factors");
  });
  await t.test("keeps normal questions and trims", () => {
    assert.equal(cleanChooseTwoQuestion("  Which TWO statements are made?  "), "Which TWO statements are made?");
    assert.equal(cleanChooseTwoQuestion("Uses (brackets) inside"), "Uses (brackets) inside");
  });
  await t.test("bad input returns empty string", () => {
    assert.equal(cleanChooseTwoQuestion(null), "");
    assert.equal(cleanChooseTwoQuestion(12), "");
  });
});

test("getChooseTwoBlocks", async (t) => {
  await t.test("paired items: one block from the item carrying the options", () => {
    const group = {
      instructions: "Choose TWO letters, A–E.",
      items: [
        { number: 23, pairNumber: 24, question: "Which TWO?", options: OPTIONS, answers: ["B", "C"] },
        { number: 24, pairNumber: 23, answers: ["B", "C"] }
      ]
    };
    assert.deepEqual(getChooseTwoBlocks(group), [{ numbers: [23, 24], question: "Which TWO?", options: OPTIONS }]);
  });

  await t.test("legacy data with options on both items keeps only the first of the pair", () => {
    const group = {
      items: [
        { number: 25, pairNumber: 26, question: "Q", options: OPTIONS },
        { number: 26, pairNumber: 25, question: "Q (Second choice)", options: OPTIONS }
      ]
    };
    const blocks = getChooseTwoBlocks(group);
    assert.equal(blocks.length, 1);
    assert.deepEqual(blocks[0].numbers, [25, 26]);
  });

  await t.test("question already in the instructions is not repeated", () => {
    const group = {
      instructions: "Choose TWO letters.\nWhich TWO points does the writer make?",
      items: [{ number: 1, pairNumber: 2, question: "Which TWO points does the writer make?", options: OPTIONS }]
    };
    assert.equal(getChooseTwoBlocks(group)[0].question, "");
  });

  await t.test("group-level options (pick_multiple) use the group numbers", () => {
    const group = { numbers: [23, 24], options: OPTIONS, items: [{ number: 23 }, { number: 24 }] };
    assert.deepEqual(getChooseTwoBlocks(group), [{ numbers: [23, 24], question: "", options: OPTIONS }]);
  });

  await t.test("group-level options without numbers fall back to item numbers", () => {
    const group = { options: OPTIONS, items: [{ number: 5 }, { number: 6 }, { number: 7 }] };
    assert.deepEqual(getChooseTwoBlocks(group)[0].numbers, [5, 6]);
  });

  await t.test("no options anywhere, or bad input, gives no blocks", () => {
    assert.deepEqual(getChooseTwoBlocks({ items: [{ number: 1 }] }), []);
    assert.deepEqual(getChooseTwoBlocks({ options: OPTIONS, items: [] }), []);
    assert.deepEqual(getChooseTwoBlocks(null), []);
  });
});

test("usesDataDrivenReadingRenderer", async (t) => {
  await t.test("Cambridge 16–19 use the data-driven renderer", () => {
    for (const id of ["cambridge-16-test-1", "cambridge-17-test-4", "cambridge-18-test-2", "cambridge-19-test-3"]) {
      assert.equal(usesDataDrivenReadingRenderer(id), true, id);
    }
  });
  await t.test("Cambridge 20–21 keep their own renderers", () => {
    assert.equal(usesDataDrivenReadingRenderer("cambridge-20-test-1"), false);
    assert.equal(usesDataDrivenReadingRenderer("cambridge-21-test-2"), false);
    assert.equal(usesDataDrivenReadingRenderer("cambridge-160-test-1"), false);
  });
  await t.test("bad input", () => {
    assert.equal(usesDataDrivenReadingRenderer(""), false);
    assert.equal(usesDataDrivenReadingRenderer(null), false);
    assert.equal(usesDataDrivenReadingRenderer(16), false);
  });
});
