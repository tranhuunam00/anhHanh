import React, { useState, useMemo } from "react";
import { IeltsSplitPane } from "./IeltsSplitPane.jsx";
import { canUseIeltsAiGrading, calculateWritingBandScore } from "../../utils/ieltsScoring.js";
import { Sparkles, Clock, CheckCircle, Lock } from "../../constants/icons.js";

/**
 * IELTS Academic Writing Test Module (Exam-Standard UI)
 * Features:
 * - Left Pane: Official Prompt, Diagram (Task 1), and Band 7.0+ Structure & Strategy Guide
 * - Right Pane: Professional Word Processor, live word counter with progress indicator, and Review AI Scoring
 */
export const IeltsWritingModule = ({
  writingData,
  user = null,
  token = null,
  isLocked = false,
  isReview = false
}) => {
  const [activeTask, setActiveTask] = useState(2); // Task 2 loaded first for essay practice

  const tasks = writingData?.tasks || [];
  const currentTask = tasks.find((t) => t.taskNumber === activeTask) || tasks[0];
  const testIdKey = writingData?.testId || "cambridge-21-test-2";

  // Essays stored per task in state & localStorage
  const [essays, setEssays] = useState(() => {
    try {
      const saved1 = localStorage.getItem(`ielts_essay_${testIdKey}_1`) || (testIdKey === "cambridge-21-test-2" ? localStorage.getItem("ielts_essay_cam21_t2_1") : "");
      const saved2 = localStorage.getItem(`ielts_essay_${testIdKey}_2`) || (testIdKey === "cambridge-21-test-2" ? localStorage.getItem("ielts_essay_cam21_t2_2") : "");
      return { 1: saved1 || "", 2: saved2 || "" };
    } catch {
      return { 1: "", 2: "" };
    }
  });

  // AI Evaluation results & loading with persistent storage
  const [evalResults, setEvalResults] = useState(() => {
    try {
      const e1 = localStorage.getItem(`ielts_writing_eval_${testIdKey}_1`);
      const e2 = localStorage.getItem(`ielts_writing_eval_${testIdKey}_2`);
      return {
        1: e1 ? JSON.parse(e1) : null,
        2: e2 ? JSON.parse(e2) : null
      };
    } catch {
      return { 1: null, 2: null };
    }
  });

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
    if (isLocked) return;
    setEssays((prev) => {
      const next = { ...prev, [activeTask]: val };
      try {
        localStorage.setItem(`ielts_essay_${testIdKey}_${activeTask}`, val);
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
          language: "en",
          scoring_only: true // Exam test mode: fast band scoring without rewriting model essay
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Không thể kết nối đến dịch vụ chấm điểm AI.");
      }

      const data = await res.json();
      setEvalResults((prev) => {
        const next = { ...prev, [activeTask]: data };
        try {
          localStorage.setItem(`ielts_writing_eval_${testIdKey}_${activeTask}`, JSON.stringify(data));
        } catch {
          // ignore
        }
        return next;
      });
    } catch (err) {
      setAiError(err.message || "Lỗi khi chấm điểm bài viết.");
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Extract criteria scores safely from top-level or nested evaluation object
  const evalData = evalResults[activeTask];
  const overallBand = evalData
    ? evalData.overall_band || evalData.band || evalData.evaluation?.overall_score || "N/A"
    : null;

  const t1Score = evalResults[1]?.overall_band || evalResults[1]?.band || evalResults[1]?.evaluation?.overall_score;
  const t2Score = evalResults[2]?.overall_band || evalResults[2]?.band || evalResults[2]?.evaluation?.overall_score;
  const compositeWritingBand = useMemo(() => {
    return calculateWritingBandScore(t1Score, t2Score);
  }, [t1Score, t2Score]);

  const rawCriteria = evalData?.evaluation?.criteria_scores || evalData?.criteria_scores || {};
  const trScore =
    evalData?.task_response_score ||
    rawCriteria.task_response?.score ||
    rawCriteria.task_achievement?.score ||
    "-";
  const ccScore =
    evalData?.coherence_cohesion_score ||
    rawCriteria.coherence_cohesion?.score ||
    "-";
  const lrScore =
    evalData?.lexical_resource_score ||
    rawCriteria.lexical_resource?.score ||
    "-";
  const grScore =
    evalData?.grammatical_accuracy_score ||
    rawCriteria.grammatical_range_accuracy?.score ||
    rawCriteria.grammar_accuracy?.score ||
    "-";

  const feedbackText =
    evalData?.detailed_feedback ||
    evalData?.evaluation?.overall_feedback ||
    evalData?.evaluation?.detailed_feedback ||
    "";

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
          {currentTask.instructions?.map((para, i) => {
            if (para.startsWith("You should spend")) {
              return (
                <p key={i} className="ielts-prompt-meta-time"><strong>{para}</strong></p>
              );
            }
            if (para.startsWith("Write at least")) {
              return (
                <p key={i} className="ielts-prompt-meta-length"><strong>{para}</strong></p>
              );
            }
            return (
              <p key={i} className="ielts-prompt-action-text">{para}</p>
            );
          })}
        </div>

        {/* Task 1 Diagram Image */}
        {(currentTask.image || currentTask.imageSrc) && (
          <div className="ielts-writing-image-wrap">
            {currentTask.diagramTitle && <h5 className="ielts-diagram-title">{currentTask.diagramTitle}</h5>}
            <img
              src={currentTask.image || currentTask.imageSrc}
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

        {/* AI Scoring Button (Only accessible after finishing the exam in Review Mode) */}
        {isReview && (
          <div className="ielts-editor-actions">
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
              <span className="ielts-ai-restricted-badge" title="Tính năng AI chấm điểm dành riêng cho tài khoản được cấp phép">
                <Lock className="w-3.5 h-3.5 mr-1 inline" />
                AI chấm điểm (Cần cấp phép)
              </span>
            )}
          </div>
        )}
      </div>

      {aiError && <div className="ielts-error-banner">{aiError}</div>}

      <div className="ielts-editor-container">
        <textarea
          value={currentEssay}
          onChange={(e) => handleEssayChange(e.target.value)}
          placeholder={`Nhập bài viết ${currentTask.title} của bạn tại đây theo đúng chuẩn thi IELTS...`}
          className="ielts-essay-textarea"
          rows={18}
          readOnly={isLocked}
        />
        <div className="ielts-editor-footer-status">
          <span>Độ dài: {wordCount} từ ({charCount} ký tự)</span>
          <span>Phím tắt: Bài viết được tự động lưu vào trình duyệt liên tục.</span>
        </div>
      </div>

      {/* AI Evaluation Result Card (Chỉ chấm điểm 4 tiêu chí chuẩn IELTS và nhận xét mức điểm) */}
      {evalData && (
        <div className="ielts-ai-result-card">
          {t1Score && t2Score && (
            <div
              className="ielts-ai-composite-banner"
              style={{
                marginBottom: "12px",
                padding: "10px 14px",
                background: "var(--bg-secondary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Điểm Writing chuẩn hóa (Task 1 × 1/3 + Task 2 × 2/3):
              </span>
              <strong style={{ fontSize: "1.05rem", color: "var(--primary)" }}>
                Writing Band {compositeWritingBand.toFixed(1)}
              </strong>
            </div>
          )}
          <div className="ielts-ai-result-header">
            <span className="ielts-ai-band-badge">
              IELTS Band: {overallBand}
            </span>
            <span className="ielts-ai-evaluated-date">Đã chấm bởi Gemini AI • Chuẩn IELTS 9.0</span>
          </div>

          <div className="ielts-ai-subscores-grid">
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">
                {activeTask === 1 ? "Task Achievement" : "Task Response"}
              </span>
              <span className="ielts-subscore-val">{trScore}</span>
            </div>
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Coherence & Cohesion</span>
              <span className="ielts-subscore-val">{ccScore}</span>
            </div>
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Lexical Resource</span>
              <span className="ielts-subscore-val">{lrScore}</span>
            </div>
            <div className="ielts-subscore-box">
              <span className="ielts-subscore-label">Grammar & Accuracy</span>
              <span className="ielts-subscore-val">{grScore}</span>
            </div>
          </div>

          {feedbackText && (
            <div className="ielts-ai-feedback-section">
              <h5>Nhận xét đánh giá theo tiêu chuẩn IELTS:</h5>
              <p className="ielts-ai-feedback-text">{feedbackText}</p>
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
