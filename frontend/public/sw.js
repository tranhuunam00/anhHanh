// Service Worker cho Daily Vocab Reminder (100% Free - Web Only - Background Job)
const SW_VERSION = "v1.0.0";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Lắng nghe sự kiện click vào thông báo từ trình duyệt (Desktop notification hoặc Mobile Web notification)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/vocab?openExercise=true";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Nếu đã có tab đang mở sẵn, focus vào tab đó và gửi tin nhắn mở bài tập
      for (const client of clientList) {
        if ("focus" in client) {
          client.focus();
          client.postMessage({
            type: "NAVIGATE_TO_EXERCISE",
            url: targetUrl,
            timestamp: Date.now(),
          });
          return;
        }
      }
      // Nếu chưa có tab nào mở, mở cửa sổ web mới
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Lắng nghe message từ trang web chính (nếu trang web yêu cầu SW phát thông báo nền)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TRIGGER_BACKGROUND_NOTIFICATION") {
    const { title, options } = event.data;
    self.registration.showNotification(title || "Linguagun - Luyện từ vựng hàng ngày", {
      badge: "/favicon.svg",
      icon: "/favicon.svg",
      vibrate: [200, 100, 200],
      ...options,
    });
  }
});
