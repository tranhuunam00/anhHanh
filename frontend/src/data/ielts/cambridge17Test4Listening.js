import { listeningParts12 } from "./cambridge17Test4ListeningParts12.js";
import { listeningParts34 } from "./cambridge17Test4ListeningParts34.js";

export const cambridge17Test4Listening = {
  testId: "cambridge-17-test-4",
  title: "Cambridge IELTS 17 - Test 4 - Listening",
  audioUrl: "/audio/Cambridge 17 - Test 4.mp3",
  fallbackAudioUrl: "/audio/cambridge17/split/Test4 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
