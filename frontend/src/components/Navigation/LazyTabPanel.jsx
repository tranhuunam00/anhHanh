import React, { Suspense } from "react";
import { isChunkLoadError } from "../../utils/lazyModule";
import "./Navigation.css";

/** Skeleton shown while a tab's code chunk downloads. */
export function TabLoadingFallback({ label = "Đang tải giao diện..." }) {
  return (
    <div className="lazy-tab-fallback" role="status" aria-live="polite" aria-busy="true">
      <div className="lazy-tab-fallback-spinner" aria-hidden="true" />
      <span className="lazy-tab-fallback-label">{label}</span>
      <div className="lazy-tab-skeleton" aria-hidden="true">
        <span className="lazy-tab-skeleton-line w-60" />
        <span className="lazy-tab-skeleton-line w-90" />
        <span className="lazy-tab-skeleton-line w-75" />
      </div>
    </div>
  );
}

/**
 * Isolates a tab: a crash or a failed chunk download shows a recoverable
 * message inside the tab instead of blanking the whole app.
 */
export class TabErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(`[TabErrorBoundary] ${this.props.tabId || "tab"} failed to render:`, error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const chunkError = isChunkLoadError(error);
    return (
      <div className="lazy-tab-error" role="alert">
        <strong className="lazy-tab-error-title">
          {chunkError ? "Không tải được nội dung" : "Đã xảy ra lỗi khi hiển thị mục này"}
        </strong>
        <p className="lazy-tab-error-text">
          {chunkError
            ? "Mạng chập chờn hoặc ứng dụng vừa được cập nhật phiên bản mới. Tải lại trang để tiếp tục."
            : "Các mục khác vẫn hoạt động bình thường. Bạn có thể thử lại hoặc tải lại trang."}
        </p>
        <div className="lazy-tab-error-actions">
          {!chunkError && (
            <button type="button" className="lazy-tab-error-btn secondary" onClick={() => this.setState({ error: null })}>
              Thử lại
            </button>
          )}
          <button type="button" className="lazy-tab-error-btn" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
}

/**
 * Tab container that:
 *  - does not mount (or download) a tab until it is first visited,
 *  - keeps visited tabs mounted & hidden to preserve their state
 *    (unless keepMounted=false, for heavy tabs that should unmount),
 *  - has its own Suspense + error boundary so one tab never blocks another.
 */
export function LazyTabPanel({
  tabId,
  activeTab,
  visited = false,
  keepMounted = true,
  loadingLabel,
  style,
  children,
}) {
  const isActive = activeTab === tabId;
  const shouldMount = keepMounted ? isActive || visited : isActive;
  if (!shouldMount) return null;

  return (
    <div style={{ ...style, display: isActive ? "block" : "none" }} data-tab-panel={tabId}>
      <TabErrorBoundary tabId={tabId}>
        <Suspense fallback={<TabLoadingFallback label={loadingLabel} />}>{children}</Suspense>
      </TabErrorBoundary>
    </div>
  );
}
