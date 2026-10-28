import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ROOT_WORDS_DATA } from "../../data/rootWords";
import { RootWordsHeader } from "./RootWordsHeader";
import { RootCardShowcase } from "./RootCardShowcase";
import { RootExerciseSection } from "./RootExerciseSection";
import { RootWordsGridDrawer } from "./RootWordsGridDrawer";
import {
  filterRootsByCategory,
  searchRoots,
  calculateRootProgress,
  getNextRootId,
  getPrevRootId,
  getRootCategoryStats,
} from "../../utils/rootWordsUtils";
import { ListFilter } from "../Icons";
import "./RootWords.css";

const STORAGE_MASTERED_KEY = "shotlang:root_words_mastered_ids_v1";

/**
 * Trang Gốc Từ Vựng (100 Roots Learning Studio)
 * 1 Tab riêng biệt, độc lập, không ảnh hưởng chức năng cũ
 */
export const RootWordsPage = ({ isActive }) => {
  // Trạng thái gốc từ hiện tại
  const [currentRootId, setCurrentRootId] = useState(() => {
    try {
      const saved = localStorage.getItem("shotlang:last_root_id");
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Danh sách các gốc từ đã đánh dấu hoàn thành
  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MASTERED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const masteredSet = useMemo(() => new Set(masteredIds), [masteredIds]);

  // Lưu tiến độ vào LocalStorage
  const handleToggleMastered = useCallback(() => {
    setMasteredIds((prev) => {
      const next = prev.includes(currentRootId)
        ? prev.filter((id) => id !== currentRootId)
        : [...prev, currentRootId];
      try {
        localStorage.setItem(STORAGE_MASTERED_KEY, JSON.stringify(next));
      } catch {
        // Safe ignore
      }
      return next;
    });
  }, [currentRootId]);

  const handleMasteredSuccess = useCallback(() => {
    setMasteredIds((prev) => {
      if (prev.includes(currentRootId)) return prev;
      const next = [...prev, currentRootId];
      try {
        localStorage.setItem(STORAGE_MASTERED_KEY, JSON.stringify(next));
      } catch {
        // Safe ignore
      }
      return next;
    });
  }, [currentRootId]);

  // Lọc gốc từ theo thể loại và từ khóa tìm kiếm
  const filteredRoots = useMemo(() => {
    let list = ROOT_WORDS_DATA;
    if (activeCategory !== "all") {
      list = filterRootsByCategory(list, activeCategory);
    }
    if (searchQuery.trim()) {
      list = searchRoots(list, searchQuery);
    }
    return list;
  }, [activeCategory, searchQuery]);

  // Thống kê số lượng mỗi thể loại
  const categoryStats = useMemo(() => {
    return getRootCategoryStats(ROOT_WORDS_DATA);
  }, []);

  // Tính phần trăm tiến độ
  const progress = useMemo(() => {
    return calculateRootProgress(masteredIds, ROOT_WORDS_DATA.length);
  }, [masteredIds]);

  // Đối tượng gốc từ đang được chọn
  const currentRoot = useMemo(() => {
    return (
      ROOT_WORDS_DATA.find((r) => r.id === currentRootId) ||
      ROOT_WORDS_DATA[0]
    );
  }, [currentRootId]);

  const currentRootIndexInFiltered = useMemo(() => {
    return filteredRoots.findIndex((r) => r.id === currentRootId);
  }, [filteredRoots, currentRootId]);

  // Lưu vị trí ID gần nhất
  useEffect(() => {
    try {
      localStorage.setItem("shotlang:last_root_id", String(currentRootId));
    } catch {
      // Safe ignore
    }
    setSelectedWordIndex(0);
  }, [currentRootId]);

  // Chuyển tới gốc tiếp theo
  const handleNextRoot = useCallback(() => {
    const list = filteredRoots.length > 0 ? filteredRoots : ROOT_WORDS_DATA;
    const nextId = getNextRootId(currentRootId, list);
    setCurrentRootId(nextId);
  }, [currentRootId, filteredRoots]);

  // Chuyển về gốc trước
  const handlePrevRoot = useCallback(() => {
    const list = filteredRoots.length > 0 ? filteredRoots : ROOT_WORDS_DATA;
    const prevId = getPrevRootId(currentRootId, list);
    setCurrentRootId(prevId);
  }, [currentRootId, filteredRoots]);

  // Chọn ngẫu nhiên 1 gốc từ
  const handleRandomRoot = useCallback(() => {
    const list = filteredRoots.length > 0 ? filteredRoots : ROOT_WORDS_DATA;
    const randomIdx = Math.floor(Math.random() * list.length);
    setCurrentRootId(list[randomIdx].id);
  }, [filteredRoots]);

  // Phím tắt bàn phím ArrowLeft / ArrowRight
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextRoot();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevRoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, handleNextRoot, handlePrevRoot]);

  return (
    <div className="root-words-page-wrapper">
      {/* Header điều hướng & lọc */}
      <RootWordsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categoryStats={categoryStats}
        progress={progress}
        onPrevRoot={handlePrevRoot}
        onNextRoot={handleNextRoot}
        onRandomRoot={handleRandomRoot}
        currentRootIndex={currentRootIndexInFiltered >= 0 ? currentRootIndexInFiltered : 0}
        totalRootsCount={filteredRoots.length}
      />

      {/* Floating button mở bảng danh sách 100 gốc */}
      <div className="root-drawer-trigger-bar">
        <button
          className="btn-open-grid-drawer"
          onClick={() => setIsDrawerOpen(true)}
          type="button"
        >
          <ListFilter size={15} />
          <span>Xem trọn bộ 100 Gốc Từ ({masteredSet.size}/100 đã thuộc)</span>
        </button>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="root-words-main-content">
        {filteredRoots.length === 0 ? (
          <div className="root-empty-search-state">
            <p>Không tìm thấy gốc từ nào khớp với từ khóa "<strong>{searchQuery}</strong>".</p>
            <button
              className="btn-reset-filter"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              type="button"
            >
              Xem lại toàn bộ 100 gốc từ
            </button>
          </div>
        ) : (
          <>
            {/* PHẦN 1: THẺ SHOWCASE GỐC TỪ CHUẨN MẪU ẢNH */}
            <RootCardShowcase
              currentRoot={currentRoot}
              selectedWordIndex={selectedWordIndex}
              onSelectWordIndex={setSelectedWordIndex}
              isMastered={masteredSet.has(currentRoot.id)}
              onToggleMastered={handleToggleMastered}
            />

            {/* PHẦN 2: PHẦN BÀI TẬP THỰC HÀNH TÁCH RIÊNG PHÍA DƯỚI */}
            <RootExerciseSection
              currentRoot={currentRoot}
              onMasteredSuccess={handleMasteredSuccess}
            />
          </>
        )}
      </div>

      {/* Drawer lưới 100 gốc từ */}
      <RootWordsGridDrawer
        roots={ROOT_WORDS_DATA}
        currentRootId={currentRootId}
        onSelectRoot={setCurrentRootId}
        masteredSet={masteredSet}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
