/**
 * studyBuddyUtils.js - Tiện ích hỗ trợ hiển thị, lọc và định dạng bạn học quanh đây
 */

export const RADIUS_OPTIONS = [
  { value: 5, label: "5 km (Rất gần)" },
  { value: 15, label: "15 km (Cùng quận/huyện)" },
  { value: 50, label: "50 km (Cùng thành phố)" },
  { value: 2000, label: "Toàn quốc" },
];

/**
 * Trả về thông tin meta (nhãn, màu, trạng thái nút) của trạng thái kết bạn
 * @param {string} status 'FRIEND' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'NONE'
 * @returns {{ label: string, variant: string, isButtonDisabled: boolean, canAccept: boolean }}
 */
export function getBuddyStatusMeta(status) {
  switch (status) {
    case "FRIEND":
      return {
        label: "Bạn bè",
        variant: "success",
        isButtonDisabled: true,
        canAccept: false,
      };
    case "PENDING_SENT":
      return {
        label: "Đã gửi lời mời",
        variant: "warning",
        isButtonDisabled: true,
        canAccept: false,
      };
    case "PENDING_RECEIVED":
      return {
        label: "Chờ bạn phản hồi",
        variant: "info",
        isButtonDisabled: false,
        canAccept: true,
      };
    case "NONE":
    default:
      return {
        label: "Kết bạn",
        variant: "primary",
        isButtonDisabled: false,
        canAccept: false,
      };
  }
}

/**
 * Lọc danh sách bạn học theo từ khóa tìm kiếm (tên, mục tiêu, bio)
 * @param {Array} buddies Danh sách bạn học
 * @param {string} query Từ khóa tìm kiếm
 * @returns {Array}
 */
export function filterBuddiesByQuery(buddies, query) {
  if (!Array.isArray(buddies)) return [];
  if (!query || typeof query !== "string") return buddies;
  const q = query.trim().toLowerCase();
  if (!q) return buddies;

  return buddies.filter((b) => {
    if (!b) return false;
    const name = (b.name || "").toLowerCase();
    const target = (b.study_target || "").toLowerCase();
    const bio = (b.bio || "").toLowerCase();
    return name.includes(q) || target.includes(q) || bio.includes(q);
  });
}

/**
 * Lấy danh sách bạn học hợp lệ (loại bỏ phần tử rỗng hoặc thiếu tọa độ/id)
 * @param {Array} rawList
 * @returns {Array}
 */
export function sanitizeBuddiesList(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList.filter((b) => b && typeof b === "object" && Boolean(b.id && b.name));
}

/**
 * Tạo liên kết chia sẻ kết bạn cá nhân
 * @param {string} userId
 * @param {string} [origin]
 * @returns {string}
 */
export function generateBuddyShareLink(userId, origin = "") {
  if (!userId) return "";
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/?buddy_invite=${encodeURIComponent(userId)}`;
}

/**
 * Trích xuất mã mời kết bạn từ query params URL
 * @param {string} searchStr e.g. "?buddy_invite=xyz" hoặc "?invite=xyz"
 * @returns {string|null}
 */
export function parseBuddyInviteFromUrl(searchStr) {
  if (!searchStr || typeof searchStr !== "string") return null;
  try {
    const params = new URLSearchParams(searchStr);
    return params.get("buddy_invite") || params.get("invite") || null;
  } catch {
    return null;
  }
}

/**
 * Định dạng nhãn và kiểu hiển thị trạng thái online
 * @param {object|null|undefined} onlineStatus { is_online, label, code }
 * @returns {{ isOnline: boolean, label: string, colorClass: string, dotColor: string }}
 */
export function formatOnlineStatusBadge(onlineStatus) {
  if (!onlineStatus || typeof onlineStatus !== "object") {
    return {
      isOnline: false,
      label: "Ngoại tuyến",
      colorClass: "status-offline",
      dotColor: "#94a3b8",
    };
  }
  const isOnline = Boolean(onlineStatus.is_online);
  const code = onlineStatus.code || "offline";
  const label = onlineStatus.label || (isOnline ? "Đang online" : "Ngoại tuyến");

  if (isOnline) {
    return {
      isOnline: true,
      label,
      colorClass: "status-online",
      dotColor: "#10b981", // Emerald green
    };
  }
  if (code === "recently_active") {
    return {
      isOnline: false,
      label,
      colorClass: "status-recent",
      dotColor: "#f59e0b", // Amber
    };
  }
  return {
    isOnline: false,
    label,
    colorClass: "status-offline",
    dotColor: "#94a3b8", // Slate gray
  };
}


