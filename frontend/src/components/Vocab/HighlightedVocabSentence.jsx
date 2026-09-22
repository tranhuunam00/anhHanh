import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { WordLookupPopover } from "./WordLookupPopover";

export const HighlightedVocabSentence = ({
  text,
  className = "",
  contextSentence = "",
  contextTranslation = "",
  videoId = "",
  timestamp = 0,
}) => {
  const { savedVocabMap } = useAuth();
  const [activeWordState, setActiveWordState] = useState(null);

  if (!text) return null;

  // Split sentence into words and non-words (punctuation, spaces)
  const tokens = text.split(/([a-zA-Z0-9'’-]+)/g);

  const handleWordClick = (word, e) => {
    // If user is selecting a multi-word phrase, let text selection / FloatingVocabSaver take precedence
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 1) return;

    e.stopPropagation();

    // Toggle if clicking the exact same word element
    if (activeWordState && activeWordState.targetEl === e.currentTarget) {
      setActiveWordState(null);
      return;
    }

    setActiveWordState({
      word,
      targetEl: e.currentTarget,
    });
  };

  return (
    <>
      <span className={`highlighted-sentence-container ${className}`}>
        {tokens.map((token, idx) => {
          if (!token || !/^[a-zA-Z0-9'’-]+$/.test(token)) {
            return <React.Fragment key={idx}>{token}</React.Fragment>;
          }

          const clean = token.toLowerCase().replace(/^[’']+|[’']+$/g, "");
          const isSaved = savedVocabMap && Boolean(savedVocabMap[clean]);
          const isActive =
            activeWordState &&
            activeWordState.word.toLowerCase().replace(/^[’']+|[’']+$/g, "") === clean;

          const chipClasses = [
            "interactive-word",
            isSaved ? "saved-vocab-chip" : "word-lookup-trigger",
            isActive ? "active-inspect" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <span
              key={idx}
              className={chipClasses}
              onClick={(e) => handleWordClick(token, e)}
              title={
                isSaved
                  ? `"${token}" (Đã lưu trong Sổ tay - Bấm để tra)`
                  : `Tra nghĩa & phát âm của "${token}"`
              }
            >
              {token}
            </span>
          );
        })}
      </span>

      {/* Interactive Word Lookup Popover */}
      {activeWordState && (
        <WordLookupPopover
          word={activeWordState.word}
          targetElement={activeWordState.targetEl}
          contextSentence={contextSentence || text}
          contextTranslation={contextTranslation}
          videoId={videoId}
          timestamp={timestamp}
          onClose={() => setActiveWordState(null)}
        />
      )}
    </>
  );
};
