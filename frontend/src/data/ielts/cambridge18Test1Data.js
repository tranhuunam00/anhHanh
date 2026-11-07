import { cambridge18Test1Listening } from "./cambridge18Test1Listening.js";
import { cambridge18Test1Reading } from "./cambridge18Test1Reading.js";
import { cambridge18Test1Writing } from "./cambridge18Test1Writing.js";
import { cambridge18Test1Speaking } from "./cambridge18Test1Speaking.js";

export const cambridge18Test1 = {
  id: "cambridge-18-test-1",
  title: "Cambridge IELTS 18 - Test 1",
  book: "Cambridge IELTS 18",
  testNumber: 1,
  pages: "10-33",
  skills: {
    listening: cambridge18Test1Listening,
    reading: cambridge18Test1Reading,
    writing: cambridge18Test1Writing,
    speaking: cambridge18Test1Speaking
  }
};

