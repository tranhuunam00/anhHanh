import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IELTS_TESTS, getDefaultIeltsTest } from "../data/ielts/index.js";
import { IeltsListeningModule } from "../components/IeltsTest/IeltsListeningModule.jsx";
import { IeltsReadingModule } from "../components/IeltsTest/IeltsReadingModule.jsx";
import { IeltsWritingModule } from "../components/IeltsTest/IeltsWritingModule.jsx";
import { IeltsSpeakingModule } from "../components/IeltsTest/IeltsSpeakingModule.jsx";
import { IeltsResultModal } from "../components/IeltsTest/IeltsResultModal.jsx";
import { IeltsFinalReportModal } from "../components/IeltsTest/IeltsFinalReportModal.jsx";
import { IeltsAuthGate } from "../components/IeltsTest/IeltsAuthGate.jsx";
import { IeltsStartConfirmModal } from "../components/IeltsTest/IeltsStartConfirmModal.jsx";
import { IeltsTopHeader } from "../components/IeltsTest/IeltsTopHeader.jsx";
import {
  gradeListeningTest,
  gradeReadingTest,
  saveIeltsSubmission,
  getIeltsSubmission,
  clearIeltsSubmission
} from "../utils/ieltsScoring.js";
import {
  IELTS_SKILL_ORDER,
  IELTS_SKILL_DURATIONS,
  formatCountdownTime,
  getExamSessionState,
  activateSkillTimer,
  getSkillRemainingSeconds,
  completeAndLockSkill,
  isSkillCompletedAndLocked,
  resetExamSessionState,
  canAccessSkill,
  getNextSkill,
  isExamFullyCompleted
} from "../utils/ieltsExamTimer.js";
import {
  BookOpen,
  Lock
} from "../constants/icons.js";
import "../styles/ieltsTest.css";

