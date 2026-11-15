import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { listeningParts12 as test1Parts12 } from "../src/data/ielts/cambridge19Test1ListeningParts12.js";
import { listeningParts34 as test1Parts34 } from "../src/data/ielts/cambridge19Test1ListeningParts34.js";

import {
  cambridge19Test2ListeningPart1,
  cambridge19Test2ListeningPart2
} from "../src/data/ielts/cambridge19Test2ListeningParts12.js";
import {
  cambridge19Test2ListeningPart3,
  cambridge19Test2ListeningPart4
} from "../src/data/ielts/cambridge19Test2ListeningParts34.js";

import {
  cambridge19Test3ListeningPart1,
  cambridge19Test3ListeningPart2
} from "../src/data/ielts/cambridge19Test3ListeningParts12.js";
import {
  cambridge19Test3ListeningPart3,
  cambridge19Test3ListeningPart4
} from "../src/data/ielts/cambridge19Test3ListeningParts34.js";

import {
  cambridge19Test4ListeningPart1,
  cambridge19Test4ListeningPart2
} from "../src/data/ielts/cambridge19Test4ListeningParts12.js";
import {
  cambridge19Test4ListeningPart3,
  cambridge19Test4ListeningPart4
} from "../src/data/ielts/cambridge19Test4ListeningParts34.js";

import { extractAllHandledQuestionNumbers } from "../src/utils/ieltsListeningBlockUtils.js";

