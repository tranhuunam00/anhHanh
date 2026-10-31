import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IELTS_TESTS, getDefaultIeltsTest } from "../data/ielts/index.js";
import { IeltsListeningModule } from "../components/IeltsTest/IeltsListeningModule.jsx";
import { IeltsReadingModule } from "../components/IeltsTest/IeltsReadingModule.jsx";
import { IeltsWritingModule } from "../components/IeltsTest/IeltsWritingModule.jsx";
import { IeltsSpeakingModule } from "../components/IeltsTest/IeltsSpeakingModule.jsx";
import { IeltsResultModal } from "../components/IeltsTest/IeltsResultModal.jsx";
import { IeltsAuthGate } from "../components/IeltsTest/IeltsAuthGate.jsx";
import {
  checkIeltsAnswer,
  getListeningBandScore,
  getReadingBandScore,
  saveIeltsSubmission,
  getIeltsSubmission
} from "../utils/ieltsScoring.js";
import {
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  CheckCircle,
  RotateCcw,
  Clock
} from "../constants/icons.js";
import "../styles/ieltsTest.css";

/**
 * IELTS Real Test Practice Page
 * Implements real Cambridge tests with 4 skills, 2-column resizable layout,
 * login requirement, and auto-scoring.
 */
export const IeltsTestPage = ({
  isActive = true,
  user = null,
  token = null,
  onOpenAuth
}) => {
  // Test selection (Defaults to Cambridge 21 Test 2)
  const [selectedTestId, setSelectedTestId] = useState(() => getDefaultIeltsTest().id);
  const currentTestMeta = useMemo(() => {
    return IELTS_TESTS.find((t) => t.id === selectedTestId) || getDefaultIeltsTest();
  }, [selectedTestId]);
  const testData = currentTestMeta.data;

  // Active skill: 'listening' | 'reading' | 'writing' | 'speaking'
  const [activeSkill, setActiveSkill] = useState("listening");

  // Answers state for Listening & Reading: { [questionNumber]: answerValue }
  const [listeningAnswers, setListeningAnswers] = useState({});
  const [readingAnswers, setReadingAnswers] = useState({});

  // Evaluation states
  const [listeningEval, setListeningEval] = useState(null);
  const [readingEval, setReadingEval] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Result modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ skill: "listening", rawScore: 0, bandScore: 1.0 });

  // Timer
  const [testTime, setTestTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Load saved answers on mount / test change
  useEffect(() => {
    const savedL = getIeltsSubmission(selectedTestId, "listening");
    if (savedL?.answers) setListeningAnswers(savedL.answers);
    const savedR = getIeltsSubmission(selectedTestId, "reading");
    if (savedR?.answers) setReadingAnswers(savedR.answers);
  }, [selectedTestId]);

  // Elapsed timer ticker
  useEffect(() => {
    if (!isActive || !isTimerActive) return;
    const interval = setInterval(() => {
      setTestTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, isTimerActive]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleListeningAnswerChange = (qNum, val) => {
    setListeningAnswers((prev) => {
      const next = { ...prev, [qNum]: val };
      saveIeltsSubmission(selectedTestId, "listening", { answers: next });
      return next;
    });
  };

  const handleReadingAnswerChange = (qNum, val) => {
    setReadingAnswers((prev) => {
      const next = { ...prev, [qNum]: val };
      saveIeltsSubmission(selectedTestId, "reading", { answers: next });
      return next;
    });
  };

  // Grade Listening
  const gradeListening = useCallback(() => {
    if (!testData?.skills?.listening) return;
    const lData = testData.skills.listening;
    const evalMap = {};
    let correctCount = 0;

    // Helper to evaluate item
    const checkItem = (qNum, acceptedAnswers) => {
      const userAns = listeningAnswers[qNum] || "";
      const isCorrect = checkIeltsAnswer(userAns, acceptedAnswers);
      if (isCorrect) correctCount++;
      evalMap[qNum] = { isCorrect, userAns, accepted: Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers] };
    };

    // Part 1: Table items 1-10
    lData.parts[0]?.items?.forEach((it) => {
      checkItem(it.number, it.answers);
    });

    // Part 2: Q11-14 (choose 2) & Q15-20 (map)
    lData.parts[1]?.groups?.forEach((g) => {
      if (g.groupType === "choose_two") {
        const [q1, q2] = g.numbers;
        const accepted = g.answers; // e.g. ["B", "E"]
        const u1 = listeningAnswers[q1];
        const u2 = listeningAnswers[q2];
        const correct1 = accepted.includes(u1);
        const correct2 = accepted.includes(u2) && u2 !== u1;
        if (correct1) correctCount++;
        if (correct2) correctCount++;
        evalMap[q1] = { isCorrect: correct1, userAns: u1, accepted };
        evalMap[q2] = { isCorrect: correct2, userAns: u2, accepted };
      } else if (g.groupType === "map_labeling") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      }
    });

    // Part 3: Q21-26 (choose 2) & Q27-30 (flowchart)
    lData.parts[2]?.groups?.forEach((g) => {
      if (g.groupType === "choose_two") {
        const [q1, q2] = g.numbers;
        const accepted = g.answers;
        const u1 = listeningAnswers[q1];
        const u2 = listeningAnswers[q2];
        const correct1 = accepted.includes(u1);
        const correct2 = accepted.includes(u2) && u2 !== u1;
        if (correct1) correctCount++;
        if (correct2) correctCount++;
        evalMap[q1] = { isCorrect: correct1, userAns: u1, accepted };
        evalMap[q2] = { isCorrect: correct2, userAns: u2, accepted };
      } else if (g.groupType === "flow_chart") {
        g.steps?.forEach((step) => checkItem(step.number, [step.answer]));
      }
    });

    // Part 4: Notes 31-40
    lData.parts[3]?.sections?.forEach((sec) => {
      sec.items?.forEach((it) => {
        if (it.number) checkItem(it.number, it.answers);
      });
    });

    setListeningEval(evalMap);
    const band = getListeningBandScore(correctCount);
    setModalData({ skill: "listening", rawScore: correctCount, bandScore: band });
    setIsModalOpen(true);
  }, [testData, listeningAnswers]);

  // Grade Reading
  const gradeReading = useCallback(() => {
    if (!testData?.skills?.reading) return;
    const rData = testData.skills.reading;
    const evalMap = {};
    let correctCount = 0;

    const checkItem = (qNum, acceptedAnswers) => {
      const userAns = readingAnswers[qNum] || "";
      const isCorrect = checkIeltsAnswer(userAns, acceptedAnswers);
      if (isCorrect) correctCount++;
      evalMap[qNum] = { isCorrect, userAns, accepted: Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers] };
    };

    // Passage 1
    const p1 = rData.passages[0];
    p1?.groups?.forEach((g) => {
      if (g.groupType === "table_completion") {
        checkItem(1, ["rats"]);
        checkItem(2, ["visual"]);
        checkItem(3, ["half"]);
        checkItem(4, ["temperature"]);
        checkItem(5, ["vivid"]);
      } else if (g.groupType === "true_false_not_given") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      }
    });

    // Passage 2
    const p2 = rData.passages[1];
    p2?.groups?.forEach((g) => {
      if (g.groupType === "matching_paragraphs") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      } else if (g.groupType === "choose_two") {
        const [q1, q2] = g.numbers;
        const accepted = g.answers; // ["B", "D"]
        const u1 = readingAnswers[q1];
        const u2 = readingAnswers[q2];
        const correct1 = accepted.includes(u1);
        const correct2 = accepted.includes(u2) && u2 !== u1;
        if (correct1) correctCount++;
        if (correct2) correctCount++;
        evalMap[q1] = { isCorrect: correct1, userAns: u1, accepted };
        evalMap[q2] = { isCorrect: correct2, userAns: u2, accepted };
      } else if (g.groupType === "summary_completion") {
        g.items?.forEach((it) => checkItem(it.number, it.answers));
      }
    });

    // Passage 3
    const p3 = rData.passages[2];
    p3?.groups?.forEach((g) => {
      if (g.items) {
        g.items.forEach((it) => checkItem(it.number, [it.answer]));
      }
    });

    setReadingEval(evalMap);
    const band = getReadingBandScore(correctCount);
    setModalData({ skill: "reading", rawScore: correctCount, bandScore: band });
    setIsModalOpen(true);
  }, [testData, readingAnswers]);

  const handleSubmitSkill = () => {
    if (activeSkill === "listening") {
      gradeListening();
    } else if (activeSkill === "reading") {
      gradeReading();
    } else {
      alert("Bài viết/nói đã được lưu trong trình duyệt. Bạn có thể gửi AI chấm điểm trong mục bên phải!");
    }
  };

  const handleRetake = () => {
    if (activeSkill === "listening") {
      setListeningAnswers({});
      setListeningEval(null);
      saveIeltsSubmission(selectedTestId, "listening", { answers: {} });
    } else if (activeSkill === "reading") {
      setReadingAnswers({});
      setReadingEval(null);
      saveIeltsSubmission(selectedTestId, "reading", { answers: {} });
    }
    setIsReviewMode(false);
    setIsModalOpen(false);
  };

  // If user is not logged in, enforce Auth Gate as per prompt rule
  if (!user) {
    return <IeltsAuthGate onOpenAuth={onOpenAuth} />;
  }

  return (
    <div className="ielts-test-page-container">
      {/* Top Main Navigation Bar */}
      <header className="ielts-top-header">
        <div className="ielts-header-left">
          {/* Test Selector Dropdown */}
          <div className="ielts-test-selector-wrap">
            <span className="ielts-test-label">Bộ đề:</span>
            <select
              value={selectedTestId}
              onChange={(e) => {
                setSelectedTestId(e.target.value);
                setIsReviewMode(false);
              }}
              className="ielts-test-select"
            >
              {IELTS_TESTS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Skill Selector Tabs */}
          <div className="ielts-skill-nav-group">
            <button
              type="button"
              className={`ielts-skill-tab-btn ${activeSkill === "listening" ? "active" : ""}`}
              onClick={() => setActiveSkill("listening")}
            >
              <Headphones className="w-4 h-4 mr-1.5 inline" /> Listening
            </button>
            <button
              type="button"
              className={`ielts-skill-tab-btn ${activeSkill === "reading" ? "active" : ""}`}
              onClick={() => setActiveSkill("reading")}
            >
              <BookOpen className="w-4 h-4 mr-1.5 inline" /> Reading
            </button>
            <button
              type="button"
              className={`ielts-skill-tab-btn ${activeSkill === "writing" ? "active" : ""}`}
              onClick={() => setActiveSkill("writing")}
            >
              <PenTool className="w-4 h-4 mr-1.5 inline" /> Writing
            </button>
            <button
              type="button"
              className={`ielts-skill-tab-btn ${activeSkill === "speaking" ? "active" : ""}`}
              onClick={() => setActiveSkill("speaking")}
            >
              <Mic className="w-4 h-4 mr-1.5 inline" /> Speaking
            </button>
          </div>
        </div>

        {/* Header Right: Timer & Submit Action */}
        <div className="ielts-header-right">
          <div className="ielts-header-timer" title="Thời gian làm bài">
            <Clock className="w-4 h-4 mr-1.5 inline text-primary" />
            <span>{formatTimer(testTime)}</span>
          </div>

          {(activeSkill === "listening" || activeSkill === "reading") && (
            <button
              type="button"
              className="ielts-submit-test-btn"
              onClick={handleSubmitSkill}
            >
              <CheckCircle className="w-4 h-4 mr-1.5 inline" /> Nộp bài & Chấm điểm
            </button>
          )}

          {isReviewMode && (
            <button
              type="button"
              className="ielts-retake-btn"
              onClick={handleRetake}
              title="Làm lại từ đầu"
            >
              <RotateCcw className="w-4 h-4 mr-1 inline" /> Làm lại
            </button>
          )}
        </div>
      </header>

      {/* Main Skill Module View */}
      <main className="ielts-test-content-area">
        {testData ? (
          <>
            {activeSkill === "listening" && (
              <IeltsListeningModule
                listeningData={testData.skills.listening}
                answers={listeningAnswers}
                onAnswerChange={handleListeningAnswerChange}
                evaluation={listeningEval}
                isReview={isReviewMode}
              />
            )}
            {activeSkill === "reading" && (
              <IeltsReadingModule
                readingData={testData.skills.reading}
                answers={readingAnswers}
                onAnswerChange={handleReadingAnswerChange}
                evaluation={readingEval}
                isReview={isReviewMode}
              />
            )}
            {activeSkill === "writing" && (
              <IeltsWritingModule
                writingData={testData.skills.writing}
                user={user}
                token={token}
              />
            )}
            {activeSkill === "speaking" && (
              <IeltsSpeakingModule
                speakingData={testData.skills.speaking}
                user={user}
              />
            )}
          </>
        ) : (
          <div className="ielts-empty-state">
            <h3>Đề thi đang được chuẩn bị</h3>
            <p>Vui lòng chọn <strong>Cambridge IELTS 21 - Test 2</strong> để luyện tập ngay.</p>
          </div>
        )}
      </main>

      {/* Result Modal */}
      <IeltsResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={modalData.skill}
        rawScore={modalData.rawScore}
        bandScore={modalData.bandScore}
        totalQuestions={40}
        onReviewAnswers={() => {
          setIsReviewMode(true);
          setIsModalOpen(false);
        }}
        onRetakeTest={handleRetake}
      />
    </div>
  );
};

