import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  PenTool,
  Sparkles,
  BookOpen,
  Clock,
  RotateCcw,
  Send,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Plus,
  Trash2,
  ChevronRight,
  History,
  Shield,
  Layers,
  ArrowRight,
  X,
  FileText,
  TrendingUp,
  BookmarkCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  fetchWritingPrompts,
  generateWritingPrompt,
  evaluateWriting,
  fetchWritingHistory,
  deleteSubmission,
} from "../services/writingService";
import { createVocabWord } from "../services/authVocabService";
import "../styles/writing.css";

const GENRES = [
  { id: "ielts_task2", label: "IELTS Task 2", sub: "Nghị luận xã hội / Essay", minWords: 250, defaultTime: 40 },
  { id: "ielts_task1", label: "IELTS Task 1", sub: "Phân tích biểu đồ / Quy trình", minWords: 150, defaultTime: 20 },
  { id: "email", label: "Business Email", sub: "Thư điện tử chuyên nghiệp", minWords: 120, defaultTime: 15 },
  { id: "paragraph", label: "Đoạn văn ngắn", sub: "Rèn luyện câu & từ vựng", minWords: 80, defaultTime: 10 },
  { id: "free", label: "Viết tự do", sub: "Nhật ký / Ý kiến cá nhân", minWords: 50, defaultTime: 20 },
];

const TARGET_BANDS = [
  { value: 6.0, label: "Band 6.0 (Competent)" },
  { value: 6.5, label: "Band 6.5 (Upper Intermediate)" },
  { value: 7.0, label: "Band 7.0 (Good User - Chuẩn du học)" },
  { value: 7.5, label: "Band 7.5 (Advanced User)" },
  { value: 8.0, label: "Band 8.0 (Very Good User)" },
  { value: 8.5, label: "Band 8.5+ (Expert User)" },
];

