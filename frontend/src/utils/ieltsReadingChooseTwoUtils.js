/**
 * Helpers for reading "Choose TWO letters" groups (pure functions).
 */

/**
 * Removes the "(Second choice)" style marker some data adds to the paired item.
 * @param {string} question
 * @returns {string}
 */
export function cleanChooseTwoQuestion(question) {
  if (typeof question !== "string") return "";
  return question.replace(/\s*\((second choice|\d+ of \d+)\)\s*$/i, "").trim();
}

/**
 * Builds the blocks to draw for a choose-two group. Supports:
 *  - items carrying their own options, paired through pairNumber;
 *  - options on the group with plain items (legacy `pick_multiple`).
 * The question is left empty when the instructions already contain it.
 * @param {object} group
 * @returns {Array<{ numbers: number[], question: string, options: Array }>}
 */
export function getChooseTwoBlocks(group) {
  if (!group || typeof group !== "object") return [];
  const items = Array.isArray(group.items) ? group.items : [];
  const instructions = typeof group.instructions === "string" ? group.instructions : "";
  const dedupe = (question) => {
    const cleaned = cleanChooseTwoQuestion(question);
    return cleaned && instructions.includes(cleaned) ? "" : cleaned;
  };

  const withOptions = items.filter((it) => Array.isArray(it?.options) && it.options.length > 0);
  if (withOptions.length > 0) {
    return withOptions
      .filter((it) => !(it.pairNumber && it.number > it.pairNumber))
      .map((it) => ({
        numbers: [it.number, it.pairNumber].filter((n) => typeof n === "number"),
        question: dedupe(it.question),
        options: it.options
      }));
  }

  if (Array.isArray(group.options) && group.options.length > 0) {
    const numbers = Array.isArray(group.numbers) && group.numbers.length > 0
      ? group.numbers.slice(0, 2)
      : items.map((it) => it?.number).filter((n) => typeof n === "number").slice(0, 2);
    if (numbers.length === 0) return [];
    return [{ numbers, question: dedupe(group.question), options: group.options }];
  }

  return [];
}
