import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { usesDataDrivenListeningRenderer } from "../src/utils/ieltsListeningRendererRouting.js";
import { IELTS_TESTS } from "../src/data/ielts/index.js";
import { cambridge18DictationData } from "../src/data/ielts/cambridge18DictationData.js";
import { CAMBRIDGE_18_LESSONS, CAMBRIDGE_18_FULL_LESSONS } from "../src/constants/ieltsCambridge18Presets.js";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const publicPath = (url) => fileURLToPath(new URL(`../public${url}`, import.meta.url));

describe("usesDataDrivenListeningRenderer", () => {
  test("Cambridge 18 and 19 use the data-driven renderer", () => {
    for (let n = 1; n <= 4; n++) {
      assert.equal(usesDataDrivenListeningRenderer(`cambridge-18-test-${n}`), true);
      assert.equal(usesDataDrivenListeningRenderer(`cambridge-19-test-${n}`), true);
    }
  });

  test("other books keep their dedicated renderers", () => {
    assert.equal(usesDataDrivenListeningRenderer("cambridge-20-test-1"), false);
    assert.equal(usesDataDrivenListeningRenderer("cambridge-21-test-2"), false);
  });

  test("handles empty and non-string input", () => {
    assert.equal(usesDataDrivenListeningRenderer(""), false);
    assert.equal(usesDataDrivenListeningRenderer(null), false);
    assert.equal(usesDataDrivenListeningRenderer(undefined), false);
    assert.equal(usesDataDrivenListeningRenderer(18), false);
  });
});

describe("Cambridge 18 audio / preset / exam-data mapping", () => {
  test("every preset points to an existing audio file", () => {
    for (const p of [...CAMBRIDGE_18_LESSONS, ...CAMBRIDGE_18_FULL_LESSONS]) {
      assert.equal(existsSync(publicPath(p.audioUrl)), true, `${p.id} missing ${p.audioUrl}`);
      assert.equal(p.url, p.audioUrl, `${p.id} url/audioUrl differ`);
    }
  });

  test("full presets play the full test mp3, split presets play the matching part", () => {
    for (const p of CAMBRIDGE_18_FULL_LESSONS) {
      assert.equal(p.audioUrl, `/audio/Cambridge 18 - Test ${p.testNumber}.mp3`);
    }
    for (const p of CAMBRIDGE_18_LESSONS) {
      assert.equal(p.audioUrl, `/audio/cambridge18/split/Test${p.testNumber} Part${p.taskNumber}.mp3`);
    }
  });

  test("transcript length matches the audio file length for every preset", () => {
    const refBytesPerSec = statSync(publicPath("/audio/Cambridge 18 - Test 1.mp3")).size / 1757;
    for (const p of [...CAMBRIDGE_18_LESSONS, ...CAMBRIDGE_18_FULL_LESSONS]) {
      const data = cambridge18DictationData[p.id];
      assert.ok(data && data.challenges.length > 0, `${p.id} has no transcript`);
      const end = data.challenges.at(-1).time_end;
      const audioSec = statSync(publicPath(p.audioUrl)).size / refBytesPerSec;
      assert.ok(Math.abs(audioSec - end) < 40, `${p.id}: audio ${Math.round(audioSec)}s vs transcript ${Math.round(end)}s`);
    }
  });

  test("preset titles name the same topic as the exam data of that part", () => {
    const keywords = {
      "cam18-t1-s1": "Transport", "cam18-t1-s2": "ACE", "cam18-t1-s3": "Fashion", "cam18-t1-s4": "Elephant",
      "cam18-t2-s1": "Milo", "cam18-t2-s2": "Housing", "cam18-t2-s3": "Laki", "cam18-t2-s4": "Pockets",
      "cam18-t3-s1": "Camera", "cam18-t3-s2": "Mushrooms", "cam18-t3-s3": "Luddites", "cam18-t3-s4": "Space",
      "cam18-t4-s1": "Employment", "cam18-t4-s2": "Farming", "cam18-t4-s3": "Origami", "cam18-t4-s4": "Hugo",
    };
    for (const p of CAMBRIDGE_18_LESSONS) {
      assert.ok(p.title.includes(keywords[p.id]), `${p.id}: "${p.title}" should mention ${keywords[p.id]}`);
      const exam = IELTS_TESTS.find((t) => t.id === `cambridge-18-test-${p.testNumber}`);
      assert.ok(exam.data.skills.listening.parts[p.taskNumber - 1], `${p.id} has no matching exam part`);
    }
  });

  test("each part's transcript announces the same topic as the exam part title", () => {
    const expect = {
      "cam18-t1-s2": /volunteers/i, "cam18-t1-s3": /fashion design/i, "cam18-t1-s4": /zoology|wild/i,
      "cam18-t2-s2": /housing development/i, "cam18-t2-s3": /volcanic/i, "cam18-t2-s4": /pockets/i,
      "cam18-t3-s2": /mushrooms/i, "cam18-t3-s3": /automation/i, "cam18-t3-s4": /satellites/i,
      "cam18-t4-s2": /farming museum/i, "cam18-t4-s3": /origami/i, "cam18-t4-s4": /Victor Hugo/i,
    };
    for (const [id, re] of Object.entries(expect)) {
      const intro = cambridge18DictationData[id].challenges.slice(0, 3).map((c) => c.text).join(" ");
      assert.match(intro, re, id);
    }
  });
});

