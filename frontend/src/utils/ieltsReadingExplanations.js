/**
 * IELTS Academic Reading Explanation & Evidence Utilities
 * Provides rich explanations, passage evidence quotes, and keyword mappings
 * for review mode ("chữa đề") across Cambridge 17 to Cambridge 21.
 * Adheres to <= 500 lines rule.
 */

import { cam21Test2ReadingExplanations } from "../data/ielts/explanations/cam21Test2ReadingExplanations.js";
import { cam21Test1ReadingExplanations } from "../data/ielts/explanations/cam21Test1ReadingExplanations.js";
import { cam20Test1ReadingExplanations } from "../data/ielts/explanations/cam20Test1ReadingExplanations.js";

// Test-specific curated explanation registries
const EXPLANATION_REGISTRIES = {
  "cambridge-21-test-2": cam21Test2ReadingExplanations,
  "cambridge-21-test-1": cam21Test1ReadingExplanations,
  "cambridge-20-test-1": cam20Test1ReadingExplanations,
};

/**
 * Registers an explanation registry dynamically
 * @param {string} testId 
 * @param {object} registry 
 */
export function registerExplanationRegistry(testId, registry) {
  if (testId && registry) {
    EXPLANATION_REGISTRIES[normalizeTestId(testId)] = registry;
  }
}

/**
 * Normalizes testId string to match keys
 * @param {string|null|undefined} testId 
 * @returns {string}
 */
export function normalizeTestId(testId) {
  if (!testId || typeof testId !== "string") return "cambridge-21-test-2";
  return testId.trim().toLowerCase();
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "of", "to", "in", "and",
  "that", "for", "on", "with", "as", "by", "at", "from", "this", "which",
  "be", "it", "or", "not", "but", "they", "them", "their", "he", "she",
  "his", "her", "have", "has", "had", "do", "does", "did", "can", "could",
  "will", "would", "so", "than", "also", "into", "some", "more", "most",
  "about", "been", "there", "what", "when", "where", "who", "how", "all",
  "only", "very", "just", "much", "many", "other", "such", "then", "both",
  "one", "two", "three", "first", "second", "well", "like", "even", "each"
]);

/**
 * Extracts salient keywords from a string, filtering out stop words.
 * @param {string|null|undefined} text 
 * @returns {string[]}
 */
