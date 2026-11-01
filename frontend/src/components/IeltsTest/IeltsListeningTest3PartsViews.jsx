import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderTest3Part1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;

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
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Complete the notes below.<br />
          Write <strong>ONE WORD AND/OR A NUMBER</strong> for each answer.
        </p>
      </div>

      <div className="ielts-notes-container">
        <h4 className="ielts-form-title">Ferry to Shetland Islands</h4>

        <div className="ielts-form-section">
          <ul className="ielts-notes-list">
            <li>
              Name of ferry company: {renderNoteInput(1)} Ferries
            </li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "16px 0 8px" }}>Ferries</h5>
          <ul className="ielts-notes-list">
            <li>
              Ferries depart seven times per {renderNoteInput(2)} in summer
            </li>
            <li>
              Cost for four people with car: a little less than £ {renderNoteInput(3)}
            </li>
            <li>
              Cancellation policy: receive a {renderNoteInput(4)} (if cancelled a month in advance)
            </li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "16px 0 8px" }}>Advice</h5>
          <ul className="ielts-notes-list">
            <li>
              Cabins: book one with a {renderNoteInput(5)} (luxury cabins have a TV)
            </li>
            <li>
              Bring snacks and {renderNoteInput(6)} for the children
            </li>
            <li>
              A {renderNoteInput(7)} is required for the dog kennels
            </li>
            <li>
              Try to see {renderNoteInput(8)} in the morning
            </li>
            <li>
              If time, visit {renderNoteInput(9)} Castle
            </li>
            <li>
              The {renderNoteInput(10)} restaurant in a nearby village is recommended
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function renderTest3Part2(part, answers, onChange, onChooseTwo, evaluation, isReview) {
  if (!part) return null;
  const chooseGroups = part.groups?.filter((g) => g.groupType === "choose_two") || [];
  const mcGroup = part.groups?.find((g) => g.groupType === "multiple_choice");
  const matchGroup = part.groups?.find((g) => g.groupType === "matching_box");

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">{part.instructions}</p>
      </div>

      {chooseGroups.map((g) => {
        const selected = [answers[g.numbers[0]], answers[g.numbers[1]]].filter(Boolean);
        return (
          <div key={g.title} className="ielts-question-card" id={`ielts-q-${g.numbers[0]}`}>
            <h5 className="ielts-card-title">{g.title}</h5>
            <p className="ielts-prompt-text">{g.prompt}</p>
            <div className="ielts-options-list">
              {g.options.map((opt) => (
                <label key={opt.letter} className={`ielts-checkbox-label ${selected.includes(opt.letter) ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.letter)}
                    onChange={() => onChooseTwo(g.numbers, opt.letter)}
                  />
                  <span className="ielts-opt-letter">{opt.letter}</span>
                  <span className="ielts-opt-text">{opt.text}</span>
                </label>
              ))}
            </div>
            {renderFeedback(evaluation, g.numbers[0], isReview)}
            {renderFeedback(evaluation, g.numbers[1], isReview)}
          </div>
        );
      })}

      {mcGroup && (
        <div className="ielts-question-card" style={{ marginTop: "24px" }}>
          <h5 className="ielts-card-title">{mcGroup.title}</h5>
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
        </div>
      )}

      {matchGroup && (
        <div className="ielts-question-card" style={{ marginTop: "24px" }} id="ielts-q-17">
          <h5 className="ielts-card-title">{matchGroup.title}</h5>
          <p className="ielts-prompt-text" style={{ whiteSpace: "pre-line" }}>{matchGroup.prompt}</p>

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

          <div className="ielts-matching-items-list" style={{ marginTop: "18px" }}>
            {matchGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-row" id={`ielts-q-${it.number}`}>
                <span className="ielts-q-pill">{it.number}</span>
                <span className="ielts-matching-label">{it.label}</span>
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
        </div>
      )}
    </div>
  );
}

export function renderTest3Part3(part, answers, onChange, onChooseTwo, evaluation, isReview) {
  if (!part) return null;
  const chooseGroups = part.groups?.filter((g) => g.groupType === "choose_two") || [];
  const matchGroup = part.groups?.find((g) => g.groupType === "matching_box");

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">{part.instructions}</p>
      </div>

      {chooseGroups.map((g) => {
        const selected = [answers[g.numbers[0]], answers[g.numbers[1]]].filter(Boolean);
        return (
          <div key={g.title} className="ielts-question-card" id={`ielts-q-${g.numbers[0]}`}>
            <h5 className="ielts-card-title">{g.title}</h5>
            <p className="ielts-prompt-text">{g.prompt}</p>
            <div className="ielts-options-list">
              {g.options.map((opt) => (
                <label key={opt.letter} className={`ielts-checkbox-label ${selected.includes(opt.letter) ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.letter)}
                    onChange={() => onChooseTwo(g.numbers, opt.letter)}
                  />
                  <span className="ielts-opt-letter">{opt.letter}</span>
                  <span className="ielts-opt-text">{opt.text}</span>
                </label>
              ))}
            </div>
            {renderFeedback(evaluation, g.numbers[0], isReview)}
            {renderFeedback(evaluation, g.numbers[1], isReview)}
          </div>
        );
      })}

      {matchGroup && (
        <div className="ielts-question-card" style={{ marginTop: "24px" }} id="ielts-q-25">
          <h5 className="ielts-card-title">{matchGroup.title}</h5>
          <p className="ielts-prompt-text" style={{ whiteSpace: "pre-line" }}>{matchGroup.prompt}</p>

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

          <div className="ielts-matching-items-list" style={{ marginTop: "18px" }}>
            {matchGroup.items.map((it) => (
              <div key={it.number} className="ielts-matching-row" id={`ielts-q-${it.number}`}>
                <span className="ielts-q-pill">{it.number}</span>
                <span className="ielts-matching-label">{it.label}</span>
                <select
                  value={answers[it.number] || ""}
                  onChange={(e) => onChange(it.number, e.target.value)}
                  className={`ielts-select-box ${getFeedbackClass(evaluation, it.number, isReview)}`}
                >
                  <option value="">Select (A-H)...</option>
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
        </div>
      )}
    </div>
  );
}

export function renderTest3Part4(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;

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
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">
          Complete the notes below.<br />
          Write <strong>ONE WORD ONLY</strong> for each answer.
        </p>
      </div>

      <div className="ielts-notes-container">
        <h4 className="ielts-form-title">Invasive species</h4>
        <p style={{ fontStyle: "italic", marginBottom: "14px", color: "var(--text-secondary)" }}>
          Definition: an animal or plant that causes harm to an environment after being introduced by humans
        </p>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "14px 0 8px" }}>An invasive species can be a problem when it:</h5>
          <ul className="ielts-notes-list">
            <li>eats native species.</li>
            <li>introduces a new {renderNoteInput(31)}.</li>
            <li>takes food from native species.</li>
            <li>threatens an entire {renderNoteInput(32)}.</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "14px 0 8px" }}>How invasive species spread</h5>
          <ul className="ielts-notes-list">
            <li>
              accidentally e.g. via people returning from their {renderNoteInput(33)} or on cargo ships
            </li>
            <li>
              intentionally e.g. for pest control, or as {renderNoteInput(34)}.
            </li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "14px 0 8px" }}>Examples of invasive species</h5>
          <ul className="ielts-notes-list">
            <li>
              <strong>Rhinella marina (toads)</strong>
              <ul style={{ marginLeft: "20px", marginTop: "6px" }}>
                <li>
                  were introduced to Australia from Hawaii in 1935 to eat a type of insect that was damaging the {renderNoteInput(35)} plantations.
                </li>
                <li>failed to solve the problem and became widespread in the north of Australia.</li>
                <li>are poisonous for any species that eats them and reduce the food available for native frogs.</li>
              </ul>
            </li>
            <li style={{ marginTop: "10px" }}>
              Japanese knotweed plants were popular among 19th-century gardeners in the UK.
            </li>
            <li>
              Rhododendron plants prevent {renderNoteInput(36)} from reaching native plants.
            </li>
            <li>
              Grey squirrels from N. America reduce sources of food for the UK's native red squirrels and spread a {renderNoteInput(37)} that kills red squirrels.
            </li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "14px 0 8px" }}>Tackling invasive species</h5>
          <ul className="ielts-notes-list">
            <li>
              Monitoring helps us to understand the {renderNoteInput(38)} of invasive species and the impact they have.
            </li>
            <li>
              Setting up a national {renderNoteInput(39)} makes it easier to track them.
            </li>
            <li>
              Asking the public to {renderNoteInput(40)} and report them helps with monitoring.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

