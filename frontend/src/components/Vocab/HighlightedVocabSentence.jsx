import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { WordLookupPopover } from "./WordLookupPopover";
import { analyzeSentencePhonology } from "../../utils/phonologyEngine";

export const HighlightedVocabSentence = ({
  text,
  className = "",
  contextSentence = "",
  contextTranslation = "",
  videoId = "",
  timestamp = 0,
  showLinking = false,
}) => {
  const { savedVocabMap } = useAuth();
  const [activeWordState, setActiveWordState] = useState(null);

  const phonologyData = useMemo(() => {
    if (!showLinking || !text) return null;
    return analyzeSentencePhonology(text);
  }, [showLinking, text]);

  if (!text) return null;

  // Split sentence into words and non-words (punctuation, spaces)
  const tokens = text.split(/([a-zA-Z0-9'’-]+)/g);

  // Map word index in token list to phonology boundary symbol
  const linkingMap = {};
  if (phonologyData && phonologyData.phenomena) {
    let wordCounter = 0;
    const wordIndexToTokenIdx = [];
    tokens.forEach((tok, idx) => {
      if (tok && /^[a-zA-Z0-9'’-]+$/.test(tok)) {
        wordIndexToTokenIdx[wordCounter] = idx;
        wordCounter++;
      }
    });

    phonologyData.phenomena.forEach((p) => {
      // ONLY include Consonant-to-Vowel LINKING phenomena!
      if (p.type !== "LINKING") return;

      const tokIdx = wordIndexToTokenIdx[p.word1_index];
      if (tokIdx !== undefined) {
        linkingMap[tokIdx] = p;
      }
    });
  }

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

          const linkingObj = linkingMap[idx];

          return (
            <React.Fragment key={idx}>
              <span
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

              {linkingObj && (
                <span
                  className="linking-arc-symbol"
                  aria-hidden="true"
                  style={{
                    userSelect: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                    pointerEvents: "none",
                    display: "inline-block",
                    position: "relative",
                    width: 0,
                    height: 0,
                    overflow: "visible",
                    verticalAlign: "baseline",
                  }}
                  title={`Nối âm: ${linkingObj.pair || ""} (${linkingObj.connected || ""})`}
                >
                  <svg
                    width="13"
                    height="5"
                    viewBox="0 0 13 5"
                    style={{
                      position: "absolute",
                      left: "-4px",
                      bottom: "-4px",
                      pointerEvents: "none",
                    }}
                  >
                    <path
                      d="M 1 1 Q 6.5 5 12 1"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              )}
            </React.Fragment>
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

