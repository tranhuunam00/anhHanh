/**
 * Utility functions for calculating New Word Weights and ranking keywords for Writing Mode.
 * Helps learners apply high-priority new/review vocabulary from their notebook into essays.
 */

/**
 * Escape special regex characters in a string
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Calculate the new word weight for a specific word/phrase.
 * Score range: 10 - 100 (higher score = higher priority to use in essay)
 *
 * @param {string} rawWord - The keyword or phrase
 * @param {Object|null} vocabItem - The saved vocabulary item from user notebook (if any)
 * @param {Object} [promptContext={}] - The prompt context { prompt, keywords, topic_category }
 * @returns {Object|null} Ranked word data or null if invalid
 */
export function calculateWordWeight(rawWord, vocabItem = null, promptContext = {}) {
  if (!rawWord || typeof rawWord !== "string") return null;
  const word = rawWord.trim();
  if (!word) return null;

  const normalizedWord = word.toLowerCase();
  const reasons = [];
  let score = 0;

  // 1. Learning Status & Need Score (Max 50 pts)
  let status = "UNSAVED";
  let isSaved = false;
  let masteryScore = 0;
  let meaning = "";
  let phonetic = "";
  let isOverdue = false;

  if (vocabItem && typeof vocabItem === "object") {
    isSaved = true;
    status = (vocabItem.status || "NEW").toUpperCase();
    masteryScore = typeof vocabItem.mastery_score === "number" ? vocabItem.mastery_score : 0;
    meaning = vocabItem.meaning || vocabItem.definition || "";
    phonetic = vocabItem.phonetic || vocabItem.ipa || "";

    // Check Spaced Repetition overdue
    if (vocabItem.next_review_at) {
      try {
        const reviewDate = new Date(vocabItem.next_review_at);
        if (!isNaN(reviewDate.getTime()) && reviewDate <= new Date()) {
          isOverdue = true;
        }
      } catch {
        isOverdue = false;
      }
    }

    if (status === "NEW") {
      score += 48;
      reasons.push("Từ mới thêm (+48)");
    } else if (status === "LEARNING") {
      const learningBonus = Math.max(15, Math.round(38 * (1 - masteryScore / 100)));
      score += learningBonus;
      reasons.push(`Đang học/chưa thuộc (+${learningBonus})`);
    } else if (status === "MASTERED") {
      score += 15;
      reasons.push("Đã thành thạo (+15)");
    } else {
      score += 25;
      reasons.push("Trong sổ từ (+25)");
    }

    if (isOverdue) {
      score += 15;
      reasons.push("Cần ôn tập SRS (+15)");
    }
  } else {
    // Unsaved word from prompt/academic bank
    score += 28;
    reasons.push("Từ khóa học thuật (+28)");
  }

  // 2. Prompt & Topic Relevance (Max 35 pts)
  const promptKeywords = Array.isArray(promptContext?.keywords) ? promptContext.keywords : [];
  const isPromptKeyword = promptKeywords.some(
    (pk) => typeof pk === "string" && pk.trim().toLowerCase() === normalizedWord
  );

  if (isPromptKeyword) {
    score += 30;
    reasons.push("Đề bài chỉ định (+30)");
  }

  const promptText = typeof promptContext?.prompt === "string" ? promptContext.prompt.toLowerCase() : "";
  if (promptText && promptText.includes(normalizedWord)) {
    score += 15;
    reasons.push("Xuất hiện trong đề (+15)");
  }

  const topicCategory = typeof promptContext?.topic_category === "string" ? promptContext.topic_category.toLowerCase() : "";
  if (topicCategory && vocabItem) {
    const vocabContext = `${vocabItem.context_sentence || ""} ${vocabItem.meaning || ""}`.toLowerCase();
    if (vocabContext.includes(topicCategory)) {
      score += 12;
      reasons.push("Cùng chủ đề (+12)");
    }
  }

  // 3. Collocation & Vocabulary Depth Bonus (Max 15 pts)
  const wordCount = word.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 2) {
    score += 10;
    reasons.push("Cụm từ Collocation (+10)");
  } else if (word.length >= 8) {
    score += 5;
    reasons.push("Từ vựng nâng cao (+5)");
  }

  // Clamp score between 10 and 100
  const finalScore = Math.max(10, Math.min(100, Math.round(score)));

  return {
    word,
    normalizedWord,
    weightScore: finalScore,
    status,
    isSaved,
    masteryScore,
    meaning,
    phonetic,
    isPromptKeyword,
    isOverdue,
    reasons,
  };
}

/**
 * Check if a keyword or phrase appears in the essay text.
 * Handles boundary checks and whitespace variations safely.
 *
 * @param {string} keyword - Word or phrase to search
 * @param {string} text - Essay content
 * @returns {boolean}
 */
export function checkKeywordUsageInText(keyword, text) {
  if (!keyword || !text || typeof keyword !== "string" || typeof text !== "string") {
    return false;
  }
  const cleanKw = keyword.trim();
  if (!cleanKw) return false;

  const escaped = escapeRegex(cleanKw).replace(/\s+/g, "\\s+");
  try {
    const regex = new RegExp(`(^|[^a-zA-Z0-9À-ỹ])${escaped}(?=[^a-zA-Z0-9À-ỹ]|$)`, "i");
    return regex.test(text);
  } catch {
    return text.toLowerCase().includes(cleanKw.toLowerCase());
  }
}

