/**
 * Visual Vocabulary Logic & Math Utilities
 * Pure functions supporting layout math, quiz generation, grading, and search
 */

/**
 * Clamp a number between min and max
 */
export const clamp = (val, min = 0, max = 100) => {
  if (typeof val !== "number" || isNaN(val)) return min;
  return Math.max(min, Math.min(max, val));
};

/**
 * Normalizes coordinates into 0..100 percentage values
 */
export const normalizeHotspotCoords = (x, y) => {
  return {
    x: clamp(Number(x) || 0, 0, 100),
    y: clamp(Number(y) || 0, 0, 100),
  };
};

/**
 * Calculates Euclidean distance between two percentage coordinates
 */
export const calculateDistancePercent = (x1, y1, x2, y2) => {
  const dx = Number(x1) - Number(x2);
  const dy = Number(y1) - Number(y2);
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Verifies if clicked coordinates hit the target hotspot within tolerance
 */
export const isPointNearHotspot = (clickX, clickY, hotspotX, hotspotY, toleranceRadius = 6.5) => {
  if (clickX == null || clickY == null || hotspotX == null || hotspotY == null) {
    return false;
  }
  const distance = calculateDistancePercent(clickX, clickY, hotspotX, hotspotY);
  return distance <= Math.max(1, toleranceRadius);
};

/**
 * Shuffles an array with Fisher-Yates algorithm (immutably)
 */
export const shuffleArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Generates quiz question queue for "Spot & Tap" challenge
 */
export const generateSpotChallengeList = (items, maxQuestions = null) => {
  if (!Array.isArray(items) || items.length === 0) return [];
  const shuffled = shuffleArray(items);
  const limit = maxQuestions && maxQuestions > 0 ? Math.min(maxQuestions, shuffled.length) : shuffled.length;
  return shuffled.slice(0, limit);
};

/**
 * Generates options for Multiple Choice Matching on a Hotspot
 */
export const generateDistractorOptions = (targetItem, allItems, totalOptions = 4) => {
  if (!targetItem || !Array.isArray(allItems)) return [];
  const others = allItems.filter((it) => it && it.id !== targetItem.id);
  const shuffledOthers = shuffleArray(others);
  const pickedDistractors = shuffledOthers.slice(0, Math.max(0, totalOptions - 1));
  const options = shuffleArray([targetItem, ...pickedDistractors]);
  return options;
};

/**
 * Filters items by query across word, meaning, or IPA
 */
export const filterItemsByQuery = (items, query = "") => {
  if (!Array.isArray(items)) return [];
  if (!query || !query.trim()) return items;
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (!item) return false;
    const w = (item.word || "").toLowerCase();
    const m = (item.meaning || "").toLowerCase();
    const i = (item.ipa || "").toLowerCase();
    return w.includes(q) || m.includes(q) || i.includes(q);
  });
};

/**
 * Formats completion percentage as rounded integer (0-100)
 */
export const calculateCompletionRate = (completedIds, totalItems) => {
  const total = typeof totalItems === "number" ? totalItems : (Array.isArray(totalItems) ? totalItems.length : 0);
  if (!total || total <= 0) return 0;
  const count = Array.isArray(completedIds)
    ? completedIds.length
    : (completedIds instanceof Set ? completedIds.size : 0);
  return Math.min(100, Math.round((count / total) * 100));
};

/**
 * Normalizes user input string for spelling comparison (ignores case, extra spaces, and hyphens)
 */
export const isSpellingMatch = (input, target) => {
  if (typeof input !== "string" || typeof target !== "string") return false;
  const cleanA = input.trim().toLowerCase().replace(/[\s\-_]/g, "");
  const cleanB = target.trim().toLowerCase().replace(/[\s\-_]/g, "");
  return cleanA.length > 0 && cleanA === cleanB;
};

/**
 * Computes zoom transform style object
 */
export const getZoomTransformStyle = (scale = 1, panX = 0, panY = 0) => {
  const safeScale = Math.max(0.5, Math.min(4, Number(scale) || 1));
  const safePanX = Number(panX) || 0;
  const safePanY = Number(panY) || 0;
  return {
    transform: `translate(${safePanX}px, ${safePanY}px) scale(${safeScale})`,
    transformOrigin: "center center",
    transition: "transform 0.15s ease-out",
  };
};
