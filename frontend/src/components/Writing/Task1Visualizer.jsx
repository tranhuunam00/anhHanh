import React, { useMemo } from "react";
import { IconBook, IconSparkles } from "../Icons";

/**
 * Visual renderer for IELTS Writing Task 1
 * Supports: Line Graphs, Bar Charts, Pie Charts, Tables, Industrial Processes, and Map Comparisons.
 */
export const Task1Visualizer = ({ visualData, promptData, subType = "line_graph" }) => {
  // If visualData is provided directly in prompt
  const data = useMemo(() => {
    if (visualData && visualData.type) return visualData;
    if (promptData?.visual_data && promptData.visual_data.type) return promptData.visual_data;

    // Smart fallback parser based on prompt text
    const text = promptData?.prompt || "";
    const type = subType || promptData?.sub_type || "line_graph";

    if (type === "process") {
      // Extract steps from text
      const stepMatches = text.match(/(?:(?:Bước|\d+\.|\bStage\s+\d+:?)\s*)([^\n.->]+)/gi);
      const steps = stepMatches
        ? stepMatches.map((m, i) => ({
            step: i + 1,
            title: `Bước ${i + 1}`,
            desc: m.replace(/^(?:Bước|\d+\.|\bStage\s+\d+:?)\s*/i, "").trim(),
          }))
        : [
            { step: 1, title: "Thu gom & Phân loại", desc: "Thu gom nguyên liệu thô đầu vào." },
            { step: 2, title: "Xử lý & Phối trộn", desc: "Làm sạch và đưa vào bồn khuấy trộn." },
            { step: 3, title: "Gia nhiệt & Phản ứng", desc: "Nung ở nhiệt độ cao để chuyển hóa." },
            { step: 4, title: "Hoàn thiện & Đóng gói", desc: "Đóng gói thành phẩm và phân phối." },
          ];
      return {
        type: "process",
        title: promptData?.title || "Sơ đồ quy trình (Industrial Process Flowchart)",
        process_a: {
          title: "Các giai đoạn tuần tự",
          steps,
        },
      };
    }

    if (type === "map") {
      return {
        type: "map",
        title: promptData?.title || "Bản đồ quy hoạch & Phát triển hạ tầng",
        period_a: {
          year: "Thời điểm trước (Past)",
          zones: [
            { area: "Phía Bắc", name: "Khu vực tự nhiên / Công trình cũ", status: "existing" },
            { area: "Phía Đông", name: "Đất trống / Nông nghiệp", status: "demolished" },
            { area: "Trung tâm", name: "Khu dân cư ban đầu", status: "existing" },
          ],
        },
        period_b: {
          year: "Thời điểm hiện tại (Present)",
          zones: [
            { area: "Phía Bắc", name: "Khu công viên / Đường đi bộ mới", status: "new" },
            { area: "Phía Đông", name: "Khu đô thị cư dân mới xây dựng", status: "new" },
            { area: "Trung tâm", name: "Mở rộng cơ sở hạ tầng & Dịch vụ", status: "expanded" },
          ],
        },
      };
    }

    if (type === "pie_chart") {
      return {
        type: "pie_chart",
        title: promptData?.title || "Cơ cấu tỷ lệ phần trăm",
        unit: "%",
        charts: [
          {
            label: "Giai đoạn 1",
            slices: [
              { name: "Nhóm A", value: 55, color: "#3b82f6" },
              { name: "Nhóm B", value: 30, color: "#10b981" },
              { name: "Nhóm C", value: 15, color: "#f59e0b" },
            ],
          },
          {
            label: "Giai đoạn 2",
            slices: [
              { name: "Nhóm A", value: 35, color: "#3b82f6" },
              { name: "Nhóm B", value: 45, color: "#10b981" },
              { name: "Nhóm C", value: 20, color: "#f59e0b" },
            ],
          },
        ],
      };
    }

    if (type === "table") {
      return {
        type: "table",
        title: promptData?.title || "Bảng số liệu thống kê so sánh",
        columns: ["Đối tượng", "Mốc 1", "Mốc 2", "Thay đổi"],
        rows: [
          ["Khu vực A", "25.0", "48.5", "+23.5"],
          ["Khu vực B", "18.2", "32.0", "+13.8"],
          ["Khu vực C", "12.0", "15.4", "+3.4"],
        ],
      };
    }

    if (type === "bar_chart") {
      return {
        type: "bar_chart",
        title: promptData?.title || "Biểu đồ cột so sánh số liệu",
        unit: "%",
        categories: ["Hạng mục 1", "Hạng mục 2", "Hạng mục 3", "Hạng mục 4"],
        series: [
          {"name": "Nhóm A", "color": "#3b82f6", "data": [65, 45, 75, 30]},
          {"name": "Nhóm B", "color": "#ec4899", "data": [35, 55, 25, 70]},
        ],
      };
    }

    // Default to line_graph
    return {
      type: "line_graph",
      title: promptData?.title || "Biểu đồ xu hướng số liệu theo thời gian",
      unit: "Số lượng / Tỷ lệ",
      x_labels: ["2010", "2015", "2020", "2025"],
      series: [
        {"name": "Đối tượng 1", "color": "#3b82f6", "data": [20, 35, 50, 75]},
        {"name": "Đối tượng 2", "color": "#10b981", "data": [45, 40, 38, 30]},
        {"name": "Đối tượng 3", "color": "#f59e0b", "data": [10, 15, 25, 40]},
      ],
    };
  }, [visualData, promptData, subType]);

  if (!data) return null;

  return (
    <div className="task1-visual-container">
      <div className="task1-visual-header">
        <span className="task1-badge">IELTS TASK 1 DATA & VISUALS</span>
        <h4 className="task1-visual-title">{data.title}</h4>
      </div>

      {/* Render according to visual type */}
      {data.type === "line_graph" && <LineGraphViewer data={data} />}
      {data.type === "bar_chart" && <BarChartViewer data={data} />}
      {data.type === "pie_chart" && <PieChartViewer data={data} />}
      {data.type === "table" && <TableViewer data={data} />}
      {data.type === "process" && <ProcessViewer data={data} />}
      {data.type === "map" && <MapViewer data={data} />}
    </div>
  );
};

