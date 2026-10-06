// Daily Vocabulary Web Background Reminder Manager
// 100% Miễn phí - Thuần Web - Khả năng chạy Background Job qua Service Worker & Web Interval Worker

const STORAGE_KEY_SETTINGS = "daily_vocab_reminder_settings";
const STORAGE_KEY_LAST_NOTIFIED = "daily_vocab_last_notified_date";
const STORAGE_KEY_STUDIED_TODAY = "daily_vocab_studied_date";

export const DEFAULT_REMINDER_SETTINGS = {
  enabled: true,
  reminderTime: "20:00", // 20h tối mỗi ngày
  sound: true,
};

// Lấy ngày hôm nay dưới dạng YYYY-MM-DD theo giờ địa phương
export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Đọc cài đặt nhắc nhở từ localStorage
export const getReminderSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return { ...DEFAULT_REMINDER_SETTINGS };
    return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_REMINDER_SETTINGS };
  }
};

// Lưu cài đặt nhắc nhở vào localStorage
export const saveReminderSettings = (newSettings) => {
  try {
    const current = getReminderSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("daily-reminder-settings-changed", { detail: updated }));
    return updated;
  } catch (e) {
    console.error("Lỗi khi lưu reminder settings:", e);
    return newSettings;
  }
};

// Đánh dấu hôm nay đã hoàn thành luyện từ
export const markVocabStudiedToday = () => {
  try {
    const today = getTodayDateString();
    localStorage.setItem(STORAGE_KEY_STUDIED_TODAY, today);
    window.dispatchEvent(new CustomEvent("daily-vocab-study-completed", { detail: { date: today } }));
  } catch (e) {
    console.error("Lỗi khi markVocabStudiedToday:", e);
  }
};

// Kiểm tra xem hôm nay đã học chưa
export const isVocabStudiedToday = (streakDate = null) => {
  try {
    const today = getTodayDateString();
    if (streakDate && streakDate.startsWith(today)) return true;
    const studiedDate = localStorage.getItem(STORAGE_KEY_STUDIED_TODAY);
    return studiedDate === today;
  } catch {
    return false;
  }
};

// Kiểm tra quyền Notification của trình duyệt
export const getNotificationPermissionStatus = () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission; // "granted", "denied", "default"
};

// Yêu cầu quyền nhận thông báo trình duyệt
export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error("Lỗi khi requestNotificationPermission:", e);
    return "denied";
  }
};

// Tạo âm thanh chuông báo du dương bằng Web Audio API (100% Free, không cần file bên ngoài)
export const playReminderChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Hợp âm nhẹ C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.12);
      osc.stop(ctx.currentTime + index * 0.12 + 0.55);
    });
  } catch {
    // Bỏ qua nếu audio bị chặn autoplay
  }
};

// Hiển thị Web Notification tới người dùng (Desktop hoặc Mobile Browser)
export const showDailyReminderNotification = async ({
  title = "🔔 Đã đến giờ luyện từ vựng hôm nay!",
  body = "🔥 Duy trì chuỗi Streak của bạn! Dành 5 phút hoàn thành 1 thử thách từ vựng ngay.",
  url = "/vocab?openExercise=true",
} = {}) => {
  const perm = getNotificationPermissionStatus();
  if (perm !== "granted") return false;

  const settings = getReminderSettings();
  if (settings.sound) {
    playReminderChime();
  }

  const notificationOptions = {
    body,
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "daily-vocab-reminder",
    renotify: true,
    data: { url },
  };

  // Ưu tiên dùng Service Worker showNotification nếu khả dụng
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, notificationOptions);
        return true;
      }
    } catch {
      // Fallback bên dưới
    }
  }

  // Fallback: Web Notification API truyền thống
  try {
    const notification = new Notification(title, notificationOptions);
    notification.onclick = () => {
      window.focus();
      notification.close();
      window.dispatchEvent(new CustomEvent("open-exercise-hub"));
    };
    return true;
  } catch (e) {
    console.error("Lỗi khi mở Notification fallback:", e);
    return false;
  }
};

