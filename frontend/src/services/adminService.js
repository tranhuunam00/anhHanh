/**
 * Admin Service for fetching analytics, users list with lesson completion, and feedbacks moderation.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function fetchAdminOverview(token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/overview`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Không thể tải thống kê tổng quan quản trị.');
  }
  return await response.json();
}

export async function fetchAdminUsers(search = '', token) {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetch(`${API_BASE_URL}/api/admin/users${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Không thể tải danh sách người dùng.');
  }
  return await response.json();
}

export async function fetchAdminFeedbacks(statusFilter = 'ALL', limit = 50, offset = 0, token) {
  const params = new URLSearchParams({
    status_filter: statusFilter,
    limit: String(limit),
    offset: String(offset)
  });
  const response = await fetch(`${API_BASE_URL}/api/admin/feedbacks?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Không thể tải danh sách phản hồi.');
  }
  return await response.json();
}

export async function updateFeedbackStatus(feedbackId, newStatus, token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/feedbacks/${feedbackId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Không thể cập nhật trạng thái phản hồi.');
  }
  return await response.json();
}

/** Promote or demote a user's role (USER ↔ ADMIN). */
export async function updateUserRole(userId, newRole, token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role: newRole })
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Không thể cập nhật quyền người dùng.');
  }
  return await response.json();
}
