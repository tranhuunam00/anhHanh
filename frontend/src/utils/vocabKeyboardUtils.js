/**
 * Keyboard Navigation & Shortcut Utilities for Vocabulary Notebook
 */

export const STATUS_SEQUENCE = ["NEW", "LEARNING", "MASTERED"];

export const STATUS_LABELS = {
  NEW: "Mới lưu",
  LEARNING: "Đang nhớ",
  MASTERED: "Đã thuộc",
};

/**
 * Returns the next status in the cyclic sequence: NEW -> LEARNING -> MASTERED -> NEW
 * @param {string} currentStatus
 * @returns {string}
 */
export function getNextStatus(currentStatus) {
  if (!currentStatus || typeof currentStatus !== "string") {
    return "LEARNING";
  }
  const upper = currentStatus.toUpperCase().trim();
  const index = STATUS_SEQUENCE.indexOf(upper);
  if (index === -1) {
    return "NEW";
  }
  return STATUS_SEQUENCE[(index + 1) % STATUS_SEQUENCE.length];
}

/**
 * Maps numeric shortcut key ("1", "2", "3") to a vocabulary status
 * @param {string} key
 * @returns {string|null}
 */
export function getStatusFromKey(key) {
  if (!key || typeof key !== "string") return null;
  switch (key.trim()) {
    case "1":
      return "NEW";
    case "2":
      return "LEARNING";
    case "3":
      return "MASTERED";
    default:
      return null;
  }
}

/**
 * Calculates new focused index based on arrow key movement and grid columns
 * @param {number} currentIndex Current focused card index
 * @param {number} totalItems Total number of items displayed on current page
 * @param {string} key Arrow key ('ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp')
 * @param {number} columns Number of columns in current layout (default 3)
 * @returns {number} New valid bounded index
 */
export function calculateNextFocusIndex(currentIndex, totalItems, key, columns = 3) {
  if (!totalItems || totalItems <= 0) return 0;
  const maxIndex = totalItems - 1;
  const safeCurrent = Math.max(0, Math.min(currentIndex, maxIndex));
  const cols = Math.max(1, Math.floor(columns || 1));

  switch (key) {
    case "ArrowRight":
      return Math.min(maxIndex, safeCurrent + 1);

    case "ArrowLeft":
      return Math.max(0, safeCurrent - 1);

    case "ArrowDown": {
      const nextDown = safeCurrent + cols;
      if (nextDown <= maxIndex) return nextDown;
      // If jumping beyond maxIndex, land on the last item if not already on the last row
      const currentRow = Math.floor(safeCurrent / cols);
      const totalRows = Math.ceil(totalItems / cols);
      if (currentRow < totalRows - 1) {
        return maxIndex;
      }
      return safeCurrent;
    }

    case "ArrowUp": {
      const nextUp = safeCurrent - cols;
      if (nextUp >= 0) return nextUp;
      return safeCurrent % cols;
    }

    default:
      return safeCurrent;
  }
}

/**
 * Checks whether the event target is an active input, textarea, or editable element
 * @param {EventTarget} target
 * @returns {boolean}
 */
export function isTextInputElement(target) {
  if (!target || typeof target !== "object") return false;
  const tagName = (target.tagName || "").toUpperCase();
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
    return true;
  }
  if (target.isContentEditable) {
    return true;
  }
  return false;
}

/**
 * Returns user-friendly status badge text
 * @param {string} status
 * @returns {string}
 */
export function getStatusFeedbackText(status) {
  const upper = (status || "").toUpperCase();
  return STATUS_LABELS[upper] || upper || "Không xác định";
}
