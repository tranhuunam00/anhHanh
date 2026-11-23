/**
 * IELTS Test Copy Utility
 * Compiles full test questions, passage reading text, question prompts, and official answers
 * for copying to clipboard to paste elsewhere.
 */

/**
 * Format Reading skill into clean plaintext for clipboard
 */
export function formatReadingTestForCopy(readingData, testTitle = "IELTS Reading Test", userAnswers = {}, evaluation = {}) {
  if (!readingData) return "";

  const lines = [];
  lines.push("================================================================================");
  lines.push(`BỘ ĐỀ: ${testTitle.toUpperCase()}`);
  lines.push("KỸ NĂNG: IELTS READING (ĐỌC HIỂU - 3 BÀI ĐỌC - 40 CÂU HỎI)");
  lines.push("================================================================================\n");

  const passages = readingData.passages || [
    readingData.passage1,
    readingData.passage2,
    readingData.passage3
  ].filter(Boolean);

  const answerKeySummary = [];

  passages.forEach((p, pIdx) => {
    const passNum = p.passageNumber || pIdx + 1;
    lines.push("--------------------------------------------------------------------------------");
    lines.push(`READING PASSAGE ${passNum}: ${p.title || `Passage ${passNum}`}`);
    if (p.subtitle) lines.push(p.subtitle);
    lines.push("--------------------------------------------------------------------------------\n");

    // Reading passage text
    if (Array.isArray(p.paragraphs)) {
      p.paragraphs.forEach((para) => {
        lines.push(`${para.id || ""}:`);
        lines.push(`${para.text || ""}\n`);
      });
    } else if (p.content || p.text) {
      lines.push(`${p.content || p.text}\n`);
    }

    // Questions in this passage
    lines.push(`[DANH SÁCH CÂU HỎI PASSAGE ${passNum}]`);
    if (Array.isArray(p.groups)) {
      p.groups.forEach((g, gIdx) => {
        lines.push(`\n--- Nhóm câu hỏi ${g.numbers ? `(${g.numbers.join(", ")})` : gIdx + 1} ---`);
        if (g.instructions) lines.push(g.instructions.trim());

        if (Array.isArray(g.items)) {
          g.items.forEach((item) => {
            const qNum = item.number;
            const qText = item.statement || item.question || item.text || `${item.prefix || ""} [ ${qNum} ] ${item.suffix || ""}`.trim();
            const officialAns = item.answer || (item.answers && item.answers.join(" / ")) || evaluation?.[qNum]?.accepted?.join(" / ") || "N/A";
            const userAns = userAnswers?.[qNum];

            lines.push(`\nCâu ${qNum}: ${qText}`);
            if (Array.isArray(item.options) && item.options.length > 0) {
              item.options.forEach((opt) => lines.push(`   ${opt}`));
            }

            let ansLine = `   => Đáp án chuẩn: ${officialAns}`;
            if (userAns !== undefined && userAns !== null && String(userAns).trim() !== "") {
              const isCorrect = evaluation?.[qNum]?.isCorrect;
              ansLine += ` | Bài làm: "${userAns}" (${isCorrect ? "Đúng" : "Chưa đúng"})`;
            }
            lines.push(ansLine);

            answerKeySummary.push({ qNum, answer: officialAns });
          });
        }
      });
    }
    lines.push("\n");
  });

  // Summary Answer Key at bottom
  if (answerKeySummary.length > 0) {
    lines.push("================================================================================");
    lines.push("BẢNG TỔNG KẾT ĐÁP ÁN READING (ANSWER KEY):");
    lines.push("================================================================================");
    answerKeySummary.sort((a, b) => a.qNum - b.qNum);
    for (let i = 0; i < answerKeySummary.length; i += 5) {
      const slice = answerKeySummary.slice(i, i + 5);
      lines.push(slice.map((item) => `${item.qNum}. ${item.answer}`).join("   |   "));
    }
  }

  return lines.join("\n");
}

/**
 * Format Listening skill into clean plaintext for clipboard
 */
