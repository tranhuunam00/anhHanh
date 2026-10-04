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
  // 1. Try URL parsing for robust handling of query parameters (list, index, t, etc.)
  try {
    const raw = trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
    const parsed = new URL(raw);
    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      const v = parsed.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      if (pathParts[0] === "shorts" || pathParts[0] === "embed" || pathParts[0] === "v") {
        if (pathParts[1] && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[1])) return pathParts[1];
      }
      if (parsed.hostname.includes("youtu.be") && pathParts[0] && /^[a-zA-Z0-9_-]{11}$/.test(pathParts[0])) {
        return pathParts[0];
      }
    }
  } catch (e) {
    // fallback to regex
  }

  // 2. Regex fallback for non-standard or partial inputs
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
  return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? `https://www.youtube.com/watch?v=${id}` : (urlOrId || "");
};

/**
 * Automatically cleans any copied/pasted YouTube URL by stripping playlist (&list=...),
 * tracking tags (&si=..., &pp=...) to keep only the pure clean watch URL.
 */
export const cleanYouTubeUrl = (urlOrInput) => {
  if (!urlOrInput || typeof urlOrInput !== "string") return "";
  const trimmed = urlOrInput.trim();
  const id = extractYouTubeId(trimmed);
  if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
    return `https://www.youtube.com/watch?v=${id}`;
  }
  return trimmed;
};

export const splitContextSentence = (text) => {
  if (!text) return { orig: "", trans: "" };
  const cleaned = text.trim();
  if (!cleaned) return { orig: "", trans: "" };

  // 1. Explicit newline separation
  if (cleaned.includes("\n")) {
    const parts = cleaned.split("\n").map((s) => s.trim()).filter(Boolean);
    return {
      orig: parts[0] || "",
      trans: parts.slice(1).join(" ") || "",
    };
  }

  // 2. Double quotes separation e.g. "Language 1" "Language 2"
  const quoteMatches = cleaned.match(/"([^"]+)"/g);
  if (quoteMatches && quoteMatches.length >= 2) {
    return {
      orig: quoteMatches[0].replace(/^"+|"+$/g, "").trim(),
      trans: quoteMatches[1].replace(/^"+|"+$/g, "").trim(),
    };
  }

  // 3. Intelligent boundary detection between source language (NN1) and Vietnamese (NN2)
  const viDiacriticsPattern = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  if (sentences.length > 1) {
    let origParts = [];
    let transParts = [];
    let foundVi = false;

    for (let s of sentences) {
      const trimmed = s.trim();
      if (!foundVi && viDiacriticsPattern.test(trimmed)) {
        foundVi = true;
      }
      if (foundVi) {
        transParts.push(trimmed);
      } else {
        origParts.push(trimmed);
      }
    }

    if (origParts.length > 0 && transParts.length > 0) {
      return {
        orig: origParts.join(" "),
        trans: transParts.join(" "),
      };
    }
  }

  return { orig: cleaned, trans: "" };
};

