import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getEffectiveTopicText,
  computePromptKey,
  shouldResetTabItems,
  shouldResetAiOutline,
  getTabPaneStyle,
} from "../src/utils/writingTabPersistenceUtils.js";

describe("writingTabPersistenceUtils Unit Tests", () => {
  describe("getEffectiveTopicText", () => {
    it("happy path: uses effectivePromptText when provided and trimmed", () => {
      const res = getEffectiveTopicText("  Should artificial intelligence replace teachers?  ", null);
      assert.equal(res, "Should artificial intelligence replace teachers?");
    });

    it("fallback to currentPrompt.prompt when effectivePromptText is empty or whitespace", () => {
      const prompt = { prompt: "Is space exploration worth the investment?" };
      assert.equal(getEffectiveTopicText("", prompt), "Is space exploration worth the investment?");
      assert.equal(getEffectiveTopicText("   ", prompt), "Is space exploration worth the investment?");
      assert.equal(getEffectiveTopicText(null, prompt), "Is space exploration worth the investment?");
      assert.equal(getEffectiveTopicText(undefined, prompt), "Is space exploration worth the investment?");
    });

    it("fallback to currentPrompt.topic or currentPrompt.title when prompt is missing", () => {
      assert.equal(getEffectiveTopicText(null, { topic: "Environmental Protection" }), "Environmental Protection");
      assert.equal(getEffectiveTopicText(null, { title: "Climate Change Solutions" }), "Climate Change Solutions");
    });

    it("boundary / bad input: returns default IELTS Essay Writing when all inputs are missing or invalid", () => {
      assert.equal(getEffectiveTopicText(null, null), "IELTS Essay Writing");
      assert.equal(getEffectiveTopicText(undefined, undefined), "IELTS Essay Writing");
      assert.equal(getEffectiveTopicText("", {}), "IELTS Essay Writing");
      assert.equal(getEffectiveTopicText(12345, { prompt: 999 }), "IELTS Essay Writing");
    });
  });

  describe("computePromptKey", () => {
    it("happy path: returns prompt.id converted to string", () => {
      assert.equal(computePromptKey({ id: 101, prompt: "Some text" }, "Custom"), "101");
      assert.equal(computePromptKey({ id: "task2_education", prompt: "Some text" }, "Custom"), "task2_education");
    });

    it("fallback to currentPrompt.prompt when id is missing or null", () => {
      const prompt = { prompt: "  Economic Growth vs Environment  " };
      assert.equal(computePromptKey(prompt, "Custom"), "Economic Growth vs Environment");
    });

    it("fallback to effectivePromptText when currentPrompt is null or empty", () => {
      assert.equal(computePromptKey(null, "  My custom topic text  "), "My custom topic text");
      assert.equal(computePromptKey({}, "My custom topic text"), "My custom topic text");
    });

    it("boundary / edge cases: returns empty string when neither prompt nor effectivePromptText exists", () => {
      assert.equal(computePromptKey(null, null), "");
      assert.equal(computePromptKey(undefined, ""), "");
      assert.equal(computePromptKey({}, "   "), "");
    });
  });

  describe("shouldResetTabItems", () => {
    it("happy path: returns false when currentKey and previousKey are identical (tab switching)", () => {
      assert.equal(shouldResetTabItems("prompt_123", "prompt_123"), false);
      assert.equal(shouldResetTabItems("AI in Education", "AI in Education"), false);
    });

    it("happy path: returns true when currentKey and previousKey differ (topic changed)", () => {
      assert.equal(shouldResetTabItems("prompt_124", "prompt_123"), true);
      assert.equal(shouldResetTabItems("New Topic", "Old Topic"), true);
    });

    it("boundary cases: returns false safely when inputs are non-strings", () => {
      assert.equal(shouldResetTabItems(null, "key"), false);
      assert.equal(shouldResetTabItems("key", undefined), false);
      assert.equal(shouldResetTabItems(123, 123), false);
    });
  });

  describe("shouldResetAiOutline", () => {
    const baseConfig = {
      topic: "Global Warming",
      genre: "ielts_task2",
      subType: "opinion",
      language: "en",
    };

    it("happy path: returns false when entire config is identical (tab switching)", () => {
      assert.equal(shouldResetAiOutline(baseConfig, { ...baseConfig }), false);
    });

    it("returns false when topic has matching trimmed content", () => {
      const current = { ...baseConfig, topic: "  Global Warming  " };
      assert.equal(shouldResetAiOutline(current, baseConfig), false);
    });

    it("returns true when topic changes", () => {
      const current = { ...baseConfig, topic: "Renewable Energy" };
      assert.equal(shouldResetAiOutline(current, baseConfig), true);
    });

    it("returns true when genre changes", () => {
      const current = { ...baseConfig, genre: "ielts_task1" };
      assert.equal(shouldResetAiOutline(current, baseConfig), true);
    });

    it("returns true when subType changes", () => {
      const current = { ...baseConfig, subType: "discussion" };
      assert.equal(shouldResetAiOutline(current, baseConfig), true);
    });

    it("returns true when language changes", () => {
      const current = { ...baseConfig, language: "ja" };
      assert.equal(shouldResetAiOutline(current, baseConfig), true);
    });

    it("boundary cases: handles missing or undefined configs without throwing", () => {
      assert.equal(shouldResetAiOutline(null, null), false);
      assert.equal(shouldResetAiOutline(baseConfig, null), true);
      assert.equal(shouldResetAiOutline(undefined, baseConfig), true);
    });
  });

  describe("getTabPaneStyle", () => {
    it("returns { display: 'none' } when tab is not active", () => {
      const style = getTabPaneStyle("keywords", "outline");
      assert.deepEqual(style, { display: "none" });
    });

    it("returns flex layout style object when tab is active with default flex type", () => {
      const style = getTabPaneStyle("keywords", "keywords");
      assert.deepEqual(style, {
        display: "flex",
        flexDirection: "column",
        flex: "1 1 auto",
        minHeight: 0,
        width: "100%",
      });
    });

    it("returns block layout style object when tab is active with block type", () => {
      const style = getTabPaneStyle("outline", "outline", "block");
      assert.deepEqual(style, {
        display: "block",
        width: "100%",
      });
    });

    it("boundary cases: returns { display: 'none' } on empty, null, or undefined tab parameters", () => {
      assert.deepEqual(getTabPaneStyle(null, "keywords"), { display: "none" });
      assert.deepEqual(getTabPaneStyle("keywords", null), { display: "none" });
      assert.deepEqual(getTabPaneStyle(undefined, undefined), { display: "none" });
    });
  });
});
