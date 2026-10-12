import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle,
  Eye,
  EyeOff,
} from "../Icons";
import {
  getRemainingPool,
  getNextMasteryQuestion,
  isSpellingMatch,
} from "../../utils/visualVocabUtils";
import { playPronunciationAudio } from "../../services/authVocabService";

export const VisualVocabPractice = ({
  topic,
  items = [],
  mode = "SPOT_TAP", // "SPOT_TAP" | "MATCH" | "SPELL"
  lastClickedHotspot = null, // { id, word, meaning }
  onHighlightHotspot,
  onQuizFeedback,
  onUpdateMasteredIds,
  onResetToExplore,
}) => {
  const [masteredSet, setMasteredSet] = useState(new Set());
  const [currentQ, setCurrentQ] = useState(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [spellInput, setSpellInput] = useState("");
  const [showSpellHint, setShowSpellHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // { isCorrect, message }
  const [availableLabels, setAvailableLabels] = useState([]);
  const lastQIdRef = useRef(null);

  // Pick next random question from remaining unmastered pool
  const pickNextQuestion = useCallback((currentMastered) => {
    const remaining = getRemainingPool(items, currentMastered);
    if (remaining.length === 0) {
      setIsFinished(true);
      setCurrentQ(null);
      return;
    }
    const next = getNextMasteryQuestion(remaining, lastQIdRef.current);
    lastQIdRef.current = next?.id || null;
    setCurrentQ(next);
    setFeedback(null);
    setSpellInput("");
    setShowSpellHint(false);
  }, [items]);

  // Reset practice session when topic or mode changes
  useEffect(() => {
    const newMastered = new Set();
    setMasteredSet(newMastered);
    if (onUpdateMasteredIds) onUpdateMasteredIds(newMastered);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    lastQIdRef.current = null;
    setShowSpellHint(false);

    // In MATCH mode: initialize full word bank with all items + contextual distractors (>=10)
    if (mode === "MATCH") {
      const targetLabels = items.map((it) => ({
        id: it.id,
        word: it.word,
        ipa: it.ipa || "",
        meaning: it.meaning,
        isDistractor: false,
      }));
      const distractorLabels = (topic.distractors || []).map((d) => ({
        id: d.id || `dist_${d.word}`,
        word: d.word,
        ipa: d.ipa || "",
        meaning: d.meaning,
        isDistractor: true,
      }));
      const combined = [...targetLabels, ...distractorLabels];
      combined.sort(() => Math.random() - 0.5);
      setAvailableLabels(combined);
    }

    pickNextQuestion(newMastered);
  }, [topic.id, mode, items, topic.distractors, onUpdateMasteredIds, pickNextQuestion]);

  // Keyboard shortcut Esc in SPELL mode to toggle Vietnamese meaning & IPA hint
  useEffect(() => {
    if (mode !== "SPELL") return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSpellHint((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode]);

  // Update highlighted pin on canvas for MATCH and SPELL
  useEffect(() => {
    if (currentQ && onHighlightHotspot) {
      if (mode === "MATCH" || mode === "SPELL") {
        onHighlightHotspot(currentQ.id);
      }
    }
  }, [currentQ, mode, onHighlightHotspot]);

  const handlePlayAudio = (word) => {
    if (word) playPronunciationAudio(word, "us").catch(() => {});
  };

  const handleCheckAnswer = useCallback((isCorrect, clickedItem = null) => {
    if (feedback || !currentQ) return; // Prevent double submit

    if (isCorrect) {
      const nextMastered = new Set(masteredSet);
      nextMastered.add(currentQ.id);
      setMasteredSet(nextMastered);
      if (onUpdateMasteredIds) onUpdateMasteredIds(nextMastered);

      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      setFeedback({
        isCorrect: true,
        message: `Chính xác! 🎉 "${currentQ.word}" (${currentQ.meaning})`,
      });

      if (onQuizFeedback) {
        onQuizFeedback({
          clickedId: currentQ.id,
          correctId: currentQ.id,
          isCorrect: true,
        });
      }

      handlePlayAudio(currentQ.word);

      setTimeout(() => {
        if (onQuizFeedback) onQuizFeedback(null);
        pickNextQuestion(nextMastered);
      }, 1000);
    } else {
      setStreak(0);
      const clickedWordName = clickedItem ? `"${clickedItem.word}"` : "điểm này";
      const correctIdx = items.findIndex((it) => it.id === currentQ.id) + 1;

      setFeedback({
        isCorrect: false,
        message: `Chưa đúng! Bạn đã chọn ${clickedWordName}. Vị trí đúng của "${currentQ.word}" (${currentQ.meaning}) là ở ghim số ${correctIdx}. Sẽ hỏi lại sau nhé!`,
      });

      if (onQuizFeedback) {
        onQuizFeedback({
          clickedId: clickedItem?.id || null,
          correctId: currentQ.id,
          isCorrect: false,
        });
      }

      setTimeout(() => {
        if (onQuizFeedback) onQuizFeedback(null);
        pickNextQuestion(masteredSet);
      }, 2000);
    }
  }, [feedback, currentQ, masteredSet, items, onUpdateMasteredIds, onQuizFeedback, pickNextQuestion]);

  // Click handler for MATCH label tags (disappears when correct)
  const handleMatchLabelClick = (lbl) => {
    if (feedback || !currentQ) return;

    if (lbl.word.toLowerCase().trim() === currentQ.word.toLowerCase().trim()) {
      // Correct! Label disappears from bank
      setAvailableLabels((prev) => prev.filter((l) => l.id !== lbl.id));
      handleCheckAnswer(true, lbl);
    } else {
      // Wrong selection
      if (lbl.isDistractor) {
        setStreak(0);
        setFeedback({
          isCorrect: false,
          message: `❌ "${lbl.word}" là từ gây nhiễu (${lbl.meaning || "ngoài ngữ cảnh"}), không có trong sơ đồ này!`,
        });
        if (onQuizFeedback) {
          onQuizFeedback({ clickedId: null, correctId: currentQ.id, isCorrect: false });
        }
        setTimeout(() => {
          if (onQuizFeedback) onQuizFeedback(null);
          setFeedback(null);
        }, 1600);
      } else {
        handleCheckAnswer(false, lbl);
      }
    }
  };

  // Listen to clicks on the canvas for SPOT_TAP mode
  useEffect(() => {
    if (mode === "SPOT_TAP" && lastClickedHotspot && currentQ && !feedback) {
      const isCorrect = lastClickedHotspot.id === currentQ.id;
      handleCheckAnswer(isCorrect, lastClickedHotspot);
    }
  }, [lastClickedHotspot, mode, currentQ, feedback, handleCheckAnswer]);

  const handleSpellSubmit = (e) => {
    e.preventDefault();
    if (!currentQ || !spellInput.trim()) return;
    const isMatch = isSpellingMatch(spellInput, currentQ.word);
    handleCheckAnswer(isMatch, currentQ);
  };

  // Completion Screen (100% Mastered)
  if (isFinished || (items.length > 0 && masteredSet.size >= items.length)) {
    return (
      <div className="vv-detail-card" style={{ textAlign: "center", padding: "32px 20px" }}>
        <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", marginBottom: "12px" }}>
          <Trophy size={42} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.35rem", color: "var(--text-primary)" }}>
          🎉 Hoàn Thành Xuất Sắc 100%!
        </h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: "0 0 16px" }}>
          Bạn đã thuộc chính xác toàn bộ <strong>{items.length}/{items.length} từ vựng</strong> của chủ đề!
        </p>
        <div style={{ background: "var(--bg-secondary)", padding: "12px", borderRadius: "10px", marginBottom: "20px", display: "flex", justifyContent: "space-around" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Tổng điểm</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--primary)" }}>{score} pts</div>
          </div>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Đã thuộc</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#10b981" }}>{items.length} / {items.length}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            className="vv-save-vocab-btn"
            style={{ width: "auto" }}
            onClick={() => {
              const newMastered = new Set();
              setMasteredSet(newMastered);
              if (onUpdateMasteredIds) onUpdateMasteredIds(newMastered);
              setIsFinished(false);
              setScore(0);
              setStreak(0);
              pickNextQuestion(newMastered);
            }}
          >
            <RotateCcw size={16} /> Luyện tập lại
          </button>
          <button
            type="button"
            className="vv-card-nav-btn"
            style={{ padding: "10px 16px", borderRadius: "10px", border: "1px solid var(--border-color)" }}
            onClick={onResetToExplore}
          >
            Trở về Khám Phá
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const total = items.length || 1;
  const progressPercent = Math.round((masteredSet.size / total) * 100);
  const currentPinIndex = items.findIndex((it) => it.id === currentQ.id) + 1;

  return (
    <div className="vv-detail-card">
      {/* Active Mastery Progress Bar */}
      <div className="vv-progress-container">
        <div className="vv-progress-meta">
          <span>Tiến độ: {masteredSet.size}/{total} từ ({progressPercent}%)</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {streak > 1 && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px", color: "#f59e0b" }}>
                <Flame size={14} /> {streak} combo
              </span>
            )}
            <span style={{ color: "var(--primary)" }}>{score} pts</span>
          </div>
        </div>
        <div className="vv-progress-track">
          <div className="vv-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Mode 1: SPOT & TAP (Chỉ Điểm) - Hotspot pins have NO words, user clicks matching pin */}
      {mode === "SPOT_TAP" && (
        <div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 6px" }}>
            👉 Hãy click vào điểm ghim trên tranh tương ứng với:
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg-secondary)", padding: "12px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800 }}>{currentQ.word}</div>
              <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>{currentQ.ipa} • {currentQ.meaning}</div>
            </div>
            <button
              type="button"
              className="vv-audio-btn"
              onClick={() => handlePlayAudio(currentQ.word)}
              title="Nghe phát âm"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: MATCH (Nối Nhãn - Full Word Bank with >=10 distractors, label disappears upon match) */}
      {mode === "MATCH" && (
        <div className="vv-match-practice-wrap">
          <div className="vv-match-question-header">
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              🏷️ Chọn nhãn tương ứng với vị trí đang sáng trên tranh:
            </span>
            <div className="vv-match-target-indicator">
              <span className="vv-target-pin-badge">Ghim #{currentPinIndex}</span>
              <span className="vv-target-meaning">{currentQ.meaning}</span>
            </div>
          </div>

          <div className="vv-match-bank-header">
            <span>Kho nhãn từ vựng ({availableLabels.length} nhãn còn lại):</span>
            <span className="vv-match-bank-hint">Bấm đúng nhãn sẽ biến mất</span>
          </div>

          <div className="vv-match-labels-grid">
            {availableLabels.map((lbl) => (
              <button
                key={lbl.id}
                type="button"
                className="vv-match-label-pill"
                onClick={() => handleMatchLabelClick(lbl)}
                disabled={feedback !== null}
                title={lbl.ipa ? `${lbl.word} ${lbl.ipa}` : lbl.word}
              >
                <span className="vv-match-word">{lbl.word}</span>
                {lbl.ipa && <span className="vv-match-ipa">{lbl.ipa}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: SPELL (Gõ Từ - Hint hidden by default, toggle with Eye / Esc) */}
      {mode === "SPELL" && (
        <form onSubmit={handleSpellSubmit} className="vv-spell-practice-wrap">
          <div className="vv-spell-question-header">
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
              ✍️ Gõ từ cho vị trí ghim #{currentPinIndex} đang sáng:
            </span>
            <button
              type="button"
              className={`vv-spell-eye-toggle-btn ${showSpellHint ? "active" : ""}`}
              onClick={() => setShowSpellHint((v) => !v)}
              title="Hiện / Ẩn gợi ý nghĩa TV & phiên âm (Phím Esc)"
            >
              {showSpellHint ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showSpellHint ? "Ẩn gợi ý" : "Xem gợi ý"}</span>
              <kbd className="vv-kbd-hint">Esc</kbd>
            </button>
          </div>

          {/* Target meaning box: hidden by default, revealed on Esc/click */}
          {showSpellHint ? (
            <div className="vv-spell-hint-box revealed">
              <div className="vv-spell-hint-text">
                <span className="vv-spell-meaning">{currentQ.meaning}</span>
                {currentQ.ipa && <span className="vv-spell-ipa">{currentQ.ipa}</span>}
              </div>
            </div>
          ) : (
            <div
              className="vv-spell-hint-box hidden"
              onClick={() => setShowSpellHint(true)}
              title="Click hoặc nhấn phím Esc để xem gợi ý"
            >
              <Eye size={15} style={{ opacity: 0.6 }} />
              <span>Gợi ý tiếng Việt &amp; phiên âm đang ẩn (Nhấn <kbd className="vv-kbd-hint">Esc</kbd> để mở)</span>
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <input
              type="text"
              autoFocus
              className="vv-search-box"
              style={{ flex: 1, padding: "10px 14px", fontSize: "0.95rem", borderRadius: "8px" }}
              placeholder={`Gõ từ (${currentQ.word.length} chữ cái)...`}
              value={spellInput}
              onChange={(e) => setSpellInput(e.target.value)}
              disabled={feedback !== null}
            />
            <button
              type="submit"
              className="vv-save-vocab-btn"
              style={{ width: "auto", padding: "0 18px", whiteSpace: "nowrap" }}
              disabled={!spellInput.trim() || feedback !== null}
            >
              Kiểm tra
            </button>
          </div>
        </form>
      )}

      {/* Answer Feedback Banner */}
      {feedback && (
        <div style={{
          marginTop: "12px",
          padding: "10px 14px",
          borderRadius: "8px",
          fontSize: "0.88rem",
          fontWeight: 700,
          background: feedback.isCorrect ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: feedback.isCorrect ? "#10b981" : "#ef4444",
          border: `1px solid ${feedback.isCorrect ? "#10b981" : "#ef4444"}`,
          transition: "all 0.2s ease",
        }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};
