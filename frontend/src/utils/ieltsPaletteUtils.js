/**
 * IELTS Question Palette Utility Functions
 * Module hóa theo Rule 4 & Rule 6
 */

/**
 * Helper to determine if a question has been answered
 * @param {Record<string|number, any>} answers
 * @param {number|string} qNum
 * @returns {boolean}
 */
export function isQuestionAnswered(answers, qNum) {
  if (!answers || typeof answers !== "object") return false;
  const val = answers[qNum] !== undefined ? answers[qNum] : answers[String(qNum)];
  if (val === undefined || val === null) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

/**
 * Calculates whether the question strip can scroll left/right and if overflow exists
 * @param {number} scrollLeft
 * @param {number} scrollWidth
 * @param {number} clientWidth
 * @param {number} [threshold=4]
 * @returns {{ canScrollLeft: boolean, canScrollRight: boolean, hasOverflow: boolean }}
 */
export function calculateScrollBounds(scrollLeft = 0, scrollWidth = 0, clientWidth = 0, threshold = 4) {
  const sLeft = Number.isFinite(scrollLeft) ? Math.max(0, scrollLeft) : 0;
  const sWidth = Number.isFinite(scrollWidth) ? Math.max(0, scrollWidth) : 0;
  const cWidth = Number.isFinite(clientWidth) ? Math.max(0, clientWidth) : 0;
  const maxScroll = Math.max(0, sWidth - cWidth);

  const hasOverflow = maxScroll > threshold;
  const canScrollLeft = hasOverflow && sLeft > threshold;
  const canScrollRight = hasOverflow && sLeft < (maxScroll - threshold);

  return {
    canScrollLeft,
    canScrollRight,
    hasOverflow
  };
}

/**
 * Calculates target scrollLeft to center a specific question badge inside container
 * @param {number} badgeOffsetLeft
 * @param {number} badgeWidth
 * @param {number} containerWidth
 * @param {number} [maxScroll=Infinity]
 * @returns {number}
 */
export function calculateCenteredScrollPosition(badgeOffsetLeft = 0, badgeWidth = 25, containerWidth = 0, maxScroll = Infinity) {
  const cWidth = Number.isFinite(containerWidth) ? containerWidth : 0;
  if (cWidth <= 0) return 0;
  const offset = Number.isFinite(badgeOffsetLeft) ? badgeOffsetLeft : 0;
  const bWidth = Number.isFinite(badgeWidth) ? badgeWidth : 25;
  const mScroll = Number.isFinite(maxScroll) && maxScroll >= 0 ? maxScroll : Infinity;

  const target = offset - (cWidth / 2) + (bWidth / 2);
  return Math.max(0, Math.min(Math.round(target), mScroll));
}

/**
 * Computes new scrollLeft during mouse dragging bounded by [0, maxScroll]
 * @param {number} scrollStartLeft
 * @param {number} startPointerX
 * @param {number} currentPointerX
 * @param {number} [maxScroll=Infinity]
 * @returns {number}
 */
export function calculateDragScroll(scrollStartLeft = 0, startPointerX = 0, currentPointerX = 0, maxScroll = Infinity) {
  const sStart = Number.isFinite(scrollStartLeft) ? scrollStartLeft : 0;
  const startX = Number.isFinite(startPointerX) ? startPointerX : 0;
  const curX = Number.isFinite(currentPointerX) ? currentPointerX : 0;
  const mScroll = Number.isFinite(maxScroll) && maxScroll >= 0 ? maxScroll : Infinity;

  const distance = curX - startX;
  const nextScroll = sStart - distance;
  return Math.max(0, Math.min(Math.round(nextScroll), mScroll));
}

/**
 * Determines whether pointer movement was large enough to treat as drag instead of click
 * @param {number} dragDistance
 * @param {number} [threshold=5]
 * @returns {boolean}
 */
export function shouldPreventClickAfterDrag(dragDistance = 0, threshold = 5) {
  const dist = Number.isFinite(dragDistance) ? Math.abs(dragDistance) : 0;
  return dist >= threshold;
}

/**
 * Computes next scroll position when clicking arrow step buttons
 * @param {number} currentScrollLeft
 * @param {'left'|'right'} direction
 * @param {number} [step=180]
 * @param {number} [maxScroll=Infinity]
 * @returns {number}
 */
export function calculateStepScroll(currentScrollLeft = 0, direction = "right", step = 180, maxScroll = Infinity) {
  const current = Number.isFinite(currentScrollLeft) ? Math.max(0, currentScrollLeft) : 0;
  const stepAmount = Number.isFinite(step) ? Math.max(0, step) : 180;
  const mScroll = Number.isFinite(maxScroll) && maxScroll >= 0 ? maxScroll : Infinity;

  if (direction === "left") {
    return Math.max(0, Math.round(current - stepAmount));
  }
  return Math.min(mScroll, Math.round(current + stepAmount));
}
