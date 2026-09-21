import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminOverview,
  fetchAdminUsers,
  fetchAdminFeedbacks,
  updateFeedbackStatus,
  updateUserRole
} from '../../services/adminService';

export const AdminPortal = ({ user, token, showToast }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'feedbacks'
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackFilter, setFeedbackFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [updatingFbId, setUpdatingFbId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);

  // Security check: Only role === 'ADMIN'
  const isAdmin = user && user.role === 'ADMIN';

  const loadOverview = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      setIsLoading(true);
      const data = await fetchAdminOverview(token);
      setOverview(data);
    } catch (err) {
      showToast && showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdmin, showToast]);

  const loadUsers = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      setIsLoading(true);
      const data = await fetchAdminUsers(searchQuery, token);
      setUsers(data.users || []);
    } catch (err) {
      showToast && showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdmin, searchQuery, showToast]);

  const loadFeedbacks = useCallback(async () => {
    if (!token || !isAdmin) return;
    try {
      setIsLoading(true);
      const data = await fetchAdminFeedbacks(feedbackFilter, 50, 0, token);
      setFeedbacks(data.feedbacks || []);
    } catch (err) {
      showToast && showToast(err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdmin, feedbackFilter, showToast]);

  useEffect(() => {
    if (activeTab === 'overview') loadOverview();
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'feedbacks') loadFeedbacks();
  }, [activeTab, loadOverview, loadUsers, loadFeedbacks]);

  // Handle status update
  const handleUpdateStatus = async (fbId, newStatus) => {
    try {
      setUpdatingFbId(fbId);
      await updateFeedbackStatus(fbId, newStatus, token);
      showToast && showToast(`Đã chuyển trạng thái sang ${newStatus}`, 'success');
      // Optimistic update
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === fbId ? { ...fb, status: newStatus } : fb))
      );
      window.dispatchEvent(new CustomEvent('shotlang:feedback-updated'));
    } catch (err) {
      showToast && showToast(err.message, 'error');
    } finally {
      setUpdatingFbId(null);
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    const confirmMsg = newRole === 'ADMIN'
      ? `Cấp quyền ADMIN cho người dùng này?`
      : `Hạ quyền người dùng này về USER?`;
    if (!window.confirm(confirmMsg)) return;
    try {
      setUpdatingRoleId(userId);
      await updateUserRole(userId, newRole, token);
      showToast && showToast(
        newRole === 'ADMIN' ? '✅ Đã cấp quyền ADMIN' : '✅ Đã hạ về USER',
        'success'
      );
      // Optimistic update
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, role: newRole } : u)
      );
    } catch (err) {
      showToast && showToast(err.message, 'error');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-portal-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛡️</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Khu vực Quản trị Hạn chế</h2>
        <p style={{ color: '#64748b', maxWidth: '460px', margin: '0 auto 20px', lineHeight: 1.5 }}>
          Bạn cần đăng nhập bằng tài khoản Quản trị viên (Admin) để có quyền truy cập dữ liệu và công cụ quản trị hệ thống.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="badge badge-resolved">✓ Đã giải quyết</span>;
      case 'REVIEWED':
        return <span className="badge badge-reviewed">👁 Đã tiếp nhận</span>;
      default:
        return <span className="badge badge-pending">⏳ Chờ xem xét</span>;
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'BUG': return '🐛 Báo lỗi';
      case 'SUGGESTION': return '💡 Đề xuất';
      case 'CONTENT': return '📖 Nội dung';
      default: return '💬 Chung';
    }
  };

  return (
    <div className="admin-portal-container">
      {/* Top Header */}
      <div className="admin-header-bar">
        <div className="admin-title-group">
          <h1>
            <span>⚙️</span>
            <span>Bảng Điều Khiển Quản Trị</span>
          </h1>
          <p>Giám sát tiến độ học tập của người dùng và hòm thư phản hồi hệ thống</p>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Tổng quan
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Người dùng & Tiến độ
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedbacks')}
          >
            📬 Hòm thư góp ý
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {isLoading && !overview ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải số liệu hệ thống...</div>
          ) : (
            <>
              <div className="admin-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-users">👥</div>
                  <div className="stat-info">
                    <div className="stat-value">{overview?.users_count ?? 0}</div>
                    <div className="stat-label">Tổng người dùng đã đăng ký</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-lessons">🎬</div>
                  <div className="stat-info">
                    <div className="stat-value">{overview?.lessons_count ?? 0}</div>
                    <div className="stat-label">Bài học YouTube được lưu trữ</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-sessions">✍️</div>
                  <div className="stat-info">
                    <div className="stat-value">{overview?.sessions_count ?? 0}</div>
                    <div className="stat-label">Lượt phiên luyện chép bắt đầu</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-completed">🏆</div>
                  <div className="stat-info">
                    <div className="stat-value">{overview?.completed_sessions_count ?? 0}</div>
                    <div className="stat-label">Lượt bài hoàn thành 100%</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-feedbacks">📬</div>
                  <div className="stat-info">
                    <div className="stat-value">{overview?.feedbacks_pending ?? 0}</div>
                    <div className="stat-label">Góp ý đang chờ xử lý</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper stat-icon-vocab">📚</div>
                  <div className="stat-info">
                    <div className="stat-value">{overview?.vocab_total ?? 0}</div>
                    <div className="stat-label">Từ vựng người dùng đã lưu</div>
                  </div>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="admin-card-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.05rem', fontWeight: 700 }}>Kiểm tra người dùng & phản hồi mới</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Xem chi tiết tiến độ từng bài làm của học viên hoặc giải quyết các ý kiến đóng góp.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('users')}>
                    Xem danh sách học viên →
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveTab('feedbacks')}>
                    Xem phản hồi ({overview?.feedbacks_pending ?? 0}) →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: USERS & LESSON PROGRESS ANALYTICS */}
      {activeTab === 'users' && (
        <div className="admin-card-section">
          <div className="admin-filter-row">
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>Danh sách Người dùng ({users.length})</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Bấm vào một người dùng để xem tỉ lệ hoàn thành từng bài học (%)
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loadUsers();
              }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <input
                type="text"
                className="admin-search-input"
                placeholder="Tìm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                Tìm
              </button>
            </form>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải danh sách người dùng...</div>
          ) : users.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Không tìm thấy người dùng phù hợp.</div>
          ) : (
            <div>
              {users.map((u) => {
                const isExpanded = expandedUserId === u.id;
                return (
                  <div key={u.id} className="user-item-card">
                    <div
                      className="user-item-summary"
                      onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                    >
                      <div className="user-left-info">
                        <div className="user-avatar-circle">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt={u.name} />
                          ) : (
                            <span>{(u.name || u.email || 'U').charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="user-text-meta">
                          <div className="user-name">
                            <span>{u.name || u.email.split('@')[0]}</span>
                            {u.role === 'ADMIN' && <span className="badge badge-admin">ADMIN</span>}
                          </div>
                          <div className="user-email">{u.email}</div>
                        </div>
                      </div>

                      <div className="user-right-metrics">
                        <span className="metric-pill" title="Tổng số bài đã bắt đầu">
                          📖 <strong>{u.total_lessons_attempted || u.total_lessons_started || 0}</strong> bài học
                        </span>
                        <span className="metric-pill" style={{ color: '#059669' }} title="Số bài đã hoàn thành 100%">
                          🏆 <strong>{u.completed_lessons || u.total_lessons_completed || 0}</strong> hoàn thành
                        </span>
                        <span className="metric-pill" title="Chuỗi Streak ngày">
                          🔥 <strong>{u.streak?.current_streak || 0}</strong> ngày
                        </span>
                        <span className="metric-pill" title="Từ vựng đã lưu">
                          📚 <strong>{u.total_vocab_count || 0}</strong> từ
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                          {isExpanded ? '▲ Thu gọn' : '▼ Chi tiết'}
                        </span>
                        {/* Role management button */}
                        <button
                          type="button"
                          className={`btn ${u.role === 'ADMIN' ? 'btn-danger-outline' : 'btn-primary-outline'}`}
                          style={{ fontSize: '0.75rem', padding: '4px 10px', minWidth: 110 }}
                          disabled={updatingRoleId === u.id}
                          onClick={(e) => { e.stopPropagation(); handleUpdateRole(u.id, u.role); }}
                          title={u.role === 'ADMIN' ? 'Hạ xuống USER' : 'Nâng lên ADMIN'}
                        >
                          {updatingRoleId === u.id
                            ? '⏳ Đang xử lý...'
                            : u.role === 'ADMIN' ? '🔽 Hạ về USER' : '🔼 Cấp ADMIN'
                          }
                        </button>
                      </div>
                    </div>

                    {/* EXPANDED LESSONS BREAKDOWN */}
                    {isExpanded && (
                      <div className="user-lessons-breakdown">
                        <div className="lessons-table-title">
                          Tiến độ chi tiết từng bài học của {u.name || u.email}:
                        </div>
                        {!u.lessons || u.lessons.length === 0 ? (
                          <div style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
                            Người dùng này chưa bắt đầu bài luyện chép chính tả nào.
                          </div>
                        ) : (
                          u.lessons.map((lessonItem) => {
                            const isDone = lessonItem.is_completed || lessonItem.completion_rate >= 100;
                            const progressPercent = Math.min(100, Math.max(0, lessonItem.completion_rate || 0));

                            return (
                              <div key={lessonItem.lesson_id} className="user-lesson-row">
                                <div className="lesson-meta-thumb">
                                  {lessonItem.thumbnail_url ? (
                                    <img src={lessonItem.thumbnail_url} alt={lessonItem.title} />
                                  ) : (
                                    <div style={{ width: 56, height: 36, background: '#334155', borderRadius: 6 }} />
                                  )}
                                  <div>
                                    <div className="lesson-title" title={lessonItem.title}>
                                      {lessonItem.title}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                      Vị trí: Câu {lessonItem.current_position} / {lessonItem.total_challenges} • Học gần nhất: {lessonItem.last_studied_at ? new Date(lessonItem.last_studied_at).toLocaleDateString('vi-VN') : '—'}
                                    </div>
                                  </div>
                                </div>

                                <div className="lesson-progress-box">
                                  <div className="progress-bar-container">
                                    <div
                                      className="progress-bar-fill"
                                      style={{
                                        width: `${progressPercent}%`,
                                        background: isDone
                                          ? 'linear-gradient(90deg, #10b981, #059669)'
                                          : 'linear-gradient(90deg, #3b82f6, #6366f1)'
                                      }}
                                    />
                                  </div>
                                  <span
                                    className="progress-rate-text"
                                    style={{ color: isDone ? '#059669' : '#2563eb' }}
                                  >
                                    {progressPercent.toFixed(1)}%
                                  </span>
                                  {isDone ? (
                                    <span className="badge badge-resolved">Hoàn thành</span>
                                  ) : (
                                    <span className="badge badge-pending">Đang làm</span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FEEDBACKS MANAGEMENT */}
      {activeTab === 'feedbacks' && (
        <div className="admin-card-section">
          <div className="admin-filter-row">
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 700 }}>Hòm thư Phản hồi & Báo lỗi</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Duyệt và cập nhật trạng thái các góp ý từ học viên
              </p>
            </div>

            <div className="feedback-type-pills">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'PENDING', label: '⏳ Chờ xem xét' },
                { id: 'REVIEWED', label: '👁 Đã tiếp nhận' },
                { id: 'RESOLVED', label: '✓ Đã giải quyết' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`type-pill ${feedbackFilter === f.id ? 'active' : ''}`}
                  onClick={() => setFeedbackFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải phản hồi...</div>
          ) : feedbacks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Không có phản hồi nào trong mục này.</div>
          ) : (
            <div>
              {feedbacks.map((fb) => (
                <div key={fb.id} className="feedback-admin-card">
                  <div className="feedback-admin-top">
                    <div>
                      <div className="feedback-sender-info">
                        <span>{fb.user?.name || fb.user?.email || 'Người dùng ẩn danh'}</span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 400 }}>({fb.user?.email})</span>
                        <span className="badge badge-admin">{getCategoryLabel(fb.feedback_type)}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>
                        Đánh giá: {fb.rating ? `${'★'.repeat(fb.rating)} (${fb.rating}/5)` : 'Không đánh giá'} • Gửi lúc: {fb.created_at ? new Date(fb.created_at).toLocaleString('vi-VN') : ''}
                      </div>
                    </div>
                    <div>{getStatusBadge(fb.status)}</div>
                  </div>

                  <div className="feedback-content-text">{fb.content}</div>

                  {fb.image_url && (
                    <div style={{ marginTop: '10px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                        📷 Ảnh đính kèm (Lưu trữ MinIO S3):
                      </div>
                      <a
                        href={fb.image_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-block',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                        }}
                        title="Bấm để mở ảnh kích thước lớn trong tab mới"
                      >
                        <img
                          src={fb.image_url}
                          alt="Feedback MinIO screenshot"
                          style={{ maxWidth: '300px', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                        />
                      </a>
                    </div>
                  )}

                  <div className="feedback-actions-bar">
                    {fb.status !== 'REVIEWED' && (
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                        disabled={updatingFbId === fb.id}
                        onClick={() => handleUpdateStatus(fb.id, 'REVIEWED')}
                      >
                        Đánh dấu đã tiếp nhận
                      </button>
                    )}
                    {fb.status !== 'RESOLVED' && (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                        disabled={updatingFbId === fb.id}
                        onClick={() => handleUpdateStatus(fb.id, 'RESOLVED')}
                      >
                        Đánh dấu đã giải quyết ✓
                      </button>
                    )}
                    {fb.status !== 'PENDING' && (
                      <button
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                        disabled={updatingFbId === fb.id}
                        onClick={() => handleUpdateStatus(fb.id, 'PENDING')}
                      >
                        Chuyển về chờ xử lý
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
