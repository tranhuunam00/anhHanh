import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  isPhoneticString,
  isPartOfSpeechString,
  splitLineIntoColumns,
  isHeaderRow,
  mapColumnsToVocabFields,
  parseBatchVocabText
} from "../src/utils/vocabBatchParser.js";

describe("vocabBatchParser - isPhoneticString", () => {
  test("happy path: detects IPA wrapped in slashes or brackets", () => {
    assert.equal(isPhoneticString("/biː noʊ ˈdɪfrənt frəm/"), true);
    assert.equal(isPhoneticString("[dæm ə ˈrɪvər]"), true);
  });

  test("happy path: detects IPA containing special phonetic symbols", () => {
    assert.equal(isPhoneticString("ˈkɑːnsəkwənsɪz"), true);
    assert.equal(isPhoneticString("laɪt pəˈluːʃən"), true);
  });

  test("boundary & bad cases: rejects regular words and empty input", () => {
    assert.equal(isPhoneticString(""), false);
    assert.equal(isPhoneticString(null), false);
    assert.equal(isPhoneticString("Noun phrase"), false);
    assert.equal(isPhoneticString("hello world"), false);
  });
});

describe("vocabBatchParser - isPartOfSpeechString", () => {
  test("happy path: detects standard and phrase parts of speech", () => {
    assert.equal(isPartOfSpeechString("Noun phrase"), true);
    assert.equal(isPartOfSpeechString("Verb phrase"), true);
    assert.equal(isPartOfSpeechString("Adjective phrase"), true);
    assert.equal(isPartOfSpeechString("Phrasal verb"), true);
    assert.equal(isPartOfSpeechString("noun"), true);
    assert.equal(isPartOfSpeechString("adj"), true);
  });

  test("boundary & bad cases: rejects regular text and empty input", () => {
    assert.equal(isPartOfSpeechString(""), false);
    assert.equal(isPartOfSpeechString(null), false);
    assert.equal(isPartOfSpeechString("Không khác gì so với"), false);
    assert.equal(isPartOfSpeechString("This is an example"), false);
  });
});

describe("vocabBatchParser - splitLineIntoColumns", () => {
  test("happy path: splits tab-separated values", () => {
    const line = "light pollution\t/laɪt pəˈluːʃən/\tNoun phrase\tÔ nhiễm ánh sáng\tLight pollution affects wildlife.";
    const cols = splitLineIntoColumns(line);
    assert.equal(cols.length, 5);
    assert.equal(cols[0], "light pollution");
    assert.equal(cols[1], "/laɪt pəˈluːʃən/");
    assert.equal(cols[2], "Noun phrase");
    assert.equal(cols[3], "Ô nhiễm ánh sáng");
    assert.equal(cols[4], "Light pollution affects wildlife.");
  });

  test("happy path: splits markdown pipe-separated values", () => {
    const line = "| artificial light | /ˌɑːrtɪˈfɪʃəl laɪt/ | Noun phrase | Ánh sáng nhân tạo | Example |";
    const cols = splitLineIntoColumns(line);
    assert.equal(cols.length, 5);
    assert.equal(cols[0], "artificial light");
    assert.equal(cols[3], "Ánh sáng nhân tạo");
  });

  test("happy path: splits multi-space separated values", () => {
    const line = "spill into    /spɪl ˈɪntuː/    Phrasal verb    Tràn/lan vào    Human light spills into";
    const cols = splitLineIntoColumns(line);
    assert.equal(cols.length, 5);
    assert.equal(cols[0], "spill into");
    assert.equal(cols[3], "Tràn/lan vào");
  });

  test("boundary cases: handles empty, whitespace, and single column lines", () => {
    assert.deepEqual(splitLineIntoColumns(""), []);
    assert.deepEqual(splitLineIntoColumns("   "), []);
    assert.deepEqual(splitLineIntoColumns(null), []);
    assert.deepEqual(splitLineIntoColumns("singleword"), ["singleword"]);
  });
});

describe("vocabBatchParser - isHeaderRow", () => {
  test("happy path: detects table header rows", () => {
    assert.equal(isHeaderRow(["Word", "IPA", "POS", "Meaning", "Example"]), true);
    assert.equal(isHeaderRow(["Từ vựng", "Phiên âm", "Nghĩa"]), true);
    assert.equal(isHeaderRow(["vocabulary", "definition"]), true);
  });

  test("boundary cases: returns false for data rows and empty arrays", () => {
    assert.equal(isHeaderRow(["dam a river", "/dæm ə ˈrɪvər/"]), false);
    assert.equal(isHeaderRow([]), false);
    assert.equal(isHeaderRow(null), false);
  });
});

