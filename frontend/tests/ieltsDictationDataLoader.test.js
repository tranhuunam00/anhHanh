import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  DICTATION_DATASET_LOADERS,
  resolveCambridgeBookNumber,
  createDictationEntryLoader,
  loadDictationEntry,
  loadIeltsAudioLesson,
} from "../src/utils/ieltsDictationDataLoader.js";
import {
  hasAuthenticChallenges,
  buildIeltsAudioLessonFromSources,
} from "../src/utils/ieltsAudioLessonCore.js";
import { buildIeltsAudioLesson, findAuthenticDictationEntry } from "../src/utils/ieltsDictationChallengeBuilder.js";
import { CAMBRIDGE_19_LESSONS } from "../src/constants/ieltsCambridge19Presets.js";

const CHALLENGE = { id: "c1", position: 1, time_start: 0, time_end: 2, text: "Hello there.", words: [] };

describe("hasAuthenticChallenges", () => {
  test("true for entry with at least one challenge", () => {
    assert.equal(hasAuthenticChallenges({ challenges: [CHALLENGE] }), true);
  });

  test("false for empty, missing or malformed challenges", () => {
    assert.equal(hasAuthenticChallenges({ challenges: [] }), false);
    assert.equal(hasAuthenticChallenges({ challenges: "x" }), false);
    assert.equal(hasAuthenticChallenges({}), false);
    assert.equal(hasAuthenticChallenges(null), false);
    assert.equal(hasAuthenticChallenges(undefined), false);
  });
});

describe("buildIeltsAudioLessonFromSources", () => {
  const preset = { id: "cam99-t1-s1", title: "Part 1", audioUrl: "/audio/p1.mp3", duration: "05:00", book: "Cambridge 99" };

  test("returns null for missing preset", () => {
    assert.equal(buildIeltsAudioLessonFromSources(null), null);
    assert.equal(buildIeltsAudioLessonFromSources(undefined, {}), null);
  });

  test("uses authentic challenges when provided", () => {
    const lesson = buildIeltsAudioLessonFromSources(preset, { authenticData: { challenges: [CHALLENGE] } });
    assert.equal(lesson.video_id, "cam99-t1-s1");
    assert.equal(lesson.isAudio, true);
    assert.equal(lesson.total_challenges, 1);
    assert.equal(lesson.challenges[0], CHALLENGE);
    assert.equal(lesson.audioUrl, "/audio/p1.mp3");
    assert.equal(lesson.sourceLang, "en");
    assert.equal(lesson.targetLang, "vi");
  });

  test("tolerates null/undefined sources object", () => {
    const a = buildIeltsAudioLessonFromSources(preset, null);
    const b = buildIeltsAudioLessonFromSources(preset);
    assert.equal(a.total_challenges, 10);
    assert.equal(b.total_challenges, 10);
  });

  test("falls back to question items from matching test", () => {
    const tests = [{
      id: "cambridge-99-test-1",
      data: { skills: { listening: { parts: [{ items: [{ number: 1, prefix: "Name:", suffix: "", answers: ["Jane"] }, { number: 2, statement: "It rains" }] }] } } },
    }];
    const lesson = buildIeltsAudioLessonFromSources(
      { ...preset, testNumber: 1, taskNumber: 1 },
      { authenticData: { challenges: [] }, tests }
    );
    assert.equal(lesson.total_challenges, 2);
    assert.equal(lesson.challenges[0].text, "Name: Jane.");
    assert.equal(lesson.challenges[1].text, "It rains.");
    assert.equal(lesson.challenges[1].time_start, 150);
    assert.equal(lesson.challenges[1].time_end, 300);
  });

  test("ignores non-array tests and generates 10 placeholder segments", () => {
    const lesson = buildIeltsAudioLessonFromSources(preset, { tests: "not-an-array" });
    assert.equal(lesson.total_challenges, 10);
    assert.match(lesson.challenges[0].text, /Cambridge IELTS Cambridge 99 Listening segment/);
  });
});

describe("resolveCambridgeBookNumber", () => {
  test("parses book number from preset ids", () => {
    assert.equal(resolveCambridgeBookNumber("cam19-t2-s3"), 19);
    assert.equal(resolveCambridgeBookNumber("cam16-t1-full"), 16);
    assert.equal(resolveCambridgeBookNumber("CAM21-t4-s4"), 21);
    assert.equal(resolveCambridgeBookNumber("  cam9-t1-s1 "), 9);
  });

  test("returns null for ids without a cam prefix or with bad input", () => {
    assert.equal(resolveCambridgeBookNumber("all"), null);
    assert.equal(resolveCambridgeBookNumber("cambridge-19-test-1"), null);
    assert.equal(resolveCambridgeBookNumber("cam-19"), null);
    assert.equal(resolveCambridgeBookNumber("cam0-t1"), null);
    assert.equal(resolveCambridgeBookNumber("cam123-t1"), null);
    assert.equal(resolveCambridgeBookNumber(""), null);
    assert.equal(resolveCambridgeBookNumber(null), null);
    assert.equal(resolveCambridgeBookNumber(19), null);
  });
});

