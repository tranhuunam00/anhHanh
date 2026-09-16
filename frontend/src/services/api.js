export const fetchLesson = async ({ urlOrId, sourceLang = "auto", targetLang = "vi" }) => {
  const response = await fetch("/api/lesson", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url_or_id: urlOrId,
      grouping_mode: "sentence",
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Không thể tải bài học");
  }

  return await response.json();
};

export const fetchVideoLanguages = async (urlOrId) => {
  try {
    const res = await fetch(`/api/video-languages?url_or_id=${encodeURIComponent(urlOrId)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Error fetching video languages:", e);
  }
  return null;
};

export const fetchPresets = async () => {
  try {
    const res = await fetch("/api/presets");
    if (res.ok) return await res.json();
  } catch (e) {
    console.warn("Error fetching presets:", e);
  }
  return [];
};

export const translateText = async (text, sourceLang = "auto", targetLang = "vi") => {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source_lang: sourceLang, target_lang: targetLang }),
  });
  if (!res.ok) throw new Error("Translation failed");
  return await res.json();
};
