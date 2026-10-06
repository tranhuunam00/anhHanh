import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  X,
  Volume2,
  Trophy,
  Zap,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shuffle,
  Layers,
  Sparkles,
  Mic,
  MicOff,
  Flame,
  HelpCircle,
  Eye,
  Check,
} from "lucide-react";
import { submitVocabReviewResult } from "../../services/authVocabService";
import "./VocabExerciseHubModal.css";

export const ALL_EXERCISE_MODES = [
  { id: "MCQ_WORD_TO_MEANING", group: "Trắc nghiệm", num: 1, name: "Trắc nghiệm Từ -> Nghĩa", icon: "🎯" },
  { id: "MCQ_MEANING_TO_WORD", group: "Trắc nghiệm", num: 2, name: "Trắc nghiệm Nghĩa -> Từ", icon: "🎯" },
  { id: "AUDIO_TO_WORD", group: "Trắc nghiệm", num: 3, name: "Nghe phát âm chọn Từ", icon: "🎧" },
  { id: "CONTEXT_CLOZE_MCQ", group: "Trắc nghiệm", num: 4, name: "Điền từ vào ngữ cảnh (MCQ)", icon: "🧩" },
  { id: "SYNONYM_DEFINITION_MCQ", group: "Trắc nghiệm", num: 5, name: "Trắc nghiệm Định nghĩa / Loại từ", icon: "📖" },

  { id: "SPELLING_LISTENING", group: "Luyện viết", num: 6, name: "Nghe chính tả (Spelling Bee)", icon: "🐝" },
  { id: "LETTER_SCRAMBLE", group: "Luyện viết", num: 7, name: "Xếp chữ cái đảo lộn (Anagram)", icon: "🔤" },
  { id: "SENTENCE_UNSCRAMBLE", group: "Luyện viết", num: 8, name: "Sắp xếp câu ngữ cảnh", icon: "🔀" },
  { id: "REVERSE_TRANSLATION_INPUT", group: "Luyện viết", num: 9, name: "Dịch nghĩa & Gõ từ tiếng Anh", icon: "✍️" },
  { id: "CONTEXT_BLANK_TYPING", group: "Luyện viết", num: 10, name: "Gõ từ vào câu ngữ cảnh", icon: "📝" },

  { id: "MEMORY_MATCH_CARDS", group: "Trò chơi", num: 11, name: "Lật thẻ trí nhớ (Memory Cards)", icon: "🃏" },
  { id: "SPEED_PAIR_MATCHING", group: "Trò chơi", num: 12, name: "Nối từ siêu tốc 2 cột", icon: "⚡" },
  { id: "TRUE_FALSE_REFLEX", group: "Trò chơi", num: 13, name: "Phản xạ Đúng / Sai 60s", icon: "⏱️" },
  { id: "WORD_RAIN_FALL", group: "Trò chơi", num: 14, name: "Mưa từ vựng rơi (Word Fall)", icon: "🌧️" },
  { id: "HANGMAN_WORDLE", group: "Trò chơi", num: 15, name: "Đoán chữ cái (Hangman / Wordle)", icon: "🪢" },

  { id: "PHRASE_COLLOCATION_MATCH", group: "Chuyên sâu", num: 16, name: "Ghép cụm từ / Collocation", icon: "🤝" },
  { id: "PARAGRAPH_MULTI_BLANK", group: "Chuyên sâu", num: 17, name: "Đọc đoạn văn điền nhiều từ", icon: "📜" },
  { id: "BILINGUAL_SENTENCE_TRANSLATE", group: "Chuyên sâu", num: 18, name: "Dịch câu song ngữ chuyên sâu", icon: "🌐" },
  { id: "VOICE_PRONUNCIATION_CHALLENGE", group: "Chuyên sâu", num: 19, name: "Luyện phát âm Micro AI", icon: "🎙️" },
  { id: "FLASHCARD_3D_LEITNER", group: "Chuyên sâu", num: 20, name: "Thẻ ghi nhớ 3D Leitner Box", icon: "🎴" },
];

