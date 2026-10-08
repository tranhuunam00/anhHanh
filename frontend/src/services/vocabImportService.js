/**
 * AI Vocabulary Extraction and Batch Import API Service
 */
import { safeParseResponse } from "./authService";

export const aiExtractVocabFromText = async (
  text,
  sourceLang = "en",
  targetLang = "vi",
  mode = "auto",
  token = null,
  vocabLevel = "intermediate"
) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/vocab/ai-extract", {
    method: "POST",
    headers,
    body: JSON.stringify({
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
      mode,
      vocab_level: vocabLevel,
    }),
  });
  return await safeParseResponse(res, "Không thể trích xuất từ vựng qua AI");
};

export const extractTextFromFile = async (
  file,
  token = null,
  startPage = null,
  endPage = null
) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const formData = new FormData();
  formData.append("file", file);
  if (startPage) formData.append("start_page", String(startPage));
  if (endPage) formData.append("end_page", String(endPage));

  const res = await fetch("/api/vocab/extract-text", {
    method: "POST",
    headers,
    body: formData,
  });
  return await safeParseResponse(res, "Không thể trích xuất văn bản từ tệp");
};

export const aiExtractVocabFromFile = async (
  file,
  token = null,
  startPage = null,
  endPage = null,
  sourceLang = "en",
  targetLang = "vi",
  vocabLevel = "intermediate"
) => {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const formData = new FormData();
  formData.append("file", file);
  if (startPage) formData.append("start_page", String(startPage));
  if (endPage) formData.append("end_page", String(endPage));
  formData.append("source_lang", sourceLang || "en");
  formData.append("target_lang", targetLang || "vi");
  formData.append("vocab_level", vocabLevel || "intermediate");

  const res = await fetch("/api/vocab/ai-extract-file", {
    method: "POST",
    headers,
    body: formData,
  });
  return await safeParseResponse(res, "Không thể trích xuất từ tệp qua AI");
};

export const checkVocabDuplicates = async (words, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/vocab/check-duplicates", {
    method: "POST",
    headers,
    body: JSON.stringify({ words }),
  });
  return await safeParseResponse(res, "Không thể kiểm tra trùng lặp từ vựng");
};

export const batchImportVocab = async (items, token = null, conflictResolution = "skip_existing") => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch("/api/vocab/batch-import", {
    method: "POST",
    headers,
    body: JSON.stringify({
      items,
      conflict_resolution: conflictResolution,
    }),
  });
  return await safeParseResponse(res, "Không thể lưu danh sách từ vựng");
};
