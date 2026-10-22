import React from "react";
import { Pencil, X } from "../Icons";

export const EditVocabModalHeader = ({ onClose }) => (
  <div className="modal-header" style={{ padding: "16px 20px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2))",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6366f1",
        }}
      >
        <Pencil size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="modal-title" style={{ margin: 0, fontSize: "1.1rem" }}>
          Chỉnh sửa thẻ từ vựng
        </h3>
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>
          Cập nhật từ gốc, phiên âm IPA, nghĩa tiếng Việt và link ảnh
        </div>
      </div>
    </div>
    <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Đóng">
      <X size={18} strokeWidth={2} />
    </button>
  </div>
);