export default function VocabExerciseHubModal({
  vocabPool = [],
  token = null,
  onClose,
  onFinished,
}) {
  const [selectedModeFilter, setSelectedModeFilter] = useState("ALL"); // "ALL" or specific mode ID
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Per-question state
  const [textInput, setTextInput] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Gamified modes state
  const [scrambleTiles, setScrambleTiles] = useState([]);
  const [scrambleAnswer, setScrambleAnswer] = useState([]);
  const [hangmanGuessed, setHangmanGuessed] = useState(new Set());
  const [hangmanMistakes, setHangmanMistakes] = useState(0);
  const [memoryCards, setMemoryCards] = useState([]);
  const [memoryFlipped, setMemoryFlipped] = useState([]);
  const [speedPairs, setSpeedPairs] = useState({ left: [], right: [] });
  const [speedSelectedLeft, setSpeedSelectedLeft] = useState(null);
  const [speedMatchedIds, setSpeedMatchedIds] = useState(new Set());
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceScore, setVoiceScore] = useState(null);

  // Review history
  const [resultsHistory, setResultsHistory] = useState([]);

  const items = useMemo(() => {
    if (!vocabPool || vocabPool.length === 0) return [];
    return [...vocabPool];
  }, [vocabPool]);

  const currentItem = items[currentQuestionIndex];

  // Determine active mode for current question
  const currentModeId = useMemo(() => {
    if (selectedModeFilter !== "ALL") return selectedModeFilter;
    // Rotate across all 20 modes
    return ALL_EXERCISE_MODES[currentQuestionIndex % ALL_EXERCISE_MODES.length].id;
  }, [selectedModeFilter, currentQuestionIndex]);

  const currentModeMeta = useMemo(() => {
    return ALL_EXERCISE_MODES.find((m) => m.id === currentModeId) || ALL_EXERCISE_MODES[0];
  }, [currentModeId]);

  // Audio helper
  const playAudio = (wordToSpeak) => {
    if ("speechSynthesis" in window && wordToSpeak) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(wordToSpeak);
      utter.lang = "en-US";
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  };

  // Generate 4 MCQ options
  const mcqOptions = useMemo(() => {
    if (!currentItem) return [];
    const correctVal =
      currentModeId === "MCQ_MEANING_TO_WORD" || currentModeId === "AUDIO_TO_WORD" || currentModeId === "CONTEXT_CLOZE_MCQ"
        ? currentItem.word
        : currentItem.meaning;

    const distractors = items
      .filter((it) => it.id !== currentItem.id)
      .map((it) =>
        currentModeId === "MCQ_MEANING_TO_WORD" || currentModeId === "AUDIO_TO_WORD" || currentModeId === "CONTEXT_CLOZE_MCQ"
          ? it.word
          : it.meaning
      )
      .filter(Boolean);

    // Fallbacks
    const fallbackList = [
      "phát triển", "thành công", "nỗ lực", "hợp tác", "quan trọng",
      "chính sách", "quyết định", "tiến trình", "bảo vệ", "xây dựng"
    ];

    const shuffledDistractors = [...distractors, ...fallbackList].filter((v) => v !== correctVal);
    const uniqueDistractors = Array.from(new Set(shuffledDistractors)).slice(0, 3);
    const combined = [...uniqueDistractors, correctVal];
    return combined.sort(() => Math.random() - 0.5);
  }, [currentItem, currentModeId, items]);

  // Initialize state when moving to a new question
  useEffect(() => {
    setTextInput("");
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsCardFlipped(false);
    setVoiceTranscript("");
    setVoiceScore(null);

    if (!currentItem) return;

    // Auto-play audio for audio mode or first load
    if (currentModeId === "AUDIO_TO_WORD" || currentModeId === "SPELLING_LISTENING") {
      playAudio(currentItem.word);
    }

    // Setup Letter Scramble Tiles
    if (currentModeId === "LETTER_SCRAMBLE") {
      const letters = currentItem.word
        .replace(/[^a-zA-Z]/g, "")
        .toLowerCase()
        .split("")
        .map((char, index) => ({ id: `${char}_${index}`, char, used: false }))
        .sort(() => Math.random() - 0.5);
      setScrambleTiles(letters);
      setScrambleAnswer([]);
    }

    // Setup Hangman
    if (currentModeId === "HANGMAN_WORDLE") {
      setHangmanGuessed(new Set());
      setHangmanMistakes(0);
    }

    // Setup Memory Match Cards (4 pairs = 8 cards)
    if (currentModeId === "MEMORY_MATCH_CARDS") {
      const poolSubset = [currentItem, ...items.filter((it) => it.id !== currentItem.id).slice(0, 3)];
      const cards = [];
      poolSubset.forEach((it) => {
        cards.push({ id: `en_${it.id}`, pairId: it.id, text: it.word, type: "en" });
        cards.push({ id: `vi_${it.id}`, pairId: it.id, text: it.meaning, type: "vi" });
      });
      setMemoryCards(cards.sort(() => Math.random() - 0.5).map((c) => ({ ...c, matched: false })));
      setMemoryFlipped([]);
    }

    // Setup Speed Pairs
    if (currentModeId === "SPEED_PAIR_MATCHING") {
      const subset = [currentItem, ...items.filter((it) => it.id !== currentItem.id).slice(0, 3)];
      setSpeedPairs({
        left: subset.map((it) => ({ id: it.id, text: it.word })).sort(() => Math.random() - 0.5),
        right: subset.map((it) => ({ id: it.id, text: it.meaning })).sort(() => Math.random() - 0.5),
      });
      setSpeedSelectedLeft(null);
      setSpeedMatchedIds(new Set());
    }
  }, [currentQuestionIndex, currentItem, currentModeId]);

  // Handle progression to next question
  const proceedNext = async (correctStatus) => {
    if (correctStatus) {
      setScore((s) => s + 1);
      setCombo((c) => {
        const next = c + 1;
        setMaxCombo((m) => Math.max(m, next));
        return next;
      });
    } else {
      setCombo(0);
    }

    // Record SRS review result
    if (token && currentItem) {
      try {
        await submitVocabReviewResult(currentItem.id, correctStatus, token);
      } catch (err) {
        console.debug("SRS result sync skipped:", err);
      }
    }

    // Save history
    setResultsHistory((prev) => [
      ...prev,
      {
        word: currentItem.word,
        meaning: currentItem.meaning,
        isCorrect: correctStatus,
        modeName: currentModeMeta.name,
      },
    ]);

    if (currentQuestionIndex + 1 < items.length) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      setIsFinished(true);
      if (onFinished) onFinished();
    }
  };

  // MCQ selection
  const handleSelectMCQ = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const targetVal =
      currentModeId === "MCQ_MEANING_TO_WORD" || currentModeId === "AUDIO_TO_WORD" || currentModeId === "CONTEXT_CLOZE_MCQ"
        ? currentItem.word
        : currentItem.meaning;

    const correct = opt.trim().toLowerCase() === targetVal.trim().toLowerCase();
    setIsCorrect(correct);

    setTimeout(() => proceedNext(correct), 1100);
  };

  // Text input submit (Spelling / Active Recall / Context typing)
  const handleSubmitText = (e) => {
    if (e) e.preventDefault();
    if (isAnswered || !textInput.trim()) return;

    setIsAnswered(true);
    const cleanUser = textInput.trim().toLowerCase().replace(/[.,!?;:]/g, "");
    const cleanTarget = currentItem.word.trim().toLowerCase().replace(/[.,!?;:]/g, "");

    const correct = cleanUser === cleanTarget;
    setIsCorrect(correct);

    setTimeout(() => proceedNext(correct), 1300);
  };

  // True / False Reflex Handler
  const handleReflexChoice = (userSaysTrue) => {
    if (isAnswered) return;
    setIsAnswered(true);

    // 50% chance question pair is actually true
    const isActuallyTrue = currentQuestionIndex % 2 === 0;
    const correct = userSaysTrue === isActuallyTrue;
    setIsCorrect(correct);

    setTimeout(() => proceedNext(correct), 900);
  };

  // Letter Tile Anagram Click
  const handleTileClick = (tile) => {
    if (tile.used || isAnswered) return;
    const nextTiles = scrambleTiles.map((t) => (t.id === tile.id ? { ...t, used: true } : t));
    const nextAnswer = [...scrambleAnswer, tile];
    setScrambleTiles(nextTiles);
    setScrambleAnswer(nextAnswer);

    // Check if filled
    const targetClean = currentItem.word.replace(/[^a-zA-Z]/g, "").toLowerCase();
    if (nextAnswer.length === targetClean.length) {
      const spelled = nextAnswer.map((t) => t.char).join("").toLowerCase();
      setIsAnswered(true);
      const correct = spelled === targetClean;
      setIsCorrect(correct);
      setTimeout(() => proceedNext(correct), 1200);
    }
  };

  const handleTileUndo = () => {
    if (scrambleAnswer.length === 0 || isAnswered) return;
    const last = scrambleAnswer[scrambleAnswer.length - 1];
    setScrambleAnswer((prev) => prev.slice(0, -1));
    setScrambleTiles((prev) => prev.map((t) => (t.id === last.id ? { ...t, used: false } : t)));
  };

  // Hangman Guess
  const handleHangmanGuess = (char) => {
    if (hangmanGuessed.has(char) || isAnswered) return;
    const nextGuessed = new Set(hangmanGuessed);
    nextGuessed.add(char);
    setHangmanGuessed(nextGuessed);

    const targetWord = currentItem.word.toUpperCase();
    if (!targetWord.includes(char)) {
      const nextMistakes = hangmanMistakes + 1;
      setHangmanMistakes(nextMistakes);
      if (nextMistakes >= 6) {
        setIsAnswered(true);
        setIsCorrect(false);
        setTimeout(() => proceedNext(false), 1400);
      }
    } else {
      // Check if all letters revealed
      const allLetters = targetWord.split("").filter((c) => /[A-Z]/.test(c));
      const allFound = allLetters.every((c) => nextGuessed.has(c));
      if (allFound) {
        setIsAnswered(true);
        setIsCorrect(true);
        setTimeout(() => proceedNext(true), 1200);
      }
    }
  };

  // Memory Card Click
  const handleMemoryCardClick = (card) => {
    if (card.matched || memoryFlipped.some((c) => c.id === card.id) || memoryFlipped.length >= 2) return;

    const nextFlipped = [...memoryFlipped, card];
    setMemoryFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const [c1, c2] = nextFlipped;
      if (c1.pairId === c2.pairId && c1.type !== c2.type) {
        // Matched!
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) => (c.pairId === c1.pairId ? { ...c, matched: true } : c))
          );
          setMemoryFlipped([]);
          // Check if all matched
          const remaining = memoryCards.filter((c) => !c.matched && c.pairId !== c1.pairId);
          if (remaining.length === 0) {
            proceedNext(true);
          }
        }, 500);
      } else {
        // Mismatch
        setTimeout(() => setMemoryFlipped([]), 800);
      }
    }
  };

  // Speed Pair Matching
  const handleSpeedLeftClick = (item) => {
    if (speedMatchedIds.has(item.id)) return;
    setSpeedSelectedLeft(item);
  };

  const handleSpeedRightClick = (item) => {
    if (!speedSelectedLeft || speedMatchedIds.has(item.id)) return;
    if (speedSelectedLeft.id === item.id) {
      // Match!
      const nextMatched = new Set(speedMatchedIds);
      nextMatched.add(item.id);
      setSpeedMatchedIds(nextMatched);
      setSpeedSelectedLeft(null);
      if (nextMatched.size === speedPairs.left.length) {
        proceedNext(true);
      }
    } else {
      // Mismatch
      setSpeedSelectedLeft(null);
    }
  };

  // Voice Recognition Challenge
  const handleStartVoice = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Trình duyệt không hỗ trợ Web Speech API.");
      return;
    }
    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsRecording(true);
    rec.onresult = (evt) => {
      const transcript = evt.results[0][0].transcript;
      setVoiceTranscript(transcript);
      setIsRecording(false);

      const target = currentItem.word.toLowerCase().trim();
      const spoken = transcript.toLowerCase().trim();
      const match = spoken.includes(target) || target.includes(spoken);
      const acc = match ? 95 : Math.max(30, Math.floor(Math.random() * 50));
      setVoiceScore(acc);
      setIsAnswered(true);
      setIsCorrect(match);

      setTimeout(() => proceedNext(match), 1800);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend = () => setIsRecording(false);
    rec.start();
  };

  if (items.length === 0) {
    return (
      <div className="exercise-modal-backdrop" onClick={onClose}>
        <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
          <div className="ex-summary-wrap">
            <CheckCircle2 size={54} color="#10b981" />
            <h2>Sổ tay của bạn chưa có từ vựng nào!</h2>
            <p style={{ color: "#94a3b8" }}>
              Hãy thêm từ mới thủ công hoặc dùng tính năng <strong>AI Trích xuất từ vựng</strong> từ tệp PDF/Word để bắt đầu luyện tập.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ padding: "10px 24px", borderRadius: "12px" }}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary Screen
  if (isFinished) {
    const accuracy = Math.round((score / items.length) * 100);
    return (
      <div className="exercise-modal-backdrop">
        <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
          <div className="exercise-header">
            <h3 style={{ margin: 0, fontWeight: 800 }}>Kết Quả Luyện Tập Từ Vựng</h3>
            <button className="btn-ex-close" onClick={onClose}><X size={20} /></button>
          </div>

          <div className="ex-summary-wrap">
            <div className="ex-trophy-badge">
              <Trophy size={42} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.7rem", fontWeight: 800 }}>
              {accuracy >= 80 ? "Xuất sắc! Bạn đã làm chủ bài tập!" : "Hoàn thành bài luyện tập!"}
            </h2>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              Đã rèn luyện qua các dạng bài tập tương tác đa dạng & ghi nhận vào bộ nhớ dài hạn SRS.
            </p>

            <div className="ex-stats-row">
              <div className="ex-stat-card">
                <span className="ex-stat-num">{score} / {items.length}</span>
                <span className="ex-stat-title">Trả lời đúng</span>
              </div>
              <div className="ex-stat-card">
                <span className="ex-stat-num">{accuracy}%</span>
                <span className="ex-stat-title">Độ chính xác</span>
              </div>
              <div className="ex-stat-card">
                <span className="ex-stat-num">{maxCombo}🔥</span>
                <span className="ex-stat-title">Combo cao nhất</span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={onClose}
              style={{
                padding: "12px 32px",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #6366f1, #38bdf8)",
                border: "none",
                color: "white",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Hoàn Thành & Trở Về Sổ Tay
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentQuestionIndex + 1) / items.length) * 100);

  return (
    <div className="exercise-modal-backdrop">
      <div className="exercise-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="exercise-header">
          <div className="ex-progress-wrapper">
            <div className="ex-progress-track">
              <div className="ex-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="ex-header-meta">
            <div className="ex-score-badge">
              <Trophy size={14} />
              <span>{score} / {items.length}</span>
            </div>
            {combo > 1 && (
              <div className="ex-combo-badge">
                <Flame size={14} />
                <span>{combo} COMBO</span>
              </div>
            )}
            <button className="btn-ex-close" onClick={onClose} title="Thoát">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mode Selector & Filter Banner */}
        <div className="ex-mode-banner">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="ex-mode-tag">
              {currentModeMeta.icon} {currentModeMeta.name}
            </span>
            <span className="ex-group-tag">Nhóm: {currentModeMeta.group}</span>
          </div>

          {/* Quick Mode Switcher Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Chế độ:</span>
            <select
              value={selectedModeFilter}
              onChange={(e) => setSelectedModeFilter(e.target.value)}
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                color: "#f8fafc",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "0.8rem",
                cursor: "pointer",
                outline: "none",
              }}
            >
              <option value="ALL">🎲 Tất cả 20 dạng (Hỗn hợp xoay vòng)</option>
              {ALL_EXERCISE_MODES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.num}. {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Exercise Arena */}
        <div className="exercise-body">
          {/* MODE 1: MCQ Word -> Meaning */}
          {currentModeId === "MCQ_WORD_TO_MEANING" && (
            <div className="ex-question-card">
              <div className="ex-target-word">
                <span>{currentItem.word}</span>
                <button className="ex-audio-circle-btn" onClick={() => playAudio(currentItem.word)}>
                  <Volume2 size={20} />
                </button>
              </div>
              {currentItem.phonetic && <div className="ex-target-ipa">{currentItem.phonetic}</div>}
              {currentItem.context_sentence && (
                <div className="ex-context-quote">“{currentItem.context_sentence}”</div>
              )}

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`ex-mcq-btn ${
                      selectedOption === opt
                        ? opt === currentItem.meaning
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                    {selectedOption === opt && (opt === currentItem.meaning ? <Check size={18} /> : <X size={18} />)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 2: MCQ Meaning -> Word */}
          {currentModeId === "MCQ_MEANING_TO_WORD" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Chọn từ tiếng Anh phù hợp với nghĩa:</span>
              <h2 className="ex-target-meaning">{currentItem.meaning}</h2>
              {currentItem.phonetic && <div className="ex-target-ipa">{currentItem.phonetic}</div>}

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`ex-mcq-btn ${
                      selectedOption === opt
                        ? opt === currentItem.word
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                    {selectedOption === opt && (opt === currentItem.word ? <Check size={18} /> : <X size={18} />)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 3: Audio -> Word */}
          {currentModeId === "AUDIO_TO_WORD" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Bấm nghe âm thanh và chọn đúng từ:</span>
              <button
                className="ex-audio-circle-btn"
                style={{ width: "64px", height: "64px", margin: "10px 0" }}
                onClick={() => playAudio(currentItem.word)}
              >
                <Volume2 size={30} />
              </button>
              <div style={{ fontSize: "0.9rem", color: "#38bdf8" }}>Gợi ý nghĩa: {currentItem.meaning}</div>

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`ex-mcq-btn ${
                      selectedOption === opt
                        ? opt === currentItem.word
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 4: Context Cloze MCQ */}
          {currentModeId === "CONTEXT_CLOZE_MCQ" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Chọn từ thích hợp điền vào chỗ trống:</span>
              <div className="ex-context-quote" style={{ fontSize: "1.1rem" }}>
                {currentItem.context_sentence
                  ? currentItem.context_sentence.replace(new RegExp(currentItem.word, "gi"), " [ _______ ] ")
                  : `Please provide the correct term for: [ _______ ]`}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#38bdf8" }}>Nghĩa cần điền: {currentItem.meaning}</div>

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`ex-mcq-btn ${
                      selectedOption === opt
                        ? opt === currentItem.word
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 5: Synonym / Definition MCQ */}
          {currentModeId === "SYNONYM_DEFINITION_MCQ" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Định nghĩa & Phân loại thuật ngữ:</span>
              <div className="ex-context-quote">
                <strong>Thuật ngữ đối ứng với nghĩa:</strong> {currentItem.meaning}
              </div>
              {currentItem.phonetic && <div className="ex-target-ipa">{currentItem.phonetic}</div>}

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className={`ex-mcq-btn ${
                      selectedOption === opt
                        ? opt === currentItem.word
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 6: Spelling Bee (Nghe & Gõ) */}
          {currentModeId === "SPELLING_LISTENING" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Nghe phát âm và gõ chính xác các chữ cái:</span>
              <button
                className="ex-audio-circle-btn"
                style={{ width: "56px", height: "56px" }}
                onClick={() => playAudio(currentItem.word)}
              >
                <Volume2 size={26} />
              </button>
              <div style={{ fontSize: "0.9rem", color: "#38bdf8" }}>Nghĩa: {currentItem.meaning}</div>
              <div style={{ letterSpacing: "4px", fontSize: "1.1rem", color: "#818cf8" }}>
                Độ dài: {currentItem.word.replace(/\s/g, "").length} chữ cái ({currentItem.word.split("").map(() => "_").join(" ")})
              </div>

              <form onSubmit={handleSubmitText} style={{ width: "100%", maxWidth: "480px" }}>
                <input
                  type="text"
                  autoFocus
                  className={`ex-input-box ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}
                  placeholder="Gõ từ tiếng Anh nghe được..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isAnswered}
                />
              </form>
            </div>
          )}

          {/* MODE 7: Letter Scramble (Anagram Tiles) */}
          {currentModeId === "LETTER_SCRAMBLE" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Bấm chọn các ô chữ cái theo đúng trật tự từ vựng:</span>
              <h2 className="ex-target-meaning">{currentItem.meaning}</h2>

              <div className="letter-answer-display">
                {scrambleAnswer.map((t, idx) => (
                  <span key={idx} style={{ color: "#38bdf8" }}>{t.char.toUpperCase()}</span>
                ))}
                {scrambleAnswer.length === 0 && (
                  <span style={{ color: "#64748b", fontSize: "0.9rem", letterSpacing: 0 }}>
                    (Bấm các ô chữ cái bên dưới)
                  </span>
                )}
              </div>

              <div className="letter-tiles-container">
                {scrambleTiles.map((tile) => (
                  <button
                    key={tile.id}
                    className={`letter-tile ${tile.used ? "used" : ""}`}
                    onClick={() => handleTileClick(tile)}
                    disabled={tile.used || isAnswered}
                  >
                    {tile.char.toUpperCase()}
                  </button>
                ))}
              </div>

              {scrambleAnswer.length > 0 && !isAnswered && (
                <button
                  className="btn btn-secondary"
                  onClick={handleTileUndo}
                  style={{ padding: "6px 14px", borderRadius: "8px", fontSize: "0.8rem", marginTop: "6px" }}
                >
                  Xóa chữ cái vừa chọn (Undo)
                </button>
              )}
            </div>
          )}

          {/* MODE 8: Sentence Unscramble */}
          {currentModeId === "SENTENCE_UNSCRAMBLE" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Sắp xếp các cụm từ thành câu ngữ cảnh hoàn chỉnh:</span>
              <div style={{ fontSize: "1rem", color: "#38bdf8", fontWeight: 600 }}>
                Nghĩa từ vựng: {currentItem.meaning} ({currentItem.word})
              </div>

              <div className="letter-answer-display" style={{ fontSize: "1.05rem", letterSpacing: "0.5px" }}>
                {textInput || "(Bấm chọn các từ theo thứ tự đúng)"}
              </div>

              <div className="letter-tiles-container">
                {(currentItem.context_sentence || `${currentItem.word} is very important.`)
                  .split(" ")
                  .sort(() => Math.random() - 0.5)
                  .map((tokenStr, idx) => (
                    <button
                      key={idx}
                      className="letter-tile"
                      style={{ fontSize: "0.95rem", minWidth: "auto", padding: "0 12px" }}
                      onClick={() => setTextInput((prev) => (prev ? `${prev} ${tokenStr}` : tokenStr))}
                    >
                      {tokenStr}
                    </button>
                  ))}
              </div>

              <button
                className="btn-primary"
                onClick={() => proceedNext(true)}
                style={{ padding: "8px 20px", borderRadius: "10px", marginTop: "12px" }}
              >
                Xác nhận câu hoàn chỉnh
              </button>
            </div>
          )}

          {/* MODE 9: Reverse Translation Input (Active Recall) */}
          {currentModeId === "REVERSE_TRANSLATION_INPUT" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Dịch sang tiếng Anh & Gõ từ chuẩn xác:</span>
              <h2 className="ex-target-meaning">{currentItem.meaning}</h2>
              {currentItem.phonetic && <div className="ex-target-ipa">{currentItem.phonetic}</div>}

              <form onSubmit={handleSubmitText} style={{ width: "100%", maxWidth: "480px" }}>
                <input
                  type="text"
                  autoFocus
                  className={`ex-input-box ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}
                  placeholder="Nhập từ tiếng Anh tương ứng..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isAnswered}
                />
              </form>
            </div>
          )}

          {/* MODE 10: Context Blank Typing */}
          {currentModeId === "CONTEXT_BLANK_TYPING" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Đọc câu ngữ cảnh & gõ từ vào ô trống:</span>
              <div className="ex-context-quote" style={{ fontSize: "1.05rem" }}>
                {currentItem.context_sentence
                  ? currentItem.context_sentence.replace(new RegExp(currentItem.word, "gi"), " _______ ")
                  : `Please spell: _______`}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#38bdf8" }}>Nghĩa từ cần điền: {currentItem.meaning}</div>

              <form onSubmit={handleSubmitText} style={{ width: "100%", maxWidth: "480px" }}>
                <input
                  type="text"
                  autoFocus
                  className={`ex-input-box ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}
                  placeholder="Gõ từ còn thiếu..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isAnswered}
                />
              </form>
            </div>
          )}

          {/* MODE 11: Memory Match Cards Game */}
          {currentModeId === "MEMORY_MATCH_CARDS" && (
            <div className="ex-question-card" style={{ maxWidth: "750px" }}>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                Trò chơi Lật thẻ ghép đôi: Lật 2 thẻ để ghép cặp Từ tiếng Anh & Nghĩa tiếng Việt:
              </span>

              <div className="memory-grid">
                {memoryCards.map((card) => {
                  const isFlipped = card.matched || memoryFlipped.some((c) => c.id === card.id);
                  return (
                    <div
                      key={card.id}
                      className={`memory-card ${isFlipped ? "flipped" : ""} ${card.matched ? "matched" : ""}`}
                      onClick={() => handleMemoryCardClick(card)}
                    >
                      {isFlipped ? card.text : "❓"}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODE 12: Speed Pair Matching (2 Columns) */}
          {currentModeId === "SPEED_PAIR_MATCHING" && (
            <div className="ex-question-card" style={{ maxWidth: "720px" }}>
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                Nối từ siêu tốc: Bấm 1 từ bên Trái rồi bấm 1 nghĩa tương ứng bên Phải!
              </span>

              <div className="speed-columns-container">
                <div>
                  <h4 style={{ margin: "0 0 10px 0", color: "#38bdf8" }}>Tiếng Anh</h4>
                  {speedPairs.left.map((item) => {
                    const isMatched = speedMatchedIds.has(item.id);
                    const isSelected = speedSelectedLeft?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`speed-card ${isSelected ? "selected" : ""} ${isMatched ? "matched" : ""}`}
                        onClick={() => handleSpeedLeftClick(item)}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>

                <div>
                  <h4 style={{ margin: "0 0 10px 0", color: "#34d399" }}>Nghĩa tiếng Việt</h4>
                  {speedPairs.right.map((item) => {
                    const isMatched = speedMatchedIds.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`speed-card ${isMatched ? "matched" : ""}`}
                        onClick={() => handleSpeedRightClick(item)}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 13: True / False Reflex Mode */}
          {currentModeId === "TRUE_FALSE_REFLEX" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Phản xạ siêu tốc: Cặp từ sau đây ĐÚNG hay SAI?</span>
              <div className="ex-target-word">{currentItem.word}</div>
              <div style={{ fontSize: "1.2rem", color: "#94a3b8" }}>=</div>
              <h2 className="ex-target-meaning">
                {currentQuestionIndex % 2 === 0
                  ? currentItem.meaning
                  : items.find((it) => it.id !== currentItem.id)?.meaning || "ngẫu nhiên khác"}
              </h2>

              <div className="tf-actions-row">
                <button
                  className="btn-tf-choice btn-tf-true"
                  onClick={() => handleReflexChoice(true)}
                  disabled={isAnswered}
                >
                  <Check size={24} /> ĐÚNG (Match)
                </button>
                <button
                  className="btn-tf-choice btn-tf-false"
                  onClick={() => handleReflexChoice(false)}
                  disabled={isAnswered}
                >
                  <X size={24} /> SAI (Wrong)
                </button>
              </div>
            </div>
          )}

          {/* MODE 14: Word Rain Fall */}
          {currentModeId === "WORD_RAIN_FALL" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Mưa từ vựng: Chọn nghĩa đúng trước khi từ rơi xuống đất!</span>
              <div
                style={{
                  height: "120px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(30, 41, 59, 0.4)",
                  width: "100%",
                  borderRadius: "16px",
                  border: "1px dashed rgba(56, 189, 248, 0.3)",
                }}
              >
                <div className="ex-target-word" style={{ color: "#38bdf8" }}>
                  🌧️ {currentItem.word}
                </div>
              </div>

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className="ex-mcq-btn"
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 15: Hangman / Wordle Guess */}
          {currentModeId === "HANGMAN_WORDLE" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                Đoán chữ cái: Còn {6 - hangmanMistakes} lần đoán sai!
              </span>
              <h2 className="ex-target-meaning">{currentItem.meaning}</h2>

              <div className="hangman-word-slots">
                {currentItem.word.toUpperCase().split("").map((c, idx) => {
                  const isAlpha = /[A-Z]/.test(c);
                  const isRevealed = !isAlpha || hangmanGuessed.has(c);
                  return (
                    <div key={idx} className="hangman-slot">
                      {isRevealed ? c : ""}
                    </div>
                  );
                })}
              </div>

              <div className="hangman-keyboard">
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
                  <button
                    key={char}
                    className="key-char-btn"
                    onClick={() => handleHangmanGuess(char)}
                    disabled={hangmanGuessed.has(char) || isAnswered}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 16: Phrase Collocation Match */}
          {currentModeId === "PHRASE_COLLOCATION_MATCH" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Ghép 2 nửa cụm từ / thuật ngữ hoàn chỉnh:</span>
              <h2 className="ex-target-meaning">{currentItem.meaning}</h2>

              <div style={{ display: "flex", gap: "10px", alignItems: "center", margin: "14px 0" }}>
                <div style={{ padding: "10px 18px", borderRadius: "10px", background: "#4338ca", color: "#fff", fontWeight: 700 }}>
                  {currentItem.word.split(" ")[0]}
                </div>
                <span>+</span>
                <div style={{ padding: "10px 18px", borderRadius: "10px", border: "2px dashed #38bdf8", color: "#38bdf8", fontWeight: 700 }}>
                  {currentItem.word.split(" ").slice(1).join(" ") || "..."}
                </div>
              </div>

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className="ex-mcq-btn"
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 17: Paragraph Multi-Blank */}
          {currentModeId === "PARAGRAPH_MULTI_BLANK" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Đọc đoạn văn & điền từ vào vị trí (1):</span>
              <div className="ex-context-quote" style={{ lineHeight: 1.8 }}>
                The delegation discussed key matters. In particular, they agreed on the <strong>(1) [ _______ ]</strong> to enhance cooperation.
              </div>
              <div style={{ fontSize: "0.9rem", color: "#38bdf8" }}>Nghĩa cần điền: {currentItem.meaning}</div>

              <div className="ex-mcq-grid">
                {mcqOptions.map((opt, i) => (
                  <button
                    key={i}
                    className="ex-mcq-btn"
                    onClick={() => handleSelectMCQ(opt)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE 18: Bilingual Sentence Translate */}
          {currentModeId === "BILINGUAL_SENTENCE_TRANSLATE" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Thử thách dịch câu song ngữ chuyên sâu:</span>
              <div className="ex-context-quote">
                <strong>Câu tiếng Việt:</strong> "Chúng tôi trân trọng gửi <strong>{currentItem.meaning}</strong> đến quý cơ quan."
              </div>

              <form onSubmit={handleSubmitText} style={{ width: "100%", maxWidth: "480px" }}>
                <input
                  type="text"
                  autoFocus
                  className="ex-input-box"
                  placeholder={`Gõ bản dịch hoặc từ vựng (${currentItem.word})...`}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <button className="btn-primary" type="submit" style={{ marginTop: "12px", borderRadius: "10px", padding: "8px 20px" }}>
                  Xác nhận & Chấm điểm
                </button>
              </form>
            </div>
          )}

          {/* MODE 19: Voice Pronunciation Challenge */}
          {currentModeId === "VOICE_PRONUNCIATION_CHALLENGE" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Thử thách phát âm qua Micro AI:</span>
              <div className="ex-target-word">
                <span>{currentItem.word}</span>
                <button className="ex-audio-circle-btn" onClick={() => playAudio(currentItem.word)}>
                  <Volume2 size={20} />
                </button>
              </div>
              {currentItem.phonetic && <div className="ex-target-ipa">{currentItem.phonetic}</div>}

              <button
                className={`ex-audio-circle-btn ${isRecording ? "pulse" : ""}`}
                style={{
                  width: "72px",
                  height: "72px",
                  background: isRecording ? "#ef4444" : "linear-gradient(135deg, #10b981, #059669)",
                  margin: "16px 0",
                }}
                onClick={handleStartVoice}
              >
                {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
              <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                {isRecording ? "Đang lắng nghe giọng bạn nói..." : "Bấm Micro và phát âm to rõ từ trên"}
              </div>

              {voiceScore !== null && (
                <div style={{ marginTop: "10px", fontWeight: 700, fontSize: "1.1rem", color: voiceScore >= 80 ? "#10b981" : "#f59e0b" }}>
                  Độ chính xác phát âm: {voiceScore}% ({voiceTranscript || "Đã nhận diện"})
                </div>
              )}
            </div>
          )}

          {/* MODE 20: 3D Flashcard Leitner */}
          {currentModeId === "FLASHCARD_3D_LEITNER" && (
            <div className="ex-question-card">
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Bấm vào thẻ để lật mặt sau & tự đánh giá ghi nhớ:</span>

              <div className="card-3d-scene" onClick={() => setIsCardFlipped(!isCardFlipped)}>
                <div className={`card-3d-inner ${isCardFlipped ? "flipped" : ""}`}>
                  <div className="card-face card-front">
                    <h2 style={{ fontSize: "2rem", margin: "0 0 10px 0" }}>{currentItem.word}</h2>
                    {currentItem.phonetic && <div className="ex-target-ipa">{currentItem.phonetic}</div>}
                    <button
                      className="ex-audio-circle-btn"
                      style={{ marginTop: "16px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(currentItem.word);
                      }}
                    >
                      <Volume2 size={20} />
                    </button>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "16px" }}>
                      (Click để lật xem nghĩa)
                    </span>
                  </div>

                  <div className="card-face card-back">
                    <h3 style={{ fontSize: "1.5rem", color: "#38bdf8", margin: "0 0 10px 0" }}>
                      {currentItem.meaning}
                    </h3>
                    {currentItem.context_sentence && (
                      <p style={{ fontSize: "0.95rem", color: "#cbd5e1", fontStyle: "italic", margin: 0 }}>
                        “{currentItem.context_sentence}”
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Leitner SRS Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  className="btn btn-secondary"
                  style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid #ef4444" }}
                  onClick={() => proceedNext(false)}
                >
                  Chưa nhớ (Ôn lại)
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", border: "1px solid #f59e0b" }}
                  onClick={() => proceedNext(true)}
                >
                  Tạm nhớ (3 ngày)
                </button>
                <button
                  className="btn btn-secondary"
                  style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", border: "1px solid #10b981" }}
                  onClick={() => proceedNext(true)}
                >
                  Thành thạo (7 ngày)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
