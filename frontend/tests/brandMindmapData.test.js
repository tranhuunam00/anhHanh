import test from "node:test";
import assert from "node:assert/strict";
import {
  BRAND_MINDMAP_PARTS,
  ALL_BRAND_QUESTIONS,
  BRAND_STATS,
  BRAND_PART_6
} from "../src/data/brandMindmap/index.js";

test("BrandMindmapData - Integrity of Parts and 18 Questions", () => {
  // Must contain 5 content parts
  assert.equal(BRAND_MINDMAP_PARTS.length, 5);

  // Exactly 18 questions
  assert.equal(ALL_BRAND_QUESTIONS.length, 18);
  assert.equal(BRAND_STATS.totalQuestions, 18);

  // Verify sequential numbers 1 to 18
  for (let i = 1; i <= 18; i++) {
    const q = ALL_BRAND_QUESTIONS.find((item) => item.number === `Câu ${i}`);
    assert.ok(q, `Missing Câu ${i} in dataset`);
    assert.ok(q.title && q.title.length > 5, `Câu ${i} missing title`);
    assert.ok(q.summary && q.summary.length > 5, `Câu ${i} missing summary`);
    assert.ok(Array.isArray(q.branches) && q.branches.length > 0, `Câu ${i} must have branches`);

    // Verify branches structure
    q.branches.forEach((b, bIdx) => {
      assert.ok(b.title, `Câu ${i} branch ${bIdx} missing title`);
      assert.ok(["concept", "comparison", "formula", "example"].includes(b.type), `Invalid branch type in Câu ${i}`);
      assert.ok(Array.isArray(b.items) && b.items.length > 0, `Branch ${b.title} has empty items`);
    });
  }
});

test("BrandMindmapData - Verification of Core Academic Models (100% Fidelity)", () => {
  const allText = JSON.stringify(ALL_BRAND_QUESTIONS);

  // Question 1: Brand vs Trademark
  assert.ok(allText.includes("Trademark"), "Missing Trademark");
  assert.ok(allText.includes("CHIN-SU"), "Missing CHIN-SU Masan example");

  // Question 2: TH true MILK & Definitions
  assert.ok(allText.includes("TH true MILK"), "Missing TH true MILK");
  assert.ok(allText.includes("Simon Anholt"), "Missing Simon Anholt");
  assert.ok(allText.includes("Kevin Lane Keller"), "Missing Kevin Lane Keller");

  // Question 3: 4 Functions
  assert.ok(allText.includes("Coca-Cola"), "Missing Coca-Cola example");
  assert.ok(allText.includes("Pepsi"), "Missing Pepsi example");
  assert.ok(allText.includes("Phú Quốc"), "Missing Phú Quốc example");
  assert.ok(allText.includes("Vietjet Air"), "Missing Vietjet Air example");
  assert.ok(allText.includes("Apple"), "Missing Apple price premium example");

  // Question 5: KFC
  assert.ok(allText.includes("Harland Sanders"), "Missing Harland Sanders KFC");

  // Question 6: Unilever
  assert.ok(allText.includes("Unilever"), "Missing Unilever");
  assert.ok(allText.includes("OMO"), "Missing OMO");

  // Question 10: 3C, POP/POD, Benefit Ladder
  assert.ok(allText.includes("Kenichi Ohmae"), "Missing Kenichi Ohmae 3C");
  assert.ok(allText.includes("Points of Parity"), "Missing POPs");
  assert.ok(allText.includes("Points of Difference"), "Missing PODs");
  assert.ok(allText.includes("Brand Benefit Ladder"), "Missing Brand Benefit Ladder");

  // Question 11: Aaker 5 dimensions & Jung 12 archetypes
  assert.ok(allText.includes("Jennifer Aaker"), "Missing Jennifer Aaker");
  assert.ok(allText.includes("Carl Jung"), "Missing Carl Jung 12 archetypes");
  assert.ok(allText.includes("The Magician"), "Missing Magician archetype");
  assert.ok(allText.includes("The Explorer"), "Missing Explorer archetype");

  // Question 13 & 14: David Aaker 5 components & CBBE / FBBE / EBBE
  assert.ok(allText.includes("David Aaker"), "Missing David Aaker");
  assert.ok(allText.includes("Top-of-Mind"), "Missing Top-of-Mind level");
  assert.ok(allText.includes("Brand Resonance Pyramid"), "Missing Keller Pyramid");
  assert.ok(allText.includes("Salience"), "Missing Salience");
  assert.ok(allText.includes("Royalty Relief"), "Missing Royalty Relief");
  assert.ok(allText.includes("Internal Branding"), "Missing Internal Branding EBBE");

  // Question 15: Luật 131/2025/QH15 & ST25
  assert.ok(allText.includes("131/2025/QH15"), "Missing Luật 131/2025/QH15");
  assert.ok(allText.includes("Hồ Quang Cùa"), "Missing Gạo ST25 Hồ Quang Cùa");
  assert.ok(allText.includes("Genericization"), "Missing Genericization");

  // Question 16 & 17: Repositioning Viettel, Biti's Hunter & Franchising
  assert.ok(allText.includes("Viettel"), "Missing Viettel repositioning");
  assert.ok(allText.includes("Biti's Hunter"), "Missing Biti's Hunter");
  assert.ok(allText.includes("Đi để trở về"), "Missing Đi để trở về campaign");
  assert.ok(allText.includes("Cộng Cà Phê"), "Missing Cộng Cà Phê franchising");
  assert.ok(allText.includes("284 Luật Thương mại 2005"), "Missing Đ.284 Luật TM 2005");
  assert.ok(allText.includes("Walt Disney"), "Missing Walt Disney licensing");
});

test("BrandMindmapData - Part 6 Exam Formula and Cheat Sheet", () => {
  const { quickTable, essayFormula } = BRAND_PART_6;

  // 18 items in cheat sheet
  assert.equal(quickTable.length, 18);
  assert.equal(quickTable[0].num, 1);
  assert.equal(quickTable[17].num, 18);

  // 3 steps in essay formula
  assert.equal(essayFormula.steps.length, 3);
  assert.equal(essayFormula.steps[0].step, "Mở bài");
  assert.equal(essayFormula.steps[1].step, "Thân bài");
  assert.equal(essayFormula.steps[2].step, "Kết bài");

  // 4 mandatory quantities (câu 3, 11, 13, 14)
  assert.equal(essayFormula.mandatoryQuantities.length, 4);
});
