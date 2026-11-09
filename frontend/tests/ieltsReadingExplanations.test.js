import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeTestId,
  findSentenceWithKeyword,
  extractSalientKeywords,
  findSentenceWithBestKeywords,
  estimateLocation,
  getReadingExplanation,
  extractQuestionNumbersFromGroup
} from "../src/utils/ieltsReadingExplanations.js";
import { cambridge17Test1ReadingPassage1 } from "../src/data/ielts/cambridge17Test1ReadingPassage1.js";
import { cambridge18Test1ReadingPassage1 } from "../src/data/ielts/cambridge18Test1ReadingPassage1.js";
import { cambridge19Test1ReadingPassage1 } from "../src/data/ielts/cambridge19Test1ReadingPassage1.js";
import { readingPassage1 as cambridge20Test1ReadingPassage1 } from "../src/data/ielts/cambridge20Test1ReadingPassage1.js";

test("normalizeTestId handles varied formats and fallbacks", () => {
  assert.equal(normalizeTestId("Cambridge-21-Test-2"), "cambridge-21-test-2");
  assert.equal(normalizeTestId("  cambridge-21-test-1  "), "cambridge-21-test-1");
  assert.equal(normalizeTestId("cambridge-17-test-1"), "cambridge-17-test-1");
  assert.equal(normalizeTestId(""), "cambridge-21-test-2");
  assert.equal(normalizeTestId(null), "cambridge-21-test-2");
  assert.equal(normalizeTestId(undefined), "cambridge-21-test-2");
  assert.equal(normalizeTestId(12345), "cambridge-21-test-2");
});

test("extractSalientKeywords removes stopwords and retains numbers and proper nouns", () => {
  const words = extractSalientKeywords("In 1846, the Royal Commission decided that railways should not enter.");
  assert.ok(words.includes("1846"));
  assert.ok(words.includes("Royal"));
  assert.ok(words.includes("Commission"));
  assert.ok(words.includes("railways"));
  assert.ok(!words.map((w) => w.toLowerCase()).includes("the"));
  assert.ok(!words.map((w) => w.toLowerCase()).includes("in"));
});

test("findSentenceWithBestKeywords matches best passage sentence", () => {
  const passage = "In the first half of the 1800s, London's population grew at an astonishing rate. However, in 1846, a Royal Commission decided that the railways should not be allowed to enter the City. Crossing the City became a nightmare.";
  const keywords = ["1846", "Royal", "Commission", "railways", "enter"];
  const { sentence, score, matchedKeywords } = findSentenceWithBestKeywords(passage, keywords);
  assert.ok(sentence.includes("Royal Commission decided"));
  assert.ok(score >= 8);
  assert.ok(matchedKeywords.includes("1846"));
});

test("estimateLocation detects paragraph labels or indices", () => {
  const passage = "P1 In the first half of the 1800s London grew.\n\nP2 Amongst the most vocal advocates was Pearson.";
  const loc = estimateLocation(passage, "Amongst the most vocal advocates");
  assert.equal(loc, "Đoạn P2");
});

test("findSentenceWithKeyword extracts matching sentence correctly", () => {
  const passage = "Sleep is crucial for health. Sleeping rats were dreaming about going through the maze. Further research is ongoing.";
  
  // Word match
  const match1 = findSentenceWithKeyword(passage, "rats");
  assert.equal(match1, "Sleeping rats were dreaming about going through the maze.");

  // Case insensitive
  const match2 = findSentenceWithKeyword(passage, "SLEEPING");
  assert.equal(match2, "Sleeping rats were dreaming about going through the maze.");

  // Not found
  const match3 = findSentenceWithKeyword(passage, "elephants");
  assert.equal(match3, null);

  // Edge cases
  assert.equal(findSentenceWithKeyword(null, "rats"), null);
  assert.equal(findSentenceWithKeyword(passage, ""), null);
  assert.equal(findSentenceWithKeyword("", "rats"), null);
});

test("getReadingExplanation retrieves curated Cambridge 21 Test 2 explanations", () => {
  // Q1
  const q1 = getReadingExplanation("cambridge-21-test-2", 1);
  assert.equal(q1.qNum, 1);
  assert.equal(q1.answer, "rats");
  assert.ok(q1.evidence.includes("researchers compared the brain patterns of rats"));
  assert.ok(q1.explanation.includes("loài chuột (rats)"));
  assert.ok(Array.isArray(q1.keywords));
  assert.ok(q1.keywords.length > 0);

  // Q6 (TRUE)
  const q6 = getReadingExplanation("cambridge-21-test-2", 6);
  assert.equal(q6.answer, "TRUE");
  assert.ok(q6.evidence.includes("REM sleep and dreaming are important"));

  // Q14 (E)
  const q14 = getReadingExplanation("cambridge-21-test-2", 14);
  assert.equal(q14.answer, "E");
  assert.ok(q14.explanation.includes("precise function is not known"));

  // Q40 (B)
  const q40 = getReadingExplanation("cambridge-21-test-2", 40);
  assert.equal(q40.answer, "B");
});

