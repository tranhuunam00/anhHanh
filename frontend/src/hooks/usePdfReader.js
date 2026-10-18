import { useState, useCallback, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import {
  validatePageNumber,
  formatPdfPageToHtml,
} from "../utils/pdfReaderUtils";

// Ensure worker is configured on client
if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

/**
 * Extracts raw text with end-of-line markers from a specific PDF page
 * @param {object} pdfDoc PDFDocumentProxy from pdfjs
 * @param {number} pageNum 1-indexed page number
 * @returns {Promise<string>}
 */
async function extractPageText(pdfDoc, pageNum) {
  const page = await pdfDoc.getPage(pageNum);
  const textContent = await page.getTextContent();
  const pieces = [];

  for (let i = 0; i < textContent.items.length; i++) {
    const item = textContent.items[i];
    if ("str" in item) {
      pieces.push(item.str);
      if (item.hasEOL) {
        pieces.push("\n");
      } else {
        pieces.push(" ");
      }
    }
  }

  return pieces.join("");
}

/**
 * Hook for managing PDF document state, page navigation, and text extraction
 */
export function usePdfReader({ onPageLoaded = null, onError = null } = {}) {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(null);

  const pdfDocRef = useRef(null);

  /**
   * Load PDF File and extract chosen initial page
   */
  const loadPdfFile = useCallback(
    async (file, targetPage = 1) => {
      if (!file) return null;
      setIsLoadingPdf(true);
      setPdfError(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        pdfDocRef.current = pdf;
        const total = pdf.numPages;
        const validPage = validatePageNumber(targetPage, total);

        setPdfFile(file);
        setPdfFileName(file.name);
        setTotalPages(total);
        setCurrentPage(validPage);

        const rawText = await extractPageText(pdf, validPage);
        const html = formatPdfPageToHtml(rawText, validPage, total);

        if (onPageLoaded) {
          onPageLoaded({
            html,
            rawText,
            pageNumber: validPage,
            totalPages: total,
            fileName: file.name,
          });
        }

        return { html, totalPages: total, pageNumber: validPage };
      } catch (err) {
        console.error("Failed to load PDF:", err);
        const msg = err.message || "Không thể đọc tệp PDF. Tệp có thể bị mã hóa hoặc lỗi định dạng.";
        setPdfError(msg);
        if (onError) onError(msg);
        return null;
      } finally {
        setIsLoadingPdf(false);
      }
    },
    [onPageLoaded, onError]
  );

  /**
   * Navigate to a specific page number
   */
  const goToPage = useCallback(
    async (targetPage) => {
      const pdf = pdfDocRef.current;
      if (!pdf) return null;

      const validPage = validatePageNumber(targetPage, totalPages);
      setIsLoadingPdf(true);
      setPdfError(null);

      try {
        const rawText = await extractPageText(pdf, validPage);
        const html = formatPdfPageToHtml(rawText, validPage, totalPages);
        setCurrentPage(validPage);

        if (onPageLoaded) {
          onPageLoaded({
            html,
            rawText,
            pageNumber: validPage,
            totalPages,
            fileName: pdfFileName,
          });
        }

        return { html, pageNumber: validPage };
      } catch (err) {
        console.error("Failed to navigate PDF page:", err);
        const msg = "Không thể tải trang PDF này.";
        setPdfError(msg);
        if (onError) onError(msg);
        return null;
      } finally {
        setIsLoadingPdf(false);
      }
    },
    [totalPages, pdfFileName, onPageLoaded, onError]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      return goToPage(currentPage + 1);
    }
    return Promise.resolve(null);
  }, [currentPage, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      return goToPage(currentPage - 1);
    }
    return Promise.resolve(null);
  }, [currentPage, goToPage]);

  const closePdf = useCallback(() => {
    pdfDocRef.current = null;
    setPdfFile(null);
    setPdfFileName("");
    setTotalPages(0);
    setCurrentPage(1);
    setIsLoadingPdf(false);
    setPdfError(null);
  }, []);

  return {
    isPdfActive: Boolean(pdfFile),
    pdfFile,
    pdfFileName,
    totalPages,
    currentPage,
    isLoadingPdf,
    pdfError,
    loadPdfFile,
    goToPage,
    nextPage,
    prevPage,
    closePdf,
  };
}
