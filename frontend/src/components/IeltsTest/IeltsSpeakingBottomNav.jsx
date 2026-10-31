import React from "react";
import { getPartQuestions } from "../../utils/ieltsSpeakingUtils.js";
import { ChevronLeft, ChevronRight, Check } from "../../constants/icons.js";

/**
 * IELTS Speaking Exam Bottom Question Strip (Standard Video-Call Examiner Layout)
 * Displays segmented pills for Part 1, Part 2, and Part 3 with answer indicators.
 */
export const IeltsSpeakingBottomNav = ({
  parts = [],
  activePart = 1,
  activeQuestionIdx = 0,
  answeredMap = {},
  onSelectQuestion,
  onPrevQuestion,
  onNextQuestion,
  isLocked = false
}) => {
  return (
    <footer className="ielts-speaking-bottom-strip">
      <div className="ielts-speaking-nav-cluster">
        {parts.map((p) => {
          const pNumber = p.partNumber;
          const questions = getPartQuestions(p);
          const isActivePart = activePart === pNumber;

          return (
            <div
              key={pNumber}
              className={`ielts-speaking-part-segment ${isActivePart ? "active" : ""}`}
            >
              <button
                type="button"
                className="ielts-speaking-part-tab-label"
                onClick={() => onSelectQuestion(pNumber, 0)}
                title={`Chuyển sang Part ${pNumber}`}
              >
                Part {pNumber}
              </button>

              <div className="ielts-speaking-pills-row">
                {questions.map((q, idx) => {
                  const key = `p${pNumber}_q${q.id}`;
                  const isAnswered = Boolean(answeredMap[key]);
                  const isCurrent = isActivePart && activeQuestionIdx === idx;

                  let pillClass = "ielts-speaking-pill";
                  if (isCurrent) pillClass += " current";
                  if (isAnswered) pillClass += " answered";

                  return (
                    <button
                      key={q.id}
                      type="button"
                      className={pillClass}
                      onClick={() => onSelectQuestion(pNumber, idx)}
                      title={`Part ${pNumber} - Câu ${q.id}`}
                    >
                      {isAnswered && !isCurrent ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : (
                        q.id
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Prev / Next Question Actions */}
      <div className="ielts-speaking-step-actions">
        <button
          type="button"
          className="ielts-step-btn prev"
          onClick={onPrevQuestion}
          title="Về câu hỏi trước"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Câu trước</span>
        </button>

        <button
          type="button"
          className="ielts-step-btn next"
          onClick={onNextQuestion}
          title="Sang câu hỏi tiếp theo"
        >
          <span>{activePart === 3 && activeQuestionIdx === 5 ? "Hoàn thành bài nói" : "Câu tiếp theo"}</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </footer>
  );
};

