import { IELTS_TESTS } from "../data/ielts/index.js";
import { cambridge17DictationData } from "../data/ielts/cambridge17DictationData.js";
import { cambridge18DictationData } from "../data/ielts/cambridge18DictationData.js";
import { cambridge19DictationData } from "../data/ielts/cambridge19DictationData.js";
import { cambridge20DictationData } from "../data/ielts/cambridge20DictationData.js";
import { cambridge21DictationData } from "../data/ielts/cambridge21DictationData.js";

/**
 * Parses duration string (e.g. "05:12", "30:45", "1:49") to seconds
 */
export function parseDurationToSeconds(durationStr) {
  if (!durationStr || typeof durationStr !== "string") return 300;
  const parts = durationStr.trim().split(":").map((p) => parseInt(p, 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 300;
}

/**
 * Extracts all question items from a listening part, handling both direct .items and nested .groups[].items
 */
export function extractItemsFromPart(part) {
  if (!part) return [];
  const items = [];
  if (Array.isArray(part.items)) {
    items.push(...part.items);
  }
  if (Array.isArray(part.groups)) {
    for (const g of part.groups) {
      if (Array.isArray(g.items)) {
        items.push(...g.items);
      }
    }
  }
  return items;
}

/**
 * Converts a Cambridge question item into a clean dictation challenge sentence
 */
export function formatChallengeText(item, fallbackIndex) {
  if (!item) return `Cambridge IELTS Listening Sentence ${fallbackIndex}.`;

  // Note/table completion with prefix and suffix
  if (item.prefix !== undefined || item.suffix !== undefined) {
    const p = (item.prefix || "").trim();
    const ans = (Array.isArray(item.answers) && item.answers[0]) || "";
    const s = (item.suffix || "").trim();
    const full = `${p} ${ans} ${s}`.replace(/\s+/g, " ").trim();
    if (full.length > 2) {
      return /[.?!]$/.test(full) ? full : `${full}.`;
    }
  }

  // Multiple choice or general question
  if (item.question) {
    const q = item.question.trim();
    const ans = (Array.isArray(item.answers) && item.answers[0]) || "";
    let optText = "";
    if (Array.isArray(item.options)) {
      const match = item.options.find((o) => typeof o === "string" && o.startsWith(ans));
      if (match) optText = ` - ${match}`;
    }
    const full = `${q}${optText}`.replace(/\s+/g, " ").trim();
    return /[.?!]$/.test(full) ? full : `${full}.`;
  }

  if (item.statement) {
    const st = item.statement.trim();
    return /[.?!]$/.test(st) ? st : `${st}.`;
  }

  return `Cambridge IELTS Listening Task Question ${fallbackIndex}.`;
}

/**
 * Builds a complete lesson object with challenges for Cambridge 19, 20, 21 local audio presets
 */
export function buildIeltsAudioLesson(preset) {
  if (!preset) return null;

  const audioUrl = preset.audioUrl || preset.url;

  // 1. High-priority: Authentic AI-transcribed sentence challenges with millisecond timestamps
  const authenticData =
    cambridge17DictationData?.[preset.id] ||
    cambridge18DictationData?.[preset.id] ||
    cambridge19DictationData?.[preset.id] ||
    cambridge20DictationData?.[preset.id] ||
    cambridge21DictationData?.[preset.id];
  if (authenticData && Array.isArray(authenticData.challenges) && authenticData.challenges.length > 0) {
    return {
      video_id: preset.id,
      title: preset.title,
      author: preset.author || preset.book || "Cambridge University Press",
      duration: preset.duration || "05:00",
      audioUrl: audioUrl,
      url: audioUrl,
      isAudio: true,
      sourceLang: preset.sourceLang || "en",
      targetLang: preset.targetLang || "vi",
      total_challenges: authenticData.challenges.length,
      challenges: authenticData.challenges
    };
  }

  const totalDurationSec = parseDurationToSeconds(preset.duration);

  // Identify matching test from IELTS_TESTS
  let matchedTest = null;
  const bookNum = preset.testNumber ? (preset.book?.match(/\d+/)?.[0] || "19") : null;

  if (bookNum && preset.testNumber) {
    matchedTest = IELTS_TESTS.find((t) => t.id === `cambridge-${bookNum}-test-${preset.testNumber}`);
  }

  // Fallback match by id substring
  if (!matchedTest) {
    matchedTest = IELTS_TESTS.find((t) => preset.id?.includes(t.id) || t.id?.includes(preset.id));
  }

  const parts = matchedTest?.data?.skills?.listening?.parts || [];

  // Determine relevant parts: split task (1 part) or full test (all 4 parts)
  let targetItems = [];
  if (preset.taskNumber && parts[preset.taskNumber - 1]) {
    targetItems = extractItemsFromPart(parts[preset.taskNumber - 1]);
  } else if (preset.isSplit && preset.taskKey) {
    const taskIdx = preset.taskKey === "task1" ? 0 : preset.taskKey === "task2" ? 1 : preset.taskKey === "task3" ? 2 : 3;
    if (parts[taskIdx]) {
      targetItems = extractItemsFromPart(parts[taskIdx]);
    }
  } else {
    // Full combined test: merge items from all parts
    for (const p of parts) {
      targetItems.push(...extractItemsFromPart(p));
    }
  }

  // If no items found from IELTS_TESTS, create standard 10 practice sentence segments
  if (targetItems.length === 0) {
    targetItems = Array.from({ length: 10 }, (_, i) => ({
      number: i + 1,
      prefix: `Cambridge IELTS ${preset.book || "Official"} Listening segment`,
      suffix: `key practice sentence ${i + 1}`,
      answers: ["important"]
    }));
  }

  const count = targetItems.length;
  const step = totalDurationSec / Math.max(1, count);

  const challenges = targetItems.map((item, idx) => {
    const tStart = Math.round(idx * step * 10) / 10;
    const tEnd = Math.min(totalDurationSec, Math.round((idx + 1) * step * 10) / 10);
    const text = formatChallengeText(item, idx + 1);

    return {
      id: `${preset.id}-c${idx + 1}`,
      position: idx + 1,
      time_start: tStart,
      time_end: tEnd,
      text: text,
      translation: `[Câu hỏi ${item.number || idx + 1}] Luyện chép chính tả câu then chốt bài nghe Cambridge.`,
      words: text.split(/\s+/).map((w, wIdx) => ({
        id: `${preset.id}-c${idx + 1}-w${wIdx}`,
        word: w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      }))
    };
  });

  return {
    video_id: preset.id,
    title: preset.title,
    author: preset.author || preset.book || "Cambridge University Press",
    duration: preset.duration || "05:00",
    audioUrl: audioUrl,
    url: audioUrl,
    isAudio: true,
    sourceLang: preset.sourceLang || "en",
    targetLang: preset.targetLang || "vi",
    total_challenges: challenges.length,
    challenges: challenges
  };
}

