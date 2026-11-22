import { listeningParts12 } from "./cambridge16Test4ListeningParts12.js";
import { listeningParts34 } from "./cambridge16Test4ListeningParts34.js";

export const cambridge16Test4Listening = {
  testId: "cambridge-16-test-4",
  title: "Cambridge IELTS 16 - Test 4 - Listening",
  audioUrl: "/audio/Cambridge 16 - Test 4.mp3",
  fallbackAudioUrl: "/audio/cambridge16/split/Test4 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