// 1. Line Graph Viewer (SVG multi-line chart + data table)
const LineGraphViewer = ({ data }) => {
  const xLabels = data.x_labels || ["1980", "1990", "2000", "2010"];
  const series = data.series || [];

  // Compute max value for scaling
  const allValues = series.flatMap((s) => s.data || []);
  const maxVal = Math.max(...allValues, 40);
  const chartHeight = 160;
  const chartWidth = 380;
  const paddingLeft = 35;
  const paddingBottom = 25;
  const paddingTop = 15;
  const paddingRight = 15;

  const getX = (index) => {
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    return paddingLeft + (index / (xLabels.length - 1)) * usableWidth;
  };

  const getY = (val) => {
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    return chartHeight - paddingBottom - (val / (maxVal * 1.15)) * usableHeight;
  };

  return (
    <div className="visual-block line-graph-block">
      {/* Legend */}
      <div className="visual-legend">
        {series.map((s, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color-dot" style={{ backgroundColor: s.color }}></span>
            <span className="legend-name">{s.name}</span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="svg-chart-wrapper">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="task1-svg-chart">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const val = Math.round(maxVal * 1.15 * pct);
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="rgba(148, 163, 184, 0.25)" strokeDasharray="3 3" />
                <text x={paddingLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">
                  {val}
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {xLabels.map((lbl, i) => (
            <text key={i} x={getX(i)} y={chartHeight - 6} textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">
              {lbl}
            </text>
          ))}

          {/* Lines and dots */}
          {series.map((s, sIdx) => {
            const points = (s.data || []).map((val, idx) => `${getX(idx)},${getY(val)}`).join(" ");
            return (
              <g key={sIdx}>
                <polyline fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
                {(s.data || []).map((val, pIdx) => (
                  <circle key={pIdx} cx={getX(pIdx)} cy={getY(val)} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Compact Data Table */}
      <div className="visual-data-table-wrapper">
        <table className="task1-data-table">
          <thead>
            <tr>
              <th>Đối tượng ({data.unit || "%"})</th>
              {xLabels.map((x, i) => <th key={i}>{x}</th>)}
            </tr>
          </thead>
          <tbody>
            {series.map((s, idx) => (
              <tr key={idx}>
                <td>
                  <span className="table-row-dot" style={{ backgroundColor: s.color }}></span>
                  <strong>{s.name}</strong>
                </td>
                {(s.data || []).map((val, vIdx) => (
                  <td key={vIdx}>{val}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 2. Bar Chart Viewer (SVG standard IELTS format)
const BarChartViewer = ({ data }) => {
  const categories = data.categories || [];
  const series = data.series || [];

  const maxVal = useMemo(() => {
    let max = 0;
    series.forEach((s) => {
      (s.data || []).forEach((v) => {
        if (typeof v === "number" && v > max) max = v;
      });
    });
    return Math.max(max, 10);
  }, [series]);

  // SVG dimensions
  const chartWidth = 520;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const yMax = Math.ceil(maxVal * 1.15 / 10) * 10;

  const getY = (val) => {
    return chartHeight - paddingBottom - (val / yMax) * usableHeight;
  };

  const groupWidth = categories.length > 0 ? usableWidth / categories.length : usableWidth;
  const barWidth = Math.max(6, Math.min(22, (groupWidth * 0.7) / Math.max(1, series.length)));

  return (
    <div className="visual-block bar-chart-block">
      {/* Legend */}
      <div className="visual-legend">
        {series.map((s, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color-dot" style={{ backgroundColor: s.color }}></span>
            <span className="legend-name">{s.name}</span>
          </div>
        ))}
      </div>

      {/* SVG Chart */}
      <div className="svg-chart-wrapper">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="task1-svg-chart">
          {/* Y Axis Grid lines & Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const val = Math.round(yMax * pct);
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.25)"
                  strokeDasharray="3 3"
                />
                <text x={paddingLeft - 8} y={y + 3.5} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="600">
                  {val}{data.unit === "%" || !data.unit ? "%" : ""}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {categories.map((cat, cIdx) => {
            const groupCenterX = paddingLeft + (cIdx + 0.5) * groupWidth;
            const totalBarsWidth = series.length * barWidth;
            const startX = groupCenterX - totalBarsWidth / 2;

            return (
              <g key={cIdx}>
                {/* Category label on X axis */}
                <text
                  x={groupCenterX}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#475569"
                >
                  {cat}
                </text>

                {/* Bars in group */}
                {series.map((s, sIdx) => {
                  const val = s.data?.[cIdx] || 0;
                  const barX = startX + sIdx * barWidth;
                  const barY = getY(val);
                  const barH = chartHeight - paddingBottom - barY;

                  return (
                    <g key={sIdx} className="bar-hover-group">
                      <rect
                        x={barX}
                        y={barY}
                        width={barWidth - 2}
                        height={Math.max(2, barH)}
                        fill={s.color}
                        rx="3"
                        ry="3"
                      >
                        <title>{`${s.name} (${cat}): ${val}${data.unit || "%"}`}</title>
                      </rect>
                      {/* Value label on top of bar */}
                      <text
                        x={barX + (barWidth - 2) / 2}
                        y={barY - 4}
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="700"
                        fill="#334155"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Base X Axis Line */}
          <line
            x1={paddingLeft}
            y1={chartHeight - paddingBottom}
            x2={chartWidth - paddingRight}
            y2={chartHeight - paddingBottom}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Clean Compact Data Table below */}
      <div className="visual-data-table-wrapper">
        <table className="task1-data-table">
          <thead>
            <tr>
              <th>Danh mục ({data.unit || "%"})</th>
              {categories.map((cat, i) => (
                <th key={i}>{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((s, idx) => (
              <tr key={idx}>
                <td>
                  <span className="table-row-dot" style={{ backgroundColor: s.color }}></span>
                  <strong>{s.name}</strong>
                </td>
                {(s.data || []).map((val, vIdx) => (
                  <td key={vIdx}>{val}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 3. Pie Chart Viewer
const PieChartViewer = ({ data }) => {
  const charts = data.charts || [];

  return (
    <div className="visual-block pie-chart-block">
      <div className="pie-charts-row">
        {charts.map((ch, idx) => {
          let accumulatedAngle = 0;
          const slices = ch.slices || [];
          return (
            <div key={idx} className="pie-card-item">
              <h5 className="pie-card-label">{ch.label}</h5>
              <div className="pie-svg-wrapper">
                <svg viewBox="-1 -1 2 2" className="task1-pie-svg">
                  {slices.map((slice, sIdx) => {
                    const startAngle = accumulatedAngle;
                    const sliceAngle = (slice.value / 100) * 2 * Math.PI;
                    accumulatedAngle += sliceAngle;
                    const endAngle = accumulatedAngle;

                    const x1 = Math.cos(startAngle);
                    const y1 = Math.sin(startAngle);
                    const x2 = Math.cos(endAngle);
                    const y2 = Math.sin(endAngle);
                    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

                    const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                    return <path key={sIdx} d={pathData} fill={slice.color} stroke="#ffffff" strokeWidth="0.03" />;
                  })}
                </svg>
              </div>

              {/* Slices Legend */}
              <div className="pie-slice-legend">
                {slices.map((slice, sIdx) => (
                  <div key={sIdx} className="pie-legend-row">
                    <span className="pie-legend-dot" style={{ backgroundColor: slice.color }}></span>
                    <span className="pie-legend-name">{slice.name}:</span>
                    <strong className="pie-legend-val">{slice.value}%</strong>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. Table Viewer
const TableViewer = ({ data }) => {
  const columns = data.columns || [];
  const rows = data.rows || [];

  return (
    <div className="visual-block table-block">
      <div className="visual-data-table-wrapper">
        <table className="task1-data-table full-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className={cIdx === 0 ? "table-bold-cell" : ""}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 5. Industrial Process Flowchart Viewer
const ProcessViewer = ({ data }) => {
  const processA = data.process_a;
  const processB = data.process_b;

  return (
    <div className="visual-block process-block">
      {/* Process A: Step Cards */}
      {processA && (
        <div className="process-sub-section">
          <h5 className="process-section-title">{processA.title}</h5>
          <div className="process-flow-track">
            {(processA.steps || []).map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="process-step-node">
                  <div className="step-badge">Giai đoạn {step.step}</div>
                  <div className="step-card-content">
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
                {idx < processA.steps.length - 1 && (
                  <div className="process-arrow-divider">➔</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Process B (Recipe / Secondary Stage if available) */}
      {processB && (
        <div className="process-sub-section stage2-box">
          <h5 className="process-section-title">{processB.title}</h5>
          <div className="concrete-recipe-bar">
            {(processB.ingredients || []).map((ing, iIdx) => (
              <div
                key={iIdx}
                className="recipe-bar-segment"
                style={{ width: `${ing.pct}%`, backgroundColor: ing.color }}
                title={`${ing.name}: ${ing.pct}%`}
              >
                <span>{ing.name} ({ing.pct}%)</span>
              </div>
            ))}
          </div>
          {processB.machine && (
            <div className="process-machine-note">
              ⚙️ <strong>Thiết bị:</strong> {processB.machine}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 6. Map Redevelopment Comparison Viewer (Real Exam Image + Authentic IELTS SVG Maps + Data Breakdown)
const MapViewer = ({ data }) => {
  const periodA = data.period_a;
  const periodB = data.period_b;

  const isLakeside =
    data.map_preset === "lakeside" ||
    (data.title || "").toLowerCase().includes("lakeside") ||
    (periodA?.year || "").toLowerCase().includes("lakeside");

  const isIsland =
    data.map_preset === "island_resort" ||
    (data.title || "").toLowerCase().includes("island") ||
    (periodA?.year || "").toLowerCase().includes("before");

  const imageUrl =
    data.image_url ||
    (isLakeside ? "/images/writing/lakeside_map.png" : isIsland ? "/images/writing/island_map.png" : null);

  const [viewMode, setViewMode] = useState(imageUrl ? "image" : "visual"); // "image" | "visual" | "breakdown"

  const renderStatusTag = (status) => {
    switch (status) {
      case "new":
        return <span className="map-tag new">🟢 Xây mới</span>;
      case "demolished":
        return <span className="map-tag demolished">🔴 Đã xóa bỏ/thay thế</span>;
      case "expanded":
        return <span className="map-tag expanded">🟡 Mở rộng</span>;
      case "converted":
        return <span className="map-tag converted">🟣 Cải tạo công năng</span>;
      default:
        return <span className="map-tag unchanged">⚪ Giữ nguyên</span>;
    }
  };

  return (
    <div className="visual-block map-block">
      {/* Mode toggle bar */}
      <div className="map-view-mode-bar">
        {imageUrl && (
          <button
            type="button"
            className={`btn-map-mode ${viewMode === "image" ? "active" : ""}`}
            onClick={() => setViewMode("image")}
          >
            🖼️ Ảnh đề thi thật Cambridge
          </button>
        )}
        <button
          type="button"
          className={`btn-map-mode ${viewMode === "visual" ? "active" : ""}`}
          onClick={() => setViewMode("visual")}
        >
          🗺️ Bản đồ số hóa 2D (Vector SVG)
        </button>
        <button
          type="button"
          className={`btn-map-mode ${viewMode === "breakdown" ? "active" : ""}`}
          onClick={() => setViewMode("breakdown")}
        >
          📋 Bảng số liệu chi tiết
        </button>
      </div>

      {viewMode === "image" && imageUrl ? (
        <div className="map-real-image-container">
          <img src={imageUrl} alt={data.title || "IELTS Map"} className="map-real-exam-image" />
        </div>
      ) : viewMode === "visual" ? (
        <div className="map-svg-comparison-wrap">
          {isLakeside ? (
            <LakesideComparisonView periodA={periodA} periodB={periodB} />
          ) : isIsland ? (
            <IslandComparisonView periodA={periodA} periodB={periodB} />
          ) : (
            <DynamicMapComparisonView periodA={periodA} periodB={periodB} title={data.title} />
          )}
        </div>
      ) : (
        <div className="map-periods-comparison-grid">
          {/* Period A */}
          {periodA && (
            <div className="map-period-card">
              <div className="map-period-header past">
                <span className="map-period-year">{periodA.year}</span>
              </div>
              <div className="map-zones-list">
                {(periodA.zones || []).map((zone, zIdx) => (
                  <div key={zIdx} className="map-zone-item">
                    <div className="zone-name-row">
                      <span className="zone-area-badge">{zone.area}</span>
                      <span className="zone-name">{zone.name}</span>
                    </div>
                    {renderStatusTag(zone.status)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Period B */}
          {periodB && (
            <div className="map-period-card">
              <div className="map-period-header present">
                <span className="map-period-year">{periodB.year}</span>
              </div>
              <div className="map-zones-list">
                {(periodB.zones || []).map((zone, zIdx) => (
                  <div key={zIdx} className="map-zone-item">
                    <div className="zone-name-row">
                      <span className="zone-area-badge">{zone.area}</span>
                      <span className="zone-name">{zone.name}</span>
                    </div>
                    {renderStatusTag(zone.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 6a. Lakeside 2000 vs 2009 SVG Visual Map (Exact Cambridge reproduction)
const LakesideComparisonView = ({ periodA, periodB }) => {
  return (
    <div className="lakeside-svg-grid">
      {/* 2000 */}
      <div className="svg-map-card">
        <div className="svg-map-card-header past">
          <h5>{periodA?.year || "Lake side 2000"}</h5>
        </div>
        <div className="svg-canvas-wrapper">
          <svg viewBox="0 0 350 330" className="ielts-map-svg">
            <rect width="350" height="330" fill="#fdfbf7" stroke="#334155" strokeWidth="1.5" />

            {/* Woodland */}
            <path
              d="M 235 15 C 280 15, 335 25, 335 90 C 335 180, 310 240, 290 270 L 275 270 C 250 220, 235 160, 235 90 Z"
              fill="#84cc16"
              stroke="#3f6212"
              strokeWidth="1.5"
            />
            <text x="285" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill="#14532d">
              Woodland
            </text>

            {/* Lake */}
            <path
              d="M 248 65 C 270 50, 305 45, 315 70 C 322 88, 308 108, 280 108 C 260 108, 250 92, 248 65 Z"
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            <text x="282" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">
              Lake
            </text>

            {/* River */}
            <path
              d="M 12 300 C 45 270, 20 225, 70 195 C 120 165, 140 135, 165 95 C 185 68, 215 52, 250 48"
              fill="none"
              stroke="#0284c7"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 12 300 C 45 270, 20 225, 70 195 C 120 165, 140 135, 165 95 C 185 68, 215 52, 250 48"
              fill="none"
              stroke="#0369a1"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* River label and flow arrow */}
            <line x1="120" y1="245" x2="65" y2="245" stroke="#1e293b" strokeWidth="1.5" markerEnd="url(#arrow)" />
            <polygon points="65,245 72,241 72,249" fill="#1e293b" />
            <text x="100" y="249" fontSize="10" fontWeight="600" fill="#1e293b">
              River
            </text>

            {/* Buildings / Zones */}
            {/* 1. Residential area (Top-West) */}
            <rect x="15" y="15" width="85" height="85" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="57" y="52" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#1e293b">
              <tspan x="57" dy="0">Residential</tspan>
              <tspan x="57" dy="14">area</tspan>
            </text>

            {/* 2. Derelict warehouses */}
            <rect x="110" y="15" width="95" height="40" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="157" y="32" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">
              <tspan x="157" dy="0">Derelict</tspan>
              <tspan x="157" dy="13">warehouses</tspan>
            </text>

            {/* 3. Old Town */}
            <rect x="110" y="65" width="95" height="50" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="157" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">
              Old Town
            </text>

            {/* 4. Arts Centre */}
            <rect x="12" y="112" width="70" height="35" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="47" y="127" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#1e293b">
              <tspan x="47" dy="0">Arts</tspan>
              <tspan x="47" dy="12">Centre</tspan>
            </text>

            {/* 5. School */}
            <rect x="88" y="116" width="75" height="30" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="125" y="135" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#1e293b">
              School
            </text>

            {/* 6. Residential area (Lower-West) */}
            <rect x="15" y="156" width="130" height="50" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="80" y="186" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e293b">
              Residential area
            </text>

            {/* 7. Industrial complex (East of river) */}
            <rect x="180" y="180" width="65" height="48" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="212" y="200" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#1e293b">
              <tspan x="212" dy="0">Industrial</tspan>
              <tspan x="212" dy="13">complex</tspan>
            </text>

            {/* 8. Residential area (South) */}
            <rect x="145" y="260" width="145" height="26" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="217" y="277" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">
              Residential area
            </text>

            {/* Compass */}
            <g transform="translate(90, 275)">
              <line x1="0" y1="20" x2="0" y2="-12" stroke="#1e293b" strokeWidth="1.5" />
              <polygon points="0,-16 -4,-9 4,-9" fill="#1e293b" />
              <line x1="-10" y1="5" x2="10" y2="5" stroke="#1e293b" strokeWidth="1.5" />
              <text x="0" y="-20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">
                N
              </text>
            </g>

            {/* Bottom Title */}
            <text x="175" y="318" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">
              Lake side 2000
            </text>
          </svg>
        </div>
      </div>

      {/* 2009 */}
      <div className="svg-map-card">
        <div className="svg-map-card-header present">
          <h5>{periodB?.year || "Lake side 2009"}</h5>
        </div>
        <div className="svg-canvas-wrapper">
          <svg viewBox="0 0 350 330" className="ielts-map-svg">
            <rect width="350" height="330" fill="#fdfbf7" stroke="#334155" strokeWidth="1.5" />

            {/* Woodland (shrunk) */}
            <path
              d="M 270 15 C 300 15, 335 25, 335 85 C 335 150, 320 200, 305 210 L 290 200 C 275 160, 270 100, 270 45 Z"
              fill="#84cc16"
              stroke="#3f6212"
              strokeWidth="1.5"
            />
            <text x="305" y="38" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#14532d">
              Woodland
            </text>

            {/* Pond */}
            <path
              d="M 290 65 C 305 55, 325 55, 330 72 C 330 85, 318 95, 302 95 C 290 95, 285 82, 290 65 Z"
              fill="#0284c7"
              stroke="#0369a1"
              strokeWidth="1.5"
            />
            <text x="310" y="80" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#ffffff">
              Pond
            </text>

            {/* River */}
            <path
              d="M 12 300 C 45 270, 20 225, 70 195 C 120 165, 140 135, 165 95 C 185 68, 215 52, 250 48"
              fill="none"
              stroke="#0284c7"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 12 300 C 45 270, 20 225, 70 195 C 120 165, 140 135, 165 95 C 185 68, 215 52, 250 48"
              fill="none"
              stroke="#0369a1"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <line x1="120" y1="245" x2="65" y2="245" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="65,245 72,241 72,249" fill="#1e293b" />
            <text x="100" y="249" fontSize="10" fontWeight="600" fill="#1e293b">
              River
            </text>

            {/* Buildings / Zones */}
            {/* 1. Residential area (retained) */}
            <rect x="15" y="15" width="85" height="85" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="57" y="52" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#1e293b">
              <tspan x="57" dy="0">Residential</tspan>
              <tspan x="57" dy="14">area</tspan>
            </text>

            {/* 2. Car park */}
            <rect x="110" y="15" width="95" height="28" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="157" y="33" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">
              Car park
            </text>

            {/* 3. Offices (Triangular block) */}
            <polygon points="110,48 205,48 110,118" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="145" y="75" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">
              Offices
            </text>

            {/* 4. University */}
            <rect x="160" y="82" width="75" height="25" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="197" y="98" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1e293b">
              University
            </text>

            {/* 5. School (retained) */}
            <rect x="115" y="110" width="60" height="28" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="145" y="128" textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">
              School
            </text>

            {/* 6. Multi-screen cinema (replaced Arts Centre) */}
            <rect x="10" y="105" width="90" height="32" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="55" y="118" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#1e293b">
              <tspan x="55" dy="0">Multi - screen</tspan>
              <tspan x="55" dy="11">cinema</tspan>
            </text>

            {/* 7. Shopping centre (replaced Residential Area) */}
            <rect x="15" y="145" width="125" height="50" fill="#fef9c3" stroke="#1e293b" strokeWidth="1.5" />
            <text x="77" y="175" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1e293b">
              Shopping centre
            </text>

            {/* 8. Industrial complex (GREATLY EXPANDED) */}
            <rect x="180" y="145" width="115" height="135" fill="#fef9c3" stroke="#1e293b" strokeWidth="2" />
            <text x="237" y="210" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e293b">
              <tspan x="237" dy="0">Industrial</tspan>
              <tspan x="237" dy="16">complex</tspan>
            </text>

            {/* Compass */}
            <g transform="translate(90, 275)">
              <line x1="0" y1="20" x2="0" y2="-12" stroke="#1e293b" strokeWidth="1.5" />
              <polygon points="0,-16 -4,-9 4,-9" fill="#1e293b" />
              <line x1="-10" y1="5" x2="10" y2="5" stroke="#1e293b" strokeWidth="1.5" />
              <text x="0" y="-20" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e293b">
                N
              </text>
            </g>

            {/* Bottom Title */}
            <text x="175" y="318" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">
              Lake side 2009
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
};

// 6b. Island Resort Before vs After SVG Visual Map (Exact Cambridge reproduction)
const IslandComparisonView = ({ periodA, periodB }) => {
  return (
    <div className="island-svg-stack">
      {/* Before */}
      <div className="svg-map-card island-card">
        <div className="svg-map-card-header past">
          <h5>{periodA?.year || "Before"}</h5>
        </div>
        <div className="svg-canvas-wrapper">
          <svg viewBox="0 0 500 170" className="ielts-map-svg">
            <rect width="500" height="170" fill="#f0f9ff" />
            {/* Sea labels */}
            <text x="140" y="35" fontSize="12" fontWeight="600" fill="#0369a1" fontStyle="italic">
              Sea
            </text>
            <text x="270" y="155" fontSize="12" fontWeight="600" fill="#0369a1" fontStyle="italic">
              Sea
            </text>

            {/* Island Shoreline Shading */}
            <path
              d="M 60 85 C 90 45, 200 35, 340 30 C 440 25, 480 60, 485 90 C 490 120, 450 150, 360 155 C 240 160, 150 155, 95 135 C 70 125, 45 105, 60 85 Z"
              fill="#d97706"
              opacity="0.3"
            />
            {/* Island body */}
            <path
              d="M 60 80 C 90 40, 200 30, 340 25 C 440 20, 478 55, 483 85 C 488 115, 448 145, 358 150 C 238 155, 148 150, 93 130 C 68 120, 45 100, 60 80 Z"
              fill="#fef3c7"
              stroke="#1e293b"
              strokeWidth="1.8"
            />

            {/* Beach (Western tip) */}
            <path
              d="M 60 80 C 40 85, 30 100, 50 115 C 65 125, 80 125, 93 130"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x="45" y="102" fontSize="9.5" fontWeight="600" fill="#1e293b">
              Beach
            </text>

            {/* Palm trees before development */}
            {/* West trees */}
            <g transform="translate(150, 80)">
              <text fontSize="18" textAnchor="middle">🌴</text>
            </g>
            <g transform="translate(170, 88)">
              <text fontSize="16" textAnchor="middle">🌴</text>
            </g>

            {/* North-East trees */}
            <g transform="translate(320, 45)">
              <text fontSize="18" textAnchor="middle">🌴</text>
            </g>
            <g transform="translate(340, 40)">
              <text fontSize="16" textAnchor="middle">🌴</text>
            </g>
            <g transform="translate(370, 50)">
              <text fontSize="18" textAnchor="middle">🌴</text>
            </g>

            {/* South-East trees */}
            <g transform="translate(360, 95)">
              <text fontSize="18" textAnchor="middle">🌴</text>
            </g>
            <g transform="translate(385, 105)">
              <text fontSize="17" textAnchor="middle">🌴</text>
            </g>

            {/* Scale bar */}
            <g transform="translate(140, 155)">
              <rect x="0" y="0" width="130" height="4" fill="#1e293b" />
              <line x1="0" y1="-2" x2="0" y2="6" stroke="#1e293b" strokeWidth="2" />
              <line x1="65" y1="-2" x2="65" y2="6" stroke="#1e293b" strokeWidth="2" />
              <line x1="130" y1="-2" x2="130" y2="6" stroke="#1e293b" strokeWidth="2" />
              <text x="65" y="12" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1e293b">
                100 Metres
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* After */}
      <div className="svg-map-card island-card">
        <div className="svg-map-card-header present">
          <h5>{periodB?.year || "After"}</h5>
        </div>
        <div className="svg-canvas-wrapper">
          <svg viewBox="0 0 500 210" className="ielts-map-svg">
            <rect width="500" height="210" fill="#f0f9ff" />

            {/* Sea labels */}
            <text x="150" y="35" fontSize="12" fontWeight="600" fill="#0369a1" fontStyle="italic">
              Sea
            </text>

            {/* Island body */}
            <path
              d="M 60 80 C 90 40, 200 30, 340 25 C 440 20, 478 55, 483 85 C 488 115, 448 145, 358 150 C 238 155, 148 150, 93 130 C 68 120, 45 100, 60 80 Z"
              fill="#fef3c7"
              stroke="#1e293b"
              strokeWidth="1.8"
            />

            {/* Beach + Swimming label */}
            <path
              d="M 60 80 C 40 85, 30 100, 50 115 C 65 125, 80 125, 93 130"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x="45" y="100" fontSize="9" fontWeight="600" fill="#1e293b">
              Beach
            </text>
            <text x="35" y="70" fontSize="8.5" fontWeight="700" fill="#0284c7" transform="rotate(-30, 35, 70)">
              swimming
            </text>

            {/* Central Reception & Vehicle track */}
            {/* Vehicle track (double path encircling reception) */}
            <ellipse cx="215" cy="98" rx="24" ry="14" fill="none" stroke="#1e293b" strokeWidth="3" strokeDasharray="3 3" />
            {/* Reception building */}
            <rect x="202" y="90" width="26" height="16" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
            <polygon points="202,90 215,82 228,90" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <text x="215" y="117" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e293b">
              Reception
            </text>

            {/* Restaurant (North of Reception) */}
            <rect x="195" y="48" width="30" height="18" fill="#475569" stroke="#1e293b" strokeWidth="1.2" />
            <polygon points="195,48 210,40 225,48" fill="#334155" stroke="#1e293b" strokeWidth="1" />
            <text x="210" y="74" textAnchor="middle" fontSize="8" fontWeight="700" fill="#1e293b">
              Restaurant
            </text>

            {/* Vehicle track between Reception & Restaurant */}
            <line x1="215" y1="84" x2="215" y2="66" stroke="#1e293b" strokeWidth="2.5" strokeDasharray="3 2" />

            {/* Pier extending into Sea (South of Reception) */}
            <path
              d="M 215 112 L 235 140 L 290 152 M 255 144 L 270 170"
              fill="none"
              stroke="#78350f"
              strokeWidth="3.5"
            />
            <text x="260" y="136" fontSize="8.5" fontWeight="700" fill="#1e293b">
              Pier
            </text>

            {/* Sailboats / Yachts at Pier */}
            <g transform="translate(230, 150)">
              <polygon points="0,0 8,-20 16,0" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1" />
              <path d="M -4,0 L 20,0 L 16,6 L 0,6 Z" fill="#0284c7" />
            </g>
            <g transform="translate(305, 140)">
              <polygon points="0,0 7,-18 14,0" fill="#e2e8f0" stroke="#1e293b" strokeWidth="1" />
              <path d="M -3,0 L 17,0 L 14,5 L 0,5 Z" fill="#0284c7" />
            </g>

            {/* Western Accommodation Cluster (6 circular huts around palm trees) */}
            {/* Footpath from beach to west huts to reception */}
            <path
              d="M 65 95 L 120 95 L 140 85 M 140 85 C 160 80, 185 85, 202 95 M 130 95 L 130 115"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            {/* 6 Huts */}
            {[
              { x: 130, y: 75 },
              { x: 155, y: 70 },
              { x: 175, y: 82 },
              { x: 170, y: 110 },
              { x: 145, y: 118 },
              { x: 125, y: 105 },
            ].map((hut, hIdx) => (
              <g key={hIdx} transform={`translate(${hut.x}, ${hut.y})`}>
                <circle cx="0" cy="0" r="5.5" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1" />
                <polygon points="0,-7 -5.5,-1 5.5,-1" fill="#78350f" stroke="#1e293b" strokeWidth="0.8" />
              </g>
            ))}
            <text x="135" y="132" fontSize="7.5" fontWeight="700" fill="#1e293b">
              Accommodation
            </text>

            {/* Eastern Accommodation Cluster (9 circular huts in a circle) */}
            <circle cx="285" cy="85" r="22" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeDasharray="2 2" />
            {/* Connecting footpath from reception to east huts */}
            <path
              d="M 235 98 C 250 95, 260 90, 270 88"
              fill="none"
              stroke="#1e293b"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((deg, dIdx) => {
              const rad = (deg * Math.PI) / 180;
              const hx = 285 + Math.cos(rad) * 22;
              const hy = 85 + Math.sin(rad) * 22;
              return (
                <g key={dIdx} transform={`translate(${hx}, ${hy})`}>
                  <circle cx="0" cy="0" r="5" fill="#f1f5f9" stroke="#1e293b" strokeWidth="1" />
                  <polygon points="0,-6 -5,-1 5,-1" fill="#78350f" stroke="#1e293b" strokeWidth="0.8" />
                </g>
              );
            })}

            {/* Palm trees scattered on east and north */}
            <g transform="translate(350, 45)"><text fontSize="15">🌴</text></g>
            <g transform="translate(370, 50)"><text fontSize="14">🌴</text></g>
            <g transform="translate(365, 100)"><text fontSize="15">🌴</text></g>
            <g transform="translate(390, 110)"><text fontSize="14">🌴</text></g>

            {/* Legend Box */}
            <g transform="translate(330, 165)">
              <rect x="0" y="0" width="125" height="38" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
              <line x1="8" y1="12" x2="35" y2="12" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="42" y="15" fontSize="8.5" fontWeight="600" fill="#1e293b">
                Footpath
              </text>
              <line x1="8" y1="26" x2="35" y2="26" stroke="#1e293b" strokeWidth="3" strokeDasharray="3 2" />
              <text x="42" y="29" fontSize="8.5" fontWeight="600" fill="#1e293b">
                Vehicle track
              </text>
            </g>

            {/* Scale bar */}
            <g transform="translate(130, 185)">
              <rect x="0" y="0" width="130" height="4" fill="#1e293b" />
              <line x1="0" y1="-2" x2="0" y2="6" stroke="#1e293b" strokeWidth="2" />
              <line x1="65" y1="-2" x2="65" y2="6" stroke="#1e293b" strokeWidth="2" />
              <line x1="130" y1="-2" x2="130" y2="6" stroke="#1e293b" strokeWidth="2" />
              <text x="65" y="13" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#1e293b">
                100 Metres
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

// 6c. Dynamic Spatial IELTS SVG Map (For any custom or AI-generated map like Stokeford or Riverside)
const DynamicMapComparisonView = ({ periodA, periodB, title }) => {
  return (
    <div className="dynamic-map-grid">
      {periodA && <DynamicSingleMapSVG periodData={periodA} isPast={true} />}
      {periodB && <DynamicSingleMapSVG periodData={periodB} isPast={false} />}
    </div>
  );
};

// Helper for rendering a single dynamic schematic map
const DynamicSingleMapSVG = ({ periodData, isPast }) => {
  const zones = periodData?.zones || [];

  // Map zone areas to 2D coordinates
  const getZoneCoords = (areaStr, index) => {
    const a = (areaStr || "").toLowerCase();
    if (a.includes("north-east") || a.includes("đông bắc")) return { x: 235, y: 20, w: 95, h: 50 };
    if (a.includes("north-west") || a.includes("tây bắc")) return { x: 15, y: 20, w: 95, h: 50 };
    if (a.includes("north") || a.includes("bắc")) return { x: 125, y: 15, w: 95, h: 45 };
    if (a.includes("south-east") || a.includes("đông nam")) return { x: 235, y: 200, w: 95, h: 55 };
    if (a.includes("south-west") || a.includes("tây nam")) return { x: 15, y: 200, w: 95, h: 55 };
    if (a.includes("south") || a.includes("nam")) return { x: 125, y: 230, w: 95, h: 45 };
    if (a.includes("east") || a.includes("đông")) return { x: 235, y: 100, w: 95, h: 65 };
    if (a.includes("west") || a.includes("tây")) return { x: 15, y: 100, w: 95, h: 65 };
    if (a.includes("center") || a.includes("trung tâm")) return { x: 125, y: 100, w: 95, h: 75 };

    // Fallback based on index
    const col = index % 3;
    const row = Math.floor(index / 3);
    return { x: 15 + col * 110, y: 20 + row * 85, w: 95, h: 55 };
  };

  const getZoneColors = (status, name) => {
    const n = (name || "").toLowerCase();
    if (n.includes("river") || n.includes("sông") || n.includes("lake") || n.includes("hồ")) {
      return { fill: "#bae6fd", stroke: "#0284c7", text: "#0369a1" };
    }
    if (n.includes("woodland") || n.includes("forest") || n.includes("rừng") || n.includes("cây") || n.includes("park")) {
      return { fill: "#dcfce7", stroke: "#16a34a", text: "#14532d" };
    }
    if (status === "demolished") {
      return { fill: "#fee2e2", stroke: "#dc2626", text: "#991b1b" };
    }
    if (status === "new") {
      return { fill: "#ecfdf5", stroke: "#059669", text: "#065f46" };
    }
    if (status === "expanded") {
      return { fill: "#fef3c7", stroke: "#d97706", text: "#92400e" };
    }
    if (status === "converted") {
      return { fill: "#f3e8ff", stroke: "#9333ea", text: "#6b21a8" };
    }
    return { fill: "#fef9c3", stroke: "#334155", text: "#1e293b" };
  };

  return (
    <div className="svg-map-card">
      <div className={`svg-map-card-header ${isPast ? "past" : "present"}`}>
        <h5>{periodData?.year || "Map Period"}</h5>
      </div>
      <div className="svg-canvas-wrapper">
        <svg viewBox="0 0 350 310" className="ielts-map-svg">
          <rect width="350" height="310" fill="#fdfbf7" stroke="#334155" strokeWidth="1.5" />

          {/* Central Main Road network */}
          <line x1="15" y1="180" x2="335" y2="180" stroke="#94a3b8" strokeWidth="8" />
          <line x1="172" y1="15" x2="172" y2="290" stroke="#94a3b8" strokeWidth="8" />
          <line x1="15" y1="180" x2="335" y2="180" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="172" y1="15" x2="172" y2="290" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 4" />

          {/* Render individual zones */}
          {zones.map((zone, zIdx) => {
            const coords = getZoneCoords(zone.area, zIdx);
            const colors = getZoneColors(zone.status, zone.name);
            return (
              <g key={zIdx}>
                <rect
                  x={coords.x}
                  y={coords.y}
                  width={coords.w}
                  height={coords.h}
                  rx="4"
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="1.5"
                />
                {/* Zone Area Badge */}
                <rect
                  x={coords.x + 3}
                  y={coords.y + 3}
                  width={coords.w - 6}
                  height="13"
                  rx="2"
                  fill="#ffffff"
                  fillOpacity="0.8"
                />
                <text
                  x={coords.x + coords.w / 2}
                  y={coords.y + 12}
                  textAnchor="middle"
                  fontSize="7.5"
                  fontWeight="700"
                  fill="#475569"
                >
                  {zone.area}
                </text>
                {/* Zone Name text wrapped */}
                <text
                  x={coords.x + coords.w / 2}
                  y={coords.y + 25}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="600"
                  fill={colors.text}
                >
                  <tspan x={coords.x + coords.w / 2} dy="0">
                    {zone.name.slice(0, 18)}
                  </tspan>
                  {zone.name.length > 18 && (
                    <tspan x={coords.x + coords.w / 2} dy="11">
                      {zone.name.slice(18, 36)}
                    </tspan>
                  )}
                  {zone.name.length > 36 && (
                    <tspan x={coords.x + coords.w / 2} dy="11">
                      {zone.name.slice(36, 52)}...
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}

          {/* Compass Rose */}
          <g transform="translate(172, 280)">
            <line x1="0" y1="12" x2="0" y2="-10" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="0,-13 -3,-7 3,-7" fill="#1e293b" />
            <line x1="-8" y1="2" x2="8" y2="2" stroke="#1e293b" strokeWidth="1.5" />
            <text x="0" y="-16" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e293b">
              N
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
