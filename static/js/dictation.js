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
   * Evaluate masked text character-by-character (DailyDictation style: *** ***)
   */
  evaluateMasked(targetText, userInput) {
    const uChars = Array.from((userInput || "").trimStart());
    const tChars = Array.from(targetText || "");

    let uIdx = 0;
    const words = [];
    let currentWord = [];
    let totalLetterCount = 0;
    let correctLetterCount = 0;
    let hasWrong = false;

    for (let tIdx = 0; tIdx < tChars.length; tIdx++) {
      const tChar = tChars[tIdx];
      const isSpace = /\s/.test(tChar);
      const isPunct = /^[^\w\s]$/.test(tChar);

      if (isSpace) {
        if (currentWord.length > 0) {
          words.push(currentWord);
          currentWord = [];
        }
        // Consume space in user input if present
        if (uIdx < uChars.length && /\s/.test(uChars[uIdx])) {
          uIdx++;
        }
        continue;
      }

      if (isPunct) {
        // Punctuation is displayed as-is
        if (uIdx < uChars.length && uChars[uIdx] === tChar) {
          uIdx++;
        }
        currentWord.push({
          char: tChar,
          display: tChar,
          status: "punct",
        });
        continue;
      }

      // Alphanumeric character
      totalLetterCount++;

      if (uIdx < uChars.length) {
        const uChar = uChars[uIdx];
        const isMatch = uChar.toLowerCase() === tChar.toLowerCase();
        if (isMatch) {
          currentWord.push({
            char: tChar,
            display: tChar,
            status: "correct",
          });
          correctLetterCount++;
          uIdx++;
        } else {
          hasWrong = true;
          currentWord.push({
            char: tChar,
            display: "*",
            typedChar: uChar,
            status: "wrong",
          });
          uIdx++;
        }
      } else {
        currentWord.push({
          char: tChar,
          display: "*",
          status: "masked",
        });
      }
    }

    if (currentWord.length > 0) {
      words.push(currentWord);
    }

    const isCompleted =
      correctLetterCount === totalLetterCount &&
      !hasWrong &&
      (uIdx >= uChars.length || (userInput && userInput.trim() === targetText.trim()));

    return {
      words,
      isCompleted,
      correctLetterCount,
      totalLetterCount,
      hasWrong,
    };
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
