import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FileSpreadsheet,
  X,
  CheckCircle,
  Check,
  Trash2,
  Sparkles,
  Loader2,
  AlertTriangle,
  RotateCcw
} from "../Icons";
import { useAuth } from "../../context/AuthContext";
import { batchImportVocab } from "../../services/vocabImportService";
import { parseBatchVocabText } from "../../utils/vocabBatchParser";
import "../../styles/batch-vocab-import.css";

const USER_SAMPLE_DATA = `be no different from\t/biː noʊ ˈdɪfrənt frəm/\tAdjective phrase\tKhông khác gì so với\tThis kind of engineering is no different from damming a river.
dam a river\t/dæm ə ˈrɪvər/\tVerb phrase\tNgăn dòng sông bằng đập\tDamming a river can have serious environmental consequences.
come with consequences\t/kʌm wɪð ˈkɑːnsəkwənsɪz/\tVerb phrase\tĐi kèm với những hệ quả\tThese benefits come with consequences.
light pollution\t/laɪt pəˈluːʃən/\tNoun phrase\tÔ nhiễm ánh sáng\tLight pollution affects wildlife.
begin to study\t/bɪˈɡɪn tə ˈstʌdi/\tVerb phrase\tBắt đầu nghiên cứu\tScientists are only now beginning to study its effects.
be the result of\t/bi ðə rɪˈzʌlt əv/\tVerb phrase\tLà kết quả của\tLight pollution is largely the result of bad lighting design.
lighting design\t/ˈlaɪtɪŋ dɪˈzaɪn/\tNoun phrase\tThiết kế chiếu sáng\tGood lighting design can reduce light pollution.
artificial light\t/ˌɑːrtɪˈfɪʃəl laɪt/\tNoun phrase\tÁnh sáng nhân tạo\tArtificial light can disturb nocturnal animals.
shine outward and upward\t/ʃaɪn ˈaʊtwərd ənd ˈʌpwərd/\tVerb phrase\tChiếu ra ngoài và hướng lên trên\tThe lamps shine outward and upward into the sky.
focus something downward\t/ˈfoʊkəs ˈsʌmθɪŋ ˈdaʊnwərd/\tVerb phrase\tTập trung chiếu thứ gì xuống dưới\tThe lights should be focused downward.
spill into\t/spɪl ˈɪntuː/\tPhrasal verb\tTràn/lan vào\tHuman light spills into the natural world.
be affected\t/bi əˈfektɪd/\tVerb phrase\tBị ảnh hưởng\tAnimal migration and reproduction can be affected by artificial light.`;

