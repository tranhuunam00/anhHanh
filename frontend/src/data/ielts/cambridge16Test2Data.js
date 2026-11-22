import { cambridge16Test2Listening } from "./cambridge16Test2Listening.js";
import { cambridge16Test2Reading } from "./cambridge16Test2Reading.js";
import { cambridge16Test2Writing } from "./cambridge16Test2Writing.js";
import { cambridge16Test2Speaking } from "./cambridge16Test2Speaking.js";

export const cambridge16Test2 = {
  id: "cambridge-16-test-2",
  title: "Cambridge IELTS 16 - Test 2",
  book: "Cambridge IELTS 16",
  testNumber: 2,
  pages: "33-55",
  skills: {
    listening: cambridge16Test2Listening,
    reading: cambridge16Test2Reading,
    writing: cambridge16Test2Writing,
    speaking: cambridge16Test2Speaking
  }
};