/**
 * IELTS Real Test Practice Page
 * Features sequential per-skill progression: Listening -> Reading -> Writing -> Speaking.
 * Per-skill submission, browser localStorage persistence, and auto-submission on timeout.
 * Prevents returning to completed skills during exam mode.
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

  // Result & Final modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ skill: "listening", rawScore: 0, bandScore: 1.0 });
  const [isFinalReportOpen, setIsFinalReportOpen] = useState(false);

  // Force re-mount key for child components on exam reset
  const [examResetKey, setExamResetKey] = useState(0);

  // Load saved answers & session on test change
  useEffect(() => {
    const sess = getExamSessionState(selectedTestId);
    setExamSession(sess);

    const savedL = getIeltsSubmission(selectedTestId, "listening");
    if (savedL?.answers) {
      setListeningAnswers(savedL.answers);
      setListeningEval(savedL.evalMap || null);
    } else {
      setListeningAnswers({});
      setListeningEval(null);
    }
    const savedR = getIeltsSubmission(selectedTestId, "reading");
    if (savedR?.answers) {
      setReadingAnswers(savedR.answers);
      setReadingEval(savedR.evalMap || null);
    } else {
      setReadingAnswers({});
      setReadingEval(null);
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
    const { correctCount, bandScore, evalMap } = gradeListeningTest(
      testData.skills.listening,
      listeningAnswers
    );

    setListeningEval(evalMap);
    saveIeltsSubmission(selectedTestId, "listening", {
      answers: listeningAnswers,
      evalMap,
      rawScore: correctCount,
      bandScore
    });

    const lockedSession = completeAndLockSkill(examSession, "listening", {
      rawScore: correctCount,
      bandScore
    });
    setExamSession(lockedSession);
    setModalData({ skill: "listening", rawScore: correctCount, bandScore });
    setIsModalOpen(true);
  }, [testData, listeningAnswers, selectedTestId, examSession]);

  // Grade Reading
  const gradeReading = useCallback(() => {
    if (!testData?.skills?.reading) return;
    const { correctCount, bandScore, evalMap } = gradeReadingTest(
      testData.skills.reading,
      readingAnswers
    );

    setReadingEval(evalMap);
    saveIeltsSubmission(selectedTestId, "reading", {
      answers: readingAnswers,
      evalMap,
      rawScore: correctCount,
      bandScore
    });

    const lockedSession = completeAndLockSkill(examSession, "reading", {
      rawScore: correctCount,
      bandScore
    });
    setExamSession(lockedSession);
    setModalData({ skill: "reading", rawScore: correctCount, bandScore });
    setIsModalOpen(true);
  }, [testData, readingAnswers, selectedTestId, examSession]);

  // Submit current skill and advance in order: Listening -> Reading -> Writing -> Speaking
  const handleSubmitSkill = useCallback(() => {
    if (activeSkill === "listening") {
      gradeListening();
    } else if (activeSkill === "reading") {
      gradeReading();
    } else if (activeSkill === "writing") {
      const lockedSession = completeAndLockSkill(examSession, "writing", {
        submitted: true,
        savedAt: new Date().toISOString()
      });
      setExamSession(lockedSession);
      const next = getNextSkill("writing");
      if (next) {
        setActiveSkill(next);
        const nextActivated = activateSkillTimer(lockedSession, next);
        setExamSession(nextActivated);
      }
    } else if (activeSkill === "speaking") {
      const lockedSession = completeAndLockSkill(examSession, "speaking", {
        submitted: true,
        savedAt: new Date().toISOString()
      });
      setExamSession(lockedSession);
      setIsFinalReportOpen(true);
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
    let sess = examSession;
    if (sess.skills?.[activeSkill]?.status === "completed") {
      clearIeltsSubmission(selectedTestId, activeSkill);
      if (activeSkill === "listening") {
        setListeningAnswers({});
        setListeningEval(null);
      } else if (activeSkill === "reading") {
        setReadingAnswers({});
        setReadingEval(null);
      }
      sess = {
        ...sess,
        skills: {
          ...sess.skills,
          [activeSkill]: {
            ...sess.skills[activeSkill],
            status: "not_started",
            remainingSeconds: IELTS_SKILL_DURATIONS[activeSkill],
            targetEndTime: null,
            completedAt: null,
            result: null
          }
        }
      };
    }
    const activated = activateSkillTimer(sess, activeSkill);
    setExamSession(activated);
    setIsReviewMode(false);
    setIsConfirmOpen(false);
    setExamResetKey((k) => k + 1);
  };

  const handleResetExam = () => {
    // Clear all saved submissions from localStorage
    clearIeltsSubmission(selectedTestId);
    // Clear writing essays from localStorage
    try {
      const prefix = `ielts_essay_${selectedTestId}_`;
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(prefix)) localStorage.removeItem(key);
      });
      // Clear speaking notes
      localStorage.removeItem("ielts_speaking_notes_cam21_t2");
    } catch { /* ignore */ }
    const fresh = resetExamSessionState(selectedTestId);
    const activated = activateSkillTimer(fresh, "listening");
    setExamSession(activated);
    setListeningAnswers({});
    setReadingAnswers({});
    setListeningEval(null);
    setReadingEval(null);
    setIsReviewMode(false);
    setIsModalOpen(false);
    setIsFinalReportOpen(false);
    setIsConfirmOpen(false);
    setActiveSkill("listening");
    setModalData({ skill: "listening", rawScore: 0, bandScore: 1.0 });
    setExamResetKey((k) => k + 1);
  };

  const handleRetakeSkill = (skillToRetake) => {
    const targetSkill = skillToRetake || activeSkill;
    clearIeltsSubmission(selectedTestId, targetSkill);
    if (targetSkill === "listening") {
      setListeningAnswers({});
      setListeningEval(null);
    } else if (targetSkill === "reading") {
      setReadingAnswers({});
      setReadingEval(null);
    } else if (targetSkill === "writing") {
      try {
        const prefix = `ielts_essay_${selectedTestId}_`;
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith(prefix)) localStorage.removeItem(key);
        });
      } catch { /* ignore */ }
    } else if (targetSkill === "speaking") {
      try {
        localStorage.removeItem("ielts_speaking_notes_cam21_t2");
      } catch { /* ignore */ }
    }

    const updatedSkills = {
      ...examSession.skills,
      [targetSkill]: {
        status: "not_started",
        duration: IELTS_SKILL_DURATIONS[targetSkill],
        remainingSeconds: IELTS_SKILL_DURATIONS[targetSkill],
        targetEndTime: null,
        completedAt: null,
        result: null
      }
    };
    const updatedSession = {
      ...examSession,
      isFullyCompleted: false,
      completedAt: null,
      skills: updatedSkills
    };
    const activated = activateSkillTimer(updatedSession, targetSkill);
    setExamSession(activated);
    setActiveSkill(targetSkill);
    setIsReviewMode(false);
    setIsModalOpen(false);
    setIsFinalReportOpen(false);
    setIsConfirmOpen(false);
    setExamResetKey((k) => k + 1);
  };

  const nextSkillForModal = useMemo(() => {
    return getNextSkill(modalData.skill);
  }, [modalData.skill]);

  const handleGoToNextSkill = () => {
    if (nextSkillForModal) {
      setActiveSkill(nextSkillForModal);
      const nextActivated = activateSkillTimer(examSession, nextSkillForModal);
      setExamSession(nextActivated);
      setIsReviewMode(false);
      setIsModalOpen(false);
    }
  };

  const handleReviewFromFinalReport = () => {
    setIsReviewMode(true);
    setIsFinalReportOpen(false);
    setActiveSkill("listening");
  };

  if (!user) {
    return <IeltsAuthGate onOpenAuth={onOpenAuth} />;
  }

  return (
    <div className="ielts-test-page-container">
      {/* Top Header */}
      <IeltsTopHeader
        selectedTestId={selectedTestId}
        onSelectTest={(id) => {
          setSelectedTestId(id);
          setIsReviewMode(false);
        }}
        onOpenInfo={() => setIsConfirmOpen(true)}
        activeSkill={activeSkill}
        onSelectSkill={(sk) => setActiveSkill(sk)}
        examSession={examSession}
        isReviewMode={isReviewMode}
        remainingSeconds={remainingSeconds}
        isCurrentSkillLocked={isCurrentSkillLocked}
        onSubmitSkill={handleSubmitSkill}
        onOpenModal={() => setIsModalOpen(true)}
        onOpenFinalReport={() => setIsFinalReportOpen(true)}
      />

      {/* Locked Skill Warning Banner */}
      {isCurrentSkillLocked && !isReviewMode && (
        <div className="ielts-locked-skill-banner">
          <span><Lock className="w-3.5 h-3.5 mr-1.5 inline text-amber-600" /> Kỹ năng <strong>{activeSkill.toUpperCase()}</strong> đã nộp bài. Theo quy chế thi thật, bạn không thể quay lại sửa đáp án.</span>
        </div>
      )}

      {/* Review Mode Banner */}
      {isReviewMode && (
        <div className="ielts-locked-skill-banner review-mode">
          <span><BookOpen className="w-3.5 h-3.5 mr-1.5 inline text-primary" /> Bạn đang ở chế độ <strong>Xem lại bài làm (Review Mode)</strong>. Bạn có thể tự do xem lại tất cả 4 kỹ năng.</span>
        </div>
      )}

      {/* Main Skill Module View */}
      <main className="ielts-test-content-area" key={`exam_body_${examResetKey}`}>
        {testData && (
          <>
            {activeSkill === "listening" && (
              <IeltsListeningModule
                key={`listening_${selectedTestId}_${examResetKey}`}
                listeningData={testData.skills.listening}
                answers={listeningAnswers}
                onAnswerChange={handleListeningAnswerChange}
                evaluation={listeningEval}
                isReview={isReviewMode || isCurrentSkillLocked}
              />
            )}
            {activeSkill === "reading" && (
              <IeltsReadingModule
                key={`reading_${selectedTestId}_${examResetKey}`}
                readingData={testData.skills.reading}
                answers={readingAnswers}
                onAnswerChange={handleReadingAnswerChange}
                evaluation={readingEval}
                isReview={isReviewMode || isCurrentSkillLocked}
              />
            )}
            {activeSkill === "writing" && (
              <IeltsWritingModule
                key={`writing_${selectedTestId}_${examResetKey}`}
                writingData={testData.skills.writing}
                user={user}
                token={token}
                isLocked={isCurrentSkillLocked}
                isReview={isReviewMode}
              />
            )}
            {activeSkill === "speaking" && (
              <IeltsSpeakingModule
                key={`speaking_${selectedTestId}_${examResetKey}`}
                speakingData={testData.skills.speaking}
                user={user}
                isLocked={isCurrentSkillLocked && !isReviewMode}
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

      {/* Skill Result Modal */}
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
        onRetakeTest={() => handleRetakeSkill(modalData.skill)}
        onGoToNextSkill={handleGoToNextSkill}
      />

      {/* Final Overall Exam Completion Report Modal */}
      <IeltsFinalReportModal
        isOpen={isFinalReportOpen}
        onClose={() => setIsFinalReportOpen(false)}
        testTitle={currentTestMeta.title}
        session={examSession}
        onReviewAnswers={handleReviewFromFinalReport}
        onResetExam={handleResetExam}
      />
    </div>
  );
};
