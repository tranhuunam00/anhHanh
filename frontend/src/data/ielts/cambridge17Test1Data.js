import { cambridge17Test1Listening } from "./cambridge17Test1Listening.js";
import { cambridge17Test1Reading } from "./cambridge17Test1Reading.js";
import { cambridge17Test1Writing } from "./cambridge17Test1Writing.js";
import { cambridge17Test1Speaking } from "./cambridge17Test1Speaking.js";

export const cambridge17Test1 = {
  id: "cambridge-17-test-1",
  title: "Cambridge IELTS 17 - Test 1",
  book: "Cambridge IELTS 17",
  testNumber: 1,
  pages: "10-30",
  skills: {
    listening: cambridge17Test1Listening,
    reading: cambridge17Test1Reading,
    writing: cambridge17Test1Writing,
    speaking: cambridge17Test1Speaking
  }
};
