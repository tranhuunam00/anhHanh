import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

/**
 * Authentic Cambridge IELTS Note Block Component
 * Displays clean framed notes with centered title, bold section headings,
 * properly indented bullet points and sub-bullets (en-dash), and responsive inputs.
 */
export function IeltsListeningNoteBlock({ noteBlock, answers, onChange, evaluation, isReview }) {
  if (!noteBlock) return null;

  return (
    <div
      className="ielts-notes-block"
      style={{
        padding: "24px 28px",
        background: "var(--bg-card)",
        borderRadius: "10px",
        border: "2px solid var(--border-color)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
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
            margin: "0 0 16px 0"
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
            fontSize: "1.25rem",
            textAlign: "center",
            color: "var(--text-primary)",
            margin: "0 0 20px 0",
            letterSpacing: "0.3px"
          }}
        >
          {noteBlock.title}
        </h4>
      )}

      {noteBlock.subtitle && (
        <p
          style={{
            fontStyle: "italic",
            fontSize: "0.94rem",
            textAlign: "center",
            color: "var(--text-secondary)",
            margin: "-12px 0 20px 0"
          }}
        >
          {noteBlock.subtitle}
        </p>
      )}

      {noteBlock.sections?.map((sec, secIdx) => {
        const hasNoBullets = Boolean(sec.noBullets || noteBlock.noBullets);

        return (
          <div
            key={secIdx}
            className="ielts-notes-section"
            style={{ marginTop: secIdx > 0 ? "20px" : "10px" }}
          >
            {sec.heading && (
              <h5
                style={{
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "var(--text-primary)",
                  margin: "0 0 10px 0",
                  paddingBottom: "4px"
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
                  const isSub = Boolean(line.isSubheading || line.subheading);
                  const cleanText = line.text.replace(/^[•\-\*–—−]\s*/, "");
                  const isSubDash = !isSub && (
                    Boolean(line.isSubItem || line.indent) ||
                    /^[–—−\-]/.test(line.text.trim())
                  );

                  if (isSub) {
                    return (
                      <li
                        key={lIdx}
                        style={{
                          marginTop: lIdx > 0 ? "14px" : "6px",
                          marginBottom: "6px",
                          lineHeight: "1.6",
                          fontSize: "1.01rem",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          paddingLeft: "0",
                          listStyleType: "none"
                        }}
                      >
                        {isReview ? <HighlightedVocabSentence text={cleanText} contextSentence={cleanText} /> : cleanText}
                      </li>
                    );
                  }

                  if (isSubDash) {
                    return (
                      <li
                        key={lIdx}
                        style={{
                          marginBottom: "8px",
                          lineHeight: "1.8",
                          fontSize: "0.96rem",
                          color: "var(--text-secondary)",
                          paddingLeft: "34px",
                          position: "relative"
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: "16px",
                            top: "0",
                            color: "var(--text-secondary)",
                            fontWeight: 600
                          }}
                        >
                          –
                        </span>
                        <span>{isReview ? <HighlightedVocabSentence text={cleanText} contextSentence={cleanText} /> : cleanText}</span>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={lIdx}
                      style={{
                        marginBottom: "8px",
                        lineHeight: "1.8",
                        fontSize: "0.96rem",
                        color: "var(--text-secondary)",
                        paddingLeft: hasNoBullets || line.noBullet ? "4px" : "18px",
                        position: "relative"
                      }}
                    >
                      {!hasNoBullets && !line.noBullet && (
                        <span
                          style={{
                            position: "absolute",
                            left: "2px",
                            top: "0.55em",
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "var(--text-muted)"
                          }}
                        />
                      )}
                      <span>{isReview ? <HighlightedVocabSentence text={cleanText} contextSentence={cleanText} /> : cleanText}</span>
                    </li>
                  );
                }

                // Question input line
                const qNum = line.number;
                const isSubDash = Boolean(line.isSubItem || line.indent) || /^[–—−\-]/.test((line.prefix || "").trim());
                const cleanPrefix = (line.prefix || "").replace(/^[•\-\*–—−]\s*/, "");
                const padLeft = isSubDash ? "34px" : (hasNoBullets || line.noBullet ? "4px" : "18px");

                return (
                  <li
                    key={lIdx}
                    id={`ielts-q-${qNum}`}
                    style={{
                      marginBottom: "12px",
                      lineHeight: "2.3",
                      fontSize: "0.98rem",
                      paddingLeft: padLeft,
                      position: "relative"
                    }}
                  >
                    {isSubDash ? (
                      <span
                        style={{
                          position: "absolute",
                          left: "16px",
                          top: "0.3em",
                          color: "var(--text-secondary)",
                          fontWeight: 600
                        }}
                      >
                        –
                      </span>
                    ) : (
                      !hasNoBullets && !line.noBullet && (
                        <span
                          style={{
                            position: "absolute",
                            left: "2px",
                            top: "0.75em",
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "var(--primary)"
                          }}
                        />
                      )
                    )}

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
                        style={{ minWidth: "120px", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)" }}
                      />
                    </span>
                    <span>{isReview ? <HighlightedVocabSentence text={line.suffix} contextSentence={line.suffix} /> : line.suffix}</span>
                    {renderFeedback(evaluation, qNum, isReview)}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

