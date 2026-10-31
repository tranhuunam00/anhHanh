import React from "react";
import { CheckCircle } from "../../constants/icons.js";

function getFeedbackClass(evaluation, qNum, isReview = false) {
  if (!isReview || !evaluation || !evaluation[qNum]) return "";
  return evaluation[qNum].isCorrect ? "input-correct" : "input-incorrect";
}

function renderFeedback(evaluation, qNum, isReview) {
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

export function renderPassage1Questions(groups, answers, onChange, evaluation, isReview) {
  const tableGroup = groups.find((g) => g.groupType === "table_completion");
  const tfGroup = groups.find((g) => g.groupType === "true_false_not_given");

  return (
    <div className="ielts-reading-questions-pane">
      {tableGroup && (
        <div className="ielts-question-card" id="ielts-q-1">
          <h5 className="ielts-card-title">{tableGroup.title}</h5>
          <pre className="ielts-instructions-text">{tableGroup.instructions}</pre>

          <div className="ielts-table-container">
            <table className="ielts-exercise-table ielts-reading-table mt-2">
              <thead>
                <tr>
                  <th className="col-subject" style={{ width: "20%" }}>Subject</th>
                  <th className="col-findings" style={{ width: "52%" }}>Research findings</th>
                  <th className="col-comment" style={{ width: "28%" }}>Comment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-subject">Humans</td>
                  <td className="col-findings">• humans experience REM sleep and non-REM sleep<br />• in REM sleep, the eyes and muscles move</td>
                  <td className="col-comment">Most dream states happen during REM sleep</td>
                </tr>
                <tr>
                  <td className="col-subject">
                    <span className="ielts-inline-input-wrapper" id="ielts-q-1">
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
                  <td className="col-findings">• similar brain patterns were observed when active and sleeping</td>
                  <td className="col-comment">indicative of dreaming</td>
                </tr>
                <tr>
                  <td className="col-subject">Pigeons</td>
                  <td className="col-findings">
                    when sleeping, pigeons displayed activity in parts of the brain that deal with{" "}
                    <span className="ielts-inline-input-wrapper" id="ielts-q-2">
                      <span className="ielts-q-pill">2</span>
                      <input
                        type="text"
                        value={answers[2] || ""}
                        onChange={(e) => onChange(2, e.target.value)}
                        className={`ielts-real-input ${getFeedbackClass(evaluation, 2)}`}
                      />
                    </span>
                    {renderFeedback(evaluation, 2, isReview)} input
                  </td>
                  <td className="col-comment">may have been dreaming of flying</td>
                </tr>
                <tr>
                  <td className="col-subject">Whales and dolphins</td>
                  <td className="col-findings">
                    • still have{" "}
                    <span className="ielts-inline-input-wrapper" id="ielts-q-3">
                      <span className="ielts-q-pill">3</span>
                      <input
                        type="text"
                        value={answers[3] || ""}
                        onChange={(e) => onChange(3, e.target.value)}
                        className={`ielts-real-input ${getFeedbackClass(evaluation, 3)}`}
                      />
                    </span>
                    {renderFeedback(evaluation, 3, isReview)} their brain awake when they sleep
                    <br />
                    • don't experience REM sleep, as this could affect their sensitivity to{" "}
                    <span className="ielts-inline-input-wrapper" id="ielts-q-4">
                      <span className="ielts-q-pill">4</span>
                      <input
                        type="text"
                        value={answers[4] || ""}
                        onChange={(e) => onChange(4, e.target.value)}
                        className={`ielts-real-input ${getFeedbackClass(evaluation, 4)}`}
                      />
                    </span>
                    {renderFeedback(evaluation, 4, isReview)}
                  </td>
                  <td className="col-comment">
                    their dreams are probably not very{" "}
                    <span className="ielts-inline-input-wrapper" id="ielts-q-5">
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
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tfGroup && (
        <div className="ielts-question-card" id="ielts-q-6">
          <h5 className="ielts-card-title">{tfGroup.title}</h5>
          <pre className="ielts-instructions-text">{tfGroup.instructions}</pre>
          <div className="ielts-tf-list">
            {tfGroup.items.map((item) => (
              <div key={item.number} className="ielts-tf-row" id={`ielts-q-${item.number}`}>
                <div className="ielts-tf-statement">
                  <span className="ielts-q-pill mr-2">{item.number}</span> {item.statement}
                </div>
                <div className="ielts-tf-options">
                  {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`ielts-tf-btn ${answers[item.number] === val ? "selected" : ""} ${getFeedbackClass(evaluation, item.number)}`}
                      onClick={() => onChange(item.number, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                {renderFeedback(evaluation, item.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function renderPassage2Questions(groups, answers, onChange, onChooseTwo, evaluation, isReview) {
  const matchingGroup = groups.find((g) => g.groupType === "matching_paragraphs");
  const chooseGroup = groups.find((g) => g.groupType === "choose_two");
  const summaryGroup = groups.find((g) => g.groupType === "summary_completion");

  return (
    <div className="ielts-reading-questions-pane">
      {matchingGroup && (
        <div className="ielts-question-card" id="ielts-q-14">
          <h5 className="ielts-card-title">{matchingGroup.title}</h5>
          <pre className="ielts-instructions-text">{matchingGroup.instructions}</pre>
          <div className="ielts-matching-list">
            {matchingGroup.items.map((item) => (
              <div key={item.number} className="ielts-matching-row" id={`ielts-q-${item.number}`}>
                <div className="ielts-matching-statement">
                  <span className="ielts-q-pill mr-2">{item.number}</span> {item.statement}
                </div>
                <select
                  value={answers[item.number] || ""}
                  onChange={(e) => onChange(item.number, e.target.value)}
                  className={`ielts-select-box ${getFeedbackClass(evaluation, item.number)}`}
                >
                  <option value="">Select (A-G)...</option>
                  {matchingGroup.options.map((opt) => (
                    <option key={opt} value={opt}>Paragraph {opt}</option>
                  ))}
                </select>
                {renderFeedback(evaluation, item.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}

      {chooseGroup && (
        <div className="ielts-question-card" id="ielts-q-20">
          <h5 className="ielts-card-title">{chooseGroup.title}</h5>
          <p className="ielts-prompt-text">{chooseGroup.prompt}</p>
          <div className="ielts-options-list">
            {chooseGroup.options.map((opt) => {
              const selected = [answers[chooseGroup.numbers[0]], answers[chooseGroup.numbers[1]]].filter(Boolean);
              return (
                <label key={opt.letter} className={`ielts-checkbox-label ${selected.includes(opt.letter) ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.letter)}
                    onChange={() => onChooseTwo(chooseGroup.numbers, opt.letter)}
                  />
                  <span className="ielts-opt-letter">{opt.letter}</span>
                  <span className="ielts-opt-text">{opt.text}</span>
                </label>
              );
            })}
          </div>
          {renderFeedback(evaluation, chooseGroup.numbers[0], isReview)}
          {renderFeedback(evaluation, chooseGroup.numbers[1], isReview)}
        </div>
      )}

      {summaryGroup && (
        <div className="ielts-question-card" id="ielts-q-22">
          <h5 className="ielts-card-title">{summaryGroup.title}</h5>
          <pre className="ielts-instructions-text">{summaryGroup.instructions}</pre>
          <div className="ielts-summary-passage-box">
            <h6>{summaryGroup.summaryTitle}</h6>
            <div className="ielts-summary-content">
              {summaryGroup.items.map((it) => (
                <span key={it.number}>
                  {it.prefix}
                  <span className="ielts-inline-input-wrapper" id={`ielts-q-${it.number}`}>
                    <span className="ielts-q-pill">{it.number}</span>
                    <input
                      type="text"
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-real-input ${getFeedbackClass(evaluation, it.number)}`}
                    />
                  </span>
                  {renderFeedback(evaluation, it.number, isReview)}
                  {it.suffix}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function renderPassage3Questions(groups, answers, onChange, evaluation, isReview) {
  const mcqGroup = groups.find((g) => g.title === "Questions 27-29");
  const boxGroup = groups.find((g) => g.groupType === "summary_completion_box");
  const ynGroup = groups.find((g) => g.groupType === "yes_no_not_given");
  const q40Group = groups.find((g) => g.title === "Question 40");

  return (
    <div className="ielts-reading-questions-pane">
      {mcqGroup && (
        <div className="ielts-question-card" id="ielts-q-27">
          <h5 className="ielts-card-title">{mcqGroup.title}</h5>
          <pre className="ielts-instructions-text">{mcqGroup.instructions}</pre>
          {mcqGroup.items.map((it) => (
            <div key={it.number} className="ielts-mcq-item" id={`ielts-q-${it.number}`}>
              <p className="ielts-mcq-prompt">
                <span className="ielts-q-pill mr-2">{it.number}</span> {it.prompt}
              </p>
              <div className="ielts-options-list">
                {it.options.map((opt) => (
                  <label key={opt.letter} className={`ielts-radio-label ${answers[it.number] === opt.letter ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name={`mcq-${it.number}`}
                      value={opt.letter}
                      checked={answers[it.number] === opt.letter}
                      onChange={() => onChange(it.number, opt.letter)}
                    />
                    <span className="ielts-opt-letter">{opt.letter}</span>
                    <span className="ielts-opt-text">{opt.text}</span>
                  </label>
                ))}
              </div>
              {renderFeedback(evaluation, it.number, isReview)}
            </div>
          ))}
        </div>
      )}

      {boxGroup && (
        <div className="ielts-question-card" id="ielts-q-30">
          <h5 className="ielts-card-title">{boxGroup.title}</h5>
          <pre className="ielts-instructions-text">{boxGroup.instructions}</pre>

          <div className="ielts-word-bank-grid">
            {boxGroup.boxOptions.map((opt) => (
              <span key={opt.letter} className="ielts-word-bank-item">
                <strong>{opt.letter}</strong> {opt.word}
              </span>
            ))}
          </div>

          <div className="ielts-summary-passage-box mt-3">
            <h6>{boxGroup.summaryTitle}</h6>
            <div className="ielts-summary-content">
              {boxGroup.items.map((it) => (
                <span key={it.number}>
                  {it.prefix}
                  <span className="ielts-inline-input-wrapper" id={`ielts-q-${it.number}`}>
                    <span className="ielts-q-pill">{it.number}</span>
                    <select
                      value={answers[it.number] || ""}
                      onChange={(e) => onChange(it.number, e.target.value)}
                      className={`ielts-select-box ielts-inline-select ${getFeedbackClass(evaluation, it.number)}`}
                    >
                      <option value="">A - I...</option>
                      {boxGroup.boxOptions.map((o) => (
                        <option key={o.letter} value={o.letter}>{o.letter} ({o.word})</option>
                      ))}
                    </select>
                  </span>
                  {renderFeedback(evaluation, it.number, isReview)}
                  {it.suffix}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {ynGroup && (
        <div className="ielts-question-card" id="ielts-q-36">
          <h5 className="ielts-card-title">{ynGroup.title}</h5>
          <pre className="ielts-instructions-text">{ynGroup.instructions}</pre>
          <div className="ielts-tf-list">
            {ynGroup.items.map((item) => (
              <div key={item.number} className="ielts-tf-row" id={`ielts-q-${item.number}`}>
                <div className="ielts-tf-statement">
                  <span className="ielts-q-pill mr-2">{item.number}</span> {item.statement}
                </div>
                <div className="ielts-tf-options">
                  {["YES", "NO", "NOT GIVEN"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`ielts-tf-btn ${answers[item.number] === val ? "selected" : ""} ${getFeedbackClass(evaluation, item.number)}`}
                      onClick={() => onChange(item.number, val)}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                {renderFeedback(evaluation, item.number, isReview)}
              </div>
            ))}
          </div>
        </div>
      )}

      {q40Group && (
        <div className="ielts-question-card" id="ielts-q-40">
          <h5 className="ielts-card-title">{q40Group.title}</h5>
          {q40Group.items.map((it) => (
            <div key={it.number} className="ielts-mcq-item">
              <p className="ielts-mcq-prompt">
                <span className="ielts-q-pill mr-2">{it.number}</span> {it.prompt}
              </p>
              <div className="ielts-options-list">
                {it.options.map((opt) => (
                  <label key={opt.letter} className={`ielts-radio-label ${answers[it.number] === opt.letter ? "checked" : ""}`}>
                    <input
                      type="radio"
                      name={`mcq-${it.number}`}
                      value={opt.letter}
                      checked={answers[it.number] === opt.letter}
                      onChange={() => onChange(it.number, opt.letter)}
                    />
                    <span className="ielts-opt-letter">{opt.letter}</span>
                    <span className="ielts-opt-text">{opt.text}</span>
                  </label>
                ))}
              </div>
              {renderFeedback(evaluation, it.number, isReview)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
