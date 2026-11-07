import {
  cambridge19Test4ListeningPart1,
  cambridge19Test4ListeningPart2
} from "./cambridge19Test4ListeningParts12.js";
import {
  cambridge19Test4ListeningPart3,
  cambridge19Test4ListeningPart4
} from "./cambridge19Test4ListeningParts34.js";

// Cambridge IELTS 19 Test 4 - Listening Module Data (100% Authentic Cambridge 19.pdf)
export const cambridge19Test4Listening = {
  testId: "cambridge-19-test-4",
  title: "Cambridge IELTS 19 - Test 4 - Listening",
  audioUrl: "/audio/Cambridge 19 - Test 4.mp3",
  fallbackAudioUrl: "/audio/cambridge19/split/Test4 Part1.mp3",
  parts: [
    cambridge19Test4ListeningPart1,
    cambridge19Test4ListeningPart2,
    cambridge19Test4ListeningPart3,
    cambridge19Test4ListeningPart4
  ]
};
