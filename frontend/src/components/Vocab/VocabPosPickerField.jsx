import React from "react";
import { POS_CATALOG, togglePosInList } from "../../utils/wordLookupUtils";

export const VocabPosPickerField = ({ value = "", onChange }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <label style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-primary, #1e293b)" }}>
          Từ loại (Part of Speech)
        </label>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
          {POS_CATALOG.slice(0, 6).map((p) => {
            const isSel = (value || "").toLowerCase().includes(p.key);
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onChange(togglePosInList(value, p.key))}
                style={{
                  fontSize: "0.68rem",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: isSel ? "var(--primary, #6366f1)" : "var(--border-color, #e2e8f0)",
                  background: isSel ? "var(--primary, #6366f1)" : "transparent",
                  color: isSel ? "#fff" : "var(--text-secondary, #64748b)",
                  cursor: "pointer",
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
        className="dict-input"
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color, #e2e8f0)",
          background: "var(--bg-input, #fff)",
          color: "var(--text-primary, #0f172a)",
          fontSize: "0.88rem",
          boxSizing: "border-box",
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="noun, verb, adjective... (hoặc bấm chọn nhanh ở trên)"
      />
    </div>
  );
};
