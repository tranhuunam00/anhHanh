import React from "react";
import { POS_CATALOG, togglePosInList } from "../../utils/wordLookupUtils";

export const VocabPosPickerField = ({ value = "", onChange }) => {
  return (
    <div className="edit-vocab-pos-wrapper">
      <div className="edit-vocab-field-header edit-vocab-pos-header">
        <label className="edit-vocab-label">
          <span className="btn-label-desktop">Từ loại (Part of Speech)</span>
          <span className="btn-label-mobile">Từ loại</span>
        </label>
        <div className="edit-vocab-pos-chips">
          {POS_CATALOG.slice(0, 6).map((p) => {
            const isSel = (value || "").toLowerCase().includes(p.key);
            return (
              <button
                key={p.key}
                type="button"
                className={`edit-vocab-pos-btn ${isSel ? "active" : ""}`}
                onClick={() => onChange(togglePosInList(value, p.key))}
              >
                {p.vi}
              </button>
            );
          })}
        </div>
      </div>
      <input
        type="text"
        className="dict-input edit-vocab-input edit-vocab-pos-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="noun, verb, adjective, phrase..."
      />
    </div>
  );
};
