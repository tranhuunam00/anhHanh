import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

/**
 * Authentic Cambridge IELTS Form Block Component
 * Displays clean labeled form with title, field labels, and inline inputs.
 */
export function IeltsListeningFormBlock({ formBlock, answers, onChange, evaluation, isReview }) {
  if (!formBlock) return null;

  return (
    <div
      className="ielts-notes-block ielts-form-block"
      style={{
        padding: "24px 28px",
        background: "var(--bg-card)",
        borderRadius: "10px",
        border: "2px solid var(--border-color)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
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
            margin: "0 0 16px 0"
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
            fontSize: "1.25rem",
            textAlign: "center",
            color: "var(--text-primary)",
            margin: "0 0 20px 0",
            letterSpacing: "0.3px"
          }}
        >
          {formBlock.title}
        </h4>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "680px", margin: "0 auto" }}>
        {formBlock.fields?.map((f, idx) => {
          if (f.text) {
            return (
              <div key={idx} style={{ fontSize: "0.96rem", color: "var(--text-secondary)", lineHeight: "1.8" }}>
                {isReview ? <HighlightedVocabSentence text={f.text} contextSentence={f.text} /> : f.text}
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
              {f.label && (
                <span style={{ fontWeight: 600, color: "var(--text-primary)", minWidth: f.labelWidth || "auto" }}>
                  {f.label}
                </span>
              )}
              {f.prefix && <span>{f.prefix}</span>}
              <span className="ielts-inline-input-wrapper" style={{ margin: "0 4px", display: "inline-flex", alignItems: "center" }}>
                <span className="ielts-q-pill" style={{ fontWeight: 700, fontSize: "0.82rem", background: "var(--primary)", color: "#ffffff", padding: "2px 7px", borderRadius: "4px", marginRight: "6px" }}>
                  {qNum}
                </span>
                <input
                  type="text"
                  value={answers[qNum] || ""}
                  onChange={(e) => onChange(qNum, e.target.value)}
                  className={`ielts-real-input ${getFeedbackClass(evaluation, qNum, isReview)}`}
                  style={{ minWidth: "120px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                />
              </span>
              {f.suffix && <span>{isReview ? <HighlightedVocabSentence text={f.suffix} contextSentence={f.suffix} /> : f.suffix}</span>}
              {renderFeedback(evaluation, qNum, isReview)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

