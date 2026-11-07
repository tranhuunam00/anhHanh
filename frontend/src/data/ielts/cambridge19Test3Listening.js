import {
  cambridge19Test3ListeningPart1,
  cambridge19Test3ListeningPart2
} from "./cambridge19Test3ListeningParts12.js";
import {
  cambridge19Test3ListeningPart3,
  cambridge19Test3ListeningPart4
} from "./cambridge19Test3ListeningParts34.js";

// Cambridge IELTS 19 Test 3 - Listening Module Data (100% Authentic Cambridge 19.pdf)
export const cambridge19Test3Listening = {
  testId: "cambridge-19-test-3",
  title: "Cambridge IELTS 19 - Test 3 - Listening",
  audioUrl: "/audio/Cambridge 19 - Test 3.mp3",
  fallbackAudioUrl: "/audio/cambridge19/split/Test3 Part1.mp3",
  parts: [
    cambridge19Test3ListeningPart1,
    cambridge19Test3ListeningPart2,
    cambridge19Test3ListeningPart3,
    cambridge19Test3ListeningPart4
  ]
};
