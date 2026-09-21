import React, { useState } from "react";
import {
  HelpCircle,
  Keyboard,
  Sparkles,
  Lightbulb,
  X,
  Volume2,
  BookmarkPlus,
  MousePointer,
  Play,
  RotateCcw,
  CheckCircle2,
  Compass,
} from "lucide-react";

export const ShortcutsModal = ({ isOpen, onClose, initialTab = "vocab" }) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'vocab' | 'shortcuts' | 'tips'

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="settings-modal guide-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(99, 102, 241, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6366f1",
              }}
            >
              <Compass size={18} strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="modal-title" style={{ margin: 0, fontSize: "1.1rem" }}>
                Hướng dẫn sử dụng & Phím tắt
              </h3>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted, #64748b)" }}>
                Học tiếng Anh thông minh qua phương pháp Dictation
              </div>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Đóng">
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="guide-tabs-bar">
          <button
            type="button"
            className={`guide-tab-btn ${activeTab === "vocab" ? "active" : ""}`}
            onClick={() => setActiveTab("vocab")}
          >
            <Sparkles size={15} color="#6366f1" />
            <span>Cách lưu từ mới</span>
          </button>

          <button
            type="button"
            className={`guide-tab-btn ${activeTab === "shortcuts" ? "active" : ""}`}
            onClick={() => setActiveTab("shortcuts")}
          >
            <Keyboard size={15} color="#2563eb" />
            <span>Phím tắt nhanh</span>
          </button>

          <button
            type="button"
            className={`guide-tab-btn ${activeTab === "tips" ? "active" : ""}`}
            onClick={() => setActiveTab("tips")}
          >
            <Lightbulb size={15} color="#f59e0b" />
            <span>Mẹo luyện Dictation</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="guide-modal-body">
          {/* ================= TAB 1: CÁCH LƯU TỪ MỚI ================= */}
          {activeTab === "vocab" && (
            <div>
              <div className="guide-hero-card">
                <div className="guide-hero-title">
                  <BookmarkPlus size={18} color="#6366f1" />
                  <span>3 bước lưu từ mới tức thì vào Sổ tay</span>
                </div>
                <p className="guide-hero-desc">
                  Không cần mở từ điển ngoài hay gõ lại chữ. Bạn có thể lưu mọi từ vựng bạn muốn học chỉ bằng 1 thao tác quét chuột trên màn hình!
                </p>
              </div>

              <div className="guide-step-grid">
                {/* Step 1 */}
                <div className="guide-step-item">
                  <div className="guide-step-num">1</div>
                  <div className="guide-step-text">
                    <h4>Quét chọn (bôi đen) từ bất kỳ</h4>
                    <p>
                      Khi đang nghe chép chính tả (<strong>Dictation</strong>) hoặc đọc toàn bộ bài nghe (<strong>Transcript</strong>), dùng chuột <strong>bôi đen</strong> từ hoặc cụm từ tiếng Anh bạn muốn học.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="guide-step-item">
                  <div className="guide-step-num">2</div>
                  <div className="guide-step-text">
                    <h4>Bấm nút "✨ Lưu từ"</h4>
                    <p>
                      Nút nổi thông minh <strong>✨ Lưu [từ đã chọn]</strong> sẽ lập tức xuất hiện ngay phía trên con trỏ chuột. Nhấp vào nút đó để lưu ngay.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="guide-step-item">
                  <div className="guide-step-num">3</div>
                  <div className="guide-step-text">
                    <h4>AI tự động tra nghĩa & ảnh</h4>
                    <p>
                      Hệ thống tự động tra <strong>nghĩa tiếng Việt</strong>, phiên âm chuẩn <strong>IPA</strong>, lưu lại <strong>ngữ cảnh câu gốc</strong> và tìm <strong>ảnh minh họa AI</strong> tương ứng.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Demo */}
              <div className="guide-demo-card">
                <span>👉 <strong>Thử nghiệm ngay:</strong> Hãy dùng chuột quét chọn (bôi đen) từ này 👉</span>
                <mark
                  style={{
                    background: "#fef08a",
                    color: "#854d0e",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontWeight: 700,
                    userSelect: "all",
                    cursor: "text",
                  }}
                >
                  extraordinary
                </mark>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #64748b)" }}>
                  để thấy nút "✨ Lưu từ" nổi lên ngay lập tức!
                </span>
              </div>

              <div style={{ marginTop: "14px", fontSize: "0.82rem", color: "var(--text-muted, #64748b)", lineHeight: 1.4 }}>
                ℹ️ <em>Mẹo:</em> Sau khi lưu, bạn hãy vào mục <strong>Sổ tay từ vựng</strong> để ôn tập qua 4 dạng bài tập tương tác (Flashcard, Trắc nghiệm, Nghe đoán từ, Điền câu).
              </div>
            </div>
          )}

          {/* ================= TAB 2: PHÍM TẮT NHANH ================= */}
          {activeTab === "shortcuts" && (
            <div>
              {/* Category 1: Audio Controls */}
              <div className="shortcuts-category-group">
                <div className="shortcuts-category-title">
                  <Volume2 size={14} color="#3b82f6" />
                  <span>Điều khiển âm thanh (Audio & Replay)</span>
                </div>
                <div className="shortcuts-grid">
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Phát lại (Replay) câu hiện tại</span>
                    <kbd>Ctrl</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Tạm dừng / Tiếp tục phát</span>
                    <kbd>Space / Shift+Space</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Chuyển sang câu trước đó</span>
                    <kbd>Alt + ←</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Chuyển sang câu kế tiếp</span>
                    <kbd>Alt + →</kbd>
                  </div>
                </div>
              </div>

              {/* Category 2: Typing & Checking */}
              <div className="shortcuts-category-group">
                <div className="shortcuts-category-title">
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>Kiểm tra & Chuyển câu</span>
                </div>
                <div className="shortcuts-grid">
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Kiểm tra kết quả câu vừa gõ</span>
                    <kbd>Enter (1 lần)</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Sang câu tiếp theo (khi đúng)</span>
                    <kbd>Enter (lần 2)</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Bỏ qua câu hiện tại (hoặc đóng modal)</span>
                    <kbd>Esc</kbd>
                  </div>
                </div>
              </div>

              {/* Category 3: Hints & Vocab */}
              <div className="shortcuts-category-group">
                <div className="shortcuts-category-title">
                  <Lightbulb size={14} color="#f59e0b" />
                  <span>Gợi ý & Lưu từ vựng</span>
                </div>
                <div className="shortcuts-grid">
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Gợi ý 1 từ tiếp theo</span>
                    <kbd>Tab / Alt + W</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Gợi ý 1 ký tự (chữ) tiếp theo</span>
                    <kbd>~ / ` / Ctrl+H / Enter 2 lần</kbd>
                  </div>
                  <div className="shortcut-row-item">
                    <span className="shortcut-row-action">Hiện nút nổi lưu từ vào Sổ tay</span>
                    <kbd>Bôi đen từ</kbd>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: MẸO LUYỆN DICTATION ================= */}
          {activeTab === "tips" && (
            <div className="tips-container">
              <div className="tip-card">
                <div className="tip-card-header">
                  <span>🎧</span>
                  <span>Quy tắc nghe 3 lần vàng</span>
                </div>
                <p className="tip-card-body">
                  • <strong>Lần 1:</strong> Nghe trọn vẹn câu để nắm ý nghĩa và cảm nhận ngữ điệu tổng quát.<br />
                  • <strong>Lần 2:</strong> Vừa nghe vừa gõ nhanh các từ trọng tâm (danh từ, động từ chính).<br />
                  • <strong>Lần 3:</strong> Nghe lại để hoàn thiện các mạo từ (a, an, the), giới từ và đuôi ngữ pháp (-ed, -s/-es).
                </p>
              </div>

              <div className="tip-card">
                <div className="tip-card-header">
                  <span>⚡</span>
                  <span>Tập trung vào phím Ctrl</span>
                </div>
                <p className="tip-card-body">
                  Chỉ cần ấn nhả phím <strong>Ctrl</strong> đơn lẻ, hệ thống sẽ tua lại đoạn âm thanh câu đang học ngay lập tức mà không bao giờ xung đột với các phím tắt soạn thảo như Ctrl+A, Ctrl+C, Ctrl+V.
                </p>
              </div>

              <div className="tip-card">
                <div className="tip-card-header">
                  <span>🔥</span>
                  <span>Duy trì chuỗi ngày học liên tục (Streak)</span>
                </div>
                <p className="tip-card-body">
                  Mỗi ngày chỉ cần hoàn thành ít nhất 1 bài tập hoặc lưu 1 từ vựng để giữ chuỗi ngày học liên tục. Não bộ tiếp thu ngoại ngữ tốt nhất khi được rèn luyện đều đặn 10-15 phút mỗi ngày!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
