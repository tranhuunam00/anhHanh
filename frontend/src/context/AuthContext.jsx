import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchAuthConfig,
  fetchCurrentUser,
  fetchStreak,
  fetchVocabList,
  loginWithEmail as apiLoginWithEmail,
  registerWithEmail as apiRegisterWithEmail,
  loginWithGoogle as apiLoginWithGoogle,
} from "../services/authVocabService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("shotlang_jwt_token") || null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("shotlang_user") || "null");
    } catch {
      return null;
    }
  });
  const [streak, setStreak] = useState(0);
  const [wordsToday, setWordsToday] = useState(0);
  const [unlearnedWords, setUnlearnedWords] = useState(0);
  const [savedVocabMap, setSavedVocabMap] = useState({});
  const [googleClientId, setGoogleClientId] = useState("1010771231278-42hd59gesjf8ts5ta7nra9qrfkmobgrt.apps.googleusercontent.com");
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // Fetch dynamic Google Client ID from server
  useEffect(() => {
    fetchAuthConfig().then((cfg) => {
      if (cfg && cfg.google_client_id) {
        setGoogleClientId(cfg.google_client_id);
      }
    });
  }, []);

  // Refresh Streak
  const refreshStreak = useCallback(async () => {
    const data = await fetchStreak(token);
    if (data) {
      setStreak(data.current_streak || 0);
      setWordsToday(data.words_today || 0);
      setUnlearnedWords(data.unlearned_words ?? 0);
    }
  }, [token]);

  useEffect(() => {
    refreshStreak();
  }, [refreshStreak]);

  // Verify / Refresh current user profile
  useEffect(() => {
    if (token) {
      fetchCurrentUser(token).then((userData) => {
        if (userData) {
          setUser(userData);
          localStorage.setItem("shotlang_user", JSON.stringify(userData));
        } else {
          // Token expired or invalid
          setToken(null);
          setUser(null);
          localStorage.removeItem("shotlang_jwt_token");
          localStorage.removeItem("shotlang_user");
        }
      });
    }
  }, [token]);

  // Refresh Saved Vocab Map for real-time highlighting
  const refreshSavedVocab = useCallback(async () => {
    if (!token) {
      setSavedVocabMap({});
      return;
    }
    try {
      const data = await fetchVocabList("ALL", "", token);
      const list = data?.items || data?.vocabulary || [];
      const map = {};
      list.forEach((item) => {
        if (item && item.word) {
          map[item.word.trim().toLowerCase()] = item;
        }
      });
      setSavedVocabMap(map);
    } catch (e) {
      console.debug("Could not refresh saved vocab:", e);
    }
  }, [token]);

  useEffect(() => {
    refreshSavedVocab();
  }, [refreshSavedVocab]);

  // Set session helper
  const setSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("shotlang_jwt_token", newToken);
    localStorage.setItem("shotlang_user", JSON.stringify(newUser));
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    setSavedVocabMap({});
    localStorage.removeItem("shotlang_jwt_token");
    localStorage.removeItem("shotlang_user");
    showToast("Đã đăng xuất tài khoản", "info");
    refreshStreak();
  };

  // Login Email
  const loginEmail = async (email, password) => {
    const data = await apiLoginWithEmail(email, password);
    setSession(data.access_token, data.user);
    showToast(`Xin chào ${data.user.name || data.user.email}! Đăng nhập thành công.`, "success");
    refreshStreak();
    refreshSavedVocab();
    return data;
  };

  // Register Email
  const registerEmail = async (email, password, name, honeypot) => {
    const data = await apiRegisterWithEmail(email, password, name, honeypot);
    setSession(data.access_token, data.user);
    showToast(`Chào mừng ${data.user.name || data.user.email}! Đã tạo tài khoản thành công.`, "success");
    refreshStreak();
    refreshSavedVocab();
    return data;
  };

  // Login Google
  const loginGoogle = async (credential) => {
    const data = await apiLoginWithGoogle(credential);
    setSession(data.access_token, data.user);
    showToast(`Xin chào ${data.user.name}! Đăng nhập Google thành công.`, "success");
    refreshStreak();
    refreshSavedVocab();
    return data;
  };

  // Google One-Tap prompt setup
  useEffect(() => {
    if (token || !googleClientId) return;

    let timer;
    const initOneTap = () => {
      if (typeof window.google === "undefined" || !window.google.accounts || !window.google.accounts.id) {
        timer = setTimeout(initOneTap, 600);
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response && response.credential) {
              await loginGoogle(response.credential);
            }
          },
          auto_select: true,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.debug("Google One-Tap skipped or not displayed:", notification.getNotDisplayedReason());
          }
        });
      } catch (err) {
        console.warn("Google One-Tap init:", err);
      }
    };

    timer = setTimeout(initOneTap, 1000);
    return () => clearTimeout(timer);
  }, [token, googleClientId]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        streak,
        wordsToday,
        unlearnedWords,
        setUnlearnedWords,
        savedVocabMap,
        refreshSavedVocab,
        googleClientId,
        loginEmail,
        registerEmail,
        loginGoogle,
        logout,
        refreshStreak,
        showToast,
      }}
    >
      {children}

      {/* Toast Notification Renderer */}
      <div className="dict-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`dict-toast toast-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
