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
 * IELTS Question Palette (Top Horizontal Bar Standard)
 * Laid out in a single streamlined row at the top of the test module.
 * Combines Part switcher chips with all 40 question numbers arranged horizontally.
 * Maximizes vertical height for reading passage and question content.
 */
export const IeltsQuestionPalette = ({
  totalQuestions = 40,
  answers = {},
  evaluation = null,
  activeNumber = null,
  activePart = 1,
  onSelectPart = null,
  onSelectQuestion,
  skill = "reading",
  className = ""
}) => {
  const numbers = Array.from({ length: totalQuestions }, (_, i) => i + 1);
  const answeredCount = numbers.filter((n) => isQuestionAnswered(answers, n)).length;

  const handleClick = (n, targetPart) => {
    if (onSelectPart && targetPart && targetPart !== activePart) {
      onSelectPart(targetPart);
    }
    if (onSelectQuestion) {
      onSelectQuestion(n);
    }
    setTimeout(() => {
      const elem = document.getElementById(`ielts-q-${n}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  const groups =
    skill === "reading"
      ? [
          { partNumber: 1, label: "Part 1", range: [1, 13] },
          { partNumber: 2, label: "Part 2", range: [14, 26] },
          { partNumber: 3, label: "Part 3", range: [27, 40] }
        ]
      : [
          { partNumber: 1, label: "Part 1", range: [1, 10] },
          { partNumber: 2, label: "Part 2", range: [11, 20], hasMap: true },
          { partNumber: 3, label: "Part 3", range: [21, 30] },
          { partNumber: 4, label: "Part 4", range: [31, 40] }
        ];

  return (
    <div className={`ielts-top-palette-bar ${className}`}>
      {/* Left: Quick Part Switcher Pills */}
      <div className="ielts-top-palette-parts">
        {groups.map((grp) => {
          const isActive = activePart === grp.partNumber;
          const [start, end] = grp.range;
          let count = 0;
          for (let i = start; i <= end; i++) {
            if (isQuestionAnswered(answers, i)) count++;
          }
          const totalInGroup = end - start + 1;

          return (
            <button
              key={grp.partNumber}
              type="button"
              className={`ielts-top-part-chip ${isActive ? "active" : ""}`}
              onClick={() => onSelectPart && onSelectPart(grp.partNumber)}
              title={`Chuyển đến ${grp.label} (Câu ${start}-${end})`}
            >
              <span className="ielts-chip-name">{grp.label}</span>
              {grp.hasMap && <span className="ielts-chip-icon">🗺️</span>}
              <span className={`ielts-chip-count ${count === totalInGroup ? "done" : ""}`}>
                {count}/{totalInGroup}
              </span>
            </button>
          );
        })}
      </div>

      {/* Middle: All 40 questions arranged horizontally */}
      <div className="ielts-top-palette-strip">
        {groups.map((grp, gIdx) => {
          const groupNums = numbers.filter(
            (n) => n >= grp.range[0] && n <= grp.range[1]
          );

          return (
            <div key={grp.partNumber} className="ielts-top-palette-group">
              {gIdx > 0 && <div className="ielts-palette-divider-v" />}
              <div className="ielts-palette-badges-row">
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
                      id={`ielts-badge-${n}`}
                      type="button"
                      className={`ielts-palette-badge ${statusClass} ${isCurrent ? "current" : ""}`}
                      onClick={() => handleClick(n, grp.partNumber)}
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

      {/* Right: Answered Progress Summary */}
      <div className="ielts-top-palette-summary">
        <span className="ielts-summary-text">
          Đã làm: <strong>{answeredCount}</strong>/{totalQuestions}
        </span>
        <div className="ielts-summary-progress">
          <div
            className="ielts-summary-fill"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
