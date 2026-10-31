import React from "react";
import { CheckCircle } from "../../constants/icons.js";

export function getFeedbackClass(evaluation, qNum) {
  if (!evaluation || !evaluation[qNum]) return "";
  return evaluation[qNum].isCorrect ? "input-correct" : "input-incorrect";
}

export function renderFeedback(evaluation, qNum, isReview) {
  if (!evaluation || !evaluation[qNum] || !isReview) return null;
  const res = evaluation[qNum];
  return (
    <div className={`ielts-eval-badge ${res.isCorrect ? "correct" : "incorrect"}`}>
      {res.isCorrect ? (
        <span><CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Chính xác</span>
      ) : (
        <span>Đáp án: <strong>{res.accepted?.join(" / ")}</strong></span>
      )}
    </div>
  );
}

export function renderPart1(part, answers, onChange, evaluation, isReview) {
  if (!part) return null;
  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <pre className="ielts-instructions-text">{part.instructions}</pre>
      </div>

      <div className="ielts-table-container">
        <table className="ielts-exercise-table">
          <thead>
            <tr>
              <th>Khóa học</th>
              <th>Ngày</th>
              <th>Học phí</th>
              <th>Ghi chú & Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Vietnamese food</strong></td>
              <td>
                <span className="ielts-q-anchor" id="ielts-q-1">1.</span>
                <input
                  type="text"
                  placeholder="Điền ngày..."
                  value={answers[1] || ""}
                  onChange={(e) => onChange(1, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 1)}`}
                />
                {renderFeedback(evaluation, 1, isReview)}
              </td>
              <td>£59</td>
              <td>It provides information on the use of herbs. There are no places at present.</td>
            </tr>
            <tr>
              <td><strong>Bread making</strong></td>
              <td>20 March</td>
              <td>
                <span className="ielts-q-anchor" id="ielts-q-2">2. £ </span>
                <input
                  type="text"
                  placeholder="Điền giá..."
                  value={answers[2] || ""}
                  onChange={(e) => onChange(2, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 2)}`}
                />
                {renderFeedback(evaluation, 2, isReview)}
              </td>
              <td>
                Extra charge for ingredients. Participants make white bread, sourdough and{" "}
                <span className="ielts-q-anchor" id="ielts-q-3">3.</span>
                <input
                  type="text"
                  placeholder="Điền từ..."
                  value={answers[3] || ""}
                  onChange={(e) => onChange(3, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 3)}`}
                />
                {renderFeedback(evaluation, 3, isReview)}
              </td>
            </tr>
            <tr>
              <td><strong>Face massage</strong></td>
              <td>23 February</td>
              <td>£35</td>
              <td>
                The teacher trained in <span className="ielts-q-anchor" id="ielts-q-4">4.</span>
                <input
                  type="text"
                  placeholder="Điền nơi..."
                  value={answers[4] || ""}
                  onChange={(e) => onChange(4, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 4)}`}
                />
                {renderFeedback(evaluation, 4, isReview)}
                <br />
                Bring a <span className="ielts-q-anchor" id="ielts-q-5">5.</span>
                <input
                  type="text"
                  placeholder="Điền vật..."
                  value={answers[5] || ""}
                  onChange={(e) => onChange(5, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 5)}`}
                />
                {renderFeedback(evaluation, 5, isReview)}
              </td>
            </tr>
            <tr>
              <td><strong>Candle making</strong></td>
              <td>
                <span className="ielts-q-anchor" id="ielts-q-6">6.</span>
                <input
                  type="text"
                  placeholder="Điền ngày..."
                  value={answers[6] || ""}
                  onChange={(e) => onChange(6, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 6)}`}
                />
                {renderFeedback(evaluation, 6, isReview)}
              </td>
              <td>£52</td>
              <td>
                Only <span className="ielts-q-anchor" id="ielts-q-7">7.</span>
                <input
                  type="text"
                  placeholder="Điền loại..."
                  value={answers[7] || ""}
                  onChange={(e) => onChange(7, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 7)}`}
                />
                {renderFeedback(evaluation, 7, isReview)} ingredients are used. The candles can be used as presents.
              </td>
            </tr>
            <tr>
              <td><strong>Silk painting</strong></td>
              <td>18 May</td>
              <td>
                <span className="ielts-q-anchor" id="ielts-q-8">8. £ </span>
                <input
                  type="text"
                  placeholder="Điền giá..."
                  value={answers[8] || ""}
                  onChange={(e) => onChange(8, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 8)}`}
                />
                {renderFeedback(evaluation, 8, isReview)}
              </td>
              <td>
                Bring an apron or old <span className="ielts-q-anchor" id="ielts-q-9">9.</span>
                <input
                  type="text"
                  placeholder="Điền đồ..."
                  value={answers[9] || ""}
                  onChange={(e) => onChange(9, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 9)}`}
                />
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
                • use a drill, saw and <span className="ielts-q-anchor" id="ielts-q-10">10.</span>
                <input
                  type="text"
                  placeholder="Điền dụng cụ..."
                  value={answers[10] || ""}
                  onChange={(e) => onChange(10, e.target.value)}
                  className={`ielts-text-input ${getFeedbackClass(evaluation, 10)}`}
                />
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

export function renderPart2(part, answers, onChange, onChooseTwo, evaluation, isReview) {
  if (!part) return null;
  const chooseGroups = part.groups.filter((g) => g.groupType === "choose_two");
  const mapGroup = part.groups.find((g) => g.groupType === "map_labeling");

  return (
    <div className="ielts-part-content">
      <div className="ielts-instructions-banner">
        <h4>{part.title}</h4>
        <pre className="ielts-instructions-text">{part.instructions}</pre>
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
          <div className="ielts-map-items-grid">
            {mapGroup.items.map((item) => (
              <div key={item.number} className="ielts-map-item-row" id={`ielts-q-${item.number}`}>
                <span className="ielts-q-anchor">{item.number}. {item.label}</span>
                <select
                  value={answers[item.number] || ""}
                  onChange={(e) => onChange(item.number, e.target.value)}
                  className={`ielts-select-box ${getFeedbackClass(evaluation, item.number)}`}
                >
                  <option value="">Chọn chữ cái...</option>
                  {part.mapLetters.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                {renderFeedback(evaluation, item.number, isReview)}
              </div>
            ))}
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
        <pre className="ielts-instructions-text">{part.instructions}</pre>
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
              <div key={step.number} className="ielts-flowchart-step-card" id={`ielts-q-${step.number}`}>
                <div className="ielts-flow-step-header">
                  <span className="ielts-flow-step-num">Bước {idx + 1}</span>
                  <span className="ielts-flow-stage">{step.stage}</span>
                </div>
                <div className="ielts-flow-step-input">
                  <span className="ielts-q-anchor">{step.number}.</span>
                  <select
                    value={answers[step.number] || ""}
                    onChange={(e) => onChange(step.number, e.target.value)}
                    className={`ielts-select-box ${getFeedbackClass(evaluation, step.number)}`}
                  >
                    <option value="">Chọn A - F...</option>
                    {flowGroup.boxOptions.map((o) => (
                      <option key={o.letter} value={o.letter}>{o.letter} ({o.text.substring(0, 30)}...)</option>
                    ))}
                  </select>
                </div>
                {renderFeedback(evaluation, step.number, isReview)}
              </div>
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
        <pre className="ielts-instructions-text">{part.instructions}</pre>
      </div>

      <div className="ielts-notes-card">
        {part.sections.map((sec, sIdx) => (
          <div key={sIdx} className="ielts-notes-section">
            <h5 className="ielts-notes-heading">{sec.heading}</h5>
            <div className="ielts-notes-items">
              {sec.items.map((it, iIdx) => {
                if (it.text) {
                  return <p key={iIdx} className="ielts-note-plain-text">{it.text}</p>;
                }
                return (
                  <div key={iIdx} className="ielts-note-fill-row" id={`ielts-q-${it.number}`}>
                    <span className="ielts-note-prefix">{it.prefix}</span>
                    <span className="ielts-q-anchor">[{it.number}]</span>
                    <input
                      type="text"
                      placeholder="Một từ..."
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-text-input ${getFeedbackClass(evaluation, it.number)}`}
                    />
                    <span className="ielts-note-suffix">{it.suffix}</span>
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

