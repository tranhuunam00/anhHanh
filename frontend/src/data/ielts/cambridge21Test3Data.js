import { cambridge21Test3Listening } from "./cambridge21Test3Listening.js";
import { cambridge21Test3Reading } from "./cambridge21Test3Reading.js";
import { cambridge21Test3Writing } from "./cambridge21Test3Writing.js";
import { cambridge21Test3Speaking } from "./cambridge21Test3Speaking.js";

export const cambridge21Test3 = {
  id: "cambridge-21-test-3",
  title: "Cambridge IELTS 21 - Test 3",
  book: "Cambridge IELTS 21",
  testNumber: 3,
  pages: "54-74",
  skills: {
    listening: cambridge21Test3Listening,
    reading: cambridge21Test3Reading,
    writing: cambridge21Test3Writing,
    speaking: cambridge21Test3Speaking
  }
};

