/**
 * Lightweight Pure JS Connected Speech & Phonology Breakdown Engine.
 * Analyzes English sentences for:
 * - Consonant-to-Vowel Linking (‿)
 * - Vowel-to-Vowel Glides (ᵂ / ᴶ)
 * - Elision (✕ T/D deletion between consonants)
 * - Coalescent Assimilation (⚡ /t, d/ + /j/ -> /tʃ, dʒ/)
 */

const WEAK_FORM_MAP = {
  to: "/tə/",
  for: "/fər/",
  can: "/kən/",
  and: "/ən/",
  of: "/əv/",
  at: "/ət/",
  from: "/frəm/",
  have: "/həv/",
  has: "/həz/",
  had: "/həd/",
  was: "/wəz/",
  are: "/ər/",
  that: "/ðət/",
  them: "/ðəm/",
  as: "/əz/",
  than: "/ðən/",
  some: "/səm/",
  but: "/bət/",
  you: "/jə/",
  your: "/jər/",
  do: "/də/",
  does: "/dəz/",
};

const VOWELS = new Set(["a", "e", "i", "o", "u"]);
const FRONT_VOWEL_ENDINGS = ["ee", "y", "ie", "ea", "ay", "ey", "i"];
const BACK_VOWEL_ENDINGS = ["oo", "ow", "o", "ew", "ue", "ou"];

export function analyzeSentencePhonology(sentence) {
  if (!sentence || typeof sentence !== "string") {
    return { phenomena: [], tokens: [] };
  }

  const rawWords = sentence.match(/\b[\w'-]+\b/g) || [];
  if (rawWords.length === 0) {
    return { phenomena: [], tokens: [] };
  }

  const tokens = rawWords.map((w, idx) => {
    const clean = w.toLowerCase().replace(/['"]/g, "");
    return {
      index: idx,
      word: w,
      clean,
      weakForm: (idx < rawWords.length - 1 && WEAK_FORM_MAP[clean]) ? WEAK_FORM_MAP[clean] : null,
    };
  });

  const phenomena = [];

  for (let i = 0; i < tokens.length - 1; i++) {
    const w1 = tokens[i];
    const w2 = tokens[i + 1];
    const t1 = w1.clean;
    const t2 = w2.clean;

    // Rule 1: Coalescent Assimilation (/t, d/ + /j/ in 'you' / 'your')
    if (["you", "your", "yours", "yourself", "yet"].includes(t2)) {
      if (t1.endsWith("t")) {
        phenomena.push({
          type: "ASSIMILATION",
          symbol: "⚡",
          name: "Biến âm /t/ + /j/ ➔ /tʃ/",
          pair: `${w1.word} ${w2.word}`,
          connected: `${t1.slice(0, -1)}-ch-oo`,
          desc: `Âm /t/ gặp /j/ hòa nhập thành âm /tʃ/ ('ch').`,
        });
        continue;
      } else if (t1.endsWith("d")) {
        phenomena.push({
          type: "ASSIMILATION",
          symbol: "⚡",
          name: "Biến âm /d/ + /j/ ➔ /dʒ/",
          pair: `${w1.word} ${w2.word}`,
          connected: `${t1.slice(0, -1)}-j-oo`,
          desc: `Âm /d/ gặp /j/ hòa nhập thành âm /dʒ/ ('dj').`,
        });
        continue;
      }
    }

    // Rule 2: Elision (/t, d/ deletion between consonants)
    if (
      (t1.endsWith("st") || t1.endsWith("xt") || t1.endsWith("nd") || t1.endsWith("ld") || t1.endsWith("ct")) &&
      t1.length >= 3
    ) {
      if (!VOWELS.has(t2[0]) && !["w", "y", "h"].includes(t2[0])) {
        const elidedChar = t1.slice(-1);
        phenomena.push({
          type: "ELISION",
          symbol: "✕",
          name: `Nuốt âm /${elidedChar}/`,
          pair: `${w1.word} ${w2.word}`,
          connected: `${t1.slice(0, -1)}' ${t2}`,
          desc: `Âm /${elidedChar}/ cuối từ bị nuốt khi nói nhanh.`,
        });
        continue;
      }
    }

    // Rule 3: Vowel-to-Vowel Glide
    const isVowelStart2 = VOWELS.has(t2[0]);
    const isVowelEnd1 = VOWELS.has(t1.slice(-1)) || FRONT_VOWEL_ENDINGS.some(s => t1.endsWith(s)) || BACK_VOWEL_ENDINGS.some(s => t1.endsWith(s));

    if (isVowelEnd1 && isVowelStart2) {
      if (FRONT_VOWEL_ENDINGS.some(s => t1.endsWith(s)) || ["be", "he", "she", "we", "me", "see", "the"].includes(t1)) {
        phenomena.push({
          type: "GLIDE_J",
          symbol: "ᴶ",
          name: "Âm lướt /j/ (y-glide)",
          pair: `${w1.word} ${w2.word}`,
          connected: `${t1}-j-${t2}`,
          desc: `Chèn âm lướt /j/ giữa 2 nguyên âm.`,
        });
        continue;
      } else if (BACK_VOWEL_ENDINGS.some(s => t1.endsWith(s)) || ["go", "no", "so", "do", "to", "who", "two", "you"].includes(t1)) {
        phenomena.push({
          type: "GLIDE_W",
          symbol: "ᵂ",
          name: "Âm lướt /w/ (w-glide)",
          pair: `${w1.word} ${w2.word}`,
          connected: `${t1}-w-${t2}`,
          desc: `Chèn âm lướt /w/ giữa 2 nguyên âm.`,
        });
        continue;
      }
    }

    // Rule 4: Consonant-to-Vowel Linking
    const lastChar = t1.slice(-1);
    const isConsonantEnd = (!VOWELS.has(lastChar) && lastChar !== "r" && /[a-z]/i.test(lastChar)) ||
      (lastChar === "e" && t1.length > 2 && !VOWELS.has(t1.slice(-2, -1)) && !["the", "she", "he", "be", "we"].includes(t1));

    if (isConsonantEnd && isVowelStart2) {
      const soundC = lastChar !== "e" ? lastChar : t1.slice(-2, -1);
      phenomena.push({
        type: "LINKING",
        symbol: "‿",
        name: "Nối phụ âm sang nguyên âm",
        pair: `${w1.word} ${w2.word}`,
        connected: `${t1.endsWith("e") ? t1.slice(0, -1) : t1}-${soundC}${t2}`,
        desc: `Phụ âm /${soundC}/ nối sang nguyên âm của từ tiếp theo.`,
      });
    }
  }

  return { phenomena, tokens };
}
