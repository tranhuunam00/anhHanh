import React, { useState, useMemo } from "react";
import {
  IELTS_TASK_TABS,
  CAMBRIDGE_19_LESSONS,
  CAMBRIDGE_19_FULL_LESSONS,
  CAMBRIDGE_20_LESSONS,
  CAMBRIDGE_20_FULL_LESSONS,
  CAMBRIDGE_21_LESSONS,
  filterIeltsLessons
} from "../../constants/ieltsCambridgePresets";
import {
  Headphones,
  Edit3,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  Info,
  Check,
  Zap
} from "../Icons";

/**
 * Specialized IELTS Cambridge Presets View
 * - Supports filtering by Task: Task 1, Task 2, Task 3, Task 4, Full or All
 * - Cambridge 19: 16 individual split parts (Test 1..4 x Task 1..4) + 4 full combined tests
 * - Cambridge 20: 16 individual split parts (Test 1..4 x Task 1..4) + 4 full combined tests
 * - Cambridge 21: 4 full combined test lessons (Test 1..4 x Full 4 Tasks)
 * - 100% Local Authentic Cambridge Audio Files
 * - Dual-action buttons: [ 🎧 Nghe cả bài ] (Transcript) & [ ✍️ Chép chính tả ] (Dictation)
 * - 100% Internal Icon System (BaseIcon from ../Icons)
 */
