import React from "react";
import { Trophy, Flame, Sparkles } from "../Icons";
import { getRankBadge, formatViewerPoints } from "../../utils/tiktokLiveUtils";

export const TikTokLiveLeaderboard = React.memo(({
  leaderboard = [],
  recentEvents = [],
  totalComments = 0,
  totalLikes = 0,
  totalGifts = 0,
}) => {
  return (
    <div className="tiktok-leaderboard-panel">
      {/* Top Banner Stats */}
      <div className="tiktok-stats-strip">
        <div className="tiktok-stat-chip">
          <span>Bình luận: <strong>{totalComments}</strong></span>
        </div>
        <div className="tiktok-stat-chip">
          <span>Thả tim: <strong>{totalLikes}</strong></span>
        </div>
        <div className="tiktok-stat-chip highlight">
          <span>Quà tặng: <strong>{totalGifts}</strong></span>
        </div>
      </div>

      {/* Leaderboard Section */}
      <div className="tiktok-lb-container">
        <div className="tiktok-lb-header">
          <Trophy size={16} color="#eab308" />
          <span>BẢNG VÀNG ĐUA TOP LIVE</span>
        </div>

        <div className="tiktok-lb-list">
          {leaderboard.length === 0 ? (
            <div className="tiktok-lb-empty">
              <span>Chưa có học viên nào ghi điểm. Hãy comment đáp án để lên bảng vàng!</span>
            </div>
          ) : (
            leaderboard.slice(0, 5).map((player, idx) => {
              const badge = getRankBadge(idx);
              return (
                <div key={player.user_id} className="tiktok-lb-row">
                  <div
                    className="tiktok-lb-rank"
                    style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
                  >
                    {badge.label}
                  </div>
                  <div className="tiktok-lb-player-info">
                    <span className="tiktok-lb-name" title={player.nickname}>
                      {player.nickname}
                    </span>
                    {player.streak > 1 && (
                      <span className="tiktok-lb-streak">
                        <Flame size={12} color="#f97316" />
                        {player.streak} chuỗi
                      </span>
                    )}
                  </div>
                  <div className="tiktok-lb-points">
                    {formatViewerPoints(player.score)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Real-time Ticker of Recent Comments & Events */}
      <div className="tiktok-ticker-container">
        <div className="tiktok-ticker-header">
          <Sparkles size={14} color="var(--primary)" />
          <span>TƯƠNG TÁC THỜI GIAN THỰC</span>
        </div>
        <div className="tiktok-ticker-list">
          {recentEvents.slice(-5).reverse().map((evt, idx) => {
            if (evt.type === "NEW_GIFT") {
              return (
                <div key={idx} className="tiktok-ticker-item gift">
                  <span className="ticker-user">{evt.nickname}</span> đã tặng <strong>{evt.gift_name}</strong> (+{evt.bonus_points} pts)!
                </div>
              );
            }
            return (
              <div key={idx} className={`tiktok-ticker-item ${evt.is_correct ? "correct" : ""}`}>
                <span className="ticker-user">{evt.nickname}:</span>{" "}
                <span className="ticker-comment">{evt.comment}</span>
                {evt.is_correct && <span className="ticker-correct-badge">+{evt.points} pts</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

