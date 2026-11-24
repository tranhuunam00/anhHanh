import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { fetchGoogleAiWordOverview } from "../src/services/authVocabService.js";

describe("vocabExerciseMobileSwipeAndGoogle - Swipe Direction Logic", () => {
  const resolveSwipeAction = (startX, startY, endX, endY) => {
    if (startX === null || startY === null) return "NONE";
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    // Horizontal threshold must exceed 45px and be greater than vertical movement
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        return "FORGOT"; // Swipe Left -> Chưa nhớ / Chưa thuộc
      }
      return "MASTERED"; // Swipe Right -> Đã thuộc
    }
    return "NONE";
  };

  test("Swipe Right triggers MASTERED (happy path)", () => {
    const action = resolveSwipeAction(100, 200, 180, 210); // deltaX = +80, deltaY = +10
    assert.equal(action, "MASTERED");
  });

  test("Swipe Left triggers FORGOT / CHƯA NHỚ (happy path)", () => {
    const action = resolveSwipeAction(200, 200, 120, 205); // deltaX = -80, deltaY = +5
    assert.equal(action, "FORGOT");
  });

  test("Vertical scroll movement does not trigger swipe actions", () => {
    const actionDown = resolveSwipeAction(100, 100, 110, 200); // deltaY = +100, deltaX = +10
    assert.equal(actionDown, "NONE");

    const actionUp = resolveSwipeAction(100, 200, 115, 100); // deltaY = -100, deltaX = +15
    assert.equal(actionUp, "NONE");
  });

  test("Small tap or slight jitter below threshold does not trigger swipe", () => {
    const smallTap = resolveSwipeAction(100, 100, 120, 105); // deltaX = +20 (<= 45)
    assert.equal(smallTap, "NONE");

    const smallNegativeTap = resolveSwipeAction(100, 100, 85, 100); // deltaX = -15
    assert.equal(smallNegativeTap, "NONE");
  });

  test("Boundary / null coordinates handle gracefully without error", () => {
    assert.equal(resolveSwipeAction(null, null, 100, 100), "NONE");
    assert.equal(resolveSwipeAction(null, 100, 100, 100), "NONE");
  });
});

describe("vocabExerciseMobileSwipeAndGoogle - Google URL & Word Cleaning", () => {
  const cleanWordToken = (w) => (w || "").trim().replace(/^[’'".:,;!?-]+|[’'".:,;!?-]+$/g, "");
  const buildGoogleSearchUrl = (word) => {
    const clean = cleanWordToken(word);
    return `https://www.google.com/search?q=${encodeURIComponent(clean + " là gì và gốc, họ của nó")}`;
  };

  test("cleans surrounding punctuation tokens correctly", () => {
    assert.equal(cleanWordToken('"inadvertently"'), "inadvertently");
    assert.equal(cleanWordToken("'dummy',"), "dummy");
    assert.equal(cleanWordToken("?resilience!"), "resilience");
    assert.equal(cleanWordToken(""), "");
    assert.equal(cleanWordToken(null), "");
  });

  test("builds authentic Google Search query URL with Vietnamese etymology intent", () => {
    const url = buildGoogleSearchUrl("inadvertently");
    assert.match(url, /^https:\/\/www\.google\.com\/search\?q=/);
    assert.ok(url.includes("inadvertently"));
    assert.ok(url.includes(encodeURIComponent("là gì và gốc, họ của nó")));
  });
});

describe("vocabExerciseMobileSwipeAndGoogle - fetchGoogleAiWordOverview", () => {
  test("handles empty or invalid inputs by returning null immediately", async () => {
    assert.equal(await fetchGoogleAiWordOverview(""), null);
    assert.equal(await fetchGoogleAiWordOverview("   "), null);
    assert.equal(await fetchGoogleAiWordOverview(null), null);
    assert.equal(await fetchGoogleAiWordOverview(undefined), null);
  });
});
