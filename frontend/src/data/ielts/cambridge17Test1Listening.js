import { listeningParts12 } from "./cambridge17Test1ListeningParts12.js";
import { listeningParts34 } from "./cambridge17Test1ListeningParts34.js";

export const cambridge17Test1Listening = {
  testId: "cambridge-17-test-1",
  title: "Cambridge IELTS 17 - Test 1 - Listening",
  audioUrl: "/audio/Cambridge 17 - Test 1.mp3",
  fallbackAudioUrl: "/audio/cambridge17/split/Test1 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
