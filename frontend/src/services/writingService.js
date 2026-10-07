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

export const fetchWritingPrompts = async (language = null) => {
  try {
    const url = language ? `/api/writing/prompts?language=${encodeURIComponent(language)}` : "/api/writing/prompts";
    const res = await fetch(url);
    const data = await safeParseResponse(res, "Không thể tải danh sách đề bài");
    return data.prompts || {};
  } catch (e) {
    console.error("Lỗi tải đề bài:", e);
    return {};
  }
};

export const generateWritingPrompt = async ({ genre, topicArea, language = "en", subType, token }) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/writing/generate-prompt", {
    method: "POST",
    headers,
    body: JSON.stringify({ genre, topic_area: topicArea, language, sub_type: subType }),
  });

  const data = await safeParseResponse(res, "Không thể tạo đề bài AI mới");
  return data.prompt;
};

export const suggestWritingStructures = async ({ topic, language = "en", targetBand = 7.0, genre = "ielts_task2", token }) => {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch("/api/writing/suggest-structures", {
    method: "POST",
    headers,
    body: JSON.stringify({
      topic,
      language,
      target_band: targetBand,
      genre,
    }),
  });

  const data = await safeParseResponse(res, "Không thể tạo gợi ý cấu trúc theo đề");
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.suggestions)
    ? data.suggestions
    : Array.isArray(data?.structures)
    ? data.structures
    : [];
  return {
    success: true,
    suggestions: list,
    structures: list,
  };
};

export const saveWritingSubmission = async ({ submissionId, topic, content, genre, targetBand, language = "en", token }) => {
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
      language,
    }),
  });

  return await safeParseResponse(res, "Không thể lưu bản nháp bài viết");
};

export const evaluateWriting = async ({ submissionId, topic, content, genre, targetBand, language = "en", images = [], token }) => {
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
      language,
      images,
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
