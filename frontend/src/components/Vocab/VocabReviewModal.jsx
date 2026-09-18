import React, { useState, useEffect } from "react";
import { submitVocabReviewResult } from "../../services/authVocabService";
import "./VocabReviewModal.css";

export default function VocabReviewModal({ dueItems, token, onClose, onFinished }) {
  const [items, setItems] = useState(dueItems || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Per-question state
  const [selectedOption, setSelectedOption] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Assign random question type to each item: 0: MCQ, 1: Audio, 2: Context, 3: Flashcard
  const currentItem = items[currentIndex];
  const questionType = currentItem ? currentIndex % 4 : 0;

  useEffect(() => {
    // Reset state for new question
    setSelectedOption(null);
    setTextInput("");
    setIsAnswered(false);
    setIsCorrect(false);
    setIsFlipped(false);
    setSubmitting(false);

    // Auto play pronunciation if web SpeechSynthesis available
    if (currentItem && currentItem.word) {
      speakWord(currentItem.word);
    }
  }, [currentIndex, currentItem]);

  const speakWord = (wordText) => {
    if ("speechSynthesis" in window && wordText) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="vocab-review-backdrop" onClick={onClose}>
        <div className="vocab-review-modal" onClick={(e) => e.stopPropagation()}>
          <div className="review-empty">
            <h3>🎉 Bạn đã hoàn thành tất cả từ vựng cần ôn hôm nay!</h3>
            <p>Hãy quay lại vào ngày mai hoặc học bài học mới để lưu thêm từ vựng nhé.</p>
            <button className="btn-primary" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = async (correctStatus) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (token && currentItem) {
        await submitVocabReviewResult(currentItem.id, correctStatus, token);
      }
    } catch (err) {
      console.warn("Could not update review result:", err);
    }

    if (correctStatus) {
      setScore((s) => s + 1);
    }

    setSubmitting(false);

    if (currentIndex + 1 < items.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      if (onFinished) onFinished();
    }
  };

  // MCQ handler
  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    const correct = opt.trim().toLowerCase() === (currentItem.meaning || "").trim().toLowerCase();
    setIsCorrect(correct);

    setTimeout(() => {
      handleNext(correct);
    }, 1200);
  };

  // Text input submission handler (for Audio & Context modes)
  const handleSubmitText = (e) => {
    if (e) e.preventDefault();
    if (isAnswered || !textInput.trim()) return;

    setIsAnswered(true);
    const userClean = textInput.trim().toLowerCase();
    const targetClean = currentItem.word.trim().toLowerCase();
    const correct = userClean === targetClean;
    setIsCorrect(correct);

    setTimeout(() => {
      handleNext(correct);
    }, 1400);
  };

  // Flashcard self-eval handler
  const handleFlashcardEval = (correct) => {
    setIsAnswered(true);
    setIsCorrect(correct);
    setTimeout(() => {
      handleNext(correct);
    }, 400);
  };

  if (isCompleted) {
    const accuracy = Math.round((score / items.length) * 100);
    return (
      <div className="vocab-review-backdrop">
        <div className="vocab-review-modal summary-card" onClick={(e) => e.stopPropagation()}>
          <div className="summary-icon">🏆</div>
          <h2>Xuất sắc! Bạn đã hoàn thành bài ôn tập!</h2>
          <div className="summary-stats">
            <div className="stat-box">
              <span className="stat-val">{score} / {items.length}</span>
              <span className="stat-lbl">Trả lời đúng</span>
            </div>
            <div className="stat-box">
              <span className="stat-val">{accuracy}%</span>
              <span className="stat-lbl">Độ chính xác</span>
            </div>
          </div>
          <button className="btn-review-finish" onClick={onClose}>
            Hoàn thành & Thoát
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / items.length) * 100);

  return (
    <div className="vocab-review-backdrop">
      <div className="vocab-review-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="review-header">
          <div className="review-progress-container">
            <div className="review-progress-bar" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="review-counter">
            {currentIndex + 1} / {items.length}
          </div>
          <button className="btn-review-close" onClick={onClose} title="Đóng">✕</button>
        </div>

        {/* Question Area */}
        <div className="review-body">
          {/* MODE 0: Multiple Choice Quiz (Chọn Nghĩa) */}
          {questionType === 0 && (
            <div className="quiz-container mcq-mode">
              <span className="quiz-badge">🔘 Trắc nghiệm chọn nghĩa</span>
              {currentItem.image_url && (
                <img className="quiz-img" src={currentItem.image_url} alt={currentItem.word} />
              )}
              <div className="quiz-word-row">
                <h2 className="quiz-word">{currentItem.word}</h2>
                <button className="btn-audio" onClick={() => speakWord(currentItem.word)}>🔊</button>
              </div>
              {currentItem.phonetic && <div className="quiz-ipa">{currentItem.phonetic}</div>}

              <div className="options-grid">
                {(currentItem.options || []).map((opt, idx) => {
                  let cls = "btn-option";
                  if (isAnswered) {
                    if (opt.trim().toLowerCase() === (currentItem.meaning || "").trim().toLowerCase()) {
                      cls += " correct";
                    } else if (opt === selectedOption) {
                      cls += " incorrect";
                    }
                  }
                  return (
                    <button key={idx} className={cls} onClick={() => handleSelectOption(opt)} disabled={isAnswered}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 1: Audio Dictation Quiz (Nghe đoán từ) */}
          {questionType === 1 && (
            <div className="quiz-container audio-mode">
              <span className="quiz-badge">🎧 Nghe & Gõ lại từ tiếng Anh</span>
              <div className="audio-big-card" onClick={() => speakWord(currentItem.word)}>
                <span className="audio-big-icon">🔊</span>
                <span className="audio-hint-txt">Bấm để nghe âm thanh từ vựng</span>
              </div>
              {currentItem.meaning && (
                <div className="quiz-meaning-hint">Nghĩa tiếng Việt: <strong>{currentItem.meaning}</strong></div>
              )}

              <form onSubmit={handleSubmitText} className="text-quiz-form">
                <input
                  type="text"
                  className={`quiz-text-input ${isAnswered ? (isCorrect ? "input-correct" : "input-incorrect") : ""}`}
                  placeholder="Gõ từ tiếng Anh vào đây..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  autoFocus
                  disabled={isAnswered}
                />
                {!isAnswered && (
                  <button type="submit" className="btn-submit-answer" disabled={!textInput.trim()}>
                    Kiểm tra
                  </button>
                )}
              </form>

              {isAnswered && (
                <div className={`answer-feedback ${isCorrect ? "fb-correct" : "fb-incorrect"}`}>
                  {isCorrect ? "✅ Chính xác!" : `❌ Sai rồi! Đáp án đúng: ${currentItem.word}`}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: Context Fill-in-the-blank Quiz (Điền từ vào ngữ cảnh) */}
          {questionType === 2 && (
            <div className="quiz-container context-mode">
              <span className="quiz-badge">✍️ Điền từ vào câu ví dụ</span>
              <div className="context-box">
                "{currentItem.context_sentence
                  ? currentItem.context_sentence.replace(
                      new RegExp(currentItem.word, "gi"),
                      " [ ________ ] "
                    )
                  : ` [ ________ ] `}"
              </div>
              <div className="quiz-meaning-hint">Gợi ý nghĩa: <strong>{currentItem.meaning || "Chưa có nghĩa"}</strong></div>

              <form onSubmit={handleSubmitText} className="text-quiz-form">
                <input
                  type="text"
                  className={`quiz-text-input ${isAnswered ? (isCorrect ? "input-correct" : "input-incorrect") : ""}`}
                  placeholder="Điền từ tiếng Anh còn thiếu..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  autoFocus
                  disabled={isAnswered}
                />
                {!isAnswered && (
                  <button type="submit" className="btn-submit-answer" disabled={!textInput.trim()}>
                    Kiểm tra
                  </button>
                )}
              </form>

              {isAnswered && (
                <div className={`answer-feedback ${isCorrect ? "fb-correct" : "fb-incorrect"}`}>
                  {isCorrect ? "✅ Tuyệt vời!" : `❌ Đáp án đúng: ${currentItem.word}`}
                </div>
              )}
            </div>
          )}

          {/* MODE 3: Classic Flashcard Flip Quiz (Lật thẻ) */}
          {questionType === 3 && (
            <div className="quiz-container flashcard-mode">
              <span className="quiz-badge">🃏 Thẻ Ghi Nhớ (Flashcard)</span>
              <div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={() => setIsFlipped(!isFlipped)}>
                {!isFlipped ? (
                  <div className="card-front">
                    {currentItem.image_url && <img className="fc-img" src={currentItem.image_url} alt="" />}
                    <h2 className="fc-word">{currentItem.word}</h2>
                    {currentItem.phonetic && <div className="fc-ipa">{currentItem.phonetic}</div>}
                    <button className="btn-audio-fc" onClick={(e) => { e.stopPropagation(); speakWord(currentItem.word); }}>
                      🔊 Phổ biến âm
                    </button>
                    <div className="fc-flip-hint">👆 Chạm để lật xem nghĩa</div>
                  </div>
                ) : (
                  <div className="card-back">
                    <h3 className="fc-meaning">{currentItem.meaning || "Chưa có nghĩa tiếng Việt"}</h3>
                    {currentItem.context_sentence && (
                      <p className="fc-context">"{currentItem.context_sentence}"</p>
                    )}
                  </div>
                )}
              </div>

              {isFlipped && (
                <div className="flashcard-actions">
                  <button className="btn-fc-wrong" onClick={() => handleFlashcardEval(false)}>
                    ❌ Chưa thuộc
                  </button>
                  <button className="btn-fc-correct" onClick={() => handleFlashcardEval(true)}>
                    ✅ Thuộc rồi
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
