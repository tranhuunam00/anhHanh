import React, { useState, useMemo, useEffect } from "react";
import {
  IconClose,
  IconSearch,
  IconBook,
  IconFile,
} from "../Icons";
import { IeltsPromptCard } from "./IeltsPromptCard";

const YEARS_FILTER = [
  { id: "all", label: "Tất cả các năm" },
  { id: "2026", label: "2026 (Mới nhất)" },
  { id: "2025", label: "2025" },
  { id: "2024", label: "2024" },
  { id: "cambridge", label: "Cambridge 15-19" },
  { id: "2023", label: "2023" },
  { id: "2022", label: "2022" },
  { id: "2021", label: "2021" },
  { id: "2020", label: "2020" },
];

const TASK2_SUBTYPES = [
  { id: "all", label: "Tất cả dạng Task 2" },
  { id: "opinion", label: "Agree / Disagree" },
  { id: "discussion", label: "Discuss Both Views" },
  { id: "causes_solutions", label: "Causes & Solutions" },
  { id: "advantages_disadvantages", label: "Advantages & Disadvantages" },
  { id: "two_part", label: "Two-part Question" },
];

const TASK1_SUBTYPES = [
  { id: "all", label: "Tất cả dạng Task 1" },
  { id: "line_graph", label: "Line Graph" },
  { id: "bar_chart", label: "Bar Chart" },
  { id: "pie_chart", label: "Pie Chart" },
  { id: "table", label: "Table" },
  { id: "map", label: "Map" },
  { id: "process", label: "Process" },
];

const TOPIC_CATEGORIES = [
  { id: "all", label: "Tất cả chủ đề" },
  { id: "Education", label: "Education & Youth" },
  { id: "Technology", label: "Technology & AI" },
  { id: "Environment", label: "Environment & Climate" },
  { id: "Society", label: "Society & Urbanization" },
  { id: "Work", label: "Work & Employment" },
  { id: "Economy", label: "Economy & Business" },
  { id: "Government", label: "Government & Public Policy" },
  { id: "Health", label: "Health & Diet" },
  { id: "Culture", label: "Culture & Arts" },
  { id: "Crime", label: "Crime & Law" },
];

