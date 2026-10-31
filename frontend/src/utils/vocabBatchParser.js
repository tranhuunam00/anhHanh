/**
 * Vocabulary Batch / Bulk Import Parser Utility
 * Parses multi-line text (TSV, CSV, Pipe, or multi-space) into structured vocabulary items.
 * Supports duplicate detection against an existing vocabulary map.
 */

const KNOWN_POS_SET = new Set([
  "noun", "verb", "adjective", "adverb", "pronoun", "preposition",
  "conjunction", "interjection", "idiom", "phrasal verb", "collocation",
  "noun phrase", "verb phrase", "adjective phrase", "adverb phrase",
  "prepositional phrase", "clause", "phrase", "n", "v", "adj", "adv", "prep"
]);

/**
 * Checks if a string looks like phonetic transcription (IPA)
 * @param {string} str
 * @returns {boolean}
 */
export function isPhoneticString(str) {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  if (trimmed.startsWith("/") && trimmed.endsWith("/") && trimmed.length >= 2) return true;
  if (trimmed.startsWith("[") && trimmed.endsWith("]") && trimmed.length >= 2) return true;
  // Contains common IPA characters (excluding range syntax)
  const ipaChars = /[æɑɒɔəɛɜɪʊʌθðʃʒŋʔˈˌ\u02D0]/;
  return ipaChars.test(trimmed);
}

/**
 * Checks if a string looks like a part of speech
 * @param {string} str
 * @returns {boolean}
 */
export function isPartOfSpeechString(str) {
  if (!str || typeof str !== "string") return false;
  const lower = str.trim().toLowerCase();
  return KNOWN_POS_SET.has(lower) || lower.endsWith("phrase") || lower.endsWith("verb");
}

/**
 * Splits a single line into columns using tabs, pipes, semicolons, or multi-spaces
 * @param {string} line
 * @returns {string[]}
 */
export function splitLineIntoColumns(line) {
  if (!line || typeof line !== "string") return [];
  const raw = line.trim();
  if (!raw) return [];

  // Tab separated (Standard TSV / Excel paste)
  if (raw.includes("\t")) {
    return raw.split("\t").map((c) => c.trim());
  }

  // Markdown Pipe separated (| col1 | col2 | col3 |)
  if (raw.includes("|")) {
    const parts = raw.split("|").map((c) => c.trim());
    // Strip leading/trailing empty string from outer pipes
    if (parts.length > 1 && parts[0] === "") parts.shift();
    if (parts.length > 0 && parts[parts.length - 1] === "") parts.pop();
    if (parts.length > 1) return parts;
  }

  // Semicolon separated
  if (raw.includes(";")) {
    const parts = raw.split(";").map((c) => c.trim());
    if (parts.length > 1) return parts;
  }

  // Multi-space separated (at least 2 consecutive spaces)
  if (/\s{2,}/.test(raw)) {
    return raw.split(/\s{2,}/).map((c) => c.trim());
  }

  // Comma separated (simple CSV)
  if (raw.includes(",")) {
    const parts = raw.split(",").map((c) => c.trim());
    if (parts.length > 1) return parts;
  }

  // Single column fallback
  return [raw];
}

/**
 * Checks if row is a header row (e.g. Word, IPA, POS, Meaning, Example)
 * @param {string[]} cols
 * @returns {boolean}
 */
export function isHeaderRow(cols) {
  if (!cols || cols.length === 0) return false;
  const first = (cols[0] || "").toLowerCase().trim();
  const second = (cols[1] || "").toLowerCase().trim();
  const headerKeywords = ["word", "từ", "từ vựng", "vocabulary", "term"];
  if (headerKeywords.includes(first)) {
    return true;
  }
  if (first.includes("từ") && (second.includes("phiên âm") || second.includes("ipa") || second.includes("nghĩa"))) {
    return true;
  }
  return false;
}

/**
 * Maps raw columns to standard vocabulary fields based on column count and characteristics
 * @param {string[]} cols
 * @returns {{ word: string, phonetic: string, part_of_speech: string, meaning: string, context_sentence: string }}
 */
