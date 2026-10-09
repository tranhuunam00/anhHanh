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

  it("excludes decorative divider blocks from sentencesList so TTS never reads them", () => {
    const html = "<p>Sentence one.</p><p>____________________</p><p>Sentence two.</p>";
    const result = processReaderArticle(html);

    assert.equal(result.sentencesList.length, 2);
    assert.equal(result.sentencesList[0].text, "Sentence one.");
    assert.equal(result.sentencesList[1].text, "Sentence two.");
    assert.ok(!result.sentencesList.some((s) => s.text.includes("_____")));
  });

  it("DOM mode: parses HTML structure, marks vocabulary spans, and isolates dividers", async () => {
    const { JSDOM } = await import("jsdom");
    const dom = new JSDOM();
    const oldWindow = globalThis.window;
    const oldDOMParser = globalThis.DOMParser;
    const oldNodeFilter = globalThis.NodeFilter;
    const oldNode = globalThis.Node;

    try {
      globalThis.window = dom.window;
      globalThis.DOMParser = dom.window.DOMParser;
      globalThis.NodeFilter = dom.window.NodeFilter;
      globalThis.Node = dom.window.Node;

      const html = "<h1>Headline</h1><p>The climate is changing rapidly.</p><p>____________________</p><p>New actions are needed.</p>";
      const savedVocabMap = { climate: { word: "climate", vi: "khí hậu" } };
      const result = processReaderArticle(html, savedVocabMap);

      assert.equal(result.sentencesList.length, 3);
      assert.ok(result.processedHtml.includes("reader-divider-block"));
      assert.ok(result.processedHtml.includes('data-word="climate"'));
      assert.equal(result.matchedWords.length, 1);
      assert.equal(result.matchedWords[0].word, "climate");
    } finally {
      globalThis.window = oldWindow;
      globalThis.DOMParser = oldDOMParser;
      globalThis.NodeFilter = oldNodeFilter;
      globalThis.Node = oldNode;
    }
  });
});

