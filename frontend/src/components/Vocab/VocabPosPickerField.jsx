import React from "react";
import { POS_CATALOG, togglePosInList } from "../../utils/wordLookupUtils";

export const VocabPosPickerField = ({ value = "", onChange }) => {
  return (
    <div style={{ marginTop: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", flexWrap: "wrap", gap: "4px" }}>
        <label className="edit-vocab-label" style={{ fontSize: "0.76rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
          Từ loại (Part of Speech)
        </label>
        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
          {POS_CATALOG.slice(0, 6).map((p) => {
            const isSel = (value || "").toLowerCase().includes(p.key);
            return (
              <button
                key={p.key}
                type="button"
                className="edit-vocab-pos-btn"
                onClick={() => onChange(togglePosInList(value, p.key))}
                style={{
                  fontSize: "0.62rem",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: isSel ? "var(--primary, #6366f1)" : "var(--border-color, #e2e8f0)",
                  background: isSel ? "var(--primary, #6366f1)" : "transparent",
                  color: isSel ? "#fff" : "var(--text-secondary, #64748b)",
                  cursor: "pointer",
                  lineHeight: "1.2",
                }}
              >
                {p.vi}
              </button>
            );
          })}
        </div>
      </div>
      <input
        type="text"
        className="dict-input edit-vocab-pos-input"
        style={{
          width: "100%",
          padding: "5px 10px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid var(--border-color, #e2e8f0)",
          background: "var(--bg-input, #fff)",
          color: "var(--text-primary, #0f172a)",
          fontSize: "0.8rem",
          boxSizing: "border-box",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="noun, verb, adjective, phrase..."
      />
    </div>
  );
};
