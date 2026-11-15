import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { cambridge19Test1Writing } from "../src/data/ielts/cambridge19Test1Writing.js";
import { cambridge19Test2Writing } from "../src/data/ielts/cambridge19Test2Writing.js";
import { cambridge19Test3Writing } from "../src/data/ielts/cambridge19Test3Writing.js";
import { cambridge19Test4Writing } from "../src/data/ielts/cambridge19Test4Writing.js";

const CAM19_WRITING = [
  { testNum: 1, data: cambridge19Test1Writing },
  { testNum: 2, data: cambridge19Test2Writing },
  { testNum: 3, data: cambridge19Test3Writing },
  { testNum: 4, data: cambridge19Test4Writing }
];

test("Cambridge 19 Writing - Full Task 1 & Task 2 Authentic Integrity", () => {
  for (const { testNum, data } of CAM19_WRITING) {
    assert.equal(data.testId, `cambridge-19-test-${testNum}`);
    assert.equal(data.tasks.length, 2);

    // Task 1
    const t1 = data.tasks.find((t) => t.taskNumber === 1);
    assert.ok(t1, `Test ${testNum} must have Task 1`);
    assert.equal(t1.minWords, 150);
    assert.ok(t1.timeSuggestion.includes("20 minutes"));
    assert.ok(t1.diagramTitle && t1.diagramTitle.length > 5);
    assert.ok(t1.image.startsWith("/images/ielts/cam19_test"));

    const diskPath = path.join(process.cwd(), "public", t1.image.replace(/^\//, ""));
    assert.ok(fs.existsSync(diskPath), `Task 1 image must exist at ${diskPath}`);
    const stats = fs.statSync(diskPath);
    assert.ok(stats.size > 10000, `Task 1 image must be non-empty (size: ${stats.size})`);

    // Task 2
    const t2 = data.tasks.find((t) => t.taskNumber === 2);
    assert.ok(t2, `Test ${testNum} must have Task 2`);
    assert.equal(t2.minWords, 250);
    assert.ok(t2.timeSuggestion.includes("40 minutes"));
    assert.ok(t2.prompt.includes("Give reasons for your answer"));
  }

  // Exact Topic Verification
  assert.ok(cambridge19Test1Writing.tasks[0].prompt.includes("Melbourne, Australia"));
  assert.ok(cambridge19Test1Writing.tasks[1].prompt.includes("competition at work, at school"));

  assert.ok(cambridge19Test2Writing.tasks[0].prompt.includes("harbour in 2000"));
  assert.ok(cambridge19Test2Writing.tasks[1].prompt.includes("working week should be shorter"));

  assert.ok(cambridge19Test3Writing.tasks[0].prompt.includes("biofuel called ethanol"));
  assert.ok(cambridge19Test3Writing.tasks[1].prompt.includes("save money for their future"));

  assert.ok(cambridge19Test4Writing.tasks[0].prompt.includes("dance classes"));
  assert.ok(cambridge19Test4Writing.tasks[1].prompt.includes("consumers can go to a supermarket"));
});

