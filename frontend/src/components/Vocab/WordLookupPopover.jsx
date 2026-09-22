import React, { useState, useEffect, useRef } from "react";
import { Volume2, Sparkles, Check, BookmarkCheck, X, BookOpen, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { quickLookupWord, playPronunciationAudio, createVocabWord, updateVocabStatus } from "../../services/authVocabService";

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
  onClose,
}) => {
  const { token, refreshStreak, refreshSavedVocab, showToast, savedVocabMap } = useAuth();
  const popoverRef = useRef(null);

  const [lookupData, setLookupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: "bottom", arrowLeft: 140 });

  // Clean word token for display and lookup
  const cleanWord = (word || "").trim().replace(/^[’'".:,;!?-]+|[’'".:,;!?-]+$/g, "");

  // Positioning relative to targetElement
  useEffect(() => {
    if (!targetElement) return;

    const updatePosition = () => {
      const rect = targetElement.getBoundingClientRect();
      const popoverWidth = Math.min(320, window.innerWidth - 24);
      const popoverEstimatedHeight = 250;

      const targetCenterX = rect.left + rect.width / 2;
      let left = targetCenterX - popoverWidth / 2;

      // Ensure stays within viewport horizontally
      if (left < 12) left = 12;
      if (left + popoverWidth > window.innerWidth - 12) {
        left = window.innerWidth - 12 - popoverWidth;
      }

      // Check vertical space (default to bottom placement, like Image 2)
      let placement = "bottom";
      let top = rect.bottom + 8;

      if (top + popoverEstimatedHeight > window.innerHeight && rect.top > popoverEstimatedHeight + 10) {
        placement = "top";
        top = rect.top - 8;
      }

      const arrowLeft = Math.max(16, Math.min(popoverWidth - 16, targetCenterX - left));

      setCoords({ top, left, placement, arrowLeft });
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

    // Check if word is already in AuthContext savedVocabMap
    const savedItem = savedVocabMap ? savedVocabMap[cleanWord.toLowerCase()] : null;

    quickLookupWord(cleanWord, contextSentence, token)
      .then((data) => {
        if (!isMounted) return;
        if (savedItem) {
          setLookupData({
            ...data,
            is_saved: true,
            saved_vocab: savedItem,
            meaning: savedItem.meaning || data?.meaning,
            ipa: savedItem.phonetic || data?.ipa,
          });
        } else {
          setLookupData(data);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLookupData({
          word: cleanWord,
          ipa: null,
          ipa_uk: null,
          ipa_us: null,
          part_of_speech: null,
          definition: null,
          meaning: cleanWord,
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
        targetElement &&
        !targetElement.contains(e.target)
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
    playPronunciationAudio(cleanWord, accent).finally(() => {
      setTimeout(() => setActiveAudio(null), 800);
    });
  };

  // One-click save to notebook
  const handleSaveToNotebook = async () => {
    if (!token) {
      showToast("Vui lòng đăng nhập để lưu từ vào Sổ tay", "warning");
      return;
    }
    if (isSaving || !lookupData) return;

    setIsSaving(true);
    try {
      const payload = {
        word: cleanWord,
        context_sentence: contextSentence || "",
        meaning: lookupData.meaning || "",
        phonetic: lookupData.ipa || "",
        video_id: videoId || "",
        timestamp: timestamp || 0,
        source_lang: "en",
        target_lang: "vi",
      };

      const res = await createVocabWord(payload, token);
      showToast(`✨ Đã lưu "${cleanWord}" vào Sổ tay!`, "success");
      refreshStreak();
      if (refreshSavedVocab) refreshSavedVocab();

      setLookupData((prev) => ({
        ...prev,
        is_saved: true,
        saved_vocab: res.vocab || {
          word: cleanWord,
          meaning: lookupData.meaning,
          status: "NEW",
          phonetic: lookupData.ipa,
        },
      }));
    } catch (err) {
      showToast(err.message || "Không thể lưu từ này", "error");
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

  const isSaved = Boolean(lookupData?.is_saved);
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

      {/* Header: Word + UK / US Audio buttons + Close */}
      <div className="lookup-popover-header">
        <div className="lookup-word-title-group">
          <span className="lookup-word-name">{cleanWord}</span>
          {lookupData?.part_of_speech && (
            <span className="lookup-pos-badge">{lookupData.part_of_speech}</span>
          )}
        </div>

        <div className="lookup-audio-actions">
          <button
            type="button"
            className={`lookup-audio-btn uk ${activeAudio === "uk" ? "playing" : ""}`}
            onClick={() => handlePlayAudio("uk")}
            title="Phát âm giọng Anh - Anh (UK)"
          >
            <span className="accent-label">UK</span>
            <Volume2 size={14} className={activeAudio === "uk" ? "pulse-anim" : ""} />
          </button>

          <button
            type="button"
            className={`lookup-audio-btn us ${activeAudio === "us" ? "playing" : ""}`}
            onClick={() => handlePlayAudio("us")}
            title="Phát âm giọng Anh - Mỹ (US)"
          >
            <span className="accent-label">US</span>
            <Volume2 size={14} className={activeAudio === "us" ? "pulse-anim" : ""} />
          </button>

          <button type="button" className="lookup-close-btn" onClick={onClose} title="Đóng (Esc)">
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="lookup-divider" />

      {/* IPA Section - Exactly as shown in Image 2 */}
      <div className="lookup-section">
        <div className="lookup-section-title">IPA for {cleanWord}</div>
        {loading ? (
          <div className="lookup-skeleton-line" style={{ width: "65%" }} />
        ) : (
          <div className="lookup-ipa-row">
            <span className="ipa-accent">UK</span>
            <span className="ipa-text">{lookupData?.ipa_uk || lookupData?.ipa || "/.../"}</span>
            <span className="ipa-accent" style={{ marginLeft: "10px" }}>
              US
            </span>
            <span className="ipa-text">{lookupData?.ipa_us || lookupData?.ipa || "/.../"}</span>
          </div>
        )}
      </div>

      <div className="lookup-divider" />

      {/* Translation Section - Exactly as shown in Image 2 */}
      <div className="lookup-section">
        <div className="lookup-section-title">Translation</div>
        {loading ? (
          <div className="lookup-skeleton-line" style={{ width: "85%", height: "20px" }} />
        ) : (
          <div className="lookup-meaning-text">
            {lookupData?.meaning || cleanWord}
          </div>
        )}

        {/* English definition (if available) for deeper learning */}
        {lookupData?.definition && !loading && (
          <div className="lookup-definition-text" title="English definition">
            {lookupData.definition}
          </div>
        )}
      </div>

      {/* Smart Notebook Action (Super UX Upgrade) */}
      <div className="lookup-action-footer">
        {isSaved ? (
          <div className="lookup-saved-bar">
            <div className="saved-indicator-group">
              <BookmarkCheck size={16} className="text-emerald-500" />
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
        ) : (
          <button
            type="button"
            className="lookup-save-btn"
            onClick={handleSaveToNotebook}
            disabled={isSaving || loading}
          >
            <Sparkles size={14} />
            <span>{isSaving ? "Đang lưu..." : "Lưu vào Sổ tay"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
