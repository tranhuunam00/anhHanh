import React from "react";
import {
  RotateCw,
  Volume2,
  Trash2,
  CheckCircle2,
  Pencil,
  ExternalLink,
  Mic,
} from "../Icons";
import { splitContextSentence } from "../../utils/textNormalizer";
import { formatPosDisplay } from "../../utils/wordLookupUtils";

const formatCleanIpa = (raw) => {
  if (!raw) return "";
  let clean = raw.trim();
  clean = clean.replace(/^[\[\/]+|[\]\/]+$/g, "").trim();
  clean = clean.replace(/['’]/g, "ˈ").replace(/\s+/g, " ");
  return `/${clean}/`;
};

/**
 * Individual Card component for Vocabulary Notebook
 * Supports keyboard navigation focus highlighting and inline actions
 */
export const VocabCard = ({
  vocab,
  isFocused = false,
  cardRef = null,
  onClick = null,
  onRotateImage,
  onEdit,
  onSpeak,
  onRefreshMeaning,
  refreshingMeaningId,
  onStatusChange,
  onDelete,
  listeningWordId,
  pronounceResults = {},
  onStartPronouncePractice,
}) => {
  const v = vocab;
  if (!v) return null;

  return (
    <div
      ref={cardRef}
      className={`vocab-card ${isFocused ? "is-keyboard-focused" : ""}`}
      onClick={onClick}
      tabIndex={0}
      role="article"
      aria-label={`Từ vựng: ${v.word}`}
      style={{
        position: "relative",
        cursor: "pointer",
        outline: isFocused ? "none" : undefined,
      }}
    >
      {/* Keyboard selection pill badge */}
      {isFocused && (
        <div className="vocab-card-focus-indicator" title="Đang chọn bằng phím - Enter: Chi tiết | 1,2,3: Đổi trạng thái | Space: Phát âm">
          <span className="focus-dot" />
          <span>Đang chọn</span>
        </div>
      )}

      {/* Image Thumbnail & Quick Image Controls */}
      <div className="vocab-card-img-wrap">
        <img
          src={
            v.image_url ||
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80"
          }
          className="vocab-card-img"
          alt={v.word}
          loading="lazy"
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            display: "flex",
            gap: "6px",
            zIndex: 2,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="vocab-img-rotate-btn"
            onClick={() => onRotateImage(v.id, v.word, v.image_url, v.context_sentence)}
            title="Tìm ảnh minh họa khác theo ngữ cảnh"
          >
            <RotateCw size={13} style={{ marginRight: 4 }} />
            Đổi ảnh
          </button>
          <button
            type="button"
            className="vocab-img-rotate-btn"
            onClick={() => onEdit(v)}
            title="Chỉnh sửa chi tiết từ vựng, link ảnh, phiên âm & nghĩa"
            style={{ background: "rgba(15, 23, 42, 0.82)" }}
          >
            <Pencil size={12} style={{ marginRight: 4 }} />
            Sửa
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="vocab-card-body">
        {/* Row: Word Text & Part of Speech */}
        <div className="vocab-word-row">
          <span className="vocab-word-text">{v.word}</span>
          {v.part_of_speech && (
            <span className="vocab-pos-badge-card" title={`Từ loại: ${v.part_of_speech}`}>
              {formatPosDisplay(v.part_of_speech, "vi")}
            </span>
          )}
        </div>

        {/* Phonetic Pronunciation Row */}
        {v.phonetic && (
          <div className="vocab-pronunciation-row">
            <span className="vocab-pron-tag">{(v.source_lang || "en").toUpperCase()}</span>
            <button
              type="button"
              className="vocab-pron-speaker-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(v.word, v.source_lang);
              }}
              title={`Nghe phát âm (${(v.source_lang || "en").toUpperCase()}) - Phím tắt: Space`}
            >
              <Volume2 size={13} strokeWidth={2.2} />
            </button>
            <span className="vocab-pron-ipa-text">
              {formatCleanIpa(v.phonetic)}
            </span>
          </div>
        )}

        {/* Vietnamese Meaning Text */}
        <div className="vocab-meaning-text">
          {v.meaning && v.meaning.toLowerCase().trim() !== v.word.toLowerCase().trim() ? (
            v.meaning
          ) : (
            <span style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
              <span style={{ color: "var(--text-secondary, #94a3b8)", fontStyle: "italic", fontSize: "0.8em" }}>
                Chưa có nghĩa tiếng Việt
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRefreshMeaning(v.id);
                }}
                disabled={refreshingMeaningId === v.id}
                style={{
                  fontSize: "0.68rem",
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: "var(--primary, #6366f1)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  opacity: refreshingMeaningId === v.id ? 0.6 : 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                }}
                title="Lấy nghĩa tiếng Việt cho từ này"
              >
                <RotateCw size={10} className={refreshingMeaningId === v.id ? "spinning" : ""} />
                <span>{refreshingMeaningId === v.id ? "Đang lấy..." : "Lấy nghĩa VN"}</span>
              </button>
            </span>
          )}
        </div>

        {/* Context Sentence */}
        {v.context_sentence && (() => {
          const { orig, trans } = splitContextSentence(v.context_sentence);
          return (
            <div
              className="vocab-context-box"
              title={orig ? `"${orig.replace(/^"+|"+$/g, "")}"` : undefined}
            >
              {orig && (
                <div className="vocab-context-orig">
                  "{orig.replace(/^"+|"+$/g, "")}"
                </div>
              )}
              {trans && (
                <div className="vocab-context-trans">
                  {trans.replace(/^"+|"+$/g, "")}
                </div>
              )}
            </div>
          );
        })()}

        {/* Pronunciation Practice Result Badge */}
        {pronounceResults[v.id] && (
          <div
            className={`pronounce-result-badge ${pronounceResults[v.id].isMatch ? "success" : "retry"}`}
          >
            {pronounceResults[v.id].isMatch ? (
              <>
                <CheckCircle2 size={13} />
                <span>Chuẩn 100%! ("{pronounceResults[v.id].heard}")</span>
              </>
            ) : (
              <>
                <Volume2 size={13} />
                <span>Nghe thành: "{pronounceResults[v.id].heard}" - Thử lại</span>
              </>
            )}
          </div>
        )}
        {listeningWordId === v.id && (
          <div
            className="pronounce-result-badge retry"
            style={{ background: "rgba(239, 68, 68, 0.1)", color: "#dc2626", border: "1px solid rgba(239, 68, 68, 0.3)" }}
          >
            <Mic size={13} className="spinner" />
            <span>Đang lắng nghe bạn nói...</span>
          </div>
        )}

        {/* Footer: Status select and Quick Action Buttons */}
        <div className="vocab-card-footer" onClick={(e) => e.stopPropagation()}>
          <select
            className={`vocab-status-select status-${v.status}`}
            value={v.status}
            onChange={(e) => onStatusChange(v.id, e.target.value)}
            title="Đổi trạng thái học tập (Phím tắt: 1: Mới lưu | 2: Đang nhớ | 3: Đã thuộc | S: Đổi tiếp)"
          >
            <option value="NEW">Mới lưu (1)</option>
            <option value="LEARNING">Đang nhớ (2)</option>
            <option value="MASTERED">Đã thuộc (3)</option>
          </select>

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              type="button"
              className="vocab-audio-btn"
              onClick={() => onSpeak(v.word, v.source_lang)}
              title="Phát âm từ này (Audio) - Phím tắt: Space hoặc Ctrl"
            >
              <Volume2 size={14} strokeWidth={2} />
            </button>

            {(v.source_lang || "en").toLowerCase() === "en" ? (
              <a
                className="vocab-audio-btn"
                href={`https://dictionary.cambridge.org/vi/dictionary/english/${encodeURIComponent(
                  (v.word || "")
                    .toLowerCase()
                    .trim()
                    .replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "")
                    .replace(/[\s_]+/g, "-")
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title={`Tra "${v.word}" trên Cambridge Dictionary`}
                style={{
                  color: "var(--primary, #6366f1)",
                  textDecoration: "none",
                }}
              >
                <ExternalLink size={14} strokeWidth={2.2} />
              </a>
            ) : (
              <button
                type="button"
                className={`vocab-audio-btn ${listeningWordId === v.id ? "listening" : ""}`}
                onClick={() => onStartPronouncePractice(v)}
                title="Luyện phát âm qua Micro (AI nhận diện giọng nói)"
                style={{
                  color: listeningWordId === v.id ? "#dc2626" : "#6366f1",
                  background: listeningWordId === v.id ? "rgba(239, 68, 68, 0.15)" : undefined,
                }}
              >
                <Mic size={14} strokeWidth={2.2} />
              </button>
            )}

            <button
              type="button"
              className="vocab-audio-btn"
              style={{ color: "#2563eb" }}
              onClick={() => onEdit(v)}
              title="Chỉnh sửa từ vựng, phiên âm, nghĩa & ảnh - Phím tắt: Enter"
            >
              <Pencil size={13} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              className="vocab-audio-btn"
              style={{ color: "#dc2626" }}
              onClick={() => onDelete(v.id)}
              title="Xóa từ khỏi sổ tay"
            >
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