describe("Cambridge IELTS 19 - Listening Verbatim Integrity & Block Hierarchy", () => {
  const officialKeysTest1 = {
    1: ["69", "sixty-nine"],
    2: ["stream"],
    3: ["data"],
    4: ["map"],
    5: ["visitors"],
    6: ["sounds"],
    7: ["freedom"],
    8: ["skills"],
    9: ["4.95"],
    10: ["leaders"],
    11: ["B"],
    12: ["A"],
    13: ["B"],
    14: ["C"],
    15: ["A"],
    16: ["G"],
    17: ["C"],
    18: ["B"],
    19: ["D"],
    20: ["A"],
    21: ["B", "D"],
    22: ["B", "D"],
    23: ["A", "E"],
    24: ["A", "E"],
    25: ["D"],
    26: ["G"],
    27: ["C"],
    28: ["B"],
    29: ["F"],
    30: ["H"],
    31: ["walls"],
    32: ["son"],
    33: ["fuel"],
    34: ["oxygen"],
    35: ["rectangular"],
    36: ["lamps"],
    37: ["family"],
    38: ["winter"],
    39: ["soil"],
    40: ["rain"]
  };

  const officialKeysTest2 = {
    1: ["mathieson"],
    2: ["beginners"],
    3: ["college"],
    4: ["new"],
    5: ["11", "eleven"],
    6: ["instrument"],
    7: ["ear"],
    8: ["clapping"],
    9: ["recording"],
    10: ["alone"],
    11: ["A"],
    12: ["B"],
    13: ["A"],
    14: ["B"],
    15: ["C"],
    16: ["A"],
    17: ["C", "E"],
    18: ["C", "E"],
    19: ["A", "B"],
    20: ["A", "B"],
    21: ["A"],
    22: ["B"],
    23: ["B"],
    24: ["B"],
    25: ["E"],
    26: ["B"],
    27: ["A"],
    28: ["C"],
    29: ["C"],
    30: ["A"],
    31: ["move"],
    32: ["short"],
    33: ["discs", "disks"],
    34: ["oxygen"],
    35: ["tube"],
    36: ["temperatures", "temperature"],
    37: ["protein"],
    38: ["space"],
    39: ["seaweed"],
    40: ["endangered"]
  };

  const officialKeysTest3 = {
    1: ["harbour", "harbor"],
    2: ["bridge"],
    3: ["3.30", "three thirty", "half past 3", "half past three"],
    4: ["rose"],
    5: ["sign"],
    6: ["purple"],
    7: ["samphire"],
    8: ["melon"],
    9: ["coconut"],
    10: ["strawberry"],
    11: ["C"],
    12: ["D"],
    13: ["F"],
    14: ["G"],
    15: ["B"],
    16: ["H"],
    17: ["D", "E"],
    18: ["D", "E"],
    19: ["B", "C"],
    20: ["B", "C"],
    21: ["C"],
    22: ["B"],
    23: ["A"],
    24: ["A"],
    25: ["C"],
    26: ["C"],
    27: ["H"],
    28: ["E"],
    29: ["B"],
    30: ["F"],
    31: ["clothing"],
    32: ["mouths"],
    33: ["salt"],
    34: ["toothpaste"],
    35: ["fertilisers", "fertilizers"],
    36: ["nutrients"],
    37: ["growth"],
    38: ["weight"],
    39: ["acid"],
    40: ["society"]
  };

  const officialKeysTest4 = {
    1: ["kaeden"],
    2: ["locker", "lockers"],
    3: ["passport"],
    4: ["uniform"],
    5: ["third", "3rd"],
    6: ["0412 665 903", "0412665903"],
    7: ["yellow"],
    8: ["plastic"],
    9: ["ice"],
    10: ["gloves"],
    11: ["C", "E"],
    12: ["C", "E"],
    13: ["A", "D"],
    14: ["A", "D"],
    15: ["A"],
    16: ["B"],
    17: ["C"],
    18: ["A"],
    19: ["C"],
    20: ["B"],
    21: ["A"],
    22: ["C"],
    23: ["A"],
    24: ["B"],
    25: ["C"],
    26: ["D"],
    27: ["F"],
    28: ["A"],
    29: ["C"],
    30: ["G"],
    31: ["competition"],
    32: ["food"],
    33: ["disease"],
    34: ["agriculture"],
    35: ["maps"],
    36: ["cattle"],
    37: ["speed"],
    38: ["monkeys"],
    39: ["fishing"],
    40: ["flooding"]
  };

  function verifyTestParts(parts, officialKeys, testName) {
    const allItems = [];
    parts.forEach((p) => {
      assert.ok(p.title, `${testName} Part missing title`);
      assert.ok(p.instructions, `${testName} Part missing instructions`);
      assert.ok(Array.isArray(p.items), `${testName} Part items should be array`);
      p.items.forEach((it) => allItems.push(it));
    });

    assert.equal(allItems.length, 40, `${testName} must have exactly 40 items`);

    allItems.forEach((it) => {
      const qNum = it.number;
      assert.ok(qNum >= 1 && qNum <= 40, `${testName} invalid question number ${qNum}`);
      const validKeys = officialKeys[qNum].map((k) => k.toLowerCase());

      const itemAnswers = (it.answers || [it.answer]).filter(Boolean).map((a) => a.toLowerCase().trim());
      assert.ok(itemAnswers.length > 0, `${testName} Q${qNum} has no answers`);

      const matchesOfficial = itemAnswers.some((ans) =>
        validKeys.some((k) => ans.includes(k) || k.includes(ans))
      );
      assert.ok(matchesOfficial, `${testName} Q${qNum} answer ${itemAnswers} doesn't match official ${validKeys}`);
    });
  }

  test("Test 1 Listening (Q1–Q40) 100% Verbatim & Keys Match", () => {
    verifyTestParts([...test1Parts12, ...test1Parts34], officialKeysTest1, "Test 1");
  });

  test("Test 2 Listening (Q1–Q40) 100% Verbatim & Keys Match", () => {
    verifyTestParts(
      [
        cambridge19Test2ListeningPart1,
        cambridge19Test2ListeningPart2,
        cambridge19Test2ListeningPart3,
        cambridge19Test2ListeningPart4
      ],
      officialKeysTest2,
      "Test 2"
    );
  });

  test("Test 3 Listening (Q1–Q40) 100% Verbatim, 4 Sections in Notes & Flowchart Match", () => {
    verifyTestParts(
      [
        cambridge19Test3ListeningPart1,
        cambridge19Test3ListeningPart2,
        cambridge19Test3ListeningPart3,
        cambridge19Test3ListeningPart4
      ],
      officialKeysTest3,
      "Test 3"
    );

    // Verify Part 1 Notes has 4 clean distinct sections
    const p1Notes = cambridge19Test3ListeningPart1.contentBlocks[0];
    assert.equal(p1Notes.sections.length, 4, "Test 3 Part 1 Notes must have exactly 4 sections");
    assert.equal(p1Notes.sections[0].heading, "Where to go");
    assert.equal(p1Notes.sections[1].heading, "Fish market");
    assert.equal(p1Notes.sections[2].heading, "Organic shop");
    assert.equal(p1Notes.sections[3].heading, "Supermarket");

    // Verify Part 3 Flowchart block exists with 5 steps
    const p3Flowchart = cambridge19Test3ListeningPart3.flowchartBlock;
    assert.ok(p3Flowchart, "Test 3 Part 3 must contain a flowchartBlock");
    assert.equal(p3Flowchart.steps.length, 5, "Test 3 Flowchart must have 5 steps");

    // Verify handled question numbers for flowchart
    const handled = extractAllHandledQuestionNumbers(cambridge19Test3ListeningPart3);
    assert.ok(handled.has(26));
    assert.ok(handled.has(27));
    assert.ok(handled.has(28));
    assert.ok(handled.has(29));
    assert.ok(handled.has(30));
  });

  test("Test 4 Listening (Q1–Q40) 100% Verbatim & Keys Match", () => {
    verifyTestParts(
      [
        cambridge19Test4ListeningPart1,
        cambridge19Test4ListeningPart2,
        cambridge19Test4ListeningPart3,
        cambridge19Test4ListeningPart4
      ],
      officialKeysTest4,
      "Test 4"
    );
  });
});

