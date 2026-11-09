import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { IELTS_TESTS } from "../src/data/ielts/index.js";

test("IELTS Writing - Cambridge 17 to 21 full coverage & prompt integrity", () => {
  const books = [17, 18, 19, 20, 21];

  for (const book of books) {
    for (let t = 1; t <= 4; t++) {
      const testId = `cambridge-${book}-test-${t}`;
      const entry = IELTS_TESTS.find((item) => item.id === testId);

      assert.ok(entry, `Test ${testId} must exist in IELTS_TESTS`);
      assert.ok(entry.data, `Test ${testId} must have data`);
      assert.ok(entry.data.skills?.writing, `Test ${testId} must have skills.writing`);

      const writing = entry.data.skills.writing;
      assert.ok(Array.isArray(writing.tasks), `${testId} tasks must be an array`);
      assert.equal(writing.tasks.length, 2, `${testId} must have exactly 2 writing tasks`);

      // Task 1
      const task1 = writing.tasks.find((task) => task.taskNumber === 1);
      assert.ok(task1, `${testId} must have task 1`);
      assert.ok(task1.prompt && task1.prompt.trim().length > 30, `${testId} Task 1 prompt must be non-empty`);
      assert.ok(task1.minWords >= 150, `${testId} Task 1 minWords >= 150`);

      const imgPath = task1.image || task1.imageSrc || task1.diagramImage;
      assert.ok(imgPath, `${testId} Task 1 must have an image path`);
      const diskPath = path.join(process.cwd(), "public", imgPath.replace(/^\//, ""));
      assert.ok(fs.existsSync(diskPath), `Image file must exist on disk: ${diskPath}`);

      // Task 2
      const task2 = writing.tasks.find((task) => task.taskNumber === 2);
      assert.ok(task2, `${testId} must have task 2`);
      assert.ok(task2.prompt && task2.prompt.trim().length > 30, `${testId} Task 2 prompt must be non-empty`);
      assert.ok(task2.minWords >= 250, `${testId} Task 2 minWords >= 250`);
    }
  }
});