export function extractSalientKeywords(text) {
  if (!text || typeof text !== "string") return [];
  const tokens = text.match(/\b[A-Za-z0-9'-]+\b/g) || [];
  const keywords = [];

  for (const token of tokens) {
    const lower = token.toLowerCase();
    if (lower.length >= 3 && !STOP_WORDS.has(lower)) {
      keywords.push(token);
    }
  }
  return [...new Set(keywords)];
}

/**
 * Searches a reading passage text for the most relevant sentence containing the given target words.
 * @param {string|null|undefined} passageText 
 * @param {string|null|undefined} targetWord 
 * @returns {string|null}
 */
export function findSentenceWithKeyword(passageText, targetWord) {
  if (!passageText || !targetWord || typeof passageText !== "string" || typeof targetWord !== "string") {
    return null;
  }
  const cleanWord = targetWord.trim().toLowerCase();
  if (!cleanWord || cleanWord.length < 2) return null;

  const sentences = passageText
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const regex = new RegExp(`\\b${cleanWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  for (const sentence of sentences) {
    if (regex.test(sentence)) {
      return sentence;
    }
  }

  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(cleanWord)) {
      return sentence;
    }
  }

  return null;
}

/**
 * Finds the passage sentence that best matches a list of candidate keywords.
 * @param {string} passageText 
 * @param {string[]} keywords 
 * @returns {{ sentence: string|null, score: number, matchedKeywords: string[] }}
 */
export function findSentenceWithBestKeywords(passageText, keywords = []) {
  if (!passageText || typeof passageText !== "string" || !Array.isArray(keywords) || keywords.length === 0) {
    return { sentence: null, score: 0, matchedKeywords: [] };
  }

  const sentences = passageText
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  let bestSentence = null;
  let highestScore = 0;
  let bestMatches = [];

  for (const sentence of sentences) {
    let score = 0;
    const matched = [];
    const lowerSentence = sentence.toLowerCase();

    for (const kw of keywords) {
      const lowerKw = kw.toLowerCase();
      // Whole-word regex match
      const wordRegex = new RegExp(`\\b${lowerKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (wordRegex.test(sentence)) {
        score += /^[A-Z0-9]/.test(kw) ? 3 : 2; // Extra weight for numbers & capitalized terms
        matched.push(kw);
      } else if (lowerSentence.includes(lowerKw)) {
        score += 1;
        matched.push(kw);
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestSentence = sentence;
      bestMatches = matched;
    }
  }

  return { sentence: bestSentence, score: highestScore, matchedKeywords: bestMatches };
}

/**
 * Estimates paragraph or section location of a sentence in the passage text.
 * @param {string} passageText 
 * @param {string} sentence 
 * @returns {string}
 */
export function estimateLocation(passageText, sentence) {
  if (!passageText || !sentence || typeof passageText !== "string" || typeof sentence !== "string") {
    return "Trong bài đọc";
  }

  const paragraphs = passageText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  for (let idx = 0; idx < paragraphs.length; idx++) {
    const pText = paragraphs[idx];
    if (pText.includes(sentence.slice(0, 35))) {
      // Check if paragraph starts with heading letter e.g. "A " or "P1 "
      const matchLabel = pText.match(/^([A-H]|P\d+)\b/);
      if (matchLabel) {
        return `Đoạn ${matchLabel[1]}`;
      }
      return `Đoạn văn ${idx + 1}`;
    }
  }
  return "Trong bài đọc";
}

/**
 * Resolves or dynamically generates explanation for a specific reading question.
 * @param {string|null|undefined} testId 
 * @param {number|string} qNum 
 * @param {string|null|undefined} passageText 
 * @param {object|null|undefined} questionItem 
 * @param {object|null|undefined} evalResult { isCorrect, userAns, accepted }
 * @returns {object}
 */
export function getReadingExplanation(testId, qNum, passageText = "", questionItem = null, evalResult = null) {
  const num = Number(qNum);
  const normalizedId = normalizeTestId(testId);

  // 1. Direct match from curated registry
  const registry = EXPLANATION_REGISTRIES[normalizedId];
  if (registry && registry[num]) {
    return registry[num];
  }

  // 2. Direct embedded explanation inside questionItem data
  if (questionItem && (questionItem.explanation || questionItem.evidence)) {
    return {
      qNum: num,
      answer: questionItem.answer || (Array.isArray(questionItem.answers) ? questionItem.answers.join(" / ") : ""),
      location: questionItem.location || "Trong bài đọc",
      evidence: questionItem.evidence || "",
      explanation: questionItem.explanation || "Đối chiếu nội dung trong đoạn văn để xác định đáp án.",
      keywords: questionItem.keywords || []
    };
  }

  // 3. Fallback: Generate intelligent evidence quote & rationale from question + passage text
  const primaryAnswer =
    evalResult?.accepted?.[0] ||
    (Array.isArray(questionItem?.answers) ? questionItem.answers[0] : questionItem?.answer) ||
    "";

  const upperAns = String(primaryAnswer || "").trim().toUpperCase();
  const isTfOrYn = ["TRUE", "FALSE", "NOT GIVEN", "YES", "NO"].includes(upperAns);
  const isMcqLetter = /^[A-H]$/.test(upperAns);

  let detectedSentence = null;
  let matchedKeywords = [];

  // A. Search by direct answer word if fill-in-the-blank
  if (primaryAnswer && !isTfOrYn && !isMcqLetter) {
    detectedSentence = findSentenceWithKeyword(passageText, primaryAnswer);
  }

  // B. If not found or if TF/MCQ, extract keywords from question / statement
  if (!detectedSentence && questionItem) {
    const qText = questionItem.statement || questionItem.question || questionItem.prefix || "";
    let searchTokens = extractSalientKeywords(qText);

    // If MCQ, also pull keywords from the correct option text
    if (isMcqLetter && Array.isArray(questionItem.options)) {
      const correctOpt = questionItem.options.find((opt) => {
        const str = typeof opt === "string" ? opt : `${opt?.letter || ""} ${opt?.text || ""}`;
        return str.trim().toUpperCase().startsWith(upperAns);
      });
      if (correctOpt) {
        const optText = typeof correctOpt === "string" ? correctOpt : correctOpt.text || "";
        searchTokens = [...searchTokens, ...extractSalientKeywords(optText)];
      }
    }

    const { sentence, score, matchedKeywords: matched } = findSentenceWithBestKeywords(passageText, searchTokens);
    if (score >= 2 || (sentence && searchTokens.length < 3)) {
      detectedSentence = sentence;
      matchedKeywords = matched;
    }
  }

  // Format intelligent explanation rationale
  let explanationText = "";
  if (isTfOrYn) {
    if (upperAns === "TRUE" || upperAns === "YES") {
      explanationText = detectedSentence
        ? `Nội dung trong bài đọc: "${detectedSentence}". Thông tin này khẳng định và trùng khớp với nhận định trong câu hỏi, do đó đáp án là ${upperAns}.`
        : `Nội dung bài đọc hoàn toàn xác nhận tính chính xác của phát biểu, do đó đáp án là ${upperAns}.`;
    } else if (upperAns === "FALSE" || upperAns === "NO") {
      explanationText = detectedSentence
        ? `Nội dung trong bài đọc: "${detectedSentence}". Dẫn chứng này trực tiếp mâu thuẫn / trái ngược với nhận định trong câu hỏi, do đó đáp án là ${upperAns}.`
        : `Thông tin trong bài đọc mâu thuẫn trực tiếp với nhận định trong câu hỏi, do đó đáp án là ${upperAns}.`;
    } else {
      explanationText = "Đoạn văn có đề cập tới các khái niệm hoặc bối cảnh liên quan, nhưng không cung cấp thông tin để khẳng định hay phủ định nhận định này, do đó đáp án là NOT GIVEN.";
    }
  } else if (isMcqLetter) {
    explanationText = detectedSentence
      ? `Đoạn văn đưa ra dẫn chứng: "${detectedSentence}". Thông tin này củng cố và chứng minh đáp án (${upperAns}) là lựa chọn chính xác duy nhất.`
      : `Đáp án chính xác là ${upperAns}. Đối chiếu ngữ cảnh trong bài đọc để đối chiếu các lựa chọn.`;
  } else if (detectedSentence) {
    explanationText = `Từ cần điền "${primaryAnswer}" xuất hiện chuẩn xác trong ngữ cảnh câu: "${detectedSentence}".`;
  } else {
    explanationText = `Đáp án chính xác là "${primaryAnswer}". Đối chiếu các từ đồng nghĩa và cấu trúc câu tương đương trong bài đọc.`;
  }

  const locationText = detectedSentence ? estimateLocation(passageText, detectedSentence) : "Trong bài đọc";

  const formattedKeywords = matchedKeywords
    .filter((kw) => kw.length >= 4 && !STOP_WORDS.has(kw.toLowerCase()))
    .slice(0, 3)
    .map((kw) => ({
      question: `Từ khóa định vị: "${kw}"`,
      passage: `Khớp trực tiếp ngữ cảnh bài đọc`
    }));

  return {
    qNum: num,
    answer: primaryAnswer || (evalResult?.accepted?.join(" / ") || ""),
    location: locationText,
    evidence: detectedSentence || "Vui lòng xem lại nội dung đoạn văn tương ứng với các từ khóa trong câu hỏi.",
    explanation: explanationText,
    keywords: formattedKeywords
  };
}

/**
 * Extracts question numbers from any exercise group object
 * @param {object|null|undefined} group 
 * @returns {number[]}
 */
export function extractQuestionNumbersFromGroup(group) {
  if (!group || typeof group !== "object") return [];
  const numbers = [];

  if (Array.isArray(group.numbers)) {
    numbers.push(...group.numbers);
  }
  if (group.number) {
    numbers.push(group.number);
  }
  if (Array.isArray(group.items)) {
    group.items.forEach((it) => {
      if (it?.number) numbers.push(it.number);
    });
  }
  if (Array.isArray(group.rows)) {
    group.rows.forEach((row) => {
      if (row.subjectQuestion) numbers.push(row.subjectQuestion);
      if (row.questionNumber) numbers.push(row.questionNumber);
      if (row.number) numbers.push(row.number);
      if (Array.isArray(row.questions)) {
        row.questions.forEach((q) => {
          if (q.number) numbers.push(q.number);
        });
      }
    });
  }
  if (Array.isArray(group.steps)) {
    group.steps.forEach((st) => {
      if (st?.number) numbers.push(st.number);
    });
  }
  if (Array.isArray(group.sections)) {
    group.sections.forEach((sec) => {
      sec?.items?.forEach((it) => {
        if (it?.number) numbers.push(it.number);
      });
    });
  }

  // De-duplicate & sort ascending
  return [...new Set(numbers.map(Number))].sort((a, b) => a - b);
}

