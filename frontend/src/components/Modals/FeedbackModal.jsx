import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquarePlus,
  PenLine,
  History,
  Lock,
  AlertCircle,
  Lightbulb,
  Bug,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  Eye,
  Clock,
  Send,
  X,
  Star,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  ZoomIn,
  Crown,
  ArrowLeft,
} from 'lucide-react';
import {
  submitFeedback,
  fetchMyFeedbacks,
  uploadFeedbackImage,
  fetchFeedbackMessages,
  sendFeedbackReply,
} from '../../services/feedbackService';

export const FeedbackModal = ({ isOpen, onClose, user, token, onOpenAuth, onOpenAdminTab, showToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('new'); // 'new' | 'history'
  const [category, setCategory] = useState('SUGGESTION');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // MinIO Image Attachment State
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const fileInputRef = useRef(null);

  // Conversation Thread State
  const [selectedThreadFeedback, setSelectedThreadFeedback] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [isLoadingThread, setIsLoadingThread] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyImageFile, setReplyImageFile] = useState(null);
  const [replyImagePreviewUrl, setReplyImagePreviewUrl] = useState(null);
  const [isUploadingReplyImage, setIsUploadingReplyImage] = useState(false);
  const replyFileInputRef = useRef(null);
  const threadEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && token && activeSubTab === 'history') {
      loadHistory();
    }
  }, [isOpen, token, activeSubTab]);

  useEffect(() => {
    const handleFeedbackUpdated = () => {
      if (token && activeSubTab === 'history') {
        loadHistory();
      }
    };
    window.addEventListener('shotlang:feedback-updated', handleFeedbackUpdated);
    return () => window.removeEventListener('shotlang:feedback-updated', handleFeedbackUpdated);
  }, [token, activeSubTab]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      if (replyImagePreviewUrl) URL.revokeObjectURL(replyImagePreviewUrl);
    };
  }, [imagePreviewUrl, replyImagePreviewUrl]);

  useEffect(() => {
    if (selectedThreadFeedback && threadEndRef.current) {
      threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threadMessages, selectedThreadFeedback]);

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

  const handleOpenThread = async (feedbackItem) => {
    setSelectedThreadFeedback(feedbackItem);
    setIsLoadingThread(true);
    try {
      const data = await fetchFeedbackMessages(feedbackItem.id, token);
      const msgs = data.messages || [];
      setThreadMessages(msgs);
      // Update local card item with latest messages_count and clear unread_replies
      setMyFeedbacks((prev) =>
        prev.map((f) =>
          f.id === feedbackItem.id
            ? { ...f, messages_count: msgs.length, unread_replies: 0 }
            : f
        )
      );
      if (feedbackItem.unread_replies > 0) {
        window.dispatchEvent(new CustomEvent('shotlang:feedback-updated'));
      }
    } catch (err) {
      console.error('Error loading thread:', err);
      showToast && showToast('Không thể tải cuộc hội thoại.', 'error');
    } finally {
      setIsLoadingThread(false);
    }
  };

  const handleCloseThread = () => {
    setSelectedThreadFeedback(null);
    setThreadMessages([]);
    setReplyText('');
    handleRemoveReplyImage();
  };

  const handleSelectReplyFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast && showToast('Vui lòng chỉ chọn tập tin ảnh.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast && showToast('Dung lượng ảnh vượt quá 10MB.', 'error');
      return;
    }
    setReplyImageFile(file);
    if (replyImagePreviewUrl) URL.revokeObjectURL(replyImagePreviewUrl);
    setReplyImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveReplyImage = () => {
    if (replyImagePreviewUrl) URL.revokeObjectURL(replyImagePreviewUrl);
    setReplyImageFile(null);
    setReplyImagePreviewUrl(null);
    if (replyFileInputRef.current) replyFileInputRef.current.value = '';
  };

  const handleSendReply = async (e) => {
    if (e) e.preventDefault();
    if (!selectedThreadFeedback) return;
    const text = replyText.trim();
    if (!text && !replyImageFile) {
      return;
    }

    setIsSendingReply(true);
    let uploadedImg = null;
    try {
      if (replyImageFile) {
        setIsUploadingReplyImage(true);
        uploadedImg = await uploadFeedbackImage(replyImageFile, token);
      }

      const res = await sendFeedbackReply(
        selectedThreadFeedback.id,
        { message: text || 'Đính kèm ảnh minh họa', image_url: uploadedImg },
        token
      );

      setThreadMessages((prev) => [...prev, res.reply]);
      setMyFeedbacks((prev) =>
        prev.map((f) =>
          f.id === selectedThreadFeedback.id
            ? { ...f, messages_count: (f.messages_count || 0) + 1 }
            : f
        )
      );
      setReplyText('');
      handleRemoveReplyImage();
      window.dispatchEvent(new CustomEvent('shotlang:feedback-updated'));
    } catch (err) {
      showToast && showToast(err.message || 'Lỗi gửi phản hồi.', 'error');
    } finally {
      setIsSendingReply(false);
      setIsUploadingReplyImage(false);
    }
  };

  if (!isOpen) return null;

  const handleSelectFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chỉ chọn tập tin hình ảnh (PNG, JPG, WebP, GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }
    setErrorMsg('');
    setSelectedImageFile(file);
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Support pasting screenshot from clipboard (Ctrl+V)
  const handlePaste = (e) => {
    if (!e.clipboardData || !e.clipboardData.items) return;
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          if (selectedThreadFeedback) {
            handleSelectReplyFile(file);
            showToast && showToast('Đã dán ảnh vào phản hồi!', 'info');
          } else {
            handleSelectFile(file);
            showToast && showToast('Đã dán ảnh từ clipboard!', 'info');
          }
          break;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      onOpenAuth && onOpenAuth();
      return;
    }

    const hasImage = !!selectedImageFile;
    if (!hasImage && content.trim().length < 2) {
      setErrorMsg('Vui lòng nhập nội dung góp ý ít nhất 2 ký tự hoặc đính kèm ảnh chụp màn hình.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    let uploadedImageUrl = null;

    try {
      // 1. If an image is selected, upload to MinIO first
      if (selectedImageFile) {
        setIsUploadingImage(true);
        uploadedImageUrl = await uploadFeedbackImage(selectedImageFile, token);
      }

      // 2. Submit feedback with image_url saved to Database
      await submitFeedback(
        {
          category,
          rating,
          content: content.trim() || 'Đính kèm ảnh phản hồi / báo lỗi',
          image_url: uploadedImageUrl,
        },
        token
      );

      showToast && showToast('Cảm ơn bạn! Phản hồi đã được gửi thành công.', 'success');
      window.dispatchEvent(new CustomEvent('shotlang:feedback-updated'));
      setContent('');
      handleRemoveImage();
      setActiveSubTab('history');
      loadHistory();
    } catch (err) {
      setErrorMsg(err.message || 'Lỗi khi gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="badge badge-resolved" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={13} /> Đã giải quyết
          </span>
        );
      case 'REVIEWED':
        return (
          <span className="badge badge-reviewed" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Eye size={13} /> Đã tiếp nhận
          </span>
        );
      default:
        return (
          <span className="badge badge-pending" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> Chờ xem xét
          </span>
        );
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'BUG': return <Bug size={14} color="#ef4444" />;
      case 'SUGGESTION': return <Lightbulb size={14} color="#f59e0b" />;
      case 'CONTENT': return <BookOpen size={14} color="#3b82f6" />;
      default: return <MessageCircle size={14} color="#8b5cf6" />;
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'BUG': return 'Báo lỗi kỹ thuật';
      case 'SUGGESTION': return 'Đề xuất ý tưởng';
      case 'CONTENT': return 'Nội dung bài học';
      default: return 'Góp ý chung';
    }
  };

  return (
    <>
      <div className="feedback-modal-overlay" onClick={onClose}>
        <div className="feedback-modal-card" onClick={(e) => e.stopPropagation()} onPaste={handlePaste}>
          <div className="feedback-modal-header">
            <h3 className="feedback-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageSquarePlus size={20} color="#3b82f6" />
              <span>Hòm thư Góp ý & Báo lỗi</span>
            </h3>
            <button className="feedback-close-btn" onClick={onClose} aria-label="Đóng">
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Sub Navigation (Gửi mới vs Lịch sử) */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color, #e2e8f0)', padding: '0 24px' }}>
            <button
              type="button"
              className={`admin-tab-btn ${activeSubTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('new')}
              style={{ borderRadius: '8px 8px 0 0', borderBottom: activeSubTab === 'new' ? '2px solid #3b82f6' : 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <PenLine size={15} />
              <span>Gửi phản hồi mới</span>
            </button>
            {user && (
              <button
                type="button"
                className={`admin-tab-btn ${activeSubTab === 'history' ? 'active' : ''}`}
                onClick={() => {
                  setActiveSubTab('history');
                  loadHistory();
                }}
                style={{ borderRadius: '8px 8px 0 0', borderBottom: activeSubTab === 'history' ? '2px solid #3b82f6' : 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <History size={15} />
                <span>Lịch sử đóng góp</span>
              </button>
            )}
          </div>

          <div className="feedback-modal-body">
            {!user ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                    <Lock size={26} />
                  </div>
                </div>
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
                {user?.role === 'ADMIN' && (
                  <div className="admin-feedback-banner-hint">
                    <span>👑 <strong>Quản trị viên:</strong> Bạn có thể duyệt & xử lý tất cả góp ý tại Bảng Quản trị.</span>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.78rem', whiteSpace: 'nowrap', marginLeft: '10px' }}
                      onClick={() => {
                        onClose();
                        onOpenAdminTab && onOpenAdminTab();
                      }}
                    >
                      Mở Bảng Quản trị ➔
                    </button>
                  </div>
                )}
                {errorMsg && (
                  <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={16} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Feedback Type Pills */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '8px', color: '#64748b' }}>
                    Loại ý kiến đóng góp:
                  </label>
                  <div className="feedback-type-pills">
                    {[
                      { id: 'SUGGESTION', label: 'Đề xuất mới', icon: <Lightbulb size={14} /> },
                      { id: 'BUG', label: 'Báo lỗi kỹ thuật', icon: <Bug size={14} /> },
                      { id: 'CONTENT', label: 'Nội dung bài học', icon: <BookOpen size={14} /> },
                      { id: 'GENERAL', label: 'Ý kiến khác', icon: <MessageCircle size={14} /> }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`type-pill ${category === item.id ? 'active' : ''}`}
                        onClick={() => setCategory(item.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
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
                    placeholder="Chia sẻ ý kiến đóng góp, tính năng bạn mong muốn hoặc mô tả chi tiết lỗi bạn gặp phải... (Bạn có thể nhấn Ctrl+V để dán ảnh chụp màn hình)"
                    value={content}
                    maxLength={2000}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                  <div className="feedback-footer-info">
                    {selectedImageFile ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>
                        📸 Đã đính kèm ảnh (nội dung có thể để ngắn hoặc mô tả thêm)
                      </span>
                    ) : (
                      <span style={{ color: content.trim().length > 0 && content.trim().length < 2 ? '#ef4444' : '#64748b' }}>
                        {content.trim().length > 0 && content.trim().length < 2 ? 'Cần tối thiểu 2 ký tự' : 'Tối thiểu 2 ký tự'}
                      </span>
                    )}
                    <span>{content.length}/2000 ký tự</span>
                  </div>
                </div>

                {/* MinIO Image Attachment */}
                <div className="feedback-upload-container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ImageIcon size={14} />
                      <span>Đính kèm ảnh minh họa / ảnh chụp màn hình (MinIO S3):</span>
                    </label>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tối đa 10MB • Hỗ trợ Ctrl+V</span>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleSelectFile(e.target.files[0]);
                      }
                    }}
                  />

                  {selectedImageFile && imagePreviewUrl ? (
                    <div className="feedback-attached-preview">
                      <img src={imagePreviewUrl} alt="Preview" className="feedback-preview-thumb" />
                      <div className="feedback-preview-meta">
                        <div className="feedback-preview-name">{selectedImageFile.name}</div>
                        <div className="feedback-preview-size">
                          {(selectedImageFile.size / 1024).toFixed(1)} KB • Sẽ lưu vào MinIO S3
                        </div>
                      </div>
                      <button
                        type="button"
                        className="feedback-preview-remove-btn"
                        onClick={handleRemoveImage}
                        title="Gỡ ảnh này"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`feedback-upload-dropzone ${isDragOver ? 'drag-active' : ''}`}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleSelectFile(e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <UploadCloud size={22} color="#3b82f6" />
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-color, #1e293b)' }}>
                        Nhấp để chọn ảnh hoặc kéo thả vào đây
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        PNG, JPG, WebP, GIF (hoặc chụp màn hình và nhấn <strong>Ctrl+V</strong>)
                      </div>
                    </div>
                  )}
                </div>

                <div className="feedback-modal-actions" style={{ padding: '8px 0 0' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-with-icon"
                    disabled={isSubmitting || (!selectedImageFile && content.trim().length < 2)}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="spinning" />
                        <span>{isUploadingImage ? 'Đang đẩy ảnh lên MinIO...' : 'Đang gửi phản hồi...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Gửi góp ý</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              selectedThreadFeedback ? (
                <div className="conversation-container">
                  {/* Top bar with back button */}
                  <div className="conversation-header-bar">
                    <button type="button" className="conversation-back-btn" onClick={handleCloseThread}>
                      <ArrowLeft size={16} />
                      <span>Danh sách góp ý</span>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                        {getCategoryIcon(selectedThreadFeedback.feedback_type)}
                        {getCategoryLabel(selectedThreadFeedback.feedback_type)}
                      </span>
                      {getStatusBadge(selectedThreadFeedback.status)}
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="conversation-messages-list">
                    {/* Original Ticket Box */}
                    <div className="conversation-original-ticket">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: '0.76rem', color: '#64748b' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-color, #1e293b)' }}>Ý kiến ban đầu của bạn:</span>
                        <span>{selectedThreadFeedback.created_at ? new Date(selectedThreadFeedback.created_at).toLocaleString('vi-VN') : ''}</span>
                      </div>
                      <div style={{ fontSize: '0.88rem', lineHeight: 1.45, marginBottom: selectedThreadFeedback.image_url ? 8 : 0 }}>
                        {selectedThreadFeedback.content}
                      </div>
                      {selectedThreadFeedback.image_url && (
                        <button
                          type="button"
                          onClick={() => setLightboxImage(selectedThreadFeedback.image_url)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'inline-block' }}
                        >
                          <img
                            src={selectedThreadFeedback.image_url}
                            alt="Attached screenshot"
                            className="chat-bubble-img-preview"
                          />
                        </button>
                      )}
                    </div>

                    {isLoadingThread ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.85rem' }}>
                        <Loader2 size={18} className="spinning" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 6 }} />
                        <span>Đang tải cuộc hội thoại...</span>
                      </div>
                    ) : threadMessages.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '20px 10px', color: '#64748b', fontSize: '0.84rem' }}>
                        💬 Chưa có phản hồi nào. Bạn có thể gửi thêm chi tiết hoặc chờ Quản trị viên phản hồi tại đây!
                      </div>
                    ) : (
                      threadMessages.map((msg) => {
                        const isAdminMsg = msg.sender_role === 'ADMIN';
                        return (
                          <div
                            key={msg.id}
                            className={`chat-message-row ${isAdminMsg ? 'from-admin' : 'from-user'}`}
                          >
                            <div className={`chat-avatar-circle ${isAdminMsg ? 'admin' : 'user'}`}>
                              {isAdminMsg ? <Crown size={16} /> : (user?.name ? user.name.slice(0, 1).toUpperCase() : 'U')}
                            </div>
                            <div className={`chat-bubble ${isAdminMsg ? 'admin' : 'user'}`}>
                              <div className="chat-bubble-meta">
                                <span className={`chat-bubble-role-tag ${isAdminMsg ? 'admin' : 'user'}`}>
                                  {isAdminMsg ? '👑 Quản trị viên' : 'Bạn'}
                                </span>
                                <span>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                              </div>
                              <div className="chat-bubble-content">{msg.message}</div>
                              {msg.image_url && (
                                <img
                                  src={msg.image_url}
                                  alt="MinIO chat attachment"
                                  className="chat-bubble-img-preview"
                                  onClick={() => setLightboxImage(msg.image_url)}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={threadEndRef} />
                  </div>

                  {/* Reply Input Bar */}
                  <form className="conversation-reply-bar" onSubmit={handleSendReply}>
                    <input
                      type="file"
                      ref={replyFileInputRef}
                      style={{ display: 'none' }}
                      accept="image/png, image/jpeg, image/webp, image/gif"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleSelectReplyFile(e.target.files[0]);
                        }
                      }}
                    />

                    {replyImageFile && (
                      <div>
                        <span className="reply-attached-mini">
                          <ImageIcon size={13} />
                          <span>{replyImageFile.name} ({(replyImageFile.size / 1024).toFixed(1)} KB)</span>
                          <button
                            type="button"
                            onClick={handleRemoveReplyImage}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
                          >
                            <X size={13} />
                          </button>
                        </span>
                      </div>
                    )}

                    <div className="reply-input-group">
                      <textarea
                        className="reply-textarea"
                        placeholder="Nhập phản hồi tiếp cho Quản trị viên... (Ctrl+Enter để gửi, Ctrl+V để dán ảnh)"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault();
                            handleSendReply();
                          }
                        }}
                        rows={1}
                      />
                      <button
                        type="button"
                        className="reply-attach-btn"
                        onClick={() => replyFileInputRef.current && replyFileInputRef.current.click()}
                        title="Đính kèm ảnh minh họa (MinIO)"
                      >
                        <ImageIcon size={18} />
                      </button>
                      <button
                        type="submit"
                        className="reply-send-btn"
                        disabled={isSendingReply || (!replyText.trim() && !replyImageFile)}
                      >
                        {isSendingReply ? (
                          <Loader2 size={14} className="spinning" />
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Gửi</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
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
                      <div key={item.id} className="my-feedback-card" onClick={() => handleOpenThread(item)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            {getCategoryIcon(item.feedback_type)}
                            {getCategoryLabel(item.feedback_type)}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {item.unread_replies > 0 && (
                              <span className="badge" style={{ background: '#ef4444', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 700, fontSize: '0.72rem' }}>
                                <Crown size={12} /> Admin đã trả lời
                              </span>
                            )}
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                        <p style={{ margin: '0 0 8px', color: 'inherit', lineHeight: 1.4 }}>
                          {item.content}
                        </p>

                        {/* Image Attachment in History */}
                        {item.image_url && (
                          <div style={{ marginBottom: '8px' }}>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxImage(item.image_url);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#2563eb',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                              }}
                            >
                              <img
                                src={item.image_url}
                                alt="MinIO attachment"
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border-color, #cbd5e1)',
                                }}
                              />
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                <ZoomIn size={13} />
                                <span>Xem ảnh đính kèm</span>
                              </span>
                            </span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: 4 }}>
                          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : ''}</span>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{
                              padding: '3px 10px',
                              fontSize: '0.76rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              borderRadius: 6,
                              borderColor: item.unread_replies > 0 ? '#ef4444' : undefined,
                              background: item.unread_replies > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined,
                              color: item.unread_replies > 0 ? '#ef4444' : undefined,
                              fontWeight: item.unread_replies > 0 ? 700 : 500
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenThread(item);
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>Hội thoại ({item.messages_count ?? item.messages?.length ?? 0}) ➔</span>
                            {item.unread_replies > 0 && (
                              <span
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  background: '#ef4444',
                                  display: 'inline-block'
                                }}
                                title="Có phản hồi mới từ Quản trị viên"
                              />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Enlarge Image */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage} alt="Feedback full screenshot" />
            <button
              className="lightbox-close-btn"
              onClick={() => setLightboxImage(null)}
              aria-label="Đóng ảnh"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
