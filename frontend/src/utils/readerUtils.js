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
 * Split text into readable sentence segments protecting abbreviations and decimals
 * @param {string} text
 * @returns {string[]}
 */
export function splitTextIntoSentences(text) {
  if (!text || typeof text !== "string") return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Protect common abbreviations and titles from premature splitting
  const protectedText = trimmed
    .replace(
      /\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|Inc|Ltd|Co|Corp|U\.S|U\.K|e\.g|i\.e|vs|etc|No|St|Dept|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\./gi,
      (m) => m.replace(/\./g, "\uE000")
    )
    .replace(/(\d+)\.(\d+)/g, "$1\uE000$2");

  // Split on sentence boundaries: punctuation (. ! ?) followed by whitespace and a start char
  const rawParts = protectedText.split(/(?<=[.?!])\s+(?=[A-Z0-9"“'‘(])/);

  const sentences = [];
  for (const part of rawParts) {
    const restored = part.replace(/\uE000/g, ".").trim();
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
    while (block.firstChild) {
      span.appendChild(block.firstChild);
    }
    block.appendChild(span);
    addSentence(sIdx, sentenceStrings[0]);
    return;
  }

  // Multiple sentences: split child nodes into sentence spans
  const originalChildren = Array.from(block.childNodes);
  block.innerHTML = "";

  let sIdx = getNextIndex();
  let currentSpan = doc.createElement("span");
  currentSpan.className = "reader-sentence";
  currentSpan.setAttribute("data-s-idx", String(sIdx));

  let currentSentenceIdx = 0;

  originalChildren.forEach((child) => {
    if (child.nodeType !== Node.TEXT_NODE) {
      currentSpan.appendChild(child);
      return;
    }

    let remainingText = child.nodeValue;
    while (remainingText.length > 0 && currentSentenceIdx < sentenceStrings.length - 1) {
      const match = remainingText.match(/([.?!]+(?:\s+|$))/);
      if (match && match.index !== undefined) {
        const cutIdx = match.index + match[0].length;
        const partBefore = remainingText.slice(0, cutIdx);
        remainingText = remainingText.slice(cutIdx);

        if (partBefore) {
          currentSpan.appendChild(doc.createTextNode(partBefore));
        }

        block.appendChild(currentSpan);
        addSentence(sIdx, sentenceStrings[currentSentenceIdx]);

        currentSentenceIdx++;
        sIdx = getNextIndex();
        currentSpan = doc.createElement("span");
        currentSpan.className = "reader-sentence";
        currentSpan.setAttribute("data-s-idx", String(sIdx));
      } else {
        break;
      }
    }

    if (remainingText.length > 0) {
      currentSpan.appendChild(doc.createTextNode(remainingText));
    }
  });

  if (currentSpan.childNodes.length > 0) {
    block.appendChild(currentSpan);
    addSentence(sIdx, sentenceStrings[currentSentenceIdx] || currentSpan.textContent.trim());
  }
}
