/**
 * Study Buddy & Nearby Location API Service
 */
const BASE_URL = "/api/buddy";

/**
 * Update current user's live coordinates and study preferences
 */
export async function updateLocation(token, payload) {
  if (!token) return { ok: false, error: "unauthorized" };
  try {
    const res = await fetch(`${BASE_URL}/location`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.detail || "Cập nhật vị trí thất bại." };
    }
    return await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

/**
 * Fetch nearby study buddies within radius_km
 */
export async function fetchNearbyBuddies(token, { lat, lon, radius_km = 50, limit = 50 }) {
  if (!token) return { ok: false, buddies: [] };
  try {
    const query = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      radius_km: String(radius_km),
      limit: String(limit),
    });
    const res = await fetch(`${BASE_URL}/nearby?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return { ok: false, buddies: [] };
    }
    return await res.json();
  } catch {
    return { ok: false, buddies: [] };
  }
}

/**
 * Send friend request
 */
export async function sendFriendRequest(token, receiverId) {
  if (!token) return { ok: false, message: "Vui lòng đăng nhập." };
  try {
    const res = await fetch(`${BASE_URL}/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiver_id: receiverId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data.detail || "Gửi lời mời thất bại." };
    }
    return data;
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

/**
 * Accept or reject incoming friend request
 */
export async function respondFriendRequest(token, requestId, action) {
  if (!token) return { ok: false, message: "Vui lòng đăng nhập." };
  try {
    const res = await fetch(`${BASE_URL}/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ request_id: requestId, action }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, message: data.detail || "Thao tác thất bại." };
    }
    return data;
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

/**
 * Retrieve connected friends and incoming requests
 */
export async function fetchFriendsList(token) {
  if (!token) return { ok: false, friends: [], incoming_requests: [] };
  try {
    const res = await fetch(`${BASE_URL}/friends`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return { ok: false, friends: [], incoming_requests: [] };
    }
    return await res.json();
  } catch {
    return { ok: false, friends: [], incoming_requests: [] };
  }
}

/**
 * Unfriend or remove connection
 */
export async function unfriend(token, otherId) {
  if (!token) return { ok: false, message: "Vui lòng đăng nhập." };
  try {
    const res = await fetch(`${BASE_URL}/friend/${otherId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json().catch(() => ({ ok: true }));
  } catch (e) {
    return { ok: false, message: e.message };
  }
}

/**
 * Search study buddies by email, user ID, or name
 */
export async function searchStudyBuddies(token, query) {
  if (!token || !query?.trim()) return { ok: false, results: [] };
  try {
    const params = new URLSearchParams({ q: query.trim() });
    const res = await fetch(`${BASE_URL}/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      return { ok: false, results: [] };
    }
    return await res.json();
  } catch {
    return { ok: false, results: [] };
  }
}

/**
 * Ping backend to refresh user's online activity
 */
export async function pingBuddyActive(token) {
  if (!token) return;
  try {
    await fetch(`${BASE_URL}/ping`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    // Ignore silent ping errors
  }
}


