/**
 * Safely parse response JSON, falling back cleanly to text or default message if body is not valid JSON
 */
const safeParseResponse = async (res, defaultMsg = "Thao tác thất bại") => {
  let data = {};
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: defaultMsg };
  }
  if (!res.ok) {
    throw new Error(data.detail || defaultMsg);
  }
  return data;
};

export const fetchAuthConfig = async () => {
  try {
    const res = await fetch("/api/auth/config");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Could not fetch auth config:", e);
  }
  return { google_client_id: "" };
};

export const loginWithGoogle = async (credential) => {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential }),
  });
  return await safeParseResponse(res, "Đăng nhập Google thất bại");
};

export const loginWithEmail = async (email, password) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return await safeParseResponse(res, "Đăng nhập thất bại");
};

export const registerWithEmail = async (email, password, name = "", b_trap = "") => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, b_trap }),
  });
  return await safeParseResponse(res, "Đăng ký thất bại");
};

export const fetchCurrentUser = async (token) => {
  if (!token) return null;
  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return data.user;
    }
  } catch (e) {
    console.warn("Could not fetch current user:", e);
  }
  return null;
};

export const fetchStreak = async (token) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/streak", { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Could not fetch streak:", e);
  }
  return { current_streak: 0, max_streak: 0, words_today: 0 };
};

export const fetchVocabList = async (status = "ALL", search = "", token = null) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.append("status", status);
    if (search) params.append("search", search);

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
  return { total_due: 0, items: [] };
};

export const submitVocabReviewResult = async (vocabId, isCorrect, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch("/api/vocab/review-result", {
    method: "POST",
    headers,
    body: JSON.stringify({ vocab_id: vocabId, is_correct: isCorrect }),
  });
  return await safeParseResponse(res, "Không thể cập nhật kết quả ôn tập");
};

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