export function mapColumnsToVocabFields(cols) {
  const result = {
    word: "",
    phonetic: "",
    part_of_speech: "",
    meaning: "",
    context_sentence: ""
  };
  if (!cols || cols.length === 0) return result;

  result.word = (cols[0] || "").trim();

  // 5 columns standard: Word, Phonetic, POS, Meaning, Sentence
  if (cols.length >= 5) {
    result.phonetic = (cols[1] || "").trim();
    result.part_of_speech = (cols[2] || "").trim();
    result.meaning = (cols[3] || "").trim();
    result.context_sentence = cols.slice(4).join(" ").trim();
    return result;
  }

  // 4 columns: Word, [Phonetic/POS], Meaning, Sentence OR Word, Phonetic, POS, Meaning
  if (cols.length === 4) {
    const c1 = (cols[1] || "").trim();
    const c2 = (cols[2] || "").trim();
    const c3 = (cols[3] || "").trim();

    if (isPhoneticString(c1) && isPartOfSpeechString(c2)) {
      result.phonetic = c1;
      result.part_of_speech = c2;
      result.meaning = c3;
    } else if (isPhoneticString(c1)) {
      result.phonetic = c1;
      result.meaning = c2;
      result.context_sentence = c3;
    } else if (isPartOfSpeechString(c1)) {
      result.part_of_speech = c1;
      result.meaning = c2;
      result.context_sentence = c3;
    } else {
      // Default: Word, Phonetic, Meaning, Sentence
      result.phonetic = c1;
      result.meaning = c2;
      result.context_sentence = c3;
    }
    return result;
  }

  // 3 columns: Word, [Phonetic/POS], Meaning
  if (cols.length === 3) {
    const c1 = (cols[1] || "").trim();
    const c2 = (cols[2] || "").trim();

    if (isPhoneticString(c1)) {
      result.phonetic = c1;
      result.meaning = c2;
    } else if (isPartOfSpeechString(c1)) {
      result.part_of_speech = c1;
      result.meaning = c2;
    } else {
      result.meaning = c1;
      result.context_sentence = c2;
    }
    return result;
  }

  // 2 columns: Word, Meaning
  if (cols.length === 2) {
    result.meaning = (cols[1] || "").trim();
    return result;
  }

  // 1 column: Just word
  return result;
}

/**
 * Parses raw text input into list of vocabulary items with duplicate detection
 * @param {string} text - Raw pasted text
 * @param {Object} [existingVocabMap={}] - Map of existing words { [wordLower]: item }
 * @param {string} [sourceLang="en"]
 * @returns {{ items: Array, summary: Object }}
 */
export function parseBatchVocabText(text, existingVocabMap = {}, sourceLang = "en") {
  if (!text || typeof text !== "string") {
    return {
      items: [],
      summary: { total: 0, validCount: 0, newCount: 0, duplicateCount: 0, invalidCount: 0 }
    };
  }

  const lines = text.split(/\r?\n/);
  const items = [];
  const seenInBatch = new Set();
  let duplicateCount = 0;
  let newCount = 0;
  let invalidCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine || rawLine.startsWith("#") || rawLine.startsWith("//")) {
      continue;
    }

    const cols = splitLineIntoColumns(rawLine);
    if (cols.length === 0) continue;

    // Skip table header row
    if (i === 0 && isHeaderRow(cols)) {
      continue;
    }

    const fields = mapColumnsToVocabFields(cols);
    const wordKey = fields.word.toLowerCase().trim();

    if (!wordKey) {
      invalidCount++;
      continue;
    }

    const isInternalDup = seenInBatch.has(wordKey);
    seenInBatch.add(wordKey);

    const existingItem = existingVocabMap && typeof existingVocabMap === "object"
      ? existingVocabMap[wordKey] || null
      : null;
    const isDuplicate = Boolean(existingItem) || isInternalDup;

    if (isDuplicate) {
      duplicateCount++;
    } else {
      newCount++;
    }

    const isValid = Boolean(fields.word && fields.meaning);
    if (!isValid) {
      invalidCount++;
    }

    items.push({
      id: `batch_item_${i}_${Date.now()}`,
      word: fields.word,
      phonetic: fields.phonetic,
      part_of_speech: fields.part_of_speech,
      meaning: fields.meaning,
      context_sentence: fields.context_sentence,
      source_lang: sourceLang || "en",
      isDuplicate,
      existingItem,
      isInternalDuplicate: isInternalDup,
      isValid,
      selected: isValid && !isDuplicate
    });
  }

  return {
    items,
    summary: {
      total: items.length,
      validCount: items.filter((it) => it.isValid).length,
      newCount,
      duplicateCount,
      invalidCount
    }
  };
}
