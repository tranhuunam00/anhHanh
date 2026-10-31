import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getPartQuestions,
  getDefaultQuestionTimeLimit,
  formatSpeakingTimer,
  computeSpeakingProgress
} from "../src/utils/ieltsSpeakingUtils.js";

describe("ieltsSpeakingUtils - getPartQuestions", () => {
  it("Input Coverage: handles null, undefined, empty part safely", () => {
    assert.deepEqual(getPartQuestions(null), []);
    assert.deepEqual(getPartQuestions(undefined), []);
    assert.deepEqual(getPartQuestions({}), []);
  });

  it("Part 1: normalizes simple questions list with sequential 1-based IDs", () => {
    const part1 = {
      partNumber: 1,
      questions: [
        { id: 101, text: "Do you work or study?" },
        { id: 102, text: "Where do you live?" }
      ]
    };
    const res = getPartQuestions(part1);
    assert.equal(res.length, 2);
    assert.equal(res[0].id, 1);
    assert.equal(res[0].originalId, 101);
    assert.equal(res[0].text, "Do you work or study?");
    assert.equal(res[1].id, 2);
  });

  it("Part 2: returns single cue card item with prep and speaking times", () => {
    const part2 = {
      partNumber: 2,
      cueCard: {
        topic: "Describe a memorable journey",
        prompts: ["where you went", "who with"]
      },
      prepTimeSeconds: 60,
      speakingTimeSeconds: 120
    };
    const res = getPartQuestions(part2);
    assert.equal(res.length, 1);
    assert.equal(res[0].isCueCard, true);
    assert.equal(res[0].topic, "Describe a memorable journey");
    assert.equal(res[0].prepTimeSeconds, 60);
    assert.equal(res[0].speakingTimeSeconds, 120);
  });

  it("Part 3: flattens nested thematic sections into a continuous question list", () => {
    const part3 = {
      partNumber: 3,
      sections: [
        {
          theme: "Education",
          questions: [
            { id: 1, text: "Is schooling important?" },
            { id: 2, text: "How has technology changed learning?" }
          ]
        },
        {
          theme: "Future trends",
          questions: [
            { id: 3, text: "Will teachers be replaced by AI?" }
          ]
        }
      ]
    };
    const res = getPartQuestions(part3);
    assert.equal(res.length, 3);
    assert.equal(res[0].id, 1);
    assert.equal(res[0].theme, "Education");
    assert.equal(res[1].id, 2);
    assert.equal(res[2].id, 3);
    assert.equal(res[2].theme, "Future trends");
    assert.equal(res[2].text, "Will teachers be replaced by AI?");
  });
});

describe("ieltsSpeakingUtils - getDefaultQuestionTimeLimit", () => {
  it("Output Verification: returns correct default seconds for Part 1, 2, 3", () => {
    assert.equal(getDefaultQuestionTimeLimit(1), 45);
    assert.equal(getDefaultQuestionTimeLimit(2), 120);
    assert.equal(getDefaultQuestionTimeLimit(3), 60);
  });

  it("Boundary handling: falls back to 45s for unknown parts", () => {
    assert.equal(getDefaultQuestionTimeLimit(0), 45);
    assert.equal(getDefaultQuestionTimeLimit(99), 45);
    assert.equal(getDefaultQuestionTimeLimit(null), 45);
  });
});

describe("ieltsSpeakingUtils - formatSpeakingTimer", () => {
  it("Happy Path: formats standard seconds correctly into MM:SS", () => {
    assert.equal(formatSpeakingTimer(0), "00:00");
    assert.equal(formatSpeakingTimer(45), "00:45");
    assert.equal(formatSpeakingTimer(60), "01:00");
    assert.equal(formatSpeakingTimer(125), "02:05");
  });

  it("Boundary & Error Handling: handles negative numbers, null, non-numbers safely", () => {
    assert.equal(formatSpeakingTimer(-10), "00:00");
    assert.equal(formatSpeakingTimer(null), "00:00");
    assert.equal(formatSpeakingTimer("invalid"), "00:00");
    assert.equal(formatSpeakingTimer("44"), "00:44");
  });
});

describe("ieltsSpeakingUtils - computeSpeakingProgress", () => {
  const sampleParts = [
    {
      partNumber: 1,
      questions: [{ id: 1 }, { id: 2 }]
    },
    {
      partNumber: 2,
      cueCard: { topic: "Test topic" }
    },
    {
      partNumber: 3,
      questions: [{ id: 1 }, { id: 2 }]
    }
  ];

  it("Happy Path: computes correct percentage when some questions are answered", () => {
    const answeredMap = {
      p1_q1: true,
      p1_q2: true,
      p2_q1: true
    };
    // Total = 2 + 1 + 2 = 5 questions. Answered = 3. 3/5 = 60%
    const progress = computeSpeakingProgress(sampleParts, answeredMap);
    assert.equal(progress.total, 5);
    assert.equal(progress.answered, 3);
    assert.equal(progress.percentage, 60);
  });

  it("Boundary & Edge cases: empty parts or empty answered map", () => {
    const emptyProgress = computeSpeakingProgress([], {});
    assert.deepEqual(emptyProgress, { total: 0, answered: 0, percentage: 0 });

    const zeroProgress = computeSpeakingProgress(sampleParts, {});
    assert.deepEqual(zeroProgress, { total: 5, answered: 0, percentage: 0 });
  });
});

