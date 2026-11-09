import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getBuddyStatusMeta,
  filterBuddiesByQuery,
  sanitizeBuddiesList,
  RADIUS_OPTIONS,
} from "../src/utils/studyBuddyUtils.js";

describe("studyBuddyUtils Unit Tests", () => {
  describe("getBuddyStatusMeta", () => {
    test("happy path: returns correct metadata for FRIEND status", () => {
      const meta = getBuddyStatusMeta("FRIEND");
      assert.equal(meta.label, "Bạn bè");
      assert.equal(meta.variant, "success");
      assert.equal(meta.isButtonDisabled, true);
      assert.equal(meta.canAccept, false);
    });

    test("happy path: returns correct metadata for PENDING_SENT status", () => {
      const meta = getBuddyStatusMeta("PENDING_SENT");
      assert.equal(meta.label, "Đã gửi lời mời");
      assert.equal(meta.variant, "warning");
      assert.equal(meta.isButtonDisabled, true);
      assert.equal(meta.canAccept, false);
    });

    test("happy path: returns correct metadata for PENDING_RECEIVED status", () => {
      const meta = getBuddyStatusMeta("PENDING_RECEIVED");
      assert.equal(meta.label, "Chờ bạn phản hồi");
      assert.equal(meta.canAccept, true);
      assert.equal(meta.isButtonDisabled, false);
    });

    test("fallback: returns Kết bạn for NONE or unknown status", () => {
      const metaNone = getBuddyStatusMeta("NONE");
      assert.equal(metaNone.label, "Kết bạn");
      assert.equal(metaNone.isButtonDisabled, false);

      const metaUnknown = getBuddyStatusMeta("UNKNOWN_XYZ");
      assert.equal(metaUnknown.label, "Kết bạn");
    });
  });

  describe("filterBuddiesByQuery", () => {
    const mockBuddies = [
      { id: "1", name: "Nguyễn Văn An", study_target: "IELTS 7.5+", bio: "Thích đọc báo tiếng Anh" },
      { id: "2", name: "Trần Thị Bích", study_target: "Giao tiếp hàng ngày", bio: "Học phát âm" },
      { id: "3", name: "Lê Hoàng Long", study_target: "IELTS 6.5", bio: "Luyện thi cấp tốc" },
    ];

    test("happy path: filters by user name", () => {
      const result = filterBuddiesByQuery(mockBuddies, "Văn An");
      assert.equal(result.length, 1);
      assert.equal(result[0].id, "1");
    });

    test("happy path: filters by study target or bio", () => {
      const resultIelts = filterBuddiesByQuery(mockBuddies, "IELTS");
      assert.equal(resultIelts.length, 2);

      const resultBio = filterBuddiesByQuery(mockBuddies, "phát âm");
      assert.equal(resultBio.length, 1);
      assert.equal(resultBio[0].id, "2");
    });

    test("boundary cases: returns all buddies when query is empty, whitespace, or non-string", () => {
      assert.equal(filterBuddiesByQuery(mockBuddies, "").length, 3);
      assert.equal(filterBuddiesByQuery(mockBuddies, "   ").length, 3);
      assert.equal(filterBuddiesByQuery(mockBuddies, null).length, 3);
      assert.equal(filterBuddiesByQuery(null, "An").length, 0);
    });
  });

  describe("sanitizeBuddiesList", () => {
    test("removes invalid, null, or incomplete items", () => {
      const dirtyList = [
        { id: "u1", name: "User 1" },
        null,
        undefined,
        "not-an-object",
        { name: "Missing ID" },
        { id: "u2" }, // missing name
        { id: "u3", name: "User 3" },
      ];
      const clean = sanitizeBuddiesList(dirtyList);
      assert.equal(clean.length, 2);
      assert.equal(clean[0].id, "u1");
      assert.equal(clean[1].id, "u3");
    });

    test("handles non-array inputs safely", () => {
      assert.deepEqual(sanitizeBuddiesList(null), []);
      assert.deepEqual(sanitizeBuddiesList(undefined), []);
      assert.deepEqual(sanitizeBuddiesList("string"), []);
    });
  });

  describe("RADIUS_OPTIONS", () => {
    test("contains expected radius range options", () => {
      assert.ok(Array.isArray(RADIUS_OPTIONS));
      assert.ok(RADIUS_OPTIONS.length >= 3);
      assert.equal(RADIUS_OPTIONS[0].value, 5);
    });
  });
});

