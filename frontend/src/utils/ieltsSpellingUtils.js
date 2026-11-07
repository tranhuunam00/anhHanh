/**
 * IELTS Spelling & Equivalence Utilities
 * Handles UK/US spelling variants, hyphenation flexibility,
 * number-word mappings, and formatting differences accepted in official IELTS tests.
 */

// Common British <-> American spelling pairs accepted in official IELTS exams
export const UK_US_SPELLING_MAP = {
  // -our vs -or
  colour: "color",
  color: "colour",
  flavour: "flavor",
  flavor: "flavour",
  humour: "humor",
  humor: "humour",
  labour: "labor",
  labor: "labour",
  neighbour: "neighbor",
  neighbor: "neighbour",
  favourite: "favorite",
  favorite: "favourite",
  harbour: "harbor",
  harbor: "harbour",
  behaviour: "behavior",
  behavior: "behaviour",
  honour: "honor",
  honor: "honour",

  // -re vs -er
  theatre: "theater",
  theater: "theatre",
  centre: "center",
  center: "centre",
  metre: "meter",
  meter: "metre",
  litre: "liter",
  liter: "litre",
  fibre: "fiber",
  fiber: "fibre",

  // -ise vs -ize / -isation vs -ization
  organise: "organize",
  organize: "organise",
  organisation: "organization",
  organization: "organisation",
  realise: "realize",
  realize: "realise",
  recognise: "recognize",
  recognize: "recognise",
  analyse: "analyze",
  analyze: "analyse",
  specialise: "specialize",
  specialize: "specialise",
  authorise: "authorize",
  authorize: "authorise",

  // -ogue vs -og
  catalogue: "catalog",
  catalog: "catalogue",
  dialogue: "dialog",
  dialog: "dialogue",

  // -ll- vs -l-
  travelling: "traveling",
  traveling: "travelling",
  traveller: "traveler",
  traveler: "traveller",
  cancelled: "canceled",
  canceled: "cancelled",

  // miscellaneous vocabulary
  programme: "program",
  program: "programme",
  judgement: "judgment",
  judgment: "judgement",
  aeroplane: "airplane",
  airplane: "aeroplane",
  grey: "gray",
  gray: "grey",
  defence: "defense",
  defense: "defence",
  licence: "license",
  license: "licence",
  practise: "practice",
  practice: "practise",
  cheque: "check",
  check: "cheque",
  pyjamas: "pajamas",
  pajamas: "pyjamas",
  plough: "plow",
  plow: "plough"
};

// Word-to-number mappings for common IELTS numeric answers
export const WORD_TO_NUMBER_MAP = {
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  eleven: "11",
  twelve: "12",
  thirteen: "13",
  fourteen: "14",
  fifteen: "15",
  sixteen: "16",
  seventeen: "17",
  eighteen: "18",
  nineteen: "19",
  twenty: "20",
  thirty: "30",
  forty: "40",
  fifty: "50",
  sixty: "60",
  seventy: "70",
  eighty: "80",
  ninety: "90",
  hundred: "100",
  thousand: "1000",
  million: "1000000",
  first: "1st",
  second: "2nd",
  third: "3rd",
  fourth: "4th",
  fifth: "5th"
};

/**
 * Normalizes text by removing commas in numbers (e.g. "1,000" -> "1000")
 * and stripping outer punctuation.
 *
 * @param {string} text
 * @returns {string}
 */
export const cleanTextSymbols = (text) => {
  if (!text) return "";
  let s = String(text).trim().toLowerCase();
  // Strip commas between digits (e.g. "1,000" -> "1000")
  s = s.replace(/(\d),(\d)/g, "$1$2");
  return s;
};

/**
 * Generates spelling and hyphenation variations for a phrase
 * E.g., "ice-cream" -> ["ice-cream", "ice cream", "icecream"]
 *
 * @param {string} text
 * @returns {string[]}
 */
export const getHyphenVariations = (text) => {
  if (!text) return [""];
  const clean = text.trim();
  const variations = new Set([clean]);

  if (clean.includes("-")) {
    // Replace hyphens with spaces
    variations.add(clean.replace(/-/g, " ").replace(/\s+/g, " ").trim());
    // Remove hyphens completely
    variations.add(clean.replace(/-/g, "").trim());
  } else if (clean.includes(" ")) {
    // Also consider hyphenated form if original had spaces
    variations.add(clean.replace(/\s+/g, "-").trim());
  }

  return [...variations];
};

/**
 * Generates UK/US spelling variants for a phrase
 *
 * @param {string} text
 * @returns {string[]}
 */
export const getSpellingVariations = (text) => {
  if (!text) return [""];
  const tokens = text.toLowerCase().trim().split(/\s+/);
  const variants = [tokens];

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    const alt = UK_US_SPELLING_MAP[word];
    if (alt) {
      const len = variants.length;
      for (let j = 0; j < len; j++) {
        const branch = [...variants[j]];
        branch[i] = alt;
        variants.push(branch);
      }
    }
  }

  return [...new Set(variants.map((v) => v.join(" ")))];
};

/**
 * Normalizes numbers and number words (e.g., "ten" <-> "10")
 *
 * @param {string} text
 * @returns {string[]}
 */
export const getNumberVariations = (text) => {
  if (!text) return [""];
  const trimmed = text.trim().toLowerCase();
  const res = new Set([trimmed]);

  // Single word number to digit
  if (WORD_TO_NUMBER_MAP[trimmed]) {
    res.add(WORD_TO_NUMBER_MAP[trimmed]);
  }

  // Reverse mapping: digit to word
  for (const [w, num] of Object.entries(WORD_TO_NUMBER_MAP)) {
    if (trimmed === num) {
      res.add(w);
    }
  }

  return [...res];
};

