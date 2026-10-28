import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CLUSTER_PERCEPTION_ROOTS } from "../src/data/rootWords/clusterPerceptionData.js";
import { CLUSTER_COMMUNICATION_ROOTS } from "../src/data/rootWords/clusterCommunicationData.js";
import { CLUSTER_ACTION_ROOTS } from "../src/data/rootWords/clusterActionData.js";
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
    it("contains exactly 9 distinct communication roots (including phon and graph)", () => {
      assert.equal(CLUSTER_COMMUNICATION_ROOTS.length, 9);
      const expectedRoots = [
        "dict",
        "scrib",
        "voc",
        "clam",
        "lingua",
        "loqu",
        "verb",
        "phon",
        "graph",
      ];
      const actualRoots = CLUSTER_COMMUNICATION_ROOTS.map((r) => r.root);
      assert.deepEqual(actualRoots, expectedRoots);
    });

    it("verifies root 8 (phon) and root 9 (graph) have 8 words each with exercises", () => {
      const phonRoot = CLUSTER_COMMUNICATION_ROOTS.find((r) => r.root === "phon");
      assert.ok(phonRoot, "Root phon must exist in Communication");
      assert.equal(phonRoot.words.length, 8);
      const phonWords = phonRoot.words.map((w) => w.word);
      assert.ok(phonWords.includes("telephone"));
      assert.ok(phonWords.includes("symphony"));
      assert.ok(phonWords.includes("microphone"));
      assert.ok(phonWords.includes("cacophony"));
      assert.ok(phonRoot.exercises.length >= 3);

      const graphRoot = CLUSTER_COMMUNICATION_ROOTS.find((r) => r.root === "graph");
      assert.ok(graphRoot, "Root graph must exist in Communication");
      assert.equal(graphRoot.words.length, 8);
      const graphWords = graphRoot.words.map((w) => w.word);
      assert.ok(graphWords.includes("biography"));
      assert.ok(graphWords.includes("autograph"));
      assert.ok(graphWords.includes("photograph"));
      assert.ok(graphWords.includes("calligraphy"));
      assert.ok(graphRoot.exercises.length >= 3);
    });

    it("ensures total word count in Communication is >= 65 words", () => {
      let totalWords = 0;
      for (const rootObj of CLUSTER_COMMUNICATION_ROOTS) {
        assert.ok(rootObj.words.length >= 7);
        totalWords += rootObj.words.length;
        for (const w of rootObj.words) {
          assert.ok(w.word && typeof w.word === "string");
          assert.ok(w.meaningVi && typeof w.meaningVi === "string");
          assert.ok(w.ipa && typeof w.ipa === "string");
          assert.ok(w.doodleKey && typeof w.doodleKey === "string");
        }
      }
      assert.ok(totalWords >= 65, `Expected total words >= 65, got ${totalWords}`);
    });
  });

  describe("Cụm 3: Hành động & Di chuyển (Action Cluster)", () => {
    it("contains exactly 9 distinct action roots", () => {
      assert.equal(CLUSTER_ACTION_ROOTS.length, 9);
      const expectedRoots = [
        "tract",
        "port",
        "duc",
        "mit",
        "vert",
        "mot",
        "ced",
        "ven",
        "pel",
      ];
      const actualRoots = CLUSTER_ACTION_ROOTS.map((r) => r.root);
      assert.deepEqual(actualRoots, expectedRoots);
    });

    it("ensures each root in Action has 8 words and >= 3 exercises with full schema", () => {
      let totalWords = 0;
      for (const rootObj of CLUSTER_ACTION_ROOTS) {
        assert.equal(rootObj.words.length, 8, `Root ${rootObj.root} must have 8 words`);
        assert.ok(rootObj.exercises.length >= 3, `Root ${rootObj.root} must have >= 3 exercises`);
        totalWords += rootObj.words.length;

        for (const w of rootObj.words) {
          assert.ok(w.word && typeof w.word === "string");
          assert.ok(w.meaningVi && typeof w.meaningVi === "string");
          assert.ok(w.ipa && typeof w.ipa === "string");
          assert.ok(w.breakdownFormula && typeof w.breakdownFormula === "string");
          assert.ok(w.doodleKey && typeof w.doodleKey === "string");
          assert.ok(w.badge && typeof w.badge === "string");
        }

        for (const ex of rootObj.exercises) {
          assert.ok(ex.id && typeof ex.id === "string");
          assert.ok(ex.type && typeof ex.type === "string");
          assert.ok(ex.explanation && typeof ex.explanation === "string");
        }
      }
      assert.equal(totalWords, 72);
    });
  });

  describe("ROOT_WORDS_DATA Category Integrity & Uniqueness", () => {
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

    it("ensures no duplicate roots exist in ROOT_WORDS_DATA", () => {
      const rootNames = ROOT_WORDS_DATA.map((r) => r.root);
      const duplicates = rootNames.filter((r, idx) => rootNames.indexOf(r) !== idx);
      assert.deepEqual(duplicates, [], `Found duplicate roots in ROOT_WORDS_DATA: ${duplicates.join(", ")}`);
    });
  });
});
