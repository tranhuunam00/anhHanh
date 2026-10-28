/**
 * Cụm 3: Hành động & Di chuyển (Action & Movement)
 * Hợp nhất 5 submodules (Part 1, Part 2, Part 3, Part 4, Part 5) đảm bảo mỗi file code < 500 dòng (Rule 4)
 * Tổng cộng: 9 gốc từ, 72 từ vựng chuyên sâu, 100% có bài tập phản xạ và doodle
 */

import { ACTION_ROOTS_PART1 } from "./clusterActionPart1.js";
import { ACTION_ROOTS_PART2 } from "./clusterActionPart2.js";
import { ACTION_ROOTS_PART3 } from "./clusterActionPart3.js";
import { ACTION_ROOTS_PART4 } from "./clusterActionPart4.js";
import { ACTION_ROOTS_PART5 } from "./clusterActionPart5.js";

export const CLUSTER_ACTION_ROOTS = [
  ...ACTION_ROOTS_PART1,
  ...ACTION_ROOTS_PART2,
  ...ACTION_ROOTS_PART3,
  ...ACTION_ROOTS_PART4,
  ...ACTION_ROOTS_PART5,
];
