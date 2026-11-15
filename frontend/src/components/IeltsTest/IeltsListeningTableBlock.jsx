import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

/**
 * Authentic Cambridge IELTS Table Block Component
 */
export function IeltsListeningTableBlock({ tableBlock, answers, onChange, evaluation, isReview }) {
  if (!tableBlock) return null;

  const renderCell = (cell) => {
    if (cell === null || cell === undefined || cell === "-") {
      return <span style={{ color: "var(--text-muted)" }}>—</span>;
    }
    if (typeof cell === "string") {
      return <span>{cell}</span>;
    }
    if (cell.text && !cell.number) {
      return <span>{isReview ? <HighlightedVocabSentence text={cell.text} contextSentence={cell.text} /> : cell.text}</span>;
    }
    const qNum = cell.number;
    return (
      <div id={`ielts-q-${qNum}`} style={{ lineHeight: "2.3" }}>
        <span>{isReview ? <HighlightedVocabSentence text={cell.prefix} contextSentence={cell.prefix} /> : cell.prefix}</span>
        <span className="ielts-inline-input-wrapper" style={{ margin: "0 6px", display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}>
          <span className="ielts-q-pill" style={{ fontWeight: 700, fontSize: "0.82rem", background: "var(--primary)", color: "#ffffff", padding: "2px 7px", borderRadius: "4px", marginRight: "6px" }}>
            {qNum}
          </span>
          <input
            type="text"
            value={answers[qNum] || ""}
            onChange={(e) => onChange(qNum, e.target.value)}
            className={`ielts-real-input ${getFeedbackClass(evaluation, qNum, isReview)}`}
            style={{ minWidth: "110px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
          />
        </span>
        <span>{isReview ? <HighlightedVocabSentence text={cell.suffix} contextSentence={cell.suffix} /> : cell.suffix}</span>
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
            color: "var(--text-primary)",
            textAlign: "center"
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
          background: "var(--bg-card)",
          borderRadius: "8px",
          overflow: "hidden",
          border: "2px solid var(--border-color)"
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

