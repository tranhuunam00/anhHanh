import { cambridge19Test1 } from "./cambridge19Test1Data.js";
import { cambridge19Test2 } from "./cambridge19Test2Data.js";
import { cambridge19Test3 } from "./cambridge19Test3Data.js";
import { cambridge19Test4 } from "./cambridge19Test4Data.js";
import { cambridge20Test1 } from "./cambridge20Test1Data.js";
import { cambridge20Test2 } from "./cambridge20Test2Data.js";
import { cambridge20Test3 } from "./cambridge20Test3Data.js";
import { cambridge20Test4 } from "./cambridge20Test4Data.js";
import { cambridge21Test1 } from "./cambridge21Test1Data.js";
import { cambridge21Test2 } from "./cambridge21Test2Data.js";
import { cambridge21Test3 } from "./cambridge21Test3Data.js";
import { cambridge21Test4 } from "./cambridge21Test4Data.js";

export const IELTS_TESTS = [
  // Cambridge IELTS 19 (Đầy đủ 4 kỹ năng)
  {
    id: "cambridge-19-test-1",
    title: "Cambridge IELTS 19 - Test 1",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 19",
    testNumber: 1,
    pages: "Trang 10 - 32",
    audioAvailable: true,
    data: cambridge19Test1
  },
  {
    id: "cambridge-19-test-2",
    title: "Cambridge IELTS 19 - Test 2",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 19",
    testNumber: 2,
    pages: "Trang 33 - 55",
    audioAvailable: true,
    data: cambridge19Test2
  },
  {
    id: "cambridge-19-test-3",
    title: "Cambridge IELTS 19 - Test 3",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 19",
    testNumber: 3,
    pages: "Trang 56 - 78",
    audioAvailable: true,
    data: cambridge19Test3
  },
  {
    id: "cambridge-19-test-4",
    title: "Cambridge IELTS 19 - Test 4",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 19",
    testNumber: 4,
    pages: "Trang 79 - 102",
    audioAvailable: true,
    data: cambridge19Test4
  },

  // Cambridge IELTS 20 (Đầy đủ 4 kỹ năng)
  {
    id: "cambridge-20-test-1",
    title: "Cambridge IELTS 20 - Test 1",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 20",
    testNumber: 1,
    pages: "Trang 10 - 33",
    audioAvailable: true,
    data: cambridge20Test1
  },
  {
    id: "cambridge-20-test-2",
    title: "Cambridge IELTS 20 - Test 2",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 20",
    testNumber: 2,
    pages: "Trang 34 - 58",
    audioAvailable: true,
    data: cambridge20Test2
  },
  {
    id: "cambridge-20-test-3",
    title: "Cambridge IELTS 20 - Test 3",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 20",
    testNumber: 3,
    pages: "Trang 79 - 110",
    audioAvailable: true,
    data: cambridge20Test3
  },
  {
    id: "cambridge-20-test-4",
    title: "Cambridge IELTS 20 - Test 4",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 20",
    testNumber: 4,
    pages: "Trang 116 - 145",
    audioAvailable: true,
    data: cambridge20Test4
  },

  // Cambridge IELTS 21 (Đầy đủ 4 kỹ năng)
  {
    id: "cambridge-21-test-1",
    title: "Cambridge IELTS 21 - Test 1",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 21",
    testNumber: 1,
    pages: "Trang 10 - 31",
    audioAvailable: true,
    data: cambridge21Test1
  },
  {
    id: "cambridge-21-test-2",
    title: "Cambridge IELTS 21 - Test 2",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 21",
    testNumber: 2,
    pages: "Trang 32 - 53",
    audioAvailable: true,
    data: cambridge21Test2
  },
  {
    id: "cambridge-21-test-3",
    title: "Cambridge IELTS 21 - Test 3",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 21",
    testNumber: 3,
    pages: "Trang 54 - 74",
    audioAvailable: true,
    data: cambridge21Test3
  },
  {
    id: "cambridge-21-test-4",
    title: "Cambridge IELTS 21 - Test 4",
    badge: "Đầy đủ 4 kỹ năng",
    book: "Cambridge 21",
    testNumber: 4,
    pages: "Trang 75 - 96",
    audioAvailable: true,
    data: cambridge21Test4
  }
];

export const getDefaultIeltsTest = () => IELTS_TESTS[0];

export const getIeltsTestById = (id) => {
  return IELTS_TESTS.find((t) => t.id === id) || IELTS_TESTS[0];
};
