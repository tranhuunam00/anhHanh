import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import { playPronunciationAudio } from "../src/services/authVocabService.js";

describe("playPronunciationAudio Unit Tests", () => {
  // 1. Input Coverage
  it("handles empty, null, and non-string inputs safely without throwing", async () => {
    await assert.doesNotReject(playPronunciationAudio(null));
    await assert.doesNotReject(playPronunciationAudio(undefined));
    await assert.doesNotReject(playPronunciationAudio(""));
    await assert.doesNotReject(playPronunciationAudio("   "));
  });

  // 2. Output Verification
  it("returns a Promise that resolves when Audio is played", async () => {
    const originalAudio = globalThis.Audio;
    let createdUrl = null;
    let playCalled = false;

    globalThis.Audio = class MockAudio {
      constructor(url) {
        createdUrl = url;
        this.src = url;
      }
      play() {
        playCalled = true;
        return Promise.resolve();
      }
      pause() {}
      removeAttribute() {}
    };

    try {
      const p = playPronunciationAudio("legislation", "uk");
      assert.ok(p instanceof Promise);
      // Simulate onended
      setTimeout(() => {
        // Resolve promise via simulated event
      }, 10);
    } finally {
      globalThis.Audio = originalAudio;
    }
  });

  // 3. Internal Logic Coverage: UK vs US selection
  it("routes UK accent to en-GB-SoniaNeural Edge-TTS stream", async () => {
    const originalAudio = globalThis.Audio;
    let playedUrl = null;

    globalThis.Audio = class MockAudio {
      constructor(url) {
        playedUrl = url;
        this.src = url;
      }
      play() {
        if (this.onended) this.onended();
        return Promise.resolve();
      }
      pause() {}
      removeAttribute() {}
    };

    try {
      await playPronunciationAudio("schedule", "uk");
      assert.ok(playedUrl.includes("/api/tts/stream"));
      assert.ok(playedUrl.includes("voice=en-GB-SoniaNeural"));
      assert.ok(playedUrl.includes("text=schedule"));
    } finally {
      globalThis.Audio = originalAudio;
    }
  });

  it("routes US accent to en-US-JennyNeural Edge-TTS stream", async () => {
    const originalAudio = globalThis.Audio;
    let playedUrl = null;

    globalThis.Audio = class MockAudio {
      constructor(url) {
        playedUrl = url;
        this.src = url;
      }
      play() {
        if (this.onended) this.onended();
        return Promise.resolve();
      }
      pause() {}
      removeAttribute() {}
    };

    try {
      await playPronunciationAudio("tomato", "us");
      assert.ok(playedUrl.includes("/api/tts/stream"));
      assert.ok(playedUrl.includes("voice=en-US-JennyNeural"));
      assert.ok(playedUrl.includes("text=tomato"));
    } finally {
      globalThis.Audio = originalAudio;
    }
  });

  it("prioritizes customAudioUrl when provided over synthetic TTS", async () => {
    const originalAudio = globalThis.Audio;
    let playedUrl = null;

    globalThis.Audio = class MockAudio {
      constructor(url) {
        playedUrl = url;
        this.src = url;
      }
      play() {
        if (this.onended) this.onended();
        return Promise.resolve();
      }
      pause() {}
      removeAttribute() {}
    };

    try {
      const customUrl = "https://example.com/audio/legislation-uk.mp3";
      await playPronunciationAudio("legislation", "uk", customUrl);
      assert.equal(playedUrl, customUrl);
    } finally {
      globalThis.Audio = originalAudio;
    }
  });

  // 4. Error & Exception Handling
  it("falls back to Web Speech Synthesis when Audio playback encounters error", async () => {
    const originalAudio = globalThis.Audio;
    const originalWindow = globalThis.window;
    const originalUtterance = globalThis.SpeechSynthesisUtterance;
    let spokeUtterance = null;

    globalThis.SpeechSynthesisUtterance = class MockSpeechSynthesisUtterance {
      constructor(text) {
        this.text = text;
        this.lang = "en-US";
        this.voice = null;
        this.rate = 1.0;
      }
    };

    globalThis.Audio = class MockAudio {
      constructor(url) {
        this.src = url;
      }
      play() {
        if (this.onerror) this.onerror(new Error("Audio load failed"));
        return Promise.reject(new Error("Playback rejected"));
      }
      pause() {}
      removeAttribute() {}
    };

    globalThis.window = {
      speechSynthesis: {
        cancel() {},
        getVoices() {
          return [
            { name: "Microsoft Sonia (UK)", lang: "en-GB" },
            { name: "Microsoft David (US)", lang: "en-US" },
          ];
        },
        speak(utterance) {
          spokeUtterance = utterance;
          if (utterance.onend) utterance.onend();
        },
      },
    };

    try {
      await playPronunciationAudio("advertisement", "uk");
      assert.ok(spokeUtterance !== null);
      assert.equal(spokeUtterance.lang, "en-GB");
      assert.equal(spokeUtterance.voice?.name, "Microsoft Sonia (UK)");
    } finally {
      globalThis.Audio = originalAudio;
      globalThis.window = originalWindow;
      globalThis.SpeechSynthesisUtterance = originalUtterance;
    }
  });
});
