/**
 * Context Cloze & Inflection Masking Engine for Dạng 3 (Điền từ vào câu)
 * Provides inflection-aware word masking and POS-matched, non-repeating
 * fallback context sentences when a vocabulary item has no example sentence.
 */

const NON_ADVERB_LY_WORDS = new Set([
  "friendly",
  "likely",
  "unlikely",
  "lovely",
  "lonely",
  "costly",
  "lively",
  "silly",
  "ugly",
  "early",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "timely",
  "deadly",
  "holy",
  "elderly",
  "orderly",
  "brotherly",
  "fatherly",
  "motherly",
  "family",
  "supply",
  "apply",
  "reply",
  "rely",
  "comply",
  "multiply",
  "ally",
  "bully",
  "jelly",
  "rally",
  "tally",
  "belly",
  "italy",
  "july",
  "only",
]);

export const CLOZE_TEMPLATES_EN_BY_POS = {
  verb: [
    "In this situation, we need to [ ______ ] carefully before making a final decision.",
    "The team decided to [ ______ ] in order to address the issue effectively.",
    "How did they manage to [ ______ ] under such intense pressure?",
    "Experts often advise learners to [ ______ ] when facing this challenge.",
    "It takes consistent effort to [ ______ ] successfully in real-world practice.",
    "She tried her best to [ ______ ] as soon as the opportunity arose.",
    "Many organizations plan to [ ______ ] over the next few months.",
    "You should always [ ______ ] whenever this situation occurs.",
  ],
  adjective: [
    "Everyone agreed that the situation had become increasingly [ ______ ].",
    "The final outcome turned out to be much more [ ______ ] than expected.",
    "From a practical perspective, this approach seems very [ ______ ].",
    "The researchers found the new evidence to be remarkably [ ______ ].",
    "Under these conditions, remaining [ ______ ] is the wisest choice.",
    "Her response to the unexpected news was surprisingly [ ______ ].",
    "Critics described the latest proposal as both practical and [ ______ ].",
    "It is important to stay [ ______ ] when dealing with complex tasks.",
  ],
  adverb: [
    "The team handled the entire project [ ______ ] from start to finish.",
    "Things changed [ ______ ] after the new strategy was introduced.",
    "She spoke [ ______ ] about the challenges they had overcome.",
    "The system operated [ ______ ] throughout the testing phase.",
    "He responded [ ______ ] when asked about the upcoming plan.",
    "They worked [ ______ ] to meet the strict deadline on time.",
    "The speaker explained the concept [ ______ ] so everyone could follow.",
    "The market reacted [ ______ ] to the announcement this morning.",
  ],
  noun: [
    "Today's discussion focuses on [ ______ ] and its practical impact in daily life.",
    "The report highlights the importance of [ ______ ] in modern society.",
    "During the meeting, several experts raised key points about [ ______ ].",
    "Understanding [ ______ ] helps people communicate more effectively in this context.",
    "The article provides a clear explanation of [ ______ ] with real-world examples.",
    "In this scenario, paying close attention to [ ______ ] can make a big difference.",
    "Researchers have spent years studying [ ______ ] from different perspectives.",
    "Many professionals consider [ ______ ] a key factor in long-term success.",
  ],
  phrase: [
    "In everyday communication, people often use “[ ______ ]” in this situation.",
    "During the conversation, the speaker used the expression “[ ______ ]” to make the point clear.",
    "Writers frequently use “[ ______ ]” when describing this kind of scenario.",
    "To sound more natural in English, you can use the phrase “[ ______ ]” here.",
    "In this context, “[ ______ ]” is the most appropriate expression to use.",
    "Native speakers commonly choose “[ ______ ]” when talking about this topic.",
    "The article used the expression “[ ______ ]” to emphasize the main idea.",
    "When facing this situation, “[ ______ ]” is a useful phrase to remember.",
  ],
  general: [
    "In English communication, the term “[ ______ ]” is used in this context.",
    "During the lesson, we practiced using “[ ______ ]” in real-life situations.",
    "The passage uses “[ ______ ]” to express this key idea clearly.",
    "When discussing this topic, speakers often choose “[ ______ ]” for accuracy.",
    "In this context, “[ ______ ]” is the exact vocabulary item needed.",
    "Understanding how to use “[ ______ ]” will improve your fluency on this topic.",
    "Writers frequently choose “[ ______ ]” to convey this specific meaning.",
    "Which vocabulary item best fits the expression “[ ______ ]” in this context?",
  ],
};

