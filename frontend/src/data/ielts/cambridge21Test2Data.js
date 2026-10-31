import { cambridge21Test2Listening } from "./cambridge21Test2Listening.js";
import { cambridge21Test2Reading } from "./cambridge21Test2Reading.js";
import { cambridge21Test2Writing } from "./cambridge21Test2Writing.js";
import { cambridge21Test2Speaking } from "./cambridge21Test2Speaking.js";

export const cambridge21Test2 = {
  id: "cambridge-21-test-2",
  title: "Cambridge IELTS 21 - Test 2",
  book: "Cambridge IELTS 21",
  testNumber: 2,
  pages: "32-53",
  skills: {
    listening: cambridge21Test2Listening,
    reading: cambridge21Test2Reading,
    writing: cambridge21Test2Writing,
    speaking: cambridge21Test2Speaking
  }
};

