import React, { useState, useEffect, useMemo } from "react";
import { ListOrdered, X, RefreshCw, ChevronLeft, ChevronRight, CornerDownLeft } from "../Icons";

const CHUNK_SIZE = 100;

export const QuestionsDrawer = React.memo(({
  isOpen,
  onClose,
  totalChallenges = 0,
  currentIndex = 0,
  progressMap,
  maxReachedIndex = 0,
  onRestartLesson,
  onSelectQuestion,
}) => {
  // If drawer is closed, don't render body at all to avoid reconciling 2000+ buttons
  const [jumpInput, setJumpInput] = useState("");
  const [activeChunkIndex, setActiveChunkIndex] = useState(() => Math.floor(currentIndex / CHUNK_SIZE));

  // Sync active chunk with currentIndex whenever drawer opens or currentIndex moves
  useEffect(() => {
    if (isOpen) {
      setActiveChunkIndex(Math.floor(currentIndex / CHUNK_SIZE));
    }
  }, [isOpen, currentIndex]);

  const totalChunks = useMemo(() => {
    return Math.max(1, Math.ceil(totalChallenges / CHUNK_SIZE));
  }, [totalChallenges]);

  const currentChunkQuestions = useMemo(() => {
    if (!isOpen || totalChallenges <= 0) return [];
    const start = activeChunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, totalChallenges);
    const list = [];
    for (let i = start; i < end; i++) {
      list.push(i);
    }
    return list;
  }, [isOpen, activeChunkIndex, totalChallenges]);

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const num = parseInt(jumpInput.trim(), 10);
    if (!isNaN(num) && num >= 1 && num <= totalChallenges) {
      onSelectQuestion(num);
      onClose();
      setJumpInput("");
    }
  };

  if (!isOpen) {
    return (
      <div className="drawer-overlay" style={{ display: "none" }} />
    );
  }

  return (
    <>
      <div
        className="drawer-overlay active"
        onClick={onClose}
      />
      <aside className="drawer active">
        <div className="drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ListOrdered size={20} strokeWidth={2} />
            <h3 style={{ margin: 0, fontSize: "1.05rem" }}>Danh sách câu ({totalChallenges})</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Quick Jump Input */}
          <form
            onSubmit={handleJumpSubmit}
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border-color, #e2e8f0)",
            }}
          >
            <input
              type="number"
              min="1"
              max={totalChallenges}
              placeholder={`Nhập số câu (1 - ${totalChallenges})...`}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="dictation-input"
              style={{
                flex: 1,
                padding: "7px 12px",
                fontSize: "0.85rem",
                borderRadius: "6px",
                border: "1px solid var(--border-color, #cbd5e1)",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-with-icon"
              style={{ padding: "6px 12px", fontSize: "0.85rem", flexShrink: 0 }}
            >
              <span>Đến câu</span>
              <CornerDownLeft size={14} />
            </button>
          </form>

          {/* Chunk Navigator for videos with > 100 questions */}
          {totalChunks > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                padding: "6px 10px",
                borderRadius: "8px",
                background: "var(--bg-secondary, #f8fafc)",
                border: "1px solid var(--border-color, #e2e8f0)",
                fontSize: "0.83rem",
              }}
            >
              <button
                className="btn btn-secondary btn-icon"
                disabled={activeChunkIndex <= 0}
                onClick={() => setActiveChunkIndex((prev) => Math.max(0, prev - 1))}
                style={{ padding: "4px 8px" }}
                title="Nhóm 100 câu trước"
              >
                <ChevronLeft size={16} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Nhóm:</span>
                <select
                  value={activeChunkIndex}
                  onChange={(e) => setActiveChunkIndex(Number(e.target.value))}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color, #cbd5e1)",
                    background: "var(--bg-card, #ffffff)",
                    color: "var(--text-primary, #0f172a)",
                    fontSize: "0.83rem",
                    fontWeight: 600,
                  }}
                >
                  {Array.from({ length: totalChunks }, (_, idx) => {
                    const startNum = idx * CHUNK_SIZE + 1;
                    const endNum = Math.min((idx + 1) * CHUNK_SIZE, totalChallenges);
                    return (
                      <option key={idx} value={idx}>
                        Câu {startNum} - {endNum}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                className="btn btn-secondary btn-icon"
                disabled={activeChunkIndex >= totalChunks - 1}
                onClick={() => setActiveChunkIndex((prev) => Math.min(totalChunks - 1, prev + 1))}
                style={{ padding: "4px 8px" }}
                title="Nhóm 100 câu kế tiếp"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

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
            {currentChunkQuestions.map((i) => {
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


