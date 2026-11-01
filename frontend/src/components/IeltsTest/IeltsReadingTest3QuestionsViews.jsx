import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderTest3Passage1Questions(groups, answers, onChange, evaluation, isReview) {
  const notesGroup = groups?.find((g) => g.groupType === "notes_completion");
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");

  const renderNoteInput = (num, placeholder = "") => (
    <span className="ielts-inline-input-wrapper">
      <span className="ielts-q-pill">{num}</span>
      <input
        type="text"
        placeholder={placeholder}
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
          <h4 className="ielts-group-title">{notesGroup.title}</h4>
          <p className="ielts-instructions-text">{notesGroup.instruction}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.heading}</h5>

            <div className="ielts-form-section">
              <h6>Adaptations</h6>
              <ul className="ielts-bullets">
                <li>
                  has a large bulbous nose with swollen nostrils that
                  <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                    <li>keep {renderNoteInput(1)} out</li>
                    <li>lower the temperature of its {renderNoteInput(2)} in summer</li>
                    <li>warm the air entering its lungs in winter</li>
                  </ul>
                </li>
                <li style={{ marginTop: "6px" }}>
                  grows a thick {renderNoteInput(3)} in winter, which it loses in spring
                </li>
              </ul>
            </div>

            <div className="ielts-form-section">
              <h6>Reasons for population decline</h6>
              <ul className="ielts-bullets">
                <li>
                  poaching, especially for the {renderNoteInput(4)} of male saiga
                </li>
                <li>
                  expansion of farms and settlements, causing
                  <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                    <li>reduction in the size of the saiga's {renderNoteInput(5)} .</li>
                    <li>loss of access to the {renderNoteInput(6)} which they use for migration</li>
                  </ul>
                </li>
                <li style={{ marginTop: "6px" }}>
                  various forms of disease, leading to mass mortality events
                </li>
                <li>
                  climate change, causing the disappearance of {renderNoteInput(7)} which the saiga relied on
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {tfGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{tfGroup.title}</h4>
          <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>{tfGroup.instruction}</p>
          <div className="ielts-tf-list">
            {tfGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }} id={`ielts-q-${it.number}`}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-option ${answers[it.number] === val ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
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

export function renderTest3Passage2Questions(groups, answers, onChange, evaluation, isReview) {
  const tfGroup = groups?.find((g) => g.groupType === "true_false_not_given");
  const notesGroup = groups?.find((g) => g.groupType === "notes_completion");

  const renderNoteInput = (num, placeholder = "") => (
    <span className="ielts-inline-input-wrapper">
      <span className="ielts-q-pill">{num}</span>
      <input
        type="text"
        placeholder={placeholder}
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
          <h4 className="ielts-group-title">{tfGroup.title}</h4>
          <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>{tfGroup.instruction}</p>
          <div className="ielts-tf-list">
            {tfGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }} id={`ielts-q-${it.number}`}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-option ${answers[it.number] === val ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
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
          <h4 className="ielts-group-title">{notesGroup.title}</h4>
          <p className="ielts-instructions-text">{notesGroup.instruction}</p>
          <div className="ielts-notes-form">
            <h5 className="ielts-form-title">{notesGroup.heading}</h5>

            <div className="ielts-form-section">
              <h6>Features</h6>
              <ul className="ielts-bullets">
                <li>the buses use designated {renderNoteInput(19)} to cut down on delays</li>
                <li>passengers pay fares before {renderNoteInput(20)} .</li>
                <li>passengers in {renderNoteInput(21)} can use every part of the system</li>
              </ul>
            </div>

            <div className="ielts-form-section">
              <h6>Problems</h6>
              <ul className="ielts-bullets">
                <li>the temperature control is sometimes not activated in order to reduce {renderNoteInput(22)} use</li>
                <li>insufficient number of vehicles are available due to the effects of a severe {renderNoteInput(23)} .</li>
                <li>passengers are unable to use {renderNoteInput(24)} because some equipment is out of action</li>
                <li>tickets have to be checked manually at station {renderNoteInput(25)} .</li>
                <li>{renderNoteInput(26)} frequently build up during rush hours</li>
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export function renderTest3Passage3Questions(groups, answers, onChange, evaluation, isReview) {
  const mcGroup = groups?.find((g) => g.groupType === "multiple_choice");
  const matchGroup = groups?.find((g) => g.groupType === "matching_sentence_endings");
  const ynnGroup = groups?.find((g) => g.groupType === "yes_no_not_given");

  return (
    <div className="ielts-questions-inner">
      {mcGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{mcGroup.title}</h4>
          <p className="ielts-instructions-text">{mcGroup.instruction}</p>
          {mcGroup.items.map((item) => (
            <div key={item.number} className="ielts-mc-item" id={`ielts-q-${item.number}`} style={{ marginBottom: "20px" }}>
              <p className="ielts-prompt-text">
                <span className="ielts-q-pill">{item.number}</span> {item.prompt}
              </p>
              <div className="ielts-options-list">
                {item.options.map((opt) => (
                  <label key={opt.letter} className={`ielts-radio-label ${answers[item.number] === opt.letter ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name={`q_${item.number}`}
                      value={opt.letter}
                      checked={answers[item.number] === opt.letter}
                      onChange={() => onChange(item.number, opt.letter)}
                    />
                    <span className="ielts-opt-letter">{opt.letter}</span>
                    <span className="ielts-opt-text">{opt.text}</span>
                  </label>
                ))}
              </div>
              {renderFeedback(evaluation, item.number, isReview)}
            </div>
          ))}
        </section>
      )}

      {matchGroup && (
        <section className="ielts-question-group" style={{ marginBottom: "28px" }}>
          <h4 className="ielts-group-title">{matchGroup.title}</h4>
          <p className="ielts-instructions-text">{matchGroup.instruction}</p>

          <div className="ielts-box-reference">
            <h5 className="ielts-box-heading">{matchGroup.boxTitle}</h5>
            <div className="ielts-box-options-grid">
              {matchGroup.boxOptions.map((opt) => (
                <div key={opt.letter} className="ielts-box-option-item">
                  <span className="ielts-box-opt-letter">{opt.letter}</span>
                  <span className="ielts-box-opt-desc">{opt.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ielts-sentence-completion-list" style={{ marginTop: "18px" }}>
            {matchGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-row" id={`ielts-q-${it.number}`}>
                <span className="ielts-q-pill">{it.number}</span>
                <span className="ielts-matching-label" style={{ maxWidth: "340px" }}>{it.prompt}</span>
                <select
                  value={answers[it.number] || ""}
                  onChange={(e) => onChange(it.number, e.target.value)}
                  className={`ielts-select-box ${getFeedbackClass(evaluation, it.number, isReview)}`}
                >
                  <option value="">Select (A-F)...</option>
                  {matchGroup.boxOptions.map((opt) => (
                    <option key={opt.letter} value={opt.letter}>
                      {opt.letter}: {opt.text}
                    </option>
                  ))}
                </select>
                {renderFeedback(evaluation, it.number, isReview)}
              </div>
            ))}
          </div>
        </section>
      )}

      {ynnGroup && (
        <section className="ielts-question-group">
          <h4 className="ielts-group-title">{ynnGroup.title}</h4>
          <p className="ielts-instructions-text" style={{ whiteSpace: "pre-line" }}>{ynnGroup.instruction}</p>
          <div className="ielts-tf-list">
            {ynnGroup.items.map((it) => (
              <div key={it.number} className="ielts-tf-item" style={{ marginBottom: "16px" }} id={`ielts-q-${it.number}`}>
                <p className="ielts-tf-statement">
                  <span className="ielts-q-pill">{it.number}</span> {it.statement}
                </p>
                <div className="ielts-tf-options">
                  {["YES", "NO", "NOT GIVEN"].map((val) => (
                    <label
                      key={val}
                      className={`ielts-tf-option ${answers[it.number] === val ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name={`q_${it.number}`}
                        value={val}
                        checked={answers[it.number] === val}
                        onChange={() => onChange(it.number, val)}
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

