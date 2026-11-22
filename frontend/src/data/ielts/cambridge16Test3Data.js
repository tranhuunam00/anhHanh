import { cambridge16Test3Listening } from "./cambridge16Test3Listening.js";
import { cambridge16Test3Reading } from "./cambridge16Test3Reading.js";
import { cambridge16Test3Writing } from "./cambridge16Test3Writing.js";
import { cambridge16Test3Speaking } from "./cambridge16Test3Speaking.js";

export const cambridge16Test3 = {
  id: "cambridge-16-test-3",
  title: "Cambridge IELTS 16 - Test 3",
  book: "Cambridge IELTS 16",
  testNumber: 3,
  pages: "56-76",
  skills: {
    listening: cambridge16Test3Listening,
    reading: cambridge16Test3Reading,
    writing: cambridge16Test3Writing,
    speaking: cambridge16Test3Speaking
  }
};
