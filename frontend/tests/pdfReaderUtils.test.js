import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  validatePageNumber,
  cleanPdfText,
  formatPdfPageToHtml,
  formatFileSize,
} from "../src/utils/pdfReaderUtils.js";

describe("pdfReaderUtils Unit Tests", () => {
  describe("validatePageNumber", () => {
    test("handles valid numbers within bounds (happy path)", () => {
      assert.equal(validatePageNumber(1, 10), 1);
      assert.equal(validatePageNumber(5, 10), 5);
      assert.equal(validatePageNumber(10, 10), 10);
    });

    test("handles string inputs correctly", () => {
      assert.equal(validatePageNumber("3", 10), 3);
      assert.equal(validatePageNumber(" 7 ", 10), 7);
      assert.equal(validatePageNumber("4.8", 10), 4);
    });

    test("clamps out of bounds numbers to min and max boundaries", () => {
      assert.equal(validatePageNumber(0, 10), 1);
      assert.equal(validatePageNumber(-5, 10), 1);
      assert.equal(validatePageNumber(15, 10), 10);
      assert.equal(validatePageNumber(999, 50), 50);
    });

    test("handles invalid, NaN, empty, null, and strange inputs with fallback to 1", () => {
      assert.equal(validatePageNumber(null, 10), 1);
      assert.equal(validatePageNumber(undefined, 10), 1);
      assert.equal(validatePageNumber("", 10), 1);
      assert.equal(validatePageNumber("abc", 10), 1);
      assert.equal(validatePageNumber({}, 10), 1);
      assert.equal(validatePageNumber(1, 0), 1);
      assert.equal(validatePageNumber(1, -5), 1);
    });
  });

  describe("cleanPdfText", () => {
    test("reconnects hyphenated line breaks cleanly (happy path)", () => {
      const input = "This is an infor-\nmation technology age.";
      const expected = "This is an information technology age.";
      assert.equal(cleanPdfText(input), expected);
    });

    test("handles carriage return newlines properly", () => {
      const input = "First line.\r\nSecond line.";
      const expected = "First line.\nSecond line.";
      assert.equal(cleanPdfText(input), expected);
    });

    test("collapses multiple consecutive horizontal spaces into one", () => {
      const input = "Word1     Word2 \t \t Word3";
      const expected = "Word1 Word2 Word3";
      assert.equal(cleanPdfText(input), expected);
    });

    test("handles empty, null, whitespace, and non-string safely", () => {
      assert.equal(cleanPdfText(""), "");
      assert.equal(cleanPdfText("   \n\t   "), "");
      assert.equal(cleanPdfText(null), "");
      assert.equal(cleanPdfText(undefined), "");
      assert.equal(cleanPdfText(12345), "");
    });
  });

  describe("formatPdfPageToHtml", () => {
    test("converts multi-paragraph text into HTML <p> tags (happy path)", () => {
      const input = "Paragraph one is here.\n\nParagraph two follows.";
      const html = formatPdfPageToHtml(input, 1, 5);
      assert.ok(html.includes("<p>Paragraph one is here.</p>"));
      assert.ok(html.includes("<p>Paragraph two follows.</p>"));
    });

    test("merges single line breaks inside a paragraph into a single continuous sentence", () => {
      const input = "This is a single\nsentence split across lines.";
      const html = formatPdfPageToHtml(input, 1, 5);
      assert.equal(html, "<p>This is a single sentence split across lines.</p>");
    });

    test("returns user-friendly notice when page has no text or only scanned images", () => {
      const html = formatPdfPageToHtml("", 3, 10);
      assert.ok(html.includes("Trang 3 / 10 không có văn bản"));
    });

    test("handles null and undefined safely without throwing", () => {
      const htmlNull = formatPdfPageToHtml(null);
      assert.ok(htmlNull.includes("không có văn bản"));
    });
  });

  describe("formatFileSize", () => {
    test("formats bytes, KB, and MB appropriately", () => {
      assert.equal(formatFileSize(500), "500 B");
      assert.equal(formatFileSize(2048), "2.0 KB");
      assert.equal(formatFileSize(1572864), "1.5 MB");
    });

    test("handles 0, negative, null, and NaN safely", () => {
      assert.equal(formatFileSize(0), "0 KB");
      assert.equal(formatFileSize(-100), "0 KB");
      assert.equal(formatFileSize(null), "0 KB");
      assert.equal(formatFileSize(undefined), "0 KB");
      assert.equal(formatFileSize("invalid"), "0 KB");
    });
  });
});
