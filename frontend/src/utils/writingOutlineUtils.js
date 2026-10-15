/**
 * Writing Outline Utilities
 * Xử lý truy xuất, chuẩn hóa, định dạng và chèn dàn bài bài viết (100% Tiếng Việt)
 */

import { TASK2_OUTLINES } from "../constants/writingOutlines";
import {
  TASK1_OUTLINES,
  OTHER_GENRES_OUTLINES,
  LANGUAGE_WRITING_GUIDELINES,
} from "../constants/writingOtherOutlines";

/**
 * Lấy cấu trúc dàn bài chuẩn dựa trên Thể loại, Dạng đề và Ngôn ngữ
 * @param {Object} params
 * @param {string} params.genre - Thể loại (ielts_task2, ielts_task1, email, paragraph, free)
 * @param {string} params.subType - Dạng đề chi tiết (opinion, discussion, line_graph, etc.)
 * @param {string} params.language - Mã ngôn ngữ (en, ja, zh, ko, fr, de)
 * @returns {Object} Dàn bài hoàn chỉnh kèm hướng dẫn phương pháp
 */
export function getStandardOutline({
  genre = "ielts_task2",
  subType = "opinion",
  language = "en",
} = {}) {
  let outlineData = null;

  if (genre === "ielts_task2") {
    const validKey =
      subType && TASK2_OUTLINES[subType] ? subType : "opinion";
    outlineData = TASK2_OUTLINES[validKey] || TASK2_OUTLINES.opinion;
  } else if (genre === "ielts_task1") {
    if (subType === "process") {
      outlineData = TASK1_OUTLINES.process;
    } else if (subType === "map") {
      outlineData = TASK1_OUTLINES.map;
    } else if (subType === "pie_chart") {
      outlineData = TASK1_OUTLINES.static;
    } else {
      // line_graph, bar_chart, table, all -> dynamic
      outlineData = TASK1_OUTLINES.dynamic;
    }
  } else if (OTHER_GENRES_OUTLINES[genre]) {
    outlineData = OTHER_GENRES_OUTLINES[genre];
  } else {
    // Mặc định fallback về IELTS Task 2 Opinion
    outlineData = TASK2_OUTLINES.opinion;
  }

  const langGuide =
    LANGUAGE_WRITING_GUIDELINES[language] || LANGUAGE_WRITING_GUIDELINES.en;

  return {
    ...outlineData,
    genre,
    subType,
    language,
    languageGuide: langGuide,
  };
}

/**
 * Định dạng dàn bài thành chuỗi văn bản hoàn chỉnh để sao chép vào Clipboard
 * @param {Object} outline
 * @param {string} topicText
 * @returns {string}
 */
export function formatOutlineAsText(outline, topicText = "") {
  if (!outline || !Array.isArray(outline.sections)) {
    return "";
  }

  const lines = [];
  lines.push(`=== DÀN BÀI BÀI VIẾT: ${outline.title || "CHUẨN CHI TIẾT"} ===`);
  if (topicText && topicText.trim()) {
    lines.push(`Đề bài: "${topicText.trim()}"`);
  }
  if (outline.description) {
    lines.push(`Mô tả: ${outline.description}`);
  }
  lines.push("--------------------------------------------------");

  outline.sections.forEach((sec, idx) => {
    lines.push(`\n${sec.name || `Phần ${idx + 1}`}`);
    if (sec.wordTarget) {
      lines.push(`(Độ dài gợi ý: ${sec.wordTarget})`);
    }

    // Nếu là Task 2 có main_idea, supporting, example riêng từ AI
    if (sec.main_idea || sec.supporting || sec.example) {
      if (sec.main_idea) lines.push(`• Ý chính (Main Idea): ${sec.main_idea}`);
      if (sec.supporting) lines.push(`• Luận cứ (Supporting Idea): ${sec.supporting}`);
      if (sec.example) lines.push(`• Dẫn chứng (Example): ${sec.example}`);
    }

    // Nếu có components chuẩn
    if (Array.isArray(sec.components)) {
      sec.components.forEach((comp) => {
        lines.push(`• ${comp.label}`);
        if (comp.guide) {
          lines.push(`  -> ${comp.guide}`);
        }
        if (comp.content) {
          lines.push(`  -> Ý tưởng: ${comp.content}`);
        }
      });
    }
  });

  if (outline.languageGuide) {
    lines.push("\n--------------------------------------------------");
    lines.push(`LƯU Ý PHƯƠNG PHÁP VIẾT ${outline.languageGuide.name.toUpperCase()}:`);
    lines.push(`- Tư duy: ${outline.languageGuide.thinkingMode}`);
    if (Array.isArray(outline.languageGuide.principles)) {
      outline.languageGuide.principles.forEach((p, i) => {
        lines.push(`  ${i + 1}. ${p}`);
      });
    }
  }

  return lines.join("\n");
}

/**
 * Định dạng dàn bài thành khung sườn bài viết mẫu để chèn trực tiếp vào Editor
 * @param {Object} outline
 * @param {string} topicText
 * @returns {string}
 */
export function formatOutlineAsDraftTemplate(outline, topicText = "") {
  if (!outline || !Array.isArray(outline.sections)) {
    return "";
  }

  const chunks = [];

  outline.sections.forEach((sec) => {
    chunks.push(`/* === ${sec.name.toUpperCase()} === */`);

    if (sec.main_idea || sec.supporting || sec.example) {
      chunks.push(`[Main Idea]: ${sec.main_idea || "Nêu ý chính luận điểm..."}`);
      chunks.push(`[Supporting Idea]: ${sec.supporting || "Giải thích phân tích luận cứ..."}`);
      chunks.push(`[Example]: ${sec.example || "Dẫn chứng thực tế minh họa..."}\n`);
    } else if (Array.isArray(sec.components)) {
      sec.components.forEach((c) => {
        chunks.push(`// ${c.label}: ${c.guide || ""}`);
        if (c.content) {
          chunks.push(`${c.content}\n`);
        } else {
          chunks.push(`[Viết nội dung tại đây...]\n`);
        }
      });
    } else {
      chunks.push(`[Nội dung phần này...]\n`);
    }
  });

  return chunks.join("\n");
}

/**
 * Kiểm tra tính hợp lệ của cấu trúc dàn bài theo quy tắc hệ thống
 * @param {Object} outline
 * @returns {boolean}
 */
export function validateOutlineStructure(outline) {
  if (!outline || typeof outline !== "object") return false;
  if (!Array.isArray(outline.sections) || outline.sections.length === 0) return false;

  // Nếu là ielts_task2, bắt buộc kiểm tra đủ 4 phần (intro, body1, body2, conclusion)
  if (outline.genre === "ielts_task2") {
    const ids = outline.sections.map((s) => s.id);
    const hasIntro = ids.includes("intro");
    const hasBody1 = ids.includes("body1");
    const hasBody2 = ids.includes("body2");
    const hasConclusion = ids.includes("conclusion");

    return hasIntro && hasBody1 && hasBody2 && hasConclusion;
  }

  return true;
}
