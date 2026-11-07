import React, { useState, useMemo } from "react";
import { getUnitById } from "../../data/primaryKids/stage4Data.js";
import { playEnglishSpeech } from "../../utils/primaryKidsUtils.js";
import { IconVolume, IconBook, IconSearch } from "../../constants/icons.js";

/**
 * Safari Vocabulary Explorer & Flashcard Mode
 */
export const PrimaryKidsVocabSafari = ({ unitId = 1, onAwardStar }) => {
  const unit = getUnitById(unitId);
  const [selectedLessonId, setSelectedLessonId] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGrammar, setShowGrammar] = useState(false);
  const [listenedWords, setListenedWords] = useState({});

  // Filter vocabulary by lesson and search
  const filteredVocab = useMemo(() => {
    let list = [];
    unit.lessons.forEach((lesson) => {
      if (selectedLessonId === "all" || lesson.id === selectedLessonId) {
        lesson.vocab.forEach((item) => {
          list.push({ ...item, lessonTitle: lesson.title });
        });
      }
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.word.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q) ||
          (item.example && item.example.toLowerCase().includes(q))
      );
    }
    return list;
  }, [unit, selectedLessonId, searchQuery]);

  const handleSpeak = (word) => {
    playEnglishSpeech(word);
    if (!listenedWords[word]) {
      setListenedWords((prev) => ({ ...prev, [word]: true }));
      // Award a star for exploring pronunciation every 5 words
      const count = Object.keys(listenedWords).length + 1;
      if (count % 5 === 0 && onAwardStar) {
        onAwardStar(1);
      }
    }
  };

  return (
    <div className="kids-game-box">
      <div className="kids-game-header">
        <h2>🦁 Thảo Nguyên Safari • Từ Vựng {unit.unitNumber}: {unit.title}</h2>
        <p>Bé hãy bấm vào chiếc loa để nghe phát âm chuẩn và tích lũy ngôi sao nhé!</p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="kids-vocab-controls">
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <button
            className={`kids-btn-secondary ${selectedLessonId === "all" ? "active" : ""}`}
            onClick={() => setSelectedLessonId("all")}
            style={selectedLessonId === "all" ? { borderColor: "var(--primary)", fontWeight: "bold" } : {}}
          >
            Tất cả ({unit.lessons.reduce((acc, l) => acc + l.vocab.length, 0)} từ)
          </button>
          {unit.lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={`kids-btn-secondary ${selectedLessonId === lesson.id ? "active" : ""}`}
              onClick={() => setSelectedLessonId(lesson.id)}
              style={selectedLessonId === lesson.id ? { borderColor: "var(--primary)", fontWeight: "bold" } : {}}
            >
              {lesson.id}: {lesson.title}
            </button>
          ))}
        </div>

        <button
          className="kids-btn-secondary"
          onClick={() => setShowGrammar(!showGrammar)}
          style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
        >
          <IconBook size={16} />
          <span>{showGrammar ? "Ẩn Ngữ Pháp" : "Xem Ngữ Pháp Cốt Lõi"}</span>
        </button>
      </div>

      {/* Grammar Snapshot Panel */}
      {showGrammar && (
        <div className="kids-river-stage" style={{ marginTop: 0, marginBottom: "1.25rem" }}>
          <h3 style={{ margin: "0 0 0.75rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📖</span> Bí Kíp Ngữ Pháp {unit.unitNumber}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {unit.grammarFocus.map((g, idx) => (
              <div key={idx} style={{ background: "var(--bg-card)", padding: "0.85rem", borderRadius: "0.75rem" }}>
                <strong style={{ color: "var(--primary)" }}>{idx + 1}. {g.rule}</strong>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                  <em>Công thức:</em> {g.formula}
                </div>
                <ul style={{ margin: "0.4rem 0 0 1.25rem", padding: 0, fontSize: "0.85rem" }}>
                  {g.examples.map((ex, exIdx) => (
                    <li key={exIdx}>{ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "1.25rem" }}>
        <input
          type="text"
          placeholder="🔍 Tìm nhanh từ vựng (ví dụ: football, Mercury, yurt, papaya...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "0.65rem 1rem 0.65rem 2.5rem",
            borderRadius: "0.75rem",
            border: "1.5px solid var(--border-color)",
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            fontSize: "0.925rem",
            outline: "none"
          }}
        />
        <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>
          <IconSearch size={16} />
        </span>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="kids-vocab-grid">
        {filteredVocab.map((item, idx) => {
          const isSpoken = !!listenedWords[item.word];
          return (
            <div key={idx} className="kids-vocab-card">
              <div className="kids-vocab-card-header">
                <div>
                  <span className="kids-vocab-word">{item.word}</span>
                  <div className="kids-vocab-ipa">{item.ipa}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span title="Bạn thú đại diện" style={{ fontSize: "1.35rem" }}>{item.animal}</span>
                  <button
                    className="kids-sound-btn"
                    onClick={() => handleSpeak(item.word)}
                    title="Nghe phát âm chuẩn"
                  >
                    <IconVolume size={16} />
                  </button>
                </div>
              </div>

              <div className="kids-vocab-meaning">
                <span>🇻🇳 {item.meaning}</span>
              </div>

              {item.example && (
                <div className="kids-vocab-example" onClick={() => playEnglishSpeech(item.example)} style={{ cursor: "pointer" }} title="Bấm để nghe ví dụ">
                  "{item.example}"
                </div>
              )}

              {isSpoken && (
                <div style={{ fontSize: "0.75rem", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span>✓ Đã luyện nghe</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

