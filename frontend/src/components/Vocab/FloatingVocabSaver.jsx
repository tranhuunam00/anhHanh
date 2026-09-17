import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createVocabWord } from "../../services/authVocabService";

export const FloatingVocabSaver = ({ currentSentence = "", currentVideoId = "", currentTimestamp = 0 }) => {
  const { token, refreshStreak, showToast } = useAuth();
  const [position, setPosition] = useState(null);
  const [selectedWord, setSelectedWord] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length > 50 || text.includes("\n")) {
        setPosition(null);
        setSelectedWord("");
        return;
      }

      // Check if range is inside exercise or transcript
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

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
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

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
          context_sentence: currentSentence || "",
          video_id: currentVideoId || "",
          timestamp: currentTimestamp || 0,
        },
        token
      );
      showToast(`✨ Đã lưu "${selectedWord}" vào Sổ tay từ vựng!`, "success");
      refreshStreak();
      setPosition(null);
      setSelectedWord("");
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
