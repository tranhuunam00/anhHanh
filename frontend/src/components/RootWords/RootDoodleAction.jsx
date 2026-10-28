import { renderActionDoodlePart1 } from "./RootDoodleActionPart1";
import { renderActionDoodlePart2 } from "./RootDoodleActionPart2";

/**
 * Minh họa SVG Doodle cho Cụm 3: Hành động & Di chuyển (Action & Movement)
 * Barrel file kết hợp Part 1 & Part 2 tuân thủ Rule 4: File code < 500 dòng
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 */
export function renderActionDoodle(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  return (
    renderActionDoodlePart1(doodleKey, strokeColor) ||
    renderActionDoodlePart2(doodleKey, strokeColor) ||
    null
  );
}
