import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_TAB,
  KNOWN_TABS,
  matchesRoute,
  getTabFromLocation,
  getPathFromTab,
  getTabIdFromElement,
  normalizeTabId,
} from "../src/utils/tabRouting.js";

describe("matchesRoute", () => {
  test("matches exact path and sub-paths", () => {
    assert.equal(matchesRoute("/vocab", "/vocab"), true);
    assert.equal(matchesRoute("/vocab/123", "/vocab"), true);
  });

  test("does not match paths that merely share a prefix", () => {
    assert.equal(matchesRoute("/vocabulary", "/vocab"), false);
    assert.equal(matchesRoute("/ielts-testing", "/ielts-test"), false);
  });

  test("returns false for invalid input", () => {
    assert.equal(matchesRoute(null, "/vocab"), false);
    assert.equal(matchesRoute("/vocab", ""), false);
    assert.equal(matchesRoute("/vocab", undefined), false);
    assert.equal(matchesRoute(5, 5), false);
  });
});

describe("getTabFromLocation", () => {
  test("maps every canonical path (round-trip with getPathFromTab)", () => {
    for (const tab of KNOWN_TABS) {
      if (tab === DEFAULT_TAB) continue;
      assert.equal(getTabFromLocation(getPathFromTab(tab)), tab, `round-trip failed for ${tab}`);
    }
  });

  test("supports alias paths", () => {
    assert.equal(getTabFromLocation("/root-words"), "tab-root-words");
    assert.equal(getTabFromLocation("/ban-hoc"), "tab-buddy");
    assert.equal(getTabFromLocation("/ielts-test/cam19"), "tab-ielts-test");
    assert.equal(getTabFromLocation("/tieu-hoc"), "tab-primary");
    assert.equal(getTabFromLocation("/primary/unit-1"), "tab-primary");
  });

  test("is case-insensitive and tolerates trailing slash / whitespace", () => {
    assert.equal(getTabFromLocation("/VOCAB"), "tab-vocab");
    assert.equal(getTabFromLocation("/writing/"), "tab-writing");
    assert.equal(getTabFromLocation("  /reader  "), "tab-reader");
  });

  test("invite query parameters open the buddy tab regardless of path", () => {
    assert.equal(getTabFromLocation("/", "?buddy_invite=abc"), "tab-buddy");
    assert.equal(getTabFromLocation("/vocab", "?invite=xyz"), "tab-buddy");
  });

  test("unrelated query does not change routing", () => {
    assert.equal(getTabFromLocation("/history", "?openExercise=true"), "tab-history");
  });

  test("falls back to default tab for root, unknown, empty or invalid input", () => {
    assert.equal(getTabFromLocation("/"), DEFAULT_TAB);
    assert.equal(getTabFromLocation("/unknown-page"), DEFAULT_TAB);
    assert.equal(getTabFromLocation(""), DEFAULT_TAB);
    assert.equal(getTabFromLocation(), DEFAULT_TAB);
    assert.equal(getTabFromLocation(null, null), DEFAULT_TAB);
    assert.equal(getTabFromLocation(123, 456), DEFAULT_TAB);
  });
});

describe("getPathFromTab", () => {
  test("returns canonical paths", () => {
    assert.equal(getPathFromTab("tab-root-words"), "/roots");
    assert.equal(getPathFromTab("tab-ielts-test"), "/ielts");
    assert.equal(getPathFromTab("tab-buddy"), "/buddy");
  });

  test("tabs that previously lost their URL now have one", () => {
    assert.equal(getPathFromTab("tab-primary"), "/kids");
    assert.equal(getPathFromTab("tab-tiktok-live"), "/tiktok-live");
  });

  test("default and unknown tabs map to root", () => {
    assert.equal(getPathFromTab(DEFAULT_TAB), "/");
    assert.equal(getPathFromTab("tab-nope"), "/");
    assert.equal(getPathFromTab(undefined), "/");
  });
});

describe("normalizeTabId", () => {
  test("keeps known tabs", () => {
    for (const tab of KNOWN_TABS) assert.equal(normalizeTabId(tab), tab);
  });

  test("maps legacy 'tab-ielts' alias to the real IELTS tab", () => {
    assert.equal(normalizeTabId("tab-ielts"), "tab-ielts-test");
  });

  test("unknown or invalid ids fall back to default tab (no blank screen)", () => {
    assert.equal(normalizeTabId("tab-does-not-exist"), DEFAULT_TAB);
    assert.equal(normalizeTabId(""), DEFAULT_TAB);
    assert.equal(normalizeTabId(null), DEFAULT_TAB);
    assert.equal(normalizeTabId(undefined), DEFAULT_TAB);
  });
});

describe("KNOWN_TABS", () => {
  test("is frozen, unique and includes the default tab", () => {
    assert.equal(Object.isFrozen(KNOWN_TABS), true);
    assert.equal(new Set(KNOWN_TABS).size, KNOWN_TABS.length);
    assert.equal(KNOWN_TABS[0], DEFAULT_TAB);
  });
});

describe("getTabIdFromElement", () => {
  const makeEl = (tabValue) => ({
    closest: (selector) => {
      assert.equal(selector, "[data-tab]");
      return tabValue === undefined ? null : { getAttribute: () => tabValue };
    },
  });

  test("returns the data-tab of the closest nav button", () => {
    assert.equal(getTabIdFromElement(makeEl("tab-writing")), "tab-writing");
  });

  test("trims whitespace in attribute value", () => {
    assert.equal(getTabIdFromElement(makeEl("  tab-vocab ")), "tab-vocab");
  });

  test("returns null when no button ancestor or attribute is empty", () => {
    assert.equal(getTabIdFromElement(makeEl(undefined)), null);
    assert.equal(getTabIdFromElement(makeEl("")), null);
    assert.equal(getTabIdFromElement(makeEl("   ")), null);
    assert.equal(getTabIdFromElement(makeEl(null)), null);
  });

  test("returns null for invalid targets (text nodes, null)", () => {
    assert.equal(getTabIdFromElement(null), null);
    assert.equal(getTabIdFromElement({}), null);
    assert.equal(getTabIdFromElement({ closest: () => ({}) }), null);
  });
});
