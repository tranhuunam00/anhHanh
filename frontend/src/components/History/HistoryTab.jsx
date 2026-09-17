import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchLessonHistory, deleteLessonHistory } from "../../services/authVocabService";

export const HistoryTab = ({ onSelectLesson, onOpenAuth }) => {
  const { token, isAuthenticated, showToast } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all' | 'in_progress' | 'completed'
  const [searchTerm, setSearchTerm] = useState("");

  const loadHistory = useCallback(async () => {
    if (!token) {
      setHistoryList([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchLessonHistory(token);
      setHistoryList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("loadHistory error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (videoId, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Bạn có chắc muốn xóa "${title || videoId}" khỏi lịch sử học tập?`)) {
      return;
    }
    const success = await deleteLessonHistory(videoId, token);
    if (success) {
      setHistoryList((prev) => prev.filter((item) => item.videoId !== videoId));
      showToast("Đã xóa bài khỏi lịch sử học tập", "info");
    } else {
      showToast("Không thể xóa bài học này", "error");
    }
  };

  const filteredList = useMemo(() => {
    return historyList.filter((item) => {
      // Filter by status
      if (filter === "in_progress" && item.isCompleted) return false;
      if (filter === "completed" && !item.isCompleted) return false;

      // Filter by search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = item.title && item.title.toLowerCase().includes(q);
        const matchId = item.videoId && item.videoId.toLowerCase().includes(q);
        if (!matchTitle && !matchId) return false;
      }
      return true;
    });
  }, [historyList, filter, searchTerm]);

  const stats = useMemo(() => {
    const total = historyList.length;
    const completed = historyList.filter((i) => i.isCompleted).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  }, [historyList]);

  const formatTime = (isoString) => {
    if (!isoString) return "Chưa học";
    try {
      const d = new Date(isoString);
      const now = new Date();
      const diffMs = now - d;
      const diffMin = Math.floor(diffMs / 60000);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffMin < 2) return "Vừa xong";
      if (diffMin < 60) return `${diffMin} phút trước`;
      if (diffHour < 24) return `${diffHour} giờ trước`;
      if (diffDay < 7) return `${diffDay} ngày trước`;
      return d.toLocaleDateString("vi-VN");
    } catch {
      return isoString;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="vocab-tab-container" style={{ maxWidth: "800px", margin: "2rem auto", textAlign: "center", padding: "3rem 1.5rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🕒</div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--text, #0f172a)" }}>
          Lịch Sử Học Tập & Tiến Độ Từng Bài
        </h2>
        <p style={{ color: "var(--text-muted, #64748b)", fontSize: "1rem", maxWidth: "520px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
          Đăng nhập để hệ thống tự động lưu vị trí câu bạn đang làm dở, tỷ lệ hoàn thành và đồng bộ bài học trên mọi thiết bị.
        </p>
        <button
          className="btn btn-primary"
          style={{ padding: "10px 24px", fontSize: "1rem", borderRadius: "10px", fontWeight: 600 }}
          onClick={onOpenAuth}
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <div className="vocab-tab-container" style={{ maxWidth: "1050px", margin: "1.5rem auto", padding: "0 1rem" }}>
      {/* Header bar */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0, color: "var(--text, #0f172a)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>🕒</span> Lịch Sử Học Tập
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: "0.875rem", color: "var(--text-muted, #64748b)" }}>
            Theo dõi tiến độ, tỷ lệ hoàn thành và tiếp tục các bài nghe đang học dở.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-secondary, #f1f5f9)", padding: "4px", borderRadius: "10px" }}>
          <button
            className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 14px", fontSize: "0.85rem", borderRadius: "7px", border: "none" }}
            onClick={() => setFilter("all")}
          >
            Tất cả ({stats.total})
          </button>
          <button
            className={`btn ${filter === "in_progress" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 14px", fontSize: "0.85rem", borderRadius: "7px", border: "none" }}
            onClick={() => setFilter("in_progress")}
          >
            Đang học ({stats.inProgress})
          </button>
          <button
            className={`btn ${filter === "completed" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "6px 14px", fontSize: "0.85rem", borderRadius: "7px", border: "none" }}
            onClick={() => setFilter("completed")}
          >
            Hoàn thành ({stats.completed})
          </button>
        </div>
      </div>

      {/* Search Input */}
      {historyList.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            className="vocab-search-input"
            placeholder="Tìm kiếm bài học trong lịch sử..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid var(--border, #cbd5e1)",
              background: "var(--surface, #ffffff)",
              color: "var(--text, #0f172a)",
              fontSize: "0.95rem"
            }}
          />
        </div>
      )}

      {/* Content list */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted, #64748b)" }}>
          Đang tải lịch sử học tập...
        </div>
      ) : filteredList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3.5rem 1rem", background: "var(--surface, #ffffff)", borderRadius: "16px", border: "1px dashed var(--border, #cbd5e1)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📖</div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--text, #0f172a)" }}>
            {historyList.length === 0 ? "Chưa có lịch sử học tập" : "Không tìm thấy bài học phù hợp"}
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted, #64748b)", margin: 0 }}>
            {historyList.length === 0
              ? "Hãy chọn một bài nghe từ trang chủ hoặc dán link YouTube để bắt đầu bài học đầu tiên!"
              : "Thử tìm kiếm với từ khóa khác hoặc đổi bộ lọc."}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {filteredList.map((item) => {
            const percent = item.percent || 0;
            return (
              <div
                key={item.id}
                style={{
                  background: "var(--surface, #ffffff)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid var(--border, #e2e8f0)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  cursor: "pointer"
                }}
                onClick={() => onSelectLesson(item.videoId, item.currentPosition)}
              >
                {/* Thumbnail Header */}
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: item.isCompleted ? "rgba(22, 163, 74, 0.9)" : "rgba(15, 23, 42, 0.8)",
                      color: "#ffffff",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "6px",
                      backdropFilter: "blur(4px)"
                    }}
                  >
                    {item.isCompleted ? "✓ Hoàn thành" : `Câu ${item.currentPosition}/${item.totalChallenges}`}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h4
                    style={{
                      margin: "0 0 0.75rem",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "var(--text, #0f172a)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                    title={item.title}
                  >
                    {item.title}
                  </h4>

                  {/* Progress Bar */}
                  <div style={{ marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted, #64748b)", marginBottom: "4px" }}>
                      <span>Tiến độ</span>
                      <strong style={{ color: item.isCompleted ? "#16a34a" : "var(--primary, #2563eb)" }}>
                        {percent}%
                      </strong>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary, #e2e8f0)", borderRadius: "3px", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: item.isCompleted ? "#16a34a" : "var(--primary, #2563eb)",
                          borderRadius: "3px",
                          transition: "width 0.3s ease"
                        }}
                      />
                    </div>

                    {/* Footer Actions */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border, #f1f5f9)" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted, #94a3b8)" }}>
                        {formatTime(item.lastStudiedAt)}
                      </span>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: "4px 8px", fontSize: "0.8rem", color: "#ef4444", border: "none", background: "transparent" }}
                          title="Xóa khỏi lịch sử"
                          onClick={(e) => handleDelete(item.videoId, item.title, e)}
                        >
                          🗑️
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: "5px 12px", fontSize: "0.8rem", borderRadius: "6px", fontWeight: 600 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLesson(item.videoId, item.currentPosition);
                          }}
                        >
                          {item.isCompleted ? "Học lại" : "Tiếp tục ▶"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
