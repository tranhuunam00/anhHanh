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
