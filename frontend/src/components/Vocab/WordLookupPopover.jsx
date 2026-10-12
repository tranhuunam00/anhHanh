import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  quickLookupWord,
  playPronunciationAudio,
  createVocabWord,
  updateVocabStatus,
  updateVocabWord,
} from "../../services/authVocabService";
import {
  resolveInitialMeaning,
  resolveInitialContextSentence,
  hasVocabChanges,
  getMeaningSavePayload,
  calculateAutoTextareaHeight,
  computePopoverCoords,
} from "../../utils/wordLookupUtils";
import { PopoverHeader } from "./PopoverHeader";
import { PopoverIpaSection } from "./PopoverIpaSection";
import { PopoverTranslationSection } from "./PopoverTranslationSection";
import { PopoverContextSection } from "./PopoverContextSection";
import { PopoverActionFooter } from "./PopoverActionFooter";

const STATUS_MAP = {
  NEW: { label: "Mới lưu", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.12)" },
  LEARNING: { label: "Đang học", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
  MASTERED: { label: "Đã thuộc", color: "#10b981", bg: "rgba(16, 185, 129, 0.12)" },
};

export const WordLookupPopover = ({
  word,
  targetElement,
  contextSentence = "",
  contextTranslation = "",
  videoId = "",
  timestamp = 0,
  sourceLang = "en",
  targetLang = "vi",
  onClose,
}) => {
  const { token, refreshStreak, refreshSavedVocab, showToast, savedVocabMap } = useAuth();
  const popoverRef = useRef(null);
  const textareaRef = useRef(null);
  const contextTextareaRef = useRef(null);

  const [lookupData, setLookupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 12, placement: "bottom", arrowLeft: 140 });

  const [customMeaning, setCustomMeaning] = useState("");
  const [initialMeaning, setInitialMeaning] = useState("");
  const [customPos, setCustomPos] = useState("");
  const [initialPos, setInitialPos] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [initialContext, setInitialContext] = useState("");

  // Clean word token for display and lookup
  const cleanWord = (word || "").trim().replace(/^[’'".:,;!?-]+|[’'".:,;!?-]+$/g, "");

  // Reset custom states when word token changes
  useEffect(() => {
    setCustomMeaning("");
    setInitialMeaning("");
    setCustomPos("");
    setInitialPos("");
    setCustomContext("");
    setInitialContext("");
  }, [cleanWord]);

  // Auto adjust textarea height to fit content nicely
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const h = calculateAutoTextareaHeight(textareaRef.current.scrollHeight, 38, 120);
      textareaRef.current.style.height = `${h}px`;
    }
  }, [customMeaning, loading]);

  useEffect(() => {
    if (contextTextareaRef.current) {
      contextTextareaRef.current.style.height = "auto";
      const h = calculateAutoTextareaHeight(contextTextareaRef.current.scrollHeight, 44, 120);
      contextTextareaRef.current.style.height = `${h}px`;
    }
  }, [customContext, loading]);

  // Positioning relative to targetElement
  useEffect(() => {
    if (!targetElement) return;

    const updatePosition = () => {
      const rect = typeof targetElement.getBoundingClientRect === "function"
        ? targetElement.getBoundingClientRect()
        : targetElement;
      setCoords(computePopoverCoords(rect, window.innerWidth, window.innerHeight));
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [targetElement]);

  // Fetch word details
  useEffect(() => {
    let isMounted = true;
    if (!cleanWord) return;

    setLoading(true);

    const cleanLower = cleanWord.toLowerCase().replace(/\s+/g, " ");
    const cleanNorm = cleanLower.replace(/[’']/g, "'");
    const savedItem = savedVocabMap
      ? (savedVocabMap[cleanLower] || savedVocabMap[cleanNorm] || null)
      : null;

    quickLookupWord(cleanWord, contextSentence, token)
      .then((data) => {
        if (!isMounted) return;
        const resolved = resolveInitialMeaning(cleanWord, data, savedItem);
        setCustomMeaning(resolved);
        setInitialMeaning(resolved);

        const posResolved = savedItem?.part_of_speech || data?.part_of_speech || (cleanWord.includes(" ") ? "phrase" : "");
        setCustomPos(posResolved);
        setInitialPos(posResolved);

        const resolvedContext = resolveInitialContextSentence(contextSentence, savedItem);
        setCustomContext(resolvedContext);
        setInitialContext(resolvedContext);

        if (savedItem) {
          setLookupData({
            ...data,
            is_saved: true,
            saved_vocab: savedItem,
            meaning: resolved,
            part_of_speech: posResolved,
            ipa: savedItem.phonetic || data?.ipa,
          });
        } else {
          setLookupData({
            ...data,
            meaning: resolved,
            part_of_speech: posResolved,
          });
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback = resolveInitialMeaning(cleanWord, null, savedItem);
        setCustomMeaning(fallback);
        setInitialMeaning(fallback);

        const posResolved = savedItem?.part_of_speech || (cleanWord.includes(" ") ? "phrase" : "");
        setCustomPos(posResolved);
        setInitialPos(posResolved);

        const fallbackContext = resolveInitialContextSentence(contextSentence, savedItem);
        setCustomContext(fallbackContext);
        setInitialContext(fallbackContext);

        setLookupData({
          word: cleanWord,
          ipa: null,
          ipa_uk: null,
          ipa_us: null,
          part_of_speech: posResolved,
          definition: null,
          meaning: fallback,
          is_saved: Boolean(savedItem),
          saved_vocab: savedItem,
        });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [cleanWord, token, savedVocabMap, contextSentence]);

  // Click outside and Esc listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        (!targetElement || !(typeof targetElement.contains === "function" && targetElement.contains(e.target)))
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose, targetElement]);

  // Audio speech
  const handlePlayAudio = (accent) => {
    setActiveAudio(accent);
    const audioUrl = accent === "uk" ? lookupData?.audio_uk : lookupData?.audio_us;
    playPronunciationAudio(cleanWord, accent, audioUrl).finally(() => {
      setTimeout(() => setActiveAudio(null), 800);
    });
  };

  // One-click save to notebook with edited translation & context sentence
  const handleSaveToNotebook = async () => {
    if (!token) {
      showToast("Vui lòng đăng nhập để lưu từ vào Sổ tay", "warning");
      return;
    }
    if (isSaving || !lookupData) return;

    setIsSaving(true);
    try {
      const payload = getMeaningSavePayload({
        cleanWord,
        customMeaning,
        lookupMeaning: lookupData?.meaning,
        partOfSpeech: customPos,
        contextSentence: customContext,
        phonetic: lookupData?.ipa,
        videoId,
        timestamp,
        sourceLang,
        targetLang,
      });

      const res = await createVocabWord(payload, token);
      showToast(`Đã lưu "${cleanWord}" vào Sổ tay!`, "success");
      refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();

      const savedVocab = res?.vocab || {
        word: cleanWord,
        meaning: payload.meaning,
        part_of_speech: payload.part_of_speech,
        context_sentence: payload.context_sentence,
        status: "NEW",
        phonetic: lookupData?.ipa,
      };

      setLookupData((prev) => ({
        ...prev,
        is_saved: true,
        saved_vocab: savedVocab,
        meaning: payload.meaning,
        part_of_speech: payload.part_of_speech,
      }));
      setInitialMeaning(payload.meaning);
      setCustomMeaning(payload.meaning);
      setInitialPos(payload.part_of_speech);
      setInitialContext(payload.context_sentence);
      setCustomContext(payload.context_sentence);
    } catch (err) {
      showToast(err.message || "Không thể lưu từ này", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Update meaning, POS, and context sentence for already saved word
  const handleUpdateSavedVocab = async () => {
    if (!token || !lookupData?.saved_vocab?.id) return;
    const finalMeaning = (customMeaning || "").trim();
    if (!finalMeaning) {
      showToast("Nghĩa từ vựng không được để trống", "warning");
      return;
    }
    const finalContext = (customContext || "").trim();

    setIsSaving(true);
    try {
      const res = await updateVocabWord(
        lookupData.saved_vocab.id,
        {
          meaning: finalMeaning,
          part_of_speech: customPos,
          context_sentence: finalContext,
        },
        token
      );
      showToast(`Đã cập nhật "${cleanWord}" trong Sổ tay!`, "success");
      refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();

      const updatedVocab = res?.vocab || {
        ...lookupData.saved_vocab,
        meaning: finalMeaning,
        part_of_speech: customPos,
        context_sentence: finalContext,
      };

      setLookupData((prev) => ({
        ...prev,
        saved_vocab: updatedVocab,
        meaning: finalMeaning,
        part_of_speech: customPos,
      }));
      setInitialMeaning(finalMeaning);
      setCustomMeaning(finalMeaning);
      setInitialPos(customPos);
      setInitialContext(finalContext);
      setCustomContext(finalContext);
    } catch (err) {
      showToast(err.message || "Không thể cập nhật từ này", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle status for already saved word
  const handleCycleStatus = async () => {
    if (!token || !lookupData?.saved_vocab?.id) return;
    const currentStatus = lookupData.saved_vocab.status || "NEW";
    const nextStatus =
      currentStatus === "NEW" ? "LEARNING" : currentStatus === "LEARNING" ? "MASTERED" : "LEARNING";

    try {
      await updateVocabStatus(lookupData.saved_vocab.id, nextStatus, token);
      showToast(`Đã chuyển sang "${STATUS_MAP[nextStatus]?.label}"`, "info");
      refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();

      setLookupData((prev) => ({
        ...prev,
        saved_vocab: {
          ...prev.saved_vocab,
          status: nextStatus,
        },
      }));
    } catch (err) {
      showToast("Không thể cập nhật trạng thái", "error");
    }
  };

  // Handle Enter key inside textareas
  const handleKeyDownTextarea = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isSaved) {
        if (hasChanges) {
          handleUpdateSavedVocab();
        }
      } else {
        handleSaveToNotebook();
      }
    }
  };

  const isSaved = Boolean(lookupData?.is_saved);
  const savedMeaning = lookupData?.saved_vocab?.meaning || lookupData?.meaning || "";
  const hasChanges = hasVocabChanges({
    isSaved,
    customMeaning,
    savedMeaning,
    customPos,
    initialPos,
    customContext,
    initialContext,
  });

  const savedStatus = lookupData?.saved_vocab?.status || (isSaved ? "NEW" : null);
  const statusConfig = savedStatus ? STATUS_MAP[savedStatus] || STATUS_MAP.NEW : null;

  return (
    <div
      ref={popoverRef}
      className={`word-lookup-popover placement-${coords.placement}`}
      style={{
        top: `${coords.top}px`,
        left: `${coords.left}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Popover Arrow */}
      <div
        className="lookup-popover-arrow"
        style={{
          left: `${coords.arrowLeft}px`,
        }}
      />

      {/* Header: Word + Multi-POS Selector + UK / US Audio buttons + Close */}
      <PopoverHeader
        cleanWord={cleanWord}
        customPos={customPos}
        onChangePos={setCustomPos}
        activeAudio={activeAudio}
        onPlayAudio={handlePlayAudio}
        onClose={onClose}
      />

      <div className="lookup-divider" />

      {/* IPA Section */}
      <PopoverIpaSection
        loading={loading}
        cleanWord={cleanWord}
        lookupData={lookupData}
      />

      {/* Translation Section */}
      <PopoverTranslationSection
        loading={loading}
        customMeaning={customMeaning}
        initialMeaning={initialMeaning}
        onMeaningChange={(e) => setCustomMeaning(e.target.value)}
        onKeyDown={handleKeyDownTextarea}
        onResetMeaning={() => setCustomMeaning(initialMeaning)}
        definition={lookupData?.definition}
        textareaRef={textareaRef}
      />

      <div className="lookup-divider" />

      {/* Context Sentence Section */}
      <PopoverContextSection
        loading={loading}
        customContext={customContext}
        initialContext={initialContext}
        onContextChange={(e) => setCustomContext(e.target.value)}
        onKeyDown={handleKeyDownTextarea}
        onResetContext={() => setCustomContext(initialContext)}
        contextTranslation={contextTranslation}
        textareaRef={contextTextareaRef}
      />

      {/* Smart Notebook Action */}
      <PopoverActionFooter
        isSaved={isSaved}
        hasChanges={hasChanges}
        isSaving={isSaving}
        loading={loading}
        customMeaning={customMeaning}
        statusConfig={statusConfig}
        onCycleStatus={handleCycleStatus}
        onUpdateSavedVocab={handleUpdateSavedVocab}
        onSaveToNotebook={handleSaveToNotebook}
      />
    </div>
  );
};
