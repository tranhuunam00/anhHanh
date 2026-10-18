import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  RotateCcw,
} from "../Icons";
import { validatePageNumber } from "../../utils/pdfReaderUtils";

/**
 * PDF Page Navigation Controller for Reading Mode
 * Features:
 * - Next Page / Previous Page buttons
 * - Interactive direct page jump input
 * - Current PDF file title & progress
 */
export function PdfPageNavigation({
  pdfFileName = "",
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  onNextPage,
  onPrevPage,
  onGoToPage,
  onSwitchPdf,
}) {
  const [prevCurrentPage, setPrevCurrentPage] = useState(currentPage);
  const [pageInput, setPageInput] = useState(currentPage);

  if (currentPage !== prevCurrentPage) {
    setPrevCurrentPage(currentPage);
    setPageInput(currentPage);
  }

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setPageInput("");
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setPageInput(num);
    }
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const valid = validatePageNumber(pageInput, totalPages);
    setPageInput(valid);
    if (valid !== currentPage && onGoToPage) {
      onGoToPage(valid);
    }
  };

  return (
    <div className="pdf-page-navigation-bar">
      <div className="pdf-nav-left">
        <div className="pdf-nav-file-pill" title={pdfFileName}>
          <FileText size={15} color="#ef4444" />
          <span className="pdf-nav-name">{pdfFileName || "Tài liệu PDF"}</span>
        </div>

        {onSwitchPdf && (
          <button
            type="button"
            className="pdf-nav-switch-btn"
            onClick={onSwitchPdf}
            title="Đổi sang tài liệu khác"
          >
            <RotateCcw size={12} />
            <span>Đổi tài liệu</span>
          </button>
        )}
      </div>

      <div className="pdf-nav-center">
        {/* Previous page button */}
        <button
          type="button"
          className="btn btn-secondary pdf-nav-btn"
          onClick={onPrevPage}
          disabled={currentPage <= 1 || isLoading}
          title="Trang trước (←)"
        >
          <ChevronLeft size={16} />
          <span>Trước</span>
        </button>

        {/* Jump-to-page form */}
        <form onSubmit={handleJumpSubmit} className="pdf-nav-jump-form">
          <span className="pdf-nav-label">Trang</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={handleInputChange}
            disabled={isLoading}
            className="pdf-nav-jump-input"
            title="Nhập số trang và nhấn Enter để chuyển đến"
          />
          <span className="pdf-nav-total">/ {totalPages}</span>

          {pageInput !== currentPage && pageInput !== "" && (
            <button
              type="submit"
              className="pdf-nav-jump-submit-btn"
              disabled={isLoading}
              title="Đến trang này"
            >
              Đến
            </button>
          )}
        </form>

        {/* Next page button */}
        <button
          type="button"
          className="btn btn-secondary pdf-nav-btn"
          onClick={onNextPage}
          disabled={currentPage >= totalPages || isLoading}
          title="Trang sau (→)"
        >
          <span>Sau</span>
          <ChevronRight size={16} />
        </button>

        {isLoading && (
          <div className="pdf-nav-loading-indicator">
            <Loader2 size={15} className="spinning" color="var(--primary, #6366f1)" />
            <span>Đang tải...</span>
          </div>
        )}
      </div>
    </div>
  );
}
