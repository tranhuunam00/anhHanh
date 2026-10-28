import React from "react";
import { CheckSquare } from "../Icons";

/**
 * Lưới danh sách 100 gốc từ thu gọn, hỗ trợ nhảy nhanh đến bất kỳ gốc nào
 */
export const RootWordsGridDrawer = ({
  roots,
  currentRootId,
  onSelectRoot,
  masteredSet,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="root-grid-drawer-overlay" onClick={onClose}>
      <div className="root-grid-drawer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">Danh sách 100 Gốc Từ Cốt Lõi</h3>
          <button className="btn-drawer-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="drawer-body-grid">
          {roots.map((item, index) => {
            const isCurrent = item.id === currentRootId;
            const isMastered = masteredSet.has(item.id);

            return (
              <button
                key={item.id}
                className={`drawer-root-item ${isCurrent ? "current" : ""} ${isMastered ? "mastered" : ""}`}
                onClick={() => {
                  onSelectRoot(item.id);
                  onClose();
                }}
                type="button"
              >
                <div className="item-top-row">
                  <span className="item-num">#{index + 1}</span>
                  {isMastered && <CheckSquare size={13} className="item-check" />}
                </div>
                <strong className="item-root-text">{item.root}</strong>
                <span className="item-meaning-text">{item.meaningVi}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