/**
 * Extract relevant words from user's vocabulary notebook that fit the essay prompt.
 *
 * @param {Object} savedVocabMap - User's saved vocab map from useAuth()
 * @param {Object} promptContext - Prompt info { prompt, topic_category, keywords }
 * @param {number} [maxItems=5] - Maximum items to extract
 * @returns {Array<Object>} List of relevant vocab items
 */
export function extractRelevantVocabFromNotebook(savedVocabMap, promptContext = {}, maxItems = 5) {
  if (!savedVocabMap || typeof savedVocabMap !== "object") return [];

  const items = Object.values(savedVocabMap).filter((item) => item && item.word);
  if (items.length === 0) return [];

  const promptText = (promptContext?.prompt || "").toLowerCase();
  const topicCategory = (promptContext?.topic_category || "").toLowerCase();

  const scored = items.map((item) => {
    let relScore = 0;
    const wordLower = item.word.toLowerCase();
    const meaningLower = (item.meaning || "").toLowerCase();
    const contextLower = (item.context_sentence || "").toLowerCase();

    // Priority for unlearned / new / overdue
    if (item.status === "NEW") relScore += 30;
    else if (item.status === "LEARNING") relScore += 20;

    if (item.next_review_at && new Date(item.next_review_at) <= new Date()) {
      relScore += 15;
    }

    // Match prompt or topic
    if (topicCategory && (meaningLower.includes(topicCategory) || contextLower.includes(topicCategory))) {
      relScore += 25;
    }
    if (promptText && (promptText.includes(wordLower) || contextLower.includes(promptText.slice(0, 30)))) {
      relScore += 30;
    }

    return { item, relScore };
  });

  return scored
    .sort((a, b) => b.relScore - a.relScore)
    .slice(0, maxItems)
    .map((s) => s.item);
}

/**
 * Rank and combine all keywords (from prompt and relevant notebook vocab) by New Word Weight.
 *
 * @param {Array<string>} promptKeywords - Base keywords from the prompt
 * @param {Object} savedVocabMap - User notebook vocab map
 * @param {Object} promptContext - Prompt context
 * @param {Object} [options={}] - Options { includeNotebookVocab: boolean, maxKeywords: number }
 * @returns {Array<Object>} Sorted list of weighted keywords
 */
export function rankKeywordsByNewWordWeight(
  promptKeywords = [],
  savedVocabMap = {},
  promptContext = {},
  options = {}
) {
  const { includeNotebookVocab = true, maxKeywords = 12 } = options;
  const wordMap = new Map();

  // 1. Add prompt keywords
  if (Array.isArray(promptKeywords)) {
    promptKeywords.forEach((kw) => {
      if (typeof kw === "string" && kw.trim()) {
        const clean = kw.trim();
        wordMap.set(clean.toLowerCase(), clean);
      }
    });
  }

  // 2. Optionally add relevant words from notebook
  if (includeNotebookVocab && savedVocabMap && typeof savedVocabMap === "object") {
    const notebookItems = extractRelevantVocabFromNotebook(savedVocabMap, promptContext, 6);
    notebookItems.forEach((nb) => {
      if (nb?.word) {
        const clean = nb.word.trim();
        const key = clean.toLowerCase();
        if (!wordMap.has(key)) {
          wordMap.set(key, clean);
        }
      }
    });
  }

  // 3. Calculate weights and sort
  const weightedList = [];
  wordMap.forEach((originalWord, key) => {
    const vocabItem = savedVocabMap?.[key] || null;
    const weighted = calculateWordWeight(originalWord, vocabItem, promptContext);
    if (weighted) {
      weightedList.push(weighted);
    }
  });

  // Sort descending by weightScore
  weightedList.sort((a, b) => b.weightScore - a.weightScore);

  return weightedList.slice(0, maxKeywords);
}

/**
 * Calculate usage statistics for a list of weighted keywords against essay text.
 *
 * @param {Array<Object>} rankedKeywords
 * @param {string} essayText
 * @returns {Object} { total, usedCount, percentUsed, usedMap }
 */
export function calculateKeywordUsageStats(rankedKeywords = [], essayText = "") {
  if (!Array.isArray(rankedKeywords) || rankedKeywords.length === 0) {
    return { total: 0, usedCount: 0, percentUsed: 0, usedMap: {} };
  }

  const usedMap = {};
  let usedCount = 0;

  rankedKeywords.forEach((kw) => {
    const wordKey = kw.normalizedWord || kw.word.toLowerCase();
    const isUsed = checkKeywordUsageInText(kw.word, essayText);
    usedMap[wordKey] = isUsed;
    if (isUsed) usedCount++;
  });

  const total = rankedKeywords.length;
  const percentUsed = total > 0 ? Math.round((usedCount / total) * 100) : 0;

  return {
    total,
    usedCount,
    percentUsed,
    usedMap,
  };
}
