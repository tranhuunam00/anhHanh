import React from "react";
import { CheckCircle } from "../../constants/icons.js";

export function getFeedbackClass(evaluation, qNum, isReview = false) {
  if (!isReview || !evaluation || !evaluation[qNum]) return "";
  return evaluation[qNum].isCorrect ? "input-correct" : "input-incorrect";
}

export function renderFeedback(evaluation, qNum, isReview) {
  if (!evaluation || !evaluation[qNum] || !isReview) return null;
  const res = evaluation[qNum];
  return (
    <span className={`ielts-eval-badge ${res.isCorrect ? "correct" : "incorrect"}`}>
      {res.isCorrect ? (
        <span><CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Đúng</span>
      ) : (
        <span>Đáp án: <strong>{res.accepted?.join(" / ")}</strong></span>
      )}
    </span>
  );
}

export function renderPart1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">{part.instructions}</p>
      </div>

      <div className="ielts-table-container">
        <table className="ielts-exercise-table">
          <thead>
            <tr>
              <th style={{ width: "18%" }}>Class</th>
              <th style={{ width: "18%" }}>Date & Time</th>
              <th style={{ width: "12%" }}>Cost</th>
              <th style={{ width: "52%" }}>Details & Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Vietnamese food</strong></td>
              <td>
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">1</span>
                  <input
                    type="text"
                    value={answers[1] || ""}
                    onChange={(e) => onChange(1, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 1)}`}
                  />
                </span>
                {renderFeedback(evaluation, 1, isReview)}
              </td>
              <td>£59</td>
              <td>It provides information on the use of herbs. There are no places at present.</td>
            </tr>
            <tr>
              <td><strong>Bread making</strong></td>
              <td>20 March</td>
              <td>
                <span>£ </span>
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">2</span>
                  <input
                    type="text"
                    value={answers[2] || ""}
                    onChange={(e) => onChange(2, e.target.value)}
                    className={`ielts-real-input ielts-short-input ${getFeedbackClass(evaluation, 2)}`}
                  />
                </span>
                {renderFeedback(evaluation, 2, isReview)}
              </td>
              <td>
                Extra charge for ingredients. Participants make white bread, sourdough and{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">3</span>
                  <input
                    type="text"
                    value={answers[3] || ""}
                    onChange={(e) => onChange(3, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 3)}`}
                  />
                </span>
                {renderFeedback(evaluation, 3, isReview)}
              </td>
            </tr>
            <tr>
              <td><strong>Face massage</strong></td>
              <td>23 February</td>
              <td>£35</td>
              <td>
                The teacher trained in{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">4</span>
                  <input
                    type="text"
                    value={answers[4] || ""}
                    onChange={(e) => onChange(4, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 4)}`}
                  />
                </span>
                {renderFeedback(evaluation, 4, isReview)}
                <br />
                Bring a{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">5</span>
                  <input
                    type="text"
                    value={answers[5] || ""}
                    onChange={(e) => onChange(5, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 5)}`}
                  />
                </span>
                {renderFeedback(evaluation, 5, isReview)}
              </td>
            </tr>
            <tr>
              <td><strong>Candle making</strong></td>
              <td>
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">6</span>
                  <input
                    type="text"
                    value={answers[6] || ""}
                    onChange={(e) => onChange(6, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 6)}`}
                  />
                </span>
                {renderFeedback(evaluation, 6, isReview)}
              </td>
              <td>£52</td>
              <td>
                Only{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">7</span>
                  <input
                    type="text"
                    value={answers[7] || ""}
                    onChange={(e) => onChange(7, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 7)}`}
                  />
                </span>
                {renderFeedback(evaluation, 7, isReview)} ingredients are used. The candles can be used as presents.
              </td>
            </tr>
            <tr>
              <td><strong>Silk painting</strong></td>
              <td>18 May</td>
              <td>
                <span>£ </span>
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">8</span>
                  <input
                    type="text"
                    value={answers[8] || ""}
                    onChange={(e) => onChange(8, e.target.value)}
                    className={`ielts-real-input ielts-short-input ${getFeedbackClass(evaluation, 8)}`}
                  />
                </span>
                {renderFeedback(evaluation, 8, isReview)}
              </td>
              <td>
                Bring an apron or old{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">9</span>
                  <input
                    type="text"
                    value={answers[9] || ""}
                    onChange={(e) => onChange(9, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 9)}`}
                  />
                </span>
                {renderFeedback(evaluation, 9, isReview)}
              </td>
            </tr>
            <tr>
              <td><strong>DIY for beginners</strong></td>
              <td>24 February</td>
              <td>£125</td>
              <td>
                Learn how to:
                <br />
                • use a drill, saw and{" "}
                <span className="ielts-inline-input-wrapper">
                  <span className="ielts-q-pill">10</span>
                  <input
                    type="text"
                    value={answers[10] || ""}
                    onChange={(e) => onChange(10, e.target.value)}
                    className={`ielts-real-input ${getFeedbackClass(evaluation, 10)}`}
                  />
                </span>
                {renderFeedback(evaluation, 10, isReview)}
                <br />
                • put up a shelf.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function renderPart2(part, answers, onChange, onChooseTwo, evaluation, isReview, onOpenMap) {
  if (!part) return null;
  const chooseGroups = part.groups.filter((g) => g.groupType === "choose_two");
  const mapGroup = part.groups.find((g) => g.groupType === "map_labeling");

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

      {mapGroup && (
        <div className="ielts-question-card" id="ielts-q-15">
          <h5 className="ielts-card-title">{mapGroup.title}</h5>
          <p className="ielts-prompt-text">{mapGroup.prompt}</p>

          <div className="ielts-map-interactive-wrapper">
            <div className="ielts-map-image-container">
              <img
                src="/images/ielts/cam21_test2_listening_map.png"
                alt="Melby Coal Mine Site Map"
                className="ielts-inline-map-image"
              />
              <p className="ielts-visual-hint" style={{ marginTop: "10px" }}>
                Đối chiếu các vị trí chữ cái <strong>A - I</strong> trên sơ đồ mỏ than Melby để chọn địa điểm cho câu hỏi 15 - 20.
              </p>
            </div>

            <div className="ielts-map-questions-grid">
              {mapGroup.items.map((item) => (
                <div key={item.number} className="ielts-map-question-card" id={`ielts-q-${item.number}`}>
                  <span className="ielts-q-pill">{item.number}</span>
                  <span className="ielts-map-item-label">{item.label}</span>
                  <select
                    value={answers[item.number] || ""}
                    onChange={(e) => onChange(item.number, e.target.value)}
                    className={`ielts-select-box ${getFeedbackClass(evaluation, item.number)}`}
                  >
                    <option value="">Select (A-I)...</option>
                    {part.mapLetters.map((l) => (
                      <option key={l} value={l}>Location {l}</option>
                    ))}
                  </select>
                  {renderFeedback(evaluation, item.number, isReview)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function renderPart3(part, answers, onChange, onChooseTwo, evaluation, isReview) {
  if (!part) return null;
  const chooseGroups = part.groups.filter((g) => g.groupType === "choose_two");
  const flowGroup = part.groups.find((g) => g.groupType === "flow_chart");

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

      {flowGroup && (
        <div className="ielts-question-card" id="ielts-q-27">
          <h5 className="ielts-card-title">{flowGroup.title}</h5>
          <p className="ielts-prompt-text">{flowGroup.prompt}</p>

          <div className="ielts-flow-options-box">
            {flowGroup.boxOptions.map((opt) => (
              <div key={opt.letter} className="ielts-flow-option-badge">
                <strong>{opt.letter}</strong>: {opt.text}
              </div>
            ))}
          </div>

          <div className="ielts-flowchart-steps">
            {flowGroup.steps.map((step, idx) => (
              <React.Fragment key={step.number}>
                <div className="ielts-flowchart-step-card" id={`ielts-q-${step.number}`}>
                  <div className="ielts-flow-step-header">
                    <span className="ielts-flow-step-num">Step {idx + 1}</span>
                    <span className="ielts-flow-stage">{step.stage}</span>
                  </div>
                  <div className="ielts-flow-step-input">
                    <span className="ielts-q-pill">{step.number}</span>
                    <select
                      value={answers[step.number] || ""}
                      onChange={(e) => onChange(step.number, e.target.value)}
                      className={`ielts-select-box ${getFeedbackClass(evaluation, step.number)}`}
                    >
                      <option value="">Select (A-F)...</option>
                      {flowGroup.boxOptions.map((o) => (
                        <option key={o.letter} value={o.letter}>{o.letter} - {o.text}</option>
                      ))}
                    </select>
                    {renderFeedback(evaluation, step.number, isReview)}
                  </div>
                </div>
                {idx < flowGroup.steps.length - 1 && (
                  <div className="ielts-flow-arrow">↓</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function renderPart4(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <p className="ielts-instructions-text">{part.instructions}</p>
      </div>

      <div className="ielts-notes-card">
        {part.sections.map((sec, sIdx) => (
          <div key={sIdx} className="ielts-notes-section">
            <h5 className="ielts-notes-heading">{sec.heading}</h5>
            <div className="ielts-notes-items">
              {sec.items.map((it, iIdx) => {
                if (it.text) {
                  return (
                    <div key={iIdx} className="ielts-note-sentence-row">
                      <span className="ielts-note-bullet">•</span>
                      <span className="ielts-note-plain-text">
                        {it.text.replace(/^[•\s\u2022]+/, "")}
                      </span>
                    </div>
                  );
                }
                const cleanPrefix = it.prefix ? it.prefix.replace(/^[•\s\u2022]+/, "") : "";
                return (
                  <div key={iIdx} className="ielts-note-sentence-row" id={`ielts-q-${it.number}`}>
                    <span className="ielts-note-bullet">•</span>
                    {cleanPrefix && <span className="ielts-note-prefix">{cleanPrefix}</span>}
                    <span className="ielts-inline-input-wrapper">
                      <span className="ielts-q-pill">{it.number}</span>
                      <input
                        type="text"
                        value={answers[it.number] || ""}
                        onChange={(e) => onChange(it.number, e.target.value)}
                        className={`ielts-real-input ${getFeedbackClass(evaluation, it.number)}`}
                      />
                    </span>
                    {it.suffix && <span className="ielts-note-suffix">{it.suffix}</span>}
                    {renderFeedback(evaluation, it.number, isReview)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
