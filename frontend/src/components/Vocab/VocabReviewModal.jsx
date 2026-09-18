import React, { useState, useEffect } from "react";
import { submitVocabReviewResult } from "../../services/authVocabService";
import "./VocabReviewModal.css";

// Styled Modern Vector Icons
const SvgVolume = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const SvgCheck = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SvgClose = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SvgTrophy = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
  </svg>
);

const SvgHeadphones = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const SvgEdit = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const SvgCards = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="16" height="12" rx="2" />
    <path d="M6 18h12a2 2 0 0 0 2-2V8" />
  </svg>
);

const SvgList = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1" fill="currentColor" />
    <circle cx="4" cy="12" r="1" fill="currentColor" />
    <circle cx="4" cy="18" r="1" fill="currentColor" />
  </svg>
);

const SvgRefresh = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

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
            <div className="empty-icon-wrap"><SvgCheck size={36} /></div>
            <h3>Bạn đã hoàn thành tất cả từ vựng cần ôn hôm nay!</h3>
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
          <div className="summary-icon"><SvgTrophy size={56} /></div>
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
          <button className="btn-review-close" onClick={onClose} title="Đóng">
            <SvgClose size={18} />
          </button>
        </div>

        {/* Question Area */}
        <div className="review-body">
          {/* MODE 0: Multiple Choice Quiz (Chọn Nghĩa) */}
          {questionType === 0 && (
            <div className="quiz-container mcq-mode">
              <span className="quiz-badge"><SvgList size={14} /> Trắc nghiệm chọn nghĩa</span>
              {currentItem.image_url && (
                <img className="quiz-img" src={currentItem.image_url} alt={currentItem.word} />
              )}
              <div className="quiz-word-row">
                <h2 className="quiz-word">{currentItem.word}</h2>
                <button className="btn-audio" onClick={() => speakWord(currentItem.word)}>
                  <SvgVolume size={18} />
                </button>
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
              <span className="quiz-badge"><SvgHeadphones size={14} /> Nghe & Gõ lại từ tiếng Anh</span>
              <div className="audio-big-card" onClick={() => speakWord(currentItem.word)}>
                <div className="audio-big-icon"><SvgVolume size={36} /></div>
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
                  {isCorrect ? "Chính xác!" : `Đáp án đúng: ${currentItem.word}`}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: Context Fill-in-the-blank Quiz (Điền từ vào ngữ cảnh) */}
          {questionType === 2 && (
            <div className="quiz-container context-mode">
              <span className="quiz-badge"><SvgEdit size={14} /> Điền từ vào câu ví dụ</span>
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
                  {isCorrect ? "Tuyệt vời!" : `Đáp án đúng: ${currentItem.word}`}
                </div>
              )}
            </div>
          )}

          {/* MODE 3: Classic Flashcard Flip Quiz (Lật thẻ) */}
          {questionType === 3 && (
            <div className="quiz-container flashcard-mode">
              <span className="quiz-badge"><SvgCards size={14} /> Thẻ Ghi Nhớ (Flashcard)</span>
              <div className={`flashcard ${isFlipped ? "flipped" : ""}`} onClick={() => setIsFlipped(!isFlipped)}>
                {!isFlipped ? (
                  <div className="card-front">
                    {currentItem.image_url && <img className="fc-img" src={currentItem.image_url} alt="" />}
                    <h2 className="fc-word">{currentItem.word}</h2>
                    {currentItem.phonetic && <div className="fc-ipa">{currentItem.phonetic}</div>}
                    <button className="btn-audio-fc" onClick={(e) => { e.stopPropagation(); speakWord(currentItem.word); }}>
                      <SvgVolume size={14} /> Phổ biến âm
                    </button>
                    <div className="fc-flip-hint"><SvgRefresh size={14} /> Chạm để lật xem nghĩa</div>
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
                    <SvgClose size={16} /> Chưa thuộc
                  </button>
                  <button className="btn-fc-correct" onClick={() => handleFlashcardEval(true)}>
                    <SvgCheck size={16} /> Thuộc rồi
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
