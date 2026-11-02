import { cambridge20Test3Listening } from "./cambridge20Test3Listening.js";
import { cambridge20Test3Reading } from "./cambridge20Test3Reading.js";
import { cambridge20Test3Writing } from "./cambridge20Test3Writing.js";
import { cambridge20Test3Speaking } from "./cambridge20Test3Speaking.js";

export const cambridge20Test3 = {
  id: "cambridge-20-test-3",
  title: "Cambridge IELTS 20 - Test 3",
  book: "Cambridge IELTS 20",
  testNumber: 3,
  pages: "79-110",
  skills: {
    listening: cambridge20Test3Listening,
    reading: cambridge20Test3Reading,
    writing: cambridge20Test3Writing,
    speaking: cambridge20Test3Speaking
  }
};

