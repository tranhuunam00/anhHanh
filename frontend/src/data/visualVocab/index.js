/**
 * Visual Vocabulary Topics Registry
 */
import { MOUNTAIN_LANDFORMS_TOPIC } from "./mountainData.js";
import { UNIVERSITY_CAMPUS_TOPIC } from "./universityData.js";

export const VISUAL_VOCAB_TOPICS = [
  MOUNTAIN_LANDFORMS_TOPIC,
  UNIVERSITY_CAMPUS_TOPIC,
];

export const getVisualVocabTopicById = (topicId) => {
  if (!topicId) return VISUAL_VOCAB_TOPICS[0];
  return (
    VISUAL_VOCAB_TOPICS.find((t) => t.id === topicId) || VISUAL_VOCAB_TOPICS[0]
  );
};
