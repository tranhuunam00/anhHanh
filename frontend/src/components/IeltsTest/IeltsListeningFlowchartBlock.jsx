import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

/**
 * Authentic Cambridge IELTS Flowchart Block Component
 * Displays boxed flowchart steps connected by downward arrows ↓,
 * with optional options box above.
 */
export function IeltsListeningFlowchartBlock({ flowchartBlock, answers, onChange, evaluation, isReview }) {
  if (!flowchartBlock) return null;

  return (
    <div
      className="ielts-flowchart-block"
      style={{
        margin: "24px 0",
        padding: "24px 28px",
        background: "var(--bg-card)",
        borderRadius: "10px",
        border: "2px solid var(--border-color)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)"
      }}
    >
      {flowchartBlock.groupTitle && (
        <h5
          style={{
            fontWeight: 700,
            fontSize: "1.02rem",
            color: "var(--text-primary)",
            margin: "0 0 4px 0"
          }}
        >
          {flowchartBlock.groupTitle}
        </h5>
      )}
      {flowchartBlock.instructions && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            margin: "0 0 16px 0"
          }}
        >
          {flowchartBlock.instructions}
        </p>
      )}

      {/* Options Reference Box if present */}
      {Array.isArray(flowchartBlock.boxOptions) && flowchartBlock.boxOptions.length > 0 && (
        <div
          className="ielts-flowchart-options-box"
          style={{
            maxWidth: "360px",
            margin: "0 auto 24px auto",
            padding: "14px 20px",
            border: "1.5px solid var(--border-color)",
            borderRadius: "8px",
            background: "var(--bg-secondary)"
          }}
        >
          {flowchartBlock.boxTitle && (
            <div
              style={{
                fontWeight: 700,
                fontSize: "0.96rem",
                textAlign: "center",
                marginBottom: "8px",
                color: "var(--text-primary)"
              }}
            >
              {flowchartBlock.boxTitle}
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: flowchartBlock.boxOptions.length > 4 ? "repeat(2, 1fr)" : "1fr",
              gap: "6px 16px",
              fontSize: "0.92rem",
              color: "var(--text-primary)"
            }}
          >
            {flowchartBlock.boxOptions.map((opt, oIdx) => (
              <div key={oIdx} style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontWeight: 700, minWidth: "18px", color: "var(--primary)" }}>
                  {typeof opt === "string" ? opt.split(" ")[0] : opt.letter}
                </span>
                <span>{typeof opt === "string" ? opt.replace(/^[A-Z]\s+/, "") : opt.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {flowchartBlock.title && (
        <h4
          className="ielts-flowchart-title"
          style={{
            fontWeight: 800,
            fontSize: "1.18rem",
            textAlign: "center",
            color: "var(--text-primary)",
            margin: "0 0 20px 0"
          }}
        >
          {flowchartBlock.title}
        </h4>
      )}

      {/* Vertical Steps with Downward Connecting Arrows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          maxWidth: "720px",
          margin: "0 auto",
          gap: "0"
        }}
      >
        {flowchartBlock.steps?.map((step, sIdx) => {
          const isLast = sIdx === (flowchartBlock.steps.length - 1);

          return (
            <React.Fragment key={sIdx}>
              <div
                className="ielts-flowchart-step-card"
                style={{
                  padding: "16px 20px",
                  borderRadius: "8px",
                  border: "1.5px solid var(--border-color)",
                  background: "var(--bg-secondary)",
                  lineHeight: "2.1",
                  fontSize: "0.98rem",
                  color: "var(--text-primary)"
                }}
              >
                {step.lines ? (
                  step.lines.map((ln, lIdx) => (
                    <div key={lIdx} style={{ marginBottom: lIdx < step.lines.length - 1 ? "6px" : 0 }}>
                      {renderStepLine(ln, answers, onChange, evaluation, isReview)}
                    </div>
                  ))
                ) : (
                  renderStepLine(step, answers, onChange, evaluation, isReview)
                )}
              </div>

              {!isLast && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "8px 0",
                    color: "var(--primary)",
                    fontSize: "1.4rem",
                    fontWeight: 700
                  }}
                >
                  ↓
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function renderStepLine(line, answers, onChange, evaluation, isReview) {
  if (line.text && !line.number) {
    return (
      <span>
        {isReview ? <HighlightedVocabSentence text={line.text} contextSentence={line.text} /> : line.text}
      </span>
    );
  }

  const qNum = line.number;
  const cleanPrefix = line.prefix || "";
  const cleanSuffix = line.suffix || "";

  return (
    <span id={`ielts-q-${qNum}`}>
      <span>{isReview ? <HighlightedVocabSentence text={cleanPrefix} contextSentence={cleanPrefix} /> : cleanPrefix}</span>
      <span className="ielts-inline-input-wrapper" style={{ margin: "0 6px", display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}>
        <span className="ielts-q-pill" style={{ fontWeight: 700, fontSize: "0.82rem", background: "var(--primary)", color: "#ffffff", padding: "2px 7px", borderRadius: "4px", marginRight: "6px" }}>
          {qNum}
        </span>
        <input
          type="text"
          value={answers[qNum] || ""}
          onChange={(e) => onChange(qNum, e.target.value)}
          className={`ielts-real-input ${getFeedbackClass(evaluation, qNum, isReview)}`}
          style={{ minWidth: "90px", maxWidth: "120px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
        />
      </span>
      <span>{isReview ? <HighlightedVocabSentence text={cleanSuffix} contextSentence={cleanSuffix} /> : cleanSuffix}</span>
      {renderFeedback(evaluation, qNum, isReview)}
    </span>
  );
}

