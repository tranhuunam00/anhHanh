import React, { useState, useEffect } from "react";
import { BookOpen, CheckCircle, IconSparkles } from "../Icons";
import { fetchB2Units, fetchB2UnitDetail, fetchB2Exercise } from "../../services/destinationB2Service";
import { B2TheoryViewer } from "./B2TheoryViewer";
import { B2ExerciseRunner } from "./B2ExerciseRunner";
import "../../styles/destination-b2.css";

export const DestinationB2Page = ({ isActive, token }) => {
  const [units, setUnits] = useState([]);
  const [selectedUnitNumber, setSelectedUnitNumber] = useState(1);
  const [unitDetail, setUnitDetail] = useState(null);
  const [activeMode, setActiveMode] = useState("theory"); // 'theory' | 'exercise'
  const [activeExercise, setActiveExercise] = useState(null);
  const [completedExerciseIds, setCompletedExerciseIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load units summary
  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const res = await fetchB2Units();
        if (isMounted && res.units) {
          setUnits(res.units);
        }
      } catch (err) {
        console.error("Error loading Destination B2 units:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isActive) {
      loadInitialData();
    }
    return () => {
      isMounted = false;
    };
  }, [isActive]);

  // Load detail for selected unit
  useEffect(() => {
    let isMounted = true;
    const loadDetail = async () => {
      try {
        setIsLoading(true);
        const detail = await fetchB2UnitDetail(selectedUnitNumber);
        if (isMounted) {
          setUnitDetail(detail);
          // If in exercise mode, select first exercise by default
          if (detail.exercises && detail.exercises.length > 0) {
            loadExercise(detail.exercises[0].id);
          }
        }
      } catch (err) {
        console.error(`Error loading Unit ${selectedUnitNumber}:`, err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    if (isActive && selectedUnitNumber) {
      loadDetail();
    }
    return () => {
      isMounted = false;
    };
  }, [selectedUnitNumber, isActive]);

  const loadExercise = async (exerciseId) => {
    try {
      const ex = await fetchB2Exercise(exerciseId);
      setActiveExercise(ex);
    } catch (err) {
      console.error("Error fetching exercise detail:", err);
    }
  };

  const handleSelectExercise = (exId) => {
    setActiveMode("exercise");
    loadExercise(exId);
  };

  const handleExerciseCompleted = (result) => {
    if (result && result.exercise_id) {
      setCompletedExerciseIds((prev) => new Set([...prev, result.exercise_id]));
    }
  };

  if (!isActive) return null;

  const currentUnitSummary = units.find((u) => u.unit_number === selectedUnitNumber) || unitDetail;

  return (
    <div className="b2-container">
      {/* Top Banner & Unit Selector */}
      <div className="b2-header-card">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className={`b2-badge-tag ${currentUnitSummary?.unit_type === "grammar" ? "b2-badge-grammar" : "b2-badge-vocab"}`}>
              {currentUnitSummary?.unit_type === "grammar" ? "Ngữ pháp (Grammar)" : "Từ vựng (Vocabulary)"}
            </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
              CEFR B2 • Destination B2 Master
            </span>
          </div>
          <h1 className="b2-title">
            Unit {selectedUnitNumber}: {currentUnitSummary?.title || "Destination B2"}
          </h1>
          <p className="b2-subtitle">
            Học lý thuyết chuyên sâu và làm 19 dạng bài tập trắc nghiệm, điền từ, biến đổi câu từ trang 8 đến 17.
          </p>
        </div>

        {/* Unit 1 & Unit 2 Switcher */}
        <div className="b2-unit-switcher">
          <button
            type="button"
            className={`b2-unit-tab-btn ${selectedUnitNumber === 1 ? "active" : ""}`}
            onClick={() => {
              setSelectedUnitNumber(1);
              setActiveMode("theory");
            }}
          >
            <BookOpen size={16} />
            <span>Unit 1: Grammar</span>
          </button>
          <button
            type="button"
            className={`b2-unit-tab-btn ${selectedUnitNumber === 2 ? "active" : ""}`}
            onClick={() => {
              setSelectedUnitNumber(2);
              setActiveMode("theory");
            }}
          >
            <IconSparkles size={16} />
            <span>Unit 2: Vocabulary</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="b2-layout-grid">
        {/* Left Sidebar: Navigation & Exercises */}
        <aside className="b2-sidebar">
          <div className="b2-sidebar-header">Chế độ học</div>
          <button
            type="button"
            className={`b2-nav-mode-btn ${activeMode === "theory" ? "active" : ""}`}
            onClick={() => setActiveMode("theory")}
          >
            <BookOpen size={18} />
            <span>Lý thuyết trọng tâm</span>
          </button>

          <div className="b2-sidebar-header" style={{ marginTop: "12px" }}>
            Bài tập thực hành ({unitDetail?.exercises?.length || 0})
          </div>

          <div className="b2-exercise-pill-list">
            {unitDetail?.exercises?.map((ex) => {
              const isSelected = activeMode === "exercise" && activeExercise?.id === ex.id;
              const isCompleted = completedExerciseIds.has(ex.id);

              return (
                <button
                  key={ex.id}
                  type="button"
                  className={`b2-exercise-nav-item ${isSelected ? "active" : ""}`}
                  onClick={() => handleSelectExercise(ex.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="b2-ex-badge">{ex.exercise_code}</span>
                    <span style={{ fontWeight: 600, fontSize: "0.86rem" }}>{ex.title}</span>
                  </div>
                  {isCompleted && (
                    <CheckCircle size={15} color="#10b981" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Area: Theory or Exercise Runner */}
        <main>
          {activeMode === "theory" ? (
            <B2TheoryViewer unit={unitDetail} />
          ) : (
            <B2ExerciseRunner
              exercise={activeExercise}
              token={token}
              onExerciseCompleted={handleExerciseCompleted}
            />
          )}
        </main>
      </div>
    </div>
  );
};
