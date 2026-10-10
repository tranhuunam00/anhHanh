import React, { useState, useEffect, useRef } from "react";
import { IconVolume, IconSparkles, IconBookmark, IconClose, IconCheckCircle } from "../Icons";
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
  isMeaningModified,
  getMeaningSavePayload,
  calculateAutoTextareaHeight,
  computePopoverCoords,
} from "../../utils/wordLookupUtils";
import { PopoverTranslationSection } from "./PopoverTranslationSection";
import { PopoverPosSelector } from "./PopoverPosSelector";

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

  const [lookupData, setLookupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 12, placement: "bottom", arrowLeft: 140 });
  const [customMeaning, setCustomMeaning] = useState("");
  const [initialMeaning, setInitialMeaning] = useState("");
  const [customPos, setCustomPos] = useState("");
  const [initialPos, setInitialPos] = useState("");

  // Clean word token for display and lookup
  const cleanWord = (word || "").trim().replace(/^[’'".:,;!?-]+|[’'".:,;!?-]+$/g, "");

  // Reset custom meanings when word token changes
  useEffect(() => {
    setCustomMeaning("");
    setInitialMeaning("");
    setCustomPos("");
    setInitialPos("");
  }, [cleanWord]);

  // Auto adjust textarea height to fit content nicely
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const h = calculateAutoTextareaHeight(textareaRef.current.scrollHeight, 38, 120);
      textareaRef.current.style.height = `${h}px`;
    }
  }, [customMeaning, loading]);

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

  // One-click save to notebook with edited translation
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
        contextSentence,
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
    } catch (err) {
      showToast(err.message || "Không thể lưu từ này", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Update meaning for already saved word
  const handleUpdateSavedMeaning = async () => {
    if (!token || !lookupData?.saved_vocab?.id) return;
    const finalMeaning = (customMeaning || "").trim();
    if (!finalMeaning) {
      showToast("Nghĩa từ vựng không được để trống", "warning");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateVocabWord(
        lookupData.saved_vocab.id,
        { meaning: finalMeaning, part_of_speech: customPos },
        token
      );
      showToast(`Đã cập nhật nghĩa của "${cleanWord}"!`, "success");
      refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();

      const updatedVocab = res?.vocab || {
        ...lookupData.saved_vocab,
        meaning: finalMeaning,
        part_of_speech: customPos,
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
    } catch (err) {
      showToast(err.message || "Không thể cập nhật nghĩa từ này", "error");
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

  // Handle Enter key inside textarea
  const handleKeyDownTextarea = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isSaved) {
        if (isMeaningChanged) {
          handleUpdateSavedMeaning();
        }
      } else {
        handleSaveToNotebook();
      }
    }
  };

  const isSaved = Boolean(lookupData?.is_saved);
  const savedMeaning = lookupData?.saved_vocab?.meaning || lookupData?.meaning || "";
  const isPosChanged = (customPos || "").trim() !== (initialPos || "").trim();
  const isMeaningChanged = isMeaningModified(isSaved, customMeaning, savedMeaning) || (isSaved && isPosChanged);
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
      <div className="lookup-popover-header">
        <div className="lookup-word-title-group">
          <span className="lookup-word-name" title={cleanWord}>{cleanWord}</span>
          <PopoverPosSelector
            partOfSpeech={customPos}
            onChangePos={setCustomPos}
            cleanWord={cleanWord}
          />
        </div>

        <div className="lookup-audio-actions">
          <button
            type="button"
            className={`lookup-audio-btn uk ${activeAudio === "uk" ? "playing" : ""}`}
            onClick={() => handlePlayAudio("uk")}
            title="Phát âm giọng Anh - Anh (UK)"
          >
            <span className="accent-label">UK</span>
            <IconVolume size={14} className={activeAudio === "uk" ? "pulse-anim" : ""} />
          </button>

          <button
            type="button"
            className={`lookup-audio-btn us ${activeAudio === "us" ? "playing" : ""}`}
            onClick={() => handlePlayAudio("us")}
            title="Phát âm giọng Anh - Mỹ (US)"
          >
            <span className="accent-label">US</span>
            <IconVolume size={14} className={activeAudio === "us" ? "pulse-anim" : ""} />
          </button>

          <button type="button" className="lookup-close-btn" onClick={onClose} title="Đóng (Esc)">
            <IconClose size={15} />
          </button>
        </div>
      </div>

      <div className="lookup-divider" />

      {/* IPA Section - Hiển thị nếu có IPA hoặc đang load */}
      {(loading || Boolean(lookupData?.ipa_uk || lookupData?.ipa_us || lookupData?.ipa)) && (
        <>
          <div className="lookup-section">
            <div className="lookup-section-title">IPA for {cleanWord}</div>
            {loading ? (
              <div className="lookup-skeleton-line" style={{ width: "65%" }} />
            ) : (
              <div className="lookup-ipa-row">
                {lookupData?.ipa_uk && lookupData?.ipa_us && lookupData.ipa_uk !== lookupData.ipa_us ? (
                  <>
                    <span className="ipa-accent">UK</span>
                    <span className="ipa-text">{lookupData.ipa_uk}</span>
                    <span className="ipa-accent" style={{ marginLeft: "10px" }}>
                      US
                    </span>
                    <span className="ipa-text">{lookupData.ipa_us}</span>
                  </>
                ) : (
                  <>
                    <span className="ipa-accent">UK • US</span>
                    <span className="ipa-text">{lookupData?.ipa_uk || lookupData?.ipa_us || lookupData?.ipa || "/.../"}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="lookup-divider" />
        </>
      )}

      {/* Translation Section - User can edit directly before saving */}
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

      {/* Smart Notebook Action */}
      <div className="lookup-action-footer">
        {isSaved && !isMeaningChanged ? (
          <div className="lookup-saved-bar">
            <div className="saved-indicator-group">
              <IconBookmark size={16} className="text-emerald-500" />
              <span className="saved-text">Đã có trong Sổ tay</span>
              {statusConfig && (
                <span
                  className="saved-status-tag"
                  style={{ color: statusConfig.color, background: statusConfig.bg }}
                  onClick={handleCycleStatus}
                  title="Bấm để đổi trạng thái học"
                >
                  {statusConfig.label} ↻
                </span>
              )}
            </div>
          </div>
        ) : isSaved && isMeaningChanged ? (
          <button
            type="button"
            className="lookup-save-btn lookup-update-btn"
            onClick={handleUpdateSavedMeaning}
            disabled={isSaving || loading || !customMeaning.trim()}
            title="Lưu nghĩa mới đã chỉnh sửa vào Sổ tay"
          >
            <IconCheckCircle size={14} />
            <span>{isSaving ? "Đang lưu..." : "Cập nhật nghĩa trong Sổ tay"}</span>
          </button>
        ) : (
          <button
            type="button"
            className="lookup-save-btn"
            onClick={handleSaveToNotebook}
            disabled={isSaving || loading}
          >
            <IconSparkles size={14} />
            <span>{isSaving ? "Đang lưu..." : "Lưu vào Sổ tay"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
