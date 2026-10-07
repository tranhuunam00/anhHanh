# Hướng Dẫn Phát Triển Cho Agent (Project Guidelines & Rules)

## 1. Quy Tắc Sử Dụng Icon (Internal Icon System)
- **Dự án có bộ icon nội bộ riêng**, được xây dựng dựa trên component chuẩn `BaseIcon` và SVG tinh gọn tại `frontend/src/components/Icons/AppIcons.jsx`.
- **TUYỆT ĐỐI KHÔNG import icon từ các thư viện ngoài** (như `lucide-react`, `react-icons`, `@heroicons/react`...).
- Mọi icon cần dùng phải được import từ:
  - `frontend/src/components/Icons`
  - `frontend/src/constants/icons.js`
- **Khi thiếu icon mới**: Bổ sung trực tiếp component icon vào `frontend/src/components/Icons/AppIcons.jsx` kế thừa từ `<BaseIcon>`, thêm alias tương thích nếu cần, và sử dụng nội bộ.

## 2. Quy Tắc Giao Diện & Tông Màu (Theme Styling)
- **Không fix cứng mã màu đen (`#0f172a`...)** hay màu cố định.
- Luôn sử dụng biến CSS hệ thống: `var(--bg-card)`, `var(--bg-primary)`, `var(--bg-secondary)`, `var(--border-color)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--text-muted)`, `var(--primary)`.
- Đảm bảo thích ứng tự nhiên cho cả Light Mode và Dark Mode.
