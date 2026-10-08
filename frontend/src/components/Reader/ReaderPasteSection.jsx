import React from "react";
import {
  Newspaper,
  ArrowRight,
  BookOpen,
  ClipboardPaste,
  Trash2,
} from "../Icons";

export function ReaderPasteSection({
  editorBoxRef,
  editorContent,
  articleHtml,
  isEditorEmpty,
  onSwitchToReading,
  onEditorPaste,
  onEditorInput,
  onStartReading,
  onPasteFromClipboard,
  onInsertSample,
  onClearEditor,
}) {
  return (
    <div className="reader-editor-card">
      <div className="reader-editor-header">
        <div>
          <div className="reader-editor-title">
            <Newspaper size={24} style={{ color: "#10b981" }} />
            <span>Dán bài báo / Tài liệu tiếng Anh mới</span>
          </div>
          <p className="reader-editor-desc">
            Nhấp chuột vào ô bên dưới rồi nhấn <strong>Ctrl + V</strong> (hoặc Cmd + V). Hệ thống hỗ trợ dán đầy đủ cả văn bản lẫn hình ảnh từ bất kỳ trang báo nào!
          </p>
        </div>

        <div className="reader-editor-actions-right">
          {articleHtml && (
            <button
              className="btn btn-secondary btn-with-icon"
              onClick={onSwitchToReading}
              title="Quay lại bài báo đang đọc trước đó"
            >
              <ArrowRight size={16} />
              <span>Quay lại bài đang đọc</span>
            </button>
          )}
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
          {/* NÚT CHÍNH: BẮT ĐẦU ĐỌC BÀI */}
          <button
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
            className="btn btn-secondary btn-with-icon"
            onClick={onPasteFromClipboard}
            title="Dán nhanh nội dung từ Clipboard"
          >
            <ClipboardPaste size={16} strokeWidth={2} />
            <span>Dán từ Clipboard</span>
          </button>

          <button
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
    </div>
  );
}