export const IeltsPresetsView = React.memo(({
  onSelectPreset,
  isLoading = false,
  activeUrl = ""
}) => {
  const [selectedTask, setSelectedTask] = useState("all");

  const activeTaskTab = useMemo(() => {
    return IELTS_TASK_TABS.find((t) => t.id === selectedTask) || IELTS_TASK_TABS[0];
  }, [selectedTask]);

  // Filter lessons based on selected task
  const filteredCam19 = useMemo(() => {
    return filterIeltsLessons(CAMBRIDGE_19_LESSONS, selectedTask);
  }, [selectedTask]);

  const filteredCam19Full = useMemo(() => {
    return selectedTask === "full" ? CAMBRIDGE_19_FULL_LESSONS : [];
  }, [selectedTask]);

  const filteredCam20 = useMemo(() => {
    return filterIeltsLessons(CAMBRIDGE_20_LESSONS, selectedTask);
  }, [selectedTask]);

  const filteredCam20Full = useMemo(() => {
    return selectedTask === "full" ? CAMBRIDGE_20_FULL_LESSONS : [];
  }, [selectedTask]);

  const filteredCam21 = useMemo(() => {
    if (selectedTask === "all" || selectedTask === "full") {
      return CAMBRIDGE_21_LESSONS;
    }
    return CAMBRIDGE_21_LESSONS;
  }, [selectedTask]);

  const handleSelectMode = (lesson, mode, e) => {
    if (e) e.stopPropagation();
    if (isLoading || !onSelectPreset) return;
    onSelectPreset(lesson, mode);
  };

  const renderCard = (lesson) => {
    const isActive = Boolean(activeUrl && (activeUrl === lesson.audioUrl || activeUrl === lesson.url));

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
    <div className="ielts-presets-container">
      {/* Header Info & Modes Guide */}
      <div className="ielts-presets-header-info">
        <div className="ielts-presets-info-text">
          <Sparkles size={16} color="var(--primary)" />
          <span>
            Luyện thi <strong>IELTS Cambridge</strong> theo từng Task 1–4 hoặc trọn bộ đề thi thực chiến (100% audio gốc).
          </span>
        </div>
        <div className="ielts-presets-modes-badge">
          <span>2 Chế độ:</span>
          <span className="ielts-mode-tag">
            <Headphones size={12} /> Nghe cả bài
          </span>
          <span className="ielts-mode-tag">
            <Edit3 size={12} /> Chép chính tả
          </span>
        </div>
      </div>

      {/* Task Filter Pills */}
      <div className="ielts-task-nav-wrapper">
        <div className="ielts-task-pills-row" role="tablist">
          {IELTS_TASK_TABS.map((tab) => {
            const isTabActive = selectedTask === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isTabActive}
                className={`ielts-task-pill-btn ${isTabActive ? "active" : ""}`}
                onClick={() => setSelectedTask(tab.id)}
              >
                {tab.id === "all" ? <Layers size={13} /> : <BookOpen size={13} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        <div className="ielts-task-desc-bar">
          <Info size={13} style={{ verticalAlign: "middle", marginRight: 4 }} />
          <span>{activeTaskTab.desc}</span>
        </div>
      </div>

      {/* Group 1: Cambridge 19 (Đã tách riêng 4 Task) */}
      {selectedTask !== "full" && filteredCam19.length > 0 && (
        <section className="ielts-book-group">
          <div className="ielts-book-group-header">
            <div className="ielts-book-group-title">
              <BookOpen size={16} color="var(--primary)" />
              <span>Cambridge IELTS 19</span>
              <span className="ielts-book-badge split">
                <Check size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />
                Đã tách riêng 4 Task
              </span>
            </div>
            <span className="text-xs text-muted">
              {filteredCam19.length} bài luyện tập
            </span>
          </div>

          <div className="ielts-presets-cards-grid">
            {filteredCam19.map(renderCard)}
          </div>
        </section>
      )}

      {/* Group 1B: Cambridge 19 (Trọn bộ 4 đề thi khi chọn tab Trọn bộ) */}
      {selectedTask === "full" && filteredCam19Full.length > 0 && (
        <section className="ielts-book-group">
          <div className="ielts-book-group-header">
            <div className="ielts-book-group-title">
              <BookOpen size={16} color="var(--primary)" />
              <span>Cambridge IELTS 19</span>
              <span className="ielts-book-badge merged">
                <Zap size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />
                Gộp 4 phần trong 1 test (Full 30 phút)
              </span>
            </div>
            <span className="text-xs text-muted">
              {filteredCam19Full.length} bài thi trọn bộ
            </span>
          </div>

          <div className="ielts-presets-cards-grid">
            {filteredCam19Full.map(renderCard)}
          </div>
        </section>
      )}

      {/* Group 2: Cambridge 20 (Đã tách riêng 4 Task) */}
      {selectedTask !== "full" && filteredCam20.length > 0 && (
        <section className="ielts-book-group" style={{ marginTop: "12px" }}>
          <div className="ielts-book-group-header">
            <div className="ielts-book-group-title">
              <BookOpen size={16} color="var(--primary)" />
              <span>Cambridge IELTS 20</span>
              <span className="ielts-book-badge split">
                <Check size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />
                Đã tách riêng 4 Task
              </span>
            </div>
            <span className="text-xs text-muted">
              {filteredCam20.length} bài luyện tập
            </span>
          </div>

          <div className="ielts-presets-cards-grid">
            {filteredCam20.map(renderCard)}
          </div>
        </section>
      )}

      {/* Group 2B: Cambridge 20 (Trọn bộ 4 đề thi khi chọn tab Trọn bộ) */}
      {selectedTask === "full" && filteredCam20Full.length > 0 && (
        <section className="ielts-book-group" style={{ marginTop: "12px" }}>
          <div className="ielts-book-group-header">
            <div className="ielts-book-group-title">
              <BookOpen size={16} color="var(--primary)" />
              <span>Cambridge IELTS 20</span>
              <span className="ielts-book-badge merged">
                <Zap size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />
                Gộp 4 phần trong 1 test (Full 30 phút)
              </span>
            </div>
            <span className="text-xs text-muted">
              {filteredCam20Full.length} bài thi trọn bộ
            </span>
          </div>

          <div className="ielts-presets-cards-grid">
            {filteredCam20Full.map(renderCard)}
          </div>
        </section>
      )}

      {/* Group 3: Cambridge 21 (Gộp 4 phần trong 1 test) */}
      {(selectedTask === "all" || selectedTask === "full" || filteredCam21.length > 0) && (
        <section className="ielts-book-group" style={{ marginTop: "12px" }}>
          <div className="ielts-book-group-header">
            <div className="ielts-book-group-title">
              <BookOpen size={16} color="var(--primary)" />
              <span>Cambridge IELTS 21</span>
              <span className="ielts-book-badge merged">
                <Zap size={12} style={{ verticalAlign: "middle", marginRight: 3 }} />
                Gộp 4 phần trong 1 test (Full 30 phút)
              </span>
            </div>
            <span className="text-xs text-muted">
              {filteredCam21.length} bài thi trọn bộ
            </span>
          </div>

          <div className="ielts-presets-cards-grid">
            {filteredCam21.map(renderCard)}
          </div>
        </section>
      )}
    </div>
  );
});

IeltsPresetsView.displayName = "IeltsPresetsView";
