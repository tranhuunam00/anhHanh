import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
import { parseOption } from "../../utils/cambridgeOptionUtils.js";
import { IeltsExerciseExplanationGroup } from "./IeltsReadingExplanationCard.jsx";
import { ReadingGap, ReadingGroupLayout, ReadingGroupTitle, buildGapProps } from "./IeltsReadingGapLayouts.jsx";
import { IeltsReadingChooseTwo } from "./IeltsReadingChooseTwo.jsx";
import {
  getReadingGroupLayout,
  getReferenceOptions,
  getReferenceBoxPosition,
  isCompletionGroup
} from "../../utils/ieltsReadingLayoutUtils.js";

function ReviewText({ text, isReview }) {
  if (!text) return null;
  return isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text;
}

/** Reference box: list of headings / people / word box / endings. */
function ReferenceBox({ group, options, isReview }) {
  if (!options || options.length === 0) return null;
  return (
    <div
      className="ielts-box-options"
      style={{
        margin: "4px 0 18px",
        padding: "12px 16px",
        background: "var(--bg-secondary)",
        borderRadius: "8px",
        border: "1px solid var(--border-color)"
      }}
    >
      {group.boxTitle && (
        <h6 style={{ margin: "0 0 10px", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", textAlign: "center" }}>
          {group.boxTitle}
        </h6>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px" }}>
        {options.map((opt) => (
          <div key={opt.value} style={{ display: "flex", gap: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            <strong style={{ color: "var(--primary)", minWidth: "26px" }}>{opt.value}</strong>
            <span><ReviewText text={opt.text} isReview={isReview} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrueFalseItems({ group, answers, onChange, evaluation, isReview }) {
  const opts = group.groupType === "yes_no_not_given" ? ["YES", "NO", "NOT GIVEN"] : ["TRUE", "FALSE", "NOT GIVEN"];
  return (
    <div className="ielts-tf-list">
      {group.items?.map((it) => (
        <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-mc-item" style={{ marginBottom: "14px" }}>
          <div className="ielts-mc-question-row">
            <span className="ielts-q-pill">{it.number}</span>
            <p className="ielts-mc-question-text">
              <ReviewText text={it.statement || it.question} isReview={isReview} />
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
      ))}
    </div>
  );
}

/** Completion tasks: Cambridge layout (summary / notes / table) or one row per question. */
function CompletionItems({ group, gapProps }) {
  if (getReadingGroupLayout(group) !== "items") {
    return <ReadingGroupLayout group={group} gapProps={gapProps} />;
  }
  return (
    <div className="ielts-notes-list">
      <ReadingGroupTitle title={group.title} />
      {group.items?.map((it) => (
        <div key={it.number} className="ielts-notes-item" style={{ marginBottom: "14px", lineHeight: "2.2", fontSize: "1.02rem" }}>
          {it.question && (
            <span style={{ marginRight: "6px" }}>
              <ReviewText text={it.question} isReview={gapProps.isReview} />
            </span>
          )}
          <ReviewText text={it.prefix} isReview={gapProps.isReview} />
          <ReadingGap number={it.number} gapProps={gapProps} />
          <ReviewText text={it.suffix} isReview={gapProps.isReview} />
        </div>
      ))}
    </div>
  );
}

function MultipleChoiceItems({ group, answers, onChange, evaluation, isReview }) {
  return (
    <div className="ielts-mc-list">
      {group.items?.map((it) => (
        <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-mc-item" style={{ marginBottom: "16px" }}>
          <div className="ielts-mc-question-row">
            <span className="ielts-q-pill">{it.number}</span>
            <p className="ielts-mc-question-text">
              <ReviewText text={it.question} isReview={isReview} />
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
                    <ReviewText text={text} isReview={isReview} />
                  </span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, it.number, isReview)}
        </div>
      ))}
    </div>
  );
}

function getMatchOptions(it, group, referenceOptions, paragraphLetterIds) {
  if (Array.isArray(it.options) && it.options.length > 0) {
    return it.options.map((opt) => {
      const { letter, text } = parseOption(opt);
      return { value: letter, text };
    });
  }
  if (referenceOptions.length > 0) return referenceOptions;
  const letters = group.options || paragraphLetterIds || ["A", "B", "C", "D", "E", "F"];
  return letters.map((opt) => {
    const { letter, text } = parseOption(opt);
    return { value: letter, text };
  });
}

function MatchingItems({ group, referenceOptions, paragraphLetterIds, answers, onChange, evaluation, isReview }) {
  return (
    <div className="ielts-match-list">
      {group.items?.map((it) => {
        const matchOpts = getMatchOptions(it, group, referenceOptions, paragraphLetterIds);
        const label = it.question || it.statement || it.title;
        return (
          <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-match-item" style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                <span className="ielts-q-pill">{it.number}</span>
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  <ReviewText text={label} isReview={isReview} />
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
                {matchOpts.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.text && opt.text.toUpperCase() !== opt.value.toUpperCase() ? `${opt.value} - ${opt.text}` : opt.value}
                  </option>
                ))}
              </select>
            </div>
            {renderFeedback(evaluation, it.number, isReview)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Data-driven Question Renderer for Cambridge 16–19 Reading Passages.
 * Layout (summary box, notes, table, word box) comes from the test data.
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
        const { groupType = "", instructions, numbers } = group;
        const numLabel = group.heading ||
          (numbers && numbers.length > 0
            ? numbers.length === 2 && numbers[1] === numbers[0] + 1 && /choose|pick/.test(groupType)
              ? `Questions ${numbers[0]} and ${numbers[1]}`
              : `Questions ${numbers[0]}–${numbers[numbers.length - 1]}`
            : "");
        const referenceOptions = getReferenceOptions(group);
        const boxPosition = getReferenceBoxPosition(group);
        const shared = { group, answers, onChange, evaluation, isReview };
        const gapProps = buildGapProps(group, answers, onChange, evaluation, isReview);
        const isChooseTwo = groupType === "choose_two" || groupType === "pick_multiple";

        return (
          <section key={gIdx} className="ielts-question-group" style={{ marginBottom: "28px" }}>
            {numLabel && <h4 className="ielts-group-title">{numLabel}</h4>}
            {instructions && (
              <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line", marginBottom: "14px" }}>
                {instructions}
              </p>
            )}

            {boxPosition === "before" && <ReferenceBox group={group} options={referenceOptions} isReview={isReview} />}

            {group.imageUrl && <img src={group.imageUrl} alt={group.title || "Diagram"} className="ielts-group-diagram" loading="lazy" />}

            {(groupType === "true_false_not_given" || groupType === "yes_no_not_given") && <TrueFalseItems {...shared} />}

            {isCompletionGroup(group) && <CompletionItems group={group} gapProps={gapProps} />}

            {groupType === "multiple_choice" && <MultipleChoiceItems {...shared} />}

            {(groupType.startsWith("matching") || groupType === "sentence_completion_endings") && (
              <MatchingItems {...shared} referenceOptions={referenceOptions} paragraphLetterIds={paragraphLetterIds} />
            )}

            {isChooseTwo && <IeltsReadingChooseTwo {...shared} onChooseTwoToggle={onChooseTwoToggle} />}

            {boxPosition === "after" && <ReferenceBox group={group} options={referenceOptions} isReview={isReview} />}

            <IeltsExerciseExplanationGroup group={group} evaluation={evaluation} isReview={isReview} testId={testId} passageText={passageText} />
          </section>
        );
      })}
    </div>
  );
}

export const renderUniversalReadingPassageQuestions = renderCam19ReadingPassageQuestions;
