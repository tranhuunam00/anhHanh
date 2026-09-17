import React from "react";

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
              <span>🎯</span>
              <span><strong>{previewData.totalChallenges} câu</strong> (≤ 20 từ/câu)</span>
            </div>
            <div className="preview-meta-item">
              <span>⏱️</span>
              <span>Khoảng <strong>{previewData.estimatedMinutes} phút</strong> luyện nghe</span>
            </div>
            <div className="preview-meta-item">
              <span>🌐</span>
              <span>{previewData.sourceLang?.toUpperCase()} ➔ {previewData.targetLang?.toUpperCase()}</span>
            </div>
          </div>

          {resumePos > 0 && !isCompleted && (
            <div className="preview-resume-alert">
              <span>📍</span>
              <span>
                Bạn đang học dở dang ở <strong>Câu {resumePos}</strong>. Hệ thống sẽ tự động tua tới đúng câu này để bạn tiếp tục!
              </span>
            </div>
          )}

          {isCompleted && (
            <div className="preview-resume-alert" style={{ background: "#ecfdf5", borderColor: "#a7f3d0", color: "#047857" }}>
              <span>✓</span>
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
                onConfirmStart(previewData.videoId, resumePos);
                onClose();
              }}
            >
              <span>🚀 Bắt đầu học bài này</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
