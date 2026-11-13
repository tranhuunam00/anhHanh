/**
 * API & WebSocket Service for TikTok LIVE Interactive Studio
 */

export async function fetchLiveSnapshot() {
  const res = await fetch("/api/tiktok-live/snapshot");
  if (!res.ok) {
    throw new Error("Không thể tải trạng thái phòng TikTok Live");
  }
  return res.json();
}

export async function connectTikTok(uniqueId) {
  const res = await fetch("/api/tiktok-live/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ unique_id: uniqueId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Lỗi khi kết nối tới TikTok Live.");
  }
  return res.json();
}

export async function disconnectTikTok() {
  const res = await fetch("/api/tiktok-live/disconnect", { method: "POST" });
  if (!res.ok) {
    throw new Error("Lỗi khi ngắt kết nối TikTok Live");
  }
  return res.json();
}

export async function startQuestionRound() {
  const res = await fetch("/api/tiktok-live/start-round", { method: "POST" });
  return res.json();
}

export async function endQuestionRound() {
  const res = await fetch("/api/tiktok-live/end-round", { method: "POST" });
  return res.json();
}

export async function nextQuestion() {
  const res = await fetch("/api/tiktok-live/next-question", { method: "POST" });
  return res.json();
}

export async function prevQuestion() {
  const res = await fetch("/api/tiktok-live/prev-question", { method: "POST" });
  return res.json();
}

export async function fetchLiveTopics() {
  const res = await fetch("/api/tiktok-live/topics");
  if (!res.ok) {
    throw new Error("Không thể tải danh sách chủ đề");
  }
  return res.json();
}

export async function setLiveTopic(topicId) {
  const res = await fetch("/api/tiktok-live/set-topic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic_id: topicId }),
  });
  if (!res.ok) {
    throw new Error("Không thể chuyển chủ đề");
  }
  return res.json();
}

export async function setLiveTimer(timerSeconds) {
  const res = await fetch("/api/tiktok-live/set-timer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timer_seconds: timerSeconds }),
  });
  if (!res.ok) {
    throw new Error("Không thể cập nhật thời gian câu hỏi");
  }
  return res.json();
}

export async function simulateLiveEvent({ event_type, comment, gift_name, diamond_count, nickname, user_id }) {
  const res = await fetch("/api/tiktok-live/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type,
      comment,
      gift_name,
      diamond_count,
      nickname,
      user_id,
    }),
  });
  if (!res.ok) {
    throw new Error("Lỗi khi gửi sự kiện mô phỏng");
  }
  return res.json();
}

export function createTikTokLiveWebSocket(onMessage, onError, onClose) {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${protocol}//${window.location.host}/api/tiktok-live/ws`;
  const socket = new WebSocket(wsUrl);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (e) {
      console.warn("Failed to parse WebSocket JSON:", e);
    }
  };

  socket.onerror = (err) => {
    if (onError) onError(err);
  };

  socket.onclose = () => {
    if (onClose) onClose();
  };

  return socket;
}

