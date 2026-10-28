/**
 * Utility functions for Root Words (100 Gốc Từ) feature
 */

/**
 * Filter list of roots by category ID
 * @param {Array} roots
 * @param {string} categoryId
 * @returns {Array}
 */
export function filterRootsByCategory(roots, categoryId) {
  if (!Array.isArray(roots)) return [];
  if (!categoryId || categoryId === "all") return [...roots];
  return roots.filter((r) => r && r.category === categoryId);
}

/**
 * Normalize Vietnamese and English text for flexible search
 * @param {string} str
 * @returns {string}
 */
export function normalizeSearchText(str) {
  if (typeof str !== "string") return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .trim();
}

/**
 * Search roots by keyword across root name, variants, meanings, and words
 * @param {Array} roots
 * @param {string} query
 * @returns {Array}
 */
export function searchRoots(roots, query) {
  if (!Array.isArray(roots)) return [];
  if (typeof query !== "string") return [...roots];
  const q = normalizeSearchText(query);
  if (!q) return [...roots];

  return roots.filter((item) => {
    if (!item) return false;
    const rootNorm = normalizeSearchText(item.root);
    if (rootNorm.includes(q)) return true;

    if (Array.isArray(item.variants)) {
      if (item.variants.some((v) => normalizeSearchText(v).includes(q))) return true;
    }

    const viNorm = normalizeSearchText(item.meaningVi);
    if (viNorm.includes(q)) return true;

    const enNorm = normalizeSearchText(item.meaningEn);
    if (enNorm.includes(q)) return true;

    if (Array.isArray(item.words)) {
      if (
        item.words.some((w) => {
          if (!w) return false;
          return (
            normalizeSearchText(w.word).includes(q) ||
            normalizeSearchText(w.meaningVi).includes(q)
          );
        })
      ) {
        return true;
      }
    }

    return false;
  });
}

/**
 * Structure a word into its visual morphology parts
 * @param {Object} wordObj
 * @returns {Array<{ text: string, meaning: string, type: string, colorClass: string }>}
 */
export function getWordBreakdownParts(wordObj) {
  if (!wordObj || typeof wordObj !== "object") return [];

  const parts = [];

  if (wordObj.prefix && typeof wordObj.prefix === "string") {
    parts.push({
      text: wordObj.prefix,
      meaning: wordObj.prefixMeaning || "",
      type: "prefix",
      colorClass: "part-prefix",
    });
  }

  if (wordObj.root && typeof wordObj.root === "string") {
    parts.push({
      text: wordObj.root,
      meaning: wordObj.rootMeaning || "",
      type: "root",
      colorClass: "part-root",
    });
  }

  if (wordObj.suffix && typeof wordObj.suffix === "string") {
    parts.push({
      text: wordObj.suffix,
      meaning: wordObj.suffixMeaning || "",
      type: "suffix",
      colorClass: "part-suffix",
    });
  }

  return parts;
}

/**
 * Calculate completion percentage and stats for learned roots
 * @param {Array|Set} completedIds
 * @param {number} totalCount
 * @returns {{ completedCount: number, totalCount: number, percentage: number, remainingCount: number }}
 */
export function calculateRootProgress(completedIds, totalCount = 100) {
  const total = typeof totalCount === "number" && totalCount > 0 ? totalCount : 100;
  let completed = 0;

  if (Array.isArray(completedIds)) {
    completed = completedIds.filter((id) => id !== null && id !== undefined).length;
  } else if (completedIds instanceof Set) {
    completed = completedIds.size;
  }

  if (completed < 0) completed = 0;
  if (completed > total) completed = total;

  const percentage = Math.round((completed / total) * 100);
  const remainingCount = Math.max(0, total - completed);

  return {
    completedCount: completed,
    totalCount: total,
    percentage,
    remainingCount,
  };
}

/**
 * Check if assembled word parts match the target word
 * @param {Array<string>} selectedParts
 * @param {string} targetWord
 * @returns {boolean}
 */
export function checkAssemblyAnswer(selectedParts, targetWord) {
  if (!Array.isArray(selectedParts) || typeof targetWord !== "string") return false;

  const assembled = selectedParts
    .map((p) => (typeof p === "string" ? p.replace(/[-]/g, "").trim().toLowerCase() : ""))
    .join("");

  const targetClean = targetWord.replace(/[-]/g, "").trim().toLowerCase();
  return assembled.length > 0 && assembled === targetClean;
}

/**
 * Validate a quiz selection
 * @param {any} selected
 * @param {any} correct
 * @returns {boolean}
 */
export function checkQuizAnswer(selected, correct) {
  if (selected === null || selected === undefined || correct === null || correct === undefined) {
    return false;
  }
  if (typeof selected === "number" && typeof correct === "number") {
    return selected === correct;
  }
  return String(selected).trim().toLowerCase() === String(correct).trim().toLowerCase();
}

/**
 * Get next root ID cyclically
 * @param {number} currentId
 * @param {Array} rootsList
 * @returns {number}
 */
export function getNextRootId(currentId, rootsList) {
  if (!Array.isArray(rootsList) || rootsList.length === 0) return currentId || 1;
  const idx = rootsList.findIndex((r) => r && r.id === currentId);
  if (idx === -1) return rootsList[0].id;
  const nextIdx = (idx + 1) % rootsList.length;
  return rootsList[nextIdx].id;
}

/**
 * Get previous root ID cyclically
 * @param {number} currentId
 * @param {Array} rootsList
 * @returns {number}
 */
export function getPrevRootId(currentId, rootsList) {
  if (!Array.isArray(rootsList) || rootsList.length === 0) return currentId || 1;
  const idx = rootsList.findIndex((r) => r && r.id === currentId);
  if (idx === -1) return rootsList[rootsList.length - 1].id;
  const prevIdx = (idx - 1 + rootsList.length) % rootsList.length;
  return rootsList[prevIdx].id;
}

/**
 * Safely format badge index string (e.g. "02 · NHÌN LẠI, COI TRỌNG")
 * @param {number|string} index
 * @param {string} label
 * @returns {string}
 */
export function formatBadgeIndex(index, label) {
  const num = parseInt(index, 10);
  const formattedNum = !isNaN(num) ? String(num).padStart(2, "0") : "01";
  const cleanLabel = typeof label === "string" ? label.trim().toUpperCase() : "";
  return cleanLabel ? `${formattedNum} · ${cleanLabel}` : formattedNum;
}

/**
 * Count how many roots belong to each category
 * @param {Array} rootsList
 * @returns {Object} { [categoryId]: count }
 */
export function getRootCategoryStats(rootsList) {
  if (!Array.isArray(rootsList)) return {};
  const stats = {};
  for (const root of rootsList) {
    if (root && root.category) {
      stats[root.category] = (stats[root.category] || 0) + 1;
    }
  }
  return stats;
}
