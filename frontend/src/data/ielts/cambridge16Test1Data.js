import { cambridge16Test1Listening } from "./cambridge16Test1Listening.js";
import { cambridge16Test1Reading } from "./cambridge16Test1Reading.js";
import { cambridge16Test1Writing } from "./cambridge16Test1Writing.js";
import { cambridge16Test1Speaking } from "./cambridge16Test1Speaking.js";

export const cambridge16Test1 = {
  id: "cambridge-16-test-1",
  title: "Cambridge IELTS 16 - Test 1",
  book: "Cambridge IELTS 16",
  testNumber: 1,
  pages: "10-32",
  skills: {
    listening: cambridge16Test1Listening,
    reading: cambridge16Test1Reading,
    writing: cambridge16Test1Writing,
    speaking: cambridge16Test1Speaking
  }
};
