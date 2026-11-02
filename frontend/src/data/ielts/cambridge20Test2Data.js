import { cambridge20Test2Listening } from "./cambridge20Test2Listening.js";
import { cambridge20Test2Reading } from "./cambridge20Test2Reading.js";
import { cambridge20Test2Writing } from "./cambridge20Test2Writing.js";
import { cambridge20Test2Speaking } from "./cambridge20Test2Speaking.js";

export const cambridge20Test2 = {
  id: "cambridge-20-test-2",
  title: "Cambridge IELTS 20 - Test 2",
  book: "Cambridge IELTS 20",
  testNumber: 2,
  pages: "34-58",
  skills: {
    listening: cambridge20Test2Listening,
    reading: cambridge20Test2Reading,
    writing: cambridge20Test2Writing,
    speaking: cambridge20Test2Speaking
  }
};

