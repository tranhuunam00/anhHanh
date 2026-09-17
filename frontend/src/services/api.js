export const fetchLesson = async ({ urlOrId, sourceLang = "en", targetLang = "vi" }) => {
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

  return await response.json();
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
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
  });
  if (!res.ok) throw new Error("Translation failed");
  return await res.json();
};
