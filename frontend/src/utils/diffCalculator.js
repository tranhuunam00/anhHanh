export const cleanWord = (token) => {
  if (!token) return "";
  return token
    .replace(/[’‘']/g, "")
    .replace(/[“”«»„"]/g, "")
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "")
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

export const getNextLetterHint = (targetText, currentInput, strictPunctuation = false) => {
  if (!targetText) return "";
  const rawInput = (currentInput || "").replace(/[^\S\r\n]+/g, " ");
  const tClean = targetText.trim();

  // Nếu input rỗng, gợi ý ký tự đầu tiên
  if (!rawInput.trim()) {
    return tClean.slice(0, 1);
  }

  const uChars = Array.from(rawInput);
  const tChars = Array.from(tClean);
  const isPunctuation = (ch) => /^[^\p{L}\p{N}\s]$/u.test(ch);

  let uIdx = 0;
  for (let tIdx = 0; tIdx < tChars.length; tIdx++) {
    const tChar = tChars[tIdx];
    const isSpace = /\s/.test(tChar);
    const isPunct = isPunctuation(tChar);

    if (isSpace) {
      while (uIdx < uChars.length && /\s/.test(uChars[uIdx])) {
        uIdx++;
      }
      continue;
    }

    if (isPunct) {
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
            uChars[uIdx] = tChar;
            return uChars.join("");
          }
          uIdx++;
        }
      }
      continue;
    }

    // Target là chữ cái hoặc số
    while (uIdx < uChars.length && /\s/.test(uChars[uIdx])) {
      uIdx++;
    }

    if (!strictPunctuation) {
      while (uIdx < uChars.length && isPunctuation(uChars[uIdx])) {
        uIdx++;
      }
    }

    // Nếu người dùng chưa gõ đến ký tự này -> Bổ sung ký tự còn thiếu
    if (uIdx >= uChars.length) {
      if (tIdx > 0 && /\s/.test(tChars[tIdx - 1]) && !/\s$/.test(rawInput)) {
        return rawInput + " " + tChar;
      }
      return rawInput + tChar;
    }

    // Kiểm tra ký tự user đã gõ
    const uChar = uChars[uIdx];
    if (uChar.toLowerCase() === tChar.toLowerCase()) {
      uIdx++;
    } else {
      // Tìm thấy ký tự đầu tiên đang sai trong câu -> Sửa đúng ngay tại vị trí đó
      uChars[uIdx] = tChar;
      return uChars.join("");
    }
  }

  return currentInput;
};

export const getNextWordHint = (targetText, currentInput) => {
  if (!targetText) return "";
  const targetTokens = targetText.trim().split(/\s+/).filter(Boolean);
  const userTokens = (currentInput || "").trim().split(/\s+/).filter(Boolean);

  if (userTokens.length === 0) {
    return targetTokens[0] ? targetTokens[0] + " " : "";
  }

  // Tìm từ đầu tiên đang bị sai hoặc còn thiếu
  let firstWrongIndex = -1;
  for (let i = 0; i < userTokens.length; i++) {
    if (i >= targetTokens.length) {
      firstWrongIndex = i;
      break;
    }
    if (cleanWord(userTokens[i]) !== cleanWord(targetTokens[i])) {
      firstWrongIndex = i;
      break;
    }
  }

  // Nếu tất cả các từ đã gõ đều đúng
  if (firstWrongIndex === -1) {
    if (userTokens.length < targetTokens.length) {
      // Bổ sung từ tiếp theo còn thiếu
      return [...userTokens, targetTokens[userTokens.length]].join(" ") + " ";
    }
    return targetText;
  }

  // Có từ sai tại firstWrongIndex
  const updatedTokens = [...userTokens];

  // Trường hợp user bỏ quên 1 từ (từ hiện tại khớp với từ tiếp theo của target)
  if (
    firstWrongIndex + 1 < targetTokens.length &&
    cleanWord(userTokens[firstWrongIndex]) === cleanWord(targetTokens[firstWrongIndex + 1])
  ) {
    // Chèn từ bị thiếu vào đúng vị trí
    updatedTokens.splice(firstWrongIndex, 0, targetTokens[firstWrongIndex]);
  } else if (firstWrongIndex < targetTokens.length) {
    // Sửa từ sai thành từ đúng, đồng thời GIỮ NGUYÊN các từ phía sau mà user đã gõ
    updatedTokens[firstWrongIndex] = targetTokens[firstWrongIndex];
  } else {
    // Nếu user gõ thừa từ so với câu mẫu
    updatedTokens.splice(targetTokens.length);
  }

  return updatedTokens.join(" ") + " ";
};
