import React from "react";
import { MapPin, Flame, UserPlus, UserCheck, Clock, Check, X } from "../Icons";
import { getBuddyStatusMeta } from "../../utils/studyBuddyUtils";

/**
 * StudyBuddyCard - Molecule Component
 * Hiển thị thông tin cá nhân, vị trí GPS thực tế, chuỗi ngày học và nút tương tác kết bạn
 */
export const StudyBuddyCard = React.memo(({
  buddy,
  onSendRequest,
  onRespond,
  onUnfriend,
  isProcessing = false,
}) => {
  if (!buddy) return null;

  const {
    id,
    name,
    avatar_url,
    distance_label,
    study_target,
    bio,
    streak = 0,
    words_today = 0,
    friendship_status = "NONE",
    friendship_id,
  } = buddy;

  const meta = getBuddyStatusMeta(friendship_status);

  return (
    <div className={`study-buddy-card ${friendship_status === "FRIEND" ? "is-friend" : ""}`}>
      {/* Top Header: Avatar & Main Info */}
      <div className="buddy-card-header">
        <div className="buddy-avatar-wrap">
          {avatar_url ? (
            <img src={avatar_url} alt={name} className="buddy-avatar-img" />
          ) : (
            <div className="buddy-avatar-fallback">
              {(name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          {streak > 0 && (
            <span className="buddy-streak-badge" title={`Chuỗi học tập ${streak} ngày liên tiếp`}>
              <Flame size={11} />
              <span>{streak}</span>
            </span>
          )}
        </div>

        <div className="buddy-meta-info">
          <div className="buddy-name-row">
            <h4 className="buddy-name" title={name}>{name}</h4>
          </div>

          <div className="buddy-distance-tag">
            <MapPin size={12} />
            <span>{distance_label || "Gần đây"}</span>
          </div>
        </div>
      </div>

      {/* Target & Bio */}
      <div className="buddy-target-wrap">
        <span className="buddy-target-pill" title="Mục tiêu học tập">
          🎯 {study_target || "Luyện nghe & Chép chính tả"}
        </span>
      </div>

      {bio && (
        <p className="buddy-bio-text" title={bio}>
          &ldquo;{bio}&rdquo;
        </p>
      )}

      {/* Bottom Activity Stats */}
      <div className="buddy-stats-row">
        <span className="buddy-stat-item">
          Hôm nay: <strong>+{words_today} từ</strong>
        </span>
      </div>

      {/* Action Toolbar */}
      <div className="buddy-action-toolbar">
        {meta.canAccept ? (
          <div className="buddy-dual-actions">
            <button
              type="button"
              className="btn-buddy-accept"
              disabled={isProcessing}
              onClick={() => onRespond && onRespond(friendship_id, "ACCEPT")}
              title="Đồng ý kết bạn"
            >
              <Check size={14} />
              <span>Đồng ý</span>
            </button>
            <button
              type="button"
              className="btn-buddy-reject"
              disabled={isProcessing}
              onClick={() => onRespond && onRespond(friendship_id, "REJECT")}
              title="Từ chối"
            >
              <X size={14} />
              <span>Bỏ qua</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={`btn-buddy-status ${meta.variant}`}
            disabled={meta.isButtonDisabled || isProcessing}
            onClick={() => onSendRequest && onSendRequest(id)}
            title={meta.label}
          >
            {friendship_status === "FRIEND" ? (
              <>
                <UserCheck size={14} />
                <span>Bạn bè</span>
              </>
            ) : friendship_status === "PENDING_SENT" ? (
              <>
                <Clock size={14} />
                <span>Đã gửi lời mời</span>
              </>
            ) : (
              <>
                <UserPlus size={14} />
                <span>Kết bạn</span>
              </>
            )}
          </button>
        )}

        {friendship_status === "FRIEND" && onUnfriend && (
          <button
            type="button"
            className="btn-buddy-unfriend"
            onClick={() => onUnfriend(id)}
            title="Hủy kết bạn"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </div>
  );
});

export default StudyBuddyCard;

