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

## 3. Quy Tắc Quản Lý Cơ Sở Dữ Liệu & Database Migrations (DB Architecture Rule)
- **Bất kỳ thay đổi nào về cấu trúc Database** (thêm/sửa/xóa bảng, thêm/sửa/xóa cột, quan hệ, khóa ngoại, chỉ mục index trong ORM models `models.py` hoặc schema) **BẮT BUỘC PHẢI VIẾT FILE MIGRATION MỚI**.
- TUYỆT ĐỐI KHÔNG sửa đổi cấu trúc DB ngầm mà thiếu file migration tương ứng.
- Mọi script migration phải có phiên bản định danh rõ ràng, hỗ trợ đầy đủ `upgrade()` (và `downgrade()` nếu có), bảo vệ an toàn dữ liệu học tập của học viên.

## 4. Quy Tắc Giới Hạn Độ Dài File & Module Hóa (Max 500 Lines & Modular Extraction)
- **TUYỆT ĐỐI KHÔNG để bất kỳ file code nào vượt quá 500 dòng**.
- Khi một file vượt quá 500 dòng, phải chủ động refactor tách nhỏ thành các submodules/components/utils/hooks chuyên biệt theo nguyên lý Single Responsibility.
- **Yêu cầu viết Unit Test chi tiết cho từng hàm được tách**: Phải bao phủ đầy đủ các dạng input, output và logic xử lý (happy path, edge cases, boundary cases, bad cases).

