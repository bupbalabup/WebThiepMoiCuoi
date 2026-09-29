# Kết nối Google Sheet riêng tư với Cloudflare

Giữ **General access / Quyền truy cập chung: Restricted / Bị hạn chế**. Khách gửi form trên website; Cloudflare ghi vào Sheet thay họ. Không cần công khai Sheet hoặc cấp quyền chỉnh sửa cho khách.

## 1. Tạo quyền ghi cho website

1. Trong Google Cloud Console, tạo/chọn project và bật **Google Sheets API**.
2. Vào **IAM & Admin > Service Accounts**, tạo service account cho website. Không cần cấp vai trò Owner/Editor của cả Google Cloud project.
3. Trong service account, mở **Keys > Add key > Create new key > JSON**. Tải và giữ file này riêng trên máy.
4. Mở đúng Google Sheet bạn muốn nhận phúc đáp. Bấm **Share**, thêm email ở trường `client_email` của file JSON với quyền **Editor**. Quyền truy cập chung vẫn để Restricted.

## 2. Chuẩn bị tab nhận dữ liệu

Tạo tab **Phúc đáp** trong chính spreadsheet đã gửi. Nếu muốn dùng tab có sẵn, kiểm tra dữ liệu của nó trước; không ghi đè bảng khách mời.

Dán hàng sau vào A1 (các giá trị phân tách bằng tab, tương ứng A:J):

```text
submitted_at	name	attendance	guest_count	relationship	relationship_other	submission_id	invitation_side	invitation_slug	invited_name
```

Có thể lấy hàng tương tự từ `google-sheets/rsvp-headers.csv`. Server yêu cầu đủ 10 tiêu đề theo đúng thứ tự; nếu sai sẽ từ chối ghi để tránh trộn dữ liệu.

Hai tab **Nhà trai mời onl**, **Nhà gái mời onl** dùng cho link thiệp cá nhân vẫn có A: Tên, B: Slug, C: Link thiệp, D: Slug cố định tùy chọn. Xem tài liệu 08 để dán công thức B2/C2.

## 3. Thêm Variables and Secrets trong Cloudflare Worker

Mở **Workers & Pages > wedding**. Các runtime binding dưới đây nằm tại **Settings > Variables and Secrets**:

| Tên | Kiểu | Giá trị |
| --- | --- | --- |
| GOOGLE_CLIENT_EMAIL | Secret | Trường client_email trong JSON |
| GOOGLE_PRIVATE_KEY | Secret | Trường private_key, giữ đủ BEGIN/END và xuống dòng |
| GOOGLE_SHEET_ID | Secret | Phần nằm giữa /d/ và /edit trong URL Sheet đã gửi |
| GOOGLE_RSVP_TAB | Text | Phúc đáp, hoặc tên chính xác của tab nhận dữ liệu đã chuẩn bị |
| TURNSTILE_SECRET_KEY | Secret | Secret key của widget Turnstile |
| APP_ENV | Text | production |
| ALLOWED_ORIGINS | Text | Origin website HTTPS hiện tại, không kèm đường dẫn; nhiều origin cách nhau bởi dấu phẩy |

Riêng `VITE_TURNSTILE_SITE_KEY` thêm tại **Settings > Build > Build variables and secrets**. Đây là site key công khai mà Vite cần lúc chạy `npm run build`; nó không phải runtime secret.

`gid=1486554695` trong link là ID một tab, **không phải** GOOGLE_SHEET_ID. Không đặt private key hoặc Sheet ID trong biến có tiền tố `VITE_`.

Trong **Turnstile > Add widget**, thêm hostname `workers.dev` hoặc domain riêng đang dùng, chọn Managed. Dùng site key/secret thật cho production, không dùng test key trong các file ví dụ.

## 4. Redeploy và xác nhận

Sau khi lưu biến runtime, bấm **Deploy**. Sau khi thêm site key ở phần Build, chạy lại deployment từ commit mới nhất để Vite nhận giá trị. Những lần sửa mã tiếp theo chỉ cần push GitHub như hiện tại.

1. Mở trang phúc đáp Nhà trai, gửi một mẫu có tên rõ là kiểm thử và kiểm tra 10 cột trong tab nhận dữ liệu.
2. Làm tương tự với Nhà gái, kiểm tra cột H lần lượt là groom/bride.
3. Mở link cá nhân của mỗi bên, kiểm tra đúng tên gốc và cột I/J sau khi gửi.
4. Nếu lỗi, xem Functions log chỉ để nhận mã lỗi; không dán khóa/token vào log hoặc chat.

Hiện mã đã có kiểm thử giả lập Google API; chưa xác nhận ghi thật vì chưa có service account và Secret production. Cấu hình Sheet riêng được lưu cục bộ trong file bị Git bỏ qua; không xuất đường dẫn quản trị Sheet trong frontend.

Tham khảo: [Google service accounts](https://developers.google.com/identity/protocols/oauth2/service-account), [Sheets append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append), [Cloudflare Variables and Secrets](https://developers.cloudflare.com/pages/functions/bindings/#secrets), [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
