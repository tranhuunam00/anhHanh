import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "../utils/storage";

const TAY_BAC_WALLPAPERS = [
  "/tb_mucangchai.jpg",
  "/tb_sapa.jpg",
  "/tb_hagiang.jpg",
];

export const useTheme = () => {
  const [theme, setTheme] = useState(() => getStorageItem("app_theme", "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setStorageItem("app_theme", theme);
  }, [theme]);

  // Tây Bắc Việt Nam auto-slideshow when in forest theme
  useEffect(() => {
    if (theme !== "forest") {
      document.documentElement.style.removeProperty("--forest-bg-url");
      return;
    }

    // Preload Tay Bac wallpapers
    TAY_BAC_WALLPAPERS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let currentIndex = 0;
    document.documentElement.style.setProperty(
      "--forest-bg-url",
      `url("${TAY_BAC_WALLPAPERS[0]}")`
    );

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % TAY_BAC_WALLPAPERS.length;
      document.documentElement.style.setProperty(
        "--forest-bg-url",
        `url("${TAY_BAC_WALLPAPERS[currentIndex]}")`
      );
    }, 30000); // Switches wallpaper every 30 seconds

    return () => clearInterval(interval);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "forest";
      return "light";
    });
  };

  return { theme, toggleTheme, setTheme };
};


