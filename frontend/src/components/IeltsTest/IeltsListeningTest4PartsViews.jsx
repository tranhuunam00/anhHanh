import React from "react";
import { getFeedbackClass, renderFeedback } from "./ieltsFeedbackHelpers.jsx";

export function renderTest4Part1(part, answers, onChange, evaluation, isReview) {
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
          Complete the form below.<br />
          Write <strong>ONE WORD ONLY</strong> for each answer.
        </p>
      </div>

      <div className="ielts-notes-container">
        <h4 className="ielts-form-title">Survey about shopping in Broadbeach</h4>

        <div className="ielts-form-section">
          <ul className="ielts-notes-list">
            <li>
              Name: Martyn {renderNoteInput(1)} .
            </li>
            <li>
              Today's journey to Broadbeach town centre: used his {renderNoteInput(2)} .
            </li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "16px 0 8px" }}>Purpose of today's trip:</h5>
          <ul className="ielts-notes-list">
            <li>has visited the {renderNoteInput(3)} .</li>
            <li>looking for a new {renderNoteInput(4)} .</li>
            <li>collecting {renderNoteInput(5)} (after repair)</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <ul className="ielts-notes-list">
            <li>
              Preferred day for shopping: {renderNoteInput(6)} .
            </li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "16px 0 8px" }}>Opinions about shopping in the town centre</h5>
          <ul className="ielts-notes-list">
            <li>Finds the service in shops is excellent</li>
            <li>Thinks there are too many places selling {renderNoteInput(7)} .</li>
            <li>Would like more places to buy {renderNoteInput(8)} .</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "16px 0 8px" }}>Opinions about new out-of-town Shopping Centre</h5>
          <ul className="ielts-notes-list">
            <li>Likes the {renderNoteInput(9)} best</li>
            <li>Believes the {renderNoteInput(10)} is unnecessary</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function renderTest4Part2(part, answers, onChange, onChooseTwo, evaluation, isReview) {
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
        <div className="ielts-question-card" style={{ marginTop: "24px" }} id="ielts-q-15">
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
                  <option value="">Select (A-G)...</option>
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

export function renderTest4Part3(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  const mcGroup = part.groups?.find((g) => g.groupType === "multiple_choice");
  const matchGroup = part.groups?.find((g) => g.groupType === "matching_box");

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">{part.instructions}</p>
      </div>

      {mcGroup && (
        <div className="ielts-question-card" style={{ marginBottom: "24px" }}>
          <h5 className="ielts-card-title">{mcGroup.title}</h5>
          <p className="ielts-instructions-text">{mcGroup.instruction}</p>
          <p style={{ fontWeight: 600, margin: "12px 0 16px" }}>Presentation on houses of the future</p>
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
        <div className="ielts-question-card" id="ielts-q-24">
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
                <span className="ielts-matching-label" style={{ maxWidth: "320px" }}>{it.label}</span>
                <select
                  value={answers[it.number] || ""}
                  onChange={(e) => onChange(it.number, e.target.value)}
                  className={`ielts-select-box ${getFeedbackClass(evaluation, it.number, isReview)}`}
                >
                  <option value="">Select (A-I)...</option>
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

export function renderTest4Part4(part, answers, onChange, evaluation, isReview) {
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
        <h4 className="ielts-form-title">Music therapy for surgical patients</h4>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "14px 0 8px" }}>Background</h5>
          <ul className="ielts-notes-list">
            <li>
              Surgery impacts patients because they may experience discomfort or unwelcome changes to their {renderNoteInput(31)} .
            </li>
            <li>Current post-surgical strategies focus mainly on pain relief.</li>
          </ul>
        </div>

        <div className="ielts-form-section">
          <h5 style={{ fontWeight: 600, margin: "14px 0 8px" }}>Recent research</h5>
          <ul className="ielts-notes-list">
            <li>
              A study reviewed data from about 100 {renderNoteInput(32)} and found that listening to music
              <ul style={{ marginLeft: "20px", marginTop: "4px" }}>
                <li>improved hospital patients' sense of wellbeing.</li>
                <li>reduced the length of their stay.</li>
              </ul>
            </li>
            <li style={{ marginTop: "6px" }}>
              The patients in the study all listened to music with a {renderNoteInput(33)} effect.
            </li>
            <li>
              The music was mostly played through music {renderNoteInput(34)} .
            </li>
            <li>
              Patients reported an absence or low levels of {renderNoteInput(35)} .
            </li>
            <li>
              Medical records confirmed that patients who were played music in hospital needed less {renderNoteInput(36)} than those who weren't played music.
            </li>
            <li>
              The best results were achieved when patients were played music while they were {renderNoteInput(37)} .
            </li>
            <li>
              The study concluded that playing music was effective because it served as a {renderNoteInput(38)} .
            </li>
            <li>
              The researchers recommend playing either music or sounds from {renderNoteInput(39)} to all surgical patients.
            </li>
            <li>
              A future study will investigate the best {renderNoteInput(40)} for the music.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

