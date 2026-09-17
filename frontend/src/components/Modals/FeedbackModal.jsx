import React, { useState, useEffect } from 'react';
import { submitFeedback, fetchMyFeedbacks } from '../../services/feedbackService';

export const FeedbackModal = ({ isOpen, onClose, user, token, onOpenAuth, showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('new'); // 'new' | 'history'
  const [category, setCategory] = useState('SUGGESTION');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen && token && activeSubTab === 'history') {
      loadHistory();
    }
  }, [isOpen, token, activeSubTab]);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const list = await fetchMyFeedbacks(token);
      setMyFeedbacks(list);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      onOpenAuth && onOpenAuth();
      return;
    }

    if (content.trim().length < 5) {
      setErrorMsg('Vui lòng nhập nội dung ít nhất 5 ký tự.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await submitFeedback(
        {
          category,
          rating,
          content: content.trim()
        },
        token
      );

      showToast && showToast('Cảm ơn bạn! Phản hồi đã được gửi thành công.', 'success');
      setContent('');
      setActiveSubTab('history');
      loadHistory();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      case 'SUGGESTION': return '💡 Đề xuất ý tưởng';
      case 'CONTENT': return '📖 Nội dung bài học';
      default: return '💬 Góp ý chung';
    }
  };

  return (
    <div className="feedback-modal-overlay" onClick={onClose}>
      <div className="feedback-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="feedback-modal-header">
          <h3 className="feedback-modal-title">
            <span>💬</span>
            <span>Hòm thư Góp ý & Báo lỗi</span>
          </h3>
          <button className="feedback-close-btn" onClick={onClose} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Sub Navigation (Gửi mới vs Lịch sử) */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color, #e2e8f0)', padding: '0 24px' }}>
          <button
            type="button"
            className={`admin-tab-btn ${activeSubTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('new')}
            style={{ borderRadius: '8px 8px 0 0', borderBottom: activeSubTab === 'new' ? '2px solid #3b82f6' : 'none' }}
          >
            ✏️ Gửi phản hồi mới
          </button>
          {user && (
            <button
              type="button"
              className={`admin-tab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('history');
                loadHistory();
              }}
              style={{ borderRadius: '8px 8px 0 0', borderBottom: activeSubTab === 'history' ? '2px solid #3b82f6' : 'none' }}
            >
              📋 Lịch sử đóng góp
            </button>
          )}
        </div>

        <div className="feedback-modal-body">
          {!user ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
              <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>Yêu cầu đăng nhập</h4>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                Để đảm bảo chất lượng phản hồi và bảo vệ hệ thống khỏi spam, vui lòng đăng nhập trước khi gửi góp ý.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onOpenAuth && onOpenAuth();
                }}
                style={{ padding: '8px 20px' }}
              >
                Đăng nhập / Đăng ký ngay
              </button>
            </div>
          ) : activeSubTab === 'new' ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {errorMsg && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontSize: '0.85rem' }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Feedback Type Pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px', color: '#64748b' }}>
                  Loại ý kiến đóng góp:
                </label>
                <div className="feedback-type-pills">
                  {[
                    { id: 'SUGGESTION', label: '💡 Đề xuất mới' },
                    { id: 'BUG', label: '🐛 Báo lỗi kỹ thuật' },
                    { id: 'CONTENT', label: '📖 Nội dung bài học' },
                    { id: 'GENERAL', label: '💬 Ý kiến khác' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`type-pill ${category === item.id ? 'active' : ''}`}
                      onClick={() => setCategory(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Stars */}
              <div className="feedback-rating-row">
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748b' }}>Đánh giá trải nghiệm:</span>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= rating ? 'filled' : ''}`}
                      onClick={() => setRating(star)}
                      title={`${star} sao`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f59e0b' }}>
                  {rating === 5 ? 'Tuyệt vời!' : rating === 4 ? 'Rất tốt' : rating === 3 ? 'Bình thường' : 'Cần cải thiện'}
                </span>
              </div>

              {/* Content Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '6px', color: '#64748b' }}>
                  Chi tiết nội dung góp ý hoặc mô tả lỗi:
                </label>
                <textarea
                  className="feedback-textarea"
                  placeholder="Chia sẻ ý kiến đóng góp, tính năng bạn mong muốn hoặc mô tả chi tiết lỗi bạn gặp phải..."
                  value={content}
                  maxLength={2000}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  required
                />
                <div className="feedback-footer-info">
                  <span>Tối thiểu 5 ký tự</span>
                  <span>{content.length}/2000 ký tự</span>
                </div>
              </div>

              <div className="feedback-modal-actions" style={{ padding: '8px 0 0' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-with-icon"
                  disabled={isSubmitting || content.trim().length < 5}
                >
                  {isSubmitting ? (
                    <span>Đang gửi...</span>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                      <span>Gửi góp ý</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="my-feedbacks-list">
              {isLoadingHistory ? (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>Đang tải lịch sử...</div>
              ) : myFeedbacks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b' }}>
                  <p>Bạn chưa gửi phản hồi nào. Hãy chia sẻ ý kiến để giúp ShotLang hoàn thiện hơn!</p>
                </div>
              ) : (
                myFeedbacks.map((item) => (
                  <div key={item.id} className="my-feedback-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                        {getCategoryLabel(item.feedback_type)}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p style={{ margin: '0 0 8px', color: 'inherit', lineHeight: 1.4 }}>
                      {item.content}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
                      <span>Đánh giá: {item.rating ? `${item.rating} ★` : '—'}</span>
                      <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : ''}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