test("getReadingExplanation retrieves curated Cambridge 21 Test 1 explanations", () => {
  const q1 = getReadingExplanation("cambridge-21-test-1", 1);
  assert.equal(q1.qNum, 1);
  assert.equal(q1.answer, "mining");
  assert.ok(q1.evidence.includes("David Davies"));

  const q8 = getReadingExplanation("cambridge-21-test-1", 8);
  assert.equal(q8.answer, "TRUE");
});

test("getReadingExplanation supports Cambridge 17, 18, 19, 20 dynamically with high precision evidence quotes", () => {
  // Cambridge 17 Test 1 Passage 1: Q1 (population)
  const p17Text = cambridge17Test1ReadingPassage1.paragraphs.map((p) => p.text).join("\n\n");
  const q1_17Item = cambridge17Test1ReadingPassage1.groups[0].items[0];
  const q1_17 = getReadingExplanation("cambridge-17-test-1", 1, p17Text, q1_17Item);
  assert.equal(q1_17.answer, "population");
  assert.ok(q1_17.evidence.includes("population grew at an astonishing rate"));
  assert.ok(q1_17.explanation.includes("population"));

  // Cambridge 18 Test 1 Passage 1: Q1 (lettuces)
  const p18Text = cambridge18Test1ReadingPassage1.paragraphs.map((p) => p.text).join("\n\n");
  const q1_18Item = cambridge18Test1ReadingPassage1.groups[0].items[0];
  const q1_18 = getReadingExplanation("cambridge-18-test-1", 1, p18Text, q1_18Item);
  assert.equal(q1_18.answer, "lettuces");
  assert.ok(q1_18.evidence.includes("lettuces"));

  // Cambridge 19 Test 1 Passage 1: Q1 (tennis)
  const p19Text = cambridge19Test1ReadingPassage1.paragraphs.map((p) => p.text).join("\n\n");
  const q1_19Item = cambridge19Test1ReadingPassage1.groups[0].items[0];
  const q1_19 = getReadingExplanation("cambridge-19-test-1", 1, p19Text, q1_19Item);
  assert.ok(q1_19.answer.length > 0);
  assert.ok(q1_19.evidence.length > 20);

  // Cambridge 20 Test 1 Passage 1: Q1 (TRUE)
  const p20Text = cambridge20Test1ReadingPassage1.paragraphs.map((p) => p.text).join("\n\n");
  const q1_20Item = cambridge20Test1ReadingPassage1.groups[0].items[0];
  const q1_20 = getReadingExplanation("cambridge-20-test-1", 1, p20Text, q1_20Item);
  assert.equal(q1_20.answer, "FALSE");
  assert.ok(q1_20.evidence.length > 20);
  assert.ok(q1_20.explanation.includes("FALSE"));
});

test("getReadingExplanation falls back gracefully for embedded item data or unknown tests", () => {
  // Custom item with embedded explanation
  const customItem = {
    number: 99,
    answer: "photosynthesis",
    evidence: "Plants convert light into chemical energy.",
    explanation: "Đây là quá trình quang hợp.",
    location: "Paragraph 3"
  };
  const resCustom = getReadingExplanation("unknown-test", 99, "", customItem);
  assert.equal(resCustom.answer, "photosynthesis");
  assert.equal(resCustom.evidence, "Plants convert light into chemical energy.");
  assert.equal(resCustom.location, "Paragraph 3");

  // Dynamic sentence extraction fallback
  const passage = "Volcanic eruptions release sulfur dioxide. Magma cools into igneous rock.";
  const fallbackItem = { number: 45, answers: ["magma"] };
  const resFallback = getReadingExplanation("unknown-test", 45, passage, fallbackItem);
  assert.equal(resFallback.answer, "magma");
  assert.equal(resFallback.evidence, "Magma cools into igneous rock.");
});

test("extractQuestionNumbersFromGroup extracts and sorts numbers across various group schemas", () => {
  // Array of numbers
  const g1 = { numbers: [20, 21] };
  assert.deepEqual(extractQuestionNumbersFromGroup(g1), [20, 21]);

  // Items list
  const g2 = {
    items: [{ number: 8 }, { number: 6 }, { number: 7 }]
  };
  assert.deepEqual(extractQuestionNumbersFromGroup(g2), [6, 7, 8]);

  // Complex table rows schema
  const g3 = {
    rows: [
      { subjectQuestion: 1 },
      { questionNumber: 2 },
      { questions: [{ number: 3 }, { number: 4 }, { number: 5 }] }
    ]
  };
  assert.deepEqual(extractQuestionNumbersFromGroup(g3), [1, 2, 3, 4, 5]);

  // Empty or invalid group
  assert.deepEqual(extractQuestionNumbersFromGroup(null), []);
  assert.deepEqual(extractQuestionNumbersFromGroup({}), []);
  assert.deepEqual(extractQuestionNumbersFromGroup("invalid"), []);
});


