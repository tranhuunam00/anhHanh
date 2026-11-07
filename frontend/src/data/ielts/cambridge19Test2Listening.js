import {
  cambridge19Test2ListeningPart1,
  cambridge19Test2ListeningPart2
} from "./cambridge19Test2ListeningParts12.js";
import {
  cambridge19Test2ListeningPart3,
  cambridge19Test2ListeningPart4
} from "./cambridge19Test2ListeningParts34.js";

// Cambridge IELTS 19 Test 2 - Listening Module Data (100% Authentic Cambridge 19.pdf)
export const cambridge19Test2Listening = {
  testId: "cambridge-19-test-2",
  title: "Cambridge IELTS 19 - Test 2 - Listening",
  audioUrl: "/audio/Cambridge 19 - Test 2.mp3",
  fallbackAudioUrl: "/audio/cambridge19/split/Test2 Part1.mp3",
  parts: [
    cambridge19Test2ListeningPart1,
    cambridge19Test2ListeningPart2,
    cambridge19Test2ListeningPart3,
    cambridge19Test2ListeningPart4
  ]
};
