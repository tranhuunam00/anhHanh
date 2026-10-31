import React, { useState, useMemo } from "react";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { canUseIeltsAiGrading } from "../../utils/ieltsScoring.js";
import { Sparkles, Clock, CheckCircle } from "../../constants/icons.js";

/**
 * IELTS Academic Writing Test Module (Exam-Standard UI)
 * Features:
 * - Left Pane: Official Prompt, Diagram (Task 1), and Band 7.0+ Structure & Strategy Guide
 * - Right Pane: Professional Word Processor, live word counter with progress indicator, and AI Scoring
 */
export const IeltsWritingModule = ({
  writingData,
  user = null,
  token = null
}) => {
  const [activeTask, setActiveTask] = useState(2); // Task 2 loaded first for essay practice

  const tasks = writingData?.tasks || [];
  const currentTask = tasks.find((t) => t.taskNumber === activeTask) || tasks[0];

  // Essays stored per task in state & localStorage
  const [essays, setEssays] = useState(() => {
    try {
      const saved1 = localStorage.getItem("ielts_essay_cam21_t2_1");
      const saved2 = localStorage.getItem("ielts_essay_cam21_t2_2");
      return { 1: saved1 || "", 2: saved2 || "" };
    } catch {
      return { 1: "", 2: "" };
    }
  });

  // AI Evaluation results & loading
  const [evalResults, setEvalResults] = useState({});
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  const currentEssay = essays[activeTask] || "";

  const wordCount = useMemo(() => {
    const trimmed = currentEssay.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [currentEssay]);

  const charCount = currentEssay.length;

  const handleEssayChange = (val) => {
    setEssays((prev) => {
      const next = { ...prev, [activeTask]: val };
      try {
        localStorage.setItem(`ielts_essay_cam21_t2_${activeTask}`, val);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isAuthorized = canUseIeltsAiGrading(user);

  const handleEvaluateAi = async () => {
    if (!isAuthorized) return;
    if (wordCount < 15) {
      setAiError("Bài viết cần tối thiểu 15 từ để AI có thể đánh giá học thuật.");
      return;
    }
    setAiError("");
    setIsLoadingAi(true);

    try {
      const res = await fetch("/api/writing/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: currentTask.prompt,
          content: currentEssay,
          target_band: 7.5,
          genre: activeTask === 1 ? "ielts_task1" : "ielts_task2",
          language: "en"
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Không thể kết nối đến dịch vụ chấm điểm AI.");
      }

      const data = await res.json();
      setEvalResults((prev) => ({ ...prev, [activeTask]: data }));
    } catch (err) {
      setAiError(err.message || "Lỗi khi chấm điểm bài viết.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Left Pane: Official Prompt & Structure Strategy Guide
  const leftPaneContent = (
    <div className="ielts-left-scroll-pane ielts-writing-prompt-pane">
      {/* Task Switcher Tabs */}
      <div className="ielts-writing-task-tabs">
        {tasks.map((t) => (
          <button
            key={t.taskNumber}
            type="button"
            className={`ielts-writing-task-btn ${activeTask === t.taskNumber ? "active" : ""}`}
            onClick={() => setActiveTask(t.taskNumber)}
          >
            <span>{t.title}</span>
            <span className="ielts-tab-subrange">(Tối thiểu {t.minWords} từ)</span>
          </button>
        ))}
      </div>

      {/* Official Exam Prompt Card */}
      <div className="ielts-writing-prompt-card">
        <div className="ielts-writing-prompt-header">
          <span className="ielts-prompt-tag-badge">IELTS ACADEMIC WRITING • {currentTask.title.toUpperCase()}</span>
          <span className="ielts-time-hint">
            <Clock className="w-4 h-4 mr-1 text-primary inline" />
            {currentTask.timeSuggestion}
          </span>
        </div>

        <div className="ielts-writing-instructions">
          {currentTask.prompt.split("\n\n").map((para, i) => {
            if (i === 0 && activeTask === 2) {
              return (
                <div key={i} className="ielts-prompt-quote-box">
                  {para}
                </div>
              );
            }
            return (
              <p key={i} className="ielts-prompt-action-text">{para}</p>
            );
          })}
        </div>

        {/* Task 1 Diagram Image */}
        {currentTask.image && (
          <div className="ielts-writing-image-wrap">
            <h5 className="ielts-diagram-title">{currentTask.diagramTitle}</h5>
            <img
              src={currentTask.image}
              alt="IELTS Writing Task 1 diagram"
              className="ielts-writing-diagram-img"
            />
          </div>
        )}
      </div>
    </div>
  );

  // Right Pane: Essay Editor & Live Word Processor
  const rightPaneContent = (
    <div className="ielts-right-scroll-pane ielts-writing-editor-pane">
      <div className="ielts-editor-toolbar">
        <div className="ielts-word-counter-badge">
          <span>Số từ: <strong>{wordCount}</strong> / {currentTask.minWords} từ</span>
          <span className={`ielts-word-progress-ring ${wordCount >= currentTask.minWords ? "met" : ""}`}>
            {wordCount >= currentTask.minWords ? (
              <span><CheckCircle className="w-3.5 h-3.5 inline mr-1 text-success" /> Đạt yêu cầu độ dài ({wordCount} từ)</span>
            ) : (
              <span>Cần thêm {currentTask.minWords - wordCount} từ</span>
            )}
          </span>
        </div>

        <div className="ielts-editor-actions">
          <span className="ielts-autosave-tag">✓ Đã lưu tự động</span>

          {/* AI Scoring Button */}
          {isAuthorized ? (
            <button
              type="button"
              className="ielts-ai-eval-btn"
              onClick={handleEvaluateAi}
              disabled={isLoadingAi || wordCount < 15}
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              {isLoadingAi ? "AI đang chấm điểm..." : "Chấm điểm AI"}
            </button>
          ) : (
            <span className="ielts-ai-restricted-badge" title="Tính năng AI chấm điểm dành riêng cho 3 tài khoản được cấp phép">
              🔒 AI chấm điểm (Cần cấp phép)
            </span>
          )}
        </div>
      </div>

      {aiError && <div className="ielts-error-banner">{aiError}</div>}

      <div className="ielts-editor-container">
        <textarea
          value={currentEssay}
          onChange={(e) => handleEssayChange(e.target.value)}
          placeholder={`Nhập bài viết ${currentTask.title} của bạn tại đây theo đúng chuẩn thi IELTS...`}
          className="ielts-essay-textarea"
          rows={18}
        />
        <div className="ielts-editor-footer-status">
          <span>Độ dài: {wordCount} từ ({charCount} ký tự)</span>
          <span>Phím tắt: Bài viết được tự động lưu vào trình duyệt liên tục.</span>
        </div>
      </div>

      {/* AI Evaluation Result Card */}
      {evalResults[activeTask] && (
        <div className="ielts-ai-result-card">
          <div className="ielts-ai-result-header">
            <span className="ielts-ai-band-badge">
              IELTS Band: {evalResults[activeTask].overall_band || evalResults[activeTask].band || "N/A"}
            </span>
            <span className="ielts-ai-evaluated-date">Đã chấm bởi Gemini AI • Chuẩn IELTS 9.0</span>
          </div>

          <div className="ielts-ai-subscores-grid">
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Task Response</span>
              <span className="ielts-subscore-val">{evalResults[activeTask].task_response_score || "-"}</span>
            </div>
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Coherence & Cohesion</span>
              <span className="ielts-subscore-val">{evalResults[activeTask].coherence_cohesion_score || "-"}</span>
            </div>
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Lexical Resource</span>
              <span className="ielts-subscore-val">{evalResults[activeTask].lexical_resource_score || "-"}</span>
            </div>
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Grammar & Accuracy</span>
              <span className="ielts-subscore-val">{evalResults[activeTask].grammatical_accuracy_score || "-"}</span>
            </div>
          </div>

          {evalResults[activeTask].detailed_feedback && (
            <div className="ielts-ai-feedback-section">
              <h5>Nhận xét chi tiết & Lộ trình nâng band:</h5>
              <p className="ielts-ai-feedback-text">{evalResults[activeTask].detailed_feedback}</p>
            </div>
          )}

          {evalResults[activeTask].corrected_version && (
            <div className="ielts-ai-feedback-section">
              <h5>Phiên bản bài viết mẫu đã sửa lỗi (Band 8.0+):</h5>
              <div className="ielts-ai-corrected-box">
                {evalResults[activeTask].corrected_version}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <IeltsSplitPane
      leftPane={leftPaneContent}
      rightPane={rightPaneContent}
      storageKey="ielts_split_writing"
      className="ielts-writing-split"
    />
  );
};
