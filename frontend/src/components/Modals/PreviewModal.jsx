import React from "react";
import { Target, Clock, Globe, Bookmark, CheckCircle2, Zap } from "../Icons";

export const PreviewModal = ({ isOpen, onClose, previewData, onConfirmStart }) => {
  if (!isOpen || !previewData) return null;

  const resumePos = previewData.resumePosition || 0;
  const isCompleted = previewData.isCompleted || false;

  return (
    <div className="preview-card-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="preview-card-content">
        <div className="preview-card-thumb-wrap">
          <img src={previewData.thumbnailUrl} className="preview-card-thumb" alt="Thumbnail" />
        </div>

        <div className="preview-card-body">
          <div className="preview-card-title">{previewData.title}</div>

          <div className="preview-meta-row">
            <div className="preview-meta-item">
              <Target size={16} color="var(--primary, #3b82f6)" />
              <span><strong>{previewData.totalChallenges} câu</strong> (≤ 20 từ/câu)</span>
            </div>
            <div className="preview-meta-item">
              <Clock size={16} color="var(--text-muted, #64748b)" />
              <span>Khoảng <strong>{previewData.estimatedMinutes} phút</strong> luyện nghe</span>
            </div>
            <div className="preview-meta-item">
              <Globe size={16} color="var(--text-muted, #64748b)" />
              <span>{previewData.sourceLang?.toUpperCase()} ➔ {previewData.targetLang?.toUpperCase()}</span>
            </div>
          </div>

          {resumePos > 0 && !isCompleted && (
            <div className="preview-resume-alert">
              <Bookmark size={16} color="#f59e0b" />
              <span>
                Bạn đang học dở dang ở <strong>Câu {resumePos}</strong>. Hệ thống sẽ tự động tua tới đúng câu này để bạn tiếp tục!
              </span>
            </div>
          )}

          {isCompleted && (
            <div className="preview-resume-alert" style={{ background: "#ecfdf5", borderColor: "#a7f3d0", color: "#047857" }}>
              <CheckCircle2 size={16} color="#047857" />
              <span>Bạn đã hoàn thành bài học này 100%! Bấm để luyện tập lại.</span>
            </div>
          )}

          <div className="preview-actions">
            <button className="preview-btn-cancel" onClick={onClose}>
              Đổi video khác
            </button>
            <button
              className="preview-btn-start"
              onClick={() => {
                onConfirmStart(
                  previewData.videoId,
                  resumePos,
                  previewData.sourceLang,
                  previewData.targetLang
                );
                onClose();
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Zap size={16} />
                <span>Bắt đầu học bài này</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
