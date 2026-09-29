# 04 — Kế hoạch lập trình

Làm từng chặng, chốt nội dung thật trước khi đưa trang công khai. Mỗi chặng kết thúc bằng một bản chạy được hoặc tài liệu cấu hình đủ rõ để tiếp tục.

| Chặng | Công việc | Điều kiện hoàn thành |
| --- | --- | --- |
| 0. Nội dung | Đã chốt thông tin cưới và luồng hai trang; bổ sung ảnh, lời mời, QR mừng cưới, tên sảnh nếu có | Không còn chỗ thay thế ở nội dung được công bố |
| 1. Khung dự án | Tạo React/Vite, HomePage `/` chọn bên mời, route thiệp chung/cá nhân và phúc đáp riêng cho nhà trai/nhà gái, npm scripts, build, lint/test cơ bản, `src/config` | Build chạy được; năm route tĩnh và hai mẫu route cá nhân truy cập trực tiếp; hai nút home mở đúng thiệp |
| 2A. Phúc đáp | Ưu tiên RsvpForm dùng chung với hai URL `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap`, nhẹ và dễ điền trên điện thoại | Mỗi link mở trực tiếp form đúng bên; dữ liệu ghi đúng bên, đầy đủ trạng thái gửi và đóng đúng hạn |
| 2B. Thiệp | Thiệp theo bên mời, 18 slot ảnh linh hoạt, Maps, timeline, footer; Tham dự mở RsvpForm; Gửi mừng cưới mở GiftDialog đúng bên | Responsive liên tục 320–1920px; không có khung/cột rỗng; ghim đúng địa điểm; mỗi link hiện đúng QR |
| 3. RSVP | Viết bốn câu hỏi, Pages Function, xác thực Google, validate ba trạng thái, tổng số người và nguồn quen biết, kiểm tra hạn 15/10 ở server, ghi Sheet | Gửi hợp lệ tạo đúng một hàng với đủ cột; “Mục khác” được kiểm tra; sau hạn không ghi; lỗi không hiện thành công giả |
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

## Quyết định cần khóa trước chặng 3

- Đã có cặp bên mời + slug để liên kết phản hồi với khách được mời. Chính sách gửi lại/sửa RSVP vẫn cần chốt; slug không tự bảo đảm một lần gửi duy nhất.
- Đã chốt tổng số người tính cả người trả lời, không giới hạn tối đa; hạn RSVP hết ngày 15/10/2026 giờ Việt Nam, không cần hỏi lại.
- Có cần phân biệt lễ cưới và tiệc cưới, hoặc nhiều buổi/địa điểm không?
- Lời chúc có được hiển thị công khai không? Mặc định là không.
