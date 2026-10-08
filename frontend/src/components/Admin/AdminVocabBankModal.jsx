import React from "react";
import { X } from "../Icons";

export const AdminVocabBankModal = ({
  isOpen,
  onClose,
  editingItem,
  formData,
  setFormData,
  onSubmit,
  isSubmitting,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          maxWidth: "540px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>
            {editingItem ? "Chỉnh Sửa Từ Vựng Ngân Hàng" : "Thêm Từ Mới Vào Ngân Hàng"}
          </h4>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Từ / Cụm từ (*)</label>
            <input
              type="text"
              required
              value={formData.word}
              onChange={(e) => setFormData({ ...formData, word: e.target.value })}
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.88rem",
              }}
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
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.88rem",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Ngôn ngữ</label>
              <select
                value={formData.source_lang}
                onChange={(e) => setFormData({ ...formData, source_lang: e.target.value })}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.88rem",
                }}
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
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.88rem",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>Chủ đề (Category)</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.84rem",
                }}
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
                style={{
                  width: "100%",
                  padding: "7px 10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  fontSize: "0.84rem",
                }}
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
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                fontSize: "0.84rem",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ padding: "6px 14px" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ padding: "6px 16px" }}
            >
              {isSubmitting ? "Đang lưu..." : editingItem ? "Lưu thay đổi" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
