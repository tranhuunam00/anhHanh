import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractQuestionNumbersFromBlock,
  extractAllHandledQuestionNumbers
} from "../src/utils/ieltsListeningBlockUtils.js";

describe("ieltsListeningBlockUtils - Unit Tests", () => {
  describe("extractQuestionNumbersFromBlock", () => {
    it("returns empty array for null, undefined, string, or empty block (bad/boundary inputs)", () => {
      assert.deepEqual(extractQuestionNumbersFromBlock(null), []);
      assert.deepEqual(extractQuestionNumbersFromBlock(undefined), []);
      assert.deepEqual(extractQuestionNumbersFromBlock("invalid"), []);
      assert.deepEqual(extractQuestionNumbersFromBlock(123), []);
      assert.deepEqual(extractQuestionNumbersFromBlock({}), []);
    });

    it("extracts question numbers from note block sections and lines", () => {
      const noteBlock = {
        title: "Test Notes",
        sections: [
          {
            heading: "Sec 1",
            lines: [
              { prefix: "Item: ", number: 1, suffix: "" },
              { text: "Plain text bullet without question number" },
              { prefix: "Another: ", number: 2, suffix: " end" }
            ]
          },
          {
            heading: "Sec 2",
            lines: [
              { text: "Only context bullet" }
            ]
          }
        ]
      };
      const nums = extractQuestionNumbersFromBlock(noteBlock);
      assert.deepEqual(nums, [1, 2]);
    });

    it("extracts question numbers from form block fields", () => {
      const formBlock = {
        title: "Test Form",
        fields: [
          { label: "Name:", number: 1, prefix: "", suffix: "" },
          { text: "Note line without number" },
          { label: "Phone:", number: 2, prefix: "", suffix: "" }
        ]
      };
      const nums = extractQuestionNumbersFromBlock(formBlock);
      assert.deepEqual(nums, [1, 2]);
    });

    it("extracts question numbers from table block cells", () => {
      const tableBlock = {
        title: "Test Table",
        headers: ["Col 1", "Col 2"],
        rows: [
          ["Fixed text", { prefix: "Input: ", number: 7, suffix: "" }],
          ["-", { prefix: "Input: ", number: 8, suffix: "" }],
          [null, "Another string"]
        ]
      };
      const nums = extractQuestionNumbersFromBlock(tableBlock);
      assert.deepEqual(nums, [7, 8]);
    });
  });

  describe("extractAllHandledQuestionNumbers", () => {
    it("returns empty Set for null, undefined or empty part", () => {
      assert.equal(extractAllHandledQuestionNumbers(null).size, 0);
      assert.equal(extractAllHandledQuestionNumbers(undefined).size, 0);
      assert.equal(extractAllHandledQuestionNumbers({}).size, 0);
    });

    it("collects numbers from single noteBlock, formBlock, or tableBlock", () => {
      const partWithNote = {
        noteBlock: {
          sections: [
            { lines: [{ number: 31 }, { number: 32 }] }
          ]
        }
      };
      const set1 = extractAllHandledQuestionNumbers(partWithNote);
      assert.equal(set1.has(31), true);
      assert.equal(set1.has(32), true);
      assert.equal(set1.has(33), false);

      const partWithForm = {
        formBlock: {
          fields: [{ number: 1 }, { number: 2 }]
        }
      };
      const set2 = extractAllHandledQuestionNumbers(partWithForm);
      assert.equal(set2.has(1), true);
      assert.equal(set2.has(2), true);

      const partWithTable = {
        tableBlock: {
          rows: [[{ number: 9 }, { number: 10 }]]
        }
      };
      const set3 = extractAllHandledQuestionNumbers(partWithTable);
      assert.equal(set3.has(9), true);
      assert.equal(set3.has(10), true);
    });

    it("collects numbers across multiple blocks in contentBlocks", () => {
      const partWithContentBlocks = {
        contentBlocks: [
          {
            type: "form",
            fields: [{ number: 1 }, { number: 2 }, { number: 3 }]
          },
          {
            type: "table",
            rows: [[{ number: 7 }, { number: 8 }]]
          }
        ]
      };
      const set = extractAllHandledQuestionNumbers(partWithContentBlocks);
      assert.equal(set.size, 5);
      assert.equal(set.has(1), true);
      assert.equal(set.has(2), true);
      assert.equal(set.has(3), true);
      assert.equal(set.has(7), true);
      assert.equal(set.has(8), true);
      assert.equal(set.has(9), false);
    });
  });
});

