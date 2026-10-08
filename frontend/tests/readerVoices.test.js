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
    assert.equal(detectVoiceGender("Samantha"), "Nữ");
  });

  test("detects male voices from names accurately", () => {
    assert.equal(detectVoiceGender("Microsoft Guy Online (Natural)"), "Nam");
    assert.equal(detectVoiceGender("Microsoft David - English (United States)"), "Nam");
    assert.equal(detectVoiceGender("Google UK English Male"), "Nam");
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
    { name: "Neerja", lang: "en-IN" },
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

  test("formats Google voice nicely", () => {
    const v = { name: "Google UK English Male", lang: "en-GB" };
    const label = formatVoiceLabel(v);
    assert.equal(label.includes("Anh"), true);
    assert.equal(label.includes("Nam"), true);
  });

  test("handles null or missing voice gracefully", () => {
    assert.equal(formatVoiceLabel(null), "Giọng mặc định");
    assert.equal(formatVoiceLabel({}), "Default Voice (Quốc tế • Tự nhiên)");
  });
});
