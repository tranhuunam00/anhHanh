import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test1Passage1Questions(groups, answers, onChange, evaluation, isReview) {
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");

  const renderNoteInput = (num) => (
    <span className="ielts-inline-input-wrapper">
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
      {tfGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 1–6</h4>
          <p className="ielts-instructions-text">{tfGroup.instructions}</p>
          <div className="ielts-tf-list">
            {tfGroup.items?.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
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

      {notesGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 7–13</h4>
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
    </div>
  );
}

export function renderCam20Test1Passage2Questions(groups, answers, onChange, evaluation, isReview) {
  const matchInfoGroup = groups?.find((g) => g.groupType === "matching_information");
  const matchPeopleGroup = groups?.find((g) => g.groupType === "matching_people");
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");

  return (
    <div className="ielts-questions-inner">
      {matchInfoGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 14–18</h4>
          <p className="ielts-instructions-text">{matchInfoGroup.instructions}</p>
          <div className="ielts-match-info-list">
            {matchInfoGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-info-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.95rem" }}>{it.statement}</p>
                    <select
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      style={{ minWidth: "90px" }}
                    >
                      <option value="">Chọn A-G</option>
                      {["A", "B", "C", "D", "E", "F", "G"].map((letter) => (
                        <option key={letter} value={letter}>{letter}</option>
                      ))}
                    </select>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {matchPeopleGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 19–23</h4>
          <p className="ielts-instructions-text">{matchPeopleGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <strong>List of People</strong>
            <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0" }}>
              {matchPeopleGroup.optionsList?.map((opt) => (
                <li key={opt.letter} style={{ margin: "4px 0" }}>
                  <strong>{opt.letter}</strong>. {opt.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {matchPeopleGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.95rem" }}>{it.statement}</p>
                    <select
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      style={{ minWidth: "90px" }}
                    >
                      <option value="">Chọn A-C</option>
                      {matchPeopleGroup.optionsList?.map((opt) => (
                        <option key={opt.letter} value={opt.letter}>{opt.letter} - {opt.name}</option>
                      ))}
                    </select>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {notesGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 24–26</h4>
          <p className="ielts-instructions-text">{notesGroup.instructions}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.title}</h5>
            <ul className="ielts-bullets">
              {notesGroup.items?.map((it) => (
                <li key={it.number}>
                  {it.prefix}
                  <span className="ielts-inline-input-wrapper">
                    <span className="ielts-q-pill">{it.number}</span>
                    <input
                      type="text"
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    />
                    {renderFeedback(evaluation, it.number, isReview)}
                  </span>
                  {it.suffix}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export function renderCam20Test1Passage3Questions(groups, answers, onChange, evaluation, isReview) {
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");
  const endingsGroup = groups?.find((g) => g.groupType === "matching_endings");
  const ynGroup = groups?.find((g) => g.groupType === "yes_no_not_given");

  return (
    <div className="ielts-questions-inner">
      {mcGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 27–30</h4>
          <p className="ielts-instructions-text">{mcGroup.instructions}</p>
          <div className="ielts-mc-list">
            {mcGroup.items?.map((item) => (
              <div key={item.number} className="ielts-mc-item" style={{ marginBottom: "18px" }}>
                <div className="ielts-mc-question-row">
                  <span className="ielts-q-pill">{item.number}</span>
                  <p className="ielts-mc-question-text">{item.question}</p>
                </div>
                <div className="ielts-mc-options-list">
                  {item.options?.map((opt) => (
                    <label
                      key={opt.letter}
                      className={`ielts-mc-option-label ${
                        answers[item.number] === opt.letter ? "selected" : ""
                      } ${getFeedbackClass(evaluation, item.number, isReview)}`}
                    >
                      <input
                        type="radio"
                        name={`q_${item.number}`}
                        value={opt.letter}
                        checked={answers[item.number] === opt.letter}
                        onChange={() => onChange(item.number, opt.letter)}
                        className="ielts-radio-input"
                      />
                      <span className="ielts-option-letter">{opt.letter}</span>
                      <span className="ielts-option-text">{opt.text}</span>
                    </label>
                  ))}
                </div>
                {renderFeedback(evaluation, item.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {endingsGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 31–35</h4>
          <p className="ielts-instructions-text">{endingsGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {endingsGroup.optionsList?.map((opt) => (
                <li key={opt.letter} style={{ margin: "4px 0" }}>
                  <strong>{opt.letter}</strong>. {opt.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {endingsGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: "0.95rem" }}>{it.sentence}</p>
                    <select
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                      style={{ minWidth: "100px" }}
                    >
                      <option value="">Chọn A-G</option>
                      {endingsGroup.optionsList?.map((opt) => (
                        <option key={opt.letter} value={opt.letter}>{opt.letter} - {opt.text}</option>
                      ))}
                    </select>
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {ynGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 36–40</h4>
          <p className="ielts-instructions-text">{ynGroup.instructions}</p>
          <div className="ielts-tf-list">
            {ynGroup.items?.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["YES", "NO", "NOT GIVEN"].map((val) => (
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

