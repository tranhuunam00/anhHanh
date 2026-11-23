import React, { useState } from "react";
import { BookOpen, Lock, Copy, Check } from "../../constants/icons.js";
import { generateIeltsCopyText, copyTextToClipboard } from "../../utils/ieltsCopyUtils.js";

/**
 * Banner displayed at the top of the IELTS Test area when a skill is locked or in Review Mode.
 * In Review Mode, provides a prominent 1-click button to copy the entire test and answer key.
 */
export const IeltsReviewBanner = ({
  isReviewMode = false,
  isCurrentSkillLocked = false,
  activeSkill = "reading",
  currentTestMeta = null,
  testData = null,
  readingAnswers = {},
  readingEval = null,
  listeningAnswers = {},
  listeningEval = null,
  showToast = null
}) => {
  const [isCopied, setIsCopied] = useState(false);

  // If neither review mode nor locked, render nothing
  if (!isReviewMode && !isCurrentSkillLocked) {
    return null;
  }

  // Locked Skill Warning Banner during exam
  if (isCurrentSkillLocked && !isReviewMode) {
    return (
      <div className="ielts-locked-skill-banner">
        <span>
          <Lock className="w-3.5 h-3.5 mr-1.5 inline text-amber-600" /> Kỹ năng <strong>{activeSkill.toUpperCase()}</strong> đã nộp bài. Theo quy chế thi thật, bạn không thể quay lại sửa đáp án.
        </span>
      </div>
    );
  }

  // Handle copying full test content & answer key
  const handleCopyFullTest = async () => {
    const userAns = activeSkill === "reading" ? readingAnswers : activeSkill === "listening" ? listeningAnswers : {};
    const evalMap = activeSkill === "reading" ? readingEval : activeSkill === "listening" ? listeningEval : null;

    const text = generateIeltsCopyText({
      testMeta: currentTestMeta,
      testData,
      activeSkill,
      userAnswers: userAns,
      evaluation: evalMap
    });

    const success = await copyTextToClipboard(text);
    if (success) {
      setIsCopied(true);
      if (showToast) {
        showToast(`Đã sao chép toàn bộ đề & đáp án ${activeSkill.toUpperCase()} vào bộ nhớ tạm!`, "success");
      }
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Review Mode Banner with Copy Button
  return (
    <div
      className="ielts-locked-skill-banner review-mode"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        padding: "8px 16px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
        <span>
          Bạn đang ở chế độ <strong>Xem lại bài làm (Review Mode)</strong>. Bạn có thể tự do xem lại tất cả 4 kỹ năng.
        </span>
      </div>

      <button
        type="button"
        className="ielts-copy-full-test-btn"
        onClick={handleCopyFullTest}
        title={`Sao chép toàn bộ đề bài và đáp án ${activeSkill.toUpperCase()} để dán sang nơi khác`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          borderRadius: "6px",
          background: isCopied ? "var(--success, #10b981)" : "var(--primary, #2563eb)",
          color: "#ffffff",
          border: "none",
          fontSize: "0.84rem",
          fontWeight: 700,
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        {isCopied ? <Check size={15} /> : <Copy size={15} />}
        <span>
          {isCopied
            ? "Đã sao chép đề & đáp án!"
            : `Sao chép toàn bộ đề & đáp án (${activeSkill.toUpperCase()})`}
        </span>
      </button>
    </div>
  );
};
