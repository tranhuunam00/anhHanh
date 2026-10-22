import React, { useState, useMemo, useCallback } from "react";
import {
  Volume2,
  Lock,
  Sparkles,
  ArrowLeft,
  X,
  Eye,
  Check,
  RotateCcw,
  BookOpen,
} from "../../Icons";
import { playSoundFeedback } from "../../../utils/vocabAudioFeedback";
import "./VocabExerciseAIStory.css";

const STORY_THEMES = [
  { id: "daily_life", label: "Đời sống hàng ngày" },
  { id: "business", label: "Công việc & Kinh doanh" },
  { id: "adventure", label: "Khám phá & Du lịch" },
  { id: "mystery", label: "Bí ẩn & Hài hước" },
];

export const VocabExerciseAIStory = ({
  items = [],
  token = null,
  user = null,
  onBackToMenu,
  onClose,
  onFinishExercise,
}) => {
  // Check authorization whitelist
  const isAuthorized = useMemo(() => {
    if (!user) return false;
    if (user.can_use_ai_import || user.can_use_ai_writing) return true;
    const em = (user.email || "").toLowerCase();
    const handle = em.split("@")[0];
    return (
      handle === "tranhuunam23022000" ||
      handle === "vuthiquynhtrang" ||
      handle === "vuthiquynhtrangbl6d"
    );
  }, [user]);

  const [selectedTheme, setSelectedTheme] = useState("daily_life");
  const [isLoading, setIsLoading] = useState(false);
  const [storyData, setStoryData] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isReadingStory, setIsReadingStory] = useState(false);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Generate Story from Backend
  const handleGenerateStory = async () => {
    if (!items || items.length === 0) return;
    setIsLoading(true);
    setStoryData(null);
    setUserAnswers({});
    setIsQuizCompleted(false);

    try {
      const payload = {
        words: items.slice(0, 15).map((w) => ({
          word: w.word,
          meaning: w.meaning || "",
          part_of_speech: w.part_of_speech || "phrase",
          phonetic: w.phonetic || null,
          source_lang: w.source_lang || "en",
        })),
        theme: selectedTheme,
        level: "B1-B2",
      };

      const res = await fetch("/api/vocab/ai-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || "Không thể tạo câu chuyện AI");
      }

      const json = await res.json();
      if (json && json.data) {
        setStoryData(json.data);
      }
    } catch (err) {
      alert(`Lỗi AI: ${err.message || "Không thể kết nối máy chủ AI"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // TTS Read Story aloud
  const handleReadStory = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isReadingStory) {
      window.speechSynthesis.cancel();
      setIsReadingStory(false);
      return;
    }

    if (!storyData?.story_en) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(storyData.story_en);
    utter.lang = "en-US";
    utter.rate = 0.9;
    utter.onstart = () => setIsReadingStory(true);
    utter.onend = () => setIsReadingStory(false);
    utter.onerror = () => setIsReadingStory(false);
    window.speechSynthesis.speak(utter);
  }, [isReadingStory, storyData]);

  // Handle answering cloze question
  const handleSelectOption = (qIdx, chosenOpt, correctWord) => {
    if (userAnswers[qIdx] !== undefined) return;

    const isCorrect = chosenOpt.trim().toLowerCase() === correctWord.trim().toLowerCase();
    playSoundFeedback(isCorrect);
    setUserAnswers((prev) => ({
      ...prev,
      [qIdx]: { chosen: chosenOpt, isCorrect },
    }));

    if (isCorrect) {
      setQuizScore((s) => s + 1);
    }
  };

  // Highlight words in story
  const renderHighlightedStory = () => {
    if (!storyData?.story_en) return null;
    const targetSet = new Set((storyData.target_words || []).map((tw) => tw.word.toLowerCase()));

    const words = storyData.story_en.split(/(\s+|[.,!?;:"])/);
    return words.map((tokenStr, idx) => {
      const clean = tokenStr.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean && targetSet.has(clean)) {
        return (
          <span key={idx} className="ai-highlight-word" title="Từ vựng mục tiêu">
            {tokenStr}
          </span>
        );
      }
      return tokenStr;
    });
  };

  // If Not Authorized
  if (!isAuthorized) {
    return (
      <div className="exercise-modal-backdrop" onClick={onClose}>
        <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
          <div className="exercise-header">
            <button className="btn-ex-back" onClick={onBackToMenu}>
              <ArrowLeft size={16} /> <span>Menu</span>
            </button>
            <button className="btn-ex-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="ai-locked-card">
            <div className="ai-locked-icon">
              <Lock size={32} />
            </div>
            <h3 className="ai-locked-title">Tính Năng AI Đặc Quyền</h3>
            <p className="ai-locked-desc">
              Dạng bài tập <strong>AI Kể chuyện nối từ</strong> được bảo vệ chặt chẽ và chỉ cấp quyền
              cho các tài khoản quản trị được ủy quyền (tranhuunam23022000, vuthiquynhtrang...) nhằm quản lý chi phí API.
            </p>
            <button className="btn-flip-nav" style={{ margin: "0 auto" }} onClick={onBackToMenu}>
              <ArrowLeft size={16} /> <span>Quay lại chọn dạng bài tập khác</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-modal-backdrop" onClick={onClose}>
      <div
        className="exercise-modal-window"
        style={{ maxWidth: "800px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="exercise-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="btn-ex-back" onClick={onBackToMenu}>
              <ArrowLeft size={16} /> <span>Menu</span>
            </button>
            <div className="ex-header-divider" />
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>
              Dạng 6: AI Kể chuyện nối từ
            </span>
          </div>
          <button className="btn-ex-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Story Workspace Body */}
        <div className="exercise-body">
          <div className="ai-story-wrapper">
            {/* Config & Action */}
            <div className="ai-config-bar">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 600 }}>Chủ đề:</span>
                <select
                  className="ai-theme-select"
                  value={selectedTheme}
                  onChange={(e) => setSelectedTheme(e.target.value)}
                  disabled={isLoading}
                >
                  {STORY_THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                className="btn-ai-generate"
                onClick={handleGenerateStory}
                disabled={isLoading}
              >
                <Sparkles size={16} />
                <span>{isLoading ? "AI Đang sáng tác..." : "Sáng tác Câu Chuyện AI"}</span>
              </button>
            </div>

            {/* Generated Story Content */}
            {storyData ? (
              <>
                <div className="ai-story-card">
                  <div className="ai-story-header">
                    <h3 className="ai-story-title">📖 {storyData.title}</h3>
                    <div className="ai-story-actions">
                      <button type="button" className="btn-ai-audio" onClick={handleReadStory}>
                        <Volume2 size={16} color="var(--primary)" />
                        <span>{isReadingStory ? "Dừng đọc" : "Nghe đọc truyện"}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-ai-audio"
                        onClick={() => setShowTranslation((prev) => !prev)}
                      >
                        <Eye size={16} />
                        <span>{showTranslation ? "Ẩn dịch" : "Dịch tiếng Việt"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="ai-story-text-en">{renderHighlightedStory()}</div>

                  {showTranslation && (
                    <div className="ai-story-text-vi">{storyData.story_vi}</div>
                  )}
                </div>

                {/* Cloze Challenge Section */}
                {storyData.cloze_questions && storyData.cloze_questions.length > 0 && (
                  <div className="ai-quiz-section">
                    <h4 style={{ margin: "4px 0", fontSize: "1.05rem", fontWeight: 700 }}>
                      🎯 Thử thách điền từ khuyết theo ngữ cảnh ({quizScore} / {storyData.cloze_questions.length}):
                    </h4>

                    {storyData.cloze_questions.map((q, qIdx) => {
                      const answered = userAnswers[qIdx];
                      return (
                        <div key={qIdx} className="ai-quiz-card">
                          <div className="ai-quiz-question-text">
                            <strong>{qIdx + 1}.</strong> {q.sentence}
                            {q.hint && (
                              <span style={{ color: "var(--text-muted)", marginLeft: "8px", fontSize: "0.85rem" }}>
                                (Gợi ý: {q.hint})
                              </span>
                            )}
                          </div>

                          <div className="ai-quiz-options-grid">
                            {(q.options || []).map((opt, optIdx) => {
                              let btnClass = "btn-ai-option";
                              if (answered) {
                                if (opt.trim().toLowerCase() === q.correct_word.trim().toLowerCase()) {
                                  btnClass += " correct";
                                } else if (answered.chosen === opt) {
                                  btnClass += " wrong";
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  className={btnClass}
                                  disabled={Boolean(answered)}
                                  onClick={() => handleSelectOption(qIdx, opt, q.correct_word)}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              !isLoading && (
                <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)" }}>
                  <BookOpen size={48} style={{ opacity: 0.4, marginBottom: "12px" }} />
                  <p>Chọn chủ đề và nhấn <strong>"Sáng tác Câu Chuyện AI"</strong> để bắt đầu bài học!</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
