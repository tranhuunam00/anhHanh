import React, { useState, useEffect } from "react";
import { Radio, Play, Check, FastForward, Sparkles, RotateCw, BookOpen } from "../Icons";
import { formatTikTokErrorMessage } from "../../utils/tiktokLiveUtils";

const FALLBACK_TOPICS = [
  { id: "all", name: "Tất cả chủ đề", icon: "✨" },
  { id: "ielts_vocab", name: "IELTS 7.0+", icon: "🎓" },
  { id: "destination_b2", name: "Destination B2", icon: "📘" },
  { id: "idioms_slang", name: "Thành ngữ & Slang", icon: "💬" },
  { id: "pronunciation_stress", name: "Trọng âm & Phát âm", icon: "🎙️" },
  { id: "phrasal_verbs", name: "Phrasal Verbs", icon: "⚡" },
];

export const TikTokLiveControls = React.memo(({
  uniqueId = "",
  status = "disconnected",
  errorMessage = "",
  isRoundActive = false,
  viewMode = "portrait", // portrait | landscape
  currentTopic = "all",
  availableTopics = [],
  onSelectTopic,
  onToggleViewMode,
  onConnect,
  onDisconnect,
  onStartRound,
  onEndRound,
  onNextQuestion,
  onSimulate,
  isConnecting = false,
}) => {
  const [inputUsername, setInputUsername] = useState(uniqueId || "");
  const [customComment, setCustomComment] = useState("");

  useEffect(() => {
    if (uniqueId) {
      setInputUsername(uniqueId);
    }
  }, [uniqueId]);

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    onConnect(inputUsername.trim());
  };

  const handleCustomCommentSubmit = (e) => {
    e.preventDefault();
    if (!customComment.trim()) return;
    onSimulate("comment", { comment: customComment.trim(), nickname: "Bạn Học Web" });
    setCustomComment("");
  };

  return (
    <div className="tiktok-controls-panel">
      {/* 1. Connection Bar */}
      <div className="tiktok-control-card">
        <h4 className="tiktok-ctrl-title">
          <Radio size={16} color="var(--primary)" />
          <span>KẾT NỐI TIKTOK LIVE</span>
        </h4>

        <form onSubmit={handleConnectSubmit} className="tiktok-connect-form">
          <div className="tiktok-input-wrap">
            <span className="tiktok-at-prefix">@</span>
            <input
              type="text"
              className="tiktok-username-input"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Nhập username TikTok của bạn..."
              disabled={status === "connected" || isConnecting}
            />
          </div>

          {status === "connected" ? (
            <button
              type="button"
              className="btn-tiktok-disconnect"
              onClick={onDisconnect}
            >
              Ngắt kết nối
            </button>
          ) : (
            <button
              type="submit"
              className="btn-tiktok-connect"
              disabled={isConnecting || !inputUsername.trim()}
            >
              {isConnecting ? <RotateCw size={14} className="spin" /> : <Radio size={14} />}
              <span>{isConnecting ? "Đang dò..." : "Kết nối Live"}</span>
            </button>
          )}
        </form>

        <div className="tiktok-status-bar">
          <span className={`tiktok-status-dot ${status}`} />
          <span className="tiktok-status-text">
            {status === "connected" && `Đang lắng nghe Live từ @${inputUsername || uniqueId}`}
            {status === "connecting" && "Đang thiết lập kết nối Webcast TikTok..."}
            {status === "disconnected" && "Chưa kết nối. Bạn có thể dùng Chế độ Test bên dưới."}
            {status === "error" && formatTikTokErrorMessage(errorMessage, inputUsername)}
          </span>
        </div>
      </div>

      {/* 2. Round Flow Controls */}
      <div className="tiktok-control-card">
        <h4 className="tiktok-ctrl-title">
          <Play size={16} color="var(--primary)" />
          <span>ĐIỀU KHIỂN CÂU HỎI</span>
        </h4>
        <div className="tiktok-round-btn-row">
          {isRoundActive ? (
            <button
              type="button"
              className="btn-round-action end"
              onClick={onEndRound}
            >
              <Check size={15} />
              <span>Chốt đáp án</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-round-action start"
              onClick={onStartRound}
            >
              <Play size={15} />
              <span>Bắt đầu câu hỏi</span>
            </button>
          )}

          <button
            type="button"
            className="btn-round-action next"
            onClick={onNextQuestion}
          >
            <FastForward size={15} />
            <span>Câu tiếp theo</span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="tiktok-viewmode-switch-wrap">
          <button
            type="button"
            className={`btn-viewmode-toggle ${viewMode === "portrait" ? "active" : ""}`}
            onClick={() => onToggleViewMode("portrait")}
            title="Tối ưu cho chia sẻ màn hình điện thoại hoặc livestream dạng dọc"
          >
            📱 Live Điện Thoại (9:16 Dọc)
          </button>
          <button
            type="button"
            className={`btn-viewmode-toggle ${viewMode === "landscape" ? "active" : ""}`}
            onClick={() => onToggleViewMode("landscape")}
            title="Tối ưu cho máy tính, laptop hoặc TikTok LIVE Studio / OBS màn hình ngang"
          >
            🖥️ Live Máy Tính (16:9 Ngang)
          </button>
        </div>

        <div className="tiktok-phone-live-tip">
          <span>💡 <strong>Live trên Điện thoại:</strong> Chọn chế độ <em>"Live Điện Thoại"</em> và bấm <em>"Chế độ Livestream Full"</em> để ẩn hoàn toàn thanh địa chỉ web, đảm bảo không bị lộ link theo chính sách TikTok.</span>
        </div>
      </div>

      {/* 3. Topic Selector */}
      <div className="tiktok-control-card">
        <h4 className="tiktok-ctrl-title">
          <BookOpen size={16} color="var(--primary)" />
          <span>CHỌN CHỦ ĐỀ CÂU HỎI</span>
        </h4>
        <p className="tiktok-ctrl-hint">
          Chuyển đổi tức thì bộ câu hỏi theo chủ đề (IELTS, B2, Idiom, Trọng âm, Phrasal Verbs):
        </p>
        <div className="tiktok-topics-pills-row">
          {(availableTopics && availableTopics.length > 0 ? availableTopics : FALLBACK_TOPICS).map((top) => (
            <button
              key={top.id}
              type="button"
              className={`btn-topic-selector ${currentTopic === top.id ? "active" : ""}`}
              onClick={() => onSelectTopic && onSelectTopic(top.id)}
              title={top.description || top.name}
            >
              <span className="topic-pill-icon">{top.icon}</span>
              <span className="topic-pill-name">{top.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Offline Test & Simulation Sandbox */}
      <div className="tiktok-control-card simulator">
        <h4 className="tiktok-ctrl-title">
          <Sparkles size={16} color="#eab308" />
          <span>CHẾ ĐỘ TEST (SIMULATOR)</span>
        </h4>
        <p className="tiktok-ctrl-hint">
          Không cần live thật vẫn test được 100% hiệu ứng chấm điểm, BXH và âm thanh:
        </p>

        <div className="tiktok-sim-btn-grid">
          {["A", "B", "C", "D"].map((ans) => (
            <button
              key={ans}
              type="button"
              className="btn-sim-quick-ans"
              onClick={() => onSimulate("comment", { comment: ans, nickname: `Khán Giả ${ans}` })}
            >
              Comment &quot;{ans}&quot;
            </button>
          ))}
        </div>

        <div className="tiktok-sim-multi-row">
          <button
            type="button"
            className="btn-sim-batch"
            onClick={() => {
              ["A", "B", "C", "B", "A"].forEach((c, i) => {
                setTimeout(() => {
                  onSimulate("comment", {
                    comment: c,
                    nickname: `Học Viên ${i + 1}`,
                    user_id: `user_${Date.now()}_${i}`
                  });
                }, i * 350);
              });
            }}
          >
            Mô phỏng 5 học viên comment
          </button>

          <button
            type="button"
            className="btn-sim-gift"
            onClick={() => onSimulate("gift", { gift_name: "Hoa Hồng", diamond_count: 2, nickname: "Fan Cứng TikTok" })}
          >
            Tặng Hoa Hồng (+100 pts)
          </button>
        </div>

        <form onSubmit={handleCustomCommentSubmit} className="tiktok-sim-custom-form">
          <input
            type="text"
            className="tiktok-sim-input"
            value={customComment}
            onChange={(e) => setCustomComment(e.target.value)}
            placeholder="Gõ thử comment bất kỳ..."
          />
          <button type="submit" className="btn-sim-send" disabled={!customComment.trim()}>
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
});

