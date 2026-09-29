# 09 — Bảo mật, riêng tư và chống spam

## Mục tiêu

Google Sheet luôn để riêng tư. Trình duyệt không gọi Google API và không biết `GOOGLE_SHEET_ID`, email service account hay private key. Chỉ Cloudflare Pages Functions đọc các Secret và chỉ service account được chia sẻ đúng Sheet cưới này với quyền Editor.

## Các lớp đã có trong mã

1. `POST /api/rsvp` chỉ nhận JSON tối đa 16 KiB, đúng origin, đúng method và header của website.
2. Client có honeypot; server âm thầm bỏ request bot điền trường này và không chạm Google.
3. Cloudflare Turnstile được xác minh qua Siteverify ở server. Production từ chối nếu thiếu secret, token sai/hết hạn, action khác `wedding_rsvp` hoặc hostname khác trang đang nhận request.
4. Server kiểm tra lại toàn bộ enum, độ dài, số người, slug, bên mời và hạn `2026-10-16T00:00:00+07:00`; không tin validation ở React.
5. Nếu có slug, server tra lại đúng tab và yêu cầu đúng một kết quả trước khi ghi. API không nhận tên tab/range do client tự chọn.
6. Ghi Sheet bằng `valueInputOption=RAW` để tên bắt đầu bằng `=`, `+`, `-` hoặc `@` không trở thành công thức.
7. `submission_id` được dò trước khi append để giảm ghi lặp do retry. Nút gửi bị khóa khi request đang chạy.
8. Không có endpoint đọc danh sách phúc đáp. API thiệp chỉ trả một tên ứng với một slug; phản hồi có `Cache-Control: no-store`.
9. Header CSP, chống iframe, tắt quyền camera/mic/vị trí/thanh toán và tắt source map production.
10. Không lưu IP, user-agent, cookie theo dõi hoặc dữ liệu ngân hàng của khách vào Sheet.

## Secret production bắt buộc

| Tên | Nơi đặt | Có xuất hiện trong React? |
| --- | --- | --- |
| `GOOGLE_CLIENT_EMAIL` | Cloudflare Worker Secret | Không |
| `GOOGLE_PRIVATE_KEY` | Cloudflare Worker Secret | Không |
| `GOOGLE_SHEET_ID` | Cloudflare Worker Secret | Không |
| `TURNSTILE_SECRET_KEY` | Cloudflare Worker Secret | Không |
| `GOOGLE_GROOM_RSVP_TAB=Nhà trai` | Worker runtime variable | Không |
| `GOOGLE_BRIDE_RSVP_TAB=Nhà gái` | Worker runtime variable | Không |
| `APP_ENV=production` | Worker runtime variable | Không |
| `ALLOWED_ORIGINS` | Worker runtime variable | Không |
| `VITE_TURNSTILE_SITE_KEY` | Build environment variable | Có, site key được phép công khai |

Không đặt bốn Secret đầu trong biến `VITE_*`, GitHub Actions log, mã nguồn, ảnh QR, query string hoặc file trong `public/`. Khi copy private key vào Cloudflare, giữ đủ dòng BEGIN/END và ký tự xuống dòng.

## Cấu hình Cloudflare nên bật khi có domain

- Tạo một WAF rate limiting rule cho path `/api/*` với ngưỡng phù hợp số khách. Một khởi điểm thận trọng là 10 request mỗi phút trên mỗi nguồn; quan sát trước khi giảm để tránh chặn gia đình dùng chung mạng.
- Chỉ cho phép HTTPS; header HSTS đã có trong `public/_headers` và chỉ có hiệu lực trên HTTPS.
- Dùng Turnstile widget gắn đúng hostname production; preview dùng widget/Sheet test riêng nếu có.
- Đặt Secret riêng cho Production và Preview. Không dùng key thật trong `.dev.vars` nếu không cần.

## Xử lý sự cố

- Nếu nghi private key bị lộ: vô hiệu hóa/xóa key tại Google Cloud, tạo key mới, cập nhật Cloudflare Secret rồi redeploy. Không chỉ xóa key khỏi commit cũ.
- Nếu bị spam: xem Functions metrics và Turnstile analytics, siết WAF rule, đổi Turnstile secret nếu cần; không public Sheet để lọc bằng tay.
- Nếu Sheet bị chia sẻ nhầm: thu hồi public/link sharing, kiểm tra lịch sử chia sẻ và chỉ giữ người quản lý cùng service account.
- Log lỗi chỉ ghi mã kỹ thuật chung; không thêm payload RSVP, token, private key hoặc tên khách vào `console.log`.

## Giới hạn thực tế

Slug cá nhân hóa lời mời, không phải mật khẩu. Người biết URL có thể xem tên được mời. Không dùng link này để lưu thông tin nhạy cảm như số điện thoại, địa chỉ nhà hoặc số tài khoản. Turnstile và WAF giảm spam nhưng không thể bảo đảm tuyệt đối trước người cố tình gửi thủ công; cần theo dõi Sheet trong thời gian mở RSVP.
