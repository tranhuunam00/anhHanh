import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, CheckCircle, IconSparkles } from "../Icons";
import { UNIT_1_THEORY } from "../../data/destinationB2/unit1Theory";
import { UNIT_1_EXERCISES } from "../../data/destinationB2/unit1Exercises";
import { UNIT_2_THEORY } from "../../data/destinationB2/unit2Theory";
import { UNIT_2_EXERCISES } from "../../data/destinationB2/unit2Exercises";
import { getB2StoredProgress } from "../../utils/destinationB2Grading";
import { B2TheoryViewer } from "./B2TheoryViewer";
import { B2ExerciseRunner } from "./B2ExerciseRunner";
import "../../styles/destination-b2.css";

/**
 * Destination B2 Hub Component.
 * Supports 100% offline pure client-side execution with zero backend dependency.
 * Rule 1: Internal icons only.
 * Rule 4: File strictly under 500 lines.
 */
export const DestinationB2Page = ({ isActive, token }) => {
  const [selectedUnitNumber, setSelectedUnitNumber] = useState(1);
  const [activeMode, setActiveMode] = useState("theory"); // 'theory' | 'exercise'
  const [activeExerciseId, setActiveExerciseId] = useState("u01_ex_a");
  const [completedExerciseIds, setCompletedExerciseIds] = useState(new Set());

  // Unit 1: 100% offline native textbook data (Grammar)
  const staticUnit1Detail = useMemo(
    () => ({
      unit_number: 1,
      unit_type: "grammar",
      title: "Present time: Present Simple, Continuous, Perfect Simple & Continuous, Stative verbs",
      theory: UNIT_1_THEORY,
      exercises: UNIT_1_EXERCISES,
    }),
    []
  );

  // Unit 2: 100% offline native textbook data (Vocabulary)
  const staticUnit2Detail = useMemo(
    () => ({
      unit_number: 2,
      unit_type: "vocabulary",
      title: "Travel and transport",
      theory: UNIT_2_THEORY,
      exercises: UNIT_2_EXERCISES,
    }),
    []
  );

  // Initialize completed exercise status from localStorage for all units
  useEffect(() => {
    const completed = new Set();
    const allExercises = [...UNIT_1_EXERCISES, ...UNIT_2_EXERCISES];
    allExercises.forEach((ex) => {
      const saved = getB2StoredProgress(ex.id);
      if (saved && saved.results && saved.results.length > 0) {
        completed.add(ex.id);
      }
    });
    setCompletedExerciseIds(completed);
  }, []);

  if (!isActive) return null;

  const currentUnitDetail = selectedUnitNumber === 1 ? staticUnit1Detail : staticUnit2Detail;
  const exercises = currentUnitDetail.exercises || [];
  const activeExercise = exercises.find((ex) => ex.id === activeExerciseId) || exercises[0];

  const handleSelectExercise = (exId) => {
    setActiveMode("exercise");
    setActiveExerciseId(exId);
  };

  const handleExerciseCompleted = (result) => {
    if (result && result.exercise_id) {
      setCompletedExerciseIds((prev) => new Set([...prev, result.exercise_id]));
    }
  };

  return (
    <div className="b2-container">
      {/* Top Banner & Unit Selector */}
      <div className="b2-header-card">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className={`b2-badge-tag ${currentUnitDetail.unit_type === "grammar" ? "b2-badge-grammar" : "b2-badge-vocab"}`}>
              {currentUnitDetail.unit_type === "grammar" ? "Ngữ pháp (Grammar)" : "Từ vựng (Vocabulary)"}
            </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)" }}>
              CEFR B2 • Sách Destination B2 Chuẩn 100%
            </span>
          </div>
          <h1 className="b2-title">
            Unit {selectedUnitNumber}: {currentUnitDetail.title}
          </h1>
          <p className="b2-subtitle">
            {selectedUnitNumber === 1
              ? "Học lý thuyết ngữ pháp chuẩn sách giáo trình và làm đầy đủ 10 bài tập từ A đến J (trang 8 - 13)."
              : "Học lý thuyết từ vựng & cụm từ chuẩn sách giáo trình và làm đầy đủ 9 bài tập từ A đến I (trang 14 - 17)."}
          </p>
        </div>

        {/* Unit Switcher */}
        <div className="b2-unit-switcher">
          <button
            type="button"
            className={`b2-unit-tab-btn ${selectedUnitNumber === 1 ? "active" : ""}`}
            onClick={() => {
              setSelectedUnitNumber(1);
              setActiveMode("theory");
              setActiveExerciseId("u01_ex_a");
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
              setActiveExerciseId("u02_ex_a");
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
            Bài tập thực hành ({exercises.length})
          </div>

          <div className="b2-exercise-pill-list">
            {exercises.map((ex) => {
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
            <B2TheoryViewer unit={currentUnitDetail} />
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
