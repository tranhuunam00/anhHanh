/**
 * Feedback Service for submitting and retrieving user suggestions & bug reports.
 * Supports image attachment uploads to MinIO Object Storage.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function uploadFeedbackImage(file, token) {
  if (!token) {
    throw new Error('Vui lòng đăng nhập để tải ảnh đính kèm.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/feedback/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Không thể tải ảnh lên MinIO. Vui lòng thử lại.');
  }

  return data.image_url;
}

export async function submitFeedback(feedbackData, token) {
  if (!token) {
    throw new Error('Vui lòng đăng nhập để gửi góp ý hoặc báo lỗi.');
  }

  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      content: feedbackData.content,
      feedback_type: feedbackData.feedback_type || feedbackData.category || 'GENERAL',
      rating: feedbackData.rating || null,
      image_url: feedbackData.image_url || null
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Không thể gửi góp ý. Vui lòng thử lại.');
  }

  return data;
}

export async function fetchMyFeedbacks(token) {
  if (!token) return [];

  const response = await fetch(`${API_BASE_URL}/api/feedback/my`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Không thể tải danh sách góp ý của bạn.');
  }

  return data.feedbacks || [];
}

/** Fetch unread replies count for header badge */
export async function fetchUnreadFeedbackCount(token) {
  if (!token) return 0;

  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.unread_count || 0;
  } catch {
    return 0;
  }
}

/** Fetch full message thread for a feedback (and mark incoming replies as read) */
export async function fetchFeedbackMessages(feedbackId, token) {
  if (!token) throw new Error('Vui lòng đăng nhập.');

  const response = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Không thể tải cuộc hội thoại.');
  }

  return data;
}

/** Send reply to a feedback thread (supports text and MinIO image attachment) */
export async function sendFeedbackReply(feedbackId, { message, image_url }, token) {
  if (!token) throw new Error('Vui lòng đăng nhập để gửi phản hồi.');

  const response = await fetch(`${API_BASE_URL}/api/feedback/${feedbackId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      image_url: image_url || null
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Không thể gửi phản hồi.');
  }

  return data;
}

