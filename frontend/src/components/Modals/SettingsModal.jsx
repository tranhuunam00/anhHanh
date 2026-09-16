import React from "react";

export const SettingsModal = ({ isOpen, onClose, settings, onUpdateSetting, onResetSettings }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Cài đặt luyện tập</h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <table className="settings-table">
            <tbody>
              <tr>
                <td className="settings-label">Phím tua lại câu (Replay)</td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.replayKey}
                    onChange={(e) => onUpdateSetting("replayKey", e.target.value)}
                  >
                    <option value="Control">Ctrl</option>
                    <option value="Alt">Alt</option>
                    <option value="KeyR">R</option>
                    <option value="Space">Space</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="settings-label">Phím tạm dừng / phát (Play/Pause)</td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.playPauseKey}
                    onChange={(e) => onUpdateSetting("playPauseKey", e.target.value)}
                  >
                    <option value="Backquote">` (dấu huyền)</option>
                    <option value="Escape">Escape</option>
                    <option value="Space">Alt + Space</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="settings-label">
                  <strong>Auto Replay (Tự lặp câu)</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tự động phát lại câu khi phát hết</div>
                </td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.autoReplay}
                    onChange={(e) => onUpdateSetting("autoReplay", e.target.value)}
                  >
                    <option value="yes">Bật lặp câu (Yes)</option>
                    <option value="no">Dừng ở cuối câu (No)</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="settings-label">
                  <strong>Khoảng nghỉ giữa các lần lặp</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Thời gian dừng trước khi tua lại</div>
                </td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.replayInterval}
                    onChange={(e) => onUpdateSetting("replayInterval", parseFloat(e.target.value))}
                  >
                    <option value="0.5">0.5s</option>
                    <option value="1.0">1.0s</option>
                    <option value="1.5">1.5s</option>
                    <option value="2.0">2.0s</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="settings-label">
                  <strong>Auto Advance (Tự chuyển câu)</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Tự động chuyển câu tiếp khi đúng 100%</div>
                </td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.autoAdvance}
                    onChange={(e) => onUpdateSetting("autoAdvance", e.target.value)}
                  >
                    <option value="yes">Có - Tự nhảy câu</option>
                    <option value="no">Không - Ở lại câu hiện tại</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="settings-label">
                  <strong>Độ đệm audio (Audio Padding)</strong>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Độ đệm câu (chặn tràn sang câu trước/sau)</div>
                </td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.audioPadding}
                    onChange={(e) => onUpdateSetting("audioPadding", parseFloat(e.target.value))}
                  >
                    <option value="0.0">0.0s (Cắt sát nút)</option>
                    <option value="0.05">0.05s</option>
                    <option value="0.1">0.1s (Khuyên dùng - Chuẩn)</option>
                    <option value="0.15">0.15s</option>
                    <option value="0.2">0.2s (Rộng)</option>
                  </select>
                </td>
              </tr>

              <tr>
                <td className="settings-label">Kiểm tra nghiêm ngặt dấu câu</td>
                <td>
                  <select
                    className="settings-select"
                    value={settings.strictPunctuation ? "yes" : "no"}
                    onChange={(e) => onUpdateSetting("strictPunctuation", e.target.value === "yes")}
                  >
                    <option value="no">Không (bỏ qua dấu phẩy, chấm)</option>
                    <option value="yes">Có (bắt buộc đúng từng dấu câu)</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn btn-secondary btn-with-icon"
              style={{ fontSize: "0.85rem" }}
              onClick={() => {
                if (onResetSettings) {
                  onResetSettings();
                  alert("Đã khôi phục tất cả cài đặt về mặc định chuẩn!");
                }
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Khôi phục mặc định</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
