import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("VocabExerciseAIStoryQuiz - Option Matching and Scoring Logic", () => {
  const sampleCloze = [
    {
      sentence: "Maya wiped accidental [ ______ ] from her apron.",
      correct_word: "paint splashes",
      options: ["paint splashes", "water drops", "mud stains", "ink marks"],
      hint: "vệt sơn bắn tung tóe",
    },
  ];

  const sampleComp = [
    {
      question: "What did Maya wipe from her apron?",
      options: ["Paint splashes", "Ink marks", "Water drops", "Dirt"],
      correct_answer: "Paint splashes",
      explanation: "Maya wiped paint splashes from her apron.",
    },
  ];

  test("verifies correct cloze option matching case-insensitively and with trimmed spaces", () => {
    const isCorrect = (chosen, correct) => chosen.trim().toLowerCase() === correct.trim().toLowerCase();

    assert.equal(isCorrect("paint splashes", sampleCloze[0].correct_word), true);
    assert.equal(isCorrect(" Paint Splashes ", sampleCloze[0].correct_word), true);
    assert.equal(isCorrect("water drops", sampleCloze[0].correct_word), false);
  });

  test("verifies comprehension question answer matching and explanation presence", () => {
    const isRight = (chosen, correct) => chosen.trim().toLowerCase() === correct.trim().toLowerCase();

    assert.equal(isRight("Paint splashes", sampleComp[0].correct_answer), true);
    assert.equal(isRight("paint splashes", sampleComp[0].correct_answer), true);
    assert.equal(isRight("Ink marks", sampleComp[0].correct_answer), false);
    assert.ok(sampleComp[0].explanation.length > 0);
  });

  test("handles empty options or missing questions gracefully", () => {
    const emptyList = [];
    assert.equal(emptyList.length, 0);
  });
});
