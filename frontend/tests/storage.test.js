import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  getStorageItem,
  setStorageItem,
  loadLessonProgress,
  saveLessonProgress,
} from "../src/utils/storage.js";

// Mock localStorage if not present in Node environment
const mockStorage = new Map();
if (!globalThis.localStorage) {
  globalThis.localStorage = {
    getItem: (k) => mockStorage.get(k) ?? null,
    setItem: (k, v) => mockStorage.set(k, String(v)),
    removeItem: (k) => mockStorage.delete(k),
    clear: () => mockStorage.clear(),
  };
}

describe("storage.js unit tests", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  test("getStorageItem returns fallback when key does not exist", () => {
    const res = getStorageItem("non_existent_key", { default: true });
    assert.deepEqual(res, { default: true });
  });

  test("setStorageItem and getStorageItem roundtrip", () => {
    setStorageItem("user_pref", { theme: "dark", volume: 0.8 });
    const res = getStorageItem("user_pref");
    assert.deepEqual(res, { theme: "dark", volume: 0.8 });
  });

  test("loadLessonProgress falls back to legacy key if lang key not found", () => {
    // Set legacy key
    localStorage.setItem("progress_vid123", JSON.stringify({ completed: 5 }));
    const loaded = loadLessonProgress("vid123", "en", "vi");
    assert.deepEqual(loaded, { completed: 5 });
  });

  test("saveLessonProgress and loadLessonProgress with language support", () => {
    saveLessonProgress("vid456", { completed: 10 }, "ja", "vi");
    const loaded = loadLessonProgress("vid456", "ja", "vi");
    assert.deepEqual(loaded, { completed: 10 });
  });
});
