/**
 * IELTS Reading question-layout helpers (pure functions, no React).
 *
 * A reading question group may carry the original Cambridge layout instead of
 * one sentence per question:
 *   - group.summary  = { title?, paragraphs: ["... the {32} of space ...", ...] }
 *   - group.notes    = { sections: [{ heading?, lines: ["• near ... {9}", ...] }] }
 *   - group.table    = { title?, headers?: [...], rows: [[cell, ...], ...] }
 * Legacy Cambridge 16 shapes are accepted too:
 *   - group.paragraphs = [{ text: "... [17] ..." }]   (summary with a word box)
 *   - group.sections   = [{ heading, lines: [{ text } | { prefix, number, suffix }] }]
 * A gap is written as {N} (or [N] in legacy data), N being the question number.
 */

const GAP_PATTERN = /\{(\d{1,2})\}|\[(\d{1,2})\]/g;

/**
 * Splits a text containing gap tokens into text and gap segments.
 * @param {string} text
 * @returns {Array<{type: "text", value: string} | {type: "gap", number: number}>}
 */
export function parseGapText(text) {
  if (typeof text !== "string" || text.length === 0) return [];
  const segments = [];
  let lastIndex = 0;
  GAP_PATTERN.lastIndex = 0;
  let match = GAP_PATTERN.exec(text);
  while (match) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "gap", number: Number(match[1] || match[2]) });
    lastIndex = match.index + match[0].length;
    match = GAP_PATTERN.exec(text);
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }
  return segments;
}

/**
 * Gap numbers found in a text, in reading order.
 * @param {string} text
 * @returns {number[]}
 */
export function extractGapNumbers(text) {
  return parseGapText(text)
    .filter((seg) => seg.type === "gap")
    .map((seg) => seg.number);
}

/**
 * Converts one notes line (string or legacy object) into a gap-token string.
 * @param {string|{text?: string, prefix?: string, number?: number, suffix?: string}} line
 * @returns {string}
 */
export function notesLineToText(line) {
  if (typeof line === "string") return line;
  if (!line || typeof line !== "object") return "";
  if (typeof line.number === "number") {
    return `${line.prefix || ""}{${line.number}}${line.suffix || ""}`;
  }
  return typeof line.text === "string" ? line.text : "";
}

/**
 * Splits a leading marker from a notes line: "• " is a bullet,
 * "– " or "- " is a second-level dash item (indented under a bullet).
 * @param {string} text
 * @returns {{ bullet: boolean, dash: boolean, text: string }}
 */
export function splitBullet(text) {
  if (typeof text !== "string") return { bullet: false, dash: false, text: "" };
  const match = text.match(/^\s*([•\-–])\s+/);
  if (!match) return { bullet: false, dash: false, text };
  const isDot = match[1] === "•";
  return { bullet: isDot, dash: !isDot, text: text.slice(match[0].length) };
}

/**
 * Summary paragraphs of a group (new `summary` shape or legacy `paragraphs`).
 * @param {object} group
 * @returns {string[]}
 */
export function getSummaryParagraphs(group) {
  if (!group || typeof group !== "object") return [];
  if (Array.isArray(group.summary?.paragraphs)) {
    return group.summary.paragraphs.filter((p) => typeof p === "string");
  }
  if (Array.isArray(group.paragraphs)) {
    return group.paragraphs
      .map((p) => (typeof p === "string" ? p : p?.text))
      .filter((p) => typeof p === "string");
  }
  return [];
}

/**
 * Notes sections of a group, every line converted to a gap-token string.
 * @param {object} group
 * @returns {Array<{ heading: string, lines: string[] }>}
 */
export function getNotesSections(group) {
  if (!group || typeof group !== "object") return [];
  const sections = Array.isArray(group.notes?.sections)
    ? group.notes.sections
    : Array.isArray(group.sections)
      ? group.sections
      : [];
  return sections
    .filter((sec) => sec && typeof sec === "object")
    .map((sec) => ({
      heading: typeof sec.heading === "string" ? sec.heading : "",
      lines: Array.isArray(sec.lines) ? sec.lines.map(notesLineToText).filter((l) => l !== "") : []
    }));
}

/**
 * Which layout the renderer should use for a group.
 * @param {object} group
 * @returns {"table" | "summary" | "notes" | "items"}
 */
export function getReadingGroupLayout(group) {
  if (!group || typeof group !== "object") return "items";
  if (Array.isArray(group.table?.rows) && group.table.rows.length > 0) return "table";
  if (getSummaryParagraphs(group).length > 0) return "summary";
  if (getNotesSections(group).length > 0) return "notes";
  return "items";
}

/**
 * Normalizes the reference list of a group (word box, headings, people, endings)
 * into { value, text } pairs. `value` is what the learner submits.
 * @param {object} group
 * @returns {Array<{ value: string, text: string }>}
 */
