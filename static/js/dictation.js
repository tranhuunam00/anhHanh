/**
 * Dictation Domain Comparator & LocalStorage State Manager (Client-side)
 */
class DictationManager {
  constructor() {
    this.storageKeyPrefix = "yt_dictation_";
  }

  cleanWord(token) {
    if (!token) return "";
    return token
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/^[^\w']+|[^\w']+$/g, "")
      .trim()
      .toLowerCase();
  }

  /**
   * Compare user's input with target sentence word-by-word
   */
  evaluate(targetText, userInput, strictPunctuation = false) {
    const targetTokens = targetText.trim().split(/\s+/).filter(Boolean);
    const userTokens = userInput.trim().split(/\s+/).filter(Boolean);

    const words = [];
    let correctCount = 0;
    const maxLen = Math.max(targetTokens.length, userTokens.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < targetTokens.length && i < userTokens.length) {
        const t = targetTokens[i];
        const u = userTokens[i];
        const isMatch = strictPunctuation
          ? t === u
          : this.cleanWord(t) === this.cleanWord(u);

        if (isMatch) {
          words.push({ targetWord: t, userWord: u, status: "correct" });
          correctCount++;
        } else {
          words.push({ targetWord: t, userWord: u, status: "incorrect" });
        }
      } else if (i < targetTokens.length) {
        words.push({
          targetWord: targetTokens[i],
          userWord: null,
          status: "missing",
        });
      } else {
        words.push({
          targetWord: "",
          userWord: userTokens[i],
          status: "extra",
        });
      }
    }

    const isCompleted =
      correctCount === targetTokens.length &&
      userTokens.length === targetTokens.length;
    const accuracy =
      targetTokens.length > 0
        ? Math.round((correctCount / targetTokens.length) * 100)
        : 0;

    return {
      isCompleted,
      accuracy,
      correctCount,
      totalWords: targetTokens.length,
      words,
    };
  }

  /**
   * Get the next letter hint for the user
   */
  getNextLetterHint(targetText, currentInput) {
    const targetTrimmed = targetText.trim();
    if (currentInput.length >= targetTrimmed.length) {
      return currentInput;
    }
    // Return current input plus next character from target
    const nextChar = targetTrimmed[currentInput.length];
    return currentInput + nextChar;
  }

  /**
   * Get the next word hint
   */
  getNextWordHint(targetText, currentInput) {
    const targetTokens = targetText.trim().split(/\s+/).filter(Boolean);
    const userTokens = currentInput.trim().split(/\s+/).filter(Boolean);

    let nextIndex = 0;
    for (let i = 0; i < userTokens.length; i++) {
      if (
        i < targetTokens.length &&
        this.cleanWord(userTokens[i]) === this.cleanWord(targetTokens[i])
      ) {
        nextIndex = i + 1;
      } else {
        break;
      }
    }

    if (nextIndex < targetTokens.length) {
      const correctPrefix = targetTokens.slice(0, nextIndex + 1).join(" ");
      return correctPrefix + " ";
    }
    return targetText;
  }

  // --- LocalStorage Progress Helpers ---
  saveProgress(videoId, position, input, isCompleted = false) {
    try {
      const key = `${this.storageKeyPrefix}${videoId}`;
      const data = JSON.parse(localStorage.getItem(key) || "{}");
      if (!data.challenges) data.challenges = {};

      data.challenges[position] = {
        input,
        isCompleted: isCompleted || data.challenges[position]?.isCompleted,
        lastUpdated: Date.now(),
      };
      data.lastPosition = position;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  loadProgress(videoId) {
    try {
      const key = `${this.storageKeyPrefix}${videoId}`;
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (e) {
      return {};
    }
  }
}
