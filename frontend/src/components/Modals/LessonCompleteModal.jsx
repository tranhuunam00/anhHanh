import React from "react";
import {
  Trophy,
  Sparkles,
  Flame,
  CheckCircle2,
  FileText,
  BookOpen,
  RotateCcw,
  X,
  ArrowRight,
} from "lucide-react";

export const LessonCompleteModal = ({
  isOpen,
  onClose,
  lesson,
  streak,
  onRestartLesson,
  onViewTranscript,
  onOpenVocab,
}) => {
  if (!isOpen || !lesson) return null;

  const totalChallenges = lesson.challenges?.length || lesson.total_challenges || 0;
  const currentStreak = streak?.current_streak || 1;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div
        className="settings-modal lesson-complete-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "520px",
          width: "92vw",
          borderRadius: "18px",
          overflow: "hidden",
          textAlign: "center",
          boxShadow: "0 25px 50px -12px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.15)",
        }}
      >
        {/* Celebration Banner Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
            padding: "28px 20px 22px",
            color: "#ffffff",
            position: "relative",
          }}
        >
          <button
            onClick={onClose}
            aria-label="Đóng"
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#ffffff",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <X size={18} />
          </button>

          {/* Trophy Avatar with glow */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
            }}
          >
            <Trophy size={38} color="#fef08a" strokeWidth={2.2} />
          </div>

          <h2
            style={{
              margin: "0 0 6px 0",
              fontSize: "1.45rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Chúc mừng bạn đã hoàn thành bài học! 🎉
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.88rem",
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={lesson.title || ""}
          >
            {lesson.title || "Bài luyện nghe Dictation"}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ padding: "20px 22px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            {/* Stat 1: Total Sentences */}
            <div
              style={{
                background: "var(--bg-card-hover, rgba(241, 245, 249, 0.7))",
                padding: "12px 8px",
                borderRadius: "12px",
                border: "1px solid var(--border-color, #e2e8f0)",
              }}
            >
              <div style={{ color: "#10b981", display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                <CheckCircle2 size={20} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary, #0f172a)" }}>
                {totalChallenges} / {totalChallenges}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #64748b)" }}>Câu hoàn thành</div>
            </div>

            {/* Stat 2: Streak */}
            <div
              style={{
                background: "var(--bg-card-hover, rgba(241, 245, 249, 0.7))",
                padding: "12px 8px",
                borderRadius: "12px",
                border: "1px solid var(--border-color, #e2e8f0)",
              }}
            >
              <div style={{ color: "#f97316", display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                <Flame size={20} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary, #0f172a)" }}>
                {currentStreak} ngày
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #64748b)" }}>Chuỗi học tập</div>
            </div>

            {/* Stat 3: Rate */}
            <div
              style={{
                background: "var(--bg-card-hover, rgba(241, 245, 249, 0.7))",
                padding: "12px 8px",
                borderRadius: "12px",
                border: "1px solid var(--border-color, #e2e8f0)",
              }}
            >
              <div style={{ color: "#8b5cf6", display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                <Sparkles size={20} strokeWidth={2.5} />
              </div>
              <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary, #0f172a)" }}>
                100%
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted, #64748b)" }}>Tiến độ bài học</div>
            </div>
          </div>

          {/* Action List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              className="btn btn-primary btn-with-icon"
              style={{
                justifyContent: "center",
                padding: "10px 16px",
                fontSize: "0.92rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
              }}
              onClick={() => {
                onClose();
                if (onViewTranscript) onViewTranscript();
              }}
            >
              <FileText size={17} strokeWidth={2.2} />
              <span>Đọc toàn bộ bài nghe (Transcript & Dịch)</span>
              <ArrowRight size={15} />
            </button>

            <button
              className="btn btn-secondary btn-with-icon"
              style={{
                justifyContent: "center",
                padding: "10px 16px",
                fontSize: "0.92rem",
                fontWeight: 600,
                borderRadius: "10px",
              }}
              onClick={() => {
                onClose();
                if (onOpenVocab) onOpenVocab();
              }}
            >
              <BookOpen size={17} strokeWidth={2.2} color="#6366f1" />
              <span>Ôn từ vựng trong Sổ tay từ mới</span>
            </button>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                className="btn btn-secondary btn-with-icon"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  padding: "9px 14px",
                  fontSize: "0.86rem",
                  color: "#ef4444",
                  borderColor: "#fecaca",
                  borderRadius: "10px",
                }}
                onClick={() => {
                  onClose();
                  if (onRestartLesson) onRestartLesson();
                }}
              >
                <RotateCcw size={15} strokeWidth={2} />
                <span>Luyện lại từ câu 1</span>
              </button>

              <button
                className="btn btn-secondary"
                style={{
                  padding: "9px 18px",
                  fontSize: "0.86rem",
                  borderRadius: "10px",
                }}
                onClick={onClose}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
