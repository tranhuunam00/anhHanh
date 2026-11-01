import { cambridge21Test1Listening } from "./cambridge21Test1Listening.js";
import { cambridge21Test1Reading } from "./cambridge21Test1Reading.js";
import { cambridge21Test1Writing } from "./cambridge21Test1Writing.js";
import { cambridge21Test1Speaking } from "./cambridge21Test1Speaking.js";

export const cambridge21Test1 = {
  id: "cambridge-21-test-1",
  title: "Cambridge IELTS 21 - Test 1",
  book: "Cambridge IELTS 21",
  testNumber: 1,
  pages: "10-31",
  skills: {
    listening: cambridge21Test1Listening,
    reading: cambridge21Test1Reading,
    writing: cambridge21Test1Writing,
    speaking: cambridge21Test1Speaking
  }
};

