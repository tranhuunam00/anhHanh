import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { OCEAN_3D_TOPIC } from "../src/data/visualVocab/ocean3dData.js";
import { OCEAN_TRANSLATIONS } from "../src/data/visualVocab/translations/oceanTranslations.js";
import { getLocalizedItem, getLocalizedTopic } from "../src/data/visualVocab/translations/index.js";

describe("visualVocab3DOcean - Dataset Structure and 3D Coordinates Integrity", () => {
  test("verifies topic metadata and 3D flag", () => {
    assert.equal(OCEAN_3D_TOPIC.id, "ocean_3d");
    assert.equal(OCEAN_3D_TOPIC.is3D, true);
    assert.ok(OCEAN_3D_TOPIC.items.length >= 14);
  });

  test("verifies every item has required fields and valid 3D coordinates", () => {
    for (const item of OCEAN_3D_TOPIC.items) {
      assert.ok(item.id, "Item must have id");
      assert.ok(item.word, "Item must have word");
      assert.ok(item.ipa, "Item must have ipa");
      assert.ok(item.meaning, "Item must have Vietnamese meaning");
      assert.ok(item.example, "Item must have example sentence");
      assert.ok(Array.isArray(item.pos3d), "Item must have pos3d array");
      assert.equal(item.pos3d.length, 3, "pos3d must have [x, y, z]");
      assert.ok(typeof item.pos3d[0] === "number");
      assert.ok(typeof item.pos3d[1] === "number");
      assert.ok(typeof item.pos3d[2] === "number");
    }
  });
});

describe("visualVocab3DOcean - Multilingual Translations", () => {
  test("contains French and Chinese translations for all 15 ocean items", () => {
    for (const item of OCEAN_3D_TOPIC.items) {
      const trans = OCEAN_TRANSLATIONS[item.id];
      assert.ok(trans, `Missing translation entry for ${item.id}`);

      // French
      assert.ok(trans.fr, `Missing French translation for ${item.id}`);
      assert.ok(trans.fr.word, `French word missing for ${item.id}`);
      assert.ok(trans.fr.example, `French example missing for ${item.id}`);

      // Chinese
      assert.ok(trans.zh, `Missing Chinese translation for ${item.id}`);
      assert.ok(trans.zh.word, `Chinese word missing for ${item.id}`);
      assert.ok(trans.zh.pinyin, `Chinese pinyin missing for ${item.id}`);
      assert.ok(trans.zh.example, `Chinese example missing for ${item.id}`);
    }
  });

  test("getLocalizedItem localizes 3D item to French correctly", () => {
    const dolphin = OCEAN_3D_TOPIC.items.find((it) => it.id === "dolphin");
    const localizedFr = getLocalizedItem(dolphin, "fr");
    assert.equal(localizedFr.word, "dauphin");
    assert.equal(localizedFr.lang, "fr");
  });

  test("getLocalizedItem localizes 3D item to Chinese with pinyin correctly", () => {
    const dolphin = OCEAN_3D_TOPIC.items.find((it) => it.id === "dolphin");
    const localizedZh = getLocalizedItem(dolphin, "zh");
    assert.equal(localizedZh.word, "海豚");
    assert.equal(localizedZh.pinyin, "hǎi tún");
    assert.equal(localizedZh.lang, "zh");
  });

  test("getLocalizedTopic returns localized topic structure without mutating base", () => {
    const localizedTopic = getLocalizedTopic(OCEAN_3D_TOPIC, "zh");
    assert.equal(localizedTopic.id, "ocean_3d");
    assert.equal(localizedTopic.is3D, true);
    assert.ok(localizedTopic.items.length >= 14);
    assert.equal(localizedTopic.items[0].lang, "zh");
  });
});
