import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CLUSTER_PERCEPTION_ROOTS } from "../src/data/rootWords/clusterPerceptionData.js";
import { CLUSTER_COMMUNICATION_ROOTS } from "../src/data/rootWords/clusterCommunicationData.js";
import { ROOT_WORDS_DATA } from "../src/data/rootWords/index.js";

describe("Root Words Clusters & Data Integrity Unit Tests", () => {
  describe("Cụm 1: Nhìn & Cảm nhận (Perception Cluster)", () => {
    it("contains exactly 7 distinct sensory roots", () => {
      assert.equal(CLUSTER_PERCEPTION_ROOTS.length, 7);
      const expectedRoots = ["spect", "vid", "aud", "sens", "tang", "scop", "luc"];
      const actualRoots = CLUSTER_PERCEPTION_ROOTS.map((r) => r.root);
      assert.deepEqual(actualRoots, expectedRoots);
    });

    it("ensures each root in Perception has >= 7 words with full schema", () => {
      for (const rootObj of CLUSTER_PERCEPTION_ROOTS) {
        assert.ok(
          rootObj.words.length >= 7,
          `Root ${rootObj.root} must have >= 7 words, found ${rootObj.words.length}`
        );
        for (const w of rootObj.words) {
          assert.ok(w.word && typeof w.word === "string", `Word missing in ${rootObj.root}`);
          assert.ok(w.meaningVi && typeof w.meaningVi === "string", `meaningVi missing in ${w.word}`);
          assert.ok(w.breakdownFormula && typeof w.breakdownFormula === "string", `breakdownFormula missing in ${w.word}`);
          assert.ok(w.doodleKey && typeof w.doodleKey === "string", `doodleKey missing in ${w.word}`);
          assert.ok(w.badge && typeof w.badge === "string", `badge missing in ${w.word}`);
        }
      }
    });
  });

  describe("Cụm 2: Nói & Viết (Communication Cluster)", () => {
    it("contains exactly 7 distinct communication roots", () => {
      assert.equal(CLUSTER_COMMUNICATION_ROOTS.length, 7);
      const expectedRoots = ["dict", "scrib", "voc", "clam", "lingua", "loqu", "verb"];
      const actualRoots = CLUSTER_COMMUNICATION_ROOTS.map((r) => r.root);
      assert.deepEqual(actualRoots, expectedRoots);
    });

    it("ensures total word count in Communication is >= 50 words (each root >= 7 words)", () => {
      let totalWords = 0;
      for (const rootObj of CLUSTER_COMMUNICATION_ROOTS) {
        assert.ok(
          rootObj.words.length >= 7,
          `Root ${rootObj.root} must have >= 7 words, found ${rootObj.words.length}`
        );
        totalWords += rootObj.words.length;
        for (const w of rootObj.words) {
          assert.ok(w.word && typeof w.word === "string");
          assert.ok(w.meaningVi && typeof w.meaningVi === "string");
          assert.ok(w.ipa && typeof w.ipa === "string");
          assert.ok(w.doodleKey && typeof w.doodleKey === "string");
        }
      }
      assert.ok(totalWords >= 50, `Expected total words >= 50, got ${totalWords}`);
    });
  });

  describe("Gốc tract (Hành động & Di chuyển) Expansion", () => {
    it("has 8 words for tract root in ROOT_WORDS_DATA (no longer only 2)", () => {
      const tractRoot = ROOT_WORDS_DATA.find((r) => r.root === "tract");
      assert.ok(tractRoot, "Root tract must exist");
      assert.equal(tractRoot.words.length, 8);
      const wordNames = tractRoot.words.map((w) => w.word);
      assert.ok(wordNames.includes("attract"));
      assert.ok(wordNames.includes("extract"));
      assert.ok(wordNames.includes("distract"));
      assert.ok(wordNames.includes("contract"));
      assert.ok(wordNames.includes("retract"));
      assert.ok(wordNames.includes("abstract"));
      assert.ok(wordNames.includes("subtract"));
      assert.ok(wordNames.includes("protract"));
    });

    it("verifies extract word properties and doodleKey in tract root", () => {
      const tractRoot = ROOT_WORDS_DATA.find((r) => r.root === "tract");
      const extractWord = tractRoot.words.find((w) => w.word === "extract");
      assert.ok(extractWord);
      assert.equal(extractWord.doodleKey, "extract");
      assert.equal(extractWord.prefix, "ex-");
      assert.equal(extractWord.root, "tract");
      assert.ok(extractWord.meaningVi.includes("chiết xuất") || extractWord.meaningVi.includes("rút ra"));
    });
  });

  describe("ROOT_WORDS_DATA Category Integrity", () => {
    it("ensures all roots have valid category property matching ROOT_CATEGORIES", () => {
      const validCategories = [
        "perception",
        "communication",
        "action",
        "creation",
        "mind",
        "nature_space",
        "society_law",
      ];
      for (const r of ROOT_WORDS_DATA) {
        assert.ok(
          validCategories.includes(r.category),
          `Root ${r.root} has invalid category: ${r.category}`
        );
      }
    });
  });
});
