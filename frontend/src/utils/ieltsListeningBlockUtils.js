/**
 * IELTS Listening Block Helpers & Question Number Extractors
 */

/**
 * Extract all question numbers handled inside a single block
 * @param {Object} block - noteBlock, formBlock, or tableBlock
 * @returns {number[]} Array of question numbers
 */
export function extractQuestionNumbersFromBlock(block) {
  const nums = [];
  if (!block || typeof block !== "object") return nums;

  if (Array.isArray(block.sections)) {
    for (const sec of block.sections) {
      if (Array.isArray(sec.lines)) {
        for (const line of sec.lines) {
          if (line && typeof line.number === "number") {
            nums.push(line.number);
          }
        }
      }
    }
  }

  if (Array.isArray(block.fields)) {
    for (const f of block.fields) {
      if (f && typeof f.number === "number") {
        nums.push(f.number);
      }
    }
  }

  if (Array.isArray(block.rows)) {
    for (const r of block.rows) {
      if (Array.isArray(r)) {
        for (const cell of r) {
          if (cell && typeof cell === "object" && typeof cell.number === "number") {
            nums.push(cell.number);
          }
        }
      }
    }
  }

  return nums;
}

/**
 * Extract all question numbers handled across all blocks in a part
 * @param {Object} part - IELTS part object
 * @returns {Set<number>} Set of handled question numbers
 */
export function extractAllHandledQuestionNumbers(part) {
  const handled = new Set();
  if (!part || typeof part !== "object") return handled;

  if (part.noteBlock) {
    extractQuestionNumbersFromBlock(part.noteBlock).forEach((n) => handled.add(n));
  }
  if (part.formBlock) {
    extractQuestionNumbersFromBlock(part.formBlock).forEach((n) => handled.add(n));
  }
  if (part.tableBlock) {
    extractQuestionNumbersFromBlock(part.tableBlock).forEach((n) => handled.add(n));
  }
  if (Array.isArray(part.contentBlocks)) {
    for (const b of part.contentBlocks) {
      extractQuestionNumbersFromBlock(b).forEach((n) => handled.add(n));
    }
  }
  return handled;
}

