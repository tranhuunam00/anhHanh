import React from "react";

export const QuestionsDrawer = ({
  isOpen,
  onClose,
  totalChallenges,
  currentIndex,
  progressMap,
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <h3>Danh sách tất cả các câu</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
              const isComp = progressMap?.challenges?.[pos]?.isCompleted;

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
        </div>
      </aside>
    </>
  );
};
