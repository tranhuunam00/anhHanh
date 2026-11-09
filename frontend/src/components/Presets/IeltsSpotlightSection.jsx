import React, { useState, useMemo, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  Headphones,
  Edit3,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from "../Icons";
import { IeltsPresetsView } from "./IeltsPresetsView.jsx";
import {
  getIeltsSpotlightLessons,
  computeIeltsExpandState
} from "../../utils/ieltsSpotlightUtils.js";
import "../../styles/ieltsPresets.css";

/**
 * Dedicated IELTS Cambridge Spotlight Section
 * Positioned directly above "Thử ngay – Luyện đa ngôn ngữ".
 * Shows a compact curated spotlight of 4 lessons initially,
 * with a one-click "Xem thêm" button to expand all 80+ Cambridge 17-21 lessons.
 */
export const IeltsSpotlightSection = React.memo(({
  activeUrl = "",
  isLoading = false,
  onSelectPreset,
  onGoToIeltsExam
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);

  const spotlightLessons = useMemo(() => getIeltsSpotlightLessons(), []);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      const next = computeIeltsExpandState(prev);
      if (!next && sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return next;
    });
  };

  const handleSelectMode = (lesson, mode, e) => {
    if (e) e.stopPropagation();
    if (isLoading || !onSelectPreset) return;
    onSelectPreset(lesson, mode);
  };

  const renderCard = (lesson) => {
    const isActive = Boolean(
      activeUrl && (activeUrl === lesson.audioUrl || activeUrl === lesson.url)
    );

    return (
      <div
        key={lesson.id}
        className={`ielts-preset-card ${isActive ? "active" : ""}`}
        onClick={() => handleSelectMode(lesson, "dictation")}
        style={{
          pointerEvents: isLoading ? "none" : "",
          opacity: isLoading ? 0.6 : 1
        }}
      >
        <div className="ielts-card-topbar">
          <div
            className="ielts-card-task-badge"
            style={{
              backgroundColor: `${lesson.diffColor}18`,
              color: lesson.diffColor,
              border: `1px solid ${lesson.diffColor}45`
            }}
          >
            <span
              className="ielts-card-badge-dot"
              style={{ backgroundColor: lesson.diffColor }}
            />
            <span>{lesson.badge}</span>
          </div>
          <span className="ielts-card-duration">
            <Clock size={12} />
            {lesson.duration}
          </span>
        </div>

        <div className="ielts-card-title" title={lesson.title}>
          {lesson.title}
        </div>

        <div className="ielts-card-summary" title={lesson.summary}>
          {lesson.summary}
        </div>

        <div className="ielts-card-footer">
          <button
            type="button"
            className="ielts-btn-transcript"
            disabled={isLoading}
            title="Nghe toàn bộ audio bài thi kèm transcript song ngữ"
            onClick={(e) => handleSelectMode(lesson, "transcript", e)}
          >
            <Headphones size={13} />
            <span>Nghe cả bài</span>
          </button>
          <button
            type="button"
            className="ielts-btn-dictation"
            disabled={isLoading}
            title="Luyện gõ chép chính tả từng câu từ audio chính thức"
            onClick={(e) => handleSelectMode(lesson, "dictation", e)}
          >
            <Edit3 size={13} />
            <span>Chép chính tả</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="ielts-spotlight-section">
      {/* Header Info */}
      <div className="ielts-spotlight-header">
        <div className="ielts-spotlight-title-row">
          <div className="ielts-spotlight-title">
            <BookOpen size={22} className="ielts-spotlight-icon" />
            <span>Luyện đề thi IELTS Cambridge</span>
            <span className="ielts-spotlight-badge">Cam 17 • 18 • 19 • 20 • 21</span>
            <span className="ielts-spotlight-badge-sub">Đã tách 4 Task & Trọn bộ</span>
          </div>

          {onGoToIeltsExam && (
            <button
              type="button"
              className="ielts-btn-goto-exam"
              onClick={onGoToIeltsExam}
              title="Chuyển sang phòng thi thật IELTS Academic 4 kỹ năng"
            >
              <span>Vào phòng thi IELTS (4 Kỹ năng)</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        <p className="ielts-spotlight-subtitle">
          <Sparkles size={14} color="var(--primary)" style={{ verticalAlign: "middle", marginRight: 4 }} />
          Kho đề luyện nghe chép chính tả IELTS chính thức với file âm thanh gốc chuẩn Cambridge University Press. Hỗ trợ 2 chế độ: <strong>Nghe cả bài</strong> (kèm transcript song ngữ) & <strong>Chép chính tả</strong> (gõ từng câu).
        </p>
      </div>

      {/* Main Content: Compact Spotlight (4 cards) OR Full View (All books & tasks) */}
      {!isExpanded ? (
        <div className="ielts-spotlight-compact-wrap">
          <div className="ielts-presets-cards-grid">
            {spotlightLessons.map(renderCard)}
          </div>

          <div className="ielts-spotlight-expand-bar">
            <button
              type="button"
              className="ielts-btn-expand-more"
              onClick={handleToggleExpand}
              title="Mở rộng toàn bộ danh sách hơn 80 bài luyện thi Cambridge 17, 18, 19, 20 & 21"
            >
              <span>Xem thêm toàn bộ đề thi IELTS (80+ bài luyện Cam 17–21)</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="ielts-spotlight-full-wrap">
          <IeltsPresetsView
            onSelectPreset={onSelectPreset}
            isLoading={isLoading}
            activeUrl={activeUrl}
          />

          <div className="ielts-spotlight-collapse-bar">
            <button
              type="button"
              className="ielts-btn-collapse"
              onClick={handleToggleExpand}
              title="Thu gọn lại danh sách tiêu biểu"
            >
              <span>Thu gọn đề thi IELTS</span>
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
});

IeltsSpotlightSection.displayName = "IeltsSpotlightSection";

