import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  segmentParagraphWithEvidences
} from "../src/utils/ieltsEvidenceHighlightUtils.js";

describe("ieltsEvidenceHighlightUtils Unit Tests", () => {
  const p1Text = "The kākāpō is a nocturnal bird. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years. Kākāpō are solitary birds and tend to occupy the same home range for many years.";

  test("returns single text segment when paragraphText is empty or non-string", () => {
    assert.deepEqual(segmentParagraphWithEvidences(""), []);
    assert.deepEqual(segmentParagraphWithEvidences(null), []);
  });

  test("identifies Q1 evidence in Cambridge 20 Test 1 and labels correctness", () => {
    const evalMap = { 1: { isCorrect: false } }; // user got Q1 wrong
    const segments = segmentParagraphWithEvidences(p1Text, "cambridge-20-test-1", evalMap, [1, 6]);

    assert.equal(segments.length, 3);
    assert.equal(segments[0].type, "text");
    assert.equal(segments[0].text, "The kākāpō is a nocturnal bird. ");

    assert.equal(segments[1].type, "evidence");
    assert.equal(segments[1].qNum, 1);
    assert.equal(segments[1].isCorrect, false);
    assert.ok(segments[1].text.includes("the world's only flightless parrot"));

    assert.equal(segments[2].type, "text");
    assert.ok(segments[2].text.includes("Kākāpō are solitary birds"));

    // Verify seamless concatenation reconstructs original text 100%
    const reconstructed = segments.map((s) => s.text).join("");
    assert.equal(reconstructed, p1Text);
  });

  test("handles multiple evidences in same paragraph without overlap", () => {
    const multiEvText = "Kākāpō breed in summer and autumn, but only in years when food is plentiful. Males play no part in incubation or chick-rearing - females alone incubate eggs and feed the chicks.";
    const evalMap = { 2: { isCorrect: true }, 3: { isCorrect: false } };
    const segments = segmentParagraphWithEvidences(multiEvText, "cambridge-20-test-1", evalMap, [1, 6]);

    assert.equal(segments.length, 3);
    assert.equal(segments[0].qNum, 2);
    assert.equal(segments[0].isCorrect, true);
    assert.equal(segments[1].type, "text");
    assert.equal(segments[1].text, " ");
    assert.equal(segments[2].qNum, 3);
    assert.equal(segments[2].isCorrect, false);

    const reconstructed = segments.map((s) => s.text).join("");
    assert.equal(reconstructed, multiEvText);
  });

  test("returns plain segment if no evidences match in paragraph", () => {
    const plainText = "This is a random paragraph without any evidence for the test.";
    const segments = segmentParagraphWithEvidences(plainText, "cambridge-20-test-1", {}, [1, 6]);
    assert.equal(segments.length, 1);
    assert.equal(segments[0].type, "text");
    assert.equal(segments[0].text, plainText);
  });
});
