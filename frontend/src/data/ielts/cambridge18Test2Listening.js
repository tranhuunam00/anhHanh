import { listeningParts12 } from "./cambridge18Test2ListeningParts12.js";
import { listeningParts34 } from "./cambridge18Test2ListeningParts34.js";

export const cambridge18Test2Listening = {
  testId: "cambridge-18-test-2",
  title: "Cambridge IELTS 18 - Test 2 - Listening",
  audioUrl: "/audio/Cambridge 18 - Test 2.mp3",
  fallbackAudioUrl: "/audio/cambridge18/split/Test2 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};

