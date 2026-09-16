export const getStorageItem = (key, fallback = null) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

export const setStorageItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }
};

export const loadLessonProgress = (videoId) => {
  try {
    const data = localStorage.getItem(`progress_${videoId}`);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const saveLessonProgress = (videoId, progressObj) => {
  try {
    localStorage.setItem(`progress_${videoId}`, JSON.stringify(progressObj));
  } catch (e) {
    console.warn("Failed to save progress:", e);
  }
};