export function getReferenceOptions(group) {
  if (!group || typeof group !== "object") return [];
  const source =
    group.boxOptions ||
    group.summaryOptions ||
    group.listHeadings ||
    group.headingsList ||
    group.people ||
    group.peopleList ||
    group.endingsList ||
    group.optionsList ||
    null;
  if (!Array.isArray(source)) return [];

  return source
    .map((opt) => {
      if (opt && typeof opt === "object") {
        const value = opt.letter ?? opt.number ?? opt.value ?? "";
        const text = opt.text ?? opt.name ?? opt.label ?? "";
        return { value: String(value).trim(), text: String(text).trim() };
      }
      if (typeof opt !== "string") return null;
      const str = opt.trim();
      const roman = str.match(/^([ivx]+)[.)]?\s+(.*)$/);
      if (roman) return { value: roman[1], text: roman[2].trim() };
      const letter = str.match(/^([A-Z])(?:[.):\-]\s*|\s+)(.*)$/);
      if (letter) return { value: letter[1], text: letter[2].trim() };
      return { value: str, text: "" };
    })
    .filter((opt) => opt && opt.value !== "");
}

/**
 * Where the reference box goes, as in the Cambridge books: the list of headings
 * comes before the questions; people / word boxes / endings come after them.
 * @param {object} group
 * @returns {"before" | "after"}
 */
export function getReferenceBoxPosition(group) {
  if (!group || typeof group !== "object") return "after";
  if (group.boxPosition === "before" || group.boxPosition === "after") return group.boxPosition;
  if (group.groupType === "matching_headings" || group.listHeadings || group.headingsList) return "before";
  return "after";
}

/**
 * Completion-style groups (gaps to fill) show their own title, like the books.
 * @param {object} group
 * @returns {boolean}
 */
export function isCompletionGroup(group) {
  const type = String(group?.groupType || "");
  return /fill|notes|summary|table|completion|flowchart|diagram|short_answer/.test(type) && type !== "sentence_completion_endings";
}

/**
 * True when gaps are answered by picking a letter from a word box
 * ("Complete the summary using the list of words, A–H").
 * Matching groups are excluded: they have their own select list.
 * @param {object} group
 * @returns {boolean}
 */
export function isLetterChoiceGroup(group) {
  if (!group || typeof group !== "object") return false;
  const type = String(group.groupType || "");
  if (type.startsWith("matching")) return false;
  return getReferenceOptions(group).length > 0;
}

/**
 * All gap numbers that a group's layout renders, in reading order.
 * @param {object} group
 * @returns {number[]}
 */
export function getLayoutGapNumbers(group) {
  const layout = getReadingGroupLayout(group);
  if (layout === "summary") {
    return getSummaryParagraphs(group).flatMap(extractGapNumbers);
  }
  if (layout === "notes") {
    return getNotesSections(group).flatMap((sec) => [
      ...extractGapNumbers(sec.heading),
      ...sec.lines.flatMap(extractGapNumbers)
    ]);
  }
  if (layout === "table") {
    const cells = group.table.rows.flatMap((row) => (Array.isArray(row) ? row : []));
    return cells.flatMap((cell) => extractGapNumbers(typeof cell === "string" ? cell : ""));
  }
  return [];
}

/**
 * Renders a gap-token text as plain text with "[N] ........" gaps (for copy/export).
 * @param {string} text
 * @returns {string}
 */
export function gapTextToPlain(text) {
  return parseGapText(text)
    .map((seg) => (seg.type === "gap" ? `${seg.number} ........` : seg.value))
    .join("");
}

/**
 * Plain-text version of a group's layout (title, summary, notes or table).
 * Returns "" for groups without a layout.
 * @param {object} group
 * @returns {string}
 */
export function formatGroupLayoutText(group) {
  const layout = getReadingGroupLayout(group);
  if (layout === "items") return "";
  const lines = [];
  const title = group.table?.title || group.summary?.title || group.title;
  if (title) lines.push(title);

  if (layout === "summary") {
    getSummaryParagraphs(group).forEach((p) => lines.push(gapTextToPlain(p)));
  } else if (layout === "notes") {
    getNotesSections(group).forEach((sec) => {
      if (sec.heading) lines.push(gapTextToPlain(sec.heading));
      sec.lines.forEach((l) => lines.push(gapTextToPlain(l)));
    });
  } else {
    if (Array.isArray(group.table.headers)) {
      lines.push(group.table.headers.join(" | "));
    }
    group.table.rows.forEach((row) => {
      if (!Array.isArray(row)) return;
      lines.push(row.map((cell) => gapTextToPlain(typeof cell === "string" ? cell : "").replace(/\n/g, " ")).join(" | "));
    });
  }
  return lines.join("\n");
}
