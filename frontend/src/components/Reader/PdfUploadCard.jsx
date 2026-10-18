import React, { useState, useRef } from "react";
import {
  FileText,
  Upload,
  BookOpen,
  RotateCcw,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "../Icons";
import { formatFileSize, validatePageNumber } from "../../utils/pdfReaderUtils";
import { getPdfPageCount } from "../../utils/pdfExtractor";

/**
 * PDF Upload Card Component for Smart Reader
 * Allows user to upload a PDF file, inspect page count, and mandatorily select a page to read
 */
export function PdfUploadCard({ onStartReadingPdf, isLoading = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [targetPage, setTargetPage] = useState(1);
  const [isReadingPdfDoc, setIsReadingPdfDoc] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleProcessFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Vui lòng chọn đúng tệp có định dạng .pdf");
      return;
    }

    setErrorMsg("");
    setIsReadingPdfDoc(true);
    try {
      const count = await getPdfPageCount(file);
      if (!count || count < 1) {
        throw new Error("Không thể đọc số trang từ tệp PDF này.");
      }
      setSelectedFile(file);
      setTotalPages(count);
      setTargetPage(1);
    } catch (err) {
      console.error(err);
      setErrorMsg("Không thể đọc tệp PDF. Tệp có thể bị đặt mật khẩu bảo vệ hoặc bị lỗi.");
      setSelectedFile(null);
      setTotalPages(0);
    } finally {
      setIsReadingPdfDoc(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handlePageInputChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      setTargetPage("");
      return;
    }
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setTargetPage(parsed);
    }
  };

  const handlePageInputBlur = () => {
    const valid = validatePageNumber(targetPage, totalPages);
    setTargetPage(valid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Vui lòng chọn một tệp PDF.");
      return;
    }
    const finalPage = validatePageNumber(targetPage, totalPages);
    setTargetPage(finalPage);
    onStartReadingPdf(selectedFile, finalPage);
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setTotalPages(0);
    setTargetPage(1);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="pdf-upload-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* When no file is selected yet: Dropzone */}
      {!selectedFile ? (
        <div
          className={`pdf-dropzone ${isDragOver ? "drag-over" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          {isReadingPdfDoc ? (
            <div className="pdf-dropzone-loading">
              <Loader2 size={36} className="spinning" color="var(--primary, #6366f1)" />
              <p>Đang phân tích cấu trúc tệp PDF...</p>
            </div>
          ) : (
            <>
              <div className="pdf-dropzone-icon-wrap">
                <Upload size={32} color="var(--primary, #6366f1)" />
              </div>
              <h3 className="pdf-dropzone-title">Kéo & thả tệp PDF vào đây</h3>
              <p className="pdf-dropzone-desc">
                Hoặc bấm vào khung để chọn tệp từ máy tính. Trình duyệt sẽ đọc trực tiếp 100% không tốn thời gian tải lên server!
              </p>
              <button
                type="button"
                className="btn btn-primary btn-with-icon"
                style={{ marginTop: 8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FileText size={16} />
                <span>Chọn tệp PDF</span>
              </button>
            </>
          )}
        </div>
      ) : (
        /* When file is loaded: File Info + Mandatory Page Picker */
        <div className="pdf-selected-panel">
          <div className="pdf-file-info-row">
            <div className="pdf-file-icon">
              <FileText size={28} color="#ef4444" />
            </div>
            <div className="pdf-file-meta">
              <h4 className="pdf-file-name" title={selectedFile.name}>
                {selectedFile.name}
              </h4>
              <div className="pdf-file-badges">
                <span className="pdf-badge-tag">{formatFileSize(selectedFile.size)}</span>
                <span className="pdf-badge-tag highlight">{totalPages} trang</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-with-icon"
              onClick={handleResetFile}
              title="Chọn tệp PDF khác"
            >
              <RotateCcw size={14} />
              <span>Đổi tệp</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pdf-page-select-form">
            <div className="pdf-page-picker-box">
              <label htmlFor="target-page-input" className="pdf-picker-label">
                <strong>Chọn trang bạn muốn đọc (Bắt buộc):</strong>
              </label>

              <div className="pdf-picker-input-row">
                <span>Trang số</span>
                <input
                  id="target-page-input"
                  type="number"
                  min={1}
                  max={totalPages}
                  value={targetPage}
                  onChange={handlePageInputChange}
                  onBlur={handlePageInputBlur}
                  className="pdf-page-number-input"
                  required
                />
                <span className="pdf-total-pages-label">/ {totalPages} trang</span>
              </div>

              <p className="pdf-picker-hint">
                💡 Bạn có thể lật trang tiếp theo hoặc quay lại trang trước bất cứ lúc nào khi đang đọc.
              </p>
            </div>

            <div className="pdf-action-buttons">
              <button
                type="submit"
                className="btn btn-primary btn-with-icon btn-lg"
                disabled={isLoading || !targetPage}
                style={{ padding: "11px 28px", fontSize: "1rem", fontWeight: 700 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinning" />
                    <span>Đang trích xuất trang {targetPage}...</span>
                  </>
                ) : (
                  <>
                    <BookOpen size={18} strokeWidth={2.4} />
                    <span>Bắt đầu đọc trang {targetPage || 1}</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {errorMsg && (
        <div className="pdf-error-banner">
          <AlertCircle size={16} color="#ef4444" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