export const IeltsPromptLibraryModal = ({
  isOpen,
  onClose,
  promptsLibrary = {},
  currentPrompt = null,
  onSelectPrompt,
}) => {
  const [activeTaskTab, setActiveTaskTab] = useState("ielts_task2"); // "ielts_task2" | "ielts_task1"
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSubType, setSelectedSubType] = useState("all");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOutlineId, setExpandedOutlineId] = useState(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Extract raw list of prompts for current task tab
  const rawList = useMemo(() => {
    const enDict = promptsLibrary?.en || promptsLibrary || {};
    return enDict[activeTaskTab] || [];
  }, [promptsLibrary, activeTaskTab]);

  // Filtered list
  const filteredPrompts = useMemo(() => {
    return rawList.filter((item) => {
      // 1. Year filter
      if (selectedYear !== "all") {
        if (selectedYear === "cambridge") {
          const isCam =
            (item.source && item.source.toLowerCase().includes("cambridge")) ||
            (item.exam_date && item.exam_date.toLowerCase().includes("cambridge")) ||
            (item.title && item.title.toLowerCase().includes("cambridge"));
          if (!isCam) return false;
        } else {
          const targetYear = parseInt(selectedYear, 10);
          if (item.year !== targetYear) {
            // Also check exam_date or source
            const yearStr = String(selectedYear);
            const matchesDate =
              (item.exam_date && item.exam_date.includes(yearStr)) ||
              (item.source && item.source.includes(yearStr));
            if (!matchesDate) return false;
          }
        }
      }

      // 2. Sub-type filter
      if (selectedSubType !== "all") {
        if (item.sub_type !== selectedSubType) return false;
      }

      // 3. Topic category filter
      if (selectedTopic !== "all") {
        const cat = (item.topic_category || "").toLowerCase();
        const targetCat = selectedTopic.toLowerCase();
        if (!cat.includes(targetCat)) return false;
      }

      // 4. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (item.title || "").toLowerCase().includes(q);
        const promptMatch = (item.prompt || "").toLowerCase().includes(q);
        const sourceMatch = (item.source || "").toLowerCase().includes(q);
        const dateMatch = (item.exam_date || "").toLowerCase().includes(q);
        const topicMatch = (item.topic_category || "").toLowerCase().includes(q);
        const keywordsMatch = (item.keywords || []).some((kw) =>
          kw.toLowerCase().includes(q)
        );
        if (
          !titleMatch &&
          !promptMatch &&
          !sourceMatch &&
          !dateMatch &&
          !topicMatch &&
          !keywordsMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [rawList, selectedYear, selectedSubType, selectedTopic, searchQuery]);

  const handleSelect = (item) => {
    if (onSelectPrompt) {
      onSelectPrompt(item, activeTaskTab);
    }
    onClose();
  };

  const toggleOutline = (id) => {
    setExpandedOutlineId((prev) => (prev === id ? null : id));
  };

  const resetFilters = () => {
    setSelectedYear("all");
    setSelectedSubType("all");
    setSelectedTopic("all");
    setSearchQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="ielts-prompt-modal-backdrop" onClick={onClose}>
      <div
        className="ielts-prompt-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="ielts-prompt-modal-header">
          <div className="modal-header-title-box">
            <div className="modal-header-icon-badge">
              <IconBook size={20} />
            </div>
            <div>
              <h2 className="modal-header-title">
                Kho Đề Thi IELTS Writing Chính Cống (2020 - Hiện tại)
              </h2>
              <p className="modal-header-subtitle">
                Đề thi thật chính thức IDP / British Council & Toàn bộ Cambridge IELTS 15-19 chuẩn khảo thí
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-modal-close"
            onClick={onClose}
            title="Đóng cửa sổ (Esc)"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Task Tabs: Task 2 vs Task 1 */}
        <div className="ielts-prompt-modal-tabs">
          <button
            type="button"
            className={`prompt-task-tab-btn ${
              activeTaskTab === "ielts_task2" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTaskTab("ielts_task2");
              setSelectedSubType("all");
            }}
          >
            <span>IELTS Writing Task 2 (Nghị luận xã hội)</span>
            <span className="task-tab-count">
              {promptsLibrary?.en?.ielts_task2?.length || 45}+ đề thi thật
            </span>
          </button>
          <button
            type="button"
            className={`prompt-task-tab-btn ${
              activeTaskTab === "ielts_task1" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTaskTab("ielts_task1");
              setSelectedSubType("all");
            }}
          >
            <span>IELTS Writing Task 1 (Biểu đồ & Bản đồ)</span>
            <span className="task-tab-count">
              {promptsLibrary?.en?.ielts_task1?.length || 17}+ đề thi thật
            </span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="ielts-prompt-modal-filters">
          {/* Search Input */}
          <div className="prompt-filter-search-box">
            <IconSearch size={16} className="search-icon" />
            <input
              type="text"
              className="prompt-search-input"
              placeholder="Tìm kiếm theo chủ đề, từ khóa, câu hỏi đề bài hoặc ngày thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="prompt-filter-dropdowns-row">
            {/* Year Filter */}
            <div className="prompt-filter-group">
              <span className="filter-group-label">Năm thi:</span>
              <select
                className="prompt-filter-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {YEARS_FILTER.map((y) => (
                  <option key={y.id} value={y.id}>
                    {y.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-type Filter */}
            <div className="prompt-filter-group">
              <span className="filter-group-label">Dạng bài:</span>
              <select
                className="prompt-filter-select"
                value={selectedSubType}
                onChange={(e) => setSelectedSubType(e.target.value)}
              >
                {(activeTaskTab === "ielts_task2"
                  ? TASK2_SUBTYPES
                  : TASK1_SUBTYPES
                ).map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Filter (for Task 2) */}
            {activeTaskTab === "ielts_task2" && (
              <div className="prompt-filter-group">
                <span className="filter-group-label">Chủ đề:</span>
                <select
                  className="prompt-filter-select"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                >
                  {TOPIC_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(selectedYear !== "all" ||
              selectedSubType !== "all" ||
              selectedTopic !== "all" ||
              searchQuery) && (
              <button
                type="button"
                className="btn-reset-filters"
                onClick={resetFilters}
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>
        </div>

        {/* Counter Bar */}
        <div className="ielts-prompt-modal-counter">
          <span>
            Đang hiển thị <strong>{filteredPrompts.length}</strong> đề thi chính cống
          </span>
          <span className="exam-verified-badge">
            ✓ 100% Đề thi thật phòng thi & Cambridge gốc
          </span>
        </div>

        {/* Prompts Cards List */}
        <div className="ielts-prompt-modal-list">
          {filteredPrompts.length === 0 ? (
            <div className="prompt-modal-empty-state">
              <IconFile size={40} className="empty-icon" />
              <h4>Không tìm thấy đề bài phù hợp</h4>
              <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại các bộ lọc năm/dạng bài.</p>
              <button
                type="button"
                className="btn-primary-ghost"
                onClick={resetFilters}
              >
                Hiển thị tất cả đề thi
              </button>
            </div>
          ) : (
            filteredPrompts.map((item) => (
              <IeltsPromptCard
                key={item.id}
                item={item}
                isCurrent={currentPrompt?.id === item.id}
                isExpanded={expandedOutlineId === item.id}
                onToggleOutline={toggleOutline}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
