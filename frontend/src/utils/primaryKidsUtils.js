/**
 * Primary Kids Safari Game Utilities
 * Functions for audio pronunciation, scoring, sentence checking, and animal mascots
 */

/**
 * Play English text pronunciation via browser SpeechSynthesis
 * @param {string} text English word or sentence
 * @param {number} rate Speech rate (default 0.9 for kids)
 * @returns {boolean} Whether speech request was dispatched
 */
export const playEnglishSpeech = (text, rate = 0.9) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[/\\()_#*]/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    utterance.rate = Math.max(0.6, Math.min(1.2, rate));

    // Try finding an English voice
    const voices = window.speechSynthesis.getVoices() || [];
    const enVoice = voices.find(
      (v) => v.lang && (v.lang.startsWith("en-US") || v.lang.startsWith("en-GB") || v.lang.startsWith("en"))
    );
    if (enVoice) {
      utterance.voice = enVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
};

/**
 * Calculate game percentage, total points, and awarded stars (1-3)
 * @param {number} correctCount Number of correct answers
 * @param {number} totalCount Total items in the challenge
 * @param {number} streakBonus Additional streak combo points
 * @returns {{ percent: number, stars: number, points: number, passed: boolean }}
 */
export const calculateGameScore = (correctCount = 0, totalCount = 1, streakBonus = 0) => {
  const safeTotal = Math.max(1, Number(totalCount) || 1);
  const safeCorrect = Math.max(0, Math.min(safeTotal, Number(correctCount) || 0));
  const safeStreak = Math.max(0, Number(streakBonus) || 0);

  const percent = Math.round((safeCorrect / safeTotal) * 100);
  const stars = getStarRating(percent);
  const basePoints = safeCorrect * 10;
  const points = basePoints + safeStreak * 2;
  const passed = percent >= 60;

  return {
    percent,
    stars,
    points,
    passed
  };
};

/**
 * Return star rating from percentage
 * @param {number} percentage 0 - 100
 * @returns {number} 0, 1, 2, or 3 stars
 */
export const getStarRating = (percentage = 0) => {
  const p = Number(percentage) || 0;
  if (p >= 85) return 3;
  if (p >= 60) return 2;
  if (p >= 30) return 1;
  return 0;
};

/**
 * Pure immutable array shuffle (Fisher-Yates)
 * @param {Array} array Input array
 * @returns {Array} Shuffled copy
 */
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * Validate word order against target sentence
 * Handles trailing punctuation, whitespace, and case insensitivity
 * @param {string[]|string} userWords Array of selected words or assembled string
 * @param {string} targetSentence The reference target sentence
 * @returns {boolean} True if order matches target
 */
export const validateSentenceOrder = (userWords, targetSentence) => {
  if (!userWords || !targetSentence) return false;

  const normalize = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, "")
      .replace(/\s+/g, " ");

  const userStr = Array.isArray(userWords) ? userWords.join(" ") : String(userWords);
  return normalize(userStr) === normalize(targetSentence);
};

/**
 * Classify food noun into countable or uncountable with recommended quantifiers
 * @param {string} noun English food name
 * @returns {{ isCountable: boolean, label: string, recommendedQuantifiers: string[] }}
 */
export const classifyFoodNoun = (noun = "") => {
  if (!noun || typeof noun !== "string") {
    return {
      isCountable: false,
      label: "Không xác định",
      recommendedQuantifiers: ["some"]
    };
  }

  const clean = noun.trim().toLowerCase();
  const COUNTABLE_ITEMS = [
    "apple", "apples",
    "orange", "oranges",
    "cupcake", "cupcakes",
    "carrot", "carrots",
    "banana", "bananas",
    "egg", "eggs",
    "yoghurt pot", "yoghurt pots",
    "mango", "mangoes",
    "sweet", "sweets"
  ];

  const isCountable = COUNTABLE_ITEMS.includes(clean);
  return {
    isCountable,
    label: isCountable ? "Đếm được (Countable)" : "Không đếm được (Uncountable)",
    recommendedQuantifiers: isCountable
      ? ["a few", "many", "some", "any", "several"]
      : ["little", "much", "some", "any", "a lot of"]
  };
};

/**
 * Return animal encouragement message
 * @param {boolean} isCorrect Whether the answer was right
 * @param {string} mascotId 'fox' | 'panda' | 'lion' | 'bunny' | 'owl'
 * @returns {{ text: string, avatar: string }}
 */
export const getAnimalEncouragement = (isCorrect = false, mascotId = "fox") => {
  const MASCOTS = {
    fox: { avatar: "🦊", name: "Cáo Felix" },
    panda: { avatar: "🐼", name: "Gấu Trúc Bao" },
    lion: { avatar: "🦁", name: "Sư Tử Leo" },
    bunny: { avatar: "🐰", name: "Thỏ Ruby" },
    owl: { avatar: "🦉", name: "Cú Oliver" }
  };

  const mascot = MASCOTS[mascotId] || MASCOTS.fox;

  if (isCorrect) {
    const praise = [
      `Xuất sắc quá! ${mascot.name} vỗ tay khen con nè! ⭐`,
      `Đúng rồi! Con thông minh tuyệt đỉnh! 🌟`,
      `Tuyệt cú mèo! Thêm một ngôi sao sáng lấp lánh cho con! 🎉`,
      `Chính xác 100%! Cùng tiến lên màn tiếp theo nào! 🚀`
    ];
    return {
      avatar: mascot.avatar,
      text: praise[Math.floor(Math.random() * praise.length)]
    };
  }

  const cheer = [
    `Đừng nản nhé, ${mascot.name} luôn ở bên cổ vũ con! Thử lại nha! 💖`,
    `Gần đúng rồi! Đọc kĩ gợi ý và làm lại một lần nữa nhé bé yêu! 🌱`,
    `Cố lên nào dũng sĩ nhí! Bạn thú nào cũng tin ở con! ✨`
  ];
  return {
    avatar: mascot.avatar,
    text: cheer[Math.floor(Math.random() * cheer.length)]
  };
};

/**
 * Format unit learning progress summary
 * @param {number|string} unitId Unit number
 * @param {Object} completedData Map of completed games/scores
 * @returns {{ completedCount: number, totalGames: number, percent: number, rank: string }}
 */
export const formatUnitProgress = (unitId = 1, completedData = {}) => {
  const games = ["safari", "panda", "fox", "space", "exam"];
  const safeData = completedData && typeof completedData === "object" ? completedData : {};

  let completedCount = 0;
  games.forEach((gameKey) => {
    const score = safeData[`u${unitId}_${gameKey}`];
    if (score && score.passed) {
      completedCount++;
    }
  });

  const totalGames = games.length;
  const percent = Math.round((completedCount / totalGames) * 100);

  let rank = "Tập sự Safari 🐾";
  if (percent === 100) rank = "Chiến Binh Hoàng Gia 🏆";
  else if (percent >= 60) rank = "Hiệp Sĩ Rừng Xanh 🦁";
  else if (percent >= 20) rank = "Nhà Thám Hiểm Nhí 🌟";

  return {
    completedCount,
    totalGames,
    percent,
    rank
  };
};