export const CLOZE_TEMPLATES_BY_LANG = {
  fr: [
    "L'orateur a souligné que [ ______ ] est essentiel pour atteindre cet objectif.",
    "Dans ce contexte, le terme « [ ______ ] » est couramment utilisé en français.",
    "Les experts ont discuté de l'importance de « [ ______ ] » lors de la réunion.",
    "Pour exprimer cette idée avec précision, on utilise souvent « [ ______ ] ».",
  ],
  de: [
    "Der Sprecher betonte, dass [ ______ ] für dieses Ziel unerlässlich ist.",
    "In diesem Zusammenhang wird der Begriff „[ ______ ]“ häufig verwendet.",
    "Die Experten diskutierten über die Bedeutung von „[ ______ ]“ im Alltag.",
    "Um diesen Gedanken genau auszudrücken, wählt man oft das Wort „[ ______ ]“.",
  ],
  ja: [
    "目標を達成するためには、[ ______ ] が極めて重要であると強調された。",
    "この文脈では、「[ ______ ]」という表現がよく使われます。",
    "会議では「[ ______ ]」の重要性について詳しく議論されました。",
    "この意味を正確に伝えるには、「[ ______ ]」という言葉が最適です。",
  ],
  zh: [
    "发言人强调，[ ______ ] 对于实现这一目标至关重要。",
    "在这个语境中，“[ ______ ]”是一个非常常用的表达。",
    "专家们在会议上重点讨论了“[ ______ ]”的实际应用。",
    "为了准确表达这个意思，人们通常会使用“[ ______ ]”。",
  ],
  ko: [
    "발표자는 이 목표를 달성하기 위해 [ ______ ] 이/가 필수적이라고 강조했습니다.",
    "이 문맥에서는 '[ ______ ]'이라는 표현이 자주 사용됩니다.",
    "전문가들은 회의에서 '[ ______ ]'의 중요성에 대해 논의했습니다.",
    "이 의미를 정확하게 전달하기 위해 보통 '[ ______ ]'을/를 사용합니다.",
  ],
  es: [
    "El orador enfatizó que [ ______ ] es fundamental para lograr este objetivo.",
    "En este contexto, el término «[ ______ ]» se utiliza con mucha frecuencia.",
    "Los expertos destacaron la importancia de «[ ______ ]» durante la conferencia.",
    "Para expresar esta idea con claridad, se suele elegir la palabra «[ ______ ]».",
  ],
};

/**
 * Deterministic string hash mapped to [0, modulo - 1]
 */
export const hashWordToIndex = (text, modulo) => {
  if (!modulo || modulo <= 1) return 0;
  const str = String(text || "").trim().toLowerCase();
  if (!str) return 0;

  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % modulo;
};

/**
 * Infer grammatical category (verb, adjective, adverb, noun, phrase, general)
 * from explicit part_of_speech, word morphology, and Vietnamese meaning markers.
 */
