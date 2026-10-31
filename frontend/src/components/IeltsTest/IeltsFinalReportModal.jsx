import React from "react";
import {
  CheckCircle,
  RotateCcw,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Clock,
  Sparkles
} from "../../constants/icons.js";
import { computeOverallBand } from "../../utils/ieltsExamTimer.js";

/**
 * IELTS Overall Exam Completion & Final Band Report Modal
 * Triggered after candidate completes and submits the Speaking module (final skill).
 * Summarizes results across all 4 skills and provides actions to enter Review Mode
 * or start a fresh test session.
 */
export const IeltsFinalReportModal = ({
  isOpen,
  onClose,
  testTitle = "Cambridge IELTS 21 - Test 2",
  session = null,
  onReviewAnswers,
  onResetExam
}) => {
  if (!isOpen || !session) return null;

  const overallBand = computeOverallBand(session);
  const lResult = session.skills?.listening?.result || {};
  const rResult = session.skills?.reading?.result || {};

  const getOverallComment = (band) => {
    if (band >= 8.5) return "Đạt trình độ Chuyên gia (Expert User). Năng lực tiếng Anh xuất sắc!";
    if (band >= 7.5) return "Đạt trình độ Rất tốt (Very Good User). Đáp ứng chuẩn đầu ra đại học hàng đầu thế giới!";
    if (band >= 6.5) return "Đạt trình độ Khá (Competent User). Nắm vững ngôn ngữ, sử dụng hiệu quả.";
    if (band >= 5.5) return "Đạt trình độ Trung bình khá (Modest User). Có thể giao tiếp trong hầu hết ngữ cảnh.";
    return "Cần tiếp tục trau dồi và làm quen thêm với cấu trúc đề thi IELTS.";
  };

  return (
    <div className="ielts-modal-overlay">
      <div className="ielts-modal-backdrop" onClick={onClose} />
      <div className="ielts-final-report-dialog">
        <header className="ielts-modal-header final-report-header">
          <div className="ielts-final-title-wrap">
            <span className="ielts-final-badge">
              <Sparkles className="w-4 h-4 mr-1 text-primary inline" />
              HOÀN THÀNH TOÀN BỘ 4 KỸ NĂNG
            </span>
            <h3 className="ielts-modal-title">Báo Cáo Tổng Kết Bài Thi IELTS</h3>
            <p className="ielts-modal-subtitle">{testTitle}</p>
          </div>
          <button
            type="button"
            className="ielts-modal-close-btn"
            onClick={onClose}
            title="Đóng bảng tổng kết"
          >
            ✕
          </button>
        </header>

        <div className="ielts-final-report-body">
          {/* Big Overall Band Hero Card */}
          <div className="ielts-overall-band-card">
            <span className="ielts-overall-label">OVERALL ESTIMATED BAND</span>
            <div className="ielts-overall-band-number">{overallBand.toFixed(1)}</div>
            <p className="ielts-overall-comment">{getOverallComment(overallBand)}</p>
            <div className="ielts-completion-tag">
              <CheckCircle className="w-4 h-4 mr-1.5 text-success inline" />
              Đã nộp bài đầy đủ 4/4 kỹ năng theo đúng chuẩn thời gian thi thật
            </div>
          </div>

          {/* 4-Skill Performance Grid */}
          <div className="ielts-final-skills-grid">
            {/* Listening */}
            <div className="ielts-final-skill-card">
              <div className="ielts-final-card-header">
                <span className="ielts-final-card-icon listening">
                  <Headphones className="w-4 h-4" />
                </span>
                <span className="ielts-final-skill-name">Listening</span>
              </div>
              <div className="ielts-final-score-row">
                <strong className="ielts-final-band">
                  Band {lResult.bandScore ? lResult.bandScore.toFixed(1) : "1.0"}
                </strong>
                <span className="ielts-final-raw-score">
                  {lResult.rawScore ?? 0} / 40 câu
                </span>
              </div>
              <span className="ielts-final-status-badge success">✓ Đã nộp bài</span>
            </div>

            {/* Reading */}
            <div className="ielts-final-skill-card">
              <div className="ielts-final-card-header">
                <span className="ielts-final-card-icon reading">
                  <BookOpen className="w-4 h-4" />
                </span>
                <span className="ielts-final-skill-name">Reading</span>
              </div>
              <div className="ielts-final-score-row">
                <strong className="ielts-final-band">
                  Band {rResult.bandScore ? rResult.bandScore.toFixed(1) : "1.0"}
                </strong>
                <span className="ielts-final-raw-score">
                  {rResult.rawScore ?? 0} / 40 câu
                </span>
              </div>
              <span className="ielts-final-status-badge success">✓ Đã nộp bài</span>
            </div>

            {/* Writing */}
            <div className="ielts-final-skill-card">
              <div className="ielts-final-card-header">
                <span className="ielts-final-card-icon writing">
                  <PenTool className="w-4 h-4" />
                </span>
                <span className="ielts-final-skill-name">Writing</span>
              </div>
              <div className="ielts-final-score-row">
                <strong className="ielts-final-band">Task 1 & Task 2</strong>
                <span className="ielts-final-raw-score">Đã lưu bài viết</span>
              </div>
              <span className="ielts-final-status-badge success">✓ Đã nộp bài</span>
            </div>

            {/* Speaking */}
            <div className="ielts-final-skill-card">
              <div className="ielts-final-card-header">
                <span className="ielts-final-card-icon speaking">
                  <Mic className="w-4 h-4" />
                </span>
                <span className="ielts-final-skill-name">Speaking</span>
              </div>
              <div className="ielts-final-score-row">
                <strong className="ielts-final-band">Part 1, 2, 3</strong>
                <span className="ielts-final-raw-score">Đã nộp bài nói</span>
              </div>
              <span className="ielts-final-status-badge success">✓ Đã nộp bài</span>
            </div>
          </div>
        </div>

        <footer className="ielts-modal-footer final-report-footer">
          <button
            type="button"
            className="ielts-btn ielts-btn-outline"
            onClick={onResetExam}
            title="Làm mới bài thi để luyện tập lại từ đầu"
          >
            <RotateCcw className="w-4 h-4 mr-1.5 inline" />
            Làm lại bài thi mới (Reset đề)
          </button>

          <button
            type="button"
            className="ielts-btn ielts-btn-primary"
            onClick={onReviewAnswers}
            title="Mở khóa chế độ xem lại đáp án và bài làm của tất cả các kỹ năng"
          >
            <CheckCircle className="w-4 h-4 mr-1.5 inline" />
            Xem lại bài làm (Review Mode)
          </button>
        </footer>
      </div>
    </div>
  );
};

