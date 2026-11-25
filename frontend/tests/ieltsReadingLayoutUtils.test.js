import test from "node:test";
import assert from "node:assert/strict";
import {
  parseGapText,
  extractGapNumbers,
  notesLineToText,
  splitBullet,
  getSummaryParagraphs,
  getNotesSections,
  getReadingGroupLayout,
  getReferenceOptions,
  getReferenceBoxPosition,
  isCompletionGroup,
  isLetterChoiceGroup,
  getLayoutGapNumbers,
  gapTextToPlain,
  formatGroupLayoutText
} from "../src/utils/ieltsReadingLayoutUtils.js";

test("parseGapText", async (t) => {
  await t.test("happy path: text with several {N} gaps keeps order and text", () => {
    assert.deepEqual(parseGapText("any unused {33} or material that could cause {34} should go."), [
      { type: "text", value: "any unused " },
      { type: "gap", number: 33 },
      { type: "text", value: " or material that could cause " },
      { type: "gap", number: 34 },
      { type: "text", value: " should go." }
    ]);
  });

  await t.test("legacy [N] tokens are gaps too", () => {
    assert.deepEqual(parseGapText("lead to [17]."), [
      { type: "text", value: "lead to " },
      { type: "gap", number: 17 },
      { type: "text", value: "." }
    ]);
  });

  await t.test("gap at start, end, and two gaps side by side", () => {
    assert.deepEqual(parseGapText("{1}{2}"), [
      { type: "gap", number: 1 },
      { type: "gap", number: 2 }
    ]);
    assert.deepEqual(parseGapText("{40} end"), [
      { type: "gap", number: 40 },
      { type: "text", value: " end" }
    ]);
  });

  await t.test("text without gaps is one text segment", () => {
    assert.deepEqual(parseGapText("no gaps here"), [{ type: "text", value: "no gaps here" }]);
  });

  await t.test("non-numeric or 3-digit braces are not gaps", () => {
    assert.deepEqual(parseGapText("{abc} [x]"), [{ type: "text", value: "{abc} [x]" }]);
    assert.equal(parseGapText("{123}").filter((s) => s.type === "gap").length, 0);
  });

  await t.test("empty, null and non-string input give []", () => {
    assert.deepEqual(parseGapText(""), []);
    assert.deepEqual(parseGapText(null), []);
    assert.deepEqual(parseGapText(undefined), []);
    assert.deepEqual(parseGapText(42), []);
  });

  await t.test("repeated calls are stateless (global regex reset)", () => {
    assert.equal(parseGapText("a {5} b").length, 3);
    assert.equal(parseGapText("a {5} b").length, 3);
  });
});

test("extractGapNumbers", async (t) => {
  await t.test("returns numbers in reading order", () => {
    assert.deepEqual(extractGapNumbers("{32} and {33} then [34]"), [32, 33, 34]);
  });
  await t.test("bad input returns []", () => {
    assert.deepEqual(extractGapNumbers(null), []);
    assert.deepEqual(extractGapNumbers("plain"), []);
  });
});

test("notesLineToText", async (t) => {
  await t.test("string line is returned as is", () => {
    assert.equal(notesLineToText("• near a road {9}"), "• near a road {9}");
  });
  await t.test("legacy object with number becomes a gap token", () => {
    assert.equal(notesLineToText({ prefix: "• near ", number: 9, suffix: " road" }), "• near {9} road");
    assert.equal(notesLineToText({ number: 9 }), "{9}");
  });
  await t.test("legacy text-only object returns its text", () => {
    assert.equal(notesLineToText({ text: "• a distance of 2.5 km" }), "• a distance of 2.5 km");
  });
  await t.test("bad input returns empty string", () => {
    assert.equal(notesLineToText(null), "");
    assert.equal(notesLineToText(5), "");
    assert.equal(notesLineToText({}), "");
  });
});

test("splitBullet", async (t) => {
  await t.test("bullet • is first level", () => {
    assert.deepEqual(splitBullet("• no soil used"), { bullet: true, dash: false, text: "no soil used" });
  });
  await t.test("dash – or - is a second-level item", () => {
    assert.deepEqual(splitBullet("  - item"), { bullet: false, dash: true, text: "item" });
    assert.deepEqual(splitBullet("– were most active"), { bullet: false, dash: true, text: "were most active" });
  });
  await t.test("no marker keeps text (hyphen inside a word is not a marker)", () => {
    assert.deepEqual(splitBullet("Intensive farming"), { bullet: false, dash: false, text: "Intensive farming" });
    assert.deepEqual(splitBullet("well-known"), { bullet: false, dash: false, text: "well-known" });
    assert.deepEqual(splitBullet("•no space"), { bullet: false, dash: false, text: "•no space" });
  });
  await t.test("bad input", () => {
    assert.deepEqual(splitBullet(null), { bullet: false, dash: false, text: "" });
    assert.deepEqual(splitBullet(""), { bullet: false, dash: false, text: "" });
  });
});

