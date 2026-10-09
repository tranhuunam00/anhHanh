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
    assert.equal(result.sentencesList.length, 2);
    assert.equal(result.sentencesList[0].text, "Science is our common foundation.");
    assert.equal(result.sentencesList[1].text, "We need innovation.");
  });

  it("processes multi-sentence paragraphs and generates accurate timing metadata", () => {
    const p1 = "Hi everyone. It's good to see such a big turnout at our Nature Club session for June. Just before we start this evening's workshop, I'd like to draw your attention to what we have in store for you in the second half of the year.";
    const result = processReaderArticle(p1);

    assert.equal(result.sentencesList.length, 3);
    assert.equal(result.sentencesList[0].text, "Hi everyone.");
    assert.equal(result.sentencesList[0].index, 0);
    assert.ok(result.sentencesList[0].duration > 0);
    assert.equal(result.sentencesList[0].startTime, 0);
    assert.ok(result.sentencesList[1].startTime >= result.sentencesList[0].endTime);
    assert.ok(result.sentencesList[2].startTime >= result.sentencesList[1].endTime);
  });
});
