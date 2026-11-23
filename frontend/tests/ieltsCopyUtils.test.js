import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatReadingTestForCopy,
  formatListeningTestForCopy,
  formatWritingTestForCopy,
  formatSpeakingTestForCopy,
  generateIeltsCopyText,
  copyTextToClipboard
} from "../src/utils/ieltsCopyUtils.js";

describe("ieltsCopyUtils Unit Tests", () => {
  const sampleReadingData = {
    passages: [
      {
        passageNumber: 1,
        title: "The Kākāpō Parrot",
        subtitle: "A flightless nocturnal bird",
        paragraphs: [
          { id: "Paragraph 1", text: "The kākāpō is a rare nocturnal parrot." },
          { id: "Paragraph 2", text: "Before human settlement, it lived across NZ." }
        ],
        groups: [
          {
            instructions: "Write TRUE, FALSE or NOT GIVEN.",
            numbers: [1, 2],
            items: [
              { number: 1, statement: "Kākāpō can fly high in the sky.", answer: "FALSE" },
              { number: 2, statement: "Adults produce chicks every season.", answer: "FALSE" }
            ]
          }
        ]
      }
    ]
  };

  const sampleListeningData = {
    parts: [
      {
        partNumber: 1,
        title: "Workshops for Kids",
        instructions: "Complete notes with ONE WORD.",
        noteBlock: {
          title: "Engineering Workshop",
          sections: [
            {
              heading: "Activities",
              lines: [
                { prefix: "Make a cover for an ", number: 1, suffix: " safely." }
              ]
            }
          ]
        },
        items: [
          { number: 1, prefix: "Make a cover for an ", suffix: " safely.", answer: "egg" }
        ]
      }
    ]
  };

  describe("formatReadingTestForCopy", () => {
    it("formats reading test passages, questions, and answer key cleanly", () => {
      const text = formatReadingTestForCopy(sampleReadingData, "Cambridge 20 Test 1");
      assert.ok(text.includes("CAMBRIDGE 20 TEST 1"));
      assert.ok(text.includes("READING PASSAGE 1: The Kākāpō Parrot"));
      assert.ok(text.includes("The kākāpō is a rare nocturnal parrot."));
      assert.ok(text.includes("Câu 1: Kākāpō can fly high in the sky."));
      assert.ok(text.includes("=> Đáp án chuẩn: FALSE"));
      assert.ok(text.includes("BẢNG TỔNG KẾT ĐÁP ÁN READING (ANSWER KEY):"));
    });

    it("includes user answers and correctness if evaluation map is passed", () => {
      const userAnswers = { 1: "TRUE", 2: "FALSE" };
      const evaluation = {
        1: { isCorrect: false, accepted: ["FALSE"] },
        2: { isCorrect: true, accepted: ["FALSE"] }
      };
      const text = formatReadingTestForCopy(sampleReadingData, "Cambridge 20 Test 1", userAnswers, evaluation);
      assert.ok(text.includes('Bài làm: "TRUE" (Chưa đúng)'));
      assert.ok(text.includes('Bài làm: "FALSE" (Đúng)'));
    });

    it("handles null or undefined reading data gracefully", () => {
      assert.strictEqual(formatReadingTestForCopy(null), "");
      assert.strictEqual(formatReadingTestForCopy(undefined), "");
    });
  });

  describe("formatListeningTestForCopy", () => {
    it("formats listening test parts, noteBlock, questions, and answer key cleanly", () => {
      const text = formatListeningTestForCopy(sampleListeningData, "Cambridge 20 Test 1");
      assert.ok(text.includes("CAMBRIDGE 20 TEST 1"));
      assert.ok(text.includes("LISTENING PART 1: Workshops for Kids"));
      assert.ok(text.includes("Engineering Workshop"));
      assert.ok(text.includes("Câu 1: Make a cover for an  [ 1 ]  safely."));
      assert.ok(text.includes("=> Đáp án chuẩn: egg"));
      assert.ok(text.includes("BẢNG TỔNG KẾT ĐÁP ÁN LISTENING (ANSWER KEY):"));
    });

    it("handles null or undefined listening data safely", () => {
      assert.strictEqual(formatListeningTestForCopy(null), "");
    });
  });

  describe("formatWritingTestForCopy", () => {
    it("formats writing tasks prompts and instructions", () => {
      const writingData = {
        tasks: [
          { taskNumber: 1, prompt: "The chart shows water consumption.", instructions: ["Summarise information."] },
          { taskNumber: 2, prompt: "Some people think education is key.", instructions: ["Give reasons."] }
        ]
      };
      const text = formatWritingTestForCopy(writingData, "Cambridge 21 Test 2");
      assert.ok(text.includes("TASK 1: Report / Diagram"));
      assert.ok(text.includes("The chart shows water consumption."));
      assert.ok(text.includes("TASK 2: Essay Writing"));
      assert.ok(text.includes("Some people think education is key."));
    });

    it("handles null or empty writing data safely", () => {
      assert.strictEqual(formatWritingTestForCopy(null), "");
    });
  });

  describe("formatSpeakingTestForCopy", () => {
    it("formats speaking parts, cue card, and interview questions", () => {
      const speakingData = {
        parts: [
          { partNumber: 1, title: "Warm-up", questions: [{ text: "Where do you live?" }] },
          {
            partNumber: 2,
            title: "Long Turn",
            cueCard: { topic: "Describe a memorable journey", bullets: ["Where you went", "Who you went with"] }
          }
        ]
      };
      const text = formatSpeakingTestForCopy(speakingData, "Cambridge 21 Test 2");
      assert.ok(text.includes("PART 1: Warm-up"));
      assert.ok(text.includes("Where do you live?"));
      assert.ok(text.includes("PART 2: Long Turn"));
      assert.ok(text.includes("Describe a memorable journey"));
    });

    it("handles null or empty speaking data safely", () => {
      assert.strictEqual(formatSpeakingTestForCopy(null), "");
    });
  });

  describe("generateIeltsCopyText", () => {
    const fullTestData = {
      title: "Cambridge IELTS 20 - Test 1",
      skills: {
        reading: sampleReadingData,
        listening: sampleListeningData
      }
    };

    it("dispatches to reading when activeSkill is reading", () => {
      const text = generateIeltsCopyText({ testData: fullTestData, activeSkill: "reading" });
      assert.ok(text.includes("READING (ĐỌC HIỂU"));
      assert.ok(text.includes("The Kākāpō Parrot"));
    });

    it("dispatches to listening when activeSkill is listening", () => {
      const text = generateIeltsCopyText({ testData: fullTestData, activeSkill: "listening" });
      assert.ok(text.includes("LISTENING (NGHE HIỂU"));
      assert.ok(text.includes("Workshops for Kids"));
    });

    it("falls back to reading safely on unknown skill or missing fields", () => {
      const text = generateIeltsCopyText({ testData: fullTestData, activeSkill: "unknown" });
      assert.ok(text.includes("READING"));
    });
  });

  describe("copyTextToClipboard", () => {
    it("returns false safely when text is null or empty", async () => {
      const res = await copyTextToClipboard("");
      assert.strictEqual(res, false);
      const resNull = await copyTextToClipboard(null);
      assert.strictEqual(resNull, false);
    });

    it("handles Node test environment without crash and returns boolean", async () => {
      const res = await copyTextToClipboard("Some sample text");
      assert.strictEqual(typeof res, "boolean");
    });
  });
});