// Thử nghiệm thông báo ngay lập tức (Test Notification button trong Settings)
export const sendTestNotification = async () => {
  const perm = await requestNotificationPermission();
  if (perm !== "granted") {
    alert("Vui lòng cấp quyền Thông báo trên trình duyệt (Click biểu tượng ổ khóa bên cạnh thanh địa chỉ URL -> Cho phép Thông báo) để nhận nhắc nhở!");
    return false;
  }

  return showDailyReminderNotification({
    title: "🔔 Thử nghiệm thông báo học từ vựng thành công!",
    body: "Hệ thống nhắc nhở hàng ngày của Linguagun đang hoạt động hoàn hảo trên máy bạn.",
    url: "/vocab?openExercise=true",
  });
};

// Bộ lập lịch nền (Background Scheduler) chạy định kỳ kiểm tra giờ nhắc
let schedulerIntervalId = null;

export const initDailyReminderScheduler = ({ onTriggerReminder } = {}) => {
  if (typeof window === "undefined") return;

  // 1. Đăng ký Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Kiểm tra update
        reg.update();
      })
      .catch((err) => {
        console.warn("Service worker register error (not fatal):", err);
      });

    // Lắng nghe message từ Service Worker khi user click vào thông báo từ background
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "NAVIGATE_TO_EXERCISE") {
        window.dispatchEvent(new CustomEvent("open-exercise-hub"));
      }
    });
  }

  // 2. Hàm kiểm tra thời gian và kích hoạt nhắc nhở
  const checkReminderTick = () => {
    const settings = getReminderSettings();
    if (!settings.enabled) return;

    const now = new Date();
    const currentHour = String(now.getHours()).padStart(2, "0");
    const currentMinute = String(now.getMinutes()).padStart(2, "0");
    const currentTimeStr = `${currentHour}:${currentMinute}`;

    const todayStr = getTodayDateString();
    const lastNotifiedDate = localStorage.getItem(STORAGE_KEY_LAST_NOTIFIED);

    // Nếu hôm nay đã gửi thông báo rồi -> bỏ qua
    if (lastNotifiedDate === todayStr) return;

    // Nếu hôm nay đã học từ vựng rồi -> không cần làm phiền
    if (isVocabStudiedToday()) return;

    // So sánh thời gian: nếu đã đến hoặc vượt quá giờ hẹn
    if (currentTimeStr >= settings.reminderTime) {
      // Đánh dấu đã gửi thông báo hôm nay
      localStorage.setItem(STORAGE_KEY_LAST_NOTIFIED, todayStr);

      // Phát thông báo trình duyệt nếu đã có quyền
      if (getNotificationPermissionStatus() === "granted") {
        showDailyReminderNotification();
      }

      // Phát event in-app để giao diện web hiển thị banner nhắc nhở
      window.dispatchEvent(
        new CustomEvent("daily-vocab-reminder-triggered", {
          detail: {
            today: todayStr,
            reminderTime: settings.reminderTime,
          },
        })
      );

      if (onTriggerReminder) {
        onTriggerReminder({ today: todayStr });
      }
    }
  };

  // Dừng scheduler cũ nếu có
  if (schedulerIntervalId) {
    clearInterval(schedulerIntervalId);
  }

  // Chạy ngay 1 lần sau 3 giây khi load trang
  setTimeout(checkReminderTick, 3000);

  // Chạy định kỳ mỗi 45 giây (chạy ngầm background an toàn, không tốn CPU/pin)
  schedulerIntervalId = setInterval(checkReminderTick, 45000);

  return () => {
    if (schedulerIntervalId) {
      clearInterval(schedulerIntervalId);
      schedulerIntervalId = null;
    }
  };
};
