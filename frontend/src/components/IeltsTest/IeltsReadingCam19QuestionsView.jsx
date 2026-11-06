import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

/**
 * Universal Question Renderer for Cambridge 19 Reading Passages
 * Standard Cambridge split layout with question pills, options and inline answer inputs
 */
export function renderCam19ReadingPassageQuestions(groups, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  if (!groups || groups.length === 0) return null;

  return (
    <div className="ielts-questions-inner">
      {groups.map((group, gIdx) => {
        const { groupType, instructions, numbers, items } = group;
        const numLabel = numbers && numbers.length > 0 ? `Questions ${numbers[0]}–${numbers[numbers.length - 1]}` : "";

        return (
          <section key={gIdx} className="ielts-question-group" style={{ marginBottom: "28px" }}>
            {numLabel && <h4 className="ielts-group-title">{numLabel}</h4>}
            {instructions && (
              <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line", marginBottom: "14px" }}>
                {instructions}
              </p>
            )}

            {/* 1. TRUE / FALSE / NOT GIVEN or YES / NO / NOT GIVEN */}
            {(groupType === "true_false_not_given" || groupType === "yes_no_not_given") && (
              <div className="ielts-tf-list">
                {items?.map((it) => {
                  const opts = groupType === "yes_no_not_given"
                    ? ["YES", "NO", "NOT GIVEN"]
                    : ["TRUE", "FALSE", "NOT GIVEN"];

                  return (
                    <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                      <p className="ielts-tf-statement" style={{ marginBottom: "8px" }}>
                        <span className="ielts-q-pill">{it.number}</span> {it.statement}
                      </p>
                      <div className="ielts-tf-options" style={{ display: "flex", gap: "12px", marginLeft: "28px" }}>
                        {opts.map((val) => {
                          const isSelected = answers[it.number] === val;
                          return (
                            <label
                              key={val}
                              className={`ielts-tf-label ${isSelected ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                            >
                              <input
                                type="radio"
                                name={`q_${it.number}`}
                                value={val}
                                checked={isSelected}
                                onChange={() => onChange(it.number, val)}
                                className="ielts-radio-input"
                              />
                              <span>{val}</span>
                            </label>
                          );
                        })}
                      </div>
                      {renderFeedback(evaluation, it.number, isReview)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. FILL NOTES / TABLE / SUMMARY */}
            {(groupType === "fill_notes" ||
              groupType === "fill_summary" ||
              groupType === "notes_completion" ||
              groupType === "table_completion" ||
              groupType === "summary_completion") && (
              <div className="ielts-notes-list">
                {items?.map((it) => (
                  <div
                    key={it.number}
                    className="ielts-notes-item"
                    style={{
                      marginBottom: "14px",
                      lineHeight: "2.2",
                      fontSize: "1.02rem"
                    }}
                  >
                    <span>{it.prefix}</span>
                    <span className="ielts-inline-input-wrapper">
                      <span className="ielts-q-pill">{it.number}</span>
                      <input
                        type="text"
                        value={answers[it.number] || ""}
                        onChange={(e) => onChange(it.number, e.target.value)}
                        className={`ielts-real-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      />
                    </span>
                    <span>{it.suffix}</span>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                ))}
              </div>
            )}

            {/* 3. MULTIPLE CHOICE */}
            {groupType === "multiple_choice" && (
              <div className="ielts-mc-list">
                {items?.map((it) => (
                  <div key={it.number} className="ielts-mc-item" style={{ marginBottom: "20px" }}>
                    <p className="ielts-mc-question" style={{ fontWeight: 600, marginBottom: "8px" }}>
                      <span className="ielts-q-pill">{it.number}</span> {it.question}
                    </p>
                    <div className="ielts-mc-options" style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "28px" }}>
                      {it.options?.map((opt) => {
                        const optLetter = typeof opt === "string" ? opt.charAt(0) : opt.letter;
                        const optText = typeof opt === "string" ? opt : `${opt.letter}. ${opt.text}`;
                        const isSelected = answers[it.number] === optLetter;

                        return (
                          <label
                            key={optLetter}
                            className={`ielts-mcq-label ${isSelected ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <input
                              type="radio"
                              name={`q_${it.number}`}
                              value={optLetter}
                              checked={isSelected}
                              onChange={() => onChange(it.number, optLetter)}
                              className="ielts-radio-input"
                            />
                            <span>{optText}</span>
                          </label>
                        );
                      })}
                    </div>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                ))}
              </div>
            )}

            {/* 4. MATCHING (Headings / Info / People / Features) */}
            {(groupType.startsWith("matching") || groupType === "sentence_completion_endings") && (
              <div className="ielts-matching-list">
                {items?.map((it) => (
                  <div
                    key={it.number}
                    className="ielts-matching-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      padding: "8px 12px",
                      background: "var(--bg-secondary)",
                      borderRadius: "6px"
                    }}
                  >
                    <span style={{ fontSize: "0.95rem" }}>
                      <span className="ielts-q-pill">{it.number}</span> {it.question || it.statement}
                    </span>
                    <span className="ielts-inline-input-wrapper">
                      <input
                        type="text"
                        maxLength={4}
                        value={answers[it.number] || ""}
                        onChange={(e) => onChange(it.number, e.target.value.toUpperCase())}
                        placeholder="Letter"
                        className={`ielts-real-input ielts-short-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                        style={{ width: "70px", textAlign: "center", textTransform: "uppercase" }}
                      />
                      {renderFeedback(evaluation, it.number, isReview)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 5. CHOOSE TWO */}
            {groupType === "choose_two" && (
              <div className="ielts-choose-two-list">
                {items?.map((it) => (
                  <div key={it.number} className="ielts-choose-two-item" style={{ marginBottom: "18px" }}>
                    <p style={{ fontWeight: 600, marginBottom: "8px" }}>
                      <span className="ielts-q-pill">{it.number}</span> {it.question}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginLeft: "28px" }}>
                      {it.options?.map((opt) => {
                        const optLetter = typeof opt === "string" ? opt.charAt(0) : opt.letter;
                        const optText = typeof opt === "string" ? opt : `${opt.letter}. ${opt.text}`;
                        const isChecked = (answers[it.number] || "") === optLetter;

                        return (
                          <label
                            key={optLetter}
                            className={`ielts-mcq-label ${isChecked ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (onChooseTwoToggle && it.pairNumber) {
                                  onChooseTwoToggle([it.number, it.pairNumber], optLetter);
                                } else {
                                  onChange(it.number, isChecked ? "" : optLetter);
                                }
                              }}
                              className="ielts-checkbox-input"
                            />
                            <span>{optText}</span>
                          </label>
                        );
                      })}
                    </div>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

