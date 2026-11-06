/**
 * Cambridge IELTS Practice Lessons Data Index
 * Re-exports modular presets for Cambridge 19, 20 & 21
 */

import {
  CAMBRIDGE_19_LESSONS,
  CAMBRIDGE_19_FULL_LESSONS
} from "./ieltsCambridge19Presets.js";
import {
  CAMBRIDGE_20_LESSONS,
  CAMBRIDGE_20_FULL_LESSONS
} from "./ieltsCambridge20Presets.js";
import { CAMBRIDGE_21_LESSONS } from "./ieltsCambridge21Presets.js";

export {
  CAMBRIDGE_19_LESSONS,
  CAMBRIDGE_19_FULL_LESSONS,
  CAMBRIDGE_20_LESSONS,
  CAMBRIDGE_20_FULL_LESSONS,
  CAMBRIDGE_21_LESSONS
};

export const IELTS_TASK_TABS = [
  { id: "all", label: "Tất cả", desc: "Toàn bộ bài tập Cambridge 19, 20 & 21 (Audio gốc chính thức)" },
  { id: "task1", label: "Task 1", desc: "Hội thoại Form Completion (Điền thông tin, số đo, ngày tháng)" },
  { id: "task2", label: "Task 2", desc: "Độc thoại Monologue (Hướng dẫn, sơ đồ bản đồ, quy chế)" },
  { id: "task3", label: "Task 3", desc: "Thảo luận Academic Discussion (Nhóm 2-3 người & giảng viên)" },
  { id: "task4", label: "Task 4", desc: "Bài giảng Academic Lecture (Khoa học, lịch sử, môi trường)" },
  { id: "full", label: "Trọn bộ (Gộp 4 phần)", desc: "Bài thi hoàn chỉnh liên tục cả 4 phần (30 phút)" }
];

/**
 * Filter IELTS Cambridge lessons by active task filter tab.
 * @param {Array} lessons - Array of lesson objects
 * @param {string} taskFilter - 'all' | 'task1' | 'task2' | 'task3' | 'task4' | 'full'
 * @returns {Array} Filtered lessons
 */
export function filterIeltsLessons(lessons, taskFilter = "all") {
  if (!Array.isArray(lessons)) return [];
  if (!taskFilter || taskFilter === "all") return lessons;
  return lessons.filter((lesson) => lesson.taskKey === taskFilter);
}
