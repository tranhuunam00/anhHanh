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

