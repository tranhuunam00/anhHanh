import React, { useState, useRef, useEffect } from "react";
import { Volume2, CheckCircle2, BookOpen, Clock, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const STATUS_MAP = {
  NEW: { label: "Mới lưu", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)" },
  LEARNING: { label: "Đang học", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
  MASTERED: { label: "Đã thuộc", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
};

export const HighlightedVocabSentence = ({ text, className = "" }) => {
  const { savedVocabMap } = useAuth();
  const [activeWordInfo, setActiveWordInfo] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef(null);

  const handleSpeak = (wordToSpeak, e) => {
    if (e) e.stopPropagation();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(wordToSpeak);
      utter.lang = "en-US";
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };

  const handleMouseEnter = (item, e) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    });
    setActiveWordInfo(item);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveWordInfo(null);
    }, 350);
  };

  const handlePopoverMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handlePopoverMouseLeave = () => {
    setActiveWordInfo(null);
  };

  if (!text) return null;
  if (!savedVocabMap || Object.keys(savedVocabMap).length === 0) {
    return <span className={className}>{text}</span>;
  }

  // Tokenize text into words and non-words
  const tokens = text.split(/([a-zA-Z0-9'’-]+)/g);

  return (
    <>
      <span className={className}>
        {tokens.map((token, idx) => {
          if (!token || !/^[a-zA-Z0-9'’-]+$/.test(token)) {
            return <React.Fragment key={idx}>{token}</React.Fragment>;
          }

          const clean = token.toLowerCase().replace(/^[’']+|[’']+$/g, "");
          const vocabItem = savedVocabMap[clean];

          if (!vocabItem) {
            return <React.Fragment key={idx}>{token}</React.Fragment>;
          }

          return (
            <span
              key={idx}
              className="saved-vocab-chip"
              onMouseEnter={(e) => handleMouseEnter(vocabItem, e)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => {
                e.stopPropagation();
                handleMouseEnter(vocabItem, e);
              }}
            >
              {token}
            </span>
          );
        })}
      </span>

      {/* Floating Vocab Popover */}
      {activeWordInfo && (
        <div
          className="saved-vocab-popover"
          style={{
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`,
          }}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popover-arrow" />
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            {activeWordInfo.image_url && (
              <img
                src={activeWordInfo.image_url}
                alt={activeWordInfo.word}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "8px",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid var(--border-color, #e2e8f0)",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-primary, #0f172a)" }}>
                    {activeWordInfo.word}
                  </span>
                  <button
                    className="popover-audio-btn"
                    onClick={(e) => handleSpeak(activeWordInfo.word, e)}
                    title="Nghe phát âm từ này"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
                {activeWordInfo.status && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: "6px",
                      color: (STATUS_MAP[activeWordInfo.status] || STATUS_MAP.NEW).color,
                      background: (STATUS_MAP[activeWordInfo.status] || STATUS_MAP.NEW).bg,
                    }}
                  >
                    {(STATUS_MAP[activeWordInfo.status] || STATUS_MAP.NEW).label}
                  </span>
                )}
              </div>

              {activeWordInfo.phonetic && (
                <div style={{ fontSize: "0.78rem", color: "#6366f1", marginTop: "1px" }}>
                  /{activeWordInfo.phonetic.replace(/^\/|\/$/g, "")}/
                </div>
              )}

              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-primary, #1e293b)",
                  marginTop: "4px",
                  fontWeight: 500,
                }}
              >
                {activeWordInfo.meaning || "Chưa có nghĩa tiếng Việt"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
