// Writing Service for AI Writing Studio (Luyện viết AI)

const safeParseResponse = async (res, defaultMsg = "Thao tác thất bại") => {
  let data = {};
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: defaultMsg };
  }
  if (!res.ok) {
    throw new Error(data.detail || defaultMsg);
  }
  return data;
};

export const fetchWritingPrompts = async () => {
  try {
    const res = await fetch("/api/writing/prompts");
    const data = await safeParseResponse(res, "Không thể tải danh sách đề bài");
    return data.prompts || {};
  } catch (e) {
    console.error("Lỗi tải đề bài:", e);
    return {};
  }
};

export const generateWritingPrompt = async ({ genre, topicArea, token }) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/writing/generate-prompt", {
    method: "POST",
    headers,
    body: JSON.stringify({ genre, topic_area: topicArea }),
  });

  const data = await safeParseResponse(res, "Không thể tạo đề bài AI mới");
  return data.prompt;
};

export const saveWritingSubmission = async ({ submissionId, topic, content, genre, targetBand, token }) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/writing/save", {
    method: "POST",
    headers,
    body: JSON.stringify({
      submission_id: submissionId,
      topic,
      content,
      genre,
      target_band: targetBand,
    }),
  });

  return await safeParseResponse(res, "Không thể lưu bài viết");
};

export const evaluateWriting = async ({ submissionId, topic, content, genre, targetBand, token }) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/writing/evaluate", {
    method: "POST",
    headers,
    body: JSON.stringify({
      submission_id: submissionId,
      topic,
      content,
      genre,
      target_band: targetBand,
    }),
  });

  return await safeParseResponse(res, "Lỗi khi AI chấm bài viết");
};

export const fetchWritingHistory = async (token) => {
  if (!token) return [];
  try {
    const res = await fetch("/api/writing/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await safeParseResponse(res, "Không thể tải lịch sử bài viết");
    return data.items || [];
  } catch (e) {
    console.error("Lỗi tải lịch sử bài viết:", e);
    return [];
  }
};

export const fetchSubmissionDetail = async (submissionId, token) => {
  if (!token || !submissionId) return null;
  const res = await fetch(`/api/writing/submission/${submissionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await safeParseResponse(res, "Không thể tải chi tiết bài viết");
  return data.submission;
};

export const deleteSubmission = async (submissionId, token) => {
  if (!token || !submissionId) return false;
  const res = await fetch(`/api/writing/submission/${submissionId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  await safeParseResponse(res, "Không thể xóa bài viết");
  return true;
};
