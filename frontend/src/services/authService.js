/**
 * Authentication and User Session API Service
 */
export const safeParseResponse = async (res, defaultMsg = "Thao tác thất bại") => {
  let data = {};
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: defaultMsg };
  }
  if (!res.ok) {
    throw new Error(data.detail || defaultMsg);
  }
  return data;
};

export const fetchAuthConfig = async () => {
  try {
    const res = await fetch("/api/auth/config");
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Could not fetch auth config:", e);
  }
  return { google_client_id: "" };
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    // Grace period of 30 seconds
    return payload.exp * 1000 < Date.now() - 30000;
  } catch {
    return false;
  }
};

export const loginWithGoogle = async (credential, rememberMe = true) => {
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ credential, remember_me: rememberMe }),
  });
  return await safeParseResponse(res, "Đăng nhập Google thất bại");
};

export const loginWithEmail = async (email, password, rememberMe = true) => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember_me: rememberMe }),
  });
  return await safeParseResponse(res, "Đăng nhập thất bại");
};

export const registerWithEmail = async (email, password, name = "", b_trap = "", rememberMe = true) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, b_trap, remember_me: rememberMe }),
  });
  return await safeParseResponse(res, "Đăng ký thất bại");
};

export const fetchCurrentUser = async (token) => {
  if (!token) return { ok: false, error: "no_token" };
  try {
    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return { ok: true, user: data.user };
    }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: "unauthorized" };
    }
    return { ok: false, error: "server_error" };
  } catch (e) {
    console.warn("Could not fetch current user:", e);
    return { ok: false, error: "network_error" };
  }
};

export const fetchStreak = async (token) => {
  try {
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/streak", { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.debug("Could not fetch streak:", e);
  }
  return { current_streak: 0, max_streak: 0, words_today: 0 };
};
