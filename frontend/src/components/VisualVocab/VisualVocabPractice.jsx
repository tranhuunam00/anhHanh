import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Volume2,
  RotateCcw,
  Trophy,
  Flame,
  CheckCircle,
} from "../Icons";
import {
  getRemainingPool,
  getNextMasteryQuestion,
  generateDistractorOptions,
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
  const [feedback, setFeedback] = useState(null); // { isCorrect, message }
  const [options, setOptions] = useState([]);
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
    pickNextQuestion(newMastered);
  }, [topic.id, mode, items, onUpdateMasteredIds, pickNextQuestion]);

  // Generate options when in MATCH mode
  useEffect(() => {
    if (mode === "MATCH" && currentQ) {
      setOptions(generateDistractorOptions(currentQ, items, 4));
    }
  }, [mode, currentQ, items]);

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
      }, 1200);
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
        // Word stays in pool, pick another from pool
        pickNextQuestion(masteredSet);
      }, 2400);
    }
  }, [feedback, currentQ, masteredSet, items, onUpdateMasteredIds, onQuizFeedback, pickNextQuestion]);

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
              const fresh = new Set();
              setMasteredSet(fresh);
              if (onUpdateMasteredIds) onUpdateMasteredIds(fresh);
              setScore(0);
              setIsFinished(false);
              pickNextQuestion(fresh);
            }}
          >
            <RotateCcw size={16} /> Luyện tập lại
          </button>
          <button
            type="button"
            className="vv-topic-pill active"
            onClick={onResetToExplore}
          >
            Khám phá sơ đồ
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const total = items.length || 1;
  const progressPercent = Math.round((masteredSet.size / total) * 100);

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

      {/* Mode 1: SPOT & TAP (Chỉ Điểm) */}
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

      {/* Mode 2: MATCH (Nối Nhãn) */}
      {mode === "MATCH" && (
        <div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 8px" }}>
            Vị trí đang sáng là từ nào dưới đây?
          </p>
          <div style={{ background: "var(--bg-secondary)", padding: "10px 12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{currentQ.meaning}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="vv-list-item-btn"
                style={{ padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "0.95rem" }}
                onClick={() => handleCheckAnswer(opt.id === currentQ.id, opt)}
                disabled={feedback !== null}
              >
                <span><strong>{opt.word}</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{opt.ipa}</span></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 3: SPELL (Gõ Từ) */}
      {mode === "SPELL" && (
        <form onSubmit={handleSpellSubmit}>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "0 0 8px" }}>
            Gõ từ tiếng Anh cho điểm ghim đang chọn:
          </p>
          <div style={{ background: "var(--bg-secondary)", padding: "10px 12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid var(--border-color)" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>{currentQ.meaning}</span>
            {currentQ.ipa && <div style={{ fontSize: "0.8rem", color: "var(--primary)" }}>{currentQ.ipa}</div>}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              autoFocus
              className="vv-search-box"
              style={{ flex: 1, padding: "10px 12px", fontSize: "0.95rem", borderRadius: "8px" }}
              placeholder={`Gõ từ (${currentQ.word.length} chữ cái)...`}
              value={spellInput}
              onChange={(e) => setSpellInput(e.target.value)}
              disabled={feedback !== null}
            />
            <button
              type="submit"
              className="vv-save-vocab-btn"
              style={{ width: "auto", padding: "0 16px" }}
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
