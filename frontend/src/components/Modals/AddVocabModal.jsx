import React, { useState } from "react";
import { Plus, X, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createVocabWord } from "../../services/authVocabService";

export const AddVocabModal = ({ isOpen, onClose, onSuccess }) => {
  const { token, refreshStreak, refreshSavedVocab, showToast } = useAuth();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [contextSentence, setContextSentence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanWord = word.trim();
    if (!cleanWord) {
      showToast("Vui lòng nhập từ vựng tiếng Anh", "warning");
      return;
    }

    if (!token) {
      showToast("Vui lòng đăng nhập để lưu từ vựng", "warning");
      return;
    }

    setIsSubmitting(true);
    showToast(`Đang tìm nghĩa, phiên âm & ảnh minh họa cho "${cleanWord}"...`, "info");

    try {
      await createVocabWord(
        {
          word: cleanWord,
          meaning: meaning.trim() || undefined,
          context_sentence: contextSentence.trim() || "",
          source_lang: "en",
          target_lang: "vi",
        },
        token
      );

      showToast(`✨ Đã thêm "${cleanWord}" vào Sổ tay từ vựng!`, "success");
      setWord("");
      setMeaning("");
      setContextSentence("");
      if (refreshStreak) refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || "Không thể thêm từ này", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div
        className="settings-modal add-vocab-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "480px",
          maxWidth: "92vw",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: "1.1rem" }}>
                Thêm từ mới thủ công
              </h3>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>
                Hệ thống tự động tìm phiên âm IPA, nghĩa & ảnh AI
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Đóng">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-primary, #1e293b)",
                marginBottom: "6px",
              }}
            >
              Từ vựng tiếng Anh <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              className="dict-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color, #e2e8f0)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              placeholder="Ví dụ: resilience, perseverance..."
              value={word}
              onChange={(e) => setWord(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-primary, #1e293b)",
                }}
              >
                Nghĩa tiếng Việt (Tùy chọn)
              </label>
              <span style={{ fontSize: "0.75rem", color: "#6366f1", display: "flex", alignItems: "center", gap: "3px" }}>
                <Sparkles size={12} /> Tự động dịch nếu để trống
              </span>
            </div>
            <input
              type="text"
              className="dict-input"
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color, #e2e8f0)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
              placeholder="Ví dụ: sự kiên cường, bền bỉ..."
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-primary, #1e293b)",
                marginBottom: "6px",
              }}
            >
              Câu ví dụ minh họa (Tùy chọn)
            </label>
            <textarea
              className="dict-input"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--border-color, #e2e8f0)",
                background: "var(--bg-input, #fff)",
                color: "var(--text-primary, #0f172a)",
                fontSize: "0.9rem",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              placeholder="Ví dụ: She showed remarkable resilience throughout the challenging project."
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ padding: "9px 18px", borderRadius: "8px" }}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-with-icon"
              style={{
                padding: "9px 20px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                border: "none",
                fontWeight: 600,
              }}
              disabled={isSubmitting || !word.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Lưu từ vựng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
