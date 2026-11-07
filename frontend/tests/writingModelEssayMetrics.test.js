import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Writing Model Essay Metrics & Under-Length Rules", () => {
  const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  const checkCompliance = (text, minRequired = 150) => {
    const wc = countWords(text);
    return {
      wordCount: wc,
      isCompliant: wc >= minRequired,
      minRequired,
    };
  };

  test("correctly calculates word count for empty and whitespace text", () => {
    assert.equal(countWords(""), 0);
    assert.equal(countWords(null), 0);
    assert.equal(countWords(undefined), 0);
    assert.equal(countWords("   \n\t  "), 0);
  });

  test("correctly identifies under-length model essays below Task 1 threshold (150 words)", () => {
    // 118-word essay like the user had
    const shortEssay = (
      "The pie charts illustrate the proportion of energy consumed by various Australian household appliances " +
      "and the corresponding greenhouse gas emissions. Overall, heating, comprising both space and water heating, " +
      "represents the largest energy consumer and the primary source of greenhouse gas emissions. Regarding electricity " +
      "consumption, heating accounts for 40%, followed by water heating at 30%. Daily appliances constitute 15% of total " +
      "electricity usage, which is approximately double that of lighting and cooling, at 6% and 7% respectively. Turning to the " +
      "greenhouse gas emissions chart, water heating generates the highest proportion. Appliances rank second, accounting for 28%. " +
      "Finally, heating and cooling contribute an equal share to total emissions."
    );
    const result = checkCompliance(shortEssay, 150);
    assert.equal(result.isCompliant, false);
    assert.ok(result.wordCount < 150);
  });

  test("correctly identifies compliant model essays meeting Task 1 standard (>= 150 words)", () => {
    const fullEssay = "word ".repeat(175);
    const result = checkCompliance(fullEssay, 150);
    assert.equal(result.isCompliant, true);
    assert.equal(result.wordCount, 175);
  });

  test("correctly verifies Task 2 standard (>= 250 words)", () => {
    const shortT2 = "word ".repeat(210);
    assert.equal(checkCompliance(shortT2, 250).isCompliant, false);

    const goodT2 = "word ".repeat(285);
    assert.equal(checkCompliance(goodT2, 250).isCompliant, true);
  });
});

