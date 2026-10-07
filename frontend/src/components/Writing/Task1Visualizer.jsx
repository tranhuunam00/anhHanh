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

// 2. Bar Chart Viewer
const BarChartViewer = ({ data }) => {
  const categories = data.categories || [];
  const series = data.series || [];

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

      {/* Grouped Bar Bars */}
      <div className="bars-group-container">
        {categories.map((cat, cIdx) => (
          <div key={cIdx} className="bar-group-card">
            <div className="bar-group-cat-title">{cat}</div>
            <div className="bar-group-bars-row">
              {series.map((s, sIdx) => {
                const val = s.data?.[cIdx] || 0;
                return (
                  <div key={sIdx} className="single-bar-column">
                    <div className="bar-pill-outer">
                      <div className="bar-pill-inner" style={{ height: `${Math.min(100, Math.max(12, val))}%`, backgroundColor: s.color }}>
                        <span className="bar-value-text">{val}%</span>
                      </div>
                    </div>
                    <span className="bar-series-name">{s.name.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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

// 6. Map Redevelopment Comparison Viewer
const MapViewer = ({ data }) => {
  const periodA = data.period_a;
  const periodB = data.period_b;

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
    </div>
  );
};