export function formatListeningTestForCopy(listeningData, testTitle = "IELTS Listening Test", userAnswers = {}, evaluation = {}) {
  if (!listeningData) return "";

  const lines = [];
  lines.push("================================================================================");
  lines.push(`BỘ ĐỀ: ${testTitle.toUpperCase()}`);
  lines.push("KỸ NĂNG: IELTS LISTENING (NGHE HIỂU - 4 PARTS - 40 CÂU HỎI)");
  lines.push("================================================================================\n");

  const parts = listeningData.parts || [
    listeningData.part1,
    listeningData.part2,
    listeningData.part3,
    listeningData.part4
  ].filter(Boolean);

  const answerKeySummary = [];

  parts.forEach((part, idx) => {
    const partNum = part.partNumber || idx + 1;
    lines.push("--------------------------------------------------------------------------------");
    lines.push(`LISTENING PART ${partNum}: ${part.title || `Part ${partNum}`}`);
    if (part.instructions) lines.push(part.instructions.trim());
    lines.push("--------------------------------------------------------------------------------\n");

    const items = part.items || [];
    if (part.noteBlock) {
      lines.push(`[Nội dung bài tập / Điền từ: ${part.noteBlock.title || ""}]`);
      if (Array.isArray(part.noteBlock.sections)) {
        part.noteBlock.sections.forEach((sec) => {
          if (sec.heading) lines.push(`\n* ${sec.heading}:`);
          if (Array.isArray(sec.lines)) {
            sec.lines.forEach((ln) => {
              if (ln.isSubheading) {
                lines.push(`  - ${ln.text}`);
              } else if (ln.text) {
                lines.push(`  • ${ln.text}`);
              } else if (ln.number) {
                lines.push(`  • ${ln.prefix || ""}[ ${ln.number} ]${ln.suffix || ""}`);
              }
            });
          }
        });
      }
    }

    if (items.length > 0) {
      lines.push(`\n[DANH SÁCH CÂU HỎI & ĐÁP ÁN PART ${partNum}]`);
      items.forEach((item) => {
        const qNum = item.number;
        const qText = item.question || item.statement || `${item.prefix || ""} [ ${qNum} ] ${item.suffix || ""}`.trim();
        const officialAns = item.answer || (item.answers && item.answers.join(" / ")) || evaluation?.[qNum]?.accepted?.join(" / ") || "N/A";
        const userAns = userAnswers?.[qNum];

        lines.push(`\nCâu ${qNum}: ${qText}`);
        if (Array.isArray(item.options) && item.options.length > 0) {
          item.options.forEach((opt) => lines.push(`   ${opt}`));
        }

        let ansLine = `   => Đáp án chuẩn: ${officialAns}`;
        if (userAns !== undefined && userAns !== null && String(userAns).trim() !== "") {
          const isCorrect = evaluation?.[qNum]?.isCorrect;
          ansLine += ` | Bài làm: "${userAns}" (${isCorrect ? "Đúng" : "Chưa đúng"})`;
        }
        lines.push(ansLine);

        answerKeySummary.push({ qNum, answer: officialAns });
      });
    }
    lines.push("\n");
  });

  if (answerKeySummary.length > 0) {
    lines.push("================================================================================");
    lines.push("BẢNG TỔNG KẾT ĐÁP ÁN LISTENING (ANSWER KEY):");
    lines.push("================================================================================");
    answerKeySummary.sort((a, b) => a.qNum - b.qNum);
    for (let i = 0; i < answerKeySummary.length; i += 5) {
      const slice = answerKeySummary.slice(i, i + 5);
      lines.push(slice.map((item) => `${item.qNum}. ${item.answer}`).join("   |   "));
    }
  }

  return lines.join("\n");
}

/**
 * Format Writing or Speaking skills into clean plaintext
 */
export function formatWritingTestForCopy(writingData, testTitle = "IELTS Writing Test") {
  if (!writingData) return "";
  const lines = [
    "================================================================================",
    `BỘ ĐỀ: ${testTitle.toUpperCase()}`,
    "KỸ NĂNG: IELTS WRITING (TASK 1 & TASK 2)",
    "================================================================================\n"
  ];
  const tasks = writingData.tasks || [];
  tasks.forEach((t) => {
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(`TASK ${t.taskNumber}: ${t.taskNumber === 1 ? "Report / Diagram (Tối thiểu 150 từ - 20 phút)" : "Essay Writing (Tối thiểu 250 từ - 40 phút)"}`);
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(`Đề bài (Prompt):\n${t.prompt || ""}\n`);
    if (Array.isArray(t.instructions)) {
      lines.push("Hướng dẫn làm bài:");
      t.instructions.forEach((ins) => lines.push(`- ${ins}`));
    }
    lines.push("\n");
  });
  return lines.join("\n");
}

export function formatSpeakingTestForCopy(speakingData, testTitle = "IELTS Speaking Test") {
  if (!speakingData) return "";
  const lines = [
    "================================================================================",
    `BỘ ĐỀ: ${testTitle.toUpperCase()}`,
    "KỸ NĂNG: IELTS SPEAKING (PART 1, PART 2, PART 3)",
    "================================================================================\n"
  ];
  const parts = speakingData.parts || [];
  parts.forEach((p) => {
    lines.push(`--------------------------------------------------------------------------------`);
    lines.push(`PART ${p.partNumber}: ${p.title || `Part ${p.partNumber}`}`);
    lines.push(`--------------------------------------------------------------------------------`);
    if (p.topic) lines.push(`Chủ đề (Topic): ${p.topic}`);
    if (p.cueCard) {
      lines.push(`\nCue Card:\n${p.cueCard.topic || ""}`);
      if (Array.isArray(p.cueCard.bullets)) {
        p.cueCard.bullets.forEach((b) => lines.push(`• ${b}`));
      }
    }
    if (Array.isArray(p.questions)) {
      lines.push("\nCác câu hỏi phỏng vấn:");
      p.questions.forEach((q, qIdx) => lines.push(`${qIdx + 1}. ${q.text || q}`));
    }
    lines.push("\n");
  });
  return lines.join("\n");
}

/**
 * Universal dispatcher to generate clipboard text for any skill or the whole test
 */
export function generateIeltsCopyText({ testMeta, testData, activeSkill = "reading", userAnswers = {}, evaluation = {} }) {
  const title = testMeta?.title || testData?.title || "Cambridge IELTS Practice Test";

  if (activeSkill === "reading") {
    return formatReadingTestForCopy(testData?.skills?.reading, title, userAnswers, evaluation);
  }
  if (activeSkill === "listening") {
    return formatListeningTestForCopy(testData?.skills?.listening, title, userAnswers, evaluation);
  }
  if (activeSkill === "writing") {
    return formatWritingTestForCopy(testData?.skills?.writing, title);
  }
  if (activeSkill === "speaking") {
    return formatSpeakingTestForCopy(testData?.skills?.speaking, title);
  }

  // Fallback to reading
  return formatReadingTestForCopy(testData?.skills?.reading, title, userAnswers, evaluation);
}

/**
 * Copy text to clipboard with browser fallback
 * @param {string} text Plaintext to copy
 * @returns {Promise<boolean>} True if successfully copied
 */
export async function copyTextToClipboard(text) {
  if (!text || typeof text !== "string") return false;

  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback below
    }
  }

  // Fallback using invisible textarea
  if (typeof document !== "undefined" && document.createElement) {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      textarea.style.top = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return Boolean(success);
    } catch {
      return false;
    }
  }

  return false;
}