test("getSummaryParagraphs", async (t) => {
  await t.test("new summary shape", () => {
    assert.deepEqual(getSummaryParagraphs({ summary: { paragraphs: ["a {1}", "b {2}"] } }), ["a {1}", "b {2}"]);
  });
  await t.test("legacy paragraphs shape (objects or strings)", () => {
    assert.deepEqual(getSummaryParagraphs({ paragraphs: [{ text: "x [17]" }, "y [18]"] }), ["x [17]", "y [18]"]);
  });
  await t.test("filters non-string entries", () => {
    assert.deepEqual(getSummaryParagraphs({ summary: { paragraphs: ["ok", 3, null] } }), ["ok"]);
    assert.deepEqual(getSummaryParagraphs({ paragraphs: [{ foo: 1 }] }), []);
  });
  await t.test("missing or bad group", () => {
    assert.deepEqual(getSummaryParagraphs({}), []);
    assert.deepEqual(getSummaryParagraphs(null), []);
  });
});

test("getNotesSections", async (t) => {
  await t.test("new notes shape with string lines", () => {
    assert.deepEqual(getNotesSections({ notes: { sections: [{ heading: "H", lines: ["• a {1}"] }] } }), [
      { heading: "H", lines: ["• a {1}"] }
    ]);
  });
  await t.test("legacy sections with object lines", () => {
    const group = {
      sections: [{ heading: "Dating", lines: [{ text: "• coins" }, { prefix: "• analysis of ", number: 11, suffix: "" }] }]
    };
    assert.deepEqual(getNotesSections(group), [{ heading: "Dating", lines: ["• coins", "• analysis of {11}"] }]);
  });
  await t.test("missing heading/lines and junk sections", () => {
    assert.deepEqual(getNotesSections({ sections: [{}, null, { lines: [null] }] }), [
      { heading: "", lines: [] },
      { heading: "", lines: [] }
    ]);
  });
  await t.test("no sections", () => {
    assert.deepEqual(getNotesSections({}), []);
    assert.deepEqual(getNotesSections(undefined), []);
  });
});

test("getReadingGroupLayout", async (t) => {
  await t.test("table wins when rows exist", () => {
    assert.equal(getReadingGroupLayout({ table: { rows: [["a"]] }, summary: { paragraphs: ["x"] } }), "table");
  });
  await t.test("summary then notes", () => {
    assert.equal(getReadingGroupLayout({ summary: { paragraphs: ["x {1}"] } }), "summary");
    assert.equal(getReadingGroupLayout({ paragraphs: [{ text: "x [1]" }] }), "summary");
    assert.equal(getReadingGroupLayout({ sections: [{ heading: "h", lines: [] }] }), "notes");
  });
  await t.test("falls back to items", () => {
    assert.equal(getReadingGroupLayout({ table: { rows: [] } }), "items");
    assert.equal(getReadingGroupLayout({ items: [] }), "items");
    assert.equal(getReadingGroupLayout(null), "items");
  });
});

test("getReferenceOptions", async (t) => {
  await t.test("string box options with letters", () => {
    assert.deepEqual(getReferenceOptions({ boxOptions: ["A a TSI Cut", "B. a Salvage Cut", "C"] }), [
      { value: "A", text: "a TSI Cut" },
      { value: "B", text: "a Salvage Cut" },
      { value: "C", text: "" }
    ]);
  });
  await t.test("object options (letter/text, number/text, letter/name)", () => {
    assert.deepEqual(getReferenceOptions({ boxOptions: [{ letter: "A", text: "solution" }] }), [{ value: "A", text: "solution" }]);
    assert.deepEqual(getReferenceOptions({ listHeadings: [{ number: "iv", text: "A single certainty" }] }), [
      { value: "iv", text: "A single certainty" }
    ]);
    assert.deepEqual(getReferenceOptions({ people: [{ letter: "B", name: "Hamish Low" }] }), [{ value: "B", text: "Hamish Low" }]);
  });
  await t.test("roman numeral strings keep lowercase value", () => {
    assert.deepEqual(getReferenceOptions({ headingsList: ["vii Encouraging openness", "ii. Reasons why"] }), [
      { value: "vii", text: "Encouraging openness" },
      { value: "ii", text: "Reasons why" }
    ]);
  });
  await t.test("uppercase I is a letter, not a roman numeral", () => {
    assert.deepEqual(getReferenceOptions({ boxOptions: ["I friend"] }), [{ value: "I", text: "friend" }]);
  });
  await t.test("drops empty and non-string entries; no list gives []", () => {
    assert.deepEqual(getReferenceOptions({ boxOptions: [null, 5, { text: "no letter" }] }), []);
    assert.deepEqual(getReferenceOptions({}), []);
    assert.deepEqual(getReferenceOptions(null), []);
  });
});

