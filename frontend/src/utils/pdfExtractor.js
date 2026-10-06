import * as pdfjsLib from "pdfjs-dist";

// Configure worker using CDN or local worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

/**
 * Get total number of pages in a PDF file
 * @param {File} file
 * @returns {Promise<number>}
 */
export const getPdfPageCount = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    return pdf.numPages;
  } catch (err) {
    console.warn("Could not read PDF page count on client:", err);
    return null;
  }
};

/**
 * Extract text from specific page range in PDF directly on client browser
 * @param {File} file
 * @param {number} startPage 1-indexed
 * @param {number} endPage 1-indexed
 * @returns {Promise<{ text: string, totalPages: number, pageCount: number, wordCount: number }>}
 */
export const extractPdfTextClient = async (file, startPage = 1, endPage = null) => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;

  const s = Math.max(1, startPage || 1);
  const e = Math.min(totalPages, endPage || totalPages);

  const pagesText = [];
  for (let pageNum = s; pageNum <= e; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageString = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    if (pageString.trim()) {
      pagesText.push(pageString.trim());
    }
  }

  const combinedText = pagesText.join("\n\n");
  const words = combinedText.trim().split(/\s+/).filter(Boolean);

  return {
    text: combinedText,
    totalPages,
    selectedPagesCount: e - s + 1,
    startPage: s,
    endPage: e,
    wordCount: words.length,
  };
};
