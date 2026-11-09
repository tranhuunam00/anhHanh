import { listeningParts12 } from "./cambridge17Test3ListeningParts12.js";
import { listeningParts34 } from "./cambridge17Test3ListeningParts34.js";

export const cambridge17Test3Listening = {
  testId: "cambridge-17-test-3",
  title: "Cambridge IELTS 17 - Test 3 - Listening",
  audioUrl: "/audio/Cambridge 17 - Test 3.mp3",
  fallbackAudioUrl: "/audio/cambridge17/split/Test3 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
