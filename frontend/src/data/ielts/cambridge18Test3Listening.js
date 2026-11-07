import { listeningParts12 } from "./cambridge18Test3ListeningParts12.js";
import { listeningParts34 } from "./cambridge18Test3ListeningParts34.js";

export const cambridge18Test3Listening = {
  testId: "cambridge-18-test-3",
  title: "Cambridge IELTS 18 - Test 3 - Listening",
  audioUrl: "/audio/Cambridge 18 - Test 3.mp3",
  fallbackAudioUrl: "/audio/cambridge18/split/Test3 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};

