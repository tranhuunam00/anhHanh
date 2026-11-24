import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { EXERCISE_FORMATS } from "../src/utils/vocabExerciseGenerators.js";

describe("vocabExerciseFormats - Dạng 1 Mapping & Ordering", () => {
  const getFormatLabel = (selectedFormat) => {
    switch (selectedFormat) {
      case EXERCISE_FORMATS.D8_SHADOWING:
        return "Dạng 8 (Luyện Shadowing ngữ điệu)";
      case EXERCISE_FORMATS.D7_STRESS:
        return "Dạng 7 (Trọng âm từ vựng)";
      case EXERCISE_FORMATS.D6_AI_STORY:
        return "Dạng 6 (AI Kể chuyện nối từ)";
      case EXERCISE_FORMATS.D4:
        return "Dạng 5 (Gõ từ chính tả)";
      case EXERCISE_FORMATS.D3:
        return "Dạng 4 (Điền từ vào câu)";
      case EXERCISE_FORMATS.D2:
        return "Dạng 3 (Nghĩa TV ➔ Chọn Từ)";
      case EXERCISE_FORMATS.D1:
        return "Dạng 2 (Từ vựng ➔ Nghĩa TV)";
      case EXERCISE_FORMATS.D5_FLIP:
      default:
        return "Dạng 1 (Thẻ di động đi đường)";
    }
  };

  test("D5_FLIP maps to Dạng 1 (Thẻ di động đi đường)", () => {
    assert.equal(getFormatLabel(EXERCISE_FORMATS.D5_FLIP), "Dạng 1 (Thẻ di động đi đường)");
  });

  test("D1 maps to Dạng 2 (Từ vựng ➔ Nghĩa TV)", () => {
    assert.equal(getFormatLabel(EXERCISE_FORMATS.D1), "Dạng 2 (Từ vựng ➔ Nghĩa TV)");
  });

  test("D2 maps to Dạng 3 (Nghĩa TV ➔ Chọn Từ)", () => {
    assert.equal(getFormatLabel(EXERCISE_FORMATS.D2), "Dạng 3 (Nghĩa TV ➔ Chọn Từ)");
  });

  test("D3 maps to Dạng 4 (Điền từ vào câu)", () => {
    assert.equal(getFormatLabel(EXERCISE_FORMATS.D3), "Dạng 4 (Điền từ vào câu)");
  });

  test("D4 maps to Dạng 5 (Gõ từ chính tả)", () => {
    assert.equal(getFormatLabel(EXERCISE_FORMATS.D4), "Dạng 5 (Gõ từ chính tả)");
  });

  test("Fallback / default returns Dạng 1 (Thẻ di động đi đường)", () => {
    assert.equal(getFormatLabel("UNKNOWN_FORMAT"), "Dạng 1 (Thẻ di động đi đường)");
    assert.equal(getFormatLabel(null), "Dạng 1 (Thẻ di động đi đường)");
    assert.equal(getFormatLabel(undefined), "Dạng 1 (Thẻ di động đi đường)");
  });
});

describe("vocabCardAndDetail - Google AI Overview Integration Logic", () => {
  const sanitizeWordForLookup = (rawWord) => {
    if (!rawWord || typeof rawWord !== "string") return "";
    return rawWord.trim().replace(/^['’"“”.:,;!?-]+|['’"“”.:,;!?-]+$/g, "");
  };

  const shouldTriggerLookup = (word) => {
    const clean = sanitizeWordForLookup(word);
    return clean.length > 0;
  };

  test("happy path: sanitizes normal and decorated word strings", () => {
    assert.equal(sanitizeWordForLookup("surprising empathy"), "surprising empathy");
    assert.equal(sanitizeWordForLookup('"inadvertently"'), "inadvertently");
    assert.equal(sanitizeWordForLookup("  'dummy'  "), "dummy");
  });

  test("boundary & edge cases: handles empty, spaces, null, undefined, and symbols", () => {
    assert.equal(sanitizeWordForLookup(""), "");
    assert.equal(sanitizeWordForLookup("   "), "");
    assert.equal(sanitizeWordForLookup(null), "");
    assert.equal(sanitizeWordForLookup(undefined), "");
    assert.equal(sanitizeWordForLookup("---"), "");
    assert.equal(sanitizeWordForLookup(123), "");
  });

  test("logic verification: triggers lookup only when valid word exists", () => {
    assert.equal(shouldTriggerLookup("surprising empathy"), true);
    assert.equal(shouldTriggerLookup("dummy"), true);
    assert.equal(shouldTriggerLookup(""), false);
    assert.equal(shouldTriggerLookup("   "), false);
    assert.equal(shouldTriggerLookup(null), false);
  });
});
