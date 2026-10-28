import { renderPerceptionDoodlePart1 } from "./RootDoodlePerceptionPart1";
import { renderPerceptionDoodlePart2 } from "./RootDoodlePerceptionPart2";

/**
 * Minh họa SVG Doodle cho Cụm 1: Nhìn & Cảm nhận
 * Barrel file kết hợp Part 1 & Part 2 tuân thủ Rule 4: File code < 500 dòng
 */
export const renderPerceptionDoodle = (key, strokeColor) => {
  return (
    renderPerceptionDoodlePart1(key, strokeColor) ||
    renderPerceptionDoodlePart2(key, strokeColor) ||
    null
  );
};
