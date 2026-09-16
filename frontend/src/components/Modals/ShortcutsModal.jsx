import React from "react";
import { SHORTCUTS_LIST } from "../../constants/shortcutsList";

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Phím tắt hệ thống</h3>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <table className="shortcuts-table">
            <thead>
              <tr>
                <th>Phím tắt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {SHORTCUTS_LIST.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <kbd>{item.key}</kbd>
                  </td>
                  <td>{item.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
