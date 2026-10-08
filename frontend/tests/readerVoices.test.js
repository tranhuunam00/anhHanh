import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  ACCENT_OPTIONS,
  PITCH_PRESETS,
  detectVoiceGender,
  filterVoicesByAccent,
  formatVoiceLabel,
} from "../src/utils/readerVoices.js";

describe("readerVoices - detectVoiceGender", () => {
  test("detects female voices from names accurately", () => {
    assert.equal(detectVoiceGender("Microsoft Jenny Online (Natural)"), "Nữ");
    assert.equal(detectVoiceGender("Google UK English Female"), "Nữ");
    assert.equal(detectVoiceGender("Microsoft Zira - English (United States)"), "Nữ");
    assert.equal(detectVoiceGender("Neerja"), "Nữ");
    assert.equal(detectVoiceGender("Samantha"), "Nữ");
  });

  test("detects male voices from names accurately", () => {
    assert.equal(detectVoiceGender("Microsoft Guy Online (Natural)"), "Nam");
    assert.equal(detectVoiceGender("Microsoft David - English (United States)"), "Nam");
    assert.equal(detectVoiceGender("Google UK English Male"), "Nam");
    assert.equal(detectVoiceGender("Ravi"), "Nam");
    assert.equal(detectVoiceGender("Daniel"), "Nam");
  });

  test("returns default when no gender markers match", () => {
    assert.equal(detectVoiceGender("Generic System Voice"), "Tự nhiên");
    assert.equal(detectVoiceGender(""), "Neutral");
    assert.equal(detectVoiceGender(null), "Neutral");
  });
});

describe("readerVoices - filterVoicesByAccent", () => {
  const dummyVoices = [
    { name: "Jenny", lang: "en-US" },
    { name: "Sonia", lang: "en-GB" },
    { name: "Natasha", lang: "en-AU" },
    { name: "Ravi", lang: "en-IN" },
    { name: "Hortense", lang: "fr-FR" },
  ];

  test("filters US voices correctly", () => {
    const usVoices = filterVoicesByAccent(dummyVoices, "en-US");
    assert.equal(usVoices.length, 1);
    assert.equal(usVoices[0].name, "Jenny");
  });

  test("filters UK voices correctly", () => {
    const ukVoices = filterVoicesByAccent(dummyVoices, "en-GB");
    assert.equal(ukVoices.length, 1);
    assert.equal(ukVoices[0].name, "Sonia");
  });

  test("filters Indian English voices correctly", () => {
    const indianVoices = filterVoicesByAccent(dummyVoices, "en-IN");
    assert.equal(indianVoices.length, 1);
    assert.equal(indianVoices[0].name, "Ravi");
  });

  test("provides virtual Indian voice entries when no Indian voice is installed on OS", () => {
    const withoutIndian = [
      { name: "Jenny", lang: "en-US" },
      { name: "Sonia", lang: "en-GB" },
    ];
    const fallbackIndian = filterVoicesByAccent(withoutIndian, "en-IN");
    assert.equal(fallbackIndian.length, 2);
    assert.equal(fallbackIndian[0].isVirtual, true);
    assert.equal(fallbackIndian[0].name.includes("Ấn Độ"), true);
  });

  test("returns sorted list prioritizing English when accent is ALL", () => {
    const all = filterVoicesByAccent(dummyVoices, "ALL");
    assert.equal(all.length, 5);
    // First items should be English
    assert.equal(all[0].lang.startsWith("en"), true);
  });

  test("handles empty or invalid inputs safely without throwing", () => {
    assert.deepEqual(filterVoicesByAccent(null, "en-US"), []);
    assert.deepEqual(filterVoicesByAccent([], "ALL"), []);
    assert.deepEqual(filterVoicesByAccent(undefined), []);
  });
});

describe("readerVoices - formatVoiceLabel", () => {
  test("formats Microsoft Online voice nicely", () => {
    const v = { name: "Microsoft Jenny Online (Natural) - English (United States)", lang: "en-US" };
    const label = formatVoiceLabel(v);
    assert.equal(label.includes("Jenny"), true);
    assert.equal(label.includes("Mỹ"), true);
    assert.equal(label.includes("Nữ"), true);
  });

  test("formats Indian voice label accurately", () => {
    const v = { name: "Microsoft Ravi - English (India)", lang: "en-IN" };
    const label = formatVoiceLabel(v);
    assert.equal(label.includes("Ravi"), true);
    assert.equal(label.includes("Ấn Độ"), true);
    assert.equal(label.includes("Nam"), true);
  });

  test("formats virtual voice label directly", () => {
    const v = { isVirtual: true, name: "Ravi • Ấn Độ (Nam • Indian English)" };
    assert.equal(formatVoiceLabel(v), "Ravi • Ấn Độ (Nam • Indian English)");
  });

  test("handles null or missing voice gracefully", () => {
    assert.equal(formatVoiceLabel(null), "Giọng mặc định");
    assert.equal(formatVoiceLabel({}), "Default Voice (Quốc tế • Tự nhiên)");
  });
});

describe("readerVoices - PITCH_PRESETS & ACCENT_OPTIONS integrity", () => {
  test("all pitch presets have valid finite float pitch values", () => {
    assert.ok(PITCH_PRESETS.length >= 4);
    for (const preset of PITCH_PRESETS) {
      assert.ok(preset.id && typeof preset.id === "string");
      assert.ok(preset.label && typeof preset.label === "string");
      assert.ok(typeof preset.pitch === "number");
      assert.ok(Number.isFinite(preset.pitch));
      assert.ok(preset.pitch >= 0.5 && preset.pitch <= 2.0);
    }
  });

  test("all accent options have non-empty code and label", () => {
    assert.ok(ACCENT_OPTIONS.length >= 4);
    for (const opt of ACCENT_OPTIONS) {
      assert.ok(opt.code && typeof opt.code === "string");
      assert.ok(opt.label && typeof opt.label === "string");
    }
  });
});
