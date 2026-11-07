import { listeningParts12 } from "./cambridge19Test1ListeningParts12.js";
import { listeningParts34 } from "./cambridge19Test1ListeningParts34.js";

export const cambridge19Test1Listening = {
  testId: "cambridge-19-test-1",
  title: "Cambridge IELTS 19 - Test 1 - Listening",
  audioUrl: "/audio/Cambridge 19 - Test 1.mp3",
  fallbackAudioUrl: "/audio/cambridge19/split/Test1 Part1.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};
