import { cambridge20Test1Listening } from "./cambridge20Test1Listening.js";
import { cambridge20Test1Reading } from "./cambridge20Test1Reading.js";
import { cambridge20Test1Writing } from "./cambridge20Test1Writing.js";
import { cambridge20Test1Speaking } from "./cambridge20Test1Speaking.js";

export const cambridge20Test1 = {
  id: "cambridge-20-test-1",
  title: "Cambridge IELTS 20 - Test 1",
  book: "Cambridge IELTS 20",
  testNumber: 1,
  pages: "10-33",
  skills: {
    listening: cambridge20Test1Listening,
    reading: cambridge20Test1Reading,
    writing: cambridge20Test1Writing,
    speaking: cambridge20Test1Speaking
  }
};

