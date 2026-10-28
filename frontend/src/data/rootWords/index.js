/**
 * Index file gom 100 Gốc từ vựng Tiếng Anh
 */

import { ROOT_WORDS_1_25 } from "./rootWordsData1_25";
import { ROOT_WORDS_26_50 } from "./rootWordsData26_50";
import { ROOT_WORDS_51_75 } from "./rootWordsData51_75";
import { ROOT_WORDS_76_100 } from "./rootWordsData76_100";

export const ROOT_WORDS_DATA = [
  ...ROOT_WORDS_1_25,
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

export {
  ROOT_WORDS_1_25,
  ROOT_WORDS_26_50,
  ROOT_WORDS_51_75,
  ROOT_WORDS_76_100,
};
