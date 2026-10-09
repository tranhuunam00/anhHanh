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

## 5. Quy Tắc Kiểm Thử & Biên Dịch (Build & Verification Integrity)
- **BẮT BUỘC PHẢI CHẠY BUILD VÀ KIỂM THỬ TRƯỚC KHI KẾT THÚC TASK**:
  - Frontend: Bắt buộc chạy `npm run build` kiểm tra toàn bộ imports/exports, tuyệt đối không để sót undefined component hay cú pháp lỗi.
  - Backend: Bắt buộc chạy toàn bộ test suite (`python -m pytest tests/ -q`), đảm bảo 100% test passes.

## 6. Quy Tắc Bắt Buộc Viết Test Cho Mọi Hàm Mới / Hàm Được Tách (Mandatory Function-Level Unit Testing)
- **MỌI HÀM ĐƯỢC VIẾT MỚI HOẶC ĐƯỢC REFACTOR TÁCH RA ĐỀU BẮT BUỘC PHẢI CÓ UNIT TEST RIÊNG**.
- Không được bỏ sót bất kỳ hàm nào. Mỗi test phải kiểm tra kỹ lưỡng đầy đủ 4 khía cạnh:
  1. **Input Coverage**: Kiểm thử các dạng input chuẩn (happy path), input rỗng/None/whitespace, input biên (giá trị min, max, độ dài giới hạn), input bất thường hoặc định dạng lạ.
  2. **Output Verification**: Kiểm tra chính xác kiểu dữ liệu trả về, giá trị thuộc tính, cấu trúc mảng/object, định dạng chuỗi kết quả.
  3. **Internal Logic Coverage**: Kiểm tra đầy đủ mọi nhánh rẽ điều kiện (if/elif/else), thuật toán tính toán/xếp hạng/phân loại, cơ chế fallback tự động.
  4. **Error & Exception Handling**: Kiểm tra hàm ném đúng loại lỗi (`ValueError`, `RuntimeError`, `HTTPException`) khi gặp dữ liệu không hợp lệ hoặc sự cố hệ thống.
- **Quy chuẩn Database Khởi Tạo Mới (Zero-to-One DB Integrity)**:
  - Bất kỳ schema hoặc model nào phải đảm bảo khi chạy trên database trống hoàn toàn (fresh run), toàn bộ migration (`001` đến phiên bản mới nhất) phải thực thi tuần tự không lỗi và tái lập chính xác 100% cấu trúc bảng, cột, khóa ngoại, chỉ mục tương ứng với ORM `models.py`.

## 7. Quy Tắc Số Hóa Bài Tập Destination B2 (100% Fidelity & Visual Integrity)
Destination B2 là giáo trình chuẩn quốc tế. Toàn bộ bài tập số hóa phải đạt độ chuẩn xác 1:1 cả về cấu trúc thị giác (Visual UI) lẫn nội dung học liệu (Text Content) so với sách gốc `Destination-B2.pdf`.

- **Quy trình 2 bước BẮT BUỘC khi số hóa bất kỳ Unit nào**:
  1. **Bước 1: Capture toàn bộ màn hình/trang Unit từ PDF & Phân tích Kiến trúc Component**:
     - Mở trực tiếp file PDF gốc `Destination-B2.pdf` và đối chiếu toàn bộ các trang bài tập của Unit đó.
     - Phân tích kỹ lưỡng bản chất dạng bài tập (Exercise Type) và Layout thị giác đặc thù.
     - **TUYỆT ĐỐI KHÔNG mapping dựa vào mã chữ cái A, B, C, D, G, H...**: Mỗi Unit có hệ thống bài tập hoàn toàn khác nhau.
       - *Ví dụ thực tế*: 
         - Unit 1 bài G là Ghép 2 vế câu (Matching 2 cột), nhưng Unit 2 bài G là Tìm từ thừa (Extra Word dòng kẻ).
         - Unit 1 bài H là Tìm từ thừa (Extra Word), nhưng Unit 2 bài H là Cấu tạo từ theo đoạn văn (Word Formation Passage với từ in hoa ở lề phải).
     - **Nguyên tắc "Dạng mới thì thêm mới component"**: Nếu bài tập có layout mới chưa được hỗ trợ chuẩn xác (như: Word Formation đoạn văn có từ gốc in hoa ở lề phải, Extra Word trên trang giấy kẻ ngang, Matching nối 2 cột, Phrasal Verb thay thế cụm in nghiêng...), **BẮT BUỘC PHẢI TẠO COMPONENT MỚI ĐỘC LẬP**, tuyệt đối không được gộp ép bừa bãi vào component không đúng định dạng.
  2. **Bước 2: Bảo toàn 100% Text từ PDF (Zero Text Omission - Không Thiếu Dù Chỉ 1 Từ)**:
     - Dữ liệu bài tập BẮT BUỘC phải chứa đầy đủ 100% câu chữ từ trang PDF gốc, kiểm tra từng dòng, từng chữ.
     - **TUYỆT ĐỐI KHÔNG ĐƯỢC**:
       - Cắt vụn dòng, ngắt ngang câu làm mất ngữ cảnh bài học.
       - Bỏ sót TỪ GỐC IN HOA (CAPITAL ROOT WORDS: `TOUR`, `ARRANGE`, `TIME`, `CULTURE`, `PHOTOGRAPH`, `INHABIT`...) ở lề phải hoặc cuối mỗi dòng trong bài Word Formation.
       - Tóm tắt hoặc lược bớt nội dung đoạn văn bài đọc (Passage text).
       - Bỏ sót từ gợi ý trong hộp từ (Word Bank) hoặc các cụm từ in nghiêng/in đậm cần thay thế.
     - Đảm bảo đồng bộ 100% giữa file dữ liệu frontend (`frontend/src/data/destinationB2/`) và backend seed data (`app/infrastructure/database/data/destination_b2_seed_data.json`).



