import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { WordLookupPopover } from "./WordLookupPopover";

export const HighlightedVocabSentence = React.memo(({
  text,
  className = "",
  contextSentence = "",
  contextTranslation = "",
  videoId = "",
  timestamp = 0,
  sourceLang = "en",
  targetLang = "vi",
}) => {
  const { savedVocabMap } = useAuth();
  const [activeWordState, setActiveWordState] = useState(null);

  const tokens = useMemo(() => {
    if (!text) return [];

    const rawTokens = text.split(/([a-zA-Z0-9'’-]+|[\u4e00-\u9fff])/g);
    const result = [];
    const len = rawTokens.length;
    const maxPhraseWords = 6;

    let i = 0;
    while (i < len) {
      const token = rawTokens[i];
      if (!token) {
        i++;
        continue;
      }

      const isWord = /^[a-zA-Z0-9'’-]+$|^[\u4e00-\u9fff]$/.test(token);
      if (!isWord) {
        result.push({ text: token, isWord: false });
        i++;
        continue;
      }

      // Collect lookahead words up to maxPhraseWords
      const candidateWords = [];
      const tokenIndices = [];
      let wordCount = 0;

      for (let j = i; j < len && wordCount < maxPhraseWords; j++) {
        const t = rawTokens[j];
        if (/^[a-zA-Z0-9'’-]+$|^[\u4e00-\u9fff]$/.test(t)) {
          const clean = t.toLowerCase().replace(/^[’']+|[’']+$/g, "").replace(/[’']/g, "'");
          candidateWords.push(clean);
          tokenIndices.push(j);
          wordCount++;
        } else if (/[\n.!?。！？]/.test(t)) {
          break;
        }
      }

      // Check multi-word phrases (supports spaces for English and no-space for Chinese)
      let matchedEndTokenIdx = -1;
      let matchedKey = null;

      if (savedVocabMap && candidateWords.length >= 2) {
        for (let k = candidateWords.length; k >= 2; k--) {
          const phraseKeySpace = candidateWords.slice(0, k).join(" ");
          const phraseKeyNoSpace = candidateWords.slice(0, k).join("");
          const item = savedVocabMap[phraseKeySpace] || savedVocabMap[phraseKeyNoSpace];
          if (item && item.status !== "MASTERED") {
            matchedKey = item.word || phraseKeyNoSpace;
            matchedEndTokenIdx = tokenIndices[k - 1];
            break;
          }
        }
      }

      if (matchedKey && matchedEndTokenIdx !== -1) {
        // Multi-word phrase hit
        const phraseText = rawTokens.slice(i, matchedEndTokenIdx + 1).join("");
        result.push({
          text: phraseText,
          isWord: true,
          isSaved: true,
          isPhrase: true,
          savedKey: matchedKey,
          lookupWord: matchedKey,
        });
        i = matchedEndTokenIdx + 1;
      } else {
        // Single word hit/miss
        const clean = token.toLowerCase().replace(/^[’']+|[’']+$/g, "");
        const cleanNorm = clean.replace(/[’']/g, "'");
        const savedItem = savedVocabMap ? (savedVocabMap[clean] || savedVocabMap[cleanNorm] || savedVocabMap[token]) : null;
        const isSaved = Boolean(savedItem && savedItem.status !== "MASTERED");

        result.push({
          text: token,
          isWord: true,
          isSaved,
          isPhrase: false,
          savedKey: isSaved ? clean : null,
          lookupWord: token,
        });
        i++;
      }
    }

    return result;
  }, [text, savedVocabMap]);

  if (!text) return null;

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
          if (!token.isWord) {
            return <React.Fragment key={idx}>{token.text}</React.Fragment>;
          }

          const clean = (token.savedKey || token.text).toLowerCase().replace(/^[’']+|[’']+$/g, "");
          const isSaved = token.isSaved;
          const isActive =
            activeWordState &&
            activeWordState.word.toLowerCase().replace(/^[’']+|[’']+$/g, "") === clean;

          const chipClasses = [
            "interactive-word",
            token.isPhrase ? "phrase-chip" : "",
            isSaved ? "saved-vocab-chip" : "word-lookup-trigger",
            isActive ? "active-inspect" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <span
              key={idx}
              className={chipClasses}
              onClick={(e) => handleWordClick(token.lookupWord || token.text, e)}
              title={
                isSaved
                  ? `"${token.text}" (Đã lưu trong Sổ tay - Bấm để tra)`
                  : `Tra nghĩa & phát âm của "${token.text}"`
              }
            >
              {token.text}
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
          sourceLang={sourceLang}
          targetLang={targetLang}
          onClose={() => setActiveWordState(null)}
        />
      )}
    </>
  );
});
