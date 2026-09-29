# 04 — Kế hoạch lập trình

Làm từng chặng, chốt nội dung thật trước khi đưa trang công khai. Mỗi chặng kết thúc bằng một bản chạy được hoặc tài liệu cấu hình đủ rõ để tiếp tục.

| Chặng | Công việc | Điều kiện hoàn thành |
| --- | --- | --- |
| 0. Nội dung | Đã chốt thông tin cưới và luồng hai trang; bổ sung ảnh, lời mời, QR mừng cưới, tên sảnh nếu có | Không còn chỗ thay thế ở nội dung được công bố |
| 1. Khung dự án — xong | React/Vite, HomePage `/`, route thiệp chung/cá nhân và phúc đáp riêng, npm scripts, CI | Build chạy; route tĩnh và mẫu route cá nhân đã có |
| 2A. Phúc đáp — xong phần mã | RsvpForm dùng chung với `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap`, nhẹ và dễ điền trên điện thoại | Đã kiểm tra UI 320/390px; chờ Sheet thật để gửi thử production |
| 2B. Thiệp — chờ nội dung | Thiệp theo bên mời, 18 slot ảnh linh hoạt, Maps, footer; Tham dự mở form; Gửi mừng cưới mở QR đúng bên | Bố cục/Map đã có; chờ ảnh và hai QR thật |
| 3. RSVP — xong phần mã | Bốn câu hỏi, Worker API, Google OAuth, validate, hạn 15/10, append `RAW`, Turnstile | 22 test đang đạt; Nhà trai/Nhà gái ghi tab riêng, chờ credentials để tích hợp Sheet thật |
| 4. Hoàn thiện | Tạo nhiều kích thước cho tối thiểu 12 ảnh, SEO/OG, favicon, a11y, giảm chuyển động, chống spam cơ bản | Đạt checklist; ảnh không gây nhảy bố cục và trang vẫn mượt trên thiết bị yếu |
| 5. Xuất bản | GitHub, Cloudflare Pages, secret production, domain, kiểm tra route tĩnh/cá nhân; bàn giao link và công thức tạo thiệp từng người | Route tải/refresh được; tên lấy đúng tab; RSVP lưu đúng bên và người được mời; QR đúng bên; hai link phúc đáp cố định để gắn QR |

Ưu tiên hoàn thành chặng 1 → 2A → 3 và kiểm thử RSVP để có thể bàn giao link phúc đáp production sớm, ngay khi tài khoản triển khai và Google Sheet sẵn sàng. Ảnh album hoặc QR mừng cưới còn thiếu không chặn lập trình/kiểm thử trang phúc đáp. Khi phát hành sớm, trang thiệp phải có trạng thái tạm có chủ đích với thông tin thật, không hiển thị chức năng chưa hoạt động; tiếp tục 2B và nghiệm thu toàn bộ sau đó.

## Thứ tự file khi bắt đầu code

Thêm chặng thiệp cá nhân: thiết lập công thức A/B/C theo [hướng dẫn](08-link-moi-ca-nhan.md), API tra tên `functions/api/invitation.js`, hai route `:slug`, điền trước tên và ghi thêm slug/tên được mời vào RSVP. Kiểm tra refresh, trùng slug và tên dài trước khi bàn giao link cá nhân. Năm route tĩnh tiếp tục hoạt động độc lập.

1. `package.json`, `index.html`, `vite.config.*`, `src/main.*`, `src/App.*`.
2. Dùng `src/config/wedding.json` đã tạo cho nội dung và mốc giờ; bổ sung URL nhúng Google Maps được kiểm tra trực quan.
3. `src/pages/HomePage.jsx`, `src/pages/RsvpPage.jsx`, `src/components/rsvp/RsvpForm.jsx`, rồi `src/pages/InvitationPage.jsx`, các section và `src/components/gift/GiftDialog.jsx`.
4. `functions/api/rsvp.*` và các hàm hỗ trợ tương thích Workers.
5. `tests/*` tập trung vào validate và kết quả ghi Sheet giả lập; sau đó kiểm tra thực tế trên bản preview.

## Dữ liệu cần khóa trước khi phát hành

- Đã có cặp bên mời + slug để liên kết phản hồi với khách được mời. Chính sách gửi lại/sửa RSVP vẫn cần chốt; slug không tự bảo đảm một lần gửi duy nhất.
- Đã chốt tổng số người tính cả người trả lời, không giới hạn tối đa; hạn RSVP hết ngày 15/10/2026 giờ Việt Nam, không cần hỏi lại.
- Đã chốt theo thiệp in: tiệc tại Sapphire 1 lúc 11:00, lễ 11:30, khai tiệc 11:45; riêng thiệp Nhà trai có lễ tại tư gia lúc 06:30.
- Lời chúc có được hiển thị công khai không? Mặc định là không.

## Cập nhật giao diện và tích hợp 29/09/2026

- Dọn các khối lặp, bỏ icon, monogram A & A; font tiếng Việt phục vụ từ website.
- Cập nhật tên đầy đủ, hai gia đình, sảnh, địa chỉ và lịch trình theo thiệp in.
- Sửa endpoint append Google Sheets; chặn bypass Turnstile ngoài localhost development; kiểm tra hàng tiêu đề trước khi ghi.
- Đã có hướng dẫn 10 cho Sheet riêng tư. Chưa nghiệm thu gửi thật vì chủ tiệc chưa thiết lập Google service account và Secret trên Cloudflare.
