import React, { useState, useEffect } from "react";
import "./PrimaryKids.css";
import "./PrimaryKidsGames.css";
import { PrimaryKidsHero } from "./PrimaryKidsHero.jsx";
import { PrimaryKidsVocabSafari } from "./PrimaryKidsVocabSafari.jsx";
import { PrimaryKidsPandaFeeder } from "./PrimaryKidsPandaFeeder.jsx";
import { PrimaryKidsFoxRunner } from "./PrimaryKidsFoxRunner.jsx";
import { PrimaryKidsSpaceExplorer } from "./PrimaryKidsSpaceExplorer.jsx";
import { PrimaryKidsGrandExam } from "./PrimaryKidsGrandExam.jsx";

const GAME_TABS = [
  { id: "safari", label: "Từ vựng Safari", icon: "🦁", mascot: "bunny" },
  { id: "panda", label: "Bếp ăn Panda", icon: "🐼", mascot: "panda" },
  { id: "fox", label: "Cáo vượt sông", icon: "🦊", mascot: "fox" },
  { id: "space", label: "Thám hiểm vũ trụ", icon: "🚀", mascot: "lion" },
  { id: "exam", label: "Đấu trường Cú vàng", icon: "🦉", mascot: "owl" }
];

/**
 * Primary Kids Hub: Cambridge Global English 4 Gamified Revision Page
 */
export const PrimaryKidsPage = ({ isActive = true }) => {
  const [activeUnitId, setActiveUnitId] = useState(() => {
    try {
      const saved = localStorage.getItem("primary_kids_unit");
      return saved ? Number(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [activeGameTab, setActiveGameTab] = useState("safari");
  const [activeMascotId, setActiveMascotId] = useState("fox");

  const [totalStars, setTotalStars] = useState(() => {
    try {
      const saved = localStorage.getItem("primary_kids_stars");
      return saved ? Number(saved) : 15;
    } catch {
      return 15;
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem("primary_kids_streak");
      return saved ? Number(saved) : 3;
    } catch {
      return 3;
    }
  });

  // Award stars
  const handleAwardStar = (count = 1) => {
    setTotalStars((prev) => {
      const next = prev + count;
      try {
        localStorage.setItem("primary_kids_stars", String(next));
      } catch {
        // ignore
      }
      return next;
    });

    setStreak((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("primary_kids_streak", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSelectUnit = (unitId) => {
    setActiveUnitId(unitId);
    try {
      localStorage.setItem("primary_kids_unit", String(unitId));
    } catch {
      // ignore
    }
  };

  const handleSelectMascot = (mascotId) => {
    setActiveMascotId(mascotId);
  };

  // Sync mascot when game tab switches
  const handleSelectGameTab = (tabId) => {
    setActiveGameTab(tabId);
    const tab = GAME_TABS.find((t) => t.id === tabId);
    if (tab && tab.mascot) {
      setActiveMascotId(tab.mascot);
    }
  };

  if (!isActive) return null;

  return (
    <div className="kids-safari-container">
      {/* Hero Banner & Unit Selector */}
      <PrimaryKidsHero
        activeUnitId={activeUnitId}
        onSelectUnit={handleSelectUnit}
        activeMascotId={activeMascotId}
        onSelectMascot={handleSelectMascot}
        totalStars={totalStars}
        streak={streak}
      />

      {/* Game Mode Navigation Bar */}
      <div className="kids-game-nav">
        {GAME_TABS.map((tab) => {
          const isSelected = tab.id === activeGameTab;
          return (
            <button
              key={tab.id}
              className={`kids-game-tab-btn ${isSelected ? "active" : ""}`}
              onClick={() => handleSelectGameTab(tab.id)}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Game Screen */}
      {activeGameTab === "safari" && (
        <PrimaryKidsVocabSafari
          unitId={activeUnitId}
          onAwardStar={handleAwardStar}
        />
      )}

      {activeGameTab === "panda" && (
        <PrimaryKidsPandaFeeder
          onAwardStar={handleAwardStar}
        />
      )}

      {activeGameTab === "fox" && (
        <PrimaryKidsFoxRunner
          onAwardStar={handleAwardStar}
        />
      )}

      {activeGameTab === "space" && (
        <PrimaryKidsSpaceExplorer
          onAwardStar={handleAwardStar}
        />
      )}

      {activeGameTab === "exam" && (
        <PrimaryKidsGrandExam
          onAwardStar={handleAwardStar}
        />
      )}
    </div>
  );
};
