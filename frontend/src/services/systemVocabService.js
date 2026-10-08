/**
 * System Vocabulary Bank API Service
 * Handles fetching categories, searching curated terms, batch importing, and Admin CRUD.
 */

const API_BASE = "/api/system-vocab";

export async function fetchVocabCategories(lang = null) {
  try {
    const url = lang ? `${API_BASE}/categories?lang=${encodeURIComponent(lang)}` : `${API_BASE}/categories`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Không thể tải danh sách chủ đề");
    return await res.json();
  } catch (err) {
    console.error("fetchVocabCategories error:", err);
    return { categories: [], total_categories: 0 };
  }
}

export async function fetchSystemVocabWords({
  source_lang = "en",
  category = null,
  word_type = "all",
  search = "",
  limit = 50,
  offset = 0,
} = {}) {
  try {
    const params = new URLSearchParams({
      source_lang: source_lang || "en",
      limit: String(limit),
      offset: String(offset),
    });
    if (category) params.append("category", category);
    if (word_type && word_type !== "all") params.append("word_type", word_type);
    if (search && search.trim()) params.append("search", search.trim());

    const res = await fetch(`${API_BASE}/words?${params.toString()}`);
    if (!res.ok) throw new Error("Không thể tải danh sách từ vựng");
    return await res.json();
  } catch (err) {
    console.error("fetchSystemVocabWords error:", err);
    return { items: [], total: 0, limit, offset };
  }
}

export async function fetchUserSavedWords(token = null) {
  try {
    if (!token) return { saved_words: [] };
    const res = await fetch(`${API_BASE}/user-saved-words`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { saved_words: [] };
    return await res.json();
  } catch (err) {
    return { saved_words: [] };
  }
}

export async function importSystemVocabToNotebook(vocabIds = [], token = null) {
  if (!token) throw new Error("Vui lòng đăng nhập để lưu từ vựng vào Sổ tay");
  if (!vocabIds || vocabIds.length === 0) throw new Error("Chưa chọn từ vựng nào");

  const res = await fetch(`${API_BASE}/import-to-notebook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ vocab_ids: vocabIds }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Không thể thêm từ vào sổ tay");
  }
  return data;
}

export async function fetchSystemDistractors(sourceLang = "en", count = 30) {
  try {
    const res = await fetch(`${API_BASE}/distractors?source_lang=${encodeURIComponent(sourceLang)}&count=${count}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.distractors || [];
  } catch {
    return [];
  }
}

// ==========================================
// ADMIN API CALLS
// ==========================================
export async function adminCreateSystemVocab(vocabData, token) {
  const res = await fetch(`${API_BASE}/admin/words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vocabData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Không thể tạo từ mới");
  return data;
}

export async function adminUpdateSystemVocab(id, vocabData, token) {
  const res = await fetch(`${API_BASE}/admin/words/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(vocabData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Không thể cập nhật từ");
  return data;
}

export async function adminDeleteSystemVocab(id, token) {
  const res = await fetch(`${API_BASE}/admin/words/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Không thể xóa từ");
  return data;
}

export async function adminReseedSystemVocab(token) {
  const res = await fetch(`${API_BASE}/admin/reseed`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Không thể nạp dữ liệu ngân hàng");
  return data;
}