export const inferWordPosCategory = (item) => {
  if (!item || typeof item !== "object") return "general";

  const rawWord = String(item.word || "").trim();
  const lowerWord = rawWord.toLowerCase();
  const rawPos = String(item.part_of_speech || "").trim().toLowerCase();
  const rawMeaning = String(item.meaning || "").trim().toLowerCase();

  // 1. Explicit part_of_speech tag priority
  if (rawPos) {
    if (rawPos.includes("phrasal") || rawPos.includes("idiom") || rawPos.includes("cụm")) {
      return "phrase";
    }
    if (rawPos.includes("phrase") && lowerWord.includes(" ")) {
      return "phrase";
    }
    if (rawPos.includes("adv") || rawPos.includes("trạng từ")) {
      return "adverb";
    }
    if (rawPos.includes("adj") || rawPos.includes("tính từ")) {
      return "adjective";
    }
    if (rawPos.includes("verb") || /\bv\.?\b/.test(rawPos) || rawPos.includes("động từ")) {
      return "verb";
    }
    if (rawPos.includes("noun") || /\bn\.?\b/.test(rawPos) || rawPos.includes("danh từ")) {
      return "noun";
    }
  }

  // 2. Multi-word expressions
  if (lowerWord.includes(" ")) {
    if (lowerWord.startsWith("to ") && lowerWord.split(/\s+/).length === 2) {
      return "verb";
    }
    return "phrase";
  }

  // 3. Vietnamese meaning prefix markers
  if (rawMeaning.startsWith("một cách ")) {
    return "adverb";
  }
  if (/^(sự|việc|người|những|cơn|cuộc|mối|khả năng|tình trạng|hệ thống)\s/.test(rawMeaning)) {
    return "noun";
  }
  if (/^(có tính|thuộc về|đầy|không thể|có khả năng)\s/.test(rawMeaning)) {
    return "adjective";
  }

  // 4. English morphological suffix heuristics
  if (lowerWord.length > 4) {
    if (lowerWord.endsWith("ly") && !NON_ADVERB_LY_WORDS.has(lowerWord)) {
      return "adverb";
    }
    if (/(?:tion|sion|ment|ness|ity|ance|ence|ship|hood|ism|ist)$/.test(lowerWord)) {
      return "noun";
    }
    if (/(?:ful|ous|ive|able|ible|less)$/.test(lowerWord)) {
      return "adjective";
    }
    if (/(?:ize|ise|fy)$/.test(lowerWord)) {
      return "verb";
    }
  }

  return "general";
};

/**
 * Build an inflection-tolerant regex for an English word or phrase
 * Matches base word as well as -s, -es, -d, -ed, -ing, -er, -est, -ly, -ies, -ied,
 * dropped -e stems, and doubled final consonant stems.
 */
export const buildInflectionRegex = (cleanWord) => {
  if (!cleanWord || typeof cleanWord !== "string") return null;
  const trimmed = cleanWord.trim().replace(/^to\s+/i, "");
  if (trimmed.length < 3 || !/^[a-zA-Z]+$/.test(trimmed)) return null;

  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const baseEsc = escapeRegex(trimmed);
  const patterns = [`${baseEsc}(?:s|es|d|ed|ing|er|est|ly)?`];

  // Words ending in 'e' (e.g. achieve -> achieved, achieving; large -> larger)
  if (trimmed.endsWith("e") && trimmed.length >= 4) {
    const noE = escapeRegex(trimmed.slice(0, -1));
    patterns.push(`${noE}(?:ed|ing|er|est|es|able|ation)`);
  }

  // Words ending in consonant + 'y' (e.g. strategy -> strategies, apply -> applied)
  if (/[^aeiou]y$/i.test(trimmed) && trimmed.length >= 4) {
    const noY = escapeRegex(trimmed.slice(0, -1));
    patterns.push(`${noY}(?:ies|ied|ier|iest|ily)`);
  }

  // Words with doubled final consonant (e.g. run -> running, stop -> stopped, big -> bigger)
  if (/[aeiou][bcdfghjklmnpqrstvwxz]$/i.test(trimmed)) {
    const lastChar = escapeRegex(trimmed.slice(-1));
    patterns.push(`${baseEsc}${lastChar}(?:ed|ing|er|est)`);
  }

  return new RegExp(`\\b(?:${patterns.join("|")})\\b`, "i");
};

/**
 * Mask target word in a sentence for Dạng 2 & Dạng 3 context hints
 * Supports exact matches, English morphological inflections, and CJK substrings.
 */
