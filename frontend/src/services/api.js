// Client-side LRU/In-Memory & SessionStorage Cache
const lessonMemoryCache = new Map();
const translationMemoryCache = new Map();

const getSessionLesson = (cacheKey) => {
  try {
    const raw = sessionStorage.getItem(`shotlang_lesson_${cacheKey}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

const saveSessionLesson = (cacheKey, data) => {
  try {
    sessionStorage.setItem(`shotlang_lesson_${cacheKey}`, JSON.stringify(data));
  } catch (e) {
    // Quota exceeded or private browsing
  }
};

export const fetchLesson = async ({ urlOrId, sourceLang = "en", targetLang = "vi" }) => {
  const cacheKey = `${urlOrId.trim()}_${sourceLang}_${targetLang}_sentence`;

  // 1. Check in-memory cache first (instant 0ms)
  if (lessonMemoryCache.has(cacheKey)) {
    return lessonMemoryCache.get(cacheKey);
  }

  // 2. Check sessionStorage cache
  const cachedFromSession = getSessionLesson(cacheKey);
  if (cachedFromSession) {
    lessonMemoryCache.set(cacheKey, cachedFromSession);
    return cachedFromSession;
  }

  const response = await fetch("/api/lesson", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url_or_id: urlOrId,
      source_lang: sourceLang,
      target_lang: targetLang,
      grouping_mode: "sentence",
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.detail || "Không thể tải bài học từ video này.");
  }

  const data = await response.json();
  lessonMemoryCache.set(cacheKey, data);
  saveSessionLesson(cacheKey, data);
  return data;
};

export const fetchVideoLanguages = async (urlOrId) => {
  try {
    const res = await fetch(`/api/video-languages?url_or_id=${encodeURIComponent(urlOrId)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("fetchVideoLanguages error", e);
  }
  return null;
};

export const fetchPresets = async () => {
  try {
    const res = await fetch("/api/presets");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("fetchPresets error", e);
  }
  return null;
};

export const translateText = async (text, sourceLang = "en", targetLang = "vi") => {
  if (!text || !text.trim()) return { translation: "" };
  const cacheKey = `${text.trim()}_${sourceLang}_${targetLang}`;
  if (translationMemoryCache.has(cacheKey)) {
    return translationMemoryCache.get(cacheKey);
  }

  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
  });
  if (!res.ok) throw new Error("Translation failed");
  const data = await res.json();
  translationMemoryCache.set(cacheKey, data);
  return data;
};
