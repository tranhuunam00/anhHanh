/**
 * Utilities for highlighting multi-word target vocabulary,
 * extracting context sentences, and analyzing target coverage in AI stories.
 */

/**
 * Escapes regex special characters in a string.
 * @param {string} str
 * @returns {string}
 */
export const escapeRegExp = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Builds a regex pattern component for a word or phrase,
 * treating hyphens and spaces interchangeably and flexibly.
 * e.g. "ultra-violet radiation" -> "ultra[-\\s]+violet[-\\s]+radiation"
 * @param {string} phrase
 * @returns {string}
 */
export const buildFlexiblePhrasePattern = (phrase) => {
  if (typeof phrase !== "string") return "";
  const trimmed = phrase.trim();
  if (!trimmed) return "";

  // Split on any sequence of whitespace or hyphens
  const tokens = trimmed.split(/[-\s]+/).filter(Boolean);
  if (tokens.length === 0) return "";

  return tokens.map(escapeRegExp).join("[-\\s]+");
};

/**
 * Extracts the single sentence from a text that contains the target word/phrase.
 * @param {string} fullText
 * @param {string} targetWord
 * @returns {string}
 */
export const extractSentenceFromText = (fullText, targetWord) => {
  if (!fullText || typeof fullText !== "string") return "";
  if (!targetWord || typeof targetWord !== "string") return fullText.trim();

  const cleanTarget = targetWord.trim().toLowerCase();
  if (!cleanTarget) return fullText.trim();

  const sentences = fullText.split(/(?<=[.!?])\s+/);
  const matched = sentences.find((s) => s.toLowerCase().includes(cleanTarget));
  return matched ? matched.trim() : fullText.trim();
};

/**
 * Parses story text into highlighted segments for single words and multi-word phrases.
 * Longer phrases take precedence over shorter sub-phrases.
 *
 * @param {string} storyText
 * @param {Array<string|{word: string, meaning?: string}>} targetWords
 * @returns {Array<{text: string, isTarget: boolean, targetWord: string}>}
 */
export const parseHighlightedStorySegments = (storyText, targetWords = []) => {
  if (!storyText || typeof storyText !== "string") {
    return [];
  }

  // Extract clean target strings
  const rawList = Array.isArray(targetWords) ? targetWords : [];
  const phraseMap = new Map();

  for (const item of rawList) {
    let wordStr = "";
    if (typeof item === "string") {
      wordStr = item.trim();
    } else if (item && typeof item === "object" && typeof item.word === "string") {
      wordStr = item.word.trim();
    }

    if (wordStr) {
      // Map normalized lower key to the canonical word representation
      phraseMap.set(wordStr.toLowerCase(), wordStr);
    }
  }

  const uniquePhrases = Array.from(phraseMap.keys());
  if (uniquePhrases.length === 0) {
    return [{ text: storyText, isTarget: false, targetWord: "" }];
  }

  // Sort descending by length so longer phrases (e.g. "high school diploma") match before ("diploma")
  uniquePhrases.sort((a, b) => b.length - a.length);

  // Build pattern
  const subPatterns = uniquePhrases.map((phrase) => {
    const flexible = buildFlexiblePhrasePattern(phrase);
    return `(?:${flexible})`;
  });

  // Use word boundaries or word-break checks
  const combinedRegex = new RegExp(`(^|\\b)(${subPatterns.join("|")})($|\\b)`, "gi");

  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(storyText)) !== null) {
    const fullMatch = match[0];
    const prefix = match[1] || "";
    const matchedPhrase = match[2];
    const matchStart = match.index + prefix.length;
    const matchEnd = matchStart + matchedPhrase.length;

    // Push preceding non-target text
    if (matchStart > lastIndex) {
      segments.push({
        text: storyText.slice(lastIndex, matchStart),
        isTarget: false,
        targetWord: "",
      });
    }

    // Resolve canonical target word
    const lowerMatched = matchedPhrase.toLowerCase().replace(/[-\s]+/g, " ").trim();
    let canonical = phraseMap.get(lowerMatched);
    if (!canonical) {
      // Check flexible match in map
      for (const [key, val] of phraseMap.entries()) {
        const normKey = key.replace(/[-\s]+/g, " ").trim();
        if (normKey === lowerMatched) {
          canonical = val;
          break;
        }
      }
    }

    segments.push({
      text: matchedPhrase,
      isTarget: true,
      targetWord: canonical || matchedPhrase,
    });

    lastIndex = matchEnd;
  }

  // Trailing text
  if (lastIndex < storyText.length) {
    segments.push({
      text: storyText.slice(lastIndex),
      isTarget: false,
      targetWord: "",
    });
  }

  return segments;
};

/**
 * Checks which target words are found in the story and calculates coverage statistics.
 * @param {string} storyText
 * @param {Array<string|{word: string}>} targetWords
 * @returns {{foundWords: Set<string>, missingWords: string[], coveragePercent: number}}
 */
export const checkTargetWordsCoverage = (storyText, targetWords = []) => {
  if (!storyText || typeof storyText !== "string" || !Array.isArray(targetWords) || targetWords.length === 0) {
    return { foundWords: new Set(), missingWords: [], coveragePercent: 0 };
  }

  const segments = parseHighlightedStorySegments(storyText, targetWords);
  const foundWords = new Set();

  for (const seg of segments) {
    if (seg.isTarget && seg.targetWord) {
      foundWords.add(seg.targetWord.toLowerCase());
    }
  }

  const missingWords = [];
  let totalValid = 0;

  for (const item of targetWords) {
    const w = (typeof item === "string" ? item : item?.word || "").trim();
    if (w) {
      totalValid++;
      if (!foundWords.has(w.toLowerCase())) {
        missingWords.push(w);
      }
    }
  }

  const coveragePercent = totalValid > 0 ? Math.round(((totalValid - missingWords.length) / totalValid) * 100) : 0;

  return {
    foundWords,
    missingWords,
    coveragePercent,
  };
};
