/**
 * Utility functions for preserving and synchronizing AI Writing Studio tab states
 * Ensures that generated keywords, custom sentence frames, and AI outlines
 * are not lost when switching between right-side tabs ("Gợi ý Từ & Câu", "Dàn bài chi tiết", "AI Feedback", "Lịch sử").
 */

/**
 * Returns the effective topic text to use for AI keyword/sentence/outline generation.
 * Falls back safely across custom input, current prompt text, title, or default label.
 *
 * @param {string|null|undefined} effectivePromptText
 * @param {object|null|undefined} currentPrompt
 * @returns {string} Clean trimmed topic text
 */
export function getEffectiveTopicText(effectivePromptText, currentPrompt) {
  if (typeof effectivePromptText === "string" && effectivePromptText.trim()) {
    return effectivePromptText.trim();
  }
  if (currentPrompt && typeof currentPrompt === "object") {
    const candidate = currentPrompt.prompt || currentPrompt.topic || currentPrompt.title;
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return "IELTS Essay Writing";
}

/**
 * Computes a unique cache/identity key for a prompt.
 * Used to detect if the prompt has actually changed (vs just switching tabs).
 *
 * @param {object|null|undefined} currentPrompt
 * @param {string|null|undefined} effectivePromptText
 * @returns {string} Unique identifier for prompt state
 */
export function computePromptKey(currentPrompt, effectivePromptText) {
  if (currentPrompt && typeof currentPrompt === "object") {
    if (currentPrompt.id !== undefined && currentPrompt.id !== null) {
      return String(currentPrompt.id);
    }
    if (typeof currentPrompt.prompt === "string" && currentPrompt.prompt.trim()) {
      return currentPrompt.prompt.trim();
    }
  }
  if (typeof effectivePromptText === "string" && effectivePromptText.trim()) {
    return effectivePromptText.trim();
  }
  return "";
}

/**
 * Determines whether generated extra items (keywords, custom sentences) should be reset.
 * Returns true ONLY when the prompt identity has changed, preserving state across tab switches.
 *
 * @param {string} currentKey
 * @param {string} previousKey
 * @returns {boolean} True if state must be reset
 */
export function shouldResetTabItems(currentKey, previousKey) {
  if (typeof currentKey !== "string" || typeof previousKey !== "string") {
    return false;
  }
  return currentKey !== previousKey;
}

/**
 * Determines whether AI outline should be reset based on prompt config changes.
 *
 * @param {object} currentConfig { topic, genre, subType, language }
 * @param {object} previousConfig { topic, genre, subType, language }
 * @returns {boolean} True if outline must be reset
 */
export function shouldResetAiOutline(currentConfig = {}, previousConfig = {}) {
  const curTopic = (currentConfig?.topic || "").trim();
  const prevTopic = (previousConfig?.topic || "").trim();
  const curGenre = currentConfig?.genre || "";
  const prevGenre = previousConfig?.genre || "";
  const curSubType = currentConfig?.subType || "";
  const prevSubType = previousConfig?.subType || "";
  const curLang = currentConfig?.language || "";
  const prevLang = previousConfig?.language || "";

  return (
    curTopic !== prevTopic ||
    curGenre !== prevGenre ||
    curSubType !== prevSubType ||
    curLang !== prevLang
  );
}

/**
 * Computes CSS style object for tab pane visibility without unmounting component DOM.
 *
 * @param {string} activeTab
 * @param {string} targetTab
 * @param {"flex"|"block"} [displayType="flex"]
 * @returns {object} React CSS style object
 */
export function getTabPaneStyle(activeTab, targetTab, displayType = "flex") {
  const isMatch = Boolean(activeTab && targetTab && activeTab === targetTab);
  if (!isMatch) {
    return { display: "none" };
  }
  if (displayType === "flex") {
    return {
      display: "flex",
      flexDirection: "column",
      flex: "1 1 auto",
      minHeight: 0,
      width: "100%",
    };
  }
  return {
    display: "block",
    width: "100%",
  };
}
