import React, { useState, useEffect } from "react";
import { Flame, Bell, X, ArrowRight, Sparkles } from "lucide-react";
import {
  getTodayDateString,
  isVocabStudiedToday,
  getReminderSettings,
} from "../../utils/dailyReminderManager";

export const DailyReminderBanner = ({ onOpenExercise, onOpenVocabTab }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState(getReminderSettings);

  useEffect(() => {
    const today = getTodayDateString();
    const dismissedDate = localStorage.getItem("daily_vocab_banner_dismissed");

    // Kiểm tra ban đầu xem đã đến giờ hoặc cần nhắc nhở chưa
    const checkShouldShow = () => {
      if (!settings.enabled) {
        setIsVisible(false);
        return;
      }
      if (dismissedDate === today) {
        setIsVisible(false);
        return;
      }
      if (isVocabStudiedToday()) {
        setIsVisible(false);
        return;
      }

      const now = new Date();
      const currentHour = String(now.getHours()).padStart(2, "0");
      const currentMinute = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${currentHour}:${currentMinute}`;

      if (currentTimeStr >= settings.reminderTime) {
        setIsVisible(true);
      }
    };

    checkShouldShow();

    // Lắng nghe event khi scheduler kích hoạt nhắc nhở
    const handleTriggered = () => {
      const isDismissed = localStorage.getItem("daily_vocab_banner_dismissed") === getTodayDateString();
      if (!isDismissed && !isVocabStudiedToday()) {
        setIsVisible(true);
      }
    };

    // Lắng nghe khi người dùng hoàn thành bài tập
    const handleStudyCompleted = () => {
      setIsVisible(false);
    };

    // Lắng nghe khi cài đặt thay đổi
    const handleSettingsChanged = (e) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };

    window.addEventListener("daily-vocab-reminder-triggered", handleTriggered);
    window.addEventListener("daily-vocab-study-completed", handleStudyCompleted);
    window.addEventListener("daily-reminder-settings-changed", handleSettingsChanged);

    return () => {
      window.removeEventListener("daily-vocab-reminder-triggered", handleTriggered);
      window.removeEventListener("daily-vocab-study-completed", handleStudyCompleted);
      window.removeEventListener("daily-reminder-settings-changed", handleSettingsChanged);
    };
  }, [settings.enabled, settings.reminderTime]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("daily_vocab_banner_dismissed", getTodayDateString());
  };

  const handleStartPractice = () => {
    setIsVisible(false);
    if (onOpenExercise) {
      onOpenExercise();
    } else if (onOpenVocabTab) {
      onOpenVocabTab();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="daily-reminder-toast animate-slide-up" role="alert">
      <div className="daily-reminder-toast-content">
        <div className="daily-reminder-icon-badge">
          <Flame size={20} className="flame-icon-pulse" />
        </div>
        <div className="daily-reminder-text">
          <div className="daily-reminder-title">
            <span>🔥 Giữ chuỗi Streak hôm nay!</span>
            <span className="daily-reminder-tag">Nhắc nhở học tập</span>
          </div>
          <div className="daily-reminder-desc">
            Hôm nay bạn chưa luyện từ vựng. Dành 3-5 phút hoàn thành 1 bài luyện để tích lũy kiến thức nhé!
          </div>
        </div>
      </div>
      <div className="daily-reminder-actions">
        <button
          className="btn-reminder-practice"
          onClick={handleStartPractice}
        >
          <Sparkles size={14} />
          <span>Luyện ngay</span>
          <ArrowRight size={14} />
        </button>
        <button
          className="btn-reminder-close"
          onClick={handleDismiss}
          title="Để sau hôm nay"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
