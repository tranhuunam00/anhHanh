# Chatbot Fanpage Hành Chính Công - Giai đoạn 1

Bot FAQ cho Fanpage Facebook trong lĩnh vực hành chính công. Phiên bản này trả lời theo kho dữ liệu đã duyệt, phù hợp để hướng dẫn thủ tục cơ bản và thông tin liên hệ.

## Tính năng

- Xác minh webhook với Facebook Messenger Platform.
- Nhận tin nhắn từ Fanpage và trả lời tự động.
- Trả lời các thủ tục phổ biến: khai sinh, chứng thực, tạm trú, hộ kinh doanh, giấy phép xây dựng, đất đai, phản ánh kiến nghị.
- Trả lời thông tin giờ làm việc, địa chỉ, số điện thoại, cổng dịch vụ công.
- Có endpoint `/test-reply` để kiểm thử nội dung trước khi nối Fanpage.
- Không dùng AI trong giai đoạn 1 để tránh trả lời ngoài nguồn dữ liệu.

## Chạy thử local

Yêu cầu Node.js 18 trở lên.

```powershell
Copy-Item .env.example .env
$env:PORT="3000"
$env:VERIFY_TOKEN="token_tu_dat"
node src/server.js
```

Kiểm tra server:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Kiểm thử trả lời:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/test-reply `
  -ContentType "application/json" `
  -Body '{"message":"Tôi muốn làm giấy khai sinh"}'
```

## Kết nối với Facebook Fanpage

1. Tạo Meta App tại Facebook Developers.
2. Thêm sản phẩm Messenger.
3. Kết nối Fanpage và lấy `PAGE_ACCESS_TOKEN`.
4. Deploy server lên domain HTTPS công khai.
5. Trong phần Webhooks, cấu hình:
   - Callback URL: `https://ten-mien-cua-ban/webhook`
   - Verify Token: giá trị `VERIFY_TOKEN` trong môi trường deploy
   - Subscribe field: `messages`
6. Cấp quyền và kiểm thử bằng cách nhắn tin tới Fanpage.

## Biến môi trường

| Biến | Ý nghĩa |
| --- | --- |
| `PORT` | Cổng chạy server |
| `VERIFY_TOKEN` | Token tự đặt để Facebook xác minh webhook |
| `PAGE_ACCESS_TOKEN` | Token gửi tin nhắn qua Fanpage |
| `AGENCY_NAME` | Tên cơ quan/Bộ phận Một cửa |
| `AGENCY_ADDRESS` | Địa chỉ tiếp nhận |
| `AGENCY_PHONE` | Số điện thoại liên hệ |
| `PUBLIC_SERVICE_PORTAL_URL` | Link Cổng dịch vụ công |

## Cập nhật kho thủ tục

Sửa file `src/procedures.json`. Mỗi thủ tục có:

- `title`: tên thủ tục.
- `keywords`: từ khóa người dân hay hỏi.
- `receiver`: cơ quan tiếp nhận.
- `processingTime`: thời hạn xử lý.
- `fee`: lệ phí.
- `documents`: thành phần hồ sơ.
- `howToApply`: cách thực hiện.
- `note`: lưu ý.
- `link`: link tham khảo/nộp trực tuyến.

## Gợi ý triển khai tiếp

Giai đoạn 2 có thể thêm trang quản trị nội dung, tìm kiếm ngữ nghĩa, AI trả lời có trích nguồn, log hội thoại và chuyển cán bộ khi bot không chắc.
