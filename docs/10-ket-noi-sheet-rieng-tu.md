# Kết nối Google Sheet riêng tư với Cloudflare

Giữ **General access / Quyền truy cập chung: Restricted / Bị hạn chế**. Khách gửi form trên website; Cloudflare ghi vào Sheet thay họ. Không cần công khai Sheet hoặc cấp quyền chỉnh sửa cho khách.

## 1. Tạo quyền ghi cho website

1. Trong Google Cloud Console, tạo/chọn project và bật **Google Sheets API**.
2. Vào **IAM & Admin > Service Accounts**, tạo service account cho website. Không cần cấp vai trò Owner/Editor của cả Google Cloud project.
3. Trong service account, mở **Keys > Add key > Create new key > JSON**. Tải và giữ file này riêng trên máy.
4. Mở đúng Google Sheet bạn muốn nhận phúc đáp. Bấm **Share**, thêm email ở trường `client_email` của file JSON với quyền **Editor**. Quyền truy cập chung vẫn để Restricted.

## 2. Chuẩn bị các tab nhận dữ liệu

Giữ các tab sau:

- `Nhà trai`: chỉ nhận phúc đáp từ link Nhà trai.
- `Nhà gái`: chỉ nhận phúc đáp từ link Nhà gái.
- `Lời chúc nhà trai`, `Lời chúc nhà gái`: nhận lời chúc riêng từng bên.
- `Tổng hợp số lượng`: công thức tổng hợp hai tab phúc đáp.
- `Nhà trai mời onl`: Tên, Slug, Link thiệp Nhà trai.
- `Nhà gái mời onl`: Tên, Slug, Link thiệp Nhà gái.

Dán hàng sau vào A1 của **cả `Nhà trai` và `Nhà gái`** (các giá trị phân tách bằng tab, tương ứng A:J):

```text
Thời gian gửi	Họ và tên	Phúc đáp	Tổng số người	Mối quan hệ	Thông tin khác	Mã phúc đáp	Bên mời	Đường dẫn khách mời	Tên được mời
```

Lấy hàng này từ `google-sheets/rsvp-headers.tsv`. Server yêu cầu đủ 10 tiêu đề theo đúng thứ tự ở tab đích; nếu sai sẽ từ chối ghi để tránh trộn dữ liệu.

Trong `Tổng hợp số lượng`, dán toàn bộ `google-sheets/tong-hop-so-luong.formulas.tsv` vào A1. Bảng gồm:

- Tổng người xác nhận tham gia: cộng cột Tổng số người của các dòng Có tham dự từ hai bên.
- Tổng lượt phúc đáp và lượt xác nhận tham gia.
- Số người/lượt đang cân nhắc.
- Lượt không tham gia.

Cột `Tổng` luôn bằng `Nhà trai + Nhà gái`. Các dòng Không tham dự được server lưu Tổng số người bằng 0, nên không làm tăng tổng người tham dự.

Hai tab **Nhà trai mời onl**, **Nhà gái mời onl** dùng cho link thiệp cá nhân vẫn có A: Tên, B: Slug, C: Link thiệp, D: Slug cố định tùy chọn. Xem tài liệu 08 để dán công thức B2/C2.

## 3. Thêm Variables and Secrets trong Cloudflare Worker

Mở **Workers & Pages > wedding**. Các runtime binding dưới đây nằm tại **Settings > Variables and Secrets**:

| Tên | Kiểu | Giá trị |
| --- | --- | --- |
| GOOGLE_CLIENT_EMAIL | Secret | Trường client_email trong JSON |
| GOOGLE_PRIVATE_KEY | Secret | Trường private_key, giữ đủ BEGIN/END và xuống dòng |
| GOOGLE_SHEET_ID | Secret | Phần nằm giữa /d/ và /edit trong URL Sheet đã gửi |
| GOOGLE_GROOM_RSVP_TAB | Text | Nhà trai |
| GOOGLE_BRIDE_RSVP_TAB | Text | Nhà gái |
| TURNSTILE_SECRET_KEY | Secret | Secret key của widget Turnstile |
| APP_ENV | Text | production |
| ALLOWED_ORIGINS | Text | Origin website HTTPS hiện tại, không kèm đường dẫn; nhiều origin cách nhau bởi dấu phẩy |

Riêng `VITE_TURNSTILE_SITE_KEY` thêm tại **Settings > Build > Build variables and secrets**. Đây là site key công khai mà Vite cần lúc chạy `npm run build`; nó không phải runtime secret.

`gid=1486554695` trong link là ID một tab, **không phải** GOOGLE_SHEET_ID. Không đặt private key hoặc Sheet ID trong biến có tiền tố `VITE_`.

Trong **Turnstile > Add widget**, thêm hostname `workers.dev` hoặc domain riêng đang dùng, chọn Managed. Dùng site key/secret thật cho production, không dùng test key trong các file ví dụ.

## 4. Redeploy và xác nhận

Sau khi lưu biến runtime, bấm **Deploy**. Sau khi thêm site key ở phần Build, chạy lại deployment từ commit mới nhất để Vite nhận giá trị. Những lần sửa mã tiếp theo chỉ cần push GitHub như hiện tại.

1. Mở trang phúc đáp Nhà trai, gửi một mẫu có tên rõ là kiểm thử và kiểm tra dòng mới chỉ xuất hiện trong tab `Nhà trai`.
2. Làm tương tự với Nhà gái, kiểm tra dòng mới chỉ xuất hiện trong tab `Nhà gái`; cột H lần lượt là Nhà trai/Nhà gái.
3. Kiểm tra `Tổng hợp số lượng`: cột D bằng cột B cộng cột C.
4. Mở link cá nhân của mỗi bên, kiểm tra đúng tên gốc và cột I/J sau khi gửi.
5. Nếu lỗi, xem Functions log chỉ để nhận mã lỗi; không dán khóa/token vào log hoặc chat.

Các kết quả kiểm thử cụ thể được ghi trong tài liệu kiểm thử. Khóa bí mật chỉ đặt trong Cloudflare; không xuất đường dẫn quản trị Sheet trong giao diện.

Tham khảo: [Google service accounts](https://developers.google.com/identity/protocols/oauth2/service-account), [Sheets append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append), [Cloudflare Variables and Secrets](https://developers.cloudflare.com/workers/configuration/environment-variables/), [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

Đặt định dạng cột A của bốn tab nhận dữ liệu là `dd/MM/yyyy HH:mm:ss`. Tiêu đề lời chúc lấy từ `google-sheets/wish-headers.tsv`. Xem tài liệu 12 để biết thứ tự cột và quy tắc lưu.