describe("createDictationEntryLoader", () => {
  test("loads only the requested book, once, and returns the entry", async () => {
    const calls = { 19: 0, 20: 0 };
    const loader = createDictationEntryLoader({
      19: async () => { calls[19] += 1; return { "cam19-t1-s1": { challenges: [CHALLENGE] } }; },
      20: async () => { calls[20] += 1; return {}; },
    });
    const [a, b] = await Promise.all([loader("cam19-t1-s1"), loader("cam19-t1-s1")]);
    assert.deepEqual(a, { challenges: [CHALLENGE] });
    assert.equal(a, b);
    assert.equal(calls[19], 1);
    assert.equal(calls[20], 0);
  });

  test("returns null for unknown id within a loaded book", async () => {
    const loader = createDictationEntryLoader({ 19: async () => ({}) });
    assert.equal(await loader("cam19-t9-s9"), null);
  });

  test("returns null without loading for unsupported books or bad ids", async () => {
    let called = false;
    const loader = createDictationEntryLoader({ 19: async () => { called = true; return {}; } });
    assert.equal(await loader("cam15-t1-s1"), null);
    assert.equal(await loader("all"), null);
    assert.equal(await loader(undefined), null);
    assert.equal(called, false);
  });

  test("handles loader resolving to null dataset", async () => {
    const loader = createDictationEntryLoader({ 19: async () => null });
    assert.equal(await loader("cam19-t1-s1"), null);
  });

  test("evicts failed loads so the next call retries", async () => {
    let attempt = 0;
    const loader = createDictationEntryLoader({
      19: async () => {
        attempt += 1;
        if (attempt === 1) throw new Error("chunk failed");
        return { "cam19-t1-s1": { challenges: [CHALLENGE] } };
      },
    });
    await assert.rejects(loader("cam19-t1-s1"), /chunk failed/);
    assert.ok(await loader("cam19-t1-s1"));
    assert.equal(attempt, 2);
  });

  test("throws TypeError for invalid loaders map", () => {
    assert.throws(() => createDictationEntryLoader(null), TypeError);
    assert.throws(() => createDictationEntryLoader("x"), TypeError);
  });
});

describe("DICTATION_DATASET_LOADERS", () => {
  test("covers Cambridge 16-21 and is frozen", () => {
    assert.deepEqual(Object.keys(DICTATION_DATASET_LOADERS).map(Number), [16, 17, 18, 19, 20, 21]);
    assert.equal(Object.isFrozen(DICTATION_DATASET_LOADERS), true);
  });

  test("each loader resolves to a dataset keyed by its own book ids", async () => {
    for (const [book, load] of Object.entries(DICTATION_DATASET_LOADERS)) {
      const dataset = await load();
      const keys = Object.keys(dataset);
      assert.ok(keys.length > 0, `book ${book} empty`);
      assert.ok(keys.every((k) => resolveCambridgeBookNumber(k) === Number(book)), `book ${book} has foreign ids`);
    }
  });
});

describe("loadIeltsAudioLesson", () => {
  test("returns null for missing preset", async () => {
    assert.equal(await loadIeltsAudioLesson(null), null);
  });

  test("uses authentic entry and skips loading the test catalogue", async () => {
    let testsLoaded = false;
    const lesson = await loadIeltsAudioLesson(
      { id: "cam19-t1-s1", title: "T", audioUrl: "/a.mp3" },
      { loadEntry: async () => ({ challenges: [CHALLENGE] }), loadTests: async () => { testsLoaded = true; return []; } }
    );
    assert.equal(lesson.total_challenges, 1);
    assert.equal(testsLoaded, false);
  });

  test("falls back to test catalogue when no authentic entry", async () => {
    let testsLoaded = false;
    const lesson = await loadIeltsAudioLesson(
      { id: "custom-1", title: "T", audioUrl: "/a.mp3", duration: "01:40" },
      { loadEntry: async () => null, loadTests: async () => { testsLoaded = true; return []; } }
    );
    assert.equal(testsLoaded, true);
    assert.equal(lesson.total_challenges, 10);
    assert.equal(lesson.challenges[9].time_end, 100);
  });

  test("propagates loader errors so the UI can show a message", async () => {
    await assert.rejects(
      loadIeltsAudioLesson({ id: "cam19-t1-s1" }, { loadEntry: async () => { throw new Error("offline"); } }),
      /offline/
    );
  });

  test("real lazy path produces the same lesson as the eager sync builder", async () => {
    const preset = CAMBRIDGE_19_LESSONS[0];
    assert.ok(preset && preset.id, "expected a Cambridge 19 preset");
    const lazyLesson = await loadIeltsAudioLesson(preset);
    const eagerLesson = buildIeltsAudioLesson(preset);
    assert.deepEqual(lazyLesson, eagerLesson);
    assert.ok(lazyLesson.total_challenges > 0);
  });

  test("real shared entry loader matches findAuthenticDictationEntry", async () => {
    const entry = await loadDictationEntry("cam21-t4-full");
    assert.equal(entry, findAuthenticDictationEntry("cam21-t4-full"));
  });
});

describe("findAuthenticDictationEntry", () => {
  test("finds entries across books", () => {
    assert.ok(hasAuthenticChallenges(findAuthenticDictationEntry("cam16-t1-s1")));
    assert.ok(hasAuthenticChallenges(findAuthenticDictationEntry("cam20-t3-s2")));
  });

  test("returns null for unknown or invalid ids", () => {
    assert.equal(findAuthenticDictationEntry("cam99-t1-s1"), null);
    assert.equal(findAuthenticDictationEntry(""), null);
    assert.equal(findAuthenticDictationEntry(null), null);
    assert.equal(findAuthenticDictationEntry(42), null);
  });
});