export const BatchVocabTextImportModal = ({
  isOpen,
  onClose,
  onSuccess,
  sourceLang = "en"
}) => {
  const { token, savedVocabMap, refreshSavedVocab, showToast } = useAuth();
  const [rawText, setRawText] = useState("");
  const [conflictResolution, setConflictResolution] = useState("skip_existing"); // "skip_existing" | "overwrite" | "keep_both"
  const [selectedMap, setSelectedMap] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Parse text live
  const { items: parsedItems, summary } = useMemo(() => {
    return parseBatchVocabText(rawText, savedVocabMap, sourceLang);
  }, [rawText, savedVocabMap, sourceLang]);

  // Keep selection state synchronized when items change
  useEffect(() => {
    const nextMap = {};
    parsedItems.forEach((it) => {
      // If already set by user, preserve; otherwise select valid non-duplicates or all based on resolution
      if (selectedMap[it.id] !== undefined) {
        nextMap[it.id] = selectedMap[it.id];
      } else {
        nextMap[it.id] = conflictResolution === "skip_existing" ? !it.isDuplicate && it.isValid : it.isValid;
      }
    });
    setSelectedMap(nextMap);
  }, [parsedItems, conflictResolution]);

  const handleToggleSelectAll = (checked) => {
    const next = {};
    parsedItems.forEach((it) => {
      next[it.id] = checked && it.isValid;
    });
    setSelectedMap(next);
  };

  const handleToggleRow = (id) => {
    setSelectedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = useMemo(() => {
    return Object.values(selectedMap).filter(Boolean).length;
  }, [selectedMap]);

  const allSelected = parsedItems.length > 0 && parsedItems.every((it) => selectedMap[it.id]);

  const handleImportSubmit = async () => {
    const itemsToImport = parsedItems
      .filter((it) => selectedMap[it.id])
      .map((it) => ({
        word: it.word.trim(),
        meaning: it.meaning.trim(),
        phonetic: it.phonetic?.trim() || null,
        part_of_speech: it.part_of_speech?.trim() || null,
        context_sentence: it.context_sentence?.trim() || "",
        source_lang: it.source_lang || sourceLang || "en",
        image_url: null
      }));

    if (itemsToImport.length === 0) {
      if (showToast) showToast("Vui lòng chọn ít nhất 1 từ vựng hợp lệ để import", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await batchImportVocab(itemsToImport, token, conflictResolution);
      if (showToast) {
        showToast(
          res?.message || `Đã nhập thành công ${itemsToImport.length} từ vào Sổ tay!`,
          "success"
        );
      }
      if (refreshSavedVocab) await refreshSavedVocab();
      if (onSuccess) onSuccess(res);
      setRawText("");
      onClose();
    } catch (err) {
      console.error("Batch import error:", err);
      if (showToast) {
        showToast(err?.message || "Không thể import từ vựng, vui lòng thử lại", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="batch-vocab-modal-overlay">
      <div className="batch-vocab-modal-backdrop" onClick={onClose} />
      <div className="batch-vocab-modal-dialog">
        {/* Header */}
        <header className="batch-vocab-modal-header">
          <div className="batch-vocab-header-title-wrap">
            <div className="batch-vocab-header-icon">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h3 className="batch-vocab-modal-title">Nhập Từ Vựng Hàng Loạt (Excel / TSV / Văn Bản)</h3>
              <p className="batch-vocab-modal-subtitle">
                Hỗ trợ dán trực tiếp từ Excel, Google Sheets, Anki hoặc danh sách dạng cột
              </p>
            </div>
          </div>
          <button type="button" className="batch-vocab-close-btn" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </header>

        {/* Body */}
        <div className="batch-vocab-modal-body">
          {/* Format Guide */}
          <div className="batch-vocab-format-guide">
            <div className="batch-vocab-format-guide-text">
              Định dạng chuẩn 5 cột (ngăn cách bằng <strong>Tab</strong> hoặc 2 dấu cách):<br />
              <code>Từ vựng &nbsp;➔&nbsp; Phiên âm &nbsp;➔&nbsp; Từ loại &nbsp;➔&nbsp; Nghĩa &nbsp;➔&nbsp; Câu ví dụ</code>
            </div>
            <button
              type="button"
              className="batch-vocab-sample-btn"
              onClick={() => setRawText(USER_SAMPLE_DATA)}
              title="Dán 12 cụm từ vựng mẫu để kiểm tra"
            >
              <Sparkles size={12} className="inline mr-1" />
              Dán dữ liệu mẫu
            </button>
          </div>

          {/* Textarea */}
          <div className="batch-vocab-textarea-wrap">
            <label className="batch-vocab-textarea-label">
              <span>Dán danh sách từ vựng vào đây:</span>
              {rawText && (
                <button
                  type="button"
                  className="batch-vocab-row-del-btn"
                  onClick={() => setRawText("")}
                  title="Xóa nội dung nhập"
                >
                  <RotateCcw size={13} className="mr-1" /> Xóa
                </button>
              )}
            </label>
            <textarea
              className="batch-vocab-textarea"
              placeholder={`be no different from\t/biː noʊ ˈdɪfrənt frəm/\tAdjective phrase\tKhông khác gì so với\tThis kind of engineering is no different from damming a river.\ndam a river\t/dæm ə ˈrɪvər/\tVerb phrase\tNgăn dòng sông bằng đập\tDamming a river can have serious environmental consequences.`}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={5}
            />
          </div>

          {/* Statistics and Conflict Bar */}
          {parsedItems.length > 0 && (
            <div className="batch-vocab-stats-bar">
              <div className="batch-vocab-pills-row">
                <span className="batch-vocab-stat-pill total">
                  Tổng: <strong>{summary.total}</strong>
                </span>
                <span className="batch-vocab-stat-pill new">
                  <Check size={12} /> Mới: <strong>{summary.newCount}</strong>
                </span>
                {summary.duplicateCount > 0 && (
                  <span className="batch-vocab-stat-pill duplicate">
                    <AlertTriangle size={12} /> Trùng: <strong>{summary.duplicateCount}</strong>
                  </span>
                )}
                {summary.invalidCount > 0 && (
                  <span className="batch-vocab-stat-pill invalid">
                    Lỗi/thiếu nghĩa: <strong>{summary.invalidCount}</strong>
                  </span>
                )}
              </div>

              {/* Conflict resolution options */}
              <div className="batch-vocab-conflict-group">
                <span className="batch-vocab-conflict-label">Khi từ đã có:</span>
                <label className="batch-vocab-radio-item" title="Bỏ qua từ đã có trong sổ tay, chỉ thêm từ mới">
                  <input
                    type="radio"
                    name="conflict_res"
                    value="skip_existing"
                    checked={conflictResolution === "skip_existing"}
                    onChange={(e) => setConflictResolution(e.target.value)}
                  />
                  <span>Bỏ qua</span>
                </label>
                <label className="batch-vocab-radio-item" title="Cập nhật nghĩa và câu ví dụ mới cho từ trùng">
                  <input
                    type="radio"
                    name="conflict_res"
                    value="overwrite"
                    checked={conflictResolution === "overwrite"}
                    onChange={(e) => setConflictResolution(e.target.value)}
                  />
                  <span>Cập nhật</span>
                </label>
                <label className="batch-vocab-radio-item" title="Lưu thêm bản ghi mới độc lập">
                  <input
                    type="radio"
                    name="conflict_res"
                    value="keep_both"
                    checked={conflictResolution === "keep_both"}
                    onChange={(e) => setConflictResolution(e.target.value)}
                  />
                  <span>Lưu tất cả</span>
                </label>
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedItems.length > 0 && (
            <div className="batch-vocab-table-container">
              <table className="batch-vocab-table">
                <thead>
                  <tr>
                    <th style={{ width: "36px" }}>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        title="Chọn/Bỏ chọn tất cả"
                      />
                    </th>
                    <th>Từ / Cụm từ</th>
                    <th>Phiên âm</th>
                    <th>Từ loại</th>
                    <th>Nghĩa tiếng Việt</th>
                    <th>Câu ví dụ</th>
                    <th style={{ width: "80px", textAlign: "center" }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedItems.map((it) => (
                    <tr key={it.id} className={it.isDuplicate ? "is-duplicate" : ""}>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(selectedMap[it.id])}
                          onChange={() => handleToggleRow(it.id)}
                          disabled={!it.isValid}
                        />
                      </td>
                      <td>
                        <strong>{it.word}</strong>
                      </td>
                      <td>
                        <span style={{ color: "var(--text-muted, #64748b)" }}>{it.phonetic || "—"}</span>
                      </td>
                      <td>
                        {it.part_of_speech ? (
                          <span className="batch-vocab-pos-tag">{it.part_of_speech}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{it.meaning || <em style={{ color: "#ef4444" }}>Thiếu nghĩa</em>}</td>
                      <td>
                        <span style={{ color: "var(--text-secondary, #334155)", fontSize: "0.76rem" }}>
                          {it.context_sentence || "—"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {it.isDuplicate ? (
                          <span className="batch-vocab-badge dup" title="Từ này đã có trong Sổ tay của bạn">
                            Đã có
                          </span>
                        ) : (
                          <span className="batch-vocab-badge new">Mới</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="batch-vocab-modal-footer">
          <div className="batch-vocab-footer-left">
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted, #64748b)" }}>
              {selectedCount > 0 ? `Đã chọn: ${selectedCount} / ${parsedItems.length} từ` : "Chưa chọn từ nào"}
            </span>
          </div>
          <div className="batch-vocab-footer-right">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary btn-with-icon"
              onClick={handleImportSubmit}
              disabled={isSubmitting || selectedCount === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Đang nhập từ...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={15} />
                  <span>Nhập {selectedCount} từ vào Sổ tay</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

