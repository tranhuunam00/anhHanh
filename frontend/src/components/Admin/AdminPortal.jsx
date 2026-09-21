import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageCircle,
  Send,
  X,
  Crown,
  Image as ImageIcon,
  Loader2,
  ZoomIn,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import {
  fetchAdminOverview,
  fetchAdminUsers,
  fetchAdminFeedbacks,
  updateFeedbackStatus,
  updateUserRole
} from '../../services/adminService';
import {
  fetchFeedbackMessages,
  sendFeedbackReply,
  uploadFeedbackImage
} from '../../services/feedbackService';

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

  // Admin Conversation Chat State
  const [chatFeedback, setChatFeedback] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingAdminReply, setIsSendingAdminReply] = useState(false);
  const [adminReplyImageFile, setAdminReplyImageFile] = useState(null);
  const [adminReplyImagePreviewUrl, setAdminReplyImagePreviewUrl] = useState(null);
  const [isUploadingAdminReplyImage, setIsUploadingAdminReplyImage] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const adminFileInputRef = useRef(null);
  const adminChatEndRef = useRef(null);

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

  const handleOpenChat = async (fb) => {
    setChatFeedback(fb);
    setIsLoadingChat(true);
    setChatMessages([]);
    try {
      const data = await fetchFeedbackMessages(fb.id, token);
      setChatMessages(data.messages || []);
      // If feedback had unread messages, update optimistic feedback list
      setFeedbacks((prev) =>
        prev.map((item) =>
          item.id === fb.id ? { ...item, has_unread_messages: false } : item
        )
      );
      // Trigger update for header badge
      window.dispatchEvent(new CustomEvent('shotlang:feedback-updated'));
    } catch (err) {
      showToast && showToast(err.message || 'Không thể tải tin nhắn trao đổi.', 'error');
    } finally {
      setIsLoadingChat(false);
      setTimeout(() => {
        if (adminChatEndRef.current) {
          adminChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleCloseChat = () => {
    setChatFeedback(null);
    setChatMessages([]);
    setAdminReplyText('');
    handleRemoveChatImage();
  };

  const handleSelectChatImage = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast && showToast('Vui lòng chỉ chọn tệp hình ảnh (PNG, JPG, WebP).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast && showToast('Kích thước ảnh tối đa 10MB.', 'error');
      return;
    }
    setAdminReplyImageFile(file);
    if (adminReplyImagePreviewUrl) URL.revokeObjectURL(adminReplyImagePreviewUrl);
    setAdminReplyImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveChatImage = () => {
    if (adminReplyImagePreviewUrl) URL.revokeObjectURL(adminReplyImagePreviewUrl);
    setAdminReplyImageFile(null);
    setAdminReplyImagePreviewUrl(null);
    if (adminFileInputRef.current) adminFileInputRef.current.value = '';
  };

  const handleAdminChatPaste = (e) => {
    if (!e.clipboardData || !e.clipboardData.items) return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleSelectChatImage(file);
          showToast && showToast('Đã dán ảnh từ clipboard!', 'info');
          break;
        }
      }
    }
  };

  const handleSendAdminReply = async (e) => {
    if (e) e.preventDefault();
    if (!chatFeedback) return;
    const text = adminReplyText.trim();
    if (!text && !adminReplyImageFile) return;

    setIsSendingAdminReply(true);
    let uploadedImageUrl = null;
    try {
      if (adminReplyImageFile) {
        setIsUploadingAdminReplyImage(true);
        uploadedImageUrl = await uploadFeedbackImage(adminReplyImageFile, token);
      }

      const res = await sendFeedbackReply(
        chatFeedback.id,
        {
          message: text || 'Đính kèm hình ảnh phản hồi.',
          image_url: uploadedImageUrl
        },
        token
      );

      setChatMessages((prev) => [...prev, res.reply]);
      setAdminReplyText('');
      handleRemoveChatImage();

      // If feedback was PENDING, auto status updated to REVIEWED
      const newStatus = chatFeedback.status === 'PENDING' ? 'REVIEWED' : chatFeedback.status;
      setChatFeedback((prev) => prev ? { ...prev, status: newStatus } : null);
      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === chatFeedback.id
            ? {
                ...fb,
                status: newStatus,
                messages_count: (fb.messages_count || 0) + 1,
                has_unread_messages: false
              }
            : fb
        )
      );

      showToast && showToast('Đã gửi phản hồi đến học viên!', 'success');
      window.dispatchEvent(new CustomEvent('shotlang:feedback-updated'));

      setTimeout(() => {
        if (adminChatEndRef.current) {
          adminChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      showToast && showToast(err.message || 'Lỗi gửi tin nhắn.', 'error');
    } finally {
      setIsSendingAdminReply(false);
      setIsUploadingAdminReplyImage(false);
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
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => setLightboxImage(fb.image_url)}
                        onKeyDown={(e) => e.key === 'Enter' && setLightboxImage(fb.image_url)}
                        style={{
                          display: 'inline-block',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-color, #cbd5e1)',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                          cursor: 'pointer'
                        }}
                        title="Bấm để xem ảnh phóng to"
                      >
                        <img
                          src={fb.image_url}
                          alt="Feedback MinIO screenshot"
                          style={{ maxWidth: '300px', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="feedback-actions-bar">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        padding: '5px 12px',
                        fontWeight: 600,
                        borderColor: fb.has_unread_messages ? '#ef4444' : undefined,
                        background: fb.has_unread_messages ? 'rgba(239, 68, 68, 0.1)' : undefined,
                        color: fb.has_unread_messages ? '#ef4444' : undefined
                      }}
                      onClick={() => handleOpenChat(fb)}
                    >
                      <MessageCircle size={15} />
                      <span>Trao đổi ({fb.messages_count || 0})</span>
                      {fb.has_unread_messages && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#ef4444',
                            display: 'inline-block'
                          }}
                          title="Có tin nhắn mới từ học viên"
                        />
                      )}
                    </button>

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

      {/* ADMIN CONVERSATION MODAL */}
      {chatFeedback && (
        <div className="feedback-modal-overlay" style={{ zIndex: 10000 }}>
          <div
            className="feedback-modal-card"
            style={{
              maxWidth: '740px',
              width: '95%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              className="feedback-modal-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-color, #e2e8f0)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-admin">{getCategoryLabel(chatFeedback.feedback_type)}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    Trao đổi với {chatFeedback.user?.name || chatFeedback.user?.email || 'Học viên'}
                  </span>
                  {getStatusBadge(chatFeedback.status)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                  Email: {chatFeedback.user?.email} • Gửi lúc: {chatFeedback.created_at ? new Date(chatFeedback.created_at).toLocaleString('vi-VN') : ''}
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={handleCloseChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Status Quick Bar */}
            <div
              style={{
                background: 'rgba(148, 163, 184, 0.08)',
                padding: '10px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-color, #e2e8f0)',
                fontSize: '0.82rem'
              }}
            >
              <span style={{ color: '#64748b' }}>Trạng thái phiếu:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`btn ${chatFeedback.status === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                  onClick={async () => {
                    await handleUpdateStatus(chatFeedback.id, 'PENDING');
                    setChatFeedback((prev) => ({ ...prev, status: 'PENDING' }));
                  }}
                >
                  ⏳ Chờ xem xét
                </button>
                <button
                  type="button"
                  className={`btn ${chatFeedback.status === 'REVIEWED' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                  onClick={async () => {
                    await handleUpdateStatus(chatFeedback.id, 'REVIEWED');
                    setChatFeedback((prev) => ({ ...prev, status: 'REVIEWED' }));
                  }}
                >
                  👁 Đã tiếp nhận
                </button>
                <button
                  type="button"
                  className={`btn ${chatFeedback.status === 'RESOLVED' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                  onClick={async () => {
                    await handleUpdateStatus(chatFeedback.id, 'RESOLVED');
                    setChatFeedback((prev) => ({ ...prev, status: 'RESOLVED' }));
                  }}
                >
                  ✓ Đã giải quyết
                </button>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div
              className="conversation-container"
              style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', maxHeight: '420px' }}
            >
              {/* Ticket Root: Initial Feedback by Student */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '0.8rem',
                    color: '#64748b'
                  }}
                >
                  <span style={{ fontWeight: 600, color: 'var(--primary, #3b82f6)' }}>
                    📌 Yêu cầu ban đầu từ học viên:
                  </span>
                  <span>
                    {chatFeedback.created_at
                      ? new Date(chatFeedback.created_at).toLocaleString('vi-VN')
                      : ''}
                  </span>
                </div>
                <div style={{ fontSize: '0.92rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {chatFeedback.content}
                </div>
                {chatFeedback.image_url && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={chatFeedback.image_url}
                      alt="Student attachment"
                      className="chat-bubble-img-preview"
                      onClick={() => setLightboxImage(chatFeedback.image_url)}
                      title="Bấm để xem ảnh phóng to"
                    />
                  </div>
                )}
              </div>

              {/* Chat Thread Messages */}
              {isLoadingChat ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                  <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                  Đang tải đoạn hội thoại...
                </div>
              ) : chatMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: '#94a3b8', fontSize: '0.88rem' }}>
                  <MessageCircle size={36} style={{ margin: '0 auto 10px', opacity: 0.5, display: 'block' }} />
                  Chưa có trao đổi nào. Hãy phản hồi cho học viên bằng khung nhập tin nhắn phía dưới.
                </div>
              ) : (
                chatMessages.map((msg) => {
                  const isStaff = msg.sender_role === 'ADMIN' || msg.user_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`chat-message-row ${isStaff ? 'from-me' : 'from-them'}`}
                    >
                      <div className={`chat-avatar-circle ${isStaff ? 'admin' : 'user'}`}>
                        {isStaff ? '🛡️' : (msg.sender_name ? msg.sender_name.charAt(0).toUpperCase() : 'U')}
                      </div>
                      <div className="chat-bubble-wrapper">
                        <div className="chat-bubble-meta">
                          <span style={{ fontWeight: 600 }}>
                            {isStaff ? 'Quản trị viên (Bạn)' : (msg.sender_name || 'Học viên')}
                          </span>
                          <span>•</span>
                          <span>
                            {msg.created_at
                              ? new Date(msg.created_at).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : ''}
                          </span>
                        </div>
                        <div className={`chat-bubble ${isStaff ? 'bubble-me' : 'bubble-them'}`}>
                          {msg.message}
                          {msg.image_url && (
                            <img
                              src={msg.image_url}
                              alt="Attached screenshot"
                              className="chat-bubble-img-preview"
                              onClick={() => setLightboxImage(msg.image_url)}
                              title="Bấm để xem ảnh phóng to"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={adminChatEndRef} />
            </div>

            {/* Chat Input & Reply Composer */}
            <div
              style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--border-color, #e2e8f0)',
                background: 'var(--card-bg, #ffffff)'
              }}
            >
              {adminReplyImagePreviewUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div className="reply-attached-mini">
                    <ImageIcon size={14} />
                    <span>Đã chọn ảnh ({adminReplyImageFile?.name || 'screenshot.png'})</span>
                    <button
                      type="button"
                      onClick={handleRemoveChatImage}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '0 2px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendAdminReply} className="reply-input-group">
                <textarea
                  className="reply-textarea"
                  placeholder="Nhập nội dung phản hồi cho học viên... (Hỗ trợ dán ảnh màn hình Ctrl+V)"
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  onPaste={handleAdminChatPaste}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendAdminReply();
                    }
                  }}
                  disabled={isSendingAdminReply}
                />

                <input
                  type="file"
                  ref={adminFileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleSelectChatImage(e.target.files[0]);
                    }
                  }}
                />

                <button
                  type="button"
                  className="reply-attach-btn"
                  title="Đính kèm ảnh minh họa"
                  onClick={() => adminFileInputRef.current && adminFileInputRef.current.click()}
                  disabled={isSendingAdminReply}
                >
                  <ImageIcon size={18} />
                </button>

                <button
                  type="submit"
                  className="reply-send-btn"
                  disabled={isSendingAdminReply || (!adminReplyText.trim() && !adminReplyImageFile)}
                >
                  {isSendingAdminReply ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  <span>Gửi</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          className="feedback-modal-overlay"
          style={{ zIndex: 20000, background: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setLightboxImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              style={{
                position: 'absolute',
                top: -36,
                right: 0,
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged screenshot"
              style={{
                maxWidth: '100%',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px',
                display: 'block'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
