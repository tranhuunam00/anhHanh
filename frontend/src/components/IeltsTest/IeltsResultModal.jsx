import React from "react";
import { CheckCircle, RotateCcw } from "../../constants/icons.js";

/**
 * Result & Score Modal for IELTS Test
 * Displays IELTS Band Score (1.0 - 9.0), raw score, and feedback summary.
 */
export const IeltsResultModal = ({
  isOpen,
  onClose,
  skill = "listening",
  rawScore = 0,
  bandScore = 1.0,
  totalQuestions = 40,
  onReviewAnswers,
  onRetakeTest
}) => {
  if (!isOpen) return null;

  const percentage = Math.round((rawScore / totalQuestions) * 100);

  const getBandComment = (band) => {
    if (band >= 8.5) return "Xuất sắc! Trình độ Chuyên gia (Expert User) thành thạo hoàn toàn.";
    if (band >= 7.5) return "Rất tốt! Khả năng ngôn ngữ vững vàng, đáp ứng chuẩn đầu ra đại học quốc tế.";
    if (band >= 6.5) return "Khá! Đạt chuẩn thông thạo hiệu quả, chỉ mắc một số lỗi nhỏ.";
    if (band >= 5.5) return "Trung bình khá! Nắm được ý nghĩa tổng quát, cần luyện tập thêm từ vựng.";
    return "Cần tiếp tục ôn tập và làm quen với cấu trúc bài thi IELTS.";
  };

  return (
    <div className="ielts-modal-overlay">
      <div className="ielts-modal-backdrop" onClick={onClose} />
      <div className="ielts-result-modal-dialog">
        <header className="ielts-modal-header">
          <h3 className="ielts-modal-title">
            Kết Quả Bài Thi IELTS {skill === "listening" ? "Listening" : "Reading"}
          </h3>
          <button type="button" className="ielts-modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="ielts-result-modal-body">
          {/* Big Band Score Circle */}
          <div className="ielts-band-hero-box">
            <span className="ielts-band-hero-label">IELTS BAND SCORE</span>
            <div className="ielts-band-hero-number">{bandScore.toFixed(1)}</div>
            <p className="ielts-band-hero-comment">{getBandComment(bandScore)}</p>
          </div>

          {/* Stats Grid */}
          <div className="ielts-result-stats-grid">
            <div className="ielts-stat-card">
              <span className="ielts-stat-label">Số câu đúng</span>
              <strong className="ielts-stat-val text-success">{rawScore} / {totalQuestions}</strong>
            </div>
            <div className="ielts-stat-card">
              <span className="ielts-stat-label">Tỷ lệ chính xác</span>
              <strong className="ielts-stat-val">{percentage}%</strong>
            </div>
            <div className="ielts-stat-card">
              <span className="ielts-stat-label">Số câu sai/chưa làm</span>
              <strong className="ielts-stat-val text-danger">{totalQuestions - rawScore}</strong>
            </div>
          </div>
        </div>

        <footer className="ielts-modal-footer">
          <button
            type="button"
            className="ielts-btn ielts-btn-outline"
            onClick={onRetakeTest}
          >
            <RotateCcw className="w-4 h-4 mr-1.5 inline" /> Làm lại bài thi
          </button>
          <button
            type="button"
            className="ielts-btn ielts-btn-primary"
            onClick={onReviewAnswers}
          >
            <CheckCircle className="w-4 h-4 mr-1.5 inline" /> Xem đáp án chi tiết
          </button>
        </footer>
      </div>
    </div>
  );
};

