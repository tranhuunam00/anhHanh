import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createVocabWord } from "../../services/authVocabService";
import { splitContextSentence } from "../../utils/textNormalizer";

export const FloatingVocabSaver = ({ currentSentence = "", currentVideoId = "", currentTimestamp = 0 }) => {
  const { token, refreshStreak, showToast } = useAuth();
  const [position, setPosition] = useState(null);
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length > 120 || text.includes("\n")) {
        setPosition(null);
        setSelectedWord("");
        setSelectedSentence("");
        return;
      }

      // Check if range is inside exercise or transcript
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Extract exact parent sentence of the highlighted text
      let extractedSentence = "";
      if (range && range.commonAncestorContainer) {
        const node = range.commonAncestorContainer;
        const element = node.nodeType === 3 ? node.parentElement : node;
        const sentenceEl = element.closest(
          ".sentence-card, .sentence-item, .transcript-item, .transcript-sentence, .dictation-sentence-text, .transcript-line, p, li"
        );
        if (sentenceEl) {
          const origEl = sentenceEl.querySelector(".transcript-en, .transcript-orig, .orig-text, .sentence-en, [data-lang='en']");
          const transEl = sentenceEl.querySelector(".transcript-vi, .transcript-trans, .vi-text, .sentence-vi, [data-lang='vi']");
          if (origEl && transEl) {
            const orig = (origEl.innerText || origEl.textContent || "").trim();
            const trans = (transEl.innerText || transEl.textContent || "").trim();
            if (orig) {
              extractedSentence = trans ? `${orig}\n${trans}` : orig;
            }
          }
          if (!extractedSentence) {
            const rawText = sentenceEl.innerText || sentenceEl.textContent || "";
            const cleanText = rawText
              .replace(/^\[\d{2}:\d{2}\s*-\s*\d{2}:\d{2}\]\s*/, "")
              .replace(/Luyện câu này\s*➔?/gi, "")
              .trim();
            const { orig, trans } = splitContextSentence(cleanText);
            extractedSentence = trans ? `${orig}\n${trans}` : (orig || cleanText);
          }
        }
      }

      setSelectedSentence(extractedSentence || currentSentence || "");
      setPosition({
        top: rect.top + window.scrollY - 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
      setSelectedWord(text);
    };

    const handleMouseDown = (e) => {
      if (e.target.closest(".floating-vocab-btn")) return;
      setPosition(null);
      setSelectedWord("");
      setSelectedSentence("");
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [currentSentence]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedWord || isSaving) return;

    setIsSaving(true);
    showToast(`Đang tìm nghĩa & ảnh AI cho "${selectedWord}"...`, "info");

    try {
      await createVocabWord(
        {
          word: selectedWord,
          context_sentence: selectedSentence || currentSentence || "",
          video_id: currentVideoId || "",
          timestamp: currentTimestamp || 0,
        },
        token
      );
      showToast(`✨ Đã lưu "${selectedWord}" vào Sổ tay từ vựng!`, "success");
      refreshStreak();
      setPosition(null);
      setSelectedWord("");
      setSelectedSentence("");
      window.getSelection()?.removeAllRanges();
    } catch (err) {
      showToast(err.message || "Không thể lưu từ này", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!position || !selectedWord) return null;

  return (
    <button
      className="floating-vocab-btn"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={handleSave}
      disabled={isSaving}
    >
      <span>✨</span>
      <span>{isSaving ? "Đang lưu..." : `Lưu "${selectedWord}"`}</span>
    </button>
  );
};
