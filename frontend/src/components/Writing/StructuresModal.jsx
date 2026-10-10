import React, { useState, useMemo } from "react";
import {
  IconSparkles,
  IconBook,
  IconClose,
  IconRotate,
  IconCopy,
  IconPlus,
  IconSearch,
  IconFile,
} from "../Icons";
import { WRITING_CATEGORIES, WRITING_STRUCTURES } from "../../constants/writingStructures";
import {
  splitPhraseParts,
  getBandDisplayLabel,
} from "../../utils/writingStructureUtils";

export const StructuresModal = ({
  isOpen,
  onClose,
  structuresTab,
  setStructuresTab,
  aiTopicStructures = [],
  currentLangObj = { label: "Tiếng Anh", flag: "🇬🇧", system: "IELTS Band 0-9" },
  effectivePromptText = "",
  aiKindFilter = "all",
  setAiKindFilter,
  onReload,
  onAddMore,
  isLoading = false,
  loadingAction = null,
  isAuthorized = false,
  onInsert,
  showToast,
}) => {
  const [structureSearch, setStructureSearch] = useState("");
  const [structureBandFilter, setStructureBandFilter] = useState("all");
  const [structureCategoryFilter, setStructureCategoryFilter] = useState("all");

  const collocationsCount = useMemo(
    () => aiTopicStructures.filter((x) => x.kind === "collocation").length,
    [aiTopicStructures]
  );
  const structuresCount = useMemo(
    () => aiTopicStructures.filter((x) => x.kind === "structure").length,
    [aiTopicStructures]
  );

  const displayedAiItems = useMemo(() => {
    return aiTopicStructures.filter((item) => {
      if (aiKindFilter === "collocation") return item.kind === "collocation";
      if (aiKindFilter === "structure") return item.kind === "structure";
      return true;
    });
  }, [aiTopicStructures, aiKindFilter]);

  const filteredGeneralStructures = useMemo(() => {
    return WRITING_STRUCTURES.filter((item) => {
      if (structureBandFilter !== "all" && item.band !== structureBandFilter) {
        return false;
      }
      if (structureCategoryFilter !== "all" && item.category !== structureCategoryFilter) {
        return false;
      }
      if (structureSearch.trim()) {
        const q = structureSearch.toLowerCase();
        const matchPhrase = (item.phrase || "").toLowerCase().includes(q);
        const matchMeaning = (item.meaning || "").toLowerCase().includes(q);
        const matchUsage = (item.usage || "").toLowerCase().includes(q);
        return matchPhrase || matchMeaning || matchUsage;
      }
      return true;
    });
  }, [structureBandFilter, structureCategoryFilter, structureSearch]);

  if (!isOpen) return null;

  return (
    <div className="structures-modal-backdrop" onClick={onClose}>
      <div className="structures-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="structures-modal-header">
          <div className="structures-modal-title-group">
            <div className="structures-modal-icon">
              {structuresTab === "ai_topic" ? <IconSparkles size={18} /> : <IconBook size={18} />}
            </div>
            <div>
              <h3 className="structures-modal-title">
                {structuresTab === "ai_topic"
                  ? `Cụm Từ & Cấu Trúc Gợi Ý Theo Đề (${currentLangObj.label})`
                  : "Kho Cụm Từ & Cấu Trúc Học Thuật"}
              </h3>
              <p className="structures-modal-subtitle">
                {structuresTab === "ai_topic"
                  ? "Gemini AI phân tích trực tiếp đề bài để đề xuất luận điểm, collocations & cấu trúc phù hợp"
                  : "Tuyển tập collocations, câu dẫn luận điểm & cấu trúc ngữ pháp học thuật (Band 6.5 - 9.0)"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-structures"
            onClick={onClose}
            title="Đóng cửa sổ"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Tab switcher: AI gợi ý theo đề vs Thư viện mẫu */}
        <div style={{ padding: "10px 20px 0 20px", background: "var(--bg-card)" }}>
          <div className="structures-tab-switcher">
            <button
              type="button"
              className={`structures-tab-btn ${structuresTab === "ai_topic" ? "active" : ""}`}
              onClick={() => setStructuresTab("ai_topic")}
            >
              <IconSparkles size={14} />
              <span>Gợi ý theo đề bài ({aiTopicStructures.length})</span>
            </button>
            <button
              type="button"
              className={`structures-tab-btn ${structuresTab === "general" ? "active" : ""}`}
              onClick={() => setStructuresTab("general")}
            >
              <IconBook size={14} />
              <span>Thư viện mẫu câu học thuật</span>
            </button>
          </div>
        </div>

        {structuresTab === "ai_topic" ? (
          <>
            {/* Sub-header toolbar: Topic info, filter pills & action buttons */}
            <div className="structures-compact-toolbar">
              <div className="structures-topic-chip">
                <span className="topic-chip-label">Đề:</span>
                <span className="topic-chip-text" title={effectivePromptText}>
                  "{effectivePromptText || "Chưa có đề bài"}"
                </span>
                <span className="topic-chip-badge">
                  {currentLangObj.flag} {currentLangObj.label}
                </span>
              </div>

              <div className="structures-toolbar-actions">
                {aiTopicStructures.length > 0 && (
                  <div className="band-filter-pills" style={{ margin: 0 }}>
                    {[
                      { id: "all", label: `Tất cả (${aiTopicStructures.length})` },
                      { id: "collocation", label: `Cụm từ (${collocationsCount})` },
                      { id: "structure", label: `Khung câu (${structuresCount})` },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        className={`band-filter-btn ${aiKindFilter === btn.id ? "active" : ""}`}
                        onClick={() => setAiKindFilter(btn.id)}
                        style={{ padding: "3px 9px", fontSize: "0.75rem" }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Additional Generation Buttons */}
                <button
                  type="button"
                  className="btn-structure-addon btn-addon-collocation"
                  onClick={() => onAddMore("collocation")}
                  disabled={isLoading || !isAuthorized || !effectivePromptText}
                  title="Gemini AI gợi ý thêm 6-8 cụm từ (collocations) theo chủ đề"
                >
                  {loadingAction === "collocation" ? (
                    <span className="spinner-xs" />
                  ) : (
                    <IconPlus size={12} />
                  )}
                  <span>+ Thêm cụm từ</span>
                </button>

                <button
                  type="button"
                  className="btn-structure-addon btn-addon-structure"
                  onClick={() => onAddMore("structure")}
                  disabled={isLoading || !isAuthorized || !effectivePromptText}
                  title="Gemini AI gợi ý thêm 5-7 khung câu học thuật có [...]"
                >
                  {loadingAction === "structure" ? (
                    <span className="spinner-xs" />
                  ) : (
                    <IconPlus size={12} />
                  )}
                  <span>+ Thêm khung câu</span>
                </button>

                <button
                  type="button"
                  className="btn-structure-addon btn-addon-reload"
                  onClick={onReload}
                  disabled={isLoading || !isAuthorized || !effectivePromptText}
                  title="AI phân tích lại từ đầu cho đề bài này"
                >
                  {loadingAction === "all" ? (
                    <span className="spinner-xs" />
                  ) : (
                    <IconRotate size={12} />
                  )}
                  <span>Phân tích lại</span>
                </button>
              </div>
            </div>

            <div className="structures-modal-body compact-body">
              {isLoading && loadingAction === "all" ? (
                <div style={{ textAlign: "center", padding: "40px 20px" }}>
                  <span className="spinner-sm" style={{ width: "26px", height: "26px", marginBottom: "10px" }} />
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", margin: "6px 0 2px 0", fontSize: "0.95rem" }}>
                    Gemini AI đang phân tích đề bài...
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Đang chọn lọc collocations đắt giá & khung câu học thuật {currentLangObj.system}
                  </p>
                </div>
              ) : aiTopicStructures.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  <IconSparkles size={34} style={{ color: "#ec4899", marginBottom: "10px", opacity: 0.85 }} />
                  <h4 style={{ margin: "0 0 6px 0", color: "var(--text-primary)", fontSize: "1rem" }}>
                    Chưa có gợi ý AI riêng cho đề bài này
                  </h4>
                  <p style={{ margin: "0 0 16px 0", fontSize: "0.84rem", maxWidth: "440px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.45 }}>
                    Bấm nút bên dưới để Gemini AI đọc đề bài ({currentLangObj.label}), trích xuất cụm từ (collocations) & khung cấu trúc câu sắc bén nhất.
                  </p>
                  <button
                    type="button"
                    className="btn-workspace-ai-suggest"
                    onClick={onReload}
                    disabled={isLoading || !isAuthorized || !effectivePromptText}
                    style={{ margin: "0 auto", padding: "7px 20px", fontSize: "0.86rem" }}
                  >
                    <IconSparkles size={14} />
                    <span>Bấm để AI phân tích & gợi ý theo đề</span>
                  </button>
                </div>
              ) : displayedAiItems.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                  <p style={{ fontSize: "0.86rem", margin: 0 }}>Không có mục nào phù hợp trong danh mục được chọn.</p>
                </div>
              ) : (
                displayedAiItems.map((item, idx) => {
                  const isCollocation = item.kind === "collocation";
                  const phraseParts = splitPhraseParts(item.phrase);

                  return (
                    <div key={idx} className="structure-card-item compact-card">
                      <div className="structure-card-top">
                        <div className="structure-tags-group">
                          <span className={`structure-band-tag ${item.band || "band8"}`}>
                            {getBandDisplayLabel(item.band)}
                          </span>
                          <span className={`structure-kind-tag ${isCollocation ? "collocation" : "structure"}`}>
                            {isCollocation ? "Cụm từ" : "Khung câu"}
                          </span>
                          {item.category && item.category !== "body" && (
                            <span className="structure-category-pill">
                              {item.category === "intro" ? "Mở bài" : item.category === "counter" ? "Phản biện" : "Kết bài"}
                            </span>
                          )}
                        </div>

                        <div className="structure-card-actions-compact">
                          <button
                            type="button"
                            className="btn-action-compact btn-copy-compact"
                            onClick={() => {
                              navigator.clipboard.writeText(item.template || item.phrase);
                              showToast(isCollocation ? "Đã sao chép cụm từ!" : "Đã sao chép khung câu!", "success");
                            }}
                            title="Sao chép vào clipboard"
                          >
                            <IconCopy size={12} />
                            <span>Chép</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action-compact btn-insert-compact"
                            onClick={() => onInsert(item.template || item.phrase)}
                            title="Chèn ngay vào con trỏ bài viết"
                          >
                            <IconPlus size={12} />
                            <span>Chèn</span>
                          </button>
                        </div>
                      </div>

                      <div className="structure-phrase-text">
                        {phraseParts.map((part, pIdx) =>
                          part.startsWith("[") && part.endsWith("]") ? (
                            <span key={pIdx} className="placeholder-slot">{part}</span>
                          ) : (
                            part
                          )
                        )}
                      </div>

                      {item.meaning && (
                        <div className="structure-meaning-text">{item.meaning}</div>
                      )}

                      {item.usage && (
                        <div className="structure-usage-note compact-usage">{item.usage}</div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <>
            <div className="structures-modal-toolbar">
              <div className="structures-search-box">
                <IconSearch size={15} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Tìm kiếm mẫu câu, cụm từ, nghĩa tiếng Việt (ví dụ: debate, rationale, inversion, consensus...)..."
                  value={structureSearch}
                  onChange={(e) => setStructureSearch(e.target.value)}
                  autoFocus
                />
                {structureSearch && (
                  <button
                    type="button"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px" }}
                    onClick={() => setStructureSearch("")}
                  >
                    <IconClose size={13} />
                  </button>
                )}
              </div>

              <div className="structures-filters-row">
                <div className="band-filter-pills">
                  {[
                    { id: "all", label: "Tất cả Band" },
                    { id: "band8", label: "Band 8.0 - 9.0" },
                    { id: "band7", label: "Band 7.0 - 7.5" },
                    { id: "band6", label: "Band 6.0 - 6.5" },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`band-filter-btn ${structureBandFilter === b.id ? "active" : ""}`}
                      onClick={() => setStructureBandFilter(b.id)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="structures-category-nav">
                  {WRITING_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-filter-btn ${structureCategoryFilter === cat.id ? "active" : ""}`}
                      onClick={() => setStructureCategoryFilter(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="structures-modal-body compact-body">
              {filteredGeneralStructures.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
                  <IconFile size={28} style={{ opacity: 0.4, marginBottom: "6px" }} />
                  <p style={{ fontSize: "0.85rem" }}>Không tìm thấy cụm từ hay cấu trúc phù hợp với bộ lọc hiện tại.</p>
                </div>
              ) : (
                filteredGeneralStructures.map((item, idx) => (
                  <div key={idx} className="structure-card-item compact-card">
                    <div className="structure-card-top">
                      <div className="structure-tags-group">
                        <span className={`structure-band-tag ${item.band}`}>
                          {getBandDisplayLabel(item.band)}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                          {WRITING_CATEGORIES.find((c) => c.id === item.category)?.label || item.category}
                        </span>
                      </div>

                      <div className="structure-card-actions-compact">
                        <button
                          type="button"
                          className="btn-action-compact btn-copy-compact"
                          onClick={() => {
                            navigator.clipboard.writeText(item.template || item.phrase);
                            showToast("Đã sao chép cấu trúc!", "success");
                          }}
                          title="Sao chép vào clipboard"
                        >
                          <IconCopy size={12} />
                          <span>Chép</span>
                        </button>
                        <button
                          type="button"
                          className="btn-action-compact btn-insert-compact"
                          onClick={() => onInsert(item.template || item.phrase)}
                          title="Chèn ngay vào con trỏ bài viết"
                        >
                          <IconPlus size={12} />
                          <span>Chèn</span>
                        </button>
                      </div>
                    </div>
                    <div className="structure-phrase-text">{item.phrase}</div>
                    <div className="structure-meaning-text">{item.meaning}</div>
                    {item.usage && <div className="structure-usage-note compact-usage">{item.usage}</div>}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