test("getReferenceBoxPosition", async (t) => {
  await t.test("headings go before the questions", () => {
    assert.equal(getReferenceBoxPosition({ groupType: "matching_headings" }), "before");
    assert.equal(getReferenceBoxPosition({ groupType: "x", listHeadings: [] }), "before");
  });
  await t.test("people, word boxes and endings go after", () => {
    assert.equal(getReferenceBoxPosition({ groupType: "matching_features", boxOptions: [] }), "after");
    assert.equal(getReferenceBoxPosition({ groupType: "summary_with_box" }), "after");
  });
  await t.test("explicit boxPosition overrides; bad input defaults to after", () => {
    assert.equal(getReferenceBoxPosition({ groupType: "matching_headings", boxPosition: "after" }), "after");
    assert.equal(getReferenceBoxPosition({ boxPosition: "middle" }), "after");
    assert.equal(getReferenceBoxPosition(null), "after");
  });
});

test("isCompletionGroup", async (t) => {
  await t.test("completion types", () => {
    for (const type of ["fill_notes", "fill_table", "summary_with_box", "notes_completion", "sentence_completion", "flowchart_completion", "diagram_labelling", "short_answer"]) {
      assert.equal(isCompletionGroup({ groupType: type }), true, type);
    }
  });
  await t.test("non-completion types, including sentence endings", () => {
    for (const type of ["matching_features", "true_false_not_given", "multiple_choice", "choose_two", "sentence_completion_endings", ""]) {
      assert.equal(isCompletionGroup({ groupType: type }), false, type);
    }
    assert.equal(isCompletionGroup(null), false);
  });
});

test("isLetterChoiceGroup", async (t) => {
  await t.test("summary with a word box answers by letter", () => {
    assert.equal(isLetterChoiceGroup({ groupType: "summary_with_box", boxOptions: ["A pressure"] }), true);
    assert.equal(isLetterChoiceGroup({ groupType: "summary_completion", summaryOptions: [{ letter: "A", text: "x" }] }), true);
  });
  await t.test("matching groups and groups without a box are not", () => {
    assert.equal(isLetterChoiceGroup({ groupType: "matching_features", boxOptions: ["A x"] }), false);
    assert.equal(isLetterChoiceGroup({ groupType: "fill_notes" }), false);
    assert.equal(isLetterChoiceGroup(undefined), false);
  });
});

test("getLayoutGapNumbers", async (t) => {
  await t.test("summary, notes (headings + lines) and table", () => {
    assert.deepEqual(getLayoutGapNumbers({ summary: { paragraphs: ["{32} x {33}", "{35}"] } }), [32, 33, 35]);
    assert.deepEqual(
      getLayoutGapNumbers({ notes: { sections: [{ heading: "H {1}", lines: ["• {2}", "• none"] }] } }),
      [1, 2]
    );
    assert.deepEqual(
      getLayoutGapNumbers({ table: { rows: [["Intensive", "• {4}\n• x", null], ["", "{7}"]] } }),
      [4, 7]
    );
  });
  await t.test("item-only group has no layout gaps", () => {
    assert.deepEqual(getLayoutGapNumbers({ items: [{ number: 1 }] }), []);
  });
});

test("gapTextToPlain", async (t) => {
  await t.test("replaces gaps with numbered dots", () => {
    assert.equal(gapTextToPlain("how the {32} of space"), "how the 32 ........ of space");
  });
  await t.test("bad input gives empty string", () => {
    assert.equal(gapTextToPlain(null), "");
  });
});

test("formatGroupLayoutText", async (t) => {
  await t.test("summary with title", () => {
    const text = formatGroupLayoutText({ summary: { title: "Committee", paragraphs: ["the {32} of space"] } });
    assert.equal(text, "Committee\nthe 32 ........ of space");
  });
  await t.test("notes falls back to group title and lists headings and lines", () => {
    const text = formatGroupLayoutText({ title: "Notes", sections: [{ heading: "H", lines: [{ prefix: "• a ", number: 9, suffix: "" }] }] });
    assert.equal(text, "Notes\nH\n• a 9 ........");
  });
  await t.test("table joins headers and cells with pipes", () => {
    const text = formatGroupLayoutText({ table: { title: "T", headers: ["", "Growth"], rows: [["Row", "• {4}\n• y"]] } });
    assert.equal(text, "T\n | Growth\nRow | • 4 ........ • y");
  });
  await t.test("item-only group returns empty string", () => {
    assert.equal(formatGroupLayoutText({ items: [] }), "");
    assert.equal(formatGroupLayoutText(null), "");
  });
});
