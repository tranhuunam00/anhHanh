import React from "react";

/**
 * Helper to determine if a question has been answered
 */
export function isQuestionAnswered(answers, qNum) {
  if (!answers) return false;
  const val = answers[qNum] !== undefined ? answers[qNum] : answers[String(qNum)];
  if (val === undefined || val === null) return false;
  if (typeof val === "string") return val.trim().length > 0;
  if (Array.isArray(val)) return val.length > 0;
  return Boolean(val);
}

/**
 * IELTS Question Palette (Real Exam Navigation)
 * Highlights answered questions brightly with glowing indicator.
 * Displays sections by Part / Passage.
 */
export const IeltsQuestionPalette = ({
  totalQuestions = 40,
  answers = {},
  evaluation = null,
  activeNumber = null,
  onSelectQuestion,
  skill = "reading",
  className = ""
}) => {
  const numbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const answeredCount = numbers.filter((n) => isQuestionAnswered(answers, n)).length;

  const handleClick = (n) => {
    if (onSelectQuestion) {
      onSelectQuestion(n);
    }
    const elem = document.getElementById(`ielts-q-${n}`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Groupings by Part / Passage
  const groups =
    skill === "reading"
      ? [
          { label: "Part 1 (Q1-13)", range: [1, 13] },
          { label: "Part 2 (Q14-26)", range: [14, 26] },
          { label: "Part 3 (Q27-40)", range: [27, 40] }
        ]
      : [
          { label: "Part 1 (Q1-10)", range: [1, 10] },
          { label: "Part 2 (Q11-20)", range: [11, 20] },
          { label: "Part 3 (Q21-30)", range: [21, 30] },
          { label: "Part 4 (Q31-40)", range: [31, 40] }
        ];

  return (
    <div className={`ielts-palette-container ${className}`}>
      <div className="ielts-palette-header">
        <div className="ielts-palette-title-group">
          <span className="ielts-palette-dot" />
          <span className="ielts-palette-title">Bảng câu hỏi ({skill === "reading" ? "Reading 3 Parts" : "Listening 4 Parts"})</span>
        </div>
        <div className="ielts-palette-counter">
          Đã hoàn thành: <strong className="ielts-counter-number">{answeredCount}</strong>/{totalQuestions}
          <div className="ielts-palette-mini-progress">
            <div
              className="ielts-palette-mini-fill"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="ielts-palette-sections-list">
        {groups.map((grp) => {
          const groupNums = numbers.filter(
            (n) => n >= grp.range[0] && n <= grp.range[1]
          );
          const grpAnswered = groupNums.filter((n) => isQuestionAnswered(answers, n)).length;

          return (
            <div key={grp.label} className="ielts-palette-section-row">
              <div className="ielts-palette-section-tag">
                <span className="ielts-palette-tag-text">{grp.label}</span>
                <span className="ielts-palette-tag-count">({grpAnswered}/{groupNums.length})</span>
              </div>
              <div className="ielts-palette-grid">
                {groupNums.map((n) => {
                  const answered = isQuestionAnswered(answers, n);
                  const isCurrent = activeNumber === n;
                  const evalResult = evaluation ? evaluation[n] : null;

                  let statusClass = "unanswered";
                  if (evaluation) {
                    statusClass = evalResult?.isCorrect ? "correct" : "incorrect";
                  } else if (answered) {
                    statusClass = "answered glowing";
                  }

                  return (
                    <button
                      key={n}
                      type="button"
                      className={`ielts-palette-badge ${statusClass} ${isCurrent ? "current" : ""}`}
                      onClick={() => handleClick(n)}
                      title={`Câu ${n}: ${answered ? "Đã điền" : "Chưa điền"}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
