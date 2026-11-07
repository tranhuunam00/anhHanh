import { listeningParts12 } from "./cambridge18Test1ListeningParts12.js";
import { listeningParts34 } from "./cambridge18Test1ListeningParts34.js";

export const cambridge18Test1Listening = {
  testId: "cambridge-18-test-1",
  title: "Cambridge IELTS 18 - Test 1 - Listening",
  audioUrl: "/audio/Cambridge 18 - Test 1.mp3",
  fallbackAudioUrl: "/audio/cambridge18/split/Test1 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};

