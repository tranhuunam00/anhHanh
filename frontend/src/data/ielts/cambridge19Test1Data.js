import { cambridge19Test1Listening } from "./cambridge19Test1Listening.js";
import { cambridge19Test1Reading } from "./cambridge19Test1Reading.js";
import { cambridge19Test1Writing } from "./cambridge19Test1Writing.js";
import { cambridge19Test1Speaking } from "./cambridge19Test1Speaking.js";

export const cambridge19Test1 = {
  id: "cambridge-19-test-1",
  title: "Cambridge IELTS 19 - Test 1",
  book: "Cambridge IELTS 19",
  testNumber: 1,
  pages: "10-32",
  skills: {
    listening: cambridge19Test1Listening,
    reading: cambridge19Test1Reading,
    writing: cambridge19Test1Writing,
    speaking: cambridge19Test1Speaking
  }
};

