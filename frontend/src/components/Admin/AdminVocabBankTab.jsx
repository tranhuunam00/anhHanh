import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Pencil,
  Volume2,
  Layers,
  ChevronDown,
  Globe,
  X,
  Check,
  AlertCircle,
} from "../Icons";
import {
  fetchVocabCategories,
  fetchSystemVocabWords,
  adminCreateSystemVocab,
  adminUpdateSystemVocab,
  adminDeleteSystemVocab,
} from "../../services/systemVocabService";
import { getVoiceLang } from "../../utils/languageVoices";

export const AdminVocabBankTab = ({ token, showToast }) => {
  const [categories, setCategories] = useState([]);
  const [selectedLang, setSelectedLang] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWordType, setSelectedWordType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const [words, setWords] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Modal create / edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    word: "",
    phonetic: "",
    meaning: "",
    context_sentence: "",
    source_lang: "en",
    category: "politics_diplomacy",
    word_type: "single_word",
    level: "B1",
  });

  // 1. Fetch categories
  useEffect(() => {
    (async () => {
      const res = await fetchVocabCategories();
      if (res?.categories) setCategories(res.categories);
    })();
  }, []);

  // 2. Fetch words
  const loadWords = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchSystemVocabWords({
        source_lang: selectedLang === "all" ? null : selectedLang,
        category: selectedCategory || null,
        word_type: selectedWordType,
        search: searchQuery,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });
      setWords(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      showToast(err.message || "Lỗi khi tải dữ liệu ngân hàng", "error");
    } finally {
      setIsLoading(false);
    }
  }, [selectedLang, selectedCategory, selectedWordType, searchQuery, page, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadWords();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadWords]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      word: "",
      phonetic: "",
      meaning: "",
      context_sentence: "",
      source_lang: selectedLang === "all" ? "en" : selectedLang,
      category: selectedCategory || "politics_diplomacy",
      word_type: "single_word",
      level: "B1",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      word: item.word,
      phonetic: item.phonetic || "",
      meaning: item.meaning,
      context_sentence: item.context_sentence || "",
      source_lang: item.source_lang,
      category: item.category,
      word_type: item.word_type,
      level: item.level || "B1",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, wordText) => {
    if (!window.confirm(`Bạn có chắc muốn xóa từ "${wordText}" khỏi ngân hàng hệ thống?`)) return;
    try {
      await adminDeleteSystemVocab(id, token);
      showToast(`Đã xóa từ "${wordText}"`, "info");
      loadWords();
    } catch (err) {
      showToast(err.message || "Lỗi khi xóa từ", "error");
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning.trim()) {
      showToast("Vui lòng nhập đầy đủ từ vựng và nghĩa", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await adminUpdateSystemVocab(editingItem.id, formData, token);
        showToast(`Đã cập nhật từ "${formData.word}"`, "success");
      } else {
        await adminCreateSystemVocab(formData, token);
        showToast(`Đã thêm mới từ "${formData.word}" vào ngân hàng`, "success");
      }
      setIsModalOpen(false);
      loadWords();
    } catch (err) {
      showToast(err.message || "Lỗi khi lưu từ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const speak = (word, lang) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && word) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(word);
      utter.lang = getVoiceLang(lang, word);
      window.speechSynthesis.speak(utter);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top action & filter bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text-primary)" }}>
            Ngân Hàng Từ Vựng Hệ Thống (Curated Vocab Bank)
          </h3>
          <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Tổng cộng: <strong>{total} từ vựng</strong> • 30 chủ đề (Tiếng Anh &amp; Tiếng Pháp)
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "10px", padding: "8px 16px" }}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Thêm từ mới vào ngân hàng</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", background: "var(--bg-secondary)", padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        {/* Language */}
        <select
          value={selectedLang}
          onChange={(e) => { setSelectedLang(e.target.value); setPage(1); }}
          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.84rem" }}
        >
          <option value="all">Tất cả ngôn ngữ</option>
          <option value="en">Tiếng Anh (EN)</option>
          <option value="fr">Tiếng Pháp (FR)</option>
        </select>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.84rem", minWidth: "220px" }}
        >
          <option value="">Tất cả 30 chủ đề</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_vi} ({c.name_en})
            </option>
          ))}
        </select>

        {/* Word Type */}
        <select
          value={selectedWordType}
          onChange={(e) => { setSelectedWordType(e.target.value); setPage(1); }}
          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.84rem" }}
        >
          <option value="all">Tất cả dạng từ</option>
          <option value="single_word">Từ đơn</option>
          <option value="phrase">Cụm từ</option>
        </select>

        {/* Search Box */}
        <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
          <input
            type="text"
            placeholder="Tìm theo từ hoặc nghĩa..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={{ width: "100%", padding: "6px 12px 6px 30px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: "0.84rem" }}
          />
          <Search size={14} style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        </div>
      </div>

      {/* Words Table */}
      <div style={{ overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: "12px", background: "var(--bg-card)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
              <th style={{ padding: "10px 14px" }}>Từ / Cụm từ</th>
              <th style={{ padding: "10px 14px" }}>Phiên âm IPA</th>
              <th style={{ padding: "10px 14px" }}>Nghĩa tiếng Việt</th>
              <th style={{ padding: "10px 14px" }}>Chủ đề</th>
              <th style={{ padding: "10px 14px" }}>Loại / Level</th>
              <th style={{ padding: "10px 14px", textAlign: "right" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                  Đang tải dữ liệu ngân hàng...
                </td>
              </tr>
            ) : words.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                  Không tìm thấy từ vựng nào phù hợp.
                </td>
              </tr>
            ) : (
              words.map((w) => (
                <tr key={w.id} style={{ borderBottom: "1px solid var(--border-color)" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--text-primary)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>{w.word}</span>
                      <button
                        type="button"
                        onClick={() => speak(w.word, w.source_lang)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 2 }}
                        title="Nghe phát âm"
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "var(--primary)" }}>
                    {w.phonetic || "-"}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#059669", fontWeight: 600 }}>
                    {w.meaning}
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--text-secondary)" }}>
                    <span style={{ fontSize: "0.74rem", background: "var(--bg-secondary)", padding: "2px 6px", borderRadius: "6px" }}>
                      {w.category}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: "0.72rem", background: w.word_type === "phrase" ? "rgba(168, 85, 247, 0.1)" : "rgba(37, 99, 235, 0.1)", color: w.word_type === "phrase" ? "#9333ea" : "var(--primary)", padding: "2px 6px", borderRadius: "6px", marginRight: 4, fontWeight: 700 }}>
                      {w.word_type === "phrase" ? "Cụm từ" : "Từ đơn"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{w.level}</span>
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px" }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(w)}
                        style={{ background: "transparent", border: "1px solid var(--border-color)", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", color: "var(--text-secondary)" }}
                        title="Chỉnh sửa từ"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(w.id, w.word)}
                        style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", color: "var(--danger, #ef4444)" }}
                        title="Xóa từ"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Trang {page} / {totalPages} (Tổng: {total} từ)
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="btn btn-secondary"
              style={{ padding: "4px 10px", fontSize: "0.78rem" }}
            >
              Trước
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="btn btn-secondary"
              style={{ padding: "4px 10px", fontSize: "0.78rem" }}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ background: "var(--bg-card)", borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "540px", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
                {editingItem ? "Chỉnh Sửa Từ Vựng Ngân Hàng" : "Thêm Từ Mới Vào Ngân Hàng"}
              </h4>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Từ / Cụm từ (*)</label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.88rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Phiên âm IPA</label>
                  <input
                    type="text"
                    value={formData.phonetic}
                    onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
                    placeholder="/.../"
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.88rem" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Ngôn ngữ</label>
                  <select
                    value={formData.source_lang}
                    onChange={(e) => setFormData({ ...formData, source_lang: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.88rem" }}
                  >
                    <option value="en">Tiếng Anh (en)</option>
                    <option value="fr">Tiếng Pháp (fr)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Nghĩa tiếng Việt (*)</label>
                <input
                  type="text"
                  required
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.88rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Chủ đề (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem" }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_vi}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Dạng từ</label>
                  <select
                    value={formData.word_type}
                    onChange={(e) => setFormData({ ...formData, word_type: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem" }}
                  >
                    <option value="single_word">Từ đơn</option>
                    <option value="phrase">Cụm từ</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Câu ví dụ ngữ cảnh (kèm dịch câu)</label>
                <textarea
                  rows={2}
                  value={formData.context_sentence}
                  onChange={(e) => setFormData({ ...formData, context_sentence: e.target.value })}
                  placeholder="Example sentence [Dịch câu tiếng Việt]"
                  style={{ width: "100%", padding: "7px 10px", borderRadius: "8px", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.84rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ padding: "6px 14px" }}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: "6px 16px" }}>
                  {isSubmitting ? "Đang lưu..." : editingItem ? "Lưu thay đổi" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
