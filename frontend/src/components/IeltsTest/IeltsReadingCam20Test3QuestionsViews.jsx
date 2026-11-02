import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderCam20Test3Passage1Questions(groups, answers, onChange, evaluation, isReview) {
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");

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
    </div>
  );
}

export function renderCam20Test3Passage2Questions(groups, answers, onChange, onChooseTwoToggle, evaluation, isReview) {
  const headingsGroup = groups?.find((g) => g.groupType === "matching_headings");
  const chooseTwo1 = groups?.[1];
  const chooseTwo2 = groups?.[2];
  const notesGroup = groups?.find((g) => g.groupType === "fill_notes");

  return (
    <div className="ielts-questions-inner">
      {headingsGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 14–19</h4>
          <p className="ielts-instructions-text">{headingsGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h5 style={{ margin: "0 0 8px 0" }}>List of Headings</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {headingsGroup.headingsList?.map((h) => (
                <li key={h.roman} style={{ margin: "4px 0" }}>
                  <strong>{h.roman}</strong>. {h.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {headingsGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem", fontWeight: "600" }}>{it.paragraph}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">Chọn i-vii</option>
                    {headingsGroup.headingsList?.map((h) => (
                      <option key={h.roman} value={h.roman}>{h.roman}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {chooseTwo1 && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 20 and 21</h4>
          <p className="ielts-instructions-text">{chooseTwo1.instructions}</p>
          <div className="ielts-choose-two-list">
            {chooseTwo1.options?.map((opt) => {
              const isSelected =
                answers[20] === opt.letter || answers[21] === opt.letter;
              return (
                <label
                  key={opt.letter}
                  className={`ielts-choose-two-label ${isSelected ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onChooseTwoToggle(chooseTwo1.numbers, opt.letter)}
                    className="ielts-checkbox-input"
                  />
                  <span className="ielts-option-letter">{opt.letter}</span>
                  <span className="ielts-option-text">{opt.text}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, 20, isReview)}
          {renderFeedback(evaluation, 21, isReview)}
        </section>
      )}

      {chooseTwo2 && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 22 and 23</h4>
          <p className="ielts-instructions-text">{chooseTwo2.instructions}</p>
          <div className="ielts-choose-two-list">
            {chooseTwo2.options?.map((opt) => {
              const isSelected =
                answers[22] === opt.letter || answers[23] === opt.letter;
              return (
                <label
                  key={opt.letter}
                  className={`ielts-choose-two-label ${isSelected ? "selected" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onChooseTwoToggle(chooseTwo2.numbers, opt.letter)}
                    className="ielts-checkbox-input"
                  />
                  <span className="ielts-option-letter">{opt.letter}</span>
                  <span className="ielts-option-text">{opt.text}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, 22, isReview)}
          {renderFeedback(evaluation, 23, isReview)}
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
                  </span>
                  {it.suffix}
                  {renderFeedback(evaluation, it.number, isReview)}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export function renderCam20Test3Passage3Questions(groups, answers, onChange, evaluation, isReview) {
  const expertsGroup = groups?.find((g) => g.groupType === "matching_experts");
  const endingsGroup = groups?.find((g) => g.groupType === "sentence_completion_endings");
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");

  return (
    <div className="ielts-questions-inner">
      {expertsGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 27–33</h4>
          <p className="ielts-instructions-text">{expertsGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <h5 style={{ margin: "0 0 6px 0" }}>List of Experts</h5>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {expertsGroup.experts?.map((exp) => (
                <li key={exp.letter} style={{ margin: "3px 0" }}>
                  <strong>{exp.letter}</strong>. {exp.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {expertsGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.statement}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">A-C</option>
                    {expertsGroup.experts?.map((exp) => (
                      <option key={exp.letter} value={exp.letter}>{exp.letter} - {exp.name}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {endingsGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">Questions 34–36</h4>
          <p className="ielts-instructions-text">{endingsGroup.instructions}</p>

          <div className="ielts-options-box" style={{ marginBottom: "16px", padding: "12px", background: "var(--bg-secondary)", borderRadius: "8px" }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {endingsGroup.endings?.map((end) => (
                <li key={end.letter} style={{ margin: "4px 0" }}>
                  <strong>{end.letter}</strong>. {end.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="ielts-match-list">
            {endingsGroup.items?.map((it) => (
              <div key={it.number} className="ielts-match-item" style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <span className="ielts-q-pill">{it.number}</span>
                  <span style={{ flex: 1, fontSize: "0.95rem" }}>{it.prefix}</span>
                  <select
                    value={answers[it.number] || ""}
                    onChange={(e) => onChange(it.number, e.target.value)}
                    className={`ielts-select-input ${getFeedbackClass(evaluation, it.number, isReview)}`}
                    style={{ minWidth: "90px" }}
                  >
                    <option value="">A-D</option>
                    {endingsGroup.endings?.map((end) => (
                      <option key={end.letter} value={end.letter}>{end.letter}</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {mcGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">Questions 37–40</h4>
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
    </div>
  );
}

