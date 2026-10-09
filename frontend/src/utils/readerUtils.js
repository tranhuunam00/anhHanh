// Smart Reader Utility Functions
// Modular extraction per Rule 4 and Rule 6

export const SAMPLE_ARTICLE = `
<h1>Cold snap triggers heavy rain, temperatures to plunge below 18°C</h1>
<p><strong>The cold air mass reached the northeastern region</strong>, the northern province of Thanh Hóa and parts of the northwest on Monday morning, pushing temperatures at 7am to 21-24 degrees Celsius.</p>

<img src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=900&auto=format&fit=crop&q=80" alt="Hanoians wear long-sleeved shirts and raincoats to keep warm during a cold day" />
<p style="font-size:0.88rem; color:#64748b; text-align:center; margin-top:-8px; font-style:italic;">Hanoians wear long-sleeved shirts and raincoats to keep warm during a cold day. — Photo VNA</p>

<h2>Heavy Rain and Temperature Drops</h2>
<p>HÀ NỘI — A strengthening cold air mass is bringing heavy to torrential rain and thunderstorms across the northern and central regions, with temperatures forecast to fall to as low as 14-17 degrees Celsius in high mountainous areas and rainfall of more than 200mm possible in parts of the central region.</p>

<p>The cold air mass reached the northeastern region, the northern province of Thanh Hóa and parts of the northwest on Monday morning, pushing temperatures at 7am to 21-24 degrees Celsius.</p>

<p>The meteorological agency advised local residents to stay alert against potential flash floods, landslides, and high winds during the extreme weather interval.</p>
`;

/**
 * Clean & sanitize pasted HTML safely using DOMParser
 * @param {string} rawHtml
 * @returns {string}
 */
export function sanitizePastedHtml(rawHtml) {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  if (typeof window === "undefined" || !window.DOMParser) {
    return rawHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // Remove unsafe or noisy tags
    const unsafeTags = doc.querySelectorAll("script, style, iframe, object, embed, form, input, button, textarea, meta, link");
    unsafeTags.forEach((el) => el.remove());

    // Handle lazy loaded images from news sites (data-src, data-original, srcset)
    const imgs = doc.querySelectorAll("img");
    imgs.forEach((img) => {
      const realSrc =
        img.getAttribute("data-src") ||
        img.getAttribute("data-original") ||
        img.getAttribute("data-lazy-src") ||
        img.getAttribute("src");
      if (realSrc) {
        img.setAttribute("src", realSrc);
      }
    });

    // Clean inline attributes except safe ones
    const allEls = doc.body.querySelectorAll("*");
    allEls.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on")) {
          el.removeAttribute(attr.name);
        }
      });

      if (el.hasAttribute("style")) {
        el.style.removeProperty("font-size");
        el.style.removeProperty("font-family");
        el.style.removeProperty("line-height");
        if (!el.getAttribute("style") || !el.getAttribute("style").trim()) {
          el.removeAttribute("style");
        }
      }

      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });

    return doc.body.innerHTML || "";
  } catch (err) {
    console.error("Sanitizing HTML error:", err);
    return rawHtml;
  }
}

/**
 * Extract base lemmas / inflection stems for smart vocabulary matching
 * @param {string} word
 * @returns {string[]}
 */
export function getWordVariants(word) {
  if (!word || typeof word !== "string") return [];
  const w = word.toLowerCase().trim();
  if (!w) return [];
  const variants = [w];

  if (w.endsWith("ies") && w.length > 4) variants.push(w.slice(0, -3) + "y");
  if (w.endsWith("es") && w.length > 4) variants.push(w.slice(0, -2));
  if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) variants.push(w.slice(0, -1));
  if (w.endsWith("ed") && w.length > 4) {
    variants.push(w.slice(0, -1));
    variants.push(w.slice(0, -2));
  }
  if (w.endsWith("ing") && w.length > 5) {
    variants.push(w.slice(0, -3));
    variants.push(w.slice(0, -3) + "e");
  }
  if (w.endsWith("ly") && w.length > 4) variants.push(w.slice(0, -2));

  return variants;
}

