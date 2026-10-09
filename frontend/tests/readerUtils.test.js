import test, { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizePastedHtml,
  getWordVariants,
  splitTextIntoSentences,
  formatTime,
  groupBlockIntoSentences,
  isSilentOrDivider,
  cleanSpeechText,
} from "../src/utils/readerUtils.js";

describe("readerUtils Unit Tests", () => {
  describe("formatTime", () => {
    it("handles happy path seconds formatting", () => {
      assert.equal(formatTime(0), "00:00");
      assert.equal(formatTime(5), "00:05");
      assert.equal(formatTime(65), "01:05");
      assert.equal(formatTime(253), "04:13");
      assert.equal(formatTime(3600), "60:00");
    });

    it("handles boundary and invalid values gracefully", () => {
      assert.equal(formatTime(-10), "00:00");
      assert.equal(formatTime(NaN), "00:00");
      assert.equal(formatTime(null), "00:00");
      assert.equal(formatTime(undefined), "00:00");
    });
  });

  describe("getWordVariants", () => {
    it("generates inflection stems for plural and verb forms", () => {
      const berriesVariants = getWordVariants("berries");
      assert.ok(berriesVariants.includes("berry"));
      assert.ok(berriesVariants.includes("berries"));

      const boxesVariants = getWordVariants("boxes");
      assert.ok(boxesVariants.includes("box"));

      const catsVariants = getWordVariants("cats");
      assert.ok(catsVariants.includes("cat"));

      const walkedVariants = getWordVariants("walked");
      assert.ok(walkedVariants.includes("walk"));

      const runningVariants = getWordVariants("running");
      assert.ok(runningVariants.includes("runn"));

      const quicklyVariants = getWordVariants("quickly");
      assert.ok(quicklyVariants.includes("quick"));
    });

    it("handles short words, boundary cases and bad inputs safely", () => {
      assert.deepEqual(getWordVariants(""), []);
      assert.deepEqual(getWordVariants(null), []);
      assert.deepEqual(getWordVariants(undefined), []);
      assert.deepEqual(getWordVariants(123), []);

      // Short words should not be mangled
      const isVariants = getWordVariants("is");
      assert.deepEqual(isVariants, ["is"]);

      const asVariants = getWordVariants("as");
      assert.deepEqual(asVariants, ["as"]);
    });
  });

  describe("splitTextIntoSentences", () => {
    it("splits standard text on sentence boundaries", () => {
      const text = "Science is the common language. It bridges gaps across nations! Can we unite?";
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 3);
      assert.equal(res[0], "Science is the common language.");
      assert.equal(res[1], "It bridges gaps across nations!");
      assert.equal(res[2], "Can we unite?");
    });

    it("protects abbreviations and numbers with decimal points", () => {
      const text = "Dr. Smith met with Mr. Brown in the U.S. to discuss 18.5 degrees Celsius. It was very cold!";
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 2);
      assert.equal(res[0], "Dr. Smith met with Mr. Brown in the U.S. to discuss 18.5 degrees Celsius.");
      assert.equal(res[1], "It was very cold!");
    });

    it("splits Nature Club user passage accurately into distinct sentences", () => {
      const p1 = "Hi everyone. It's good to see such a big turnout at our Nature Club session for June. Just before we start this evening's workshop, I'd like to draw your attention to what we have in store for you in the second half of the year.";
      const res1 = splitTextIntoSentences(p1);
      assert.equal(res1.length, 3);
      assert.equal(res1[0], "Hi everyone.");
      assert.equal(res1[1], "It's good to see such a big turnout at our Nature Club session for June.");
      assert.equal(res1[2], "Just before we start this evening's workshop, I'd like to draw your attention to what we have in store for you in the second half of the year.");

      const p2 = "First of all, the guided bushwalk - this is always a favourite - starting out on the Springvale plateau and continuing down into a section of the state conservation area. Last year, we invited children aged 8 and over if they came with a parent, but the track has been washed out in a few places since then and it can be quite rough, so this year we considered restricting it to adults only however, on reconsideration, the committee has now decided to recommend it for [Q1] all bushwalkers who are over the age of 12.";
      const res2 = splitTextIntoSentences(p2);
      assert.equal(res2.length, 2);
      assert.equal(res2[0], "First of all, the guided bushwalk - this is always a favourite - starting out on the Springvale plateau and continuing down into a section of the state conservation area.");
      assert.ok(res2[1].includes("[Q1]"));

      const p3 = "Another very popular option is the bird observation walk. We'll be searching for both migratory and native birds as we walk through tidal marshlands and mangroves and you can expect to get your feet uncomfortably wet and muddy if you don't wear [Q2] rubber boots - these are a must. The leader will have a strong pair of binoculars, so we'll rely on her to name the species for us ... and we've ordered some bird identification books that you may wish to purchase at a later date.";
      const res3 = splitTextIntoSentences(p3);
      assert.equal(res3.length, 3);
      assert.equal(res3[0], "Another very popular option is the bird observation walk.");
      assert.ok(res3[1].includes("[Q2]"));
      assert.ok(res3[2].includes("us ... and"));
    });

    it("splits sentences even when joined without spaces after punctuation", () => {
      const glued = "Walk completed.We'll continue our journey tomorrow.Are you ready?";
      const res = splitTextIntoSentences(glued);
      assert.equal(res.length, 3);
      assert.equal(res[0], "Walk completed.");
      assert.equal(res[1], "We'll continue our journey tomorrow.");
      assert.equal(res[2], "Are you ready?");
    });

    it("protects mid-sentence ellipses from breaking into separate sentences", () => {
      const ellipsisText = "We waited for hours ... and nothing happened. But later, everything changed.";
      const res = splitTextIntoSentences(ellipsisText);
      assert.equal(res.length, 2);
      assert.equal(res[0], "We waited for hours ... and nothing happened.");
      assert.equal(res[1], "But later, everything changed.");
    });

    it("handles quotes and closing brackets at sentence ends", () => {
      const text = 'He yelled, "Stop right now!" Then he turned around (quietly). We followed.';
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 3);
      assert.equal(res[0], 'He yelled, "Stop right now!"');
      assert.equal(res[1], "Then he turned around (quietly).");
      assert.equal(res[2], "We followed.");
    });

    it("splits on various punctuation marks (?, !, ?!, !!, ??)", () => {
      const text = "Where are we going? To the park! Are you ready? Yes! Really?! Absolutely!!";
      const res = splitTextIntoSentences(text);
      assert.deepEqual(res, [
        "Where are we going?",
        "To the park!",
        "Are you ready?",
        "Yes!",
        "Really?!",
        "Absolutely!!"
      ]);
    });

    it("protects times and decimals while splitting terminal abbreviations", () => {
      const text = "The train departs at 7.30 a.m. and arrives at 9.45 p.m. Don't be late.";
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 2);
      assert.equal(res[0], "The train departs at 7.30 a.m. and arrives at 9.45 p.m.");
      assert.equal(res[1], "Don't be late.");

      const usText = "He lives in the U.S. He works hard.";
      const usRes = splitTextIntoSentences(usText);
      assert.equal(usRes.length, 2);
      assert.equal(usRes[0], "He lives in the U.S.");
      assert.equal(usRes[1], "He works hard.");
    });

    it("keeps direct speech dialogue attributions together with quotes", () => {
      const text = 'He asked, "Are you sure?" "Yes!" she replied. Then they left.';
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 3);
      assert.equal(res[0], 'He asked, "Are you sure?"');
      assert.equal(res[1], '"Yes!" she replied.');
      assert.equal(res[2], "Then they left.");
    });

    it("splits sentences across newlines and multiple whitespace runs", () => {
      const text = "First line.\nSecond line?\r\nThird line!\n\nFourth line.";
      const res = splitTextIntoSentences(text);
      assert.deepEqual(res, [
        "First line.",
        "Second line?",
        "Third line!",
        "Fourth line."
      ]);

      const spaces = "Sentence one.    Sentence two?   Sentence three!  Sentence four.";
      const resSpaces = splitTextIntoSentences(spaces);
      assert.deepEqual(resSpaces, [
        "Sentence one.",
        "Sentence two?",
        "Sentence three!",
        "Sentence four."
      ]);
    });

    it("protects names with middle initials and titles", () => {
      const text = "George W. Bush and J. K. Rowling visited Washington D.C. yesterday.";
      const res = splitTextIntoSentences(text);
      assert.equal(res.length, 1);
      assert.equal(res[0], "George W. Bush and J. K. Rowling visited Washington D.C. yesterday.");
    });

    it("splits Vietnamese text with standard punctuation correctly", () => {
      const vn = "Xin chào các bạn. Hôm nay chúng ta học tiếng Anh! Bạn đã sẵn sàng chưa? Bắt đầu thôi.";
      const res = splitTextIntoSentences(vn);
      assert.deepEqual(res, [
        "Xin chào các bạn.",
        "Hôm nay chúng ta học tiếng Anh!",
        "Bạn đã sẵn sàng chưa?",
        "Bắt đầu thôi."
      ]);
    });

    it("handles empty, whitespace, and single-sentence inputs", () => {
      assert.deepEqual(splitTextIntoSentences(""), []);
      assert.deepEqual(splitTextIntoSentences("   "), []);
      assert.deepEqual(splitTextIntoSentences(null), []);
      assert.deepEqual(splitTextIntoSentences(undefined), []);

      const single = "This is a single sentence without terminal dot";
      assert.deepEqual(splitTextIntoSentences(single), [single]);
    });
  });

  describe("groupBlockIntoSentences", () => {
    class MockNode {
      constructor(type, name, val = "") {
        this.nodeType = type;
        this.nodeName = name;
        this.nodeValue = val;
        this.childNodes = [];
        this.attributes = {};
        this.className = "";
      }
      appendChild(child) {
        this.childNodes.push(child);
        return child;
      }
      setAttribute(name, val) {
        this.attributes[name] = val;
      }
      getAttribute(name) {
        return this.attributes[name];
      }
      get textContent() {
        if (this.nodeType === 3) return this.nodeValue;
        return this.childNodes.map((c) => c.textContent).join("");
      }
      set innerHTML(val) {
        this.childNodes = [];
      }
    }

    const mockDoc = {
      createElement: (tag) => new MockNode(1, tag.toUpperCase()),
      createTextNode: (txt) => new MockNode(3, "#text", txt),
    };

    globalThis.Node = { TEXT_NODE: 3, ELEMENT_NODE: 1 };

    it("groups multi-sentence paragraph into distinct spans with accurate data-s-idx", () => {
      const p = new MockNode(1, "P");
      p.appendChild(new MockNode(3, "#text", "Hi everyone. It's good to see you. Let's start!"));

      const sentences = [];
      let idx = 0;
      groupBlockIntoSentences(
        p,
        () => idx++,
        (i, t) => sentences.push({ i, t }),
        mockDoc
      );

      assert.equal(sentences.length, 3);
      assert.equal(sentences[0].t, "Hi everyone.");
      assert.equal(sentences[1].t, "It's good to see you.");
      assert.equal(sentences[2].t, "Let's start!");
      assert.equal(p.childNodes.length, 3);
      assert.equal(p.childNodes[0].getAttribute("data-s-idx"), "0");
      assert.equal(p.childNodes[1].getAttribute("data-s-idx"), "1");
      assert.equal(p.childNodes[2].getAttribute("data-s-idx"), "2");
    });

    it("handles single-sentence paragraphs cleanly", () => {
      const p = new MockNode(1, "P");
      p.appendChild(new MockNode(3, "#text", "Only one sentence here."));

      const sentences = [];
      let idx = 0;
      groupBlockIntoSentences(
        p,
        () => idx++,
        (i, t) => sentences.push({ i, t }),
        mockDoc
      );

      assert.equal(sentences.length, 1);
      assert.equal(sentences[0].t, "Only one sentence here.");
      assert.equal(p.childNodes.length, 1);
      assert.equal(p.childNodes[0].getAttribute("data-s-idx"), "0");
    });

    it("handles paragraphs with inline tags and exam question brackets", () => {
      const p = new MockNode(1, "P");
      p.appendChild(new MockNode(3, "#text", "First sentence. Second sentence with "));
      const strong = new MockNode(1, "STRONG");
      strong.appendChild(new MockNode(3, "#text", "[Q1] bold text."));
      p.appendChild(strong);

      const sentences = [];
      let idx = 0;
      groupBlockIntoSentences(
        p,
        () => idx++,
        (i, t) => sentences.push({ i, t }),
        mockDoc
      );

      assert.equal(sentences.length, 2);
      assert.equal(sentences[0].t, "First sentence.");
      assert.ok(sentences[1].t.includes("[Q1]"));
    });

    it("does not create empty reader-sentence ghost spans for trailing whitespace", () => {
      const p = new MockNode(1, "P");
      p.appendChild(new MockNode(3, "#text", "Sentence one. Sentence two. "));

      const sentences = [];
      let idx = 0;
      groupBlockIntoSentences(
        p,
        () => idx++,
        (i, t) => sentences.push({ i, t }),
        mockDoc
      );

      assert.equal(sentences.length, 2);
      assert.equal(sentences[0].t, "Sentence one.");
      assert.equal(sentences[1].t, "Sentence two.");
      const spanNodes = p.childNodes.filter(
        (c) => c.className === "reader-sentence"
      );
      assert.equal(spanNodes.length, 2);
      for (const span of spanNodes) {
        assert.ok(span.textContent.trim().length > 0);
      }
    });

    it("handles null or empty blocks safely without throwing", () => {
      assert.doesNotThrow(() => groupBlockIntoSentences(null, () => 0, () => {}, mockDoc));
      const emptyP = new MockNode(1, "P");
      assert.doesNotThrow(() => groupBlockIntoSentences(emptyP, () => 0, () => {}, mockDoc));
    });
  });

  describe("sanitizePastedHtml", () => {
    it("strips script tags and handles empty or non-string inputs", () => {
      assert.equal(sanitizePastedHtml(""), "");
      assert.equal(sanitizePastedHtml(null), "");
      assert.equal(sanitizePastedHtml(undefined), "");

      const dirty = "<p>Hello world</p><script>alert('xss')</script>";
      const clean = sanitizePastedHtml(dirty);
      assert.ok(!clean.includes("<script>"));
      assert.ok(clean.includes("<p>Hello world</p>"));
    });
  });

  describe("isSilentOrDivider", () => {
    it("identifies decorative underline dividers and symbols correctly", () => {
      assert.equal(isSilentOrDivider("____________________"), true);
      assert.equal(isSilentOrDivider("＿＿＿＿＿＿＿＿＿＿"), true);
      assert.equal(isSilentOrDivider("--------------------"), true);
      assert.equal(isSilentOrDivider("––––––––––––––––––––"), true);
      assert.equal(isSilentOrDivider("──────────"), true);
      assert.equal(isSilentOrDivider("***"), true);
      assert.equal(isSilentOrDivider("   "), true);
      assert.equal(isSilentOrDivider(""), true);
      assert.equal(isSilentOrDivider(null), true);
      assert.equal(isSilentOrDivider(undefined), true);
    });

    it("returns false for genuine sentences and words", () => {
      assert.equal(isSilentOrDivider("Hi everyone."), false);
      assert.equal(isSilentOrDivider("[Q1] All bushwalkers"), false);
      assert.equal(isSilentOrDivider("Hello world"), false);
      assert.equal(isSilentOrDivider("Fill in [Q1] ________ with the word."), false);
    });
  });

  describe("cleanSpeechText", () => {
    it("strips underscores and cleans repeated divider symbols", () => {
      assert.equal(cleanSpeechText("____________________"), "");
      assert.equal(cleanSpeechText("＿＿＿＿＿＿＿＿＿＿"), "");
      assert.equal(cleanSpeechText("--------------------"), "");
      assert.equal(cleanSpeechText("––––––––––––––––––––"), "");
      assert.equal(cleanSpeechText("Hello ___ world"), "Hello world");
      assert.equal(cleanSpeechText("Hello _ world"), "Hello world");
      assert.equal(cleanSpeechText("*** Welcome ***"), "Welcome");
      assert.equal(
        cleanSpeechText("all bushwalkers who are over 12. ____________________"),
        "all bushwalkers who are over 12."
      );
    });

    it("normalizes question markers and blanks for natural TTS pronunciation", () => {
      assert.equal(
        cleanSpeechText("recommend it for [Q1] all bushwalkers"),
        "recommend it for Q1 all bushwalkers"
      );
      assert.equal(
        cleanSpeechText("Fill in [Q1] ________ with the correct word."),
        "Fill in Q1 with the correct word."
      );
      assert.equal(
        cleanSpeechText("wear (Q2) rubber boots"),
        "wear Q2 rubber boots"
      );
    });

    it("handles empty or non-string inputs safely", () => {
      assert.equal(cleanSpeechText(""), "");
      assert.equal(cleanSpeechText(null), "");
      assert.equal(cleanSpeechText(undefined), "");
      assert.equal(cleanSpeechText(12345), "");
    });
  });
});
