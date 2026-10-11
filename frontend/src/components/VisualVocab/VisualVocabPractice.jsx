import React, { useState, useEffect } from "react";
import {
  Volume2,
  Check,
  RotateCcw,
  Trophy,
  Flame,
  ArrowRight,
} from "../Icons";
import {
  generateSpotChallengeList,
  generateDistractorOptions,
  isSpellingMatch,
} from "../../utils/visualVocabUtils";
import { playPronunciationAudio } from "../../services/authVocabService";

export const VisualVocabPractice = ({
  topic,
  items = [],
  mode = "SPOT_TAP", // "SPOT_TAP" | "MATCH" | "SPELL"
  lastClickedHotspotId = null,
  onHighlightHotspot,
  onQuizFeedback,
  onResetToExplore,
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [spellInput, setSpellInput] = useState("");
  const [feedback, setFeedback] = useState(null); // { isCorrect, message }
  const [options, setOptions] = useState([]);

  // Init questions queue when mode or topic items change
  useEffect(() => {
    const list = generateSpotChallengeList(items, 15);
    setQuestions(list);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setFeedback(null);
    setSpellInput("");
  }, [topic.id, mode, items]);

  const currentQ = questions[currentIndex] || null;

  // Generate options when in MATCH mode
  useEffect(() => {
    if (mode === "MATCH" && currentQ) {
      setOptions(generateDistractorOptions(currentQ, items, 4));
    }
  }, [mode, currentQ, items]);

  // Update highlighted pin on canvas
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

  const handleNextQuestion = () => {
    setFeedback(null);
    setSpellInput("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleCheckAnswer = (isCorrect, answerWord) => {
    if (feedback) return; // Prevent double submit
    if (onQuizFeedback && currentQ) {
      onQuizFeedback({ hotspotId: currentQ.id, isCorrect });
      setTimeout(() => onQuizFeedback(null), 1500);
    }
    if (isCorrect) {
      setScore((s) => s + 10);
      setStreak((st) => st + 1);
      setFeedback({ isCorrect: true, message: `Chính xác! 🎉 "${answerWord}"` });
      handlePlayAudio(answerWord);
      setTimeout(handleNextQuestion, 1400);
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng! Đáp án đúng là "${answerWord}".`,
      });
      setTimeout(handleNextQuestion, 2200);
    }
  };

  // Listen to clicks on the canvas for SPOT_TAP mode
  useEffect(() => {
    if (mode === "SPOT_TAP" && lastClickedHotspotId && currentQ && !feedback) {
      const isCorrect = lastClickedHotspotId === currentQ.id;
      handleCheckAnswer(isCorrect, currentQ.word);
    }
  }, [lastClickedHotspotId]);

  const handleSpellSubmit = (e) => {
    e.preventDefault();
    if (!currentQ || !spellInput.trim()) return;
    const isMatch = isSpellingMatch(spellInput, currentQ.word);
    handleCheckAnswer(isMatch, currentQ.word);
  };

  if (isFinished) {
    return (
      <div className="vv-detail-card" style={{ textAlign: "center", padding: "32px 20px" }}>
        <div style={{ display: "inline-flex", padding: "16px", borderRadius: "50%", background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)", marginBottom: "12px" }}>
          <Trophy size={40} />
        </div>
        <h3 style={{ margin: "0 0 8px", fontSize: "1.3rem" }}>Hoàn Thành Bài Luyện Tập!</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", margin: "0 0 16px" }}>
          Điểm số: <strong style={{ color: "var(--primary)" }}>{score} điểm</strong> • Trả lời đúng {Math.round(score / 10)}/{questions.length} câu
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            className="vv-save-vocab-btn"
            style={{ width: "auto" }}
            onClick={() => {
              setQuestions(generateSpotChallengeList(items, 15));
              setCurrentIndex(0);
              setScore(0);
              setIsFinished(false);
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

  return (
    <div className="vv-detail-card">
      {/* Quiz Progress & Streak header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 700 }}>
          CÂU {currentIndex + 1} / {questions.length}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {streak > 1 && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700 }}>
              <Flame size={14} /> {streak} combo
            </span>
          )}
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
            {score} pts
          </span>
        </div>
      </div>

      {/* Question Prompt */}
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
                onClick={() => handleCheckAnswer(opt.id === currentQ.id, currentQ.word)}
                disabled={feedback !== null}
              >
                <span><strong>{opt.word}</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{opt.ipa}</span></span>
              </button>
            ))}
          </div>
        </div>
      )}

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
        }}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};
