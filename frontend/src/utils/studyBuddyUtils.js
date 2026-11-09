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

