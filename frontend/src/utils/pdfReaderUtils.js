/**
 * PDF Smart Reader Utility Functions
 * Pure client-side PDF text extraction and paragraph structuring
 */

/**
 * Validates and clamps requested page number within [1, totalPages]
 * @param {number|string} page Requested page number
 * @param {number} totalPages Total pages in PDF
 * @returns {number} Clamped valid page number
 */
export function validatePageNumber(page, totalPages = 1) {
  const num = parseInt(page, 10);
  const max = Math.max(1, parseInt(totalPages, 10) || 1);
  if (isNaN(num) || num < 1) return 1;
  if (num > max) return max;
  return num;
}

/**
 * Cleans PDF text anomalies such as hyphenated line-breaks and excessive spaces
 * @param {string} rawText
 * @returns {string}
 */
export function cleanPdfText(rawText) {
  if (!rawText || typeof rawText !== "string") return "";

  let text = rawText;
  // Remove soft hyphens and normalize hyphenated word breaks at line ends (e.g. "com- \n puter" -> "computer")
  text = text.replace(/(\w+)[-\u00ad]\s*\r?\n\s*(\w+)/g, "$1$2");
  // Normalize carriage returns
  text = text.replace(/\r\n/g, "\n");
  // Normalize multiple spaces within a line
  text = text.replace(/[ \t]+/g, " ");

  return text.trim();
}

/**
 * Converts cleaned PDF page text into structured HTML paragraphs (<p>)
 * compatible with Smart Reader sentence splitting and vocab highlighting
 * @param {string} rawText
 * @param {number|null} pageNumber
 * @param {number|null} totalPages
 * @returns {string} HTML string
 */
export function formatPdfPageToHtml(rawText, pageNumber = null, totalPages = null) {
  const cleaned = cleanPdfText(rawText);
  if (!cleaned) {
    const pageLabel = pageNumber ? `Trang ${pageNumber}${totalPages ? ` / ${totalPages}` : ""}` : "Trang";
    return `<p><em>(${pageLabel} không có văn bản hoặc chỉ chứa hình ảnh quét)</em></p>`;
  }

  // Split into paragraphs by two or more newlines, or lines ending with period
  const rawParagraphs = cleaned.split(/\n\s*\n+/);

  const paragraphsHtml = rawParagraphs
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      // Replace single newlines within paragraph with spaces to preserve flow
      const unifiedLine = p.replace(/\n+/g, " ");
      return `<p>${unifiedLine}</p>`;
    })
    .join("\n");

  return paragraphsHtml || `<p>${cleaned}</p>`;
}

/**
 * Formats file size in readable units (KB, MB)
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes <= 0 || isNaN(bytes)) return "0 KB";
  const k = 1024;
  if (bytes < k) return `${bytes} B`;
  if (bytes < k * k) return `${(bytes / k).toFixed(1)} KB`;
  return `${(bytes / (k * k)).toFixed(1)} MB`;
}
