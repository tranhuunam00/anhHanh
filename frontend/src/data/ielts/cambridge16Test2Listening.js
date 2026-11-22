import { listeningParts12 } from "./cambridge16Test2ListeningParts12.js";
import { listeningParts34 } from "./cambridge16Test2ListeningParts34.js";

export const cambridge16Test2Listening = {
  testId: "cambridge-16-test-2",
  title: "Cambridge IELTS 16 - Test 2 - Listening",
  audioUrl: "/audio/Cambridge 16 - Test 2.mp3",
  fallbackAudioUrl: "/audio/cambridge16/split/Test2 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
