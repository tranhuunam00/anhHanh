export const normalizeText = (str, strictPunctuation = false) => {
  if (!str) return "";
  let clean = str.trim();
  if (!strictPunctuation) {
    clean = clean
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?@'"]/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }
  return clean;
};

export const cleanCredits = (text) => {
  if (!text) return text;
  let clean = text;
  clean = clean.replace(/Subtitles by.*$/gi, "");
  clean = clean.replace(/Transcript by.*$/gi, "");
  clean = clean.replace(/Phụ đề bởi.*$/gi, "");
  return clean.trim();
};

export const extractYouTubeId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== "string") return "";
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

export const toCanonicalYouTubeUrl = (urlOrId) => {
  const id = extractYouTubeId(urlOrId);
  return id ? `https://www.youtube.com/watch?v=${id}` : (urlOrId || "");
};
