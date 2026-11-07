import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { AudioPlayerController } from "../src/services/audioPlayerController.js";
import { UnifiedPlayerController } from "../src/services/unifiedPlayerController.js";

describe("AudioPlayerController - Unit Tests", () => {
  test("Constructor initializes with correct default properties", () => {
    const ctrl = new AudioPlayerController();
    assert.equal(ctrl.audio, null);
    assert.equal(ctrl.isReady, false);
    assert.equal(ctrl.currentLoopStart, 0);
    assert.equal(ctrl.currentLoopEnd, 0);
    assert.equal(ctrl.isLooping, false);
    assert.equal(ctrl.replayInterval, 1.0);
    assert.equal(ctrl.audioPadding, 0.1);
    assert.equal(ctrl.sourceLang, "en");
    assert.equal(ctrl.isPlaying(), false);
    assert.equal(ctrl.getCurrentTime(), 0);
    assert.equal(ctrl.getDuration(), 0);
  });

  test("setAudioPadding clamps negative values to 0", () => {
    const ctrl = new AudioPlayerController();
    ctrl.setAudioPadding(0.35);
    assert.equal(ctrl.audioPadding, 0.35);

    ctrl.setAudioPadding(-1);
    assert.equal(ctrl.audioPadding, 0.0);

    ctrl.setAudioPadding("invalid");
    assert.equal(ctrl.audioPadding, 0.1);
  });

  test("setReplayInterval enforces minimum 0.1s", () => {
    const ctrl = new AudioPlayerController();
    ctrl.setReplayInterval(2.5);
    assert.equal(ctrl.replayInterval, 2.5);

    ctrl.setReplayInterval(0.01);
    assert.equal(ctrl.replayInterval, 0.1);
  });

  test("setSourceLang and setLooping update properly", () => {
    const ctrl = new AudioPlayerController();
    ctrl.setSourceLang("vi");
    assert.equal(ctrl.sourceLang, "vi");

    ctrl.setLooping(true);
    assert.equal(ctrl.isLooping, true);
    ctrl.setLooping(false);
    assert.equal(ctrl.isLooping, false);
  });

  test("playSegment calculates loopStart and loopEnd with audioPadding", () => {
    const ctrl = new AudioPlayerController();
    ctrl.setAudioPadding(0.2);
    ctrl.playSegment(5.0, 10.0, true, 4.0, 12.0);

    // loopStart: max(0, 5.0 - 0.2 = 4.8, prevEnd = 4.0) -> 4.8
    assert.equal(ctrl.currentLoopStart, 4.8);
    // loopEnd: min(10.0 + 0.2 = 10.2, nextStart = 12.0) -> 10.2
    assert.equal(ctrl.currentLoopEnd, 10.2);
    assert.equal(ctrl.isLooping, true);
    assert.equal(ctrl.isFullMode, false);
  });

  test("cueSegment calculates loopStart and loopEnd and sets paused mode", () => {
    const ctrl = new AudioPlayerController();
    ctrl.setAudioPadding(0.1);
    ctrl.cueSegment(2.0, 6.0, false);

    assert.equal(ctrl.currentLoopStart, 1.9);
    assert.equal(ctrl.currentLoopEnd, 6.1);
    assert.equal(ctrl.isLooping, false);
    assert.equal(ctrl.isFullMode, false);
  });

  test("onStateChange notifies registered callbacks", () => {
    const ctrl = new AudioPlayerController();
    const calls = [];
    ctrl.onStateChange((playing, state) => {
      calls.push({ playing, state });
    });

    ctrl._notifyStateChange(true, 1);
    ctrl._notifyStateChange(false, 2);

    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0], { playing: true, state: 1 });
    assert.deepEqual(calls[1], { playing: false, state: 2 });
  });

  test("destroy clears timers and unloads audio", () => {
    const ctrl = new AudioPlayerController();
    ctrl.loopInterval = setInterval(() => {}, 1000);
    ctrl.replayTimeout = setTimeout(() => {}, 1000);
    ctrl.destroy();

    assert.equal(ctrl.audio, null);
  });
});

describe("UnifiedPlayerController - Unit Tests", () => {
  test("Detects audio sources accurately", () => {
    const unified = new UnifiedPlayerController("dummy-id");

    assert.equal(unified.isAudioSource("/audio/cambridge19/Test1.mp3"), true);
    assert.equal(unified.isAudioSource("/audio/cambridge20/T1S1.m4a"), true);
    assert.equal(unified.isAudioSource("https://example.com/recording.wav"), true);
    assert.equal(unified.isAudioSource("https://www.youtube.com/watch?v=RP1AL2DU6vQ"), false);
    assert.equal(unified.isAudioSource("RP1AL2DU6vQ"), false);
    assert.equal(unified.isAudioSource(""), false);
    assert.equal(unified.isAudioSource(null), false);
  });

  test("Switches active mode between YouTube and Audio", () => {
    const unified = new UnifiedPlayerController("dummy-id");
    assert.equal(unified.mode, "yt");
    assert.equal(unified.isAudioMode, false);

    unified.load("/audio/Cambridge 19 - Test 1.mp3");
    assert.equal(unified.mode, "audio");
    assert.equal(unified.isAudioMode, true);

    unified.load("https://www.youtube.com/watch?v=RP1AL2DU6vQ");
    assert.equal(unified.mode, "yt");
    assert.equal(unified.isAudioMode, false);
  });

  test("Syncs settings across both inner players", () => {
    const unified = new UnifiedPlayerController("dummy-id");
    unified.setAudioPadding(0.25);
    assert.equal(unified.audioPlayer.audioPadding, 0.25);
    assert.equal(unified.ytPlayer.audioPadding, 0.25);

    unified.setReplayInterval(2.0);
    assert.equal(unified.audioPlayer.replayInterval, 2.0);
    assert.equal(unified.ytPlayer.replayInterval, 2.0);

    unified.setSourceLang("fr");
    assert.equal(unified.audioPlayer.sourceLang, "fr");
    assert.equal(unified.ytPlayer.sourceLang, "fr");
  });

  test("isPlaying is callable as a function on YouTubePlayerController and UnifiedPlayerController without throwing", () => {
    const unified = new UnifiedPlayerController("dummy-id");
    // Ensure ytPlayer.isPlaying is a function, not a shadowed boolean property
    assert.equal(typeof unified.ytPlayer.isPlaying, "function");
    assert.equal(typeof unified.isPlaying, "function");

    // Must return boolean false initially without throwing
    assert.equal(unified.ytPlayer.isPlaying(), false);
    assert.equal(unified.isPlaying(), false);

    // Switch to audio mode and verify isPlaying remains a functional boolean
    unified.load("/audio/test.mp3");
    assert.equal(typeof unified.audioPlayer.isPlaying, "function");
    assert.equal(unified.isPlaying(), false);
  });

  test("getDuration and getCurrentTime return safe numbers and support fallback duration", () => {
    const unified = new UnifiedPlayerController("dummy-id");
    assert.equal(unified.getCurrentTime(), 0);
    assert.equal(unified.getDuration(), 0);

    // Loading with fallback duration (e.g. from lesson challenges max end time)
    unified.load("/audio/cambridge19/Test1.mp3", 0, false, 1850.5);
    assert.equal(unified.getDuration(), 1850.5);
    assert.equal(unified.audioPlayer.getDuration(), 1850.5);
  });
});

