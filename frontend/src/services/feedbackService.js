/**
 * Feedback Service for submitting and retrieving user suggestions & bug reports.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
      rating: feedbackData.rating || null
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
