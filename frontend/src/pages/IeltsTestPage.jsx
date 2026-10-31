import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IELTS_TESTS, getDefaultIeltsTest } from "../data/ielts/index.js";
import { IeltsListeningModule } from "../components/IeltsTest/IeltsListeningModule.jsx";
import { IeltsReadingModule } from "../components/IeltsTest/IeltsReadingModule.jsx";
import { IeltsWritingModule } from "../components/IeltsTest/IeltsWritingModule.jsx";
import { IeltsSpeakingModule } from "../components/IeltsTest/IeltsSpeakingModule.jsx";
import { IeltsResultModal } from "../components/IeltsTest/IeltsResultModal.jsx";
import { IeltsAuthGate } from "../components/IeltsTest/IeltsAuthGate.jsx";
import { IeltsStartConfirmModal } from "../components/IeltsTest/IeltsStartConfirmModal.jsx";
import {
  checkIeltsAnswer,
  getListeningBandScore,
  getReadingBandScore,
  saveIeltsSubmission,
  getIeltsSubmission
} from "../utils/ieltsScoring.js";
import {
  IELTS_SKILL_ORDER,
  formatCountdownTime,
  getExamSessionState,
  activateSkillTimer,
  getSkillRemainingSeconds,
  completeAndLockSkill,
  isSkillCompletedAndLocked,
  resetExamSessionState
} from "../utils/ieltsExamTimer.js";
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
 * login requirement, strict countdown timer per skill, and auto-submission on timeout.
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

  // Exam session persistence (Countdown, status per skill)
  const [examSession, setExamSession] = useState(() => getExamSessionState(selectedTestId));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [, setTimerTick] = useState(0);

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

  // Load saved answers & session on test change
  useEffect(() => {
    const sess = getExamSessionState(selectedTestId);
    setExamSession(sess);

    const savedL = getIeltsSubmission(selectedTestId, "listening");
    if (savedL?.answers) {
      setListeningAnswers(savedL.answers);
      if (savedL.evalMap) setListeningEval(savedL.evalMap);
    }
    const savedR = getIeltsSubmission(selectedTestId, "reading");
    if (savedR?.answers) {
      setReadingAnswers(savedR.answers);
      if (savedR.evalMap) setReadingEval(savedR.evalMap);
    }

    if (!sess.isConfirmed) {
      setIsConfirmOpen(true);
    }
  }, [selectedTestId]);

  // Activate timer for current skill when session is confirmed
  useEffect(() => {
    if (examSession.isConfirmed && !isSkillCompletedAndLocked(examSession, activeSkill)) {
      if (examSession.skills[activeSkill]?.status !== "in_progress") {
        const next = activateSkillTimer(examSession, activeSkill);
        setExamSession(next);
      }
    }
  }, [activeSkill, examSession]);

  const remainingSeconds = getSkillRemainingSeconds(examSession, activeSkill);
  const isCurrentSkillLocked = isSkillCompletedAndLocked(examSession, activeSkill);

  const handleListeningAnswerChange = (qNum, val) => {
    if (isCurrentSkillLocked) return;
    setListeningAnswers((prev) => {
      const next = { ...prev, [qNum]: val };
      saveIeltsSubmission(selectedTestId, "listening", { answers: next });
      return next;
    });
  };

  const handleReadingAnswerChange = (qNum, val) => {
    if (isCurrentSkillLocked) return;
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

    const checkItem = (qNum, acceptedAnswers) => {
      const userAns = listeningAnswers[qNum] || "";
      const isCorrect = checkIeltsAnswer(userAns, acceptedAnswers);
      if (isCorrect) correctCount++;
      evalMap[qNum] = { isCorrect, userAns, accepted: Array.isArray(acceptedAnswers) ? acceptedAnswers : [acceptedAnswers] };
    };

    lData.parts[0]?.items?.forEach((it) => checkItem(it.number, it.answers));

    lData.parts[1]?.groups?.forEach((g) => {
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
      } else if (g.groupType === "map_labeling") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      }
    });

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
      } else if (g.groupType === "flowchart_completion") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      }
    });

    lData.parts[3]?.items?.forEach((it) => checkItem(it.number, it.answers));

    setListeningEval(evalMap);
    const band = getListeningBandScore(correctCount);

    saveIeltsSubmission(selectedTestId, "listening", {
      answers: listeningAnswers,
      evalMap,
      rawScore: correctCount,
      bandScore: band
    });

    const lockedSession = completeAndLockSkill(examSession, "listening", { rawScore: correctCount, bandScore: band });
    setExamSession(lockedSession);

    setModalData({ skill: "listening", rawScore: correctCount, bandScore: band });
    setIsModalOpen(true);
  }, [testData, listeningAnswers, selectedTestId, examSession]);

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

    const p1 = rData.passages[0];
    p1?.groups?.forEach((g) => {
      if (g.groupType === "table_completion") {
        [1, 2, 3, 4, 5].forEach((num) => {
          const it = g.tableItems?.find((x) => x.number === num);
          if (it) checkItem(num, it.answers);
        });
      } else if (g.groupType === "true_false_not_given") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      }
    });

    const p2 = rData.passages[1];
    p2?.groups?.forEach((g) => {
      if (g.groupType === "matching_paragraphs") {
        g.items?.forEach((it) => checkItem(it.number, [it.answer]));
      } else if (g.groupType === "choose_two") {
        const [q1, q2] = g.numbers;
        const accepted = g.answers;
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

    const p3 = rData.passages[2];
    p3?.groups?.forEach((g) => {
      g.items?.forEach((it) => checkItem(it.number, [it.answer]));
    });

    setReadingEval(evalMap);
    const band = getReadingBandScore(correctCount);

    saveIeltsSubmission(selectedTestId, "reading", {
      answers: readingAnswers,
      evalMap,
      rawScore: correctCount,
      bandScore: band
    });

    const lockedSession = completeAndLockSkill(examSession, "reading", { rawScore: correctCount, bandScore: band });
    setExamSession(lockedSession);

    setModalData({ skill: "reading", rawScore: correctCount, bandScore: band });
    setIsModalOpen(true);
  }, [testData, readingAnswers, selectedTestId, examSession]);

  const handleSubmitSkill = useCallback(() => {
    if (activeSkill === "listening") {
      gradeListening();
    } else if (activeSkill === "reading") {
      gradeReading();
    } else {
      const locked = completeAndLockSkill(examSession, activeSkill, { submitted: true });
      setExamSession(locked);
      alert(`Bài thi ${activeSkill.toUpperCase()} đã được nộp và lưu trên trình duyệt!`);
    }
  }, [activeSkill, gradeListening, gradeReading, examSession]);

  // Countdown timer ticker & auto-submit on timeout
  useEffect(() => {
    if (!isActive || !examSession.isConfirmed) return;
    const interval = setInterval(() => {
      const rem = getSkillRemainingSeconds(examSession, activeSkill);
      if (rem <= 0 && examSession.skills?.[activeSkill]?.status === "in_progress") {
        handleSubmitSkill();
      }
      setTimerTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, examSession, activeSkill, handleSubmitSkill]);

  const handleStartExamConfirm = () => {
    const activated = activateSkillTimer(examSession, activeSkill);
    setExamSession(activated);
    setIsConfirmOpen(false);
  };

  const handleResetExam = () => {
    const fresh = resetExamSessionState(selectedTestId);
    setExamSession(fresh);
    setListeningAnswers({});
    setReadingAnswers({});
    setListeningEval(null);
    setReadingEval(null);
    setIsReviewMode(false);
    setIsModalOpen(false);
    setIsConfirmOpen(false);
  };

  const nextSkillForModal = useMemo(() => {
    const idx = IELTS_SKILL_ORDER.indexOf(modalData.skill);
    return idx >= 0 && idx < IELTS_SKILL_ORDER.length - 1 ? IELTS_SKILL_ORDER[idx + 1] : null;
  }, [modalData.skill]);

  const handleGoToNextSkill = () => {
    if (nextSkillForModal) {
      setActiveSkill(nextSkillForModal);
      setIsReviewMode(false);
      setIsModalOpen(false);
    }
  };

  if (!user) {
    return <IeltsAuthGate onOpenAuth={onOpenAuth} />;
  }

  return (
    <div className="ielts-test-page-container">
      {/* Top Header */}
      <header className="ielts-top-header">
        <div className="ielts-header-left">
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
            <button
              type="button"
              className="ielts-exam-info-btn"
              onClick={() => setIsConfirmOpen(true)}
              title="Xem thông tin đề thi & thời gian"
            >
              ℹ️
            </button>
          </div>

          {/* Skill Selector Tabs with Locked/Completed Badges */}
          <div className="ielts-skill-nav-group">
            {IELTS_SKILL_ORDER.map((sk) => {
              const isLocked = isSkillCompletedAndLocked(examSession, sk);
              const isActiveTab = activeSkill === sk;
              return (
                <button
                  key={sk}
                  type="button"
                  className={`ielts-skill-tab-btn ${isActiveTab ? "active" : ""} ${isLocked ? "completed-tab" : ""}`}
                  onClick={() => setActiveSkill(sk)}
                >
                  {sk === "listening" && <Headphones className="w-4 h-4 mr-1 inline" />}
                  {sk === "reading" && <BookOpen className="w-4 h-4 mr-1 inline" />}
                  {sk === "writing" && <PenTool className="w-4 h-4 mr-1 inline" />}
                  {sk === "speaking" && <Mic className="w-4 h-4 mr-1 inline" />}
                  <span className="capitalize">{sk}</span>
                  {isLocked && <span className="ielts-tab-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Header Right: Real-time Countdown Timer & Submit Action */}
        <div className="ielts-header-right">
          <div
            className={`ielts-header-timer ${remainingSeconds <= 300 ? "warning" : ""} ${remainingSeconds <= 60 ? "danger" : ""}`}
            title="Thời gian làm bài còn lại"
          >
            <Clock className="w-4 h-4 mr-1.5 inline text-primary" />
            <span>{formatCountdownTime(remainingSeconds)}</span>
          </div>

          {(activeSkill === "listening" || activeSkill === "reading") && (
            <button
              type="button"
              className={`ielts-submit-test-btn ${isCurrentSkillLocked ? "locked" : ""}`}
              onClick={handleSubmitSkill}
              disabled={isCurrentSkillLocked}
            >
              <CheckCircle className="w-4 h-4 mr-1.5 inline" />
              {isCurrentSkillLocked ? "Đã nộp bài" : "Nộp bài & Chấm điểm"}
            </button>
          )}

          {isCurrentSkillLocked && (
            <button
              type="button"
              className="ielts-retake-btn"
              onClick={() => setIsModalOpen(true)}
              title="Xem lại điểm số"
            >
              Xem điểm
            </button>
          )}
        </div>
      </header>

      {/* Locked Skill Warning Banner */}
      {isCurrentSkillLocked && (
        <div className="ielts-locked-skill-banner">
          <span>🔒 Kỹ năng <strong>{activeSkill.toUpperCase()}</strong> đã nộp bài & hết thời gian. Bạn đang ở chế độ xem lại đáp án và không thể sửa bài.</span>
        </div>
      )}

      {/* Main Skill Module View */}
      <main className="ielts-test-content-area">
        {testData && (
          <>
            {activeSkill === "listening" && (
              <IeltsListeningModule
                listeningData={testData.skills.listening}
                answers={listeningAnswers}
                onAnswerChange={handleListeningAnswerChange}
                evaluation={listeningEval}
                isReview={isReviewMode || isCurrentSkillLocked}
              />
            )}
            {activeSkill === "reading" && (
              <IeltsReadingModule
                readingData={testData.skills.reading}
                answers={readingAnswers}
                onAnswerChange={handleReadingAnswerChange}
                evaluation={readingEval}
                isReview={isReviewMode || isCurrentSkillLocked}
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
        )}
      </main>

      {/* Start Exam Confirmation Modal */}
      <IeltsStartConfirmModal
        isOpen={isConfirmOpen}
        testTitle={currentTestMeta.title}
        session={examSession}
        onStartExam={handleStartExamConfirm}
        onResumeExam={() => setIsConfirmOpen(false)}
        onResetExam={handleResetExam}
        onClose={() => setIsConfirmOpen(false)}
      />

      {/* Result Modal with Next Skill Trigger */}
      <IeltsResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skill={modalData.skill}
        rawScore={modalData.rawScore}
        bandScore={modalData.bandScore}
        totalQuestions={40}
        nextSkill={nextSkillForModal}
        onReviewAnswers={() => {
          setIsReviewMode(true);
          setIsModalOpen(false);
        }}
        onRetakeTest={handleResetExam}
        onGoToNextSkill={handleGoToNextSkill}
      />
    </div>
  );
};
