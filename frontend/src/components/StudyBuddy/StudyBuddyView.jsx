import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  MapPin,
  Compass,
  RotateCw,
  Search,
  UserPlus,
  ShieldCheck,
  Sparkles,
} from "../Icons";
import { StudyBuddyCard } from "./StudyBuddyCard";
import {
  RADIUS_OPTIONS,
  filterBuddiesByQuery,
  sanitizeBuddiesList,
} from "../../utils/studyBuddyUtils";
import {
  fetchNearbyBuddies,
  sendFriendRequest,
  respondFriendRequest,
  fetchFriendsList,
  unfriend,
  updateLocation,
} from "../../services/studyBuddyService";
import "./studyBuddy.css";

export const StudyBuddyView = ({ token, currentUser, showToast }) => {
  const [subTab, setSubTab] = useState("discover"); // discover | requests | friends
  const [coords, setCoords] = useState(() => {
    if (currentUser?.latitude && currentUser?.longitude) {
      return { lat: currentUser.latitude, lon: currentUser.longitude };
    }
    return null;
  });
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState("");
  const [radiusKm, setRadiusKm] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [buddies, setBuddies] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // Request real GPS coordinates from browser
  const handleRequestGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }
    setIsGpsLoading(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = { lat: latitude, lon: longitude };
        setCoords(newCoords);
        setIsGpsLoading(false);

        // Sync with backend
        if (token) {
          await updateLocation(token, {
            latitude,
            longitude,
            study_target: currentUser?.study_target,
          });
        }
      },
      (err) => {
        setIsGpsLoading(false);
        if (err.code === 1) {
          setGpsError("Bạn đã chặn quyền truy cập vị trí. Hãy bật lại trong cài đặt trình duyệt để tìm bạn quanh đây.");
        } else {
          setGpsError("Không thể lấy tọa độ thực tế. Vui lòng thử lại sau.");
        }
      },
      { timeout: 12000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }, [token, currentUser]);

  // Load nearby buddies when coords or radius changes
  const loadNearby = useCallback(async () => {
    if (!token || !coords) return;
    setIsLoadingList(true);
    try {
      const res = await fetchNearbyBuddies(token, {
        lat: coords.lat,
        lon: coords.lon,
        radius_km: radiusKm,
      });
      if (res?.buddies) {
        setBuddies(sanitizeBuddiesList(res.buddies));
      }
    } finally {
      setIsLoadingList(false);
    }
  }, [token, coords, radiusKm]);

  // Load friends and incoming requests
  const loadFriendsAndRequests = useCallback(async () => {
    if (!token) return;
    const res = await fetchFriendsList(token);
    if (res?.friends) setFriends(res.friends);
    if (res?.incoming_requests) setRequests(res.incoming_requests);
  }, [token]);

  // Initial load
  useEffect(() => {
    if (coords) {
      loadNearby();
    }
    loadFriendsAndRequests();
  }, [coords, loadNearby, loadFriendsAndRequests]);

  // Send friend request
  const handleSendRequest = async (receiverId) => {
    setProcessingId(receiverId);
    try {
      const res = await sendFriendRequest(token, receiverId);
      if (res?.ok) {
        if (showToast) showToast(res.message || "Đã gửi lời mời kết bạn!", "success");
        // Update local state
        setBuddies((prev) =>
          prev.map((b) => (b.id === receiverId ? { ...b, friendship_status: "PENDING_SENT" } : b))
        );
      } else {
        if (showToast) showToast(res.message || "Gửi lời mời thất bại", "error");
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Respond to incoming request
  const handleRespond = async (requestId, action) => {
    setProcessingId(requestId);
    try {
      const res = await respondFriendRequest(token, requestId, action);
      if (res?.ok) {
        if (showToast) showToast(res.message || "Thao tác thành công!", "success");
        await loadFriendsAndRequests();
        await loadNearby();
      } else {
        if (showToast) showToast(res.message || "Thao tác thất bại", "error");
      }
    } finally {
      setProcessingId(null);
    }
  };

  // Unfriend
  const handleUnfriend = async (otherId) => {
    const ok = window.confirm("Bạn có chắc chắn muốn hủy kết bạn?");
    if (!ok) return;
    const res = await unfriend(token, otherId);
    if (res?.ok) {
      if (showToast) showToast("Đã hủy kết bạn.", "info");
      await loadFriendsAndRequests();
      await loadNearby();
    }
  };

  // Filter buddies by search
  const filteredBuddies = useMemo(() => {
    return filterBuddiesByQuery(buddies, searchQuery);
  }, [buddies, searchQuery]);

  return (
    <div className="study-buddy-container">
      {/* Top Banner & Header */}
      <div className="study-buddy-header-card">
        <div className="study-buddy-title-group">
          <div className="study-buddy-icon-wrap">
            <Compass size={22} />
          </div>
          <div>
            <h2 className="study-buddy-main-title">
              Tìm Bạn Học Quanh Đây <span>(GPS Thực Tế)</span>
            </h2>
            <p className="study-buddy-sub-desc">
              Kết nối những người cùng học tiếng Anh, luyện thi IELTS gần khu vực của bạn để cùng duy trì chuỗi học tập.
            </p>
          </div>
        </div>

        {/* Location Status Badge */}
        <div className="study-buddy-location-status">
          {coords ? (
            <div className="location-active-tag">
              <MapPin size={13} />
              <span>Đã kích hoạt định vị thực tế</span>
            </div>
          ) : (
            <button
              type="button"
              className="btn-enable-gps"
              onClick={handleRequestGps}
              disabled={isGpsLoading}
            >
              <Compass size={14} className={isGpsLoading ? "spin" : ""} />
              <span>{isGpsLoading ? "Đang dò GPS..." : "📍 Bật định vị tìm bạn"}</span>
            </button>
          )}
        </div>
      </div>

      {gpsError && (
        <div className="study-buddy-alert-box warning">
          <span>{gpsError}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="study-buddy-nav-bar">
        <div className="study-buddy-tabs-row" role="tablist">
          <button
            type="button"
            className={`buddy-tab-btn ${subTab === "discover" ? "active" : ""}`}
            onClick={() => setSubTab("discover")}
          >
            <Compass size={14} />
            <span>Khám phá quanh đây</span>
            {buddies.length > 0 && <span className="buddy-tab-badge">{buddies.length}</span>}
          </button>

          <button
            type="button"
            className={`buddy-tab-btn ${subTab === "requests" ? "active" : ""}`}
            onClick={() => setSubTab("requests")}
          >
            <UserPlus size={14} />
            <span>Lời mời kết bạn</span>
            {requests.length > 0 && (
              <span className="buddy-tab-badge alert">{requests.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`buddy-tab-btn ${subTab === "friends" ? "active" : ""}`}
            onClick={() => setSubTab("friends")}
          >
            <Users size={14} />
            <span>Bạn bè</span>
            {friends.length > 0 && <span className="buddy-tab-badge">{friends.length}</span>}
          </button>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          className="btn-buddy-refresh"
          onClick={() => {
            loadNearby();
            loadFriendsAndRequests();
          }}
          title="Làm mới danh sách"
          disabled={isLoadingList}
        >
          <RotateCw size={14} className={isLoadingList ? "spin" : ""} />
        </button>
      </div>

      {/* TAB 1: DISCOVER NEARBY */}
      {subTab === "discover" && (
        <div className="study-buddy-tab-content">
          {/* Controls Bar: Search & Distance Filters */}
          <div className="study-buddy-filter-bar">
            <div className="buddy-search-input-wrap">
              <Search size={14} className="buddy-search-icon" />
              <input
                type="text"
                placeholder="Tìm bạn theo tên, mục tiêu (IELTS, giao tiếp)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="buddy-search-input"
              />
            </div>

            <div className="buddy-radius-pills-row">
              <span className="radius-label">Bán kính:</span>
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`radius-pill ${radiusKm === opt.value ? "active" : ""}`}
                  onClick={() => setRadiusKm(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {!coords ? (
            <div className="study-buddy-empty-card">
              <Compass size={40} className="empty-icon" />
              <h3>Chưa bật định vị vị trí thực tế</h3>
              <p>Bật định vị để hệ thống tự động tìm và sắp xếp các bạn học ở gần bạn nhất.</p>
              <button
                type="button"
                className="btn-enable-gps-large"
                onClick={handleRequestGps}
                disabled={isGpsLoading}
              >
                <MapPin size={16} />
                <span>Bật vị trí ngay bây giờ</span>
              </button>
            </div>
          ) : isLoadingList ? (
            <div className="study-buddy-loading-row">
              <RotateCw size={24} className="spin" />
              <span>Đang quét các bạn học quanh khu vực của bạn...</span>
            </div>
          ) : filteredBuddies.length === 0 ? (
            <div className="study-buddy-empty-card">
              <Users size={36} className="empty-icon" />
              <h3>Chưa tìm thấy bạn học trong bán kính {radiusKm} km</h3>
              <p>Hãy thử mở rộng bán kính tìm kiếm sang 50 km hoặc Toàn quốc.</p>
            </div>
          ) : (
            <div className="study-buddy-grid">
              {filteredBuddies.map((buddy) => (
                <StudyBuddyCard
                  key={buddy.id}
                  buddy={buddy}
                  onSendRequest={handleSendRequest}
                  onRespond={handleRespond}
                  onUnfriend={handleUnfriend}
                  isProcessing={processingId === buddy.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INCOMING REQUESTS */}
      {subTab === "requests" && (
        <div className="study-buddy-tab-content">
          {requests.length === 0 ? (
            <div className="study-buddy-empty-card">
              <ShieldCheck size={36} className="empty-icon" />
              <h3>Không có lời mời kết bạn nào đang chờ</h3>
              <p>Khi các bạn học khác gửi lời mời, bạn sẽ thấy thông báo tại đây.</p>
            </div>
          ) : (
            <div className="study-buddy-grid">
              {requests.map((req) => (
                <StudyBuddyCard
                  key={req.id}
                  buddy={{
                    ...req,
                    friendship_status: "PENDING_RECEIVED",
                  }}
                  onRespond={handleRespond}
                  isProcessing={processingId === req.friendship_id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ACCEPTED FRIENDS */}
      {subTab === "friends" && (
        <div className="study-buddy-tab-content">
          {friends.length === 0 ? (
            <div className="study-buddy-empty-card">
              <Sparkles size={36} className="empty-icon" />
              <h3>Bạn chưa kết nối với bạn học nào</h3>
              <p>Hãy sang tab &quot;Khám phá quanh đây&quot; để kết nối với những người bạn học đầu tiên!</p>
            </div>
          ) : (
            <div className="study-buddy-grid">
              {friends.map((friend) => (
                <StudyBuddyCard
                  key={friend.id}
                  buddy={{
                    ...friend,
                    friendship_status: "FRIEND",
                  }}
                  onUnfriend={handleUnfriend}
                  isProcessing={processingId === friend.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudyBuddyView;

