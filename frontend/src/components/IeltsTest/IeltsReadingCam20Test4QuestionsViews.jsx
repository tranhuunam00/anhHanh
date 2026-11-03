import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test4Passage1Questions(groups, answers, onChange, evaluation, isReview) {
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");

  const renderNoteInput = (num) => (
    <span id={`ielts-q-${num}`} className="ielts-inline-input-wrapper">
      <span className="ielts-q-pill">{num}</span>
      <input
        type="text"
        value={answers[num] || ""}
        onChange={(e) => onChange(num, e.target.value)}
        className={`ielts-real-input ${getFeedbackClass(evaluation, num, isReview)}`}
      />
      {renderFeedback(evaluation, num, isReview)}
    </span>
  );

  return (
    <div className="ielts-questions-inner">
      {notesGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 1–7</h4>
          <p className="ielts-instructions-text">{notesGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.title}</h5>

            {notesGroup.sections?.map((sec, sIdx) => (
              <div key={sIdx} className="ielts-form-section">
                <h6>{sec.heading}</h6>
                <ul className="ielts-bullets">
                  {sec.items?.map((item) => (
                    <li key={item.number}>
                      {item.prefix}
                      {renderNoteInput(item.number)}
                      {item.suffix}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {tfGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 8–13</h4>
          <p className="ielts-instructions-text">{tfGroup.instructions}</p>
          <div className="ielts-tf-list">
            {tfGroup.items?.map((it) => (
              <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-label ${answers[it.number] === val ? "selected" : ""} ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
                        className="ielts-radio-input"
                      />
                      <span>{val}</span>
                    </label>
                  ))}
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function renderCam20Test4Passage2Questions(groups, answers, onChange, evaluation, isReview) {
  const matchInfoGroup = groups?.find((g) => g.groupType === "matching_information");
  const sentenceGroup = groups?.find((g) => g.groupType === "sentence_completion");
  const peopleGroup = groups?.find((g) => g.groupType === "matching_people");

  return (
    <div className="ielts-questions-inner">
      {matchInfoGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 14–17</h4>
          <p className="ielts-instructions-text">{matchInfoGroup.instructions}</p>
          <div className="ielts-match-info-list">
            {matchInfoGroup.items?.map((it) => (
              <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-match-info-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.statement}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">A-F</option>
                    {["A", "B", "C", "D", "E", "F"].map((lettr) => (
                      <option key={lettr} value={lettr}>Paragraph {lettr}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {sentenceGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 18–22</h4>
          <p className="ielts-instructions-text">{sentenceGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{sentenceGroup.title}</h5>
            <ul className="ielts-bullets">
              {sentenceGroup.items?.map((it) => (
                <li key={it.number}>
                  {it.prefix}
                  <span id={`ielts-q-${it.number}`} className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{it.number}</span>
                    <input
                      type="text"
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    />
                  </span>
                  {it.suffix}
                  {renderFeedback(evaluation, it.number, isReview)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {peopleGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 23–26</h4>
          <p className="ielts-instructions-text">{peopleGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h5 style={{ margin: "0 0 6px 0" }}>List of People</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {peopleGroup.people?.map((p) => (
                <li key={p.letter} style={{ margin: "3px 0" }}>
                  <strong>{p.letter}</strong>. {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {peopleGroup.items?.map((it) => (
              <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.statement}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">A-E</option>
                    {peopleGroup.people?.map((p) => (
                      <option key={p.letter} value={p.letter}>{p.letter} - {p.name}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function renderCam20Test4Passage3Questions(groups, answers, onChange, evaluation, isReview) {
  const matchInfoGroup = groups?.find((g) => g.groupType === "matching_information");
  const peopleGroup = groups?.find((g) => g.groupType === "matching_people");
  const summaryGroup = groups?.find((g) => g.groupType === "summary_completion");

  return (
    <div className="ielts-questions-inner">
      {matchInfoGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 27–31</h4>
          <p className="ielts-instructions-text">{matchInfoGroup.instructions}</p>
          <div className="ielts-match-info-list">
            {matchInfoGroup.items?.map((it) => (
              <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-match-info-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.statement}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">A-G</option>
                    {["A", "B", "C", "D", "E", "F", "G"].map((lettr) => (
                      <option key={lettr} value={lettr}>Paragraph {lettr}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {peopleGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 32–36</h4>
          <p className="ielts-instructions-text">{peopleGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h5 style={{ margin: "0 0 6px 0" }}>List of People</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {peopleGroup.people?.map((p) => (
                <li key={p.letter} style={{ margin: "3px 0" }}>
                  <strong>{p.letter}</strong>. {p.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {peopleGroup.items?.map((it) => (
              <div key={it.number} id={`ielts-q-${it.number}`} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.statement}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">A-E</option>
                    {peopleGroup.people?.map((p) => (
                      <option key={p.letter} value={p.letter}>{p.letter} - {p.name}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {summaryGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 37–40</h4>
          <p className="ielts-instructions-text">{summaryGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{summaryGroup.title}</h5>
            <div style={{ lineHeight: "2.1", fontSize: "0.95rem" }}>
              {summaryGroup.items?.map((it) => (
                <span key={it.number}>
                  {it.prefix}
                  <span id={`ielts-q-${it.number}`} className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{it.number}</span>
                    <input
                      type="text"
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    />
                    {renderFeedback(evaluation, it.number, isReview)}
                  </span>
                  {it.suffix}{" "}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

