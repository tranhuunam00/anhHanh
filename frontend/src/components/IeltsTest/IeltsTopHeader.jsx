import React from "react";
import { IELTS_TESTS } from "../../data/ielts/index.js";
import {
  IELTS_SKILL_ORDER,
  formatCountdownTime,
  canAccessSkill,
  isSkillCompletedAndLocked,
  isExamFullyCompleted
} from "../../utils/ieltsExamTimer.js";
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  CheckCircle,
  Clock,
  Info,
  Lock,
  Check
} from "../../constants/icons.js";

/**
 * Top navigation and exam status toolbar for IELTS practice exams
 */
export const IeltsTopHeader = ({
  selectedTestId,
  onSelectTest,
  onOpenInfo,
  activeSkill,
  onSelectSkill,
  examSession,
  isReviewMode,
  remainingSeconds,
  isCurrentSkillLocked,
  onSubmitSkill,
  onOpenModal,
  onOpenFinalReport
}) => {
  return (
    <header className="ielts-top-header">
      <div className="ielts-header-left">
        <div className="ielts-test-selector-wrap">
          <span className="ielts-test-label">Bộ đề:</span>
          <select
            value={selectedTestId}
            onChange={(e) => onSelectTest(e.target.value)}
            className="ielts-test-select"
          >
            {IELTS_TESTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.badge})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ielts-exam-info-btn"
            onClick={onOpenInfo}
            title="Xem thông tin quy chế đề thi & thời gian"
            aria-label="Xem thông tin đề thi"
          >
            <Info size={15} />
          </button>
        </div>

        {/* Sequential Skill Selector Tabs */}
        <div className="ielts-skill-nav-group">
          {IELTS_SKILL_ORDER.map((sk) => {
            const isAccessible = canAccessSkill(examSession, sk);
            const isCompleted = isSkillCompletedAndLocked(examSession, sk);
            const isActiveTab = activeSkill === sk;
            const canClick = isReviewMode ? true : isAccessible && !isCompleted;

            return (
              <button
                key={sk}
                type="button"
                className={`ielts-skill-tab-btn ${isActiveTab ? "active" : ""} ${isCompleted ? "submitted-tab" : ""} ${!isAccessible ? "locked-tab" : ""}`}
                onClick={() => canClick && onSelectSkill(sk)}
                disabled={!canClick && !isActiveTab}
                title={
                  !isAccessible
                    ? "Bạn cần hoàn thành và nộp bài kỹ năng trước để mở khóa kỹ năng này"
                    : isCompleted && !isReviewMode
                    ? "Đã nộp bài - Quy chế thi thật không cho phép quay lại chỉnh sửa"
                    : `Chuyển sang phần thi ${sk.toUpperCase()}`
                }
              >
                {sk === "listening" && <Headphones className="w-4 h-4 mr-1 inline" />}
                {sk === "reading" && <BookOpen className="w-4 h-4 mr-1 inline" />}
                {sk === "writing" && <PenTool className="w-4 h-4 mr-1 inline" />}
                {sk === "speaking" && <Mic className="w-4 h-4 mr-1 inline" />}
                <span className="capitalize">{sk}</span>
                {isCompleted && <Check className="w-3.5 h-3.5 inline ml-1 text-success" />}
                {!isAccessible && <Lock className="w-3 h-3 inline ml-1 opacity-70" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Right: Countdown Timer & Sequential Submit Action */}
      <div className="ielts-header-right">
        <div
          className={`ielts-header-timer ${remainingSeconds <= 300 ? "warning" : ""} ${remainingSeconds <= 60 ? "danger" : ""}`}
          title="Thời gian làm bài còn lại"
        >
          <Clock className="w-4 h-4 mr-1.5 inline text-primary" />
          <span>{formatCountdownTime(remainingSeconds)}</span>
        </div>

        {!isCurrentSkillLocked && (
          <button
            type="button"
            className="ielts-submit-test-btn"
            onClick={onSubmitSkill}
          >
            <CheckCircle className="w-4 h-4 mr-1.5 inline" />
            {activeSkill === "speaking"
              ? "Nộp bài Speaking & Hoàn thành"
              : `Nộp bài ${activeSkill.toUpperCase()} & Tiếp tục`}
          </button>
        )}

        {isCurrentSkillLocked && (
          <button
            type="button"
            className="ielts-retake-btn"
            onClick={() => {
              if (isExamFullyCompleted(examSession)) {
                onOpenFinalReport();
              } else if (activeSkill === "listening" || activeSkill === "reading") {
                onOpenModal();
              }
            }}
            title="Xem lại điểm số"
          >
            {isExamFullyCompleted(examSession) ? "Bảng điểm tổng kết" : "Xem điểm"}
          </button>
        )}
      </div>
    </header>
  );
};

