import React from "react";
import { ListOrdered, X, RefreshCw } from "lucide-react";

export const QuestionsDrawer = React.memo(({
  isOpen,
  onClose,
  totalChallenges,
  currentIndex,
  progressMap,
  maxReachedIndex = 0,
  onRestartLesson,
  onSelectQuestion,
}) => {
  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? "active" : ""}`}
        onClick={onClose}
      />
      <aside className={`drawer ${isOpen ? "active" : ""}`}>
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ListOrdered size={20} strokeWidth={2} />
            <h3>Danh sách tất cả các câu</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-legend">
            <span className="legend-item">
              <span className="legend-dot dot-success" /> Đã hoàn thành
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-current" /> Đang làm
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-default" /> Chưa làm
            </span>
          </div>

          <div className="question-grid">
            {Array.from({ length: totalChallenges }, (_, i) => {
              const pos = i + 1;
              const isCurr = i === currentIndex;
              const isComp = (i < maxReachedIndex) || progressMap?.challenges?.[pos]?.isCompleted;

              let btnClass = "q-btn";
              if (isCurr) btnClass += " current";
              else if (isComp) btnClass += " completed";

              return (
                <button
                  key={pos}
                  className={btnClass}
                  onClick={() => {
                    onSelectQuestion(pos);
                    onClose();
                  }}
                >
                  Câu {pos}
                </button>
              );
            })}
          </div>

          {onRestartLesson && (
            <div style={{ marginTop: "1.25rem", borderTop: "1px solid var(--border, #e2e8f0)", paddingTop: "1rem" }}>
              <button
                className="btn btn-secondary btn-with-icon"
                style={{ width: "100%", justifyContent: "center", color: "#ef4444", borderColor: "#fecaca" }}
                onClick={() => {
                  onClose();
                  onRestartLesson();
                }}
              >
                <RefreshCw size={15} strokeWidth={2} />
                <span>Làm lại bài này từ câu số 1</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
});


