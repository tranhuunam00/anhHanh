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
