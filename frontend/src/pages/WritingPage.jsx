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
  Search,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  fetchWritingPrompts,
  generateWritingPrompt,
  suggestWritingStructures,
  evaluateWriting,
  saveWritingSubmission,
  fetchWritingHistory,
  deleteSubmission,
} from "../services/writingService";
import { WRITING_CATEGORIES, WRITING_STRUCTURES } from "../constants/writingStructures";
import { createVocabWord } from "../services/authVocabService";
import "../styles/writing.css";

export const LANGUAGES = [
  { id: "en", label: "Tiếng Anh", native: "English", flag: "🇬🇧", system: "IELTS 0-9", unit: "từ" },
  { id: "ja", label: "Tiếng Nhật", native: "日本語", flag: "🇯🇵", system: "JLPT N1-N5", unit: "ký tự" },
  { id: "zh", label: "Tiếng Trung", native: "中文", flag: "🇨🇳", system: "HSK 1-6", unit: "chữ" },
  { id: "ko", label: "Tiếng Hàn", native: "한국어", flag: "🇰🇷", system: "TOPIK I-II", unit: "từ" },
  { id: "fr", label: "Tiếng Pháp", native: "Français", flag: "🇫🇷", system: "DELF/DALF", unit: "mots" },
  { id: "de", label: "Tiếng Đức", native: "Deutsch", flag: "🇩🇪", system: "TestDaF", unit: "Wörter" },
];

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
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false);
  const [customPromptInput, setCustomPromptInput] = useState("");

  // Editor state
  const [content, setContent] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Draft and Submission persistence state
  const [currentSubmissionId, setCurrentSubmissionId] = useState(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Structures & Collocations Modal State
  const [isStructuresOpen, setIsStructuresOpen] = useState(false);
  const [structuresTab, setStructuresTab] = useState("ai_topic"); // "ai_topic" | "general"
  const [aiTopicStructures, setAiTopicStructures] = useState([]);
  const [isLoadingAiStructures, setIsLoadingAiStructures] = useState(false);
  const [structureSearch, setStructureSearch] = useState("");
  const [structureBandFilter, setStructureBandFilter] = useState("all");
  const [structureCategoryFilter, setStructureCategoryFilter] = useState("all");

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
  const textareaRef = useRef(null);

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

  // Load history immediately on mount / when token becomes available
  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token, isActive]);

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

  // Local auto-save draft to prevent data loss on browser refresh
  useEffect(() => {
    if (content && content.trim().length > 0) {
      try {
        const draftKey = `writing_draft_${selectedGenre}`;
        localStorage.setItem(draftKey, JSON.stringify({
          content,
          genre: selectedGenre,
          submissionId: currentSubmissionId,
          timestamp: Date.now()
        }));
      } catch {}
    }
  }, [content, selectedGenre, currentSubmissionId]);

  // Start timer on first keystroke
  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    setHasUnsavedChanges(true);
    if (!isTimerRunning && val.trim().length > 0) {
      setIsTimerRunning(true);
    }
  };

  const currentLangObj = useMemo(() => {
    return LANGUAGES.find((l) => l.id === selectedLanguage) || LANGUAGES[0];
  }, [selectedLanguage]);

  const wordCount = useMemo(() => {
    if (!content || !content.trim()) return 0;
    // Japanese and Chinese do not use spaces between words, count characters
    if (selectedLanguage === "ja" || selectedLanguage === "zh") {
      return content.replace(/\s+/g, "").length;
    }
    return content.trim().split(/\s+/).filter(Boolean).length;
  }, [content, selectedLanguage]);

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
      const p = await generateWritingPrompt({ genre: selectedGenre, language: selectedLanguage, token });
      if (p) {
        setCurrentPrompt(p);
        setIsCustomPrompt(false);
        showToast(`Đã tạo đề bài mới (${currentLangObj.label}) thành công!`, "success");
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
    setCurrentSubmissionId(null);
    setLastSavedAt(null);
    setHasUnsavedChanges(false);
    setIsTimerRunning(false);
    setSecondsElapsed(0);
  };

  const effectivePromptText = useMemo(() => {
    if (isCustomPrompt) return customPromptInput.trim();
    return currentPrompt?.prompt || "";
  }, [isCustomPrompt, customPromptInput, currentPrompt]);

  // Filter structures list by Search, Band, and Category
  const filteredStructures = useMemo(() => {
    return WRITING_STRUCTURES.filter((item) => {
      if (structureBandFilter !== "all" && item.band !== structureBandFilter) {
        return false;
      }
      if (structureCategoryFilter !== "all" && item.category !== structureCategoryFilter) {
        return false;
      }
      if (structureSearch.trim()) {
        const q = structureSearch.toLowerCase();
        const matchPhrase = (item.phrase || "").toLowerCase().includes(q);
        const matchMeaning = (item.meaning || "").toLowerCase().includes(q);
        const matchUsage = (item.usage || "").toLowerCase().includes(q);
        return matchPhrase || matchMeaning || matchUsage;
      }
      return true;
    });
  }, [structureBandFilter, structureCategoryFilter, structureSearch]);

  // Insert selected structure / phrase at the current cursor position in the editor
  const handleInsertPhrase = (templateText) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => (prev ? `${prev} ${templateText}` : templateText));
      setHasUnsavedChanges(true);
      setIsTimerRunning(true);
      showToast("Đã chèn cụm từ vào bài viết!", "success");
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const sepBefore = before.length > 0 && !before.endsWith(" ") && !before.endsWith("\n") ? " " : "";
    const sepAfter = after.length > 0 && !after.startsWith(" ") && !after.startsWith("\n") ? " " : "";
    const newContent = before + sepBefore + templateText + sepAfter + after;

    setContent(newContent);
    setHasUnsavedChanges(true);
    setIsTimerRunning(true);
    setIsStructuresOpen(false); // Close modal to continue writing

    setTimeout(() => {
      textarea.focus();
      const newPos = (before + sepBefore + templateText).length;
      textarea.setSelectionRange(newPos, newPos);
    }, 60);

    showToast("Đã chèn cấu trúc vào bài viết!", "success");
  };

  // AI suggest topic-tailored structures & collocations
  const handleAiSuggestStructures = async () => {
    if (!isAuthorized) {
      showToast("Tính năng AI gợi ý cấu trúc chỉ dành riêng cho 2 tài khoản được cấp phép (tranhuunam23022000 & vuthiquynhtrangbl6d)", "warning");
      return;
    }
    if (!effectivePromptText) {
      showToast("Vui lòng chọn hoặc nhập đề bài trước để AI phân tích cấu trúc phù hợp!", "warning");
      return;
    }

    setIsLoadingAiStructures(true);
    setIsStructuresOpen(true);
    setStructuresTab("ai_topic");

    try {
      const res = await suggestWritingStructures({
        topic: effectivePromptText,
        language: selectedLanguage,
        targetBand: targetBand,
        genre: selectedGenre,
        token: token,
      });

      if (res && res.structures) {
        setAiTopicStructures(res.structures);
        showToast(`AI đã gợi ý ${res.structures.length} cấu trúc & cụm từ chuẩn cho đề bài!`, "success");
      }
    } catch (err) {
      showToast(err.message || "Lỗi khi AI phân tích cấu trúc", "error");
    } finally {
      setIsLoadingAiStructures(false);
    }
  };

  // Save current writing as a draft in database
  const handleSaveDraft = async () => {
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để lưu bài viết", "info");
      return;
    }
    if (!isAuthorized) {
      showToast("Tính năng AI Writing chỉ dành riêng cho 2 tài khoản được cấp phép (tranhuunam23022000 & vuthiquynhtrangbl6d)", "warning");
      return;
    }
    if (!effectivePromptText) {
      showToast("Vui lòng chọn hoặc nhập đề bài trước khi lưu", "warning");
      return;
    }
    if (!content.trim()) {
      showToast("Chưa có nội dung bài viết để lưu", "warning");
      return;
    }

    setIsSavingDraft(true);
    try {
      const res = await saveWritingSubmission({
        submissionId: currentSubmissionId,
        topic: effectivePromptText,
        content: content,
        genre: selectedGenre,
        targetBand: targetBand,
        language: selectedLanguage,
        token: token,
      });

      if (res && res.submission_id) {
        setCurrentSubmissionId(res.submission_id);
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        setLastSavedAt(timeStr);
        setHasUnsavedChanges(false);
        showToast("Đã lưu bản nháp bài viết thành công!", "success");
        loadHistory();
      }
    } catch (err) {
      showToast(err.message || "Lỗi khi lưu bài viết", "error");
    } finally {
      setIsSavingDraft(false);
    }
  };

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
      showToast(`Bài viết quá ngắn (tối thiểu 15 ${currentLangObj.unit}). Hãy viết thêm để AI có thể đánh giá học thuật chuẩn xác nhé!`, "warning");
      return;
    }

    setIsEvaluating(true);
    setIsTimerRunning(false);
    setActiveRightTab("feedback");

    try {
      const res = await evaluateWriting({
        submissionId: currentSubmissionId,
        topic: effectivePromptText,
        content: content,
        genre: selectedGenre,
        targetBand: targetBand,
        language: selectedLanguage,
        token: token,
      });

      if (res && res.evaluation) {
        if (res.submission_id) setCurrentSubmissionId(res.submission_id);
        setEvaluationResult(res.evaluation);
        setHasUnsavedChanges(false);
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
      if (currentSubmissionId === submissionId) {
        setCurrentSubmissionId(null);
      }
      showToast("Đã xóa bài viết khỏi lịch sử", "success");
    } catch (err) {
      showToast(err.message || "Không thể xóa bài viết", "error");
    }
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentSubmissionId(item.id);
    setContent(item.content || "");
    if (item.genre) setSelectedGenre(item.genre);
    if (item.target_band) setTargetBand(item.target_band);
    if (item.language) setSelectedLanguage(item.language);
    if (item.topic) {
      setIsCustomPrompt(true);
      setCustomPromptInput(item.topic);
    }
    if (item.feedback) {
      setEvaluationResult(item.feedback);
      setActiveRightTab("feedback");
      showToast("Đã tải bài viết và kết quả chấm điểm!", "success");
    } else {
      setEvaluationResult(null);
      showToast("Đã tải bản nháp bài viết!", "info");
    }
    setHasUnsavedChanges(false);
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
            <h1 className="writing-title">Luyện Viết Học Thuật AI ({currentLangObj.label})</h1>
            <p className="writing-subtitle">
              Chấm điểm chuẩn {currentLangObj.system}, sửa lỗi ngữ pháp & nâng cấp từ vựng học thuật đa ngôn ngữ bằng Gemini AI
            </p>
          </div>
        </div>

        <div className="writing-header-right">
          {/* Multi-language Selector */}
          <div className="language-selector-badge" title="Chọn ngôn ngữ luyện viết (Anh, Nhật, Trung, Hàn, Pháp, Đức)">
            <Globe size={15} color="var(--primary)" />
            <select
              className="language-select-dropdown"
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setAiTopicStructures([]);
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.flag} {lang.label} ({lang.native})
                </option>
              ))}
            </select>
          </div>

          {isAuthorized ? (
            <div className="writing-auth-tag authorized" title="Tài khoản của bạn đã được mở quyền AI Writing">
              <Sparkles size={14} />
              <span>AI Writing: Sẵn sàng</span>
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
                  placeholder={`Nhập đề bài ${currentLangObj.label.toLowerCase()} của bạn tại đây...`}
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
              {/* Row 1: Word Count, Timer, Save Status & Target Band Controls */}
              <div className="workspace-stats-row">
                <div className="workspace-stats">
                  <div className="stat-pill words">
                    <span className="stat-val">{wordCount}</span>
                    <span className="stat-unit">/{currentGenreObj.minWords} {currentLangObj.unit}</span>
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

                  {/* Save status badge */}
                  <div className="save-status-indicator" title="Trạng thái lưu trữ bài viết">
                    <span className={`save-status-dot ${hasUnsavedChanges ? "unsaved" : "saved"}`}></span>
                    <span>
                      {isSavingDraft
                        ? "Đang lưu..."
                        : lastSavedAt
                        ? `Đã lưu ${lastSavedAt}`
                        : hasUnsavedChanges
                        ? "Chưa lưu"
                        : "Sẵn sàng"}
                    </span>
                  </div>
                </div>

                <div className="workspace-options">
                  <div className="target-band-select-wrapper" title="Chọn mục tiêu điểm để AI chấm sát chuẩn">
                    <span className="band-select-label">Mục tiêu:</span>
                    <select
                      className="band-select"
                      value={targetBand}
                      onChange={(e) => {
                        setTargetBand(parseFloat(e.target.value));
                        setHasUnsavedChanges(true);
                      }}
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

              {/* Row 2: Prominent Action Buttons */}
              <div className="workspace-actions-row">
                <button
                  type="button"
                  className="btn-workspace-structures"
                  onClick={() => {
                    setStructuresTab("general");
                    setIsStructuresOpen(true);
                  }}
                  title="Mở kho cụm từ học thuật, collocations & cấu trúc câu theo Band"
                >
                  <BookOpen size={16} />
                  <span>Kho Cụm từ & Cấu trúc theo Band</span>
                </button>

                <button
                  type="button"
                  className="btn-workspace-ai-suggest"
                  onClick={handleAiSuggestStructures}
                  disabled={isLoadingAiStructures || !isAuthorized || !effectivePromptText}
                  title="AI phân tích đề bài và gợi ý collocations & câu dẫn luận điểm chuyên biệt"
                >
                  <Sparkles size={16} />
                  <span>{isLoadingAiStructures ? "Đang phân tích..." : "✨ AI gợi ý theo đề"}</span>
                </button>

                <button
                  type="button"
                  className="btn-workspace-save"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || !isAuthorized || !content.trim()}
                  title={
                    !isAuthorized
                      ? "Chỉ 2 tài khoản được cấp phép mới dùng tính năng này"
                      : !content.trim()
                      ? "Viết nội dung để lưu nháp"
                      : "Lưu lại bài viết vào lịch sử dưới dạng bản nháp chưa chấm điểm"
                  }
                >
                  <BookmarkCheck size={16} />
                  <span>{isSavingDraft ? "Đang lưu..." : "💾 Lưu nháp (chưa chấm)"}</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              className="writing-textarea"
              placeholder={`Bắt đầu viết bài luận ${currentLangObj.label.toLowerCase()} của bạn tại đây. Hệ thống tự động đếm ${currentLangObj.unit} và tính giờ...`}
              value={content}
              onChange={handleContentChange}
              spellCheck={false}
            />

            {/* Submit Action Footer */}
            <div className="workspace-footer">
              <div className="footer-guide">
                {wordCount < currentGenreObj.minWords ? (
                  <span className="guide-alert">
                    Cần thêm {currentGenreObj.minWords - wordCount} {currentLangObj.unit} để đạt mức tối thiểu chuẩn của dạng bài.
                  </span>
                ) : (
                  <span className="guide-success">
                    <CheckCircle2 size={15} /> Đã đạt số lượng yêu cầu ({wordCount} {currentLangObj.unit}).
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
                        className={`history-card ${item.id === currentSubmissionId ? "active" : ""}`}
                        onClick={() => handleSelectHistoryItem(item)}
                        title="Bấm để mở lại bài viết này trong trình soạn thảo"
                      >
                        <div className="history-card-header">
                          <span className="history-genre-pill">{item.genre}</span>
                          {item.language && (
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}>
                              {LANGUAGES.find((l) => l.id === item.language)?.flag || "🌐"} {item.language.toUpperCase()}
                            </span>
                          )}
                          {item.overall_score ? (
                            <span className="history-band-pill">Band {item.overall_score}</span>
                          ) : (
                            <span className="history-draft-pill">Bản nháp</span>
                          )}
                          {item.id === currentSubmissionId && (
                            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#7c3aed", background: "rgba(124, 58, 237, 0.12)", padding: "2px 6px", borderRadius: "4px" }}>
                              Đang soạn
                            </span>
                          )}
                          <button
                            type="button"
                            className="btn-del-history"
                            onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                            title="Xóa bài viết khỏi lịch sử"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div className="history-topic-title" title={item.topic}>
                          {item.topic}
                        </div>
                        {item.content && (
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "4px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.45 }}>
                            {item.content}
                          </div>
                        )}
                        <div className="history-card-footer">
                          <span>{item.word_count || 0} {LANGUAGES.find((l) => l.id === item.language)?.unit || "từ"}</span>
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

      {/* Modal: Kho Cụm từ & Cấu trúc (AI Topic Suggestions & Thư viện mẫu) */}
      {isStructuresOpen && (
        <div className="structures-modal-backdrop" onClick={() => setIsStructuresOpen(false)}>
          <div className="structures-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="structures-modal-header">
              <div className="structures-modal-title-group">
                <div className="structures-modal-icon">
                  {structuresTab === "ai_topic" ? <Sparkles size={20} /> : <BookOpen size={20} />}
                </div>
                <div>
                  <h3 className="structures-modal-title">
                    {structuresTab === "ai_topic"
                      ? `Cụm Từ & Cấu Trúc Gợi Ý Theo Đề (${currentLangObj.label})`
                      : "Kho Cụm Từ & Cấu Trúc Học Thuật"}
                  </h3>
                  <p className="structures-modal-subtitle">
                    {structuresTab === "ai_topic"
                      ? "Gemini AI phân tích trực tiếp đề bài để đề xuất luận điểm, collocations & cấu trúc phù hợp"
                      : "Tuyển tập collocations, câu dẫn luận điểm & cấu trúc ngữ pháp học thuật (Band 6.5 - 9.0)"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-structures"
                onClick={() => setIsStructuresOpen(false)}
                title="Đóng cửa sổ"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab switcher: AI gợi ý theo đề vs Thư viện mẫu */}
            <div style={{ padding: "12px 24px 0 24px", background: "var(--bg-card)" }}>
              <div className="structures-tab-switcher">
                <button
                  type="button"
                  className={`structures-tab-btn ${structuresTab === "ai_topic" ? "active" : ""}`}
                  onClick={() => setStructuresTab("ai_topic")}
                >
                  <Sparkles size={14} />
                  <span>✨ Gợi ý theo đề bài ({aiTopicStructures.length})</span>
                </button>
                <button
                  type="button"
                  className={`structures-tab-btn ${structuresTab === "general" ? "active" : ""}`}
                  onClick={() => setStructuresTab("general")}
                >
                  <BookOpen size={14} />
                  <span>📚 Thư viện mẫu câu học thuật</span>
                </button>
              </div>
            </div>

            {structuresTab === "ai_topic" ? (
              <>
                <div style={{ padding: "12px 24px", background: "var(--bg-card)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Đề bài:</span>
                    <span style={{ maxWidth: "420px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontStyle: "italic" }}>
                      "{effectivePromptText || "Chưa có đề bài"}"
                    </span>
                    <span style={{ fontSize: "0.72rem", background: "var(--bg-secondary)", padding: "2px 8px", borderRadius: "12px", border: "1px solid var(--border-color)", fontWeight: 700 }}>
                      {currentLangObj.flag} {currentLangObj.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-workspace-ai-suggest"
                    onClick={handleAiSuggestStructures}
                    disabled={isLoadingAiStructures || !isAuthorized || !effectivePromptText}
                    style={{ padding: "5px 12px", fontSize: "0.8rem" }}
                  >
                    <Sparkles size={13} />
                    <span>{isLoadingAiStructures ? "Đang phân tích..." : "🔄 AI phân tích lại"}</span>
                  </button>
                </div>

                <div className="structures-modal-body">
                  {isLoadingAiStructures ? (
                    <div style={{ textAlign: "center", padding: "50px 20px" }}>
                      <span className="spinner-sm" style={{ width: "28px", height: "28px", marginBottom: "12px" }}></span>
                      <p style={{ fontWeight: 700, color: "var(--text-primary)", margin: "8px 0 4px 0" }}>
                        Gemini AI đang phân tích đề bài...
                      </p>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                        Đang chọn lọc collocations sát đề, câu mở đoạn, lập luận & phản biện chuẩn học thuật {currentLangObj.system}
                      </p>
                    </div>
                  ) : aiTopicStructures.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
                      <Sparkles size={40} style={{ color: "#ec4899", marginBottom: "12px", opacity: 0.85 }} />
                      <h4 style={{ margin: "0 0 8px 0", color: "var(--text-primary)", fontSize: "1.05rem" }}>
                        Chưa có gợi ý AI riêng cho đề bài này
                      </h4>
                      <p style={{ margin: "0 0 20px 0", fontSize: "0.86rem", maxWidth: "460px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
                        Bấm nút bên dưới để Gemini AI đọc đề bài ({currentLangObj.label}), trích xuất các luận điểm cốt lõi và gợi ý ngay các cụm từ & cấu trúc câu sắc bén nhất.
                      </p>
                      <button
                        type="button"
                        className="btn-workspace-ai-suggest"
                        onClick={handleAiSuggestStructures}
                        disabled={isLoadingAiStructures || !isAuthorized || !effectivePromptText}
                        style={{ margin: "0 auto", padding: "8px 22px", fontSize: "0.9rem" }}
                      >
                        <Sparkles size={16} />
                        <span>✨ Bấm để AI phân tích & gợi ý theo đề</span>
                      </button>
                    </div>
                  ) : (
                    aiTopicStructures.map((item, idx) => (
                      <div key={idx} className="structure-card-item">
                        <div className="structure-card-top">
                          <span className="structure-band-tag band8">
                            {item.band || `Target ${targetBand}`}
                          </span>
                          <span style={{ fontSize: "0.74rem", color: "#ec4899", textTransform: "uppercase", fontWeight: 700, background: "rgba(236, 72, 153, 0.1)", padding: "2px 8px", borderRadius: "4px" }}>
                            {item.type || "Cấu trúc gợi ý"}
                          </span>
                        </div>
                        <div className="structure-phrase-text">{item.phrase}</div>
                        <div className="structure-meaning-text">{item.meaning}</div>
                        {item.usage && <div className="structure-usage-note">{item.usage}</div>}
                        <div className="structure-actions-row">
                          <button
                            type="button"
                            className="btn-copy-structure"
                            onClick={() => {
                              navigator.clipboard.writeText(item.template || item.phrase);
                              showToast("Đã sao chép cấu trúc!", "success");
                            }}
                            title="Sao chép vào clipboard"
                          >
                            <Copy size={13} />
                            <span>Sao chép</span>
                          </button>
                          <button
                            type="button"
                            className="btn-insert-structure"
                            onClick={() => handleInsertPhrase(item.template || item.phrase)}
                            title="Chèn ngay vào con trỏ bài viết"
                          >
                            <Plus size={14} />
                            <span>Chèn vào bài</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="structures-modal-toolbar">
                  <div className="structures-search-box">
                    <Search size={16} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm mẫu câu, cụm từ, nghĩa tiếng Việt (ví dụ: debate, rationale, inversion, consensus...)..."
                      value={structureSearch}
                      onChange={(e) => setStructureSearch(e.target.value)}
                      autoFocus
                    />
                    {structureSearch && (
                      <button
                        type="button"
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px" }}
                        onClick={() => setStructureSearch("")}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="structures-filters-row">
                    {/* Band Pills */}
                    <div className="band-filter-pills">
                      {[
                        { id: "all", label: "Tất cả Band" },
                        { id: "band8", label: "Band 8.0 - 9.0" },
                        { id: "band7", label: "Band 7.0 - 7.5" },
                        { id: "band6", label: "Band 6.0 - 6.5" },
                      ].map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          className={`band-filter-btn ${structureBandFilter === b.id ? "active" : ""}`}
                          onClick={() => setStructureBandFilter(b.id)}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>

                    {/* Categories */}
                    <div className="structures-category-nav">
                      {WRITING_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          className={`cat-filter-btn ${structureCategoryFilter === cat.id ? "active" : ""}`}
                          onClick={() => setStructureCategoryFilter(cat.id)}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="structures-modal-body">
                  {filteredStructures.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                      <FileText size={36} style={{ opacity: 0.4, marginBottom: "8px" }} />
                      <p>Không tìm thấy cụm từ hay cấu trúc phù hợp với bộ lọc hiện tại.</p>
                    </div>
                  ) : (
                    filteredStructures.map((item, idx) => (
                      <div key={idx} className="structure-card-item">
                        <div className="structure-card-top">
                          <span className={`structure-band-tag ${item.band}`}>
                            {item.band === "band8" ? "Band 8.0 - 9.0" : item.band === "band7" ? "Band 7.0 - 7.5" : "Band 6.0 - 6.5"}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                            {WRITING_CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                          </span>
                        </div>
                        <div className="structure-phrase-text">{item.phrase}</div>
                        <div className="structure-meaning-text">{item.meaning}</div>
                        {item.usage && <div className="structure-usage-note">{item.usage}</div>}
                        <div className="structure-actions-row">
                          <button
                            type="button"
                            className="btn-copy-structure"
                            onClick={() => {
                              navigator.clipboard.writeText(item.template || item.phrase);
                              showToast("Đã sao chép cấu trúc!", "success");
                            }}
                            title="Sao chép vào clipboard"
                          >
                            <Copy size={13} />
                            <span>Sao chép</span>
                          </button>
                          <button
                            type="button"
                            className="btn-insert-structure"
                            onClick={() => handleInsertPhrase(item.template || item.phrase)}
                            title="Chèn ngay vào con trỏ bài viết"
                          >
                            <Plus size={14} />
                            <span>Chèn vào bài</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
