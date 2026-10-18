import React from "react";
import { ChevronLeft, ChevronRight } from "../Icons";

/**
 * Pagination bar component for Vocabulary Notebook
 */
export const VocabPagination = ({
  totalItems = 0,
  currentPage = 1,
  pageSize = 18,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const startIdx = pageSize === "ALL" ? 1 : (currentPage - 1) * pageSize + 1;
  const endIdx = pageSize === "ALL" ? totalItems : Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="vocab-pagination-bar">
      <div className="vocab-pagination-info">
        Hiển thị <strong>{startIdx}</strong> - <strong>{endIdx}</strong> trên tổng số{" "}
        <strong>{totalItems}</strong> từ
      </div>

      {pageSize !== "ALL" && totalPages > 1 && (
        <div className="vocab-pagination-controls">
          <button
            type="button"
            className="vocab-page-btn nav-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Trang trước"
          >
            <ChevronLeft size={16} />
            <span>Trước</span>
          </button>

          <div className="vocab-page-numbers">
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span key={`dots-${idx}`} className="vocab-page-dots">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`vocab-page-btn ${currentPage === p ? "active" : ""}`}
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            type="button"
            className="vocab-page-btn nav-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Trang sau"
          >
            <span>Sau</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Page Size Selector */}
      <div className="vocab-page-size-selector">
        <span>Hiển thị:</span>
        <select
          value={pageSize}
          onChange={(e) => {
            const val = e.target.value === "ALL" ? "ALL" : Number(e.target.value);
            onPageSizeChange(val);
          }}
        >
          <option value={18}>18 từ / trang</option>
          <option value={36}>36 từ / trang</option>
          <option value={72}>72 từ / trang</option>
          <option value="ALL">Tất cả ({totalItems})</option>
        </select>
      </div>
    </div>
  );
};
