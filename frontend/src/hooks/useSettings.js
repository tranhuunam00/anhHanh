import { useState, useEffect } from "react";
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { getStorageItem, setStorageItem } from "../utils/storage";

export const useSettings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = getStorageItem("dictation_settings", {});
    const initial = { ...DEFAULT_SETTINGS, ...saved };
    if (!initial.sourceLang || initial.sourceLang === "auto") {
      initial.sourceLang = "en";
    }
    if (!initial.targetLang) {
      initial.targetLang = "vi";
    }
    if (!saved._v2_manual_advance) {
      initial.autoAdvance = "no";
      initial._v2_manual_advance = true;
    }
    return initial;
  });

  useEffect(() => {
    setStorageItem("dictation_settings", settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setStorageItem("dictation_settings", DEFAULT_SETTINGS);
  };

  return { settings, updateSetting, resetSettings };
};
