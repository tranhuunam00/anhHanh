import React from "react";

/**
 * Question Palette (Navigation Bar)
 * Displays question badges 1 to 40 with status indicators.
 * Allows quick jumping to any question on click.
 */
export const IeltsQuestionPalette = ({
  totalQuestions = 40,
  answers = {},
  evaluation = null,
  activeNumber = null,
  onSelectQuestion,
  className = ""
}) => {
  const numbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const answeredCount = numbers.filter((n) => {
    const val = answers[n];
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;

  const handleClick = (n) => {
    if (onSelectQuestion) {
      onSelectQuestion(n);
    }
    const elem = document.getElementById(`ielts-q-${n}`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={`ielts-palette-container ${className}`}>
      <div className="ielts-palette-header">
        <span className="ielts-palette-title">Bảng câu hỏi</span>
        <span className="ielts-palette-counter">
          Đã làm: <strong>{answeredCount}</strong>/{totalQuestions}
        </span>
      </div>

      <div className="ielts-palette-grid">
        {numbers.map((n) => {
          const isAnswered = answers[n] !== undefined && answers[n] !== "" && answers[n] !== null;
          const isCurrent = activeNumber === n;
          const evalResult = evaluation ? evaluation[n] : null;

          let statusClass = "unanswered";
          if (evaluation) {
            statusClass = evalResult?.isCorrect ? "correct" : "incorrect";
          } else if (isAnswered) {
            statusClass = "answered";
          }

          return (
            <button
              key={n}
              type="button"
              className={`ielts-palette-badge ${statusClass} ${isCurrent ? "current" : ""}`}
              onClick={() => handleClick(n)}
              title={`Câu ${n}: ${isAnswered ? "Đã trả lời" : "Chưa trả lời"}`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
};

