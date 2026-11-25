import React from "react";
import { HighlightedVocabSentence } from "../Vocab/HighlightedVocabSentence.jsx";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";
import {
  parseGapText,
  splitBullet,
  getSummaryParagraphs,
  getNotesSections,
  getReadingGroupLayout,
  getReferenceOptions,
  isLetterChoiceGroup
} from "../../utils/ieltsReadingLayoutUtils.js";

/**
 * Cambridge-style layouts for reading completion tasks:
 * summary box, notes with headings, table, and the group title.
 * Gaps are written as {N} in the data (see ieltsReadingLayoutUtils.js).
 */

function ReadingText({ text, isReview }) {
  if (!text) return null;
  return isReview ? <HighlightedVocabSentence text={text} contextSentence={text} /> : text;
}

/** One gap: number pill + text input, or a letter select for word-box tasks. */
export function ReadingGap({ number, gapProps }) {
  const { answers, onChange, evaluation, isReview, letterOptions } = gapProps;
  const feedbackClass = getFeedbackClass(evaluation, number, isReview);
  return (
    <>
      <span className="ielts-inline-input-wrapper" id={`ielts-q-${number}`}>
        <span className="ielts-q-pill">{number}</span>
        {letterOptions && letterOptions.length > 0 ? (
          <select
            value={answers[number] || ""}
            onChange={(e) => onChange(number, e.target.value)}
            className={`ielts-real-input ielts-gap-select ${feedbackClass}`}
            aria-label={`Question ${number}`}
          >
            <option value="">–</option>
            {letterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.value}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={answers[number] || ""}
            onChange={(e) => onChange(number, e.target.value)}
            className={`ielts-real-input ${feedbackClass}`}
            aria-label={`Question ${number}`}
          />
        )}
      </span>
      {renderFeedback(evaluation, number, isReview)}
    </>
  );
}

/** Text with inline gaps. */
export function ReadingGapText({ text, gapProps }) {
  return parseGapText(text).map((seg, idx) =>
    seg.type === "gap" ? (
      <ReadingGap key={`g${seg.number}-${idx}`} number={seg.number} gapProps={gapProps} />
    ) : (
      <ReadingText key={`t${idx}`} text={seg.value} isReview={gapProps.isReview} />
    )
  );
}

export function ReadingGroupTitle({ title }) {
  if (!title) return null;
  return <h5 className="ielts-layout-title">{title}</h5>;
}

function ReadingSummaryLayout({ group, gapProps }) {
  const title = group.summary?.title || group.title;
  return (
    <div className="ielts-summary-layout">
      <ReadingGroupTitle title={title} />
      {getSummaryParagraphs(group).map((para, idx) => (
        <p key={idx} className="ielts-layout-paragraph">
          <ReadingGapText text={para} gapProps={gapProps} />
        </p>
      ))}
    </div>
  );
}

function ReadingNotesLine({ text, gapProps }) {
  const { bullet, dash, text: body } = splitBullet(text);
  return (
    <li className={`ielts-notes-line ${bullet ? "has-bullet" : ""} ${dash ? "has-dash" : ""}`}>
      <ReadingGapText text={body} gapProps={gapProps} />
    </li>
  );
}

function ReadingNotesLayout({ group, gapProps }) {
  return (
    <div className="ielts-notes-layout">
      <ReadingGroupTitle title={group.notes?.title || group.title} />
      {getNotesSections(group).map((sec, sIdx) => (
        <div key={sIdx} className="ielts-notes-section">
          {sec.heading && (
            <p className="ielts-notes-heading">
              <ReadingGapText text={sec.heading} gapProps={gapProps} />
            </p>
          )}
          <ul className="ielts-notes-lines">
            {sec.lines.map((line, lIdx) => (
              <ReadingNotesLine key={lIdx} text={line} gapProps={gapProps} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ReadingTableCell({ cell, gapProps }) {
  const lines = String(cell ?? "").split("\n").filter((l) => l.trim() !== "");
  const hasBullets = lines.some((l) => {
    const marker = splitBullet(l);
    return marker.bullet || marker.dash;
  });
  if (!hasBullets) {
    return lines.map((line, idx) => (
      <div key={idx} className="ielts-table-cell-line">
        <ReadingGapText text={line} gapProps={gapProps} />
      </div>
    ));
  }
  return (
    <ul className="ielts-notes-lines">
      {lines.map((line, idx) => (
        <ReadingNotesLine key={idx} text={line} gapProps={gapProps} />
      ))}
    </ul>
  );
}

function ReadingTableLayout({ group, gapProps }) {
  const { title, headers, rows } = group.table;
  const colCount = Math.max(headers?.length || 0, ...rows.map((r) => (Array.isArray(r) ? r.length : 0)));
  return (
    <div className="ielts-table-container ielts-layout-table-wrap">
      <table className="ielts-layout-table">
        <thead>
          {title && (
            <tr>
              <th colSpan={colCount} className="ielts-layout-table-title">{title}</th>
            </tr>
          )}
          {Array.isArray(headers) && headers.length > 0 && (
            <tr>
              {headers.map((h, idx) => (
                <th key={idx}>{h}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {(Array.isArray(row) ? row : []).map((cell, cIdx) => (
                <td key={cIdx} className={cIdx === 0 ? "ielts-layout-table-rowhead" : ""}>
                  <ReadingTableCell cell={cell} gapProps={gapProps} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Builds the props shared by every gap of a group.
 */
export function buildGapProps(group, answers, onChange, evaluation, isReview) {
  return {
    answers: answers || {},
    onChange,
    evaluation,
    isReview,
    letterOptions: isLetterChoiceGroup(group) ? getReferenceOptions(group) : null
  };
}

/**
 * Renders the Cambridge layout of a group (summary / notes / table).
 * Returns null when the group has no layout, so the caller falls back to item rows.
 */
export function ReadingGroupLayout({ group, gapProps }) {
  const layout = getReadingGroupLayout(group);
  if (layout === "summary") return <ReadingSummaryLayout group={group} gapProps={gapProps} />;
  if (layout === "notes") return <ReadingNotesLayout group={group} gapProps={gapProps} />;
  if (layout === "table") return <ReadingTableLayout group={group} gapProps={gapProps} />;
  return null;
}
