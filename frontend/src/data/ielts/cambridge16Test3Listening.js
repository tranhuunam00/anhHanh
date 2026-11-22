import { listeningParts12 } from "./cambridge16Test3ListeningParts12.js";
import { listeningParts34 } from "./cambridge16Test3ListeningParts34.js";

export const cambridge16Test3Listening = {
  testId: "cambridge-16-test-3",
  title: "Cambridge IELTS 16 - Test 3 - Listening",
  audioUrl: "/audio/Cambridge 16 - Test 3.mp3",
  fallbackAudioUrl: "/audio/cambridge16/split/Test3 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
