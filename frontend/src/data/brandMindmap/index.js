import { BRAND_PART_1 } from "./part1.js";
import { BRAND_PART_2 } from "./part2.js";
import { BRAND_PART_3 } from "./part3.js";
import { BRAND_PART_4 } from "./part4.js";
import { BRAND_PART_5 } from "./part5.js";
import { BRAND_PART_6 } from "./part6.js";

export { BRAND_PART_1, BRAND_PART_2, BRAND_PART_3, BRAND_PART_4, BRAND_PART_5, BRAND_PART_6 };

export const BRAND_MINDMAP_PARTS = [
  BRAND_PART_1,
  BRAND_PART_2,
  BRAND_PART_3,
  BRAND_PART_4,
  BRAND_PART_5
];

export const ALL_BRAND_QUESTIONS = BRAND_MINDMAP_PARTS.flatMap((part) =>
  part.questions.map((q) => ({
    ...q,
    partId: part.id,
    partNumber: part.partNumber,
    partTitle: part.title,
    partColor: part.color
  }))
);

export const BRAND_STATS = {
  totalParts: 6,
  totalQuestions: 18,
  totalBranches: ALL_BRAND_QUESTIONS.reduce((acc, q) => acc + (q.branches?.length || 0), 0)
};
