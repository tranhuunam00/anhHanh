import React, { useState } from "react";
import {
  IconCheckCircle,
  IconSparkles,
  BarChart3,
  Image as ImageIcon,
  Maximize2,
  X,
} from "../Icons";

export const IeltsPromptCard = ({
  item,
  isCurrent,
  isExpanded,
  onToggleOutline,
  onSelect,
}) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const imageUrl = item.image_url || item.visual_data?.image_url;
  const hasOutline = !!item.outline;
  const hasKeywords = item.keywords && item.keywords.length > 0;

  return (
    <div className={`prompt-item-card ${isCurrent ? "current-active" : ""}`}>
      {/* Card Header Badges */}
      <div className="prompt-card-top-row">
        <div className="prompt-badges-wrap">
          {item.exam_date && (
            <span className="badge-exam-date">
              📅 {item.exam_date}
            </span>
          )}
          {item.source && (
            <span className="badge-exam-source">
              🏛️ {item.source}
            </span>
          )}
          {item.topic_category && (
            <span className="badge-topic-category">
              🏷️ {item.topic_category}
            </span>
          )}
          <span className="badge-exam-subtype">
            {item.type || item.sub_type}
          </span>
        </div>

        {isCurrent && (
          <span className="badge-currently-writing">
            <IconCheckCircle size={13} /> Đang chọn viết
          </span>
        )}
      </div>

      {/* Title & Question */}
      <h3 className="prompt-card-title">{item.title}</h3>
      <div className="prompt-card-question-box">
        <p className="prompt-card-question-text">{item.prompt}</p>
      </div>

      {/* Task 1 Authentic Exam Image Preview */}
      {imageUrl && (
        <div className="prompt-card-image-box">
          <div className="prompt-card-image-header">
            <span className="image-header-title">
              <ImageIcon size={13} />
              <span>Đề thi gốc / Biểu đồ khảo thí</span>
            </span>
            <button
              type="button"
              className="btn-zoom-image"
              onClick={() => setShowFullImage(true)}
              title="Phóng to ảnh đề bài"
            >
              <Maximize2 size={12} />
              <span>Xem kích thước gốc</span>
            </button>
          </div>
          <div
            className="prompt-card-image-wrapper"
            onClick={() => setShowFullImage(true)}
            title="Bấm để xem kích thước đầy đủ"
          >
            <img
              src={imageUrl}
              alt={item.title}
              className="prompt-card-image-img"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal for Image */}
      {showFullImage && imageUrl && (
        <div
          className="prompt-image-lightbox-overlay"
          onClick={() => setShowFullImage(false)}
        >
          <div
            className="prompt-image-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lightbox-header">
              <h4>{item.title}</h4>
              <button
                type="button"
                className="btn-close-lightbox"
                onClick={() => setShowFullImage(false)}
              >
                <X size={18} />
              </button>
            </div>
            <img
              src={imageUrl}
              alt={item.title}
              className="lightbox-full-img"
            />
          </div>
        </div>
      )}

      {/* Keywords Preview */}
      {hasKeywords && (
        <div className="prompt-card-keywords-row">
          <span className="keywords-label">Band 8+ Collocations:</span>
          <div className="keywords-pills-list">
            {item.keywords.map((kw, idx) => (
              <span key={idx} className="keyword-pill">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Accordion: Dàn ý & Gợi ý lập luận */}
      {hasOutline && (
        <div className="prompt-outline-accordion">
          <button
            type="button"
            className="btn-toggle-outline"
            onClick={() => onToggleOutline(item.id)}
          >
            <IconSparkles size={14} />
            <span>
              {isExpanded
                ? "Ẩn dàn ý & hướng dẫn phát triển luận điểm"
                : "Xem gợi ý dàn ý phát triển luận điểm (Band 8.0+ Outline)"}
            </span>
            <span className="outline-toggle-arrow">
              {isExpanded ? "▲" : "▼"}
            </span>
          </button>

          {isExpanded && (
            <div className="prompt-outline-content">
              {item.outline.body1 && (
                <div className="outline-section">
                  <span className="outline-sec-label">📌 Body Paragraph 1:</span>
                  <p className="outline-sec-text">{item.outline.body1}</p>
                </div>
              )}
              {item.outline.body2 && (
                <div className="outline-section">
                  <span className="outline-sec-label">📌 Body Paragraph 2:</span>
                  <p className="outline-sec-text">{item.outline.body2}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Card Bottom Actions */}
      <div className="prompt-card-footer-actions">
        <div className="prompt-meta-info">
          <span>Mục tiêu: {item.min_words || (item.sub_type ? 150 : 250)}+ từ</span>
          <span>Thời gian: {item.recommended_time || (item.sub_type ? 20 : 40)} phút</span>
          {item.visual_data && (
            <span className="badge-has-data" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <BarChart3 size={11} /> Có ảnh & số liệu trực quan
            </span>
          )}
        </div>

        <button
          type="button"
          className={`btn-select-prompt-now ${
            isCurrent ? "btn-already-selected" : ""
          }`}
          onClick={() => onSelect(item)}
        >
          {isCurrent ? "Đang mở đề này" : "Luyện viết đề này ngay →"}
        </button>
      </div>
    </div>
  );
};
