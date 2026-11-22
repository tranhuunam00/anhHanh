import { listeningParts12 } from "./cambridge16Test1ListeningParts12.js";
import { listeningParts34 } from "./cambridge16Test1ListeningParts34.js";

export const cambridge16Test1Listening = {
  testId: "cambridge-16-test-1",
  title: "Cambridge IELTS 16 - Test 1 - Listening",
  audioUrl: "/audio/Cambridge 16 - Test 1.mp3",
  fallbackAudioUrl: "/audio/cambridge16/split/Test1 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
