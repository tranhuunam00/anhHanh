/**
 * Visual Vocabulary Topics Registry & Localization
 */
import { MOUNTAIN_LANDFORMS_TOPIC } from "./mountainData.js";
import { UNIVERSITY_CAMPUS_TOPIC } from "./universityData.js";
import { OCEAN_3D_TOPIC } from "./ocean3dData.js";

export {
  VISUAL_VOCAB_LANGUAGES,
  getLocalizedItem,
  getLocalizedDistractor,
  getLocalizedTopic,
} from "./translations/index.js";

export const VISUAL_VOCAB_TOPICS = [
  MOUNTAIN_LANDFORMS_TOPIC,
  UNIVERSITY_CAMPUS_TOPIC,
  OCEAN_3D_TOPIC,
];

export const getVisualVocabTopicById = (topicId) => {
  if (!topicId) return VISUAL_VOCAB_TOPICS[0];
  return (
    VISUAL_VOCAB_TOPICS.find((t) => t.id === topicId) || VISUAL_VOCAB_TOPICS[0]
  );
};
