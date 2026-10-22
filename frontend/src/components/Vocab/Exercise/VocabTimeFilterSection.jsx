import React from "react";
import { Calendar, Sparkles, Clock } from "../../Icons";
import { TIME_RANGE_OPTIONS } from "../../../utils/vocabTimeFilterUtils";

/**
 * Filter Section to choose word creation time range
 * Allows instant scanning of vocabulary saved within specific time frames.
 */
export const VocabTimeFilterSection = ({
  timeRange = "ALL",
  onSelectTimeRange,
  customStartDate = "",
  onCustomStartDateChange,
  customEndDate = "",
  onCustomEndDateChange,
  timeCounts = {},
  scannedCount = 0,
}) => {
  return (
    <div className="ex-time-filter-section">
      <div className="ex-time-filter-header">
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={15} color="var(--primary)" />
          <span className="ex-time-filter-title">Thời gian lưu từ vựng:</span>
        </div>
        <div className="ex-time-scanned-badge" title="Số từ vựng quét được trong khoảng thời gian này">
          <Sparkles size={13} color="#f59e0b" />
          <span>Quét được: <strong>{scannedCount}</strong> từ</span>
        </div>
      </div>

      <div className="ex-time-filter-pills">
        {TIME_RANGE_OPTIONS.map((opt) => {
          const isSelected = timeRange === opt.key;
          const count = timeCounts[opt.key];
          const hasCount = typeof count === "number" && opt.key !== "CUSTOM";

          return (
            <button
              key={opt.key}
              type="button"
              className={`ex-time-pill-btn ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectTimeRange && onSelectTimeRange(opt.key)}
            >
              <span>{opt.shortLabel}</span>
              {hasCount && (
                <span className="ex-time-pill-count">{count}</span>
              )}
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
              aria-label="Từ ngày"
            />
          </div>
          <div className="ex-date-divider">➔</div>
          <div className="ex-date-field">
            <span className="ex-date-label">
              <Calendar size={13} /> Đến ngày:
            </span>
            <input
              type="date"
              className="ex-date-input"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange && onCustomEndDateChange(e.target.value)}
              aria-label="Đến ngày"
            />
          </div>
        </div>
      )}
    </div>
  );
};
