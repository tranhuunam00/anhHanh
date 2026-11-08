import React from "react";
import { Calendar, Sparkles, Clock, CheckCircle, ArrowRight } from "../../Icons";
import { TIME_RANGE_OPTIONS } from "../../../utils/vocabTimeFilterUtils";

/**
 * Filter Section to choose word creation time range (created_at)
 * AND word mastery time range (mastered_at - "Thời gian ấn thuộc / đã nhớ").
 */
export const VocabTimeFilterSection = ({
  timeRange = "ALL",
  onSelectTimeRange,
  customStartDate = "",
  onCustomStartDateChange,
  customEndDate = "",
  onCustomEndDateChange,
  timeCounts = {},
  masteredTimeRange = "ALL",
  onSelectMasteredTimeRange,
  masteredStartDate = "",
  onMasteredStartDateChange,
  masteredEndDate = "",
  onMasteredEndDateChange,
  masteredTimeCounts = {},
  scannedCount = 0,
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* 1. Filter by Creation Date (Thời gian lưu từ vựng) */}
      <div className="ex-time-filter-section">
        <div className="ex-time-filter-header">
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Clock size={15} color="var(--primary)" />
            <span className="ex-time-filter-title">Thời gian lưu từ vựng:</span>
          </div>
          <div className="ex-time-scanned-badge" title="Số từ vựng quét được theo bộ lọc hiện tại">
            <Sparkles size={13} color="#f59e0b" />
            <span>
              Quét được: <strong>{scannedCount}</strong> từ
            </span>
          </div>
        </div>

        <div className="ex-time-filter-pills">
          {TIME_RANGE_OPTIONS.map((opt) => {
            const isSelected = timeRange === opt.key;
            const count = timeCounts[opt.key];
            const hasCount = typeof count === "number" && opt.key !== "CUSTOM";

            return (
              <button
                key={`created-${opt.key}`}
                type="button"
                className={`ex-time-pill-btn ${isSelected ? "selected" : ""}`}
                onClick={() => onSelectTimeRange && onSelectTimeRange(opt.key)}
              >
                <span>{opt.shortLabel}</span>
                {hasCount && <span className="ex-time-pill-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {timeRange === "CUSTOM" && (
          <div className="ex-custom-date-container">
            <div className="ex-date-field">
              <span className="ex-date-label">
                <Calendar size={13} /> Từ ngày:
              </span>
              <input
                type="date"
                className="ex-date-input"
                value={customStartDate}
                onChange={(e) => onCustomStartDateChange && onCustomStartDateChange(e.target.value)}
                aria-label="Lưu từ ngày"
              />
            </div>
            <div className="ex-date-divider">
              <ArrowRight size={14} />
            </div>
            <div className="ex-date-field">
              <span className="ex-date-label">
                <Calendar size={13} /> Đến ngày:
              </span>
              <input
                type="date"
                className="ex-date-input"
                value={customEndDate}
                onChange={(e) => onCustomEndDateChange && onCustomEndDateChange(e.target.value)}
                aria-label="Lưu đến ngày"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Filter by Mastered Date (Thời gian ấn thuộc / Đã nhớ khi nào) */}
      {onSelectMasteredTimeRange && (
        <div className="ex-time-filter-section">
          <div className="ex-time-filter-header">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={15} color="#10b981" />
              <span className="ex-time-filter-title">
                Thời gian ấn thuộc (Kiểm tra lại từ đã nhớ):
              </span>
            </div>
            <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>
              Lọc theo thời điểm chuyển sang <strong>Đã thuộc</strong>
            </span>
          </div>

          <div className="ex-time-filter-pills">
            {TIME_RANGE_OPTIONS.map((opt) => {
              const isSelected = masteredTimeRange === opt.key;
              const count = masteredTimeCounts[opt.key];
              const hasCount = typeof count === "number" && opt.key !== "CUSTOM";

              return (
                <button
                  key={`mastered-${opt.key}`}
                  type="button"
                  className={`ex-time-pill-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => onSelectMasteredTimeRange(opt.key)}
                >
                  <span>{opt.key === "ALL" ? "Tất cả" : `Thuộc: ${opt.shortLabel}`}</span>
                  {hasCount && <span className="ex-time-pill-count">{count}</span>}
                </button>
              );
            })}
          </div>

          {masteredTimeRange === "CUSTOM" && (
            <div className="ex-custom-date-container">
              <div className="ex-date-field">
                <span className="ex-date-label">
                  <Calendar size={13} /> Thuộc từ ngày:
                </span>
                <input
                  type="date"
                  className="ex-date-input"
                  value={masteredStartDate}
                  onChange={(e) =>
                    onMasteredStartDateChange && onMasteredStartDateChange(e.target.value)
                  }
                  aria-label="Thuộc từ ngày"
                />
              </div>
              <div className="ex-date-divider">
                <ArrowRight size={14} />
              </div>
              <div className="ex-date-field">
                <span className="ex-date-label">
                  <Calendar size={13} /> Đến ngày:
                </span>
                <input
                  type="date"
                  className="ex-date-input"
                  value={masteredEndDate}
                  onChange={(e) =>
                    onMasteredEndDateChange && onMasteredEndDateChange(e.target.value)
                  }
                  aria-label="Thuộc đến ngày"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
