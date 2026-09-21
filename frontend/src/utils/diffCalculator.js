export const cleanWord = (token) => {
  if (!token) return "";
  return token
    .replace(/[’‘]/g, "'")
    .replace(/[“”«»„]/g, '"')
    .replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, "")
    .trim()
    .toLowerCase();
};

export const evaluateMasked = (targetText, userInput, strictPunctuation = false) => {
  // Triệt tiêu nhiều dấu cách liên tiếp (2 space trở lên) thành 1 dấu space duy nhất
  const rawInput = (userInput || "").replace(/[^\S\r\n]+/g, " ").trim();
  const uChars = Array.from(rawInput);
  const tClean = (targetText || "").replace(/[^\S\r\n]+/g, " ").trim();
  const tChars = Array.from(tClean);

  let uIdx = 0;
  const words = [];
  let currentWord = [];
  let totalLetterCount = 0;
  let correctLetterCount = 0;
  let hasWrong = false;

  const isPunctuation = (ch) => /^[^\p{L}\p{N}\s]$/u.test(ch);

  for (let tIdx = 0; tIdx < tChars.length; tIdx++) {
    const tChar = tChars[tIdx];
    const isSpace = /\s/.test(tChar);
    const isPunct = isPunctuation(tChar);

    if (isSpace) {
      if (currentWord.length > 0) {
        words.push(currentWord);
        currentWord = [];
      }
      // Triệt tiêu toàn bộ các dấu space liên tiếp trong user input
      while (uIdx < uChars.length && /\s/.test(uChars[uIdx])) {
        uIdx++;
      }
      continue;
    }

    if (isPunct) {
      // Trước khi so khớp dấu câu, nếu user input có khoảng trắng thừa thì bỏ qua
      if (!strictPunctuation) {
        while (uIdx < uChars.length && /\s/.test(uChars[uIdx])) {
          uIdx++;
        }
      }
      if (uIdx < uChars.length) {
        const uChar = uChars[uIdx];
        if (uChar === tChar) {
          uIdx++;
        } else if (isPunctuation(uChar)) {
          if (strictPunctuation) {
            hasWrong = true;
          }
          uIdx++;
        }
      }
      currentWord.push({
        char: tChar,
        display: tChar,
        status: "punct",
      });
      continue;
    }

    // Target is alphanumeric letter/digit
    totalLetterCount++;

    // Bỏ qua mọi dấu cách thừa trong user input nếu target không phải space
    while (uIdx < uChars.length && /\s/.test(uChars[uIdx])) {
      uIdx++;
    }

    // Skip any unexpected user punctuation if not strictPunctuation
    if (!strictPunctuation) {
      while (uIdx < uChars.length && isPunctuation(uChars[uIdx])) {
        uIdx++;
      }
    }

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

  // Consume remaining trailing user punctuation/whitespace
  while (uIdx < uChars.length && (/\s/.test(uChars[uIdx]) || (!strictPunctuation && isPunctuation(uChars[uIdx])))) {
    uIdx++;
  }

  if (currentWord.length > 0) {
    words.push(currentWord);
  }

  const isCompleted =
    correctLetterCount === totalLetterCount &&
    !hasWrong &&
    (uIdx >= uChars.length || !strictPunctuation);

  return {
    words,
    isCompleted,
    correctLetterCount,
    totalLetterCount,
    hasWrong,
  };
};

export const getNextLetterHint = (targetText, currentInput) => {
  const targetTrimmed = targetText.trim();
  if (currentInput.length >= targetTrimmed.length) {
    return currentInput;
  }
  const nextChar = targetTrimmed[currentInput.length];
  return currentInput + nextChar;
};

export const getNextWordHint = (targetText, currentInput) => {
  const targetTokens = targetText.trim().split(/\s+/).filter(Boolean);
  const userTokens = currentInput.trim().split(/\s+/).filter(Boolean);

  let nextIndex = 0;
  for (let i = 0; i < userTokens.length; i++) {
    if (
      i < targetTokens.length &&
      cleanWord(userTokens[i]) === cleanWord(targetTokens[i])
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
};
