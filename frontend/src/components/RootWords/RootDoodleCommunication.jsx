import { renderCommunicationDoodlePart1 } from "./RootDoodleCommunicationPart1";
import { renderCommunicationDoodlePart2 } from "./RootDoodleCommunicationPart2";

/**
 * Minh họa SVG Doodle cho Cụm 2: Nói & Viết (Communication & Language)
 * Barrel file kết hợp Part 1 & Part 2 tuân thủ Rule 4: File code < 500 dòng
 * Đảm bảo 100% vector SVG vẽ tay tinh gọn, sắc nét cả Light/Dark Mode
 */
export function renderCommunicationDoodle(doodleKey, strokeColor = "var(--text-primary, #1e293b)") {
  return (
    renderCommunicationDoodlePart1(doodleKey, strokeColor) ||
    renderCommunicationDoodlePart2(doodleKey, strokeColor) ||
    null
  );
}
