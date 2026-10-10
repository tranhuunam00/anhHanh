/**
 * Utility functions for normalizing, formatting, and merging AI Writing suggestions and structures.
 */

/**
 * Normalizes a single raw structure/suggestion object into a guaranteed uniform format.
 * @param {Object} raw
 * @param {string} defaultBand
 * @returns {Object|null}
 */
export function normalizeStructureItem(raw, defaultBand = "band7") {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const phrase = String(
    raw.phrase ||
    raw.sentence_frame ||
    raw.frame ||
    raw.collocation ||
    raw.expression ||
    raw.text ||
    raw.content ||
    raw.pattern ||
    raw.structure ||
    raw.template ||
    raw.sample ||
    ""
  ).trim();

  const meaning = String(
    raw.meaning ||
    raw.translation ||
    raw.vietnamese ||
    raw.vietnamese_meaning ||
    raw.meaning_vi ||
    raw.definition ||
    raw.explanation ||
    raw.desc ||
    ""
  ).trim();

  if (!phrase && !meaning) {
    return null;
  }

  const finalPhrase = phrase || meaning;

  // Determine kind ("collocation" vs "structure")
  const rawKind = String(raw.kind || raw.type || "").toLowerCase();
  let kind = "collocation";
  if (rawKind.includes("colloc") || rawKind === "cụm từ") {
    kind = "collocation";
  } else if (rawKind.includes("struct") || rawKind.includes("frame") || rawKind === "khung câu") {
    kind = "structure";
  } else {
    // Heuristic: placeholder brackets [ ] or more than 5 words indicate sentence frame
    if (/\[.*?\]/.test(finalPhrase) || finalPhrase.split(/\s+/).length > 5) {
      kind = "structure";
    } else {
      kind = "collocation";
    }
  }

  // Determine band ("band8", "band7", "band6")
  const rawBand = String(raw.band || raw.target_band || raw.level || "").toLowerCase();
  let band = defaultBand;
  if (/band\s*8|8\.|8,|^8$/.test(rawBand)) {
    band = "band8";
  } else if (/band\s*7|7\.|7,|^7$/.test(rawBand)) {
    band = "band7";
  } else if (/band\s*6|6\.|6,|^6$/.test(rawBand)) {
    band = "band6";
  }

  // Determine category ("intro", "body", "counter", "conclusion")
  const rawCat = String(raw.category || "").toLowerCase();
  let category = "body";
  if (rawCat.includes("intro")) {
    category = "intro";
  } else if (rawCat.includes("counter") || rawCat.includes("rebuttal")) {
    category = "counter";
  } else if (rawCat.includes("conclu")) {
    category = "conclusion";
  }

  const template = String(raw.template || finalPhrase).trim();
  const usage = String(raw.usage || raw.usage_note || raw.context || raw.note || "").trim();

  return {
    kind,
    category,
    band,
    phrase: finalPhrase,
    meaning,
    template,
    usage,
  };
}

/**
 * Normalizes an array of raw structure objects, discarding nulls.
 * @param {Array} list
 * @param {string} defaultBand
 * @returns {Array}
 */
export function normalizeStructureList(list, defaultBand = "band7") {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => normalizeStructureItem(item, defaultBand))
    .filter(Boolean);
}

/**
 * Merges new items into existing list while deduplicating by normalized phrase.
 * Appends new items at the end.
 * @param {Array} existingList
 * @param {Array} newList
 * @returns {Array}
 */
export function mergeStructureLists(existingList = [], newList = []) {
  const existing = normalizeStructureList(existingList);
  const incoming = normalizeStructureList(newList);

  const seen = new Set(
    existing.map((item) => item.phrase.toLowerCase().replace(/[\s\W]+/g, ""))
  );

  const merged = [...existing];
  for (const item of incoming) {
    const key = item.phrase.toLowerCase().replace(/[\s\W]+/g, "");
    if (key && !seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }

  return merged;
}

/**
 * Splits phrase into parts to isolate bracket placeholders [placeholder].
 * @param {string} phrase
 * @returns {Array<string>}
 */
export function splitPhraseParts(phrase) {
  if (!phrase) return [];
  return String(phrase).split(/(\[[^\]]*\])/g);
}

/**
 * Returns user-facing label for band tag.
 * @param {string} band
 * @returns {string}
 */
export function getBandDisplayLabel(band) {
  if (band === "band8") return "Band 8.0 – 9.0";
  if (band === "band7") return "Band 7.0 – 7.5";
  return "Band 6.0 – 6.5";
}
