import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Headphones, ChevronsDown, Play, Pause, ArrowRight, Sparkles, Search } from "lucide-react";
import { HighlightedVocabSentence } from "../components/Vocab/HighlightedVocabSentence";

const BATCH_SIZE = 60;

// Sub-component for individual transcript item (Memoized to prevent 2000+ re-renders every 300ms)
const TranscriptItem = React.memo(
  React.forwardRef(({ challenge, idx, isActive, formatTime, onGoToChallenge, onPlayFull, videoId }, ref) => {
    return (
      <div
        ref={ref}
        className={`transcript-item ${isActive ? "active-sentence" : ""}`}
        onClick={() => onPlayFull(challenge.time_start)}
      >
        <div className="transcript-header-meta">
          <span className="transcript-time">
            [{formatTime(challenge.time_start)} - {formatTime(challenge.time_end)}]
          </span>
          <button
            className="btn btn-secondary btn-with-icon"
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            title="Luyện chép câu này"
            onClick={(e) => {
              e.stopPropagation();
              onGoToChallenge(idx + 1);
            }}
          >
            <span>Luyện câu này</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <div className="transcript-en">
          <HighlightedVocabSentence
            text={challenge.text}
            contextSentence={challenge.text}
            contextTranslation={challenge.translation}
            videoId={videoId}
            timestamp={challenge.time_start || 0}
          />
        </div>
        {challenge.translation && <div className="transcript-vi">{challenge.translation}</div>}
      </div>
    );
  })
);

