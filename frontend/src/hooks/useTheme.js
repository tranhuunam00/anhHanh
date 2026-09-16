import { useState, useEffect } from "react";
import { getStorageItem, setStorageItem } from "../utils/storage";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => getStorageItem("app_theme", "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setStorageItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
