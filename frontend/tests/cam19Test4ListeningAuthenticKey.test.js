import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  cambridge19Test4ListeningPart1,
  cambridge19Test4ListeningPart2
} from "../src/data/ielts/cambridge19Test4ListeningParts12.js";
import {
  cambridge19Test4ListeningPart3,
  cambridge19Test4ListeningPart4
} from "../src/data/ielts/cambridge19Test4ListeningParts34.js";

describe("Cambridge 19 Test 4 Listening - 100% Authentic PDF Answer Key Verification", () => {
  it("Part 1: Questions 1 to 10 match authentic Cambridge 19.pdf answer key", () => {
    const items = cambridge19Test4ListeningPart1.items;
    assert.equal(items.length, 10);
    assert.ok(items[0].answers.includes("Kaeden"));
    assert.ok(items[1].answers.includes("locker") || items[1].answers.includes("lockers"));
    assert.ok(items[2].answers.includes("passport"));
    assert.ok(items[3].answers.includes("uniform"));
    assert.ok(items[4].answers.includes("third") || items[4].answers.includes("3rd"));
    assert.ok(items[5].answers.includes("0412 665 903"));
    assert.ok(items[6].answers.includes("yellow"));
    assert.ok(items[7].answers.includes("plastic"));
    assert.ok(items[8].answers.includes("ice"));
    assert.ok(items[9].answers.includes("gloves"));
  });

  it("Part 2: Questions 11 to 20 match authentic Cambridge 19.pdf answer key and audioscript", () => {
    const items = cambridge19Test4ListeningPart2.items;
    assert.equal(items.length, 10);
    // Q11 & Q12: C, E (unsuitable for people with health issues; lack of individual support)
    assert.deepEqual(items[0].answers.sort(), ["C", "E"]);
    assert.deepEqual(items[1].answers.sort(), ["C", "E"]);

    // Q13 & Q14: A, D (doing two runs a week; listening to music during runs)
    assert.deepEqual(items[2].answers.sort(), ["A", "D"]);
    assert.deepEqual(items[3].answers.sort(), ["A", "D"]);

    // Q15 - Ceri: A (a lack of confidence)
    assert.deepEqual(items[4].answers, ["A"]);
    // Q16 - James: B (a dislike of running)
    assert.deepEqual(items[5].answers, ["B"]);
    // Q17 - Leo: C (a lack of time)
    assert.deepEqual(items[6].answers, ["C"]);
    // Q18 - Mark: A (a lack of confidence)
    assert.deepEqual(items[7].answers, ["A"]);

    // Q19 - first marathon: C (nearly gave up before the end)
    assert.deepEqual(items[8].answers, ["C"]);
    // Q20 - sign up for a race: B (within a few weeks of taking up running)
    assert.deepEqual(items[9].answers, ["B"]);
  });

  it("Part 3: Questions 21 to 30 match authentic Cambridge 19.pdf answer key", () => {
    const items = cambridge19Test4ListeningPart3.items;
    assert.equal(items.length, 10);
    assert.deepEqual(items[0].answers, ["C"]); // Q21
    assert.deepEqual(items[1].answers, ["C"]); // Q22
    assert.deepEqual(items[2].answers, ["A"]); // Q23
    assert.deepEqual(items[3].answers, ["B"]); // Q24
    assert.deepEqual(items[4].answers, ["C"]); // Q25
    assert.deepEqual(items[5].answers, ["D"]); // Q26: rare books -> D
    assert.deepEqual(items[6].answers, ["F"]); // Q27: children's books -> F
    assert.deepEqual(items[7].answers, ["A"]); // Q28: unwanted books -> A
    assert.deepEqual(items[8].answers, ["C"]); // Q29: requested books -> C
    assert.deepEqual(items[9].answers, ["G"]); // Q30: coursebooks -> G
  });

  it("Part 4: Questions 31 to 40 match authentic Cambridge 19.pdf answer key", () => {
    const items = cambridge19Test4ListeningPart4.items;
    assert.equal(items.length, 10);
    assert.deepEqual(items[0].answers, ["competition"]);
    assert.deepEqual(items[1].answers, ["food"]);
    assert.deepEqual(items[2].answers, ["disease"]);
    assert.deepEqual(items[3].answers, ["agriculture"]);
    assert.deepEqual(items[4].answers, ["maps"]);
    assert.deepEqual(items[5].answers, ["cattle"]);
    assert.deepEqual(items[6].answers, ["speed"]);
    assert.deepEqual(items[7].answers, ["monkeys"]);
    assert.deepEqual(items[8].answers, ["fishing"]);
    assert.deepEqual(items[9].answers, ["flooding"]);
  });
});
