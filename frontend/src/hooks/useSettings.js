import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { getStorageItem, setStorageItem } from "../utils/storage";

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = getStorageItem("dictation_settings", {});
    return { ...DEFAULT_SETTINGS, ...saved };
  });

  useEffect(() => {
    setStorageItem("dictation_settings", settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
};
