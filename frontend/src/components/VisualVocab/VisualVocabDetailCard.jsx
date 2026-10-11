import React, { useState } from "react";
import {
  Volume2,
  BookmarkPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "../Icons";
import { playPronunciationAudio, createVocabWord } from "../../services/authVocabService";

export const VisualVocabDetailCard = ({
  activeItem,
  onSelectPrev,
  onSelectNext,
  hasPrev,
  hasNext,
  currentIndex = 0,
  totalItems = 0,
  token = null,
  onWordSaved,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!activeItem) {
    return (
      <div className="vv-detail-card" style={{ textAlign: "center", padding: "32px 16px" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
          💡 Chạm hoặc click vào một điểm ghim trên sơ đồ để xem chi tiết từ vựng và nghe phát âm.
        </p>
      </div>
    );
  }

  const handlePlayAudio = (accent = "us") => {
    if (!activeItem.word) return;
    setIsPlayingAudio(true);
    playPronunciationAudio(activeItem.word, accent)
      .catch((e) => console.warn("TTS play error:", e))
      .finally(() => setIsPlayingAudio(false));
  };

  const handleSaveToNotebook = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        word: activeItem.word,
        meaning: activeItem.meaning,
        phonetic: activeItem.ipa || "",
        pos: activeItem.pos || "noun",
        context_sentence: activeItem.example || "",
        source_lang: "en",
        target_lang: "vi",
      };
      await createVocabWord(payload, token);
      setIsSaved(true);
      if (onWordSaved) onWordSaved(activeItem.id);
    } catch (e) {
      console.error("Save vocab error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="vv-detail-card">
      {/* Top row: Word name, IPA and Audio buttons */}
      <div className="vv-detail-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="vv-detail-word">{activeItem.word}</h3>
            {activeItem.pos && (
              <span className="vv-detail-pos-badge">{activeItem.pos}</span>
            )}
          </div>
          {activeItem.ipa && <div className="vv-detail-ipa">{activeItem.ipa}</div>}
        </div>

        <div className="vv-detail-actions">
          <button
            type="button"
            className="vv-audio-btn"
            onClick={() => handlePlayAudio("us")}
            title="Nghe phát âm chuẩn US"
            disabled={isPlayingAudio}
          >
            <Volume2 size={18} />
          </button>
        </div>
      </div>

      {/* Meaning Box */}
      <div className="vv-meaning-box">
        <div className="vv-meaning-label">Nghĩa Tiếng Việt</div>
        <p className="vv-meaning-text">{activeItem.meaning}</p>
      </div>

      {/* Example Sentence */}
      {activeItem.example && (
        <div className="vv-example-box">
          <p className="vv-example-text">"{activeItem.example}"</p>
        </div>
      )}

      {/* Save to Notebook Button */}
      <button
        type="button"
        className={`vv-save-vocab-btn ${isSaved ? "saved" : ""}`}
        onClick={handleSaveToNotebook}
        disabled={isSaved || isSaving}
      >
        {isSaved ? (
          <>
            <Check size={16} /> Đã lưu vào sổ từ vựng
          </>
        ) : (
          <>
            <BookmarkPlus size={16} /> Lưu vào sổ từ vựng
          </>
        )}
      </button>

      {/* Nav Row: Previous & Next */}
      <div className="vv-card-nav-row">
        <button
          type="button"
          className="vv-card-nav-btn"
          onClick={onSelectPrev}
          disabled={!hasPrev}
          title="Từ trước đó"
        >
          <ChevronLeft size={16} /> Trước
        </button>

        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: 600 }}>
          {currentIndex + 1} / {totalItems}
        </span>

        <button
          type="button"
          className="vv-card-nav-btn"
          onClick={onSelectNext}
          disabled={!hasNext}
          title="Từ tiếp theo"
        >
          Tiếp <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
