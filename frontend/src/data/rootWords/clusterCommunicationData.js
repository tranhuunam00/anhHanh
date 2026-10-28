/**
 * Cụm 2: Nói & Viết (Communication & Language)
 * Hợp nhất 3 submodules (Part 1, Part 2, Part 3) đảm bảo mỗi file code < 500 dòng (Rule 4)
 * Tổng cộng: 7 gốc từ, 52 từ vựng chuyên sâu, 100% có doodle chuyên biệt
 */

import { COMMUNICATION_ROOTS_PART1 } from "./clusterCommunicationPart1.js";
import { COMMUNICATION_ROOTS_PART2 } from "./clusterCommunicationPart2.js";
import { COMMUNICATION_ROOTS_PART3 } from "./clusterCommunicationPart3.js";

export const CLUSTER_COMMUNICATION_ROOTS = [
  ...COMMUNICATION_ROOTS_PART1,
  ...COMMUNICATION_ROOTS_PART2,
  ...COMMUNICATION_ROOTS_PART3,
];
