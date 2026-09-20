import React from "react";
import { Keyboard, X } from "lucide-react";
import { SHORTCUTS_LIST } from "../../constants/shortcutsList";

export const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Keyboard size={20} strokeWidth={2} />
            <h3 className="modal-title" style={{ margin: 0 }}>Phím tắt hệ thống</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} strokeWidth={2} />
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

