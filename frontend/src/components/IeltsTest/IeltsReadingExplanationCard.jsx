import React, { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle, Info, BookOpen, Search, KeyRound } from "../../constants/icons.js";
import {
  getReadingExplanation,
  extractQuestionNumbersFromGroup
} from "../../utils/ieltsReadingExplanations.js";
import { scrollToEvidenceMark } from "../../utils/ieltsEvidenceHighlightUtils.js";
import "../../styles/ieltsReadingExplanation.css";

/**
 * Renders a single question's explanation card with location, passage evidence quote,
 * rationale analysis, and keyword mappings.
 */
export const IeltsReadingSingleExplanation = ({
  qNum,
  evaluation = null,
  testId = "cambridge-21-test-2",
  passageText = "",
  questionItem = null,
  defaultOpen = false,
  isReview = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (!isReview) return null;

  const res = evaluation?.[qNum];
  const isCorrect = Boolean(res?.isCorrect);
  const data = getReadingExplanation(testId, qNum, passageText, questionItem, res);

  return (
    <div className={`ielts-single-explanation-card ${isCorrect ? "is-correct" : "is-incorrect"}`}>
      <button
        type="button"
        className="ielts-explanation-card-header"
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev;
            if (next) setTimeout(() => scrollToEvidenceMark(qNum), 100);
            return next;
          });
        }}
        aria-expanded={isOpen}
      >
        <div className="ielts-explanation-card-title-left">
          <span className="ielts-q-pill">{qNum}</span>
          <span className="font-semibold">
            {isCorrect ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 inline" /> Đúng: <strong>{data.answer}</strong>
              </span>
            ) : (
              <span className="text-rose-600">
                Đáp án: <strong>{data.answer || res?.accepted?.join(" / ")}</strong>
                {res?.userAns ? <span className="text-text-muted ml-1.5 font-normal">(Bạn chọn: {res.userAns})</span> : null}
              </span>
            )}
          </span>
          <span className="text-xs text-text-muted">
            {data.location && `• ${data.location}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
          <span>{isOpen ? "Thu gọn" : "Vì sao đáp án này?"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="ielts-explanation-card-body">
          {data.location && (
            <div className="ielts-explanation-location">
              <BookOpen className="w-3 h-3 inline mr-1" />
              <span>Vị trí: {data.location}</span>
            </div>
          )}

          {data.evidence && (
            <div className="ielts-explanation-evidence">
              <span className="ielts-explanation-evidence-label">
                <Info className="w-3.5 h-3.5 inline mr-1 text-primary" />
                Dẫn chứng từ bài đọc (Passage Evidence):
              </span>
              "{data.evidence}"
              <div>
                <button
                  type="button"
                  className="ielts-view-evidence-btn"
                  onClick={() => scrollToEvidenceMark(qNum)}
                  title="Nhảy đến vị trí câu dẫn chứng trong bài đọc"
                >
                  <Search size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                  <span>Xem trong bài đọc</span>
                </button>
              </div>
            </div>
          )}

          {data.explanation && (
            <div className="ielts-explanation-reason">
              <span className="ielts-explanation-reason-label">
                <Lightbulb className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                Vì sao chọn đáp án này (Explanation):
              </span>
              <p className="m-0 text-text-secondary">{data.explanation}</p>
            </div>
          )}

          {Array.isArray(data.keywords) && data.keywords.length > 0 && (
            <div className="ielts-explanation-keywords-box">
              <span className="ielts-explanation-reason-label">
                <KeyRound size={13} style={{ marginRight: 4, verticalAlign: "middle" }} />
                Từ khóa & Paraphrase tương đương:
              </span>
              {data.keywords.map((kw, idx) => (
                <div key={idx} className="ielts-keyword-pair-item">
                  <span className="ielts-keyword-q">{kw.question}</span>
                  <span className="ielts-keyword-arrow">↔</span>
                  <span className="ielts-keyword-p">"{kw.passage}"</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Exercise-level explanation container rendered at the bottom of each exercise card ("ở dưới mỗi bài")
 */
export const IeltsExerciseExplanationGroup = ({
  group,
  evaluation = null,
  isReview = false,
  testId = "cambridge-21-test-2",
  passageText = "",
  title = null
}) => {
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [allExpanded, setAllExpanded] = useState(false);

  if (!isReview || !group) return null;

  const questionNumbers = extractQuestionNumbersFromGroup(group);
  if (questionNumbers.length === 0) return null;

  const startQ = questionNumbers[0];
  const endQ = questionNumbers[questionNumbers.length - 1];
  const total = questionNumbers.length;
  const correctCount = questionNumbers.filter((n) => evaluation?.[n]?.isCorrect).length;

  const handleToggleAll = (e) => {
    e.stopPropagation();
    setAllExpanded((prev) => !prev);
    setIsGroupOpen(true);
  };

  return (
    <section className="ielts-group-explanation-box">
      <div
        className="ielts-group-explanation-header"
        onClick={() => setIsGroupOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
      >
        <div className="ielts-group-explanation-title">
          <Lightbulb className="w-4 h-4 text-amber-500 inline" />
          <span>
            {title || `Giải thích chi tiết & Dẫn chứng (Câu ${startQ}${startQ !== endQ ? ` - ${endQ}` : ""})`}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {correctCount}/{total} Đúng
          </span>
        </div>

        <div className="ielts-group-explanation-actions">
          {isGroupOpen && (
            <button
              type="button"
              className="ielts-group-toggle-all-btn"
              onClick={handleToggleAll}
            >
              {allExpanded ? "Thu gọn hết" : "Mở rộng tất cả"}
            </button>
          )}
          <span className="text-xs text-text-secondary flex items-center gap-1">
            {isGroupOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {isGroupOpen && (
        <div className="ielts-explanation-items-list">
          {questionNumbers.map((qNum) => {
            const item = group.items?.find((it) => it.number === qNum);
            return (
              <IeltsReadingSingleExplanation
                key={qNum}
                qNum={qNum}
                evaluation={evaluation}
                testId={testId}
                passageText={passageText}
                questionItem={item}
                defaultOpen={allExpanded || (evaluation?.[qNum] && !evaluation[qNum].isCorrect)}
                isReview={isReview}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

