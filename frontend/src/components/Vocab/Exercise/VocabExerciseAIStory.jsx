import React, { useState, useMemo, useCallback } from "react";
import {
  Volume2,
  Lock,
  Sparkles,
  ArrowLeft,
  X,
  Eye,
  BookOpen,
  Lightbulb,
} from "../../Icons";
import { WordLookupPopover } from "../WordLookupPopover";
import { VocabExerciseAIStoryQuiz } from "./VocabExerciseAIStoryQuiz";
import {
  extractSentenceFromText,
  parseHighlightedStorySegments,
  checkTargetWordsCoverage,
} from "../../../utils/storyHighlightUtils";
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

  // Word Lookup Popover state (tra từ khi bôi đen hoặc click từ highlight)
  const [lookupWord, setLookupWord] = useState("");
  const [lookupTarget, setLookupTarget] = useState(null);
  const [lookupContext, setLookupContext] = useState("");

  // Coverage statistics of target words in story
  const coverageStats = useMemo(() => {
    if (!storyData?.story_en || !storyData?.target_words) {
      return { foundWords: new Set(), missingWords: [], coveragePercent: 0 };
    }
    return checkTargetWordsCoverage(storyData.story_en, storyData.target_words);
  }, [storyData]);

  // Generate Story from Backend
  const handleGenerateStory = async () => {
    if (!items || items.length === 0) return;
    setIsLoading(true);
    setStoryData(null);

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

  // Handle text selection in story for word lookup & saving
  const handleStoryMouseUp = (e) => {
    if (e?.target?.closest(".word-lookup-popover, button, select, input, textarea")) {
      return;
    }

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (!text || text.length > 80 || text.includes("\n")) {
      return;
    }

    const isChineseChar = /[\u4e00-\u9fff]/.test(text);
    if (text.length === 1 && !["a", "i", "A", "I"].includes(text) && !isChineseChar) {
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

    const ctx = extractSentenceFromText(storyData?.story_en, text);
    setLookupWord(text);
    setLookupTarget(range.cloneRange());
    setLookupContext(ctx);
  };

  // Handle clicking on pre-highlighted target words
  const handleHighlightWordClick = (e, word) => {
    e.stopPropagation();
    const cleanWord = (word || "").trim();
    if (!cleanWord) return;
    const ctx = extractSentenceFromText(storyData?.story_en, cleanWord);
    setLookupWord(cleanWord);
    setLookupTarget(e.currentTarget);
    setLookupContext(ctx);
  };

  const handleCloseLookup = () => {
    setLookupWord("");
    setLookupTarget(null);
    setLookupContext("");
  };

  // Highlight words & multi-word phrases in story
  const renderHighlightedStory = () => {
    if (!storyData?.story_en) return null;

    const segments = parseHighlightedStorySegments(
      storyData.story_en,
      storyData.target_words || []
    );

    return segments.map((seg, idx) => {
      if (seg.isTarget) {
        return (
          <span
            key={idx}
            className="ai-highlight-word"
            title="Nhấn để tra từ & xem nghĩa tiếng Việt"
            onClick={(e) => handleHighlightWordClick(e, seg.targetWord || seg.text)}
          >
            {seg.text}
          </span>
        );
      }
      return seg.text;
    });
  };

  // Normalize comprehension questions array
  const comprehensionQuestions = useMemo(() => {
    if (!storyData) return [];
    if (Array.isArray(storyData.comprehension_questions) && storyData.comprehension_questions.length > 0) {
      return storyData.comprehension_questions;
    }
    if (storyData.comprehension_question && typeof storyData.comprehension_question === "object") {
      return [storyData.comprehension_question];
    }
    return [];
  }, [storyData]);

  // If Not Authorized
  if (!isAuthorized) {
    return (
      <div className="exercise-modal-backdrop" onClick={onClose}>
        <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
          <div className="exercise-header">
            <button
              type="button"
              className="ex-back-menu-btn"
              onClick={onBackToMenu}
              title="Quay lại danh mục chọn dạng bài tập"
            >
              <ArrowLeft size={16} /> <span>Menu</span>
            </button>
            <button
              type="button"
              className="btn-ex-close"
              onClick={onClose}
              title="Đóng cửa sổ bài tập"
            >
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
            <button
              type="button"
              className="ex-back-menu-btn"
              style={{ margin: "0 auto", padding: "10px 18px" }}
              onClick={onBackToMenu}
            >
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
        {/* Header Bar */}
        <div className="exercise-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              className="ex-back-menu-btn"
              onClick={onBackToMenu}
              title="Quay lại danh mục chọn dạng bài tập"
            >
              <ArrowLeft size={16} /> <span>Menu</span>
            </button>
            <div className="ex-header-divider" />
            <span style={{ fontWeight: 700, color: "var(--primary)" }}>
              Dạng 6: AI Kể chuyện nối từ
            </span>
          </div>
          <button
            type="button"
            className="btn-ex-close"
            onClick={onClose}
            title="Đóng bài tập"
          >
            <X size={20} />
          </button>
        </div>

        {/* Story Workspace Body */}
        <div className="exercise-body">
          <div className="ai-story-wrapper">
            {/* Config & Action Bar */}
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
                {/* Target Vocabulary Chips Bar */}
                {storyData.target_words && storyData.target_words.length > 0 && (
                  <div className="ai-target-words-bar">
                    <div className="ai-target-words-title">
                      <Sparkles size={14} color="var(--primary)" />
                      <span>
                        Từ vựng mục tiêu trong bài ({storyData.target_words.length})
                      </span>
                    </div>
                    <div className="ai-target-chips-wrap">
                      {storyData.target_words.map((tw, idx) => {
                        const isFound = coverageStats.foundWords.has(tw.word.toLowerCase());
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`ai-target-chip ${isFound ? "found" : "missing"}`}
                            onClick={(e) => handleHighlightWordClick(e, tw.word)}
                            title={`Bấm để tra từ: ${tw.word}${isFound ? " (Đã có trong bài đọc)" : ""}`}
                          >
                            <span className="ai-chip-word">{tw.word}</span>
                            {tw.meaning && <span className="ai-chip-meaning">• {tw.meaning}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Main Story Reading Card */}
                <div className="ai-story-card">
                  <div className="ai-story-header">
                    <div className="ai-story-title-wrap">
                      <BookOpen size={20} color="var(--primary)" />
                      <h3 className="ai-story-title">{storyData.title}</h3>
                    </div>
                    <div className="ai-story-actions">
                      <button
                        type="button"
                        className="btn-ai-audio"
                        onClick={handleReadStory}
                        title="Nghe máy đọc câu chuyện tiếng Anh bằng giọng AI"
                      >
                        <Volume2 size={16} color="var(--primary)" />
                        <span>{isReadingStory ? "Dừng đọc" : "Nghe đọc truyện"}</span>
                      </button>
                      <button
                        type="button"
                        className="btn-ai-audio"
                        onClick={() => setShowTranslation((prev) => !prev)}
                        title="Bật/Tắt bản dịch song ngữ tiếng Việt"
                      >
                        <Eye size={16} />
                        <span>{showTranslation ? "Ẩn dịch" : "Dịch tiếng Việt"}</span>
                      </button>
                    </div>
                  </div>

                  <div
                    className="ai-story-text-en"
                    onMouseUp={handleStoryMouseUp}
                    title="Bôi đen bất kỳ từ hoặc cụm từ nào để tra cứu nghĩa và lưu vào Sổ từ vựng"
                  >
                    {renderHighlightedStory()}
                  </div>

                  <div className="ai-selection-hint">
                    <Lightbulb size={16} color="#eab308" />
                    <span>
                      <strong>Chọn từ mới:</strong> Bôi đen bất kỳ từ nào trong đoạn văn hoặc chạm vào từ màu tím để xem nghĩa &amp; lưu vào Sổ từ vựng!
                    </span>
                  </div>

                  {showTranslation && (
                    <div className="ai-story-text-vi">{storyData.story_vi}</div>
                  )}
                </div>

                {/* Word Lookup Popover for selected text or clicked highlight word */}
                {lookupWord && lookupTarget && (
                  <WordLookupPopover
                    word={lookupWord}
                    targetElement={lookupTarget}
                    contextSentence={lookupContext || storyData?.story_en || ""}
                    sourceLang="en"
                    targetLang="vi"
                    onClose={handleCloseLookup}
                  />
                )}

                {/* Quizzes: Cloze Fill-in-Blank & Reading Comprehension Questions */}
                <VocabExerciseAIStoryQuiz
                  clozeQuestions={storyData.cloze_questions || []}
                  comprehensionQuestions={comprehensionQuestions}
                />
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
