# Kiểm thử Việt hóa và lời chúc — 30/09/2026

## Kết quả đã xác nhận

- 26 kiểm thử tự động đạt: luồng phúc đáp, định tuyến, hạn gửi, số người, Turnstile, xác minh lời chúc, chống gửi khác nguồn, link cá nhân, gửi lại cùng mã và lưu nội dung an toàn.
- Bản dựng Vite thành công. Không có lỗi JavaScript của ứng dụng trong trình duyệt. Turnstile có log nội bộ từ iframe nhưng xác minh và gửi thật vẫn thành công.
- Thiệp kiểm tra chiều ngang 320, 375, 768, 1024, 1440 px: không có phần tử của ứng dụng tràn ngang.
- Form phúc đáp riêng đã kiểm tra trên website thật ở 320 px; xác minh Turnstile tự hoàn tất và gửi thành công.
- Lời chúc Nhà gái lưu lúc 15:19:09; lời chúc Nhà trai lưu lúc 15:20:03; phúc đáp Nhà trai lưu lúc 15:21:15. Tất cả theo giờ Việt Nam, hiển thị ngày 30/09/2026.
- Đối chiếu trực tiếp Sheet: tiêu đề, phúc đáp, mối quan hệ, bên mời đều tiếng Việt. Lời chúc giữ xuống dòng. Các mã kỹ thuật và đường dẫn vẫn là định danh để liên kết dữ liệu.
- Tổng hợp hiện có 2 người xác nhận tham gia, 3 lượt phúc đáp và 2 lời chúc. Phần dữ liệu hiện tại là các mẫu kiểm thử, gồm hai dòng phúc đáp đã tồn tại trước lần này và ba mẫu mới được đánh dấu KIỂM THỬ.
- Quyền truy cập chung của Sheet đã chuyển sang Hạn chế; quyền chủ tiệc và tài khoản dịch vụ vẫn được giữ. Website vẫn ghi thành công sau thay đổi này.

## Giới hạn

- Kiểm tra responsive bằng trình duyệt; chưa chạy trên điện thoại đời cũ vật lý.
- Hai mã QR và thông tin tài khoản mừng cưới chưa có trong cấu hình. Hộp thoại hiện thông báo đang cập nhật; không tạo QR hoặc tài khoản giả.
- Lời chúc gửi riêng đến gia đình, không hiển thị danh sách lời chúc công khai trên trang thiệp.

Các ảnh bằng chứng kiểm thử được lưu cục bộ trong `docs/evidence`; không cần đưa ảnh chứa dữ liệu Sheet lên kho mã.
