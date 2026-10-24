import React, { useState } from "react";
import {
  Newspaper,
  ArrowRight,
  BookOpen,
  ClipboardPaste,
  Trash2,
  FileText,
} from "../Icons";
import { PdfUploadCard } from "./PdfUploadCard";

export function ReaderPasteSection({
  editorBoxRef,
  articleHtml,
  isEditorEmpty,
  onSwitchToReading,
  onEditorPaste,
  onEditorInput,
  onStartReading,
  onPasteFromClipboard,
  onInsertSample,
  onClearEditor,
  onStartReadingPdf,
  isLoadingPdf = false,
}) {
  const [activeTab, setActiveTab] = useState("paste");

  return (
    <div className="reader-editor-card">
      {/* Tab Switcher between Paste Text and Upload PDF */}
      <div className="reader-source-tabs-header">
        <div className="reader-source-tabs">
          <button
            type="button"
            className={`reader-source-tab ${activeTab === "paste" ? "active" : ""}`}
            onClick={() => setActiveTab("paste")}
          >
            <Newspaper size={16} />
            <span>Dán bài báo / Văn bản</span>
          </button>
          <button
            type="button"
            className={`reader-source-tab ${activeTab === "pdf" ? "active" : ""}`}
            onClick={() => setActiveTab("pdf")}
          >
            <FileText size={16} color="#ef4444" />
            <span>Đọc tệp PDF (Chọn trang)</span>
          </button>
        </div>

        {articleHtml && (
          <button
            type="button"
            className="btn btn-secondary btn-with-icon"
            onClick={onSwitchToReading}
            title="Quay lại bài báo đang đọc trước đó"
          >
            <ArrowRight size={16} />
            <span>Quay lại bài đang đọc</span>
          </button>
        )}
      </div>

      {/* TAB 1: PASTE TEXT & HTML */}
      {activeTab === "paste" && (
        <>
          <div className="reader-editor-header" style={{ paddingTop: 4 }}>
            <div className="reader-editor-title">
              <Newspaper size={18} style={{ color: "#10b981" }} />
              <span>Dán bài báo / Tài liệu tiếng Anh mới</span>
            </div>
          </div>

          {/* Ô nhập / dán trực tiếp (ContentEditable) */}
          <div
            ref={editorBoxRef}
            className="reader-editor-box"
            contentEditable={true}
            onPaste={onEditorPaste}
            onInput={onEditorInput}
            data-empty={isEditorEmpty}
            data-placeholder="👉 Nhấp chuột vào đây và nhấn Ctrl + V để dán bài báo (hỗ trợ cả chữ, tiêu đề và hình ảnh)..."
            suppressContentEditableWarning={true}
          />

          {/* Toolbar bên dưới ô nhập */}
          <div className="reader-editor-actions">
            <div className="reader-editor-actions-left">
              <button
                type="button"
                className="btn btn-primary btn-with-icon"
                style={{ padding: "9px 22px", fontSize: "0.95rem", fontWeight: 700 }}
                onClick={onStartReading}
                disabled={isEditorEmpty}
                title="Chuyển sang chế độ đọc và tự động highlight từ vựng đã lưu"
              >
                <BookOpen size={18} strokeWidth={2.4} />
                <span>Bắt đầu đọc bài</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-with-icon"
                onClick={onPasteFromClipboard}
                title="Dán nhanh nội dung từ Clipboard"
              >
                <ClipboardPaste size={16} strokeWidth={2} />
                <span>Dán từ Clipboard</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-with-icon"
                onClick={onInsertSample}
                title="Tải bài báo mẫu thời tiết (Việt Nam News) có ảnh để xem thử"
              >
                <span>Thử bài báo mẫu</span>
              </button>
            </div>

            <div className="reader-editor-actions-right">
              {!isEditorEmpty && (
                <button
                  type="button"
                  className="btn btn-secondary btn-with-icon"
                  onClick={onClearEditor}
                  style={{ color: "#ef4444" }}
                  title="Xóa toàn bộ nội dung trong ô dán"
                >
                  <Trash2 size={15} />
                  <span>Xóa trắng</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* TAB 2: PURE CLIENT-SIDE PDF READER */}
      {activeTab === "pdf" && (
        <div style={{ paddingTop: 10 }}>
          <PdfUploadCard
            onStartReadingPdf={onStartReadingPdf}
            isLoading={isLoadingPdf}
          />
        </div>
      )}
    </div>
  );
}
