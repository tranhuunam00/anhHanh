import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
export {
  extractQuestionNumbersFromBlock,
  extractAllHandledQuestionNumbers
} from "../../utils/ieltsListeningBlockUtils.js";

/**
 * Render a structured Note Block containing authentic titles, subtitles,
 * section headings, and mixed plain-text bullet points + input questions.
 */
export function renderNoteBlock(noteBlock, answers, onChange, evaluation, isReview) {
  if (!noteBlock) return null;

  return (
    <div
      className="ielts-notes-block"
      style={{
        padding: "20px 24px",
        background: "var(--bg-secondary)",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
        marginBottom: "24px"
      }}
    >
      {noteBlock.groupTitle && (
        <h5
          style={{
            fontWeight: 700,
            fontSize: "1.02rem",
            color: "var(--text-primary)",
            margin: "0 0 4px 0"
          }}
        >
          {noteBlock.groupTitle}
        </h5>
      )}
      {noteBlock.instructions && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            margin: "0 0 14px 0"
          }}
        >
          {noteBlock.instructions}
        </p>
      )}

      {noteBlock.title && (
        <h4
          className="ielts-notes-title"
          style={{
            fontWeight: 800,
            fontSize: "1.18rem",
            color: "var(--text-primary)",
            margin: "0 0 6px 0"
          }}
        >
          {noteBlock.title}
        </h4>
      )}

      {noteBlock.subtitle && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.92rem",
            color: "var(--text-secondary)",
            margin: "0 0 16px 0"
          }}
        >
          {noteBlock.subtitle}
        </p>
      )}

      {noteBlock.sections?.map((sec, secIdx) => (
        <div
          key={secIdx}
          className="ielts-notes-section"
          style={{ marginTop: secIdx > 0 ? "20px" : "12px" }}
        >
          {sec.heading && (
            <h5
              style={{
                fontWeight: 700,
                fontSize: "1.02rem",
                color: "var(--text-primary)",
                margin: "0 0 10px 0",
                paddingBottom: "4px",
                borderBottom: "1px dashed var(--border-color)"
              }}
            >
              {sec.heading}
            </h5>
          )}

          <ul
            className="ielts-notes-list"
            style={{
              listStyleType: "none",
              paddingLeft: "0",
              margin: 0
            }}
          >
            {sec.lines?.map((line, lIdx) => {
              if (line.text) {
                // Plain context sentence or bullet point (Zero text omission)
                return (
                  <li
                    key={lIdx}
                    style={{
                      marginBottom: "8px",
                      lineHeight: "1.8",
                      fontSize: "0.96rem",
                      color: "var(--text-secondary)",
                      paddingLeft: "14px",
                      position: "relative"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "0.5em",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "var(--text-muted)"
                      }}
                    />
                    <span>{line.text}</span>
                  </li>
                );
              }

              // Question input line
              const qNum = line.number;
              return (
                <li
                  key={lIdx}
                  id={`ielts-q-${qNum}`}
                  style={{
                    marginBottom: "12px",
                    lineHeight: "2.3",
                    fontSize: "0.98rem",
                    paddingLeft: "14px",
                    position: "relative"
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0.75em",
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: "var(--primary)"
                    }}
                  />
                  <span>{line.prefix}</span>
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{qNum}</span>
                    <input
                      type="text"
                      value={answers[qNum] || ""}
                      onChange={(e) => onChange(qNum, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, qNum, isReview)}`}
                      style={{ minWidth: "120px" }}
                    />
                  </span>
                  <span>{line.suffix}</span>
                  {renderFeedback(evaluation, qNum, isReview)}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

/**
 * Render a structured Form Block (e.g. Test 2 Part 1 Questions 1–6 Guitar Group)
 */
export function renderFormBlock(formBlock, answers, onChange, evaluation, isReview) {
  if (!formBlock) return null;

  return (
    <div
      className="ielts-notes-block"
      style={{
        padding: "20px 24px",
        background: "var(--bg-secondary)",
        borderRadius: "10px",
        border: "1px solid var(--border-color)",
        marginBottom: "24px"
      }}
    >
      {formBlock.groupTitle && (
        <h5
          style={{
            fontWeight: 700,
            fontSize: "1.02rem",
            color: "var(--text-primary)",
            margin: "0 0 4px 0"
          }}
        >
          {formBlock.groupTitle}
        </h5>
      )}
      {formBlock.instructions && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            margin: "0 0 14px 0"
          }}
        >
          {formBlock.instructions}
        </p>
      )}

      {formBlock.title && (
        <h4
          className="ielts-notes-title"
          style={{
            fontWeight: 800,
            fontSize: "1.18rem",
            color: "var(--text-primary)",
            margin: "0 0 16px 0",
            paddingBottom: "8px",
            borderBottom: "1px solid var(--border-color)"
          }}
        >
          {formBlock.title}
        </h4>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {formBlock.fields?.map((f, idx) => {
          if (f.text) {
            return (
              <div key={idx} style={{ fontSize: "0.96rem", color: "var(--text-secondary)" }}>
                {f.text}
              </div>
            );
          }
          const qNum = f.number;
          return (
            <div
              key={idx}
              id={`ielts-q-${qNum}`}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px",
                lineHeight: "2.3",
                fontSize: "0.98rem"
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{f.label}</span>
              <span className="ielts-inline-input-wrapper">
                <span className="ielts-q-pill">{qNum}</span>
                <input
                  type="text"
                  value={answers[qNum] || ""}
                  onChange={(e) => onChange(qNum, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, qNum, isReview)}`}
                  style={{ minWidth: "120px" }}
                />
              </span>
              <span>{f.suffix}</span>
              {renderFeedback(evaluation, qNum, isReview)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Render a structured IELTS Table Block (e.g. Test 2 Part 1 Q7–10, Test 3 Part 1 Q7–10, Test 4 Part 1 Q7–10)
 */
export function renderTableBlock(tableBlock, answers, onChange, evaluation, isReview) {
  if (!tableBlock) return null;

  const renderCell = (cell) => {
    if (cell === null || cell === undefined || cell === "-") {
      return <span style={{ color: "var(--text-muted)" }}>—</span>;
    }
    if (typeof cell === "string") {
      return <span>{cell}</span>;
    }
    if (cell.text && !cell.number) {
      return <span>{cell.text}</span>;
    }
    const qNum = cell.number;
    return (
      <div id={`ielts-q-${qNum}`} style={{ lineHeight: "2.2" }}>
        <span>{cell.prefix}</span>
        <span className="ielts-inline-input-wrapper">
          <span className="ielts-q-pill">{qNum}</span>
          <input
            type="text"
            value={answers[qNum] || ""}
            onChange={(e) => onChange(qNum, e.target.value)}
            className={`ielts-real-input ${getFeedbackClass(evaluation, qNum, isReview)}`}
            style={{ minWidth: "110px" }}
          />
        </span>
        <span>{cell.suffix}</span>
        {renderFeedback(evaluation, qNum, isReview)}
      </div>
    );
  };

  return (
    <div className="ielts-table-container" style={{ margin: "20px 0 24px", overflowX: "auto" }}>
      {tableBlock.groupTitle && (
        <h5
          style={{
            fontWeight: 700,
            fontSize: "1.02rem",
            color: "var(--text-primary)",
            margin: "0 0 4px 0"
          }}
        >
          {tableBlock.groupTitle}
        </h5>
      )}
      {tableBlock.instructions && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            margin: "0 0 14px 0"
          }}
        >
          {tableBlock.instructions}
        </p>
      )}

      {tableBlock.title && (
        <h4
          className="ielts-table-heading"
          style={{
            fontWeight: 700,
            fontSize: "1.08rem",
            marginBottom: "12px",
            color: "var(--text-primary)"
          }}
        >
          {tableBlock.title}
        </h4>
      )}

      <table
        className="ielts-exercise-table"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "var(--bg-secondary)",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid var(--border-color)"
        }}
      >
        <thead>
          <tr style={{ background: "rgba(99, 102, 241, 0.08)" }}>
            {tableBlock.headers?.map((h, hIdx) => (
              <th
                key={hIdx}
                style={{
                  padding: "10px 14px",
                  border: "1px solid var(--border-color)",
                  textAlign: "left",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  color: "var(--text-primary)"
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableBlock.rows?.map((row, rIdx) => {
            const cells = Array.isArray(row) ? row : Array.isArray(row?.cols) ? row.cols : [];
            return (
              <tr key={rIdx}>
                {cells.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border-color)",
                      verticalAlign: "top",
                      fontSize: "0.92rem",
                      color: "var(--text-primary)"
                    }}
                  >
                    {renderCell(cell)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Dispatcher to render a block of any supported type
 */
export function renderBlock(block, answers, onChange, evaluation, isReview) {
  if (!block) return null;
  if (block.type === "notes") {
    return renderNoteBlock(block, answers, onChange, evaluation, isReview);
  }
  if (block.type === "form") {
    return renderFormBlock(block, answers, onChange, evaluation, isReview);
  }
  if (block.type === "table") {
    return renderTableBlock(block, answers, onChange, evaluation, isReview);
  }
  return null;
}
