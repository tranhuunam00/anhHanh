/**
 * Index file gom 100 Gốc từ vựng Tiếng Anh
 * Cụm 1: Nhìn & Cảm nhận (7 gốc, 52 từ)
 * Cụm 2: Nói & Viết (7 gốc, 52 từ)
 * Gốc tract (Hành động: 8 từ đầy đủ ảnh doodle)
 */

import { CLUSTER_PERCEPTION_ROOTS } from "./clusterPerceptionData.js";
import { CLUSTER_COMMUNICATION_ROOTS } from "./clusterCommunicationData.js";
import { ROOT_WORDS_1_25 } from "./rootWordsData1_25.js";
import { ROOT_WORDS_26_50 } from "./rootWordsData26_50.js";
import { ROOT_WORDS_51_75 } from "./rootWordsData51_75.js";
import { ROOT_WORDS_76_100 } from "./rootWordsData76_100.js";

// Lọc các gốc từ trong 1_25 đã được nâng cấp chuyên sâu
const upgradedIds = new Set([
  ...CLUSTER_PERCEPTION_ROOTS.map((r) => r.id),
  ...CLUSTER_COMMUNICATION_ROOTS.map((r) => r.id),
]);
const nonUpgraded1_25 = ROOT_WORDS_1_25.filter((r) => !upgradedIds.has(r.id));

export const ROOT_WORDS_DATA = [
  ...CLUSTER_PERCEPTION_ROOTS,
  ...CLUSTER_COMMUNICATION_ROOTS,
  ...nonUpgraded1_25,
  ...ROOT_WORDS_26_50,
  ...ROOT_WORDS_51_75,
  ...ROOT_WORDS_76_100,
];

export const ROOT_CATEGORIES = [
  { id: "all", label: "Tất cả 100 Gốc", icon: "Layers" },
  { id: "perception", label: "Nhìn & Cảm nhận", icon: "Eye" },
  { id: "communication", label: "Nói & Viết", icon: "MessageCircle" },
  { id: "action", label: "Hành động & Di chuyển", icon: "Footprints" },
  { id: "creation", label: "Tạo dựng & Phát triển", icon: "Sparkles" },
  { id: "mind", label: "Tư duy & Nhận thức", icon: "Lightbulb" },
  { id: "nature_space", label: "Không gian & Thời gian", icon: "Compass" },
  { id: "society_law", label: "Luật pháp & Xã hội", icon: "Shield" },
];
