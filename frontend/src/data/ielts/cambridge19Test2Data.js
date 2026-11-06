import { cambridge19Test2Listening } from "./cambridge19Test2Listening.js";
import { cambridge19Test2Reading } from "./cambridge19Test2Reading.js";
import { cambridge19Test2Writing } from "./cambridge19Test2Writing.js";
import { cambridge19Test2Speaking } from "./cambridge19Test2Speaking.js";

export const cambridge19Test2 = {
  id: "cambridge-19-test-2",
  title: "Cambridge IELTS 19 - Test 2",
  book: "Cambridge IELTS 19",
  testNumber: 2,
  pages: "33-55",
  skills: {
    listening: cambridge19Test2Listening,
    reading: cambridge19Test2Reading,
    writing: cambridge19Test2Writing,
    speaking: cambridge19Test2Speaking
  }
};