describe("vocabBatchParser - mapColumnsToVocabFields", () => {
  test("5 columns: maps all 5 fields accurately", () => {
    const cols = [
      "be no different from",
      "/biː noʊ ˈdɪfrənt frəm/",
      "Adjective phrase",
      "Không khác gì so với",
      "This kind of engineering is no different from damming a river."
    ];
    const fields = mapColumnsToVocabFields(cols);
    assert.equal(fields.word, "be no different from");
    assert.equal(fields.phonetic, "/biː noʊ ˈdɪfrənt frəm/");
    assert.equal(fields.part_of_speech, "Adjective phrase");
    assert.equal(fields.meaning, "Không khác gì so với");
    assert.equal(fields.context_sentence, "This kind of engineering is no different from damming a river.");
  });

  test("2 columns: maps word and meaning", () => {
    const fields = mapColumnsToVocabFields(["light pollution", "Ô nhiễm ánh sáng"]);
    assert.equal(fields.word, "light pollution");
    assert.equal(fields.meaning, "Ô nhiễm ánh sáng");
    assert.equal(fields.phonetic, "");
  });

  test("boundary case: handles null and empty array", () => {
    const fields = mapColumnsToVocabFields([]);
    assert.equal(fields.word, "");
    assert.equal(fields.meaning, "");
  });
});

describe("vocabBatchParser - parseBatchVocabText", () => {
  const sampleText = `be no different from\t/biː noʊ ˈdɪfrənt frəm/\tAdjective phrase\tKhông khác gì so với\tThis kind of engineering is no different from damming a river.
dam a river\t/dæm ə ˈrɪvər/\tVerb phrase\tNgăn dòng sông bằng đập\tDamming a river can have serious environmental consequences.
come with consequences\t/kʌm wɪð ˈkɑːnsəkwənsɪz/\tVerb phrase\tĐi kèm với những hệ quả\tThese benefits come with consequences.
light pollution\t/laɪt pəˈluːʃən/\tNoun phrase\tÔ nhiễm ánh sáng\tLight pollution affects wildlife.`;

  test("happy path: parses user sample TSV text with 4 valid rows", () => {
    const { items, summary } = parseBatchVocabText(sampleText);
    assert.equal(summary.total, 4);
    assert.equal(summary.validCount, 4);
    assert.equal(summary.newCount, 4);
    assert.equal(summary.duplicateCount, 0);

    assert.equal(items[0].word, "be no different from");
    assert.equal(items[0].phonetic, "/biː noʊ ˈdɪfrənt frəm/");
    assert.equal(items[0].part_of_speech, "Adjective phrase");
    assert.equal(items[0].meaning, "Không khác gì so với");
    assert.equal(items[0].context_sentence, "This kind of engineering is no different from damming a river.");
    assert.equal(items[0].isDuplicate, false);
    assert.equal(items[0].selected, true);
  });

  test("duplicate detection: flags words that exist in user notebook map", () => {
    const existingMap = {
      "light pollution": { id: 99, word: "light pollution", meaning: "Ô nhiễm ánh sáng cũ" }
    };
    const { items, summary } = parseBatchVocabText(sampleText, existingMap);
    assert.equal(summary.total, 4);
    assert.equal(summary.duplicateCount, 1);
    assert.equal(summary.newCount, 3);

    const dupItem = items.find((it) => it.word === "light pollution");
    assert.equal(dupItem.isDuplicate, true);
    assert.equal(dupItem.existingItem?.id, 99);
    assert.equal(dupItem.selected, false); // By default duplicates are unselected
  });

  test("internal duplicate detection: flags repeated words in same batch", () => {
    const textWithDups = `apple\t/ˈæp.əl/\tNoun\tQuả táo\tEat an apple.
banana\t/bəˈnæn.ə/\tNoun\tQuả chuối\tEat a banana.
apple\t/ˈæp.əl/\tNoun\tQuả táo khác\tAnother apple.`;

    const { items, summary } = parseBatchVocabText(textWithDups);
    assert.equal(summary.total, 3);
    assert.equal(summary.duplicateCount, 1);
    assert.equal(items[2].isInternalDuplicate, true);
    assert.equal(items[2].isDuplicate, true);
  });

  test("boundary & error handling: handles empty, null, comment lines and header", () => {
    const emptyRes = parseBatchVocabText("");
    assert.equal(emptyRes.summary.total, 0);

    const nullRes = parseBatchVocabText(null);
    assert.equal(nullRes.summary.total, 0);

    const textWithHeaderAndComments = `Word\tIPA\tPOS\tMeaning\tExample
# This is a comment line
// Another comment
light pollution\t/laɪt pəˈluːʃən/\tNoun phrase\tÔ nhiễm ánh sáng\tLight pollution affects wildlife.`;

    const res = parseBatchVocabText(textWithHeaderAndComments);
    assert.equal(res.summary.total, 1);
    assert.equal(res.items[0].word, "light pollution");
  });
});