export const WritingPage = ({ isActive = false }) => {
  const { user, token, isAuthenticated, showToast, refreshSavedVocab } = useAuth();

  // Strict check if current user is one of the 2 authorized accounts
  const isAuthorized = useMemo(() => {
    if (!user) return false;
    if (user.can_use_ai_writing || user.can_use_ai_import) return true;
    const em = (user.email || "").toLowerCase();
    const nm = (user.name || "").toLowerCase();
    return (
      em.includes("tranhuunam23022000") ||
      em.includes("vuthiquynhtrang") ||
      em.includes("vuthiquynhtrangbl6d") ||
      nm.includes("tranhuunam23022000") ||
      nm.includes("vuthiquynhtrang")
    );
  }, [user]);

  // Prompt library and selection state
  const [promptsLibrary, setPromptsLibrary] = useState({});
  const [selectedGenre, setSelectedGenre] = useState("ielts_task2");
  const [targetBand, setTargetBand] = useState(7.0);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState("");

  // Editor state
  const [content, setContent] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Analysis / Result state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [activeRightTab, setActiveRightTab] = useState("feedback"); // "feedback" | "history"

  // History state
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [copiedModel, setCopiedModel] = useState(false);
  const [addedWords, setAddedWords] = useState({});

  const timerRef = useRef(null);

  // Load prompts on mount
  useEffect(() => {
    const loadPrompts = async () => {
      const data = await fetchWritingPrompts();
      setPromptsLibrary(data);
      if (data && data.ielts_task2 && data.ielts_task2.length > 0) {
        setCurrentPrompt(data.ielts_task2[0]);
      }
    };
    loadPrompts();
  }, []);

  // When changing genre, pick the first prompt of that genre
  useEffect(() => {
    if (promptsLibrary && promptsLibrary[selectedGenre] && promptsLibrary[selectedGenre].length > 0) {
      setCurrentPrompt(promptsLibrary[selectedGenre][0]);
      setIsCustomPrompt(false);
    }
  }, [selectedGenre, promptsLibrary]);

  // Load history when tab is opened
  useEffect(() => {
    if (isActive && token && activeRightTab === "history") {
      loadHistory();
    }
  }, [isActive, token, activeRightTab]);

  const loadHistory = async () => {
    if (!token) return;
    setIsLoadingHistory(true);
    try {
      const items = await fetchWritingHistory(token);
      setHistoryItems(items);
    } catch {
      // Ignore
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Start timer on first keystroke
  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (!isTimerRunning && val.trim().length > 0) {
      setIsTimerRunning(true);
    }
  };

  const wordCount = useMemo(() => {
    if (!content || !content.trim()) return 0;
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content]);

  const currentGenreObj = useMemo(() => {
    return GENRES.find((g) => g.id === selectedGenre) || GENRES[0];
  }, [selectedGenre]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleShufflePrompt = () => {
    const list = promptsLibrary[selectedGenre] || [];
    if (list.length <= 1) return;
    const currentIndex = list.findIndex((p) => p.id === currentPrompt?.id);
    const nextIndex = (currentIndex + 1) % list.length;
    setCurrentPrompt(list[nextIndex]);
    setIsCustomPrompt(false);
  };

  const handleGenerateAIPrompt = async () => {
    if (!isAuthorized) {
      showToast("Tính năng AI tạo đề bài chỉ dành riêng cho 2 tài khoản được cấp phép (tranhuunam23022000 & vuthiquynhtrangbl6d)", "warning");
      return;
    }
    setIsGeneratingPrompt(true);
    try {
      const p = await generateWritingPrompt({ genre: selectedGenre, token });
      if (p) {
        setCurrentPrompt(p);
        setIsCustomPrompt(false);
        showToast("Đã tạo đề bài mới thành công!", "success");
      }
    } catch (e) {
      showToast(e.message || "Lỗi khi tạo đề bài AI", "error");
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleReset = () => {
    if (content.trim().length > 0 && !window.confirm("Bạn có chắc muốn xóa toàn bộ bài viết để bắt đầu lại?")) {
      return;
    }
    setContent("");
    setIsTimerRunning(false);
    setSecondsElapsed(0);
  };

  const effectivePromptText = useMemo(() => {
    if (isCustomPrompt) return customPromptInput.trim();
    return currentPrompt?.prompt || "";
  }, [isCustomPrompt, customPromptInput, currentPrompt]);

  const handleSubmitEvaluation = async () => {
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để sử dụng tính năng nộp bài và chấm điểm AI", "info");
      return;
    }

    if (!isAuthorized) {
      showToast("Tính năng AI Chấm điểm Writing chỉ dành riêng cho tài khoản được cấp phép (tranhuunam23022000 & vuthiquynhtrangbl6d)", "warning");
      return;
    }

    if (!effectivePromptText) {
      showToast("Vui lòng chọn hoặc nhập đề bài trước khi nộp bài", "warning");
      return;
    }

    if (wordCount < 15) {
      showToast("Bài viết quá ngắn (tối thiểu 15 từ). Hãy viết thêm để AI có thể đánh giá học thuật chuẩn xác nhé!", "warning");
      return;
    }

    setIsEvaluating(true);
    setIsTimerRunning(false);
    setActiveRightTab("feedback");

    try {
      const res = await evaluateWriting({
        topic: effectivePromptText,
        content: content,
        genre: selectedGenre,
        targetBand: targetBand,
        token: token,
      });

      if (res && res.evaluation) {
        setEvaluationResult(res.evaluation);
        showToast("AI đã chấm bài hoàn tất!", "success");
        loadHistory();
      }
    } catch (e) {
      showToast(e.message || "Không thể chấm bài với AI", "error");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyModel = () => {
    if (evaluationResult?.model_essay) {
      navigator.clipboard.writeText(evaluationResult.model_essay);
      setCopiedModel(true);
      showToast("Đã sao chép bài viết mẫu Band 8.5+!", "success");
      setTimeout(() => setCopiedModel(false), 2000);
    }
  };

  const handleAddVocabToNotebook = async (vocabItem) => {
    if (!token) {
      showToast("Vui lòng đăng nhập để lưu từ vựng", "warning");
      return;
    }
    try {
      await createVocabWord(
        {
          word: vocabItem.word,
          meaning: vocabItem.meaning,
          phonetic: vocabItem.phonetic,
          context_sentence: vocabItem.context_sentence,
        },
        token
      );
      setAddedWords((prev) => ({ ...prev, [vocabItem.word]: true }));
      showToast(`Đã thêm "${vocabItem.word}" vào Sổ tay từ vựng!`, "success");
      if (refreshSavedVocab) refreshSavedVocab();
    } catch (e) {
      showToast(e.message || "Lỗi lưu từ vựng", "error");
    }
  };

  const handleDeleteHistoryItem = async (submissionId, e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này khỏi lịch sử?")) return;
    try {
      await deleteSubmission(submissionId, token);
      setHistoryItems((prev) => prev.filter((it) => it.id !== submissionId));
      showToast("Đã xóa bài viết khỏi lịch sử", "success");
    } catch (err) {
      showToast(err.message || "Không thể xóa bài viết", "error");
    }
  };

  const handleSelectHistoryItem = (item) => {
    setContent(item.content || "");
    if (item.feedback) {
      setEvaluationResult(item.feedback);
      setActiveRightTab("feedback");
    }
    if (item.topic) {
      setIsCustomPrompt(true);
      setCustomPromptInput(item.topic);
    }
  };

  return (
    <div className="writing-studio-container">
      {/* Top Header & Access Notice */}
      <div className="writing-header">
        <div className="writing-header-left">
          <div className="writing-badge-icon">
            <PenTool size={22} />
          </div>
          <div>
            <h1 className="writing-title">Luyện Viết Tiếng Anh AI (Writing Studio)</h1>
            <p className="writing-subtitle">
              Chấm điểm chuẩn IELTS Band 0 - 9.0, sửa lỗi ngữ pháp & nâng cấp từ vựng học thuật bằng Gemini AI
            </p>
          </div>
        </div>

        <div className="writing-header-right">
          {isAuthorized ? (
            <div className="writing-auth-tag authorized" title="Tài khoản của bạn đã được mở quyền AI Writing">
              <Sparkles size={14} />
              <span>AI Writing Coach: Đã kích hoạt</span>
            </div>
          ) : (
            <div className="writing-auth-tag restricted" title="Tính năng AI đang trong giai đoạn thử nghiệm cho 2 tài khoản được cấp phép">
              <Shield size={14} />
              <span>Chế độ thử nghiệm (tranhuunam23022000 & vuthiquynhtrangbl6d)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Studio Grid: Left (Editor) & Right (AI Feedback / History) */}
      <div className="writing-studio-layout">
        {/* Left Column: Topic, Controls, Textarea */}
        <div className="writing-editor-panel">
          {/* Genre selector tabs */}
          <div className="genre-nav-bar">
            {GENRES.map((g) => (
              <button
                key={g.id}
                className={`genre-btn ${selectedGenre === g.id ? "active" : ""}`}
                onClick={() => {
                  setSelectedGenre(g.id);
                  setEvaluationResult(null);
                }}
              >
                <span className="genre-btn-label">{g.label}</span>
                <span className="genre-btn-sub">{g.minWords} từ</span>
              </button>
            ))}
          </div>

          {/* Prompt card */}
          <div className="writing-prompt-card">
            <div className="prompt-card-header">
              <div className="prompt-tag-group">
                <span className="prompt-type-badge">{currentPrompt?.type || currentGenreObj.label}</span>
                <span className="prompt-target-pill">Mục tiêu: {currentGenreObj.minWords}+ từ</span>
              </div>
              <div className="prompt-action-group">
                <button
                  type="button"
                  className="btn-prompt-action"
                  onClick={handleShufflePrompt}
                  title="Đổi sang đề bài khác trong thư viện"
                >
                  <RotateCcw size={14} />
                  <span>Đổi đề bài</span>
                </button>
                <button
                  type="button"
                  className="btn-prompt-action ai-action"
                  onClick={handleGenerateAIPrompt}
                  disabled={isGeneratingPrompt || !isAuthorized}
                  title={isAuthorized ? "AI sinh ngẫu nhiên đề bài mới" : "Chỉ tài khoản được cấp phép mới dùng AI sinh đề"}
                >
                  <Sparkles size={14} />
                  <span>{isGeneratingPrompt ? "Đang tạo..." : "AI Tạo đề mới"}</span>
                </button>
                <button
                  type="button"
                  className={`btn-prompt-action ${isCustomPrompt ? "active" : ""}`}
                  onClick={() => setIsCustomPrompt(!isCustomPrompt)}
                  title="Tự nhập đề bài của riêng bạn"
                >
                  <FileText size={14} />
                  <span>Tự nhập đề</span>
                </button>
              </div>
            </div>

            {isCustomPrompt ? (
              <div className="custom-prompt-input-wrapper">
                <textarea
                  className="custom-prompt-textarea"
                  placeholder="Nhập đề bài tiếng Anh của bạn tại đây (ví dụ: In some countries, more and more people are becoming vegetarian...)..."
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  rows={3}
                />
              </div>
            ) : (
              <div className="prompt-body">
                <div className="prompt-text">
                  "{currentPrompt?.prompt || "Vui lòng chọn hoặc tạo đề bài..."}"
                </div>
                {currentPrompt?.keywords && currentPrompt.keywords.length > 0 && (
                  <div className="prompt-keywords-bar">
                    <span className="keywords-label">Gợi ý từ khóa:</span>
                    <div className="keywords-list">
                      {currentPrompt.keywords.map((kw, idx) => (
                        <span key={idx} className="keyword-chip">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Editor Workspace */}
          <div className="writing-workspace">
            <div className="workspace-toolbar">
              <div className="workspace-stats">
                <div className="stat-pill words">
                  <span className="stat-val">{wordCount}</span>
                  <span className="stat-unit">/{currentGenreObj.minWords} từ</span>
                </div>
                <div className="stat-pill timer">
                  <Clock size={14} />
                  <span className="stat-val">{formatTimer(secondsElapsed)}</span>
                  {isTimerRunning ? (
                    <span className="timer-dot active" title="Đang tính giờ"></span>
                  ) : (
                    <span className="timer-dot" title="Tạm dừng"></span>
                  )}
                </div>
              </div>

              <div className="workspace-options">
                <div className="target-band-select-wrapper" title="Chọn mục tiêu điểm để AI chấm sát chuẩn">
                  <span className="band-select-label">Mục tiêu:</span>
                  <select
                    className="band-select"
                    value={targetBand}
                    onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                  >
                    {TARGET_BANDS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="btn-workspace-clear"
                  onClick={handleReset}
                  title="Xóa làm lại bài viết"
                >
                  <RotateCcw size={14} />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            <textarea
              className="writing-textarea"
              placeholder="Bắt đầu viết bài luận tiếng Anh của bạn tại đây. Hệ thống tự động đếm từ và tính giờ..."
              value={content}
              onChange={handleContentChange}
              spellCheck={false}
            />

            {/* Submit Action Footer */}
            <div className="workspace-footer">
              <div className="footer-guide">
                {wordCount < currentGenreObj.minWords ? (
                  <span className="guide-alert">
                    Cần thêm {currentGenreObj.minWords - wordCount} từ để đạt mức tối thiểu chuẩn của dạng bài.
                  </span>
                ) : (
                  <span className="guide-success">
                    <CheckCircle2 size={15} /> Đã đạt số từ yêu cầu ({wordCount} từ).
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn-submit-essay"
                disabled={isEvaluating || wordCount < 15 || !isAuthorized}
                onClick={handleSubmitEvaluation}
                title={
                  !isAuthorized
                    ? "Chỉ tài khoản tranhuunam23022000 & vuthiquynhtrangbl6d mới được dùng AI chấm bài"
                    : wordCount < 15
                    ? "Viết tối thiểu 15 từ để nộp bài"
                    : "Nộp bài để AI chấm điểm và sửa lỗi chi tiết"
                }
              >
                {isEvaluating ? (
                  <>
                    <span className="spinner-sm"></span>
                    <span>AI đang phân tích & chấm bài...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Nộp bài & AI Chấm điểm</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Feedback / History */}
        <div className="writing-feedback-panel">
          {/* Tab selector */}
          <div className="feedback-nav-tabs">
            <button
              className={`feedback-nav-btn ${activeRightTab === "feedback" ? "active" : ""}`}
              onClick={() => setActiveRightTab("feedback")}
            >
              <Sparkles size={16} />
              <span>Kết quả chấm điểm AI</span>
            </button>
            <button
              className={`feedback-nav-btn ${activeRightTab === "history" ? "active" : ""}`}
              onClick={() => {
                setActiveRightTab("history");
                loadHistory();
              }}
            >
              <History size={16} />
              <span>Lịch sử bài viết ({historyItems.length})</span>
            </button>
          </div>

          <div className="feedback-body">
            {activeRightTab === "history" ? (
              <div className="history-tab-content">
                {isLoadingHistory ? (
                  <div className="history-loading">
                    <span className="spinner-sm"></span>
                    <span>Đang tải lịch sử bài viết...</span>
                  </div>
                ) : historyItems.length === 0 ? (
                  <div className="history-empty">
                    <FileText size={40} className="empty-icon" />
                    <h4>Chưa có bài viết nào</h4>
                    <p>Hãy hoàn thành bài viết đầu tiên và nộp để AI lưu trữ và theo dõi sự tiến bộ của bạn.</p>
                  </div>
                ) : (
                  <div className="history-list">
                    {historyItems.map((item) => (
                      <div
                        key={item.id}
                        className="history-card"
                        onClick={() => handleSelectHistoryItem(item)}
                      >
                        <div className="history-card-header">
                          <span className="history-genre-pill">{item.genre}</span>
                          <span className="history-band-pill">Band {item.overall_score || "N/A"}</span>
                          <button
                            type="button"
                            className="btn-del-history"
                            onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                            title="Xóa bài viết"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="history-topic-title" title={item.topic}>
                          {item.topic}
                        </div>
                        <div className="history-card-footer">
                          <span>{item.word_count} từ</span>
                          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString("vi-VN") : ""}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : isEvaluating ? (
              <div className="evaluating-state">
                <div className="evaluating-animation-card">
                  <div className="pulse-circle">
                    <Sparkles size={32} />
                  </div>
                  <h3>Giám khảo AI đang chấm bài</h3>
                  <p>Phân tích 4 tiêu chí chuẩn IELTS: Task Response, Coherence, Lexical Resource, và Ngữ pháp...</p>
                  <div className="evaluating-steps">
                    <div className="step-item active">✓ Đọc và đếm từ vựng</div>
                    <div className="step-item active">✓ Rà soát lỗi ngữ pháp và chính tả</div>
                    <div className="step-item active">⏳ Viết lại bản mẫu Band 8.5+</div>
                    <div className="step-item">⏳ Đề xuất nâng cấp từ vựng C1/C2</div>
                  </div>
                </div>
              </div>
            ) : evaluationResult ? (
              <div className="feedback-result-content">
                {/* Overall Score Badge */}
                <div className="score-hero-card">
                  <div className="score-circle-wrapper">
                    <div className="score-band-number">{evaluationResult.overall_score || "7.0"}</div>
                    <div className="score-band-sub">/ 9.0 Band</div>
                  </div>
                  <div className="score-summary-text">
                    <div className="score-summary-title">Đánh giá chung của Giám khảo AI</div>
                    <p className="score-summary-desc">{evaluationResult.summary_review}</p>
                  </div>
                </div>

                {/* 4 IELTS Criteria Grid */}
                <div className="criteria-grid">
                  <div className="criteria-card">
                    <div className="criteria-head">
                      <span>Task Response</span>
                      <strong className="criteria-score">{evaluationResult.criteria_scores?.task_response?.score || "N/A"}</strong>
                    </div>
                    <p className="criteria-feedback">{evaluationResult.criteria_scores?.task_response?.feedback}</p>
                  </div>

                  <div className="criteria-card">
                    <div className="criteria-head">
                      <span>Coherence & Cohesion</span>
                      <strong className="criteria-score">{evaluationResult.criteria_scores?.coherence_cohesion?.score || "N/A"}</strong>
                    </div>
                    <p className="criteria-feedback">{evaluationResult.criteria_scores?.coherence_cohesion?.feedback}</p>
                  </div>

                  <div className="criteria-card">
                    <div className="criteria-head">
                      <span>Lexical Resource</span>
                      <strong className="criteria-score">{evaluationResult.criteria_scores?.lexical_resource?.score || "N/A"}</strong>
                    </div>
                    <p className="criteria-feedback">{evaluationResult.criteria_scores?.lexical_resource?.feedback}</p>
                  </div>

                  <div className="criteria-card">
                    <div className="criteria-head">
                      <span>Grammar Range & Accuracy</span>
                      <strong className="criteria-score">{evaluationResult.criteria_scores?.grammatical_range_accuracy?.score || "N/A"}</strong>
                    </div>
                    <p className="criteria-feedback">{evaluationResult.criteria_scores?.grammatical_range_accuracy?.feedback}</p>
                  </div>
                </div>

                {/* Detailed Inline Corrections */}
                {evaluationResult.corrections && evaluationResult.corrections.length > 0 && (
                  <div className="section-block">
                    <div className="section-title">
                      <AlertTriangle size={17} className="text-warning" />
                      <span>Sửa lỗi chi tiết ({evaluationResult.corrections.length} vị trí)</span>
                    </div>
                    <div className="corrections-list">
                      {evaluationResult.corrections.map((corr, idx) => (
                        <div key={idx} className="correction-card">
                          <div className="corr-type-badge">{corr.type || "Grammar"}</div>
                          <div className="corr-diff">
                            <span className="diff-original">{corr.original}</span>
                            <ArrowRight size={13} className="diff-arrow" />
                            <span className="diff-corrected">{corr.corrected}</span>
                          </div>
                          <div className="corr-explanation">{corr.explanation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocabulary Upgrades */}
                {evaluationResult.vocab_upgrades && evaluationResult.vocab_upgrades.length > 0 && (
                  <div className="section-block">
                    <div className="section-title">
                      <Lightbulb size={17} className="text-primary" />
                      <span>Gợi ý nâng cấp từ vựng C1/C2 ({evaluationResult.vocab_upgrades.length} từ)</span>
                    </div>
                    <div className="vocab-upgrades-grid">
                      {evaluationResult.vocab_upgrades.map((v, idx) => (
                        <div key={idx} className="vocab-upgrade-card">
                          <div className="vu-header">
                            <div>
                              <strong className="vu-word">{v.word}</strong>
                              {v.phonetic && <span className="vu-phonetic">{v.phonetic}</span>}
                            </div>
                            <button
                              type="button"
                              className={`btn-add-vocab-quick ${addedWords[v.word] ? "added" : ""}`}
                              onClick={() => handleAddVocabToNotebook(v)}
                              disabled={addedWords[v.word]}
                              title="Thêm từ này vào Sổ tay từ vựng"
                            >
                              {addedWords[v.word] ? (
                                <>
                                  <BookmarkCheck size={13} />
                                  <span>Đã thêm</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={13} />
                                  <span>+ Sổ tay</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="vu-meaning">{v.meaning}</div>
                          {v.replace_for && (
                            <div className="vu-replace">
                              <span>Thay cho:</span> <del>{v.replace_for}</del>
                            </div>
                          )}
                          {v.context_sentence && (
                            <div className="vu-context">"{v.context_sentence}"</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Model Rewrite Essay */}
                {evaluationResult.model_essay && (
                  <div className="section-block">
                    <div className="section-title space-between">
                      <div className="title-left">
                        <Sparkles size={17} className="text-primary" />
                        <span>Bài viết mẫu Band 8.5+ (AI Polished Version)</span>
                      </div>
                      <button
                        type="button"
                        className="btn-copy-model"
                        onClick={handleCopyModel}
                      >
                        <Copy size={13} />
                        <span>{copiedModel ? "Đã chép" : "Sao chép"}</span>
                      </button>
                    </div>
                    <div className="model-essay-box">
                      {evaluationResult.model_essay}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="feedback-initial-guide">
                <div className="guide-hero-icon">
                  <PenTool size={36} />
                </div>
                <h3>Sẵn sàng chấm điểm bài viết</h3>
                <p>
                  Soạn thảo bài viết ở khung bên trái và bấm <strong>"Nộp bài & AI Chấm điểm"</strong> để nhận kết quả phân tích 4 tiêu chí chuẩn Cambridge IELTS.
                </p>

                <div className="criteria-intro-box">
                  <div className="ci-row">
                    <strong>1. Task Response (25%)</strong>
                    <span>Trả lời trọn vẹn yêu cầu đề bài, phát triển luận điểm rõ ràng.</span>
                  </div>
                  <div className="ci-row">
                    <strong>2. Coherence & Cohesion (25%)</strong>
                    <span>Mạch lạc ý tứ, liên kết đoạn văn chặt chẽ và từ nối tự nhiên.</span>
                  </div>
                  <div className="ci-row">
                    <strong>3. Lexical Resource (25%)</strong>
                    <span>Vốn từ học thuật, collocations chuẩn xác và hạn chế lặp từ.</span>
                  </div>
                  <div className="ci-row">
                    <strong>4. Grammatical Range & Accuracy (25%)</strong>
                    <span>Đa dạng cấu trúc câu đơn/phức và kiểm soát chính xác ngữ pháp.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
