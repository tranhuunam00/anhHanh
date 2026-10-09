import React, { useState, useEffect } from "react";
import { WordLookupPopover } from "./WordLookupPopover";
import { splitContextSentence } from "../../utils/textNormalizer";

export const FloatingVocabSaver = ({
  currentSentence = "",
  currentVideoId = "",
  currentTimestamp = 0,
  sourceLang = "en",
  targetLang = "vi",
}) => {
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [targetRange, setTargetRange] = useState(null);

  useEffect(() => {
    const handleMouseUp = (e) => {
      // Don't trigger if mouseup happened inside popover or input/textarea
      if (e?.target?.closest(".word-lookup-popover, input, textarea")) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length > 120 || text.includes("\n")) {
        return;
      }

      // Ignore accidental 1-character clicks unless standard 1-letter words 'a' or 'i'
      if (text.length === 1 && !["a", "i", "A", "I"].includes(text)) {
        return;
      }

      let range;
      try {
        range = selection.getRangeAt(0);
      } catch {
        return;
      }

      const rect = range.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      // Extract exact parent sentence of the highlighted text
      let extractedSentence = "";
      if (range && range.commonAncestorContainer) {
        const node = range.commonAncestorContainer;
        const element = node.nodeType === 3 ? node.parentElement : node;
        const sentenceEl = element.closest(
          ".sentence-card, .sentence-item, .transcript-item, .transcript-sentence, .dictation-sentence-text, .transcript-line, .reader-sentence, p, li"
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
      setSelectedWord(text);
      setTargetRange(range.cloneRange());
    };

    const handleMouseDown = (e) => {
      if (e.target.closest(".word-lookup-popover")) return;
      setSelectedWord("");
      setTargetRange(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [currentSentence]);

  if (!selectedWord || !targetRange) return null;

  return (
    <WordLookupPopover
      word={selectedWord}
      targetElement={targetRange}
      contextSentence={selectedSentence || currentSentence || ""}
      videoId={currentVideoId || ""}
      timestamp={currentTimestamp || 0}
      sourceLang={sourceLang || "en"}
      targetLang={targetLang || "vi"}
      onClose={() => {
        setSelectedWord("");
        setTargetRange(null);
      }}
    />
  );
};
