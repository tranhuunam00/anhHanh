import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { processReaderArticle } from "../src/utils/readerHtmlProcessor.js";

describe("readerHtmlProcessor Unit Tests", () => {
  it("handles empty, null, and non-string inputs safely", () => {
    assert.deepEqual(processReaderArticle(""), {
      processedHtml: "",
      matchedWords: [],
      totalWordsCount: 0,
      sentencesList: [],
    });

    assert.deepEqual(processReaderArticle(null), {
      processedHtml: "",
      matchedWords: [],
      totalWordsCount: 0,
      sentencesList: [],
    });

    assert.deepEqual(processReaderArticle(undefined), {
      processedHtml: "",
      matchedWords: [],
      totalWordsCount: 0,
      sentencesList: [],
    });
  });

  it("processes simple article text and produces sentence metadata", () => {
    const text = "Science is our common foundation. We need innovation.";
    const result = processReaderArticle(text);

    assert.ok(result.totalWordsCount >= 7);
    assert.ok(Array.isArray(result.sentencesList));
    assert.ok(result.sentencesList.length >= 1);
  });
});
