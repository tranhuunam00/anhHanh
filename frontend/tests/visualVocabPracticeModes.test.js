import test from "node:test";
import assert from "node:assert/strict";
import { isSpellingMatch } from "../src/utils/visualVocabUtils.js";

/**
 * Helper to build MATCH mode word bank
 */
export function buildMatchWordBank(items = [], distractors = []) {
  const targetLabels = (items || []).map((it) => ({
    id: it.id,
    word: it.word,
    ipa: it.ipa || "",
    meaning: it.meaning,
    isDistractor: false,
  }));
  const distractorLabels = (distractors || []).map((d) => ({
    id: d.id || `dist_${d.word}`,
    word: d.word,
    ipa: d.ipa || "",
    meaning: d.meaning,
    isDistractor: true,
  }));
  return [...targetLabels, ...distractorLabels];
}

/**
 * Helper to consume/remove matched label from bank
 */
export function consumeMatchedLabel(bank = [], matchedWord = "") {
  return bank.filter(
    (l) => l.word.toLowerCase().trim() !== matchedWord.toLowerCase().trim()
  );
}

/**
 * Determine whether floating label should be displayed on a canvas pin
 */
export function shouldDisplayFloatingLabel(mode, showLabels, isActive) {
  if (mode !== "EXPLORE") {
    // In practice modes (SPOT_TAP, MATCH, SPELL), NEVER display floating word labels!
    return false;
  }
  return Boolean(showLabels || isActive);
}

test("VisualVocab Practice Modes - MATCH Word Bank & Distractors", async (t) => {
  const sampleItems = [
    { id: "peak", word: "peak", meaning: "Đỉnh núi" },
    { id: "glacier", word: "glacier", meaning: "Sông băng" },
  ];
  const sampleDistractors = [
    { id: "d1", word: "volcano", meaning: "Núi lửa" },
    { id: "d2", word: "canyon", meaning: "Hẻm núi" },
    { id: "d3", word: "waterfall", meaning: "Thác nước" },
    { id: "d4", word: "archipelago", meaning: "Quần đảo" },
    { id: "d5", word: "iceberg", meaning: "Tảng băng trôi" },
    { id: "d6", word: "rainforest", meaning: "Rừng mưa" },
    { id: "d7", word: "tundra", meaning: "Đới lãnh nguyên" },
    { id: "d8", word: "gorge", meaning: "Hẻm vực" },
    { id: "d9", word: "savanna", meaning: "Xavan" },
    { id: "d10", word: "crater", meaning: "Miệng núi lửa" },
  ];

  await t.test("builds bank containing all target words plus >= 10 distractors", () => {
    const bank = buildMatchWordBank(sampleItems, sampleDistractors);
    assert.equal(bank.length, 12);
    const targetCount = bank.filter((b) => !b.isDistractor).length;
    const distractorCount = bank.filter((b) => b.isDistractor).length;
    assert.equal(targetCount, 2);
    assert.equal(distractorCount, 10);
    assert.ok(distractorCount >= 10);
  });

  await t.test("removes correct label from bank upon matching", () => {
    const bank = buildMatchWordBank(sampleItems, sampleDistractors);
    const updated = consumeMatchedLabel(bank, "peak");
    assert.equal(updated.length, 11);
    assert.ok(!updated.some((b) => b.word === "peak"));
    // Other target and distractors remain
    assert.ok(updated.some((b) => b.word === "glacier"));
    assert.ok(updated.some((b) => b.word === "volcano"));
  });

  await t.test("handles case & whitespace insensitivity during match removal", () => {
    const bank = buildMatchWordBank(sampleItems, sampleDistractors);
    const updated = consumeMatchedLabel(bank, "  GLACIER  ");
    assert.equal(updated.length, 11);
    assert.ok(!updated.some((b) => b.word === "glacier"));
  });
});

test("VisualVocab Practice Modes - Canvas Label Suppression in Practice", async (t) => {
  await t.test("suppresses floating label completely in SPOT_TAP, MATCH, and SPELL", () => {
    // Even if isActive is true or showLabels is true, practice modes must NEVER leak the word
    assert.equal(shouldDisplayFloatingLabel("SPOT_TAP", true, true), false);
    assert.equal(shouldDisplayFloatingLabel("MATCH", true, true), false);
    assert.equal(shouldDisplayFloatingLabel("SPELL", true, true), false);
    assert.equal(shouldDisplayFloatingLabel("MATCH", false, true), false);
  });

  await t.test("displays floating label in EXPLORE mode when active or showLabels is true", () => {
    assert.equal(shouldDisplayFloatingLabel("EXPLORE", true, false), true);
    assert.equal(shouldDisplayFloatingLabel("EXPLORE", false, true), true);
    assert.equal(shouldDisplayFloatingLabel("EXPLORE", false, false), false);
  });
});

test("VisualVocab Practice Modes - SPELL Verification", async (t) => {
  await t.test("verifies spelling matches correctly", () => {
    assert.ok(isSpellingMatch("valley", "valley"));
    assert.ok(isSpellingMatch("  Valley  ", "valley"));
    assert.ok(isSpellingMatch("clock tower", "clock-tower"));
    assert.ok(!isSpellingMatch("vally", "valley"));
  });
});
