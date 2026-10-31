import { cambridge21Test2 } from "./cambridge21Test2Data.js";

export const IELTS_TESTS = [
  {
    id: "cambridge-21-test-2",
    title: "Cambridge IELTS 21 - Test 2",
    badge: "Mới nhất",
    book: "Cambridge 21",
    testNumber: 2,
    pages: "Trang 32 - 53",
    audioAvailable: true,
    data: cambridge21Test2
  },
  {
    id: "cambridge-21-test-1",
    title: "Cambridge IELTS 21 - Test 1",
    badge: "Sắp ra mắt",
    book: "Cambridge 21",
    testNumber: 1,
    pages: "Trang 10 - 31",
    audioAvailable: true,
    data: null
  },
  {
    id: "cambridge-21-test-3",
    title: "Cambridge IELTS 21 - Test 3",
    badge: "Sắp ra mắt",
    book: "Cambridge 21",
    testNumber: 3,
    pages: "Trang 54 - 74",
    audioAvailable: true,
    data: null
  },
  {
    id: "cambridge-21-test-4",
    title: "Cambridge IELTS 21 - Test 4",
    badge: "Sắp ra mắt",
    book: "Cambridge 21",
    testNumber: 4,
    pages: "Trang 75 - 96",
    audioAvailable: true,
    data: null
  }
];

export const getDefaultIeltsTest = () => IELTS_TESTS[0];

export const getIeltsTestById = (id) => {
  return IELTS_TESTS.find((t) => t.id === id) || IELTS_TESTS[0];
};

