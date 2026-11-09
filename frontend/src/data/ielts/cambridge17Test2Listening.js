import { listeningParts12 } from "./cambridge17Test2ListeningParts12.js";
import { listeningParts34 } from "./cambridge17Test2ListeningParts34.js";

export const cambridge17Test2Listening = {
  testId: "cambridge-17-test-2",
  title: "Cambridge IELTS 17 - Test 2 - Listening",
  audioUrl: "/audio/Cambridge 17 - Test 2.mp3",
  fallbackAudioUrl: "/audio/cambridge17/split/Test2 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
