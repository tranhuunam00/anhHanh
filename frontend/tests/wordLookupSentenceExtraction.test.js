import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  cleanTargetSentence,
  resolveInitialContextSentence
} from "../src/utils/wordLookupUtils.js";

describe("WordLookup Sentence Extraction & Context Isolation Tests", () => {
  const kakapoParagraph = "The kākāpō, also known as the owl parrot, is a large, forest-dwelling bird, with a pale owl-like face. Up to 64 cm in length, it has predominantly yellow-green feathers, forward-facing eyes, a large grey beak, large blue feet, and relatively short wings and tail. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years. Kākāpō are solitary birds and tend to occupy the same home range for many years. They forage on the ground and climb high into trees.";

  test("isolates single exact sentence for target word 'solitary' from full paragraph", () => {
    const result = cleanTargetSentence(kakapoParagraph, "solitary");
    assert.equal(
      result,
      "Kākāpō are solitary birds and tend to occupy the same home range for many years."
    );
  });

  test("isolates single exact sentence for 'flightless' from full paragraph", () => {
    const result = cleanTargetSentence(kakapoParagraph, "flightless");
    assert.equal(
      result,
      "It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years."
    );
  });

  test("resolveInitialContextSentence delegates to cleanTargetSentence when cleanWord is provided", () => {
    const resolved = resolveInitialContextSentence(kakapoParagraph, null, "solitary");
    assert.equal(
      resolved,
      "Kākāpō are solitary birds and tend to occupy the same home range for many years."
    );
  });

  test("resolveInitialContextSentence extracts from savedItem if contextSentence prop is empty", () => {
    const saved = { context_sentence: kakapoParagraph };
    const resolved = resolveInitialContextSentence("", saved, "forage");
    assert.equal(
      resolved,
      "They forage on the ground and climb high into trees."
    );
  });

  test("handles empty or boundary inputs gracefully", () => {
    assert.equal(cleanTargetSentence("", "solitary"), "");
    assert.equal(cleanTargetSentence(null, "solitary"), "");
    assert.equal(resolveInitialContextSentence("", null, ""), "");
  });
});
