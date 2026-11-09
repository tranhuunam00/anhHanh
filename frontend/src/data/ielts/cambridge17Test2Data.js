import { cambridge17Test2Listening } from "./cambridge17Test2Listening.js";
import { cambridge17Test2Reading } from "./cambridge17Test2Reading.js";
import { cambridge17Test2Writing } from "./cambridge17Test2Writing.js";
import { cambridge17Test2Speaking } from "./cambridge17Test2Speaking.js";

export const cambridge17Test2 = {
  id: "cambridge-17-test-2",
  title: "Cambridge IELTS 17 - Test 2",
  book: "Cambridge IELTS 17",
  testNumber: 2,
  pages: "31-52",
  skills: {
    listening: cambridge17Test2Listening,
    reading: cambridge17Test2Reading,
    writing: cambridge17Test2Writing,
    speaking: cambridge17Test2Speaking
  }
};
