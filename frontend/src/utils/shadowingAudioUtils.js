/**
 * Shadowing Practice Audio & Speech Processing Utilities
 * Provides sentence token alignment, Levenshtein word similarity matching,
 * real-time transcript scoring, and pedagogical pronunciation feedback.
 */

export const SHADOWING_STATUS = {
  EXACT: "EXACT",     // Perfectly matched word (Green)
  CLOSE: "CLOSE",     // Minor typo / close sound (Orange)
  MISSED: "MISSED",   // Omitted or mispronounced (Red / Muted)
};

/**
 * Clean & normalize a word token for linguistic comparison
 */
export const normalizeShadowingToken = (rawToken) => {
  if (!rawToken || typeof rawToken !== "string") return "";
  return rawToken
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'“”’]/g, "")
    .trim();
};

/**
 * Compute Levenshtein distance between two strings
 */
export const computeLevenshteinDistance = (a, b) => {
  const s1 = a || "";
  const s2 = b || "";
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
};

/**
 * Calculate similarity ratio (0.0 to 1.0)
 */
export const computeWordSimilarity = (word1, word2) => {
  const w1 = normalizeShadowingToken(word1);
  const w2 = normalizeShadowingToken(word2);
  if (!w1 && !w2) return 1.0;
  if (!w1 || !w2) return 0.0;
  if (w1 === w2) return 1.0;

  const maxLen = Math.max(w1.length, w2.length);
  const dist = computeLevenshteinDistance(w1, w2);
  return Math.max(0, 1 - dist / maxLen);
};

/**
 * Extract clean English reference sentence from context sentence
 * Filters out Vietnamese translation if embedded
 */
export const getEffectiveShadowingSentence = (item) => {
  if (!item) return "";
  const rawContext = item.context_sentence || "";
  if (!rawContext.trim()) {
    // If no sentence, fall back to the word itself
    return item.word ? `The word is ${item.word}.` : "";
  }

  // If format "English sentence (Nghĩa tiếng Việt)" or "English / Vietnamese"
  const splitMatch = rawContext.split(/[\n\r]|(?:\s*-\s*|\s*\/\s*|\s*\(\s*Nghĩa)/i);
  const primaryEn = splitMatch[0] ? splitMatch[0].replace(/[()]/g, "").trim() : rawContext.trim();
  return primaryEn || item.word || "";
};

/**
 * Compare student speech transcript with reference sentence
 * Performs robust alignment and provides word-by-word feedback
 */
export const compareShadowingTranscript = (referenceSentence, studentTranscript) => {
  const refClean = (referenceSentence || "").trim();
  const spokenClean = (studentTranscript || "").trim();

  if (!refClean) {
    return {
      accuracyScore: 0,
      isPassed: false,
      stars: 0,
      feedbackMessage: "Chưa có câu mẫu để luyện tập.",
      alignedTokens: [],
    };
  }

  // Tokenize preserving original casing for display
  const refWords = refClean.split(/\s+/).filter(Boolean);
  const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

  if (spokenWords.length === 0) {
    return {
      accuracyScore: 0,
      isPassed: false,
      stars: 0,
      feedbackMessage: "Hãy bấm Micro và đọc to theo câu mẫu nhé!",
      alignedTokens: refWords.map((w) => ({
        word: w,
        clean: normalizeShadowingToken(w),
        status: SHADOWING_STATUS.MISSED,
        spokenWord: "",
        similarity: 0,
      })),
    };
  }

  // Map each ref word to closest matching spoken word using forward sliding window
  let spokenIndex = 0;
  let totalScore = 0;

  const alignedTokens = refWords.map((refW) => {
    const cleanRef = normalizeShadowingToken(refW);
    let bestMatchWord = "";
    let bestSim = 0;
    let bestIdx = -1;

    // Search ahead up to 3 tokens in spoken words
    const lookaheadLimit = Math.min(spokenWords.length, spokenIndex + 4);
    for (let j = spokenIndex; j < lookaheadLimit; j++) {
      const sim = computeWordSimilarity(cleanRef, spokenWords[j]);
      if (sim > bestSim) {
        bestSim = sim;
        bestMatchWord = spokenWords[j];
        bestIdx = j;
      }
    }

    let status = SHADOWING_STATUS.MISSED;
    let earned = 0;

    if (bestSim >= 0.85) {
      status = SHADOWING_STATUS.EXACT;
      earned = 1.0;
      spokenIndex = bestIdx + 1;
    } else if (bestSim >= 0.55) {
      status = SHADOWING_STATUS.CLOSE;
      earned = 0.7;
      spokenIndex = bestIdx + 1;
    }

    totalScore += earned;

    return {
      word: refW,
      clean: cleanRef,
      status,
      spokenWord: bestMatchWord,
      similarity: Math.round(bestSim * 100),
    };
  });

  const accuracyScore = Math.min(100, Math.round((totalScore / refWords.length) * 100));
  const isPassed = accuracyScore >= 70;

  let stars = 0;
  let feedbackMessage = "";

  if (accuracyScore >= 85) {
    stars = 3;
    feedbackMessage = "🌟 Xuất sắc! Phát âm và ngữ điệu rất chuẩn xác, nhịp câu tự nhiên!";
  } else if (accuracyScore >= 70) {
    stars = 2;
    feedbackMessage = "👍 Rất tốt! Bạn phát âm rõ ràng, hãy chú ý nhấn nhá thêm các từ màu cam.";
  } else if (accuracyScore >= 50) {
    stars = 1;
    feedbackMessage = "💪 Khá tốt! Bạn đã bắt được nhịp câu, thử nghe lại và đọc to hơn một chút nhé.";
  } else {
    stars = 0;
    feedbackMessage = "💡 Hãy nghe lại câu mẫu bản ngữ và thử nói chậm từng cụm từ nhé.";
  }

  return {
    accuracyScore,
    isPassed,
    stars,
    feedbackMessage,
    alignedTokens,
  };
};
