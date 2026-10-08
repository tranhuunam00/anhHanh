import React, { useState, useEffect } from "react";
import { SlidersHorizontal, X, RefreshCw, Bell, Volume2, ShieldCheck, AlertCircle, PlayCircle } from "../Icons";
import {
  getReminderSettings,
  saveReminderSettings,
  getNotificationPermissionStatus,
  requestNotificationPermission,
  sendTestNotification,
} from "../../utils/dailyReminderManager";

export const SettingsModal = ({ isOpen, onClose, settings, onUpdateSetting, onResetSettings }) => {
  const [activeTab, setActiveTab] = useState("player"); // "player" | "reminder"
  const [reminderConfig, setReminderConfig] = useState(getReminderSettings);
  const [permStatus, setPermStatus] = useState(getNotificationPermissionStatus);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReminderConfig(getReminderSettings());
      setPermStatus(getNotificationPermissionStatus());
      setTestSent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateReminder = (key, value) => {
    const next = { ...reminderConfig, [key]: value };
    setReminderConfig(next);
    saveReminderSettings(next);
  };

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermStatus(res);
  };

  const handleTestNotification = async () => {
    setTestSent(true);
    await sendTestNotification();
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="settings-modal" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SlidersHorizontal size={20} strokeWidth={2} />
            <h3 className="modal-title" style={{ margin: 0 }}>Cài đặt hệ thống</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Tab navigation */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--border-color)",
          padding: "0 20px",
          background: "var(--bg-secondary)",
          gap: "8px",
        }}>
          <button
            style={{
              padding: "10px 14px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "player" ? "2px solid var(--primary)" : "2px solid transparent",
              color: activeTab === "player" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => setActiveTab("player")}
          >
            <SlidersHorizontal size={15} />
            <span>Luyện nghe & Phím tắt</span>
          </button>
          <button
            style={{
              padding: "10px 14px",
              background: "none",
              border: "none",
              borderBottom: activeTab === "reminder" ? "2px solid var(--primary)" : "2px solid transparent",
              color: activeTab === "reminder" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={() => setActiveTab("reminder")}
          >
            <Bell size={15} />
            <span>Nhắc nhở học từ vựng (0đ)</span>
          </button>
        </div>

        <div className="modal-body">
          {activeTab === "player" && (
            <>
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
                      <strong>Tự chuyển câu (Auto Advance)</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Hành vi sau khi gõ đúng 100% và hiện kết quả</div>
                    </td>
                    <td>
                      <select
                        className="settings-select"
                        value={settings.autoAdvance}
                        onChange={(e) => onUpdateSetting("autoAdvance", e.target.value)}
                      >
                        <option value="no">Không (Mặc định) - Hiện kết quả & dịch, ấn Enter lần nữa để sang câu</option>
                        <option value="yes">Có - Tự động nhảy sang câu tiếp theo</option>
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
                  <RefreshCw size={14} strokeWidth={2} />
                  <span>Khôi phục mặc định</span>
                </button>
              </div>
            </>
          )}

          {activeTab === "reminder" && (
            <div>
              <div style={{
                background: "var(--bg-secondary)",
                borderRadius: "10px",
                padding: "14px 16px",
                marginBottom: "16px",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: 1.5,
                border: "1px solid var(--border-color)",
              }}>
                <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Bell size={16} style={{ color: "var(--primary)" }} />
                  <span>Hệ thống nhắc nhở Web Background (Hoàn toàn miễn phí)</span>
                </div>
                Chạy hoàn toàn trên trình duyệt bằng <strong>Web Notification & Service Worker</strong>. Tự động kiểm tra và nhắc nhở ôn luyện từ vựng mỗi ngày để giữ vững chuỗi Streak mà không tốn bất kỳ chi phí nào.
              </div>

              <table className="settings-table">
                <tbody>
                  <tr>
                    <td className="settings-label">
                      <strong>Bật nhắc nhở hàng ngày</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Nhắc luyện từ vựng nếu hôm nay chưa học</div>
                    </td>
                    <td>
                      <select
                        className="settings-select"
                        value={reminderConfig.enabled ? "yes" : "no"}
                        onChange={(e) => handleUpdateReminder("enabled", e.target.value === "yes")}
                      >
                        <option value="yes">Bật nhắc nhở (Khuyên dùng)</option>
                        <option value="no">Tắt nhắc nhở</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td className="settings-label">
                      <strong>Thời gian nhắc nhở mỗi ngày</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Hẹn giờ thông báo (mặc định 20:00 tối)</div>
                    </td>
                    <td>
                      <input
                        type="time"
                        className="settings-select"
                        value={reminderConfig.reminderTime || "20:00"}
                        onChange={(e) => handleUpdateReminder("reminderTime", e.target.value)}
                        style={{ width: "100%", padding: "6px 10px" }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="settings-label">
                      <strong>Âm thanh chuông báo (Chime)</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Phát hợp âm nhẹ nhàng khi có thông báo</div>
                    </td>
                    <td>
                      <select
                        className="settings-select"
                        value={reminderConfig.sound ? "yes" : "no"}
                        onChange={(e) => handleUpdateReminder("sound", e.target.value === "yes")}
                      >
                        <option value="yes">Có âm thanh (Bật)</option>
                        <option value="no">Không âm thanh (Yên lặng)</option>
                      </select>
                    </td>
                  </tr>

                  <tr>
                    <td className="settings-label">
                      <strong>Quyền thông báo trình duyệt</strong>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Trạng thái cấp phép của hệ điều hành / trình duyệt</div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {permStatus === "granted" && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontSize: "0.85rem", fontWeight: 600 }}>
                            <ShieldCheck size={16} />
                            <span>Đã cấp quyền (Sẵn sàng)</span>
                          </div>
                        )}
                        {permStatus === "default" && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                            onClick={handleRequestPermission}
                          >
                            Cấp quyền thông báo
                          </button>
                        )}
                        {permStatus === "denied" && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ef4444", fontSize: "0.8rem" }}>
                            <AlertCircle size={15} />
                            <span>Bị chặn (Nhấp biểu tượng 🔒 ở URL để mở)</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Mẹo: Click nút thử nghiệm để kiểm tra chuông & thông báo
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-with-icon"
                  style={{ fontSize: "0.85rem" }}
                  onClick={handleTestNotification}
                  disabled={testSent}
                >
                  <PlayCircle size={15} />
                  <span>{testSent ? "Đang gửi..." : "Thử nghiệm thông báo ngay"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


