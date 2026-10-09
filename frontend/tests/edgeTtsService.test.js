import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  buildEdgeTtsUrl,
  isEdgeVoice,
  stopEdgeAudio,
  playEdgeTtsAudio,
} from "../src/services/edgeTtsService.js";

describe("edgeTtsService - buildEdgeTtsUrl", () => {
  test("constructs valid streaming URL with correct encoded parameters", () => {
    const url = buildEdgeTtsUrl({
      text: "The weather in Hanoi is chilly.",
      voice: "edge:en-US-JennyNeural",
      rate: 1.25,
      pitch: "deep",
    });

    assert.ok(url.startsWith("/api/tts/stream?"));
    assert.ok(url.includes("text=The+weather+in+Hanoi+is+chilly."));
    assert.ok(url.includes("voice=en-US-JennyNeural"));
    assert.ok(url.includes("rate=1.25"));
    assert.ok(url.includes("pitch=deep"));
  });

  test("removes 'edge:' prefix from voice ID accurately", () => {
    const url = buildEdgeTtsUrl({
      text: "Hello",
      voice: "edge:en-GB-SoniaNeural",
    });
    assert.ok(url.includes("voice=en-GB-SoniaNeural"));
    assert.ok(!url.includes("voice=edge%3A"));
  });

  test("uses fallback voice when voice is omitted or null", () => {
    const url = buildEdgeTtsUrl({ text: "Sample" });
    assert.ok(url.includes("voice=en-US-JennyNeural"));
  });

  test("returns empty string when text is empty, whitespace, or invalid", () => {
    assert.equal(buildEdgeTtsUrl({ text: "" }), "");
    assert.equal(buildEdgeTtsUrl({ text: "   " }), "");
    assert.equal(buildEdgeTtsUrl({ text: null }), "");
    assert.equal(buildEdgeTtsUrl({ text: undefined }), "");
    assert.equal(buildEdgeTtsUrl({}), "");
  });
});

describe("edgeTtsService - isEdgeVoice", () => {
  test("identifies Edge AI voice URIs with 'edge:' prefix correctly", () => {
    assert.equal(isEdgeVoice("edge:en-US-JennyNeural"), true);
    assert.equal(isEdgeVoice("edge:en-GB-RyanNeural"), true);
    assert.equal(isEdgeVoice("edge:en-IN-NeerjaNeural"), true);
  });

  test("returns false for standard browser Web Speech voice names or URIs", () => {
    assert.equal(isEdgeVoice("Microsoft David - English (United States)"), false);
    assert.equal(isEdgeVoice("Google UK English Female"), false);
    assert.equal(isEdgeVoice("virtual_indian_male"), false);
    assert.equal(isEdgeVoice(""), false);
    assert.equal(isEdgeVoice(null), false);
    assert.equal(isEdgeVoice(undefined), false);
  });
});

describe("edgeTtsService - stopEdgeAudio and error handling", () => {
  test("stopEdgeAudio executes without crashing when no audio is currently playing", () => {
    assert.doesNotThrow(() => {
      stopEdgeAudio();
    });
  });

  test("playEdgeTtsAudio returns null and calls onError when text is empty", () => {
    let errorCalled = false;
    const audio = playEdgeTtsAudio({
      text: "   ",
      onError: (err) => {
        errorCalled = true;
        assert.ok(err instanceof Error);
      },
    });

    assert.equal(audio, null);
    assert.equal(errorCalled, true);
  });
});
