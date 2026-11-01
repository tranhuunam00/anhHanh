import { listeningParts12 } from "./cambridge21Test1ListeningParts12.js";
import { listeningParts34 } from "./cambridge21Test1ListeningParts34.js";

export const cambridge21Test1Listening = {
  testId: "cambridge-21-test-1",
  title: "Cambridge IELTS 21 - Test 1 - Listening",
  audioUrl: "/audio/Cambridge 21 - Test 1.mp3",
  fallbackAudioUrl: "/audio/Cambridge 21 - Test 2.mp3",
  parts: [...listeningParts12, ...listeningParts34]
};