/**
 * Split text into readable sentence segments protecting abbreviations, decimals, and ellipses
 * @param {string} text
 * @returns {string[]}
 */
export function splitTextIntoSentences(text) {
  if (!text || typeof text !== "string") return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // 1. Normalize whitespace, non-breaking spaces, and newlines
  let normalized = trimmed
    .replace(/\u00A0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // 2. Protect ellipses (3+ dots, unicode …, or spaced dots . . .)
  const ELLIPSIS_TOKEN = "\uE001";
  normalized = normalized.replace(/(\.{3,}|…|\.\s*\.\s*\.)/g, ELLIPSIS_TOKEN);

  // 3. Protect titles, abbreviations, corporate names, dates, Latin terms
  const ABBR_TOKEN = "\uE000";

  // Titles always followed by name: protect dot
  normalized = normalized.replace(
    /\b(Mr|Mrs|Ms|Miss|Dr|Prof|Sr|Jr|Pres|Gen|Col|Capt|Lt|Sgt|Rep|Sen|St|Ave|Rd|Blvd|No|Nos)\./gi,
    (m) => m.replace(/\./g, ABBR_TOKEN)
  );

  // Abbreviations like U.S., U.K., a.m., p.m., e.g., i.e.
  // Protect internal dots always (e.g. U. in U.S., a. in a.m.)
  normalized = normalized.replace(/\b([A-Za-z])\.([A-Za-z])\./g, (m, c1, c2) => {
    return c1 + ABBR_TOKEN + c2 + ".";
  });

  // If abbreviation's trailing dot is followed by lowercase, protect it
  normalized = normalized.replace(
    new RegExp(ABBR_TOKEN + "([A-Za-z])\\.\\s+(?=[a-z])", "g"),
    ABBR_TOKEN + "$1" + ABBR_TOKEN + " "
  );

  // Protect other abbreviations like vs., etc., approx., when followed by lowercase
  normalized = normalized.replace(
    /\b(Inc|Ltd|Co|Corp|Dept|Univ|Gov|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec|vs|vol|approx|est|min|max|sec|hr|fig|eq|ed|al|cf|etc)\.\s+(?=[a-z])/gi,
    (m) => m.replace(/\./g, ABBR_TOKEN)
  );

  // Protect single middle initials (e.g. George W. Bush, J. K. Rowling) preceded by space/start
  normalized = normalized.replace(/(?<=\s|^)([A-Z])\.\s+(?=[A-Z])/g, `$1${ABBR_TOKEN} `);

  // Protect numbers with decimals (e.g. 18.5, 3.14, 4.30)
  normalized = normalized.replace(/(\d+)\.(\d+)/g, `$1${ABBR_TOKEN}$2`);

  // 4. Split on sentence boundaries:
  // 1. Punctuation (. ? !) followed by newlines
  // 2. Punctuation followed by whitespace and an uppercase letter, digit, bracket, or quote
  // 3. Glued text: punctuation directly followed by an uppercase letter
  const SPLIT_TOKEN = "\uE002";
  const markedText = normalized
    .replace(/(?<=[.?!]['"”’)\]]*)\s*\n+\s*/g, SPLIT_TOKEN)
    .replace(/(?<=[.?!]['"”’)\]]*)\s+(?=[A-Z0-9"“'‘(\[])/g, SPLIT_TOKEN)
    .replace(/(?<=[.?!]['"”’)\]]*)(?=[A-Z])/g, SPLIT_TOKEN);

  const rawParts = markedText.split(SPLIT_TOKEN);

  const sentences = [];
  for (const part of rawParts) {
    const restored = part
      .replace(new RegExp(ABBR_TOKEN, "g"), ".")
      .replace(new RegExp(ELLIPSIS_TOKEN, "g"), "...")
      .trim();
    if (restored.length > 0) {
      sentences.push(restored);
    }
  }

  return sentences.length > 0 ? sentences : [trimmed];
}

/**
 * Format duration seconds to mm:ss
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Group leaf block children into identifiable sentence spans
 * @param {HTMLElement} block
 * @param {function} getNextIndex
 * @param {function} addSentence
 * @param {Document} doc
 */
export function groupBlockIntoSentences(block, getNextIndex, addSentence, doc) {
  if (!block || !block.textContent) return;
  const fullText = block.textContent.trim();
  if (!fullText) return;

  const sentenceStrings = splitTextIntoSentences(fullText);
  if (sentenceStrings.length === 0) return;

  // Single sentence block: wrap all children directly
  if (sentenceStrings.length === 1) {
    const sIdx = getNextIndex();
    const span = doc.createElement("span");
    span.className = "reader-sentence";
    span.setAttribute("data-s-idx", String(sIdx));
    const children = Array.from(block.childNodes);
    block.innerHTML = "";
    children.forEach((child) => span.appendChild(child));
    block.appendChild(span);
    addSentence(sIdx, sentenceStrings[0]);
    return;
  }

  // Calculate non-whitespace character counts for each sentence
  const targetNonWsCounts = sentenceStrings.map(
    (s) => s.replace(/\s+/g, "").length
  );

  const originalChildren = Array.from(block.childNodes);
  block.innerHTML = "";

  let currentSentenceIdx = 0;
  let accumulatedNonWsInSentence = 0;
  let sIdx = getNextIndex();

  let currentSpan = doc.createElement("span");
  currentSpan.className = "reader-sentence";
  currentSpan.setAttribute("data-s-idx", String(sIdx));

  const finalizeCurrentSpan = () => {
    if (currentSpan.childNodes.length > 0) {
      block.appendChild(currentSpan);
      addSentence(sIdx, sentenceStrings[currentSentenceIdx]);
    }
    currentSentenceIdx++;
    if (currentSentenceIdx < sentenceStrings.length) {
      sIdx = getNextIndex();
      currentSpan = doc.createElement("span");
      currentSpan.className = "reader-sentence";
      currentSpan.setAttribute("data-s-idx", String(sIdx));
      accumulatedNonWsInSentence = 0;
    }
  };

  const processNode = (node) => {
    if (currentSentenceIdx >= sentenceStrings.length - 1) {
      currentSpan.appendChild(node);
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;
      while (text.length > 0 && currentSentenceIdx < sentenceStrings.length - 1) {
        const neededNonWs =
          targetNonWsCounts[currentSentenceIdx] - accumulatedNonWsInSentence;

        let nonWsCount = 0;
        let cutPos = text.length;

        for (let i = 0; i < text.length; i++) {
          if (!/\s/.test(text[i])) {
            nonWsCount++;
            if (nonWsCount === neededNonWs) {
              let endPos = i + 1;
              while (
                endPos < text.length &&
                /['"”’)\]\s]/.test(text[endPos]) &&
                !/\n/.test(text[endPos])
              ) {
                endPos++;
                if (text[endPos - 1] === " ") break;
              }
              cutPos = endPos;
              break;
            }
          }
        }

        if (nonWsCount >= neededNonWs) {
          const partForCurrent = text.slice(0, cutPos);
          text = text.slice(cutPos);
          if (partForCurrent.length > 0) {
            currentSpan.appendChild(doc.createTextNode(partForCurrent));
          }
          accumulatedNonWsInSentence += neededNonWs;
          finalizeCurrentSpan();
        } else {
          accumulatedNonWsInSentence += nonWsCount;
          currentSpan.appendChild(doc.createTextNode(text));
          text = "";
        }
      }

      if (text.length > 0) {
        currentSpan.appendChild(doc.createTextNode(text));
      }
    } else {
      const elText = node.textContent || "";
      const elNonWs = elText.replace(/\s+/g, "").length;
      const neededNonWs =
        targetNonWsCounts[currentSentenceIdx] - accumulatedNonWsInSentence;

      if (elNonWs < neededNonWs || currentSentenceIdx >= sentenceStrings.length - 1) {
        accumulatedNonWsInSentence += elNonWs;
        currentSpan.appendChild(node);
      } else if (elNonWs === neededNonWs) {
        accumulatedNonWsInSentence += elNonWs;
        currentSpan.appendChild(node);
        finalizeCurrentSpan();
      } else {
        if (node.childNodes && node.childNodes.length > 0) {
          const children = Array.from(node.childNodes);
          node.innerHTML = "";
          currentSpan.appendChild(node);

          children.forEach((c) => {
            if (c.nodeType === Node.TEXT_NODE) {
              let text = c.nodeValue;
              while (text.length > 0 && currentSentenceIdx < sentenceStrings.length - 1) {
                const needed =
                  targetNonWsCounts[currentSentenceIdx] - accumulatedNonWsInSentence;
                let nWs = 0;
                let cutPos = text.length;
                for (let i = 0; i < text.length; i++) {
                  if (!/\s/.test(text[i])) {
                    nWs++;
                    if (nWs === needed) {
                      cutPos = i + 1;
                      break;
                    }
                  }
                }
                if (nWs >= needed) {
                  const before = text.slice(0, cutPos);
                  text = text.slice(cutPos);
                  node.appendChild(doc.createTextNode(before));
                  accumulatedNonWsInSentence += needed;
                  finalizeCurrentSpan();
                  if (text.length > 0 || children.length > 0) {
                    const newEl = doc.createElement(node.nodeName);
                    currentSpan.appendChild(newEl);
                  }
                } else {
                  accumulatedNonWsInSentence += nWs;
                  node.appendChild(doc.createTextNode(text));
                  text = "";
                }
              }
              if (text.length > 0) {
                node.appendChild(doc.createTextNode(text));
              }
            } else {
              node.appendChild(c);
            }
          });
        } else {
          currentSpan.appendChild(node);
        }
      }
    }
  };

  originalChildren.forEach(processNode);

  if (currentSpan.childNodes.length > 0) {
    if (currentSpan.textContent.trim().length > 0) {
      block.appendChild(currentSpan);
      if (currentSentenceIdx < sentenceStrings.length) {
        addSentence(sIdx, sentenceStrings[currentSentenceIdx]);
      }
    } else {
      while (currentSpan.firstChild) {
        block.appendChild(currentSpan.firstChild);
      }
    }
  }
}

/**
 * Detect if text is purely decorative divider or blank symbols (e.g. ____________________, ----, ***)
 * @param {string} text
 * @returns {boolean}
 */
export function isSilentOrDivider(text) {
  if (!text || typeof text !== "string") return true;
  const stripped = text.replace(
    /[\s_\-–—*#=~.·•[\]()＿\uFF3F\u2013\u2014\u2015\u2500\u2501¯‾]+/g,
    ""
  );
  return stripped.length === 0;
}

/**
 * Sanitize text before speech synthesis so TTS doesn't awkwardly read "underscore underscore" or bracket codes
 * @param {string} text
 * @returns {string}
 */
export function cleanSpeechText(text) {
  if (!text || typeof text !== "string") return "";
  let clean = text;
  // Replace all underscores (ASCII and Unicode fullwidth low line, horizontal bars)
  clean = clean.replace(/[_＿\uFF3F\u2013\u2014\u2015\u2500\u2501¯‾]+/g, " ");
  // Replace repeated dashes or hyphens
  clean = clean.replace(/[-–—]{2,}/g, " ");
  // Replace repeated symbols (***, ===, ~~~)
  clean = clean.replace(/[*#=~]{2,}/g, " ");
  // Strip question labels like [Q1], [Q2], (Q1) to natural Q1 for TTS
  clean = clean.replace(/\[([Qq]\d+)\]/gi, "$1");
  clean = clean.replace(/\(([Qq]\d+)\)/gi, "$1");
  clean = clean.replace(/\s+/g, " ").trim();
  // If no spoken alphanumeric characters remain, return empty string so TTS stays completely silent
  if (!/[a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/.test(clean)) {
    return "";
  }
  return clean;
}


