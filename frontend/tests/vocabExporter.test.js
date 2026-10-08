import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  escapeCsvCell,
  escapeHtml,
  buildVocabCSVContent,
  buildVocabAnkiContent,
} from "../src/utils/vocabExporter.js";

describe("vocabExporter - escapeCsvCell", () => {
  test("handles null and undefined safely", () => {
    assert.equal(escapeCsvCell(null), '""');
    assert.equal(escapeCsvCell(undefined), '""');
  });

  test("handles standard string and numbers", () => {
    assert.equal(escapeCsvCell("hello"), '"hello"');
    assert.equal(escapeCsvCell(123), '"123"');
  });

  test("escapes internal double quotes by doubling them", () => {
    assert.equal(escapeCsvCell('He said "Hi"'), '"He said ""Hi"""');
  });
});

describe("vocabExporter - escapeHtml", () => {
  test("handles null and empty input safely", () => {
    assert.equal(escapeHtml(null), "");
    assert.equal(escapeHtml(""), "");
    assert.equal(escapeHtml(undefined), "");
  });

  test("escapes special HTML characters properly", () => {
    const raw = `<b>"Tom & Jerry" '123'</b>`;
    const escaped = escapeHtml(raw);
    assert.equal(escaped, "&lt;b&gt;&quot;Tom &amp; Jerry&quot; &#039;123&#039;&lt;/b&gt;");
  });
});

describe("vocabExporter - buildVocabCSVContent", () => {
  test("returns empty string on null or empty array", () => {
    assert.equal(buildVocabCSVContent(null), "");
    assert.equal(buildVocabCSVContent([]), "");
  });

  test("builds CSV with UTF-8 BOM and correct headers", () => {
    const items = [
      {
        word: "resilience",
        phonetic: "/rɪˈzɪl.jəns/",
        meaning: "khả năng phục hồi",
        status: "LEARNING",
        context_sentence: "He showed great resilience.\nAnh ấy thể hiện sự kiên cường.",
        created_at: "2026-03-15T00:00:00.000Z",
      },
    ];

    const csv = buildVocabCSVContent(items);
    assert.ok(csv.startsWith("\uFEFF"), "Must start with UTF-8 BOM");
    assert.ok(csv.includes('"Từ vựng"'));
    assert.ok(csv.includes('"resilience"'));
    assert.ok(csv.includes('"khả năng phục hồi"'));
    assert.ok(csv.includes('"Đang học"'));
  });

  test("handles missing optional fields safely without breaking", () => {
    const items = [{ word: "apple" }];
    const csv = buildVocabCSVContent(items);
    assert.ok(csv.includes('"apple"'));
    assert.ok(csv.includes('"Mới lưu"'));
  });
});

describe("vocabExporter - buildVocabAnkiContent", () => {
  test("returns empty string on empty array", () => {
    assert.equal(buildVocabAnkiContent([]), "");
  });

  test("builds TSV format with front, back, and tag", () => {
    const items = [
      {
        word: "flourish",
        phonetic: "ˈflʌr.ɪʃ",
        meaning: "phát triển thịnh vượng",
        context_sentence: "Plants flourish in rich soil.",
        image_url: "https://example.com/img.jpg",
      },
    ];

    const anki = buildVocabAnkiContent(items);
    assert.ok(anki.includes("\tShotLang"));
    assert.ok(anki.includes("flourish"));
    assert.ok(anki.includes("/ˈflʌr.ɪʃ/"));
    assert.ok(anki.includes("phát triển thịnh vượng"));
    assert.ok(anki.includes("https://example.com/img.jpg"));
  });
});
