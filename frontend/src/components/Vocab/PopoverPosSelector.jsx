import React, { useState } from "react";
import {
  POS_CATALOG,
  parsePosTokens,
  formatPosDisplay,
  togglePosInList,
} from "../../utils/wordLookupUtils";
import { Check, Pencil, Plus, ChevronDown, ChevronUp } from "../Icons";

export const PopoverPosSelector = ({
  partOfSpeech = "",
  onChangePos,
  cleanWord = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const activeTokens = parsePosTokens(partOfSpeech);
  const isPhrase = cleanWord && cleanWord.includes(" ");

  const handleToggle = (posKey) => {
    const updated = togglePosInList(partOfSpeech, posKey);
    onChangePos(updated);
  };

  const handleAddCustom = (e) => {
    e.preventDefault();
    const clean = customInput.trim();
    if (!clean) return;
    const updated = togglePosInList(partOfSpeech, clean);
    onChangePos(updated);
    setCustomInput("");
  };

  return (
    <div className="lookup-pos-wrapper">
      <div className="lookup-pos-header-row">
        <div className="lookup-pos-chips">
          {activeTokens.length > 0 ? (
            activeTokens.map((token) => (
              <span
                key={token}
                className="lookup-pos-badge active"
                onClick={() => setIsOpen(!isOpen)}
                title="Bấm để chỉnh sửa từ loại"
              >
                {formatPosDisplay(token, "vi")}
              </span>
            ))
          ) : (
            <button
              type="button"
              className="lookup-pos-badge empty"
              onClick={() => setIsOpen(!isOpen)}
              title="Chọn từ loại cho từ này"
            >
              <Plus size={11} style={{ marginRight: 2 }} />
              {isPhrase ? "cụm từ" : "+ từ loại"}
            </button>
          )}

          <button
            type="button"
            className="lookup-pos-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            title={isOpen ? "Thu gọn chọn từ loại" : "Đổi hoặc chọn nhiều từ loại"}
          >
            {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lookup-pos-dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="lookup-pos-hint">
            Chọn 1 hoặc nhiều loại từ (hỗ trợ mọi ngôn ngữ):
          </div>

          <div className="lookup-pos-grid">
            {POS_CATALOG.map((item) => {
              const isSelected = activeTokens.some(
                (t) => t.toLowerCase() === item.key.toLowerCase() || t.toLowerCase() === item.vi.toLowerCase()
              );
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`lookup-pos-chip-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => handleToggle(item.key)}
                >
                  {isSelected && <Check size={11} style={{ marginRight: 3 }} />}
                  <span>{item.vi}</span>
                  <span className="lookup-pos-abbr">({item.abbr})</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleAddCustom} className="lookup-pos-custom-row">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Khác (Pháp, Nhật, Đức...)"
              className="lookup-pos-custom-input"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="lookup-pos-custom-submit-btn"
            >
              Thêm
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lookup-pos-done-btn"
            >
              Xong
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
