import React from "react";
import { CheckCircle, Clock, RotateCcw, Play } from "../../constants/icons.js";
import { formatCountdownTime } from "../../utils/ieltsExamTimer.js";

/**
 * IELTS Official Exam Start Confirmation Modal
 * Enforces real exam protocol:
 * - Shows official test breakdown & standard timings (30m / 60m / 60m / 14m)
 * - Reminds candidate of strict countdown & locked skill rule on timeout
 * - Allows resume or fresh start
 */
export const IeltsStartConfirmModal = ({
  isOpen,
  testTitle = "Cambridge IELTS 21 - Test 2",
  session,
  onStartExam,
  onResumeExam,
  onResetExam,
  onClose
}) => {
  if (!isOpen) return null;

  const isAlreadyStarted = session && session.isConfirmed;

  const skillsSummary = [
    { key: "listening", name: "Listening", time: "30 phút", detail: "4 Parts • 40 câu hỏi" },
    { key: "reading", name: "Reading", time: "60 phút", detail: "3 Passages • 40 câu hỏi" },
    { key: "writing", name: "Writing", time: "60 phút", detail: "Task 1 (150 từ) & Task 2 (250 từ)" },
    { key: "speaking", name: "Speaking", time: "14 phút", detail: "Part 1, 2, 3 • Thu âm trực tiếp" }
  ];

  return (
    <div className="ielts-modal-overlay">
      <div className="ielts-modal-backdrop" onClick={onClose} />
      <div className="ielts-confirm-modal-dialog">
        <header className="ielts-modal-header">
          <div>
            <span className="ielts-exam-mode-badge mr-2">Chuẩn phòng thi IDP / BC</span>
            <h3 className="ielts-modal-title mt-1">Xác Nhận Bắt Đầu Làm Bài Thi Thật</h3>
          </div>
          <button type="button" className="ielts-modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="ielts-confirm-modal-body">
          <div className="ielts-confirm-test-banner">
            <span className="ielts-banner-label">Đề thi đã chọn:</span>
            <h4 className="ielts-banner-name">{testTitle}</h4>
          </div>

          {/* 4 Skills Breakdown */}
          <div className="ielts-skills-confirm-grid">
            {skillsSummary.map((sk) => {
              const status = session?.skills?.[sk.key]?.status || "not_started";
              const isDone = status === "completed";
              const isInProgress = status === "in_progress";
              const rem = session?.skills?.[sk.key]?.remainingSeconds;

              return (
                <div key={sk.key} className={`ielts-skill-confirm-card ${isDone ? "completed" : ""}`}>
                  <div className="ielts-skill-confirm-header">
                    <span className="ielts-skill-name">{sk.name}</span>
                    <span className="ielts-skill-time">
                      <Clock className="w-3.5 h-3.5 inline mr-1 text-primary" />
                      {sk.time}
                    </span>
                  </div>
                  <p className="ielts-skill-detail">{sk.detail}</p>
                  <div className="ielts-skill-status-tag">
                    {isDone ? (
                      <span className="ielts-tag-done">✓ Đã nộp bài</span>
                    ) : isInProgress ? (
                      <span className="ielts-tag-running">⏳ Còn {formatCountdownTime(rem)}</span>
                    ) : (
                      <span className="ielts-tag-ready">Sẵn sàng</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exam Rules Alert Box */}
          <div className="ielts-confirm-rules-box">
            <h6>Quy chế làm bài chuẩn quốc tế:</h6>
            <ul>
              <li><strong>Tự động đếm ngược</strong>: Hệ thống tính giờ chuẩn theo từng kỹ năng ngay khi bắt đầu.</li>
              <li><strong>Tự động thu bài khi hết giờ</strong>: Hệ thống lập tức chấm điểm và hiển thị kết quả.</li>
              <li><strong>Không được quay lại làm lại kỹ năng đã kết thúc</strong>: Sau khi nộp bài hoặc hết thời gian, kỹ năng đó sẽ bị khóa theo đúng quy chế thi thật.</li>
            </ul>
          </div>
        </div>

        <footer className="ielts-modal-footer">
          {isAlreadyStarted ? (
            <>
              <button
                type="button"
                className="ielts-btn ielts-btn-outline"
                onClick={onResetExam}
                title="Xóa toàn bộ câu trả lời và làm lại từ đầu"
              >
                <RotateCcw className="w-4 h-4 mr-1.5 inline" /> Làm lại từ đầu (Reset)
              </button>
              <button
                type="button"
                className="ielts-btn ielts-btn-primary"
                onClick={onResumeExam}
              >
                <Play className="w-4 h-4 mr-1.5 inline fill-current" /> Tiếp tục làm bài thi
              </button>
            </>
          ) : (
            <button
              type="button"
              className="ielts-btn ielts-btn-primary w-full"
              onClick={onStartExam}
            >
              <CheckCircle className="w-4 h-4 mr-1.5 inline" /> Xác nhận & Bắt đầu làm bài thi ngay
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};

