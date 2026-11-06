import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  IELTS_TASK_TABS,
  CAMBRIDGE_19_LESSONS,
  CAMBRIDGE_19_FULL_LESSONS,
  CAMBRIDGE_20_LESSONS,
  CAMBRIDGE_21_LESSONS,
  filterIeltsLessons
} from "../src/constants/ieltsCambridgePresets.js";

describe("ieltsCambridgePresets Unit Tests", () => {
  describe("IELTS_TASK_TABS Integrity", () => {
    it("happy path: contains all 6 navigation tabs with labels and descriptions", () => {
      assert.equal(IELTS_TASK_TABS.length, 6);
      const tabIds = IELTS_TASK_TABS.map((t) => t.id);
      assert.deepEqual(tabIds, ["all", "task1", "task2", "task3", "task4", "full"]);
      IELTS_TASK_TABS.forEach((tab) => {
        assert.ok(tab.label && tab.label.length > 0, `Tab ${tab.id} must have a label`);
        assert.ok(tab.desc && tab.desc.length > 0, `Tab ${tab.id} must have a description`);
      });
    });
  });

  describe("CAMBRIDGE_19_LESSONS Data Integrity (16 Separate Task Parts)", () => {
    it("happy path: contains exactly 16 lessons across 4 tests (4 tasks each)", () => {
      assert.equal(CAMBRIDGE_19_LESSONS.length, 16);
    });

    it("verifies all lessons have isSplit === true and book === 'Cambridge 19'", () => {
      CAMBRIDGE_19_LESSONS.forEach((lesson) => {
        assert.equal(lesson.book, "Cambridge 19");
        assert.equal(lesson.isSplit, true);
        assert.ok(lesson.testNumber >= 1 && lesson.testNumber <= 4);
        assert.ok(lesson.taskNumber >= 1 && lesson.taskNumber <= 4);
        assert.equal(lesson.taskKey, `task${lesson.taskNumber}`);
      });
    });

    it("verifies each lesson has complete metadata and valid authentic local audio URL format", () => {
      CAMBRIDGE_19_LESSONS.forEach((lesson) => {
        assert.ok(lesson.id && lesson.id.startsWith("cam19-"));
        assert.ok(lesson.title && lesson.title.includes("Cam 19 - Test"));
        assert.ok(lesson.summary && lesson.summary.length > 10);
        assert.ok(lesson.duration && lesson.duration.includes(":"));
        assert.ok(lesson.audioUrl && lesson.audioUrl.startsWith("/audio/"));
        assert.ok(lesson.url && lesson.url.startsWith("/audio/"));
        assert.ok(!lesson.url.includes("youtube.com"));
        assert.ok(lesson.author && lesson.author.length > 0);
        assert.ok(lesson.diffColor && lesson.diffColor.startsWith("#"));
      });
    });

    it("internal logic: each test has exactly 4 distinct tasks (Task 1, 2, 3, 4)", () => {
      for (let testNum = 1; testNum <= 4; testNum++) {
        const testTasks = CAMBRIDGE_19_LESSONS.filter((l) => l.testNumber === testNum);
        assert.equal(testTasks.length, 4);
        const taskNums = testTasks.map((l) => l.taskNumber).sort();
        assert.deepEqual(taskNums, [1, 2, 3, 4]);
      }
    });

    it("verifies specific titles for Test 1 through 4 tasks match Cambridge 19 syllabus", () => {
      // Test 1 Task 1: Hinchingbrooke Country Park
      const t1s1 = CAMBRIDGE_19_LESSONS.find((l) => l.id === "cam19-t1-s1");
      assert.ok(t1s1 && t1s1.title.includes("Hinchingbrooke Country Park"));

      // Test 2 Task 1: Guitar Group Lessons
      const t2s1 = CAMBRIDGE_19_LESSONS.find((l) => l.id === "cam19-t2-s1");
      assert.ok(t2s1 && t2s1.title.includes("Guitar Group Lessons"));

      // Test 3 Task 1: Local Food Shops & Produce
      const t3s1 = CAMBRIDGE_19_LESSONS.find((l) => l.id === "cam19-t3-s1");
      assert.ok(t3s1 && t3s1.title.includes("Local Food Shops & Produce"));

      // Test 4 Task 1: First Day at Supermarket Job
      const t4s1 = CAMBRIDGE_19_LESSONS.find((l) => l.id === "cam19-t4-s1");
      assert.ok(t4s1 && t4s1.title.includes("First Day at Supermarket Job"));
    });
  });

  describe("CAMBRIDGE_19_FULL_LESSONS Data Integrity (4 Full Combined Tests)", () => {
    it("happy path: contains exactly 4 full combined test lessons", () => {
      assert.equal(CAMBRIDGE_19_FULL_LESSONS.length, 4);
    });

    it("verifies all full lessons have isSplit === false and taskKey === 'full'", () => {
      CAMBRIDGE_19_FULL_LESSONS.forEach((lesson) => {
        assert.equal(lesson.book, "Cambridge 19");
        assert.equal(lesson.isSplit, false);
        assert.equal(lesson.taskKey, "full");
        assert.equal(lesson.taskNumber, "full");
        assert.ok(lesson.badge.includes("Gộp 4 phần"));
        assert.ok(lesson.title.includes("Full 4 Tasks"));
        assert.ok(lesson.audioUrl && lesson.audioUrl.startsWith("/audio/"));
        assert.ok(lesson.url && lesson.url.startsWith("/audio/"));
        assert.ok(!lesson.url.includes("youtube.com"));
      });
    });
  });

  describe("CAMBRIDGE_20_LESSONS Data Integrity (16 Separate Task Parts)", () => {
    it("happy path: contains exactly 16 lessons across 4 tests (4 tasks each)", () => {
      assert.equal(CAMBRIDGE_20_LESSONS.length, 16);
    });

    it("verifies all lessons have isSplit === true and book === 'Cambridge 20'", () => {
      CAMBRIDGE_20_LESSONS.forEach((lesson) => {
        assert.equal(lesson.book, "Cambridge 20");
        assert.equal(lesson.isSplit, true);
        assert.ok(lesson.testNumber >= 1 && lesson.testNumber <= 4);
        assert.ok(lesson.taskNumber >= 1 && lesson.taskNumber <= 4);
        assert.equal(lesson.taskKey, `task${lesson.taskNumber}`);
      });
    });

    it("verifies each lesson has complete metadata and valid authentic local audio URL format", () => {
      CAMBRIDGE_20_LESSONS.forEach((lesson) => {
        assert.ok(lesson.id && lesson.id.startsWith("cam20-"));
        assert.ok(lesson.title && lesson.title.includes("Cam 20 - Test"));
        assert.ok(lesson.summary && lesson.summary.length > 10);
        assert.ok(lesson.duration && lesson.duration.includes(":"));
        assert.ok(lesson.audioUrl && lesson.audioUrl.startsWith("/audio/"));
        assert.ok(lesson.url && lesson.url.startsWith("/audio/"));
        assert.ok(!lesson.url.includes("youtube.com"));
        assert.ok(lesson.author && lesson.author.length > 0);
        assert.ok(lesson.diffColor && lesson.diffColor.startsWith("#"));
      });
    });

    it("internal logic: each test has exactly 4 distinct tasks (Task 1, 2, 3, 4)", () => {
      for (let testNum = 1; testNum <= 4; testNum++) {
        const testTasks = CAMBRIDGE_20_LESSONS.filter((l) => l.testNumber === testNum);
        assert.equal(testTasks.length, 4);
        const taskNums = testTasks.map((l) => l.taskNumber).sort();
        assert.deepEqual(taskNums, [1, 2, 3, 4]);
      }
    });
  });

  describe("CAMBRIDGE_21_LESSONS Data Integrity (4 Merged Full Tests)", () => {
    it("happy path: contains exactly 4 full combined test lessons", () => {
      assert.equal(CAMBRIDGE_21_LESSONS.length, 4);
    });

    it("verifies all lessons have isSplit === false and taskKey === 'full'", () => {
      CAMBRIDGE_21_LESSONS.forEach((lesson) => {
        assert.equal(lesson.book, "Cambridge 21");
        assert.equal(lesson.isSplit, false);
        assert.equal(lesson.taskKey, "full");
        assert.equal(lesson.taskNumber, "full");
        assert.ok(lesson.badge.includes("Gộp 4 phần"));
        assert.ok(lesson.title.includes("Full 4 Tasks"));
        assert.ok(lesson.audioUrl && lesson.audioUrl.startsWith("/audio/"));
        assert.ok(lesson.url && lesson.url.startsWith("/audio/"));
        assert.ok(!lesson.url.includes("youtube.com"));
      });
    });
  });

  describe("filterIeltsLessons Function Tests", () => {
    it("happy path: filters Cambridge 19 & 20 by specific taskKey ('task1')", () => {
      const task1Cam19 = filterIeltsLessons(CAMBRIDGE_19_LESSONS, "task1");
      assert.equal(task1Cam19.length, 4);
      task1Cam19.forEach((l) => assert.equal(l.taskKey, "task1"));

      const task1Cam20 = filterIeltsLessons(CAMBRIDGE_20_LESSONS, "task1");
      assert.equal(task1Cam20.length, 4);
      task1Cam20.forEach((l) => assert.equal(l.taskKey, "task1"));
    });

    it("happy path: filters Cambridge 19 by 'task2', 'task3', 'task4'", () => {
      ["task2", "task3", "task4"].forEach((task) => {
        const filtered = filterIeltsLessons(CAMBRIDGE_19_LESSONS, task);
        assert.equal(filtered.length, 4);
        filtered.forEach((l) => assert.equal(l.taskKey, task));
      });
    });

    it("happy path: returns all lessons when filter is 'all' or empty string", () => {
      const all1 = filterIeltsLessons(CAMBRIDGE_19_LESSONS, "all");
      assert.equal(all1.length, 16);

      const all2 = filterIeltsLessons(CAMBRIDGE_19_LESSONS, "");
      assert.equal(all2.length, 16);

      const all3 = filterIeltsLessons(CAMBRIDGE_19_LESSONS);
      assert.equal(all3.length, 16);
    });

    it("boundary case: filters Cambridge 19 Full and Cambridge 21 by 'full'", () => {
      const fullCam19 = filterIeltsLessons(CAMBRIDGE_19_FULL_LESSONS, "full");
      assert.equal(fullCam19.length, 4);

      const fullCam21 = filterIeltsLessons(CAMBRIDGE_21_LESSONS, "full");
      assert.equal(fullCam21.length, 4);
    });

    it("boundary case: filters Cambridge 19 split by 'full' returns empty array (is split)", () => {
      const res = filterIeltsLessons(CAMBRIDGE_19_LESSONS, "full");
      assert.equal(res.length, 0);
    });

    it("error & exception handling: handles null, undefined, or non-array inputs safely", () => {
      assert.deepEqual(filterIeltsLessons(null, "task1"), []);
      assert.deepEqual(filterIeltsLessons(undefined, "task1"), []);
      assert.deepEqual(filterIeltsLessons("not-an-array", "task1"), []);
      assert.deepEqual(filterIeltsLessons({}, "task1"), []);
    });

    it("edge case: non-existent task key returns empty array", () => {
      const res = filterIeltsLessons(CAMBRIDGE_19_LESSONS, "non_existent_task_99");
      assert.equal(res.length, 0);
    });
  });
});