export const TranscriptPage = React.memo(({ lesson, playerController, onGoToChallenge, isActive = true }) => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [heroTop, setHeroTop] = useState(60);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const activeItemRef = useRef(null);
  const sentinelRef = useRef(null);

  // Measure header height for sticky position
  useEffect(() => {
    if (!isActive) return;
    const measure = () => {
      const header = document.querySelector(".app-header");
      if (header) setHeroTop(header.getBoundingClientRect().height);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isActive]);

  // CRITICAL: Only run 300ms time polling interval if TranscriptPage is active!
  useEffect(() => {
    if (!isActive || !playerController) return;

    const interval = setInterval(() => {
      setCurrentTime(playerController.getCurrentTime() || 0);
      setDuration(playerController.getDuration() || 0);
      const playing = playerController.isPlaying?.() ?? false;
      setIsPlayingFull(playing);
    }, 300);

    return () => clearInterval(interval);
  }, [isActive, playerController]);

  // Space key handler: only when active
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.code !== "Space") return;
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      toggleFullPlay();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isPlayingFull, playerController]);

  // Compute active sentence index dynamically based on current audio time
  const activeIndex = useMemo(() => {
    if (!lesson || !lesson.challenges || lesson.challenges.length === 0) return -1;
    // 1. Exact range match
    const exactIdx = lesson.challenges.findIndex(
      (c) => currentTime >= c.time_start && currentTime <= c.time_end
    );
    if (exactIdx !== -1) return exactIdx;

    // 2. Fallback to latest challenge whose time_start <= currentTime
    let lastStartedIdx = -1;
    for (let i = 0; i < lesson.challenges.length; i++) {
      if (currentTime >= lesson.challenges[i].time_start) {
        lastStartedIdx = i;
      } else {
        break;
      }
    }
    return lastStartedIdx !== -1 ? lastStartedIdx : 0;
  }, [lesson, currentTime]);

  // Ensure visible window covers active index when playing audio
  useEffect(() => {
    if (activeIndex !== -1 && activeIndex >= visibleCount - 10) {
      setVisibleCount((prev) => Math.max(prev, activeIndex + BATCH_SIZE));
    }
  }, [activeIndex, visibleCount]);

  // Auto scroll active item into view
  useEffect(() => {
    if (isAutoScroll && activeIndex !== -1 && activeItemRef.current && isActive) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, isAutoScroll, isActive]);

  // Infinite scroll intersection observer for batch rendering
  useEffect(() => {
    if (!isActive || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            const total = lesson?.challenges?.length || 0;
            return Math.min(total, prev + BATCH_SIZE);
          });
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isActive, lesson?.challenges?.length]);

  const formatTime = useCallback((seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const toggleFullPlay = useCallback(() => {
    if (!playerController) return;
    if (isPlayingFull) {
      playerController.pauseFull();
      setIsPlayingFull(false);
    } else {
      playerController.playFull();
      setIsPlayingFull(true);
    }
  }, [playerController, isPlayingFull]);

  const handlePlayFullTime = useCallback((timeStart) => {
    if (playerController) {
      playerController.playFull(timeStart);
      setIsPlayingFull(true);
    }
  }, [playerController]);

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerController) {
      playerController.seekTo(newTime);
    }
  };

  const filteredChallenges = useMemo(() => {
    if (!lesson?.challenges) return [];
    if (!searchQuery.trim()) return lesson.challenges;
    const q = searchQuery.toLowerCase().trim();
    return lesson.challenges.filter(
      (c) =>
        c.text.toLowerCase().includes(q) ||
        (c.translation && c.translation.toLowerCase().includes(q))
    );
  }, [lesson?.challenges, searchQuery]);

  const displayedChallenges = useMemo(() => {
    if (searchQuery.trim()) return filteredChallenges.slice(0, 100);
    return filteredChallenges.slice(0, visibleCount);
  }, [filteredChallenges, visibleCount, searchQuery]);

  if (!lesson || !lesson.challenges) {
    return (
      <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
        Vui lòng tải một bài học YouTube để xem toàn bộ bài nghe và bản dịch transcript song ngữ.
      </div>
    );
  }

  const totalChallengesCount = lesson.challenges.length;

  return (
    <div id="tab-transcript" className="tab-content">
      {/* Full Audio Hero Card – sticky */}
      <div className="card full-audio-hero-card" style={{ top: `${heroTop}px` }}>
        <div className="full-audio-hero-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div className="hero-header-title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Headphones size={22} color="#3b82f6" />
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>{lesson.title}</h3>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Toàn bộ audio bài nghe ({totalChallengesCount} câu)
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              className={`btn ${isAutoScroll ? "btn-primary" : "btn-secondary"} btn-with-icon`}
              style={{ padding: "6px 14px", fontSize: "0.83rem" }}
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              title="Bật/Tắt tự động cuộn danh sách câu theo thời gian audio"
            >
              <ChevronsDown size={15} />
              <span>{isAutoScroll ? "Tự cuộn: BẬT" : "Tự cuộn: TẮT"}</span>
            </button>
          </div>
        </div>

        <div className="full-audio-player-bar">
          <button className="full-audio-play-btn" onClick={toggleFullPlay}>
            {isPlayingFull ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" style={{ marginLeft: "2px" }} />
            )}
          </button>
          <span className="full-audio-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <input
            type="range"
            className="full-audio-progress"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onInput={handleSeek}
            onChange={handleSeek}
            title="Kéo để tua thời gian audio"
          />
        </div>
      </div>

      {/* Filter / Search Bar & Tip */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Tìm kiếm từ hoặc cụm từ trong transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="dictation-input"
            style={{ paddingLeft: "32px", paddingRight: "12px", fontSize: "0.85rem", height: "36px", width: "100%", borderRadius: "8px" }}
          />
        </div>

        <div className="vocab-save-hint-card" style={{ margin: 0, flexShrink: 0 }}>
          <Sparkles size={13} color="#6366f1" style={{ flexShrink: 0 }} />
          <span>💡 Bôi đen từ bất kỳ để tra nghĩa & lưu</span>
        </div>
      </div>

      {/* Transcript Items List */}
      <div className="transcript-list" style={{ marginTop: "12px" }}>
        {displayedChallenges.map((c, localIdx) => {
          const originalIdx = lesson.challenges.indexOf(c);
          const idx = originalIdx !== -1 ? originalIdx : localIdx;
          const isActiveSentence = idx === activeIndex;

          return (
            <TranscriptItem
              key={c.id || idx}
              ref={isActiveSentence ? activeItemRef : null}
              challenge={c}
              idx={idx}
              isActive={isActiveSentence}
              formatTime={formatTime}
              onGoToChallenge={onGoToChallenge}
              onPlayFull={handlePlayFullTime}
              videoId={lesson?.video_id || ""}
            />
          );
        })}

        {/* Sentinel for infinite scroll loading next batch */}
        {!searchQuery && displayedChallenges.length < totalChallengesCount && (
          <div
            ref={sentinelRef}
            style={{
              padding: "16px",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
            }}
          >
            Đang tải thêm câu... ({displayedChallenges.length} / {totalChallengesCount})
          </div>
        )}
      </div>
    </div>
  );
});

