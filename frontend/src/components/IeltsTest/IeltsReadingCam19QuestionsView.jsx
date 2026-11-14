import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
import { parseOption } from "../../utils/cambridgeOptionUtils.js";
import { IeltsExerciseExplanationGroup } from "./IeltsReadingExplanationCard.jsx";

/**
 * Universal Question Renderer for Cambridge 19 Reading Passages
 * Conforms 100% to Cambridge 20 / 21 interactive cards, pills, and dropdown selectors
 */
export function renderCam19ReadingPassageQuestions(
  groups,
  answers,
  onChange,
  onChooseTwoToggle,
  evaluation,
  isReview,
  testId = "cambridge-19",
  passageText = "",
  paragraphs = []
) {
  if (!groups || groups.length === 0) return null;

  const paragraphLetterIds =
    Array.isArray(paragraphs) && paragraphs.length > 0 && /^[A-Z]$/.test(paragraphs[0]?.id)
      ? paragraphs.map((p) => p.id)
      : null;

  return (
    <div className="ielts-questions-inner">
      {groups.map((group, gIdx) => {
        const { groupType, instructions, numbers, items } = group;
        const numLabel =
          numbers && numbers.length > 0
            ? `Questions ${numbers[0]}–${numbers[numbers.length - 1]}`
            : "";

        const referenceOptions =
          group.boxOptions ||
          group.optionsList ||
          group.headingsList ||
          group.peopleList ||
          group.endingsList ||
          null;

        return (
          <section key={gIdx} className="ielts-question-group" style={{ marginBottom: "28px" }}>
            {numLabel && <h4 className="ielts-group-title">{numLabel}</h4>}
            {instructions && (
              <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line", marginBottom: "14px" }}>
                {instructions}
              </p>
            )}

            {/* Reference Box (Headings / People / Endings / Options) */}
            {referenceOptions && referenceOptions.length > 0 && (
              <div
                className="ielts-box-options"
                style={{
                  marginBottom: "18px",
                  padding: "12px 16px",
                  background: "var(--bg-secondary)",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)"
                }}
              >
                <h6 style={{ margin: "0 0 10px", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
                  {group.boxTitle || "List of Options / Choices:"}
                </h6>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "8px" }}>
                  {referenceOptions.map((opt) => {
                    const { letter, text } = parseOption(opt);
                    return (
                      <div key={letter} style={{ display: "flex", gap: "8px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
                        <strong style={{ color: "var(--primary)", minWidth: "22px" }}>{letter}.</strong>
                        <span>{isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. TRUE / FALSE / NOT GIVEN or YES / NO / NOT GIVEN */}
            {(groupType === "true_false_not_given" || groupType === "yes_no_not_given") && (
              <div className="ielts-tf-list">
                {items?.map((it) => {
                  const opts =
                    groupType === "yes_no_not_given"
                      ? ["YES", "NO", "NOT GIVEN"]
                      : ["TRUE", "FALSE", "NOT GIVEN"];

                  return (
                    <div
                      key={it.number}
                      id={`ielts-q-${it.number}`}
                      className="ielts-mc-item"
                      style={{ marginBottom: "14px" }}
                    >
                      <div className="ielts-mc-question-row">
                        <span className="ielts-q-pill">{it.number}</span>
                        <p className="ielts-mc-question-text">
                          {isReview ? <HighlightedVocabSentence text={it.statement || it.question} contextSentence={it.statement || it.question} /> : (it.statement || it.question)}
                        </p>
                      </div>
                      <div className="ielts-tf-options" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                        {opts.map((val) => {
                          const isSelected = answers[it.number] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => onChange(it.number, val)}
                              className={`ielts-tf-btn ${isSelected ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                              style={{
                                padding: "8px 14px",
                                borderRadius: "6px",
                                border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border-color)",
                                background: isSelected ? "var(--primary)" : "var(--bg-secondary)",
                                color: isSelected ? "#ffffff" : "var(--text-primary)",
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                      {renderFeedback(evaluation, it.number, isReview)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 2. FILL NOTES / SUMMARY / TABLE */}
            {(groupType.includes("fill") ||
              groupType.includes("notes") ||
              groupType.includes("summary") ||
              groupType.includes("table") ||
              groupType.includes("completion") ||
              groupType.includes("flowchart")) && (
              <div className="ielts-notes-list">
                {items?.map((it) => (
                  <div
                    key={it.number}
                    id={`ielts-q-${it.number}`}
                    className="ielts-notes-item"
                    style={{
                      marginBottom: "14px",
                      lineHeight: "2.2",
                      fontSize: "1.02rem"
                    }}
                  >
                    <span>{isReview ? <HighlightedVocabSentence text={it.prefix} contextSentence={it.prefix} /> : it.prefix}</span>
                    <span className="ielts-inline-input-wrapper">
                      <span className="ielts-q-pill">{it.number}</span>
                      <input
                        type="text"
                        value={answers[it.number] || ""}
                        onChange={(e) => onChange(it.number, e.target.value)}
                        className={`ielts-real-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      />
                    </span>
                    <span>{isReview ? <HighlightedVocabSentence text={it.suffix} contextSentence={it.suffix} /> : it.suffix}</span>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                ))}
              </div>
            )}

            {/* 3. MULTIPLE CHOICE */}
            {groupType === "multiple_choice" && (
              <div className="ielts-mc-list">
                {items?.map((it) => (
                  <div
                    key={it.number}
                    id={`ielts-q-${it.number}`}
                    className="ielts-mc-item"
                    style={{ marginBottom: "16px" }}
                  >
                    <div className="ielts-mc-question-row">
                      <span className="ielts-q-pill">{it.number}</span>
                      <p className="ielts-mc-question-text">
                        {isReview ? <HighlightedVocabSentence text={it.question} contextSentence={it.question} /> : it.question}
                      </p>
                    </div>
                    <div className="ielts-mc-options-list">
                      {it.options?.map((rawOpt) => {
                        const { letter, text } = parseOption(rawOpt);
                        const isSelected = answers[it.number] === letter;

                        return (
                          <label
                            key={letter}
                            className={`ielts-mc-option-label ${isSelected ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                          >
                            <input
                              type="radio"
                              name={`q_${it.number}`}
                              value={letter}
                              checked={isSelected}
                              onChange={() => onChange(it.number, letter)}
                              className="ielts-radio-input"
                            />
                            <span className="ielts-option-letter">{letter}</span>
                            <span className="ielts-option-text">
                              {isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                ))}
              </div>
            )}

            {/* 4. MATCHING (Headings / Info / People / Features / Endings) */}
            {(groupType.startsWith("matching") || groupType === "sentence_completion_endings") && (
              <div className="ielts-match-list">
                {items?.map((it) => {
                  const matchOpts =
                    it.options ||
                    referenceOptions ||
                    group.options ||
                    paragraphLetterIds || [
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F"
                    ];

                  return (
                    <div
                      key={it.number}
                      id={`ielts-q-${it.number}`}
                      className="ielts-match-item"
                      style={{ marginBottom: "12px" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                          <span className="ielts-q-pill">{it.number}</span>
                          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                            {isReview ? <HighlightedVocabSentence text={it.question || it.statement || it.title} contextSentence={it.question || it.statement || it.title} /> : (it.question || it.statement || it.title)}
                          </span>
                        </div>
                        <select
                          value={answers[it.number] || ""}
                          onChange={(e) => onChange(it.number, e.target.value)}
                          className={`ielts-select-box ${getFeedbackClass(evaluation, it.number, isReview)}`}
                          style={{
                            minWidth: "120px",
                            maxWidth: "280px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border-color)",
                            background: "var(--bg-secondary)",
                            color: "var(--text-primary)",
                            fontWeight: 600,
                            cursor: "pointer"
                          }}
                        >
                          <option value="">Chọn đáp án...</option>
                          {matchOpts.map((opt) => {
                            const { letter, text } = parseOption(opt);
                            const displayLabel =
                              text && text.toUpperCase() !== letter.toUpperCase()
                                ? `${letter} - ${text}`
                                : letter;
                            return (
                              <option key={letter} value={letter}>
                                {displayLabel}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      {renderFeedback(evaluation, it.number, isReview)}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. CHOOSE TWO */}
            {groupType === "choose_two" && (
              <div className="ielts-choose-two-list">
                {items?.map((it) => {
                  if (it.pairNumber && it.number > it.pairNumber) {
                    return null;
                  }
                  const pairNum = it.pairNumber;

                  return (
                    <div
                      key={it.number}
                      id={`ielts-q-${it.number}`}
                      className="ielts-mc-item"
                      style={{ marginBottom: "16px" }}
                    >
                      <div className="ielts-mc-question-row">
                        <span className="ielts-q-pill">
                          {it.number}{pairNum ? ` & ${pairNum}` : ""}
                        </span>
                        <p className="ielts-mc-question-text">
                          {isReview ? <HighlightedVocabSentence text={it.question} contextSentence={it.question} /> : it.question}
                        </p>
                      </div>
                      <div className="ielts-choose-two-options">
                        {it.options?.map((rawOpt) => {
                          const { letter, text } = parseOption(rawOpt);
                          const isChecked =
                            answers[it.number] === letter ||
                            (pairNum && answers[pairNum] === letter);

                          return (
                            <label
                              key={letter}
                              className={`ielts-choose-two-label ${isChecked ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (onChooseTwoToggle && pairNum) {
                                    onChooseTwoToggle([it.number, pairNum], letter);
                                  } else {
                                    onChange(it.number, isChecked ? "" : letter);
                                  }
                                }}
                                className="ielts-checkbox-input"
                              />
                              <span className="ielts-option-letter">{letter}</span>
                              <span className="ielts-option-text">
                                {isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                        {renderFeedback(evaluation, it.number, isReview)}
                        {pairNum && renderFeedback(evaluation, pairNum, isReview)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <IeltsExerciseExplanationGroup group={group} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
          </section>
        );
      })}
    </div>
  );
}

export const renderUniversalReadingPassageQuestions = renderCam19ReadingPassageQuestions;
