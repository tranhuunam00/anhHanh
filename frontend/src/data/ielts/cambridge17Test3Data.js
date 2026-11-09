import { cambridge17Test3Listening } from "./cambridge17Test3Listening.js";
import { cambridge17Test3Reading } from "./cambridge17Test3Reading.js";
import { cambridge17Test3Writing } from "./cambridge17Test3Writing.js";
import { cambridge17Test3Speaking } from "./cambridge17Test3Speaking.js";

export const cambridge17Test3 = {
  id: "cambridge-17-test-3",
  title: "Cambridge IELTS 17 - Test 3",
  book: "Cambridge IELTS 17",
  testNumber: 3,
  pages: "53-74",
  skills: {
    listening: cambridge17Test3Listening,
    reading: cambridge17Test3Reading,
    writing: cambridge17Test3Writing,
    speaking: cambridge17Test3Speaking
  }
};
