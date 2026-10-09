/**
 * Core Vocabulary Management API Service & Facade for DailyDictation Studio
 * Delegates Authentication to ./authService.js and AI Import to ./vocabImportService.js
 */
import { safeParseResponse } from "./authService.js";

// Re-export authentication functions for backward compatibility
export {
  safeParseResponse,
  fetchAuthConfig,
  isTokenExpired,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  fetchCurrentUser,
  fetchStreak,
} from "./authService.js";

// Re-export AI extraction and batch import functions for backward compatibility
export {
  aiExtractVocabFromText,
  extractTextFromFile,
  aiExtractVocabFromFile,
  checkVocabDuplicates,
  batchImportVocab,
} from "./vocabImportService.js";

// Re-export lesson session and history functions for backward compatibility
export {
  fetchLessonPreview,
  startLessonSession,
  updateLessonProgress,
  fetchLessonHistory,
  deleteLessonHistory,
} from "./lessonSessionService.js";

export const fetchVocabList = async (status = "ALL", search = "", token = null, sourceLang = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());
    if (sourceLang && sourceLang !== "ALL") params.append("source_lang", sourceLang.trim().toLowerCase());

    const res = await fetch(`/api/vocab?${params.toString()}`, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Error fetching vocab list:", e);
  }
  return { items: [], vocabulary: [], total: 0 };
};

export const createVocabWord = async (vocabData, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/vocab", {
    method: "POST",
    headers,
    body: JSON.stringify(vocabData),
  });
  return await safeParseResponse(res, "Không thể lưu từ vựng");
};

export const updateVocabStatus = async (vocabId, status, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api/vocab/${vocabId}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });
  return await safeParseResponse(res, "Không thể cập nhật trạng thái");
};

export const rotateVocabImage = async (vocabId, word, currentImg, token, contextSentence = "") => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let url = `/api/vocab/image-candidates?word=${encodeURIComponent(word)}`;
  if (contextSentence) {
    url += `&context_sentence=${encodeURIComponent(contextSentence)}`;
  }
  const res = await fetch(url, { headers });
  const data = await safeParseResponse(res, "Không thể tải danh sách ảnh thay thế");
  const candidates = data.candidates || [];
  if (candidates.length === 0) throw new Error("Không có ảnh thay thế nào khác");

  const available = candidates.filter((u) => u !== currentImg);
  const nextImg = available[Math.floor(Math.random() * available.length)] || candidates[0];

  const patchRes = await fetch(`/api/vocab/${vocabId}/image`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ image_url: nextImg }),
  });
  if (!patchRes.ok) throw new Error("Lỗi khi cập nhật ảnh mới");
  return nextImg;
};

export const deleteVocabWord = async (vocabId, token) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api/vocab/${vocabId}`, {
    method: "DELETE",
    headers,
  });
  return await safeParseResponse(res, "Không thể xóa từ này");
};

export const updateVocabWord = async (vocabId, updateData, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`/api/vocab/${vocabId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updateData),
  });
  return await safeParseResponse(res, "Không thể cập nhật từ vựng");
};

export const fetchPhoneticLookup = async (word, token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`/api/vocab/phonetic?word=${encodeURIComponent(word.trim())}`, { headers });
    if (res.ok) {
      const data = await res.json();
      return data.phonetic || "";
    }
  } catch (e) {
    console.debug("Error fetching phonetic lookup:", e);
  }
  return "";
};

export const fetchWordTranslation = async (word, targetLang = "vi", token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(
      `/api/vocab/translate?word=${encodeURIComponent(word.trim())}&target_lang=${targetLang}`,
      { headers }
    );
    if (res.ok) {
      const data = await res.json();
      return data.translation || "";
    }
  } catch (e) {
    console.debug("Error fetching word translation lookup:", e);
  }
  return "";
};

export const fetchImageCandidates = async (word, contextSentence = "", token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    let url = `/api/vocab/image-candidates?word=${encodeURIComponent(word.trim())}`;
    if (contextSentence) {
      url += `&context_sentence=${encodeURIComponent(contextSentence.trim())}`;
    }
    const res = await fetch(url, { headers });
    if (res.ok) {
      const data = await res.json();
      return data.candidates || [];
    }
  } catch (e) {
    console.debug("Error fetching image candidates:", e);
  }
  return [];
};

export const refreshVocabMeaning = async (vocabId, token) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`/api/vocab/${vocabId}/meaning`, {
    method: "PATCH",
    headers,
  });
  return await safeParseResponse(res, "Không thể lấy nghĩa tiếng Việt");
};

export const fetchDueVocabSession = async (limit = 20, token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`/api/vocab/due-session?limit=${limit}`, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Error fetching due vocab session:", e);
  }
  return { items: [], total_due: 0 };
};

export const fetchPracticeSession = async (limit = 10, token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch(`/api/vocab/practice-session?limit=${limit}`, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Error fetching practice session:", e);
  }
  return { items: [] };
};

export const submitVocabReviewResult = async (vocabId, isCorrect, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/vocab/review-result", {
    method: "POST",
    headers,
    body: JSON.stringify({ vocab_id: vocabId, is_correct: isCorrect }),
  });
  return await safeParseResponse(res, "Không thể cập nhật kết quả ôn tập");
};

export const quickLookupWord = async (word, context = null, token = null, targetLang = "vi") => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const params = new URLSearchParams({ word: word.trim(), target_lang: targetLang });
    if (context && typeof context === "string") {
      params.append("context", context.trim());
    }

    const res = await fetch(`/api/vocab/lookup?${params.toString()}`, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error("Error doing quick lookup:", e);
  }
  return null;
};

let currentAudio = null;

export const playPronunciationAudio = (word, ttsLang = "en") => {
  if (!word) return Promise.resolve();

  return new Promise((resolve) => {
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {
        console.debug("Audio pause err:", e);
      }
      currentAudio = null;
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
      word.trim()
    )}&tl=${ttsLang}&client=tw-ob`;

    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        currentAudio = null;
        resolve();
      }
    };

    const fallbackTTS = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(word.trim());
          utterance.lang = ttsLang === "en" ? "en-US" : ttsLang;
          utterance.rate = 0.9;
          utterance.onend = finish;
          utterance.onerror = finish;
          window.speechSynthesis.speak(utterance);
        } catch {
          finish();
        }
      } else {
        finish();
      }
    };

    try {
      const audio = new Audio(ttsUrl);
      currentAudio = audio;
      audio.onended = finish;
      audio.onerror = fallbackTTS;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => fallbackTTS());
      }
    } catch {
      fallbackTTS();
    }
  });
};
