/**
 * Global English 4 (Stage 4) - Cambridge Primary Curriculum
 * Central export of Stage 4 study data & animal mascots
 */
import { STAGE4_MASCOTS, UNIT_1, UNIT_2 } from "./stage4DataUnits12.js";
import { UNIT_3, UNIT_4 } from "./stage4DataUnits34.js";

export { STAGE4_MASCOTS, UNIT_1, UNIT_2, UNIT_3, UNIT_4 };

export const STAGE4_ALL_UNITS = [UNIT_1, UNIT_2, UNIT_3, UNIT_4];

/**
 * Get all vocabulary items across all 4 units flattened
 */
export const getAllVocabItems = () => {
  const items = [];
  STAGE4_ALL_UNITS.forEach((unit) => {
    unit.lessons.forEach((lesson) => {
      lesson.vocab.forEach((v) => {
        items.push({
          ...v,
          unitId: unit.id,
          unitTitle: unit.title,
          lessonTitle: lesson.title
        });
      });
    });
  });
  return items;
};

/**
 * Get unit by id (1, 2, 3, 4)
 */
export const getUnitById = (id) => {
  return STAGE4_ALL_UNITS.find((u) => u.id === Number(id)) || UNIT_1;
};

