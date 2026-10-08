/**
 * Lesson Session, Preview, and Learning History Service
 */
import { safeParseResponse } from "./authService.js";

export const fetchLessonPreview = async (urlOrId, sourceLang = "en", targetLang = "vi", token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/lesson/preview", {
    method: "POST",
    headers,
    body: JSON.stringify({
      url_or_id: urlOrId,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });
  return await safeParseResponse(res, "Không thể tải xem trước bài học");
};

export const startLessonSession = async (videoId, token, sourceLang = "en", targetLang = "vi") => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/lesson/start", {
      method: "POST",
      headers,
      body: JSON.stringify({
        video_id: videoId,
        source_lang: sourceLang,
        target_lang: targetLang,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Could not record start session:", e);
  }
  return null;
};

export const updateLessonProgress = async (
  videoId,
  currentPosition,
  isCompleted = false,
  token,
  wordsTyped = 0,
  sourceLang = "en",
  targetLang = "vi"
) => {
  try {
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/lesson/progress", {
      method: "POST",
      headers,
      body: JSON.stringify({
        video_id: videoId,
        current_position: Math.max(1, currentPosition),
        is_completed: isCompleted,
        words_typed: wordsTyped,
        source_lang: sourceLang,
        target_lang: targetLang,
      }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Could not update progress:", e);
  }
  return null;
};

export const fetchLessonHistory = async (token) => {
  if (!token) return [];
  try {
    const res = await fetch("/api/lesson/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("fetchLessonHistory error:", e);
  }
  return [];
};

export const deleteLessonHistory = async (videoId, token, sourceLang = "en", targetLang = "vi") => {
  if (!token) return false;
  try {
    const query = new URLSearchParams({ source_lang: sourceLang, target_lang: targetLang });
    const res = await fetch(`/api/lesson/history/${encodeURIComponent(videoId)}?${query.toString()}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (e) {
    console.warn("deleteLessonHistory error:", e);
    return false;
  }
};