export const maskTargetWordInSentence = (sentence, targetWord) => {
  if (!sentence || typeof sentence !== "string") return "";
  if (!targetWord || typeof targetWord !== "string") return sentence;

  const cleanWord = targetWord.trim();
  if (!cleanWord) return sentence;

  const escaped = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // 1. Exact word boundary matching
  const wordBoundaryRegex = new RegExp(`\\b${escaped}\\b`, "i");
  if (wordBoundaryRegex.test(sentence)) {
    return sentence.replace(wordBoundaryRegex, "[ ______ ]");
  }

  // 2. Inflection-aware word boundary matching for English words
  const inflectionRegex = buildInflectionRegex(cleanWord);
  if (inflectionRegex && inflectionRegex.test(sentence)) {
    return sentence.replace(inflectionRegex, "[ ______ ]");
  }

  // 3. Fallback: non-boundary match (for CJK scripts or hyphenated terms)
  const looseRegex = new RegExp(escaped, "i");
  if (looseRegex.test(sentence)) {
    return sentence.replace(looseRegex, "[ ______ ]");
  }

  return sentence;
};

/**
 * Extract or generate cloze sentence with target word masked as [ ______ ]
 * Handles context_sentence splitting, inflection masking, and POS-aware
 * non-repeating templates when context_sentence is missing.
 */
export const getD3ClozeSentence = (currentItem, questionIndex = null) => {
  if (!currentItem || typeof currentItem !== "object") {
    return {
      clozeSentence: "[ ______ ]",
      originalSentence: "",
      translation: "",
      masked: true,
      isFallback: true,
      posCategory: "general",
    };
  }

  const rawSentence = String(currentItem.context_sentence || "").trim();
  const word = String(currentItem.word || "").trim();
  const posCategory = inferWordPosCategory(currentItem);

  if (rawSentence) {
    let orig = rawSentence;
    let trans = "";

    const bracketIdx = rawSentence.indexOf("[");
    if (bracketIdx > 0 && rawSentence.endsWith("]")) {
      orig = rawSentence.substring(0, bracketIdx).trim();
      trans = rawSentence.substring(bracketIdx + 1, rawSentence.length - 1).trim();
    } else {
      orig = rawSentence.replace(/^"+|"+$/g, "").trim();
    }

    const masked = maskTargetWordInSentence(orig, word);
    if (masked.includes("[ ______ ]")) {
      return {
        clozeSentence: masked,
        originalSentence: orig,
        translation: trans,
        masked: true,
        isFallback: false,
        posCategory,
      };
    }

    return {
      clozeSentence: `${orig} ➔ Điền: [ ______ ]`,
      originalSentence: orig,
      translation: trans,
      masked: true,
      isFallback: false,
      posCategory,
    };
  }

  // Fallback sentence when no context_sentence was recorded
  const sourceLang = String(currentItem.source_lang || "en").trim().toLowerCase();

  if (sourceLang !== "en" && CLOZE_TEMPLATES_BY_LANG[sourceLang]) {
    const langTemplates = CLOZE_TEMPLATES_BY_LANG[sourceLang];
    const idx =
      typeof questionIndex === "number" && questionIndex >= 0
        ? questionIndex % langTemplates.length
        : 0;
    const template = langTemplates[idx];
    return {
      clozeSentence: template,
      originalSentence: template.replace("[ ______ ]", word),
      translation: currentItem.meaning ? `Nghĩa: ${currentItem.meaning}` : "",
      masked: true,
      isFallback: true,
      posCategory,
    };
  }

  const posTemplates =
    CLOZE_TEMPLATES_EN_BY_POS[posCategory] || CLOZE_TEMPLATES_EN_BY_POS.general;
  const idx =
    typeof questionIndex === "number" && questionIndex >= 0
      ? questionIndex % posTemplates.length
      : hashWordToIndex(`${word}:${currentItem.id || ""}`, posTemplates.length);
  const template = posTemplates[idx];

  return {
    clozeSentence: template,
    originalSentence: template.replace("[ ______ ]", word),
    translation: currentItem.meaning ? `Nghĩa: ${currentItem.meaning}` : "",
    masked: true,
    isFallback: true,
    posCategory,
  };
};

