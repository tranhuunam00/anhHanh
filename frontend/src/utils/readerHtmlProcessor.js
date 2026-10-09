import { getWordVariants, groupBlockIntoSentences, splitTextIntoSentences, isSilentOrDivider } from "./readerUtils.js";

/**
 * Parses article HTML, marks saved vocabulary words, and segments into sentences with timing metadata.
 * @param {string} articleHtml
 * @param {Object} savedVocabMap
 * @returns {{ processedHtml: string, matchedWords: Array, totalWordsCount: number, sentencesList: Array }}
 */
export function processReaderArticle(articleHtml, savedVocabMap = {}) {
  if (!articleHtml || typeof articleHtml !== "string" || !articleHtml.trim()) {
    return { processedHtml: "", matchedWords: [], totalWordsCount: 0, sentencesList: [] };
  }

  if (typeof window === "undefined" || !window.DOMParser) {
    const words = articleHtml.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
    const blockSeparated = articleHtml
      .replace(/<\/(p|div|li|h[1-6]|blockquote|section|article|header|footer)>/gi, "\n\n")
      .replace(/<(br|hr)\s*\/?>/gi, "\n\n");
    const rawBlocks = blockSeparated
      .split(/\n+/)
      .map((b) => b.replace(/<[^>]*>/g, " ").trim())
      .filter((b) => b.length > 0 && !isSilentOrDivider(b));
    const sentenceStrings = rawBlocks
      .flatMap((b) => splitTextIntoSentences(b))
      .filter((s) => !isSilentOrDivider(s));
    let cumulative = 0;
    const sentencesList = sentenceStrings.map((s, idx) => {
      const sWords = s.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
      const wordCount = sWords.length;
      const duration = Math.max(1.2, Number((wordCount / 2.33 + 0.35).toFixed(1)));
      const startTime = cumulative;
      const endTime = Number((cumulative + duration).toFixed(1));
      cumulative = endTime;
      return { index: idx, text: s, wordCount, duration, startTime, endTime };
    });
    return {
      processedHtml: articleHtml,
      matchedWords: [],
      totalWordsCount: words.length,
      sentencesList,
    };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(articleHtml, "text/html");
    const matchedSet = new Map();
    let totalWordCount = 0;

    // Clean inline font overrides so user fontSize and fontFamily settings always work
    doc.body.querySelectorAll("*").forEach((el) => {
      if (el.style) {
        el.style.removeProperty("font-size");
        el.style.removeProperty("font-family");
        el.style.removeProperty("line-height");
      }
    });

    // 1. Highlight saved vocabulary tokens on all text nodes first
    const showTextFilter = typeof NodeFilter !== "undefined" ? NodeFilter.SHOW_TEXT : 4;
    const walker = doc.createTreeWalker(doc.body, showTextFilter, null, false);
    const textNodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeValue.trim().length > 0) {
        textNodes.push(currentNode);
      }
    }

    textNodes.forEach((node) => {
      const text = node.nodeValue;
      const wordsInNode = text.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
      totalWordCount += wordsInNode.length;

      if (!savedVocabMap || Object.keys(savedVocabMap).length === 0) {
        return;
      }

      const tokens = text.split(/([a-zA-Z0-9'’-]+)/g);
      let hasReplacement = false;
      const fragment = doc.createDocumentFragment();

      let i = 0;
      const len = tokens.length;
      const maxPhrase = 4;

      while (i < len) {
        const t = tokens[i];
        if (!t) {
          i++;
          continue;
        }

        const isWord = /^[a-zA-Z0-9'’-]+$/.test(t);
        if (!isWord) {
          fragment.appendChild(doc.createTextNode(t));
          i++;
          continue;
        }

        // Check multi-word phrase
        let matchedPhrase = null;
        let phraseSkip = 0;

        for (let pLen = maxPhrase; pLen >= 2; pLen--) {
          const sliceTokens = [];
          let wCount = 0;
          for (let j = i; j < len && wCount < pLen; j++) {
            sliceTokens.push(tokens[j]);
            if (/^[a-zA-Z0-9'’-]+$/.test(tokens[j])) wCount++;
          }
          if (wCount === pLen) {
            const phraseStr = sliceTokens.join("").toLowerCase().trim().replace(/['’]/g, "'");
            if (savedVocabMap[phraseStr]) {
              matchedPhrase = savedVocabMap[phraseStr];
              phraseSkip = sliceTokens.length;
              break;
            }
          }
        }

        if (matchedPhrase) {
          hasReplacement = true;
          const span = doc.createElement("mark");
          span.className = `smart-vocab-mark status-${(matchedPhrase.status || "NEW").toLowerCase()}`;
          span.setAttribute("data-word", matchedPhrase.word);
          span.setAttribute("data-status", matchedPhrase.status || "NEW");
          span.textContent = tokens.slice(i, i + phraseSkip).join("");

          fragment.appendChild(span);
          matchedSet.set(matchedPhrase.word.toLowerCase(), matchedPhrase);
          i += phraseSkip;
          continue;
        }

        // Check single word & inflections
        const variants = getWordVariants(t);
        let matchItem = null;
        for (const v of variants) {
          if (savedVocabMap[v]) {
            matchItem = savedVocabMap[v];
            break;
          }
        }

        if (matchItem) {
          hasReplacement = true;
          const span = doc.createElement("mark");
          span.className = `smart-vocab-mark status-${(matchItem.status || "NEW").toLowerCase()}`;
          span.setAttribute("data-word", matchItem.word);
          span.setAttribute("data-status", matchItem.status || "NEW");
          span.textContent = t;

          fragment.appendChild(span);
          matchedSet.set(matchItem.word.toLowerCase(), matchItem);
        } else {
          fragment.appendChild(doc.createTextNode(t));
        }
        i++;
      }

      if (hasReplacement && node.parentNode) {
        node.parentNode.replaceChild(fragment, node);
      }
    });

    // 2. Wrap direct text nodes in <p> if needed
    Array.from(doc.body.childNodes).forEach((node) => {
      if (node.nodeType === 3 && node.nodeValue.trim().length > 0) {
        const p = doc.createElement("p");
        p.textContent = node.nodeValue;
        doc.body.replaceChild(p, node);
      }
    });

    // Ensure <br> tags have whitespace separation so textContent does not glue sentences together
    doc.body.querySelectorAll("br").forEach((br) => {
      const next = br.nextSibling;
      if (!next || next.nodeType !== 3 || !/^\s/.test(next.nodeValue)) {
        br.after(doc.createTextNode(" "));
      }
    });

    // 3. Find leaf blocks and segment them into sentence spans (.reader-sentence)
    const blockSelector = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, div";
    let leafBlocks = Array.from(doc.body.querySelectorAll(blockSelector)).filter((el) => {
      const hasChildBlock = el.querySelector(blockSelector);
      return !hasChildBlock && el.textContent.trim().length > 0;
    });

    if (leafBlocks.length === 0 && doc.body.textContent.trim().length > 0) {
      const p = doc.createElement("p");
      while (doc.body.firstChild) {
        p.appendChild(doc.body.firstChild);
      }
      doc.body.appendChild(p);
      leafBlocks = [p];
    }

    const rawSentences = [];
    let nextSentenceIndex = 0;
    const getNextIndex = () => nextSentenceIndex++;
    const addSentence = (index, text) => {
      const clean = text.replace(/⭐/g, "").trim();
      if (clean.length > 0) {
        rawSentences.push({ index, text: clean });
      }
    };

    leafBlocks.forEach((block) => {
      if (isSilentOrDivider(block.textContent)) {
        block.classList.add("reader-divider-block");
        return;
      }
      groupBlockIntoSentences(block, getNextIndex, addSentence, doc);
    });

    // 4. Enrich sentences with duration, cumulative timestamps
    let cumulative = 0;
    const parsedSentencesList = rawSentences.map((s, idx) => {
      const words = s.text.match(/\b[a-zA-Z0-9'’-]+\b/g) || [];
      const wordCount = words.length;
      const duration = Math.max(1.2, Number(((wordCount / 2.33) + 0.35).toFixed(1)));
      const startTime = cumulative;
      const endTime = Number((cumulative + duration).toFixed(1));
      cumulative = endTime;

      return {
        index: idx,
        text: s.text,
        wordCount,
        duration,
        startTime,
        endTime,
      };
    });

    return {
      processedHtml: doc.body.innerHTML,
      matchedWords: Array.from(matchedSet.values()),
      totalWordsCount: totalWordCount,
      sentencesList: parsedSentencesList,
    };
  } catch (e) {
    console.error("Error processing reader HTML:", e);
    return { processedHtml: articleHtml, matchedWords: [], totalWordsCount: 0, sentencesList: [] };
  }
}
