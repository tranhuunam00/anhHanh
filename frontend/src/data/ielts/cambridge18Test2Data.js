import { cambridge18Test2Listening } from "./cambridge18Test2Listening.js";
import { cambridge18Test2Reading } from "./cambridge18Test2Reading.js";
import { cambridge18Test2Writing } from "./cambridge18Test2Writing.js";
import { cambridge18Test2Speaking } from "./cambridge18Test2Speaking.js";

export const cambridge18Test2 = {
  id: "cambridge-18-test-2",
  title: "Cambridge IELTS 18 - Test 2",
  book: "Cambridge IELTS 18",
  testNumber: 2,
  pages: "34-56",
  skills: {
    listening: cambridge18Test2Listening,
    reading: cambridge18Test2Reading,
    writing: cambridge18Test2Writing,
    speaking: cambridge18Test2Speaking
  }
};

