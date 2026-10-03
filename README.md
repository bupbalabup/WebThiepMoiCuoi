# Thiệp cưới Tuấn Anh & Ngọc Anh

Dự án thiệp cưới trực tuyến theo phong cách trẻ, hiện đại, ưu tiên điện thoại nhưng vẫn đẹp trên máy tính. Trang home `/` cho khách chọn Nhà trai hoặc Nhà gái để mở thiệp tương ứng tại `/nha-trai`, `/nha-gai`. Phúc đáp có hai link riêng `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap`. Khách cũng có thể mở form phúc đáp ngay trong từng thiệp; dữ liệu được ghi vào tab `Nhà trai` hoặc `Nhà gái` theo link mời.

## Trạng thái

**Đã có bản ứng dụng chạy được.** Thiệp có giao diện kem–nâu lấy cảm hứng từ mẫu Minimalism, sử dụng 18 ảnh cưới đã tối ưu. Phúc đáp và lời chúc được ghi riêng theo Nhà trai/Nhà gái, tiêu đề và nội dung Sheet bằng tiếng Việt. Thời gian gửi hiển thị `dd/MM/yyyy HH:mm:ss` theo giờ Việt Nam và vẫn sắp xếp được theo ngày. GitHub đã kết nối Cloudflare Workers Builds để tự triển khai khi đẩy mã. Hai QR mừng cưới còn chờ ảnh và thông tin tài khoản của chủ tiệc.

## Thông tin đã chốt

- Chú rể: **Tuấn Anh**. Cô dâu: **Ngọc Anh**.
- Tiệc cưới: **11:00 ngày 21/10/2026**, giờ Việt Nam.
- Địa điểm: **Trống Đồng Palace — Sảnh Sapphire 1, tầng 3, Tòa nhà Hancorp Plaza, 72 Trần Đăng Ninh, Nghĩa Đô, Hà Nội**.
- Website phải có Google Maps với ghim địa điểm và nút mở chỉ đường.
- RSVP gồm tên khách, trạng thái **tham gia / đang cân nhắc / không tham gia**, tổng số người tham dự tính cả khách và mối quan hệ với cô dâu/chú rể.
- Số người: chọn nhanh 1 hoặc 2; “Mục khác” cho nhập số nguyên từ 1 trở lên, không đặt giới hạn tối đa. Nếu không tham gia, hệ thống lưu 0.
- Hạn RSVP: **hết ngày 15/10/2026**, giờ Việt Nam.
- Tông màu hiện tại: kem, nâu ấm; nút hành động dùng nâu đậm.
- Bố cục responsive từ 320px đến màn hình lớn, không có khung ảnh rỗng hoặc vùng trống vô nghĩa. Thiệp có 18 vị trí ảnh linh hoạt và yêu cầu tối thiểu 12 ảnh thật trước khi phát hành.
- Trên thiệp, nút **Tham dự** mở form phúc đáp tại chỗ; nút **Gửi mừng cưới** chỉ mở QR của bên tương ứng với link thiệp.
- Chủ tiệc đã tạo QR dẫn đến trang phúc đáp. Khi deploy xong, bàn giao hai URL production cố định `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap` để chủ tiệc gắn đúng link cho QR của từng bên.
- Mỗi khách có link thiệp riêng, ví dụ `/nha-trai/nguyen-van-a`. Tên có dấu lấy từ tab `Nhà trai mời onl` hoặc `Nhà gái mời onl`; cột A là STT, B là Tên, C tự tạo Slug và D tự tạo Link thiệp cho 1.000 dòng. Xem [cách đặt công thức](docs/08-link-moi-ca-nhan.md).

## Hai trang và hai mục đích QR

| Nội dung | Hành vi |
| --- | --- |
| `/` | Trang home hỏi “Bạn là khách của bên nào?”, hai nút Khách Nhà trai / Khách Nhà gái |
| `/nha-trai` | Thiệp nhà trai, Google Maps, form tại chỗ và QR mừng cưới nhà trai |
| `/nha-gai` | Thiệp nhà gái, Google Maps, form tại chỗ và QR mừng cưới nhà gái |
| `/nha-trai/phuc-dap` | Form riêng cho khách Nhà trai, mở trực tiếp từ QR phúc đáp tương ứng |
| `/nha-gai/phuc-dap` | Form riêng cho khách Nhà gái, mở trực tiếp từ QR phúc đáp tương ứng |
| `/nha-trai/:slug` | Thiệp cá nhân Nhà trai, tên khách lấy từ Sheet và điền trước vào form |
| `/nha-gai/:slug` | Thiệp cá nhân Nhà gái, tên khách lấy từ Sheet và điền trước vào form |
| Tham dự trên thiệp | Mở form trong hộp thoại, giữ khách ở trang thiệp |
| Gửi mừng cưới trên thiệp | Mở đúng một QR theo link, không hiển thị cả hai QR hoặc bộ chọn người nhận |

Xem [luồng hai trang và QR](docs/07-luong-trang-va-qr.md). Website: https://wedding.tanawedding.workers.dev.

## Công nghệ

- React + Vite cho giao diện; Node.js và npm cho môi trường phát triển/build.
- Cloudflare Worker phục vụ frontend trong `dist` và API tại `POST /api/rsvp` xử lý biểu mẫu.
- Google Sheets API lưu RSVP; tài khoản dịch vụ Google chỉ được cấp quyền với một Sheet.
- GitHub lưu mã nguồn và kích hoạt Cloudflare Workers build khi push.

> Không đưa khóa Google vào React, biến `VITE_*`, GitHub, hoặc file được publish. API chạy trên Cloudflare Workers runtime, không phải một tiến trình Node.js thường trực.

## Cấu trúc dự án

```text
web-moi-cuoi/
├── .github/workflows/ci.yml    # GitHub Actions: test và build
├── docs/
│   ├── 01-yeu-cau.md           # Phạm vi, nội dung cần cung cấp
│   ├── 02-giao-dien.md          # Hướng hình ảnh và responsive
│   ├── 03-kien-truc.md          # Luồng hệ thống, dữ liệu và bảo mật
│   ├── 04-ke-hoach-code.md      # Các chặng thực hiện và tiêu chí xong
│   ├── 05-ke-hoach-kiem-thu.md  # Kiểm thử chức năng, giao diện, tốc độ
│   ├── 06-github-cloudflare.md  # Thiết lập Google, GitHub, Pages
│   ├── 07-luong-trang-va-qr.md  # Thiệp, trang phúc đáp, hộp thoại và QR
│   └── 08-link-moi-ca-nhan.md   # Tên khách, slug và link tự động từ Sheet
├── google-sheets/             # Công thức slug và link cho hai tab khách mời
├── functions/
│   ├── api/                    # API tra thiệp và nhận RSVP
│   └── _lib/                   # Google OAuth, validate, Turnstile, HTTP
├── worker/index.js             # Entry Worker chuyển /api/* vào API và phục vụ assets
├── public/images/              # Ảnh đã tối ưu, favicon; QR gốc trong qr/
├── src/
│   ├── components/             # Form RSVP dùng chung, hộp thoại QR
│   ├── pages/                  # HomePage, InvitationPage theo bên mời, RsvpPage
│   ├── sections/               # Hero, câu chuyện, lịch trình, RSVP...
│   ├── styles/                 # Token, typography, layout, animation
│   ├── config/wedding.json     # Nội dung cưới và các mốc giờ đã chốt
│   └── lib/                    # Hàm hỗ trợ gọi API, định dạng ngày
├── tests/                      # Kiểm thử API và luồng RSVP
├── .dev.vars.example           # Tên biến môi trường cục bộ, không có khóa
├── .gitignore
└── README.md
```

## Chạy cục bộ

```bash
npm install
npm run dev
npm test
npm run build
```

Sao chép `.env.example` thành `.env.local` cho site key Turnstile của Vite. Sao chép `.dev.vars.example` thành `.dev.vars` cho Worker khi chạy local, rồi thay bằng thông tin của Sheet thử nghiệm. Hai file thật đều đã bị Git bỏ qua.

## Điền biến môi trường ở đâu?

Không gom tất cả khóa vào một file `.env`. Dự án có hai môi trường khác nhau:

| Nơi điền | Biến | Mục đích |
| --- | --- | --- |
| `.env.local` trên máy | `VITE_TURNSTILE_SITE_KEY` | Vite đưa site key công khai vào frontend |
| `.dev.vars` trên máy | `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `GOOGLE_GROOM_RSVP_TAB`, `GOOGLE_BRIDE_RSVP_TAB`, `TURNSTILE_SECRET_KEY`, `APP_ENV`, `ALLOWED_ORIGINS` | Worker local đọc; file này không được commit |
| Cloudflare **Settings > Build > Build variables and secrets** | `VITE_TURNSTILE_SITE_KEY` | Có mặt khi lệnh `npm run build` chạy |
| Cloudflare **Settings > Variables and Secrets** | Các biến runtime còn lại | Worker production đọc khi khách tra thiệp hoặc gửi phúc đáp |

### 1. Cấu hình trên máy

```powershell
Copy-Item .env.example .env.local
Copy-Item .dev.vars.example .dev.vars
```

Trong `.env.local`, chỉ điền:

```dotenv
VITE_TURNSTILE_SITE_KEY=site-key-lay-tu-cloudflare-turnstile
```

Trong `.dev.vars`, điền theo mẫu `.dev.vars.example`. Có thể giữ `APP_ENV=development` và hai localhost trong `ALLOWED_ORIGINS`. Private key có thể giữ dạng một dòng với `\n`; mã server sẽ đổi thành xuống dòng trước khi sử dụng.

### 2. Lấy giá trị Google

1. Trong Google Cloud Console, bật **Google Sheets API** và tạo một service account.
2. Tạo key loại JSON cho service account và tải file về máy; không đưa file JSON vào repository.
3. `GOOGLE_CLIENT_EMAIL`: lấy từ trường `client_email` trong JSON.
4. `GOOGLE_PRIVATE_KEY`: lấy nguyên trường `private_key`, gồm cả `BEGIN PRIVATE KEY` và `END PRIVATE KEY`.
5. `GOOGLE_SHEET_ID`: lấy phần nằm giữa `/d/` và `/edit` trong URL Google Sheet. Không dùng số `gid`.
6. Chia sẻ chính Sheet đó cho `client_email` với quyền **Editor**, còn quyền truy cập chung vẫn để **Restricted**.
7. Trong cả tab `Nhà trai` và `Nhà gái`, dán hàng tiêu đề trong `google-sheets/rsvp-headers.tsv` vào A1:K1; cột A là STT tự động.
8. Trong tab `Tổng hợp số lượng`, dán toàn bộ `google-sheets/tong-hop-so-luong.formulas.tsv` vào A1. Công thức tự cộng hai bên.

### 3. Lấy Turnstile key

Trong Cloudflare Dashboard, mở **Turnstile**, tạo widget kiểu Managed cho hostname production:

- Site key → `VITE_TURNSTILE_SITE_KEY`; site key được phép xuất hiện ở frontend.
- Secret key → `TURNSTILE_SECRET_KEY`; luôn lưu dưới dạng Secret.

### 4. Điền trên Cloudflare Worker `wedding`

Vào **Workers & Pages > wedding**:

1. Mở **Settings > Build > Build variables and secrets**, thêm `VITE_TURNSTILE_SITE_KEY` dạng biến build. Sau khi đổi biến này phải chạy lại deployment vì Vite đóng giá trị vào bản build.
2. Mở **Settings > Variables and Secrets > Add** và thêm các biến runtime dưới đây.
3. Bấm **Deploy** để tạo version mới có các binding vừa thêm.

| Tên | Loại trên Cloudflare | Giá trị |
| --- | --- | --- |
| `GOOGLE_CLIENT_EMAIL` | Secret | `client_email` trong JSON |
| `GOOGLE_PRIVATE_KEY` | Secret | Toàn bộ `private_key` trong JSON |
| `GOOGLE_SHEET_ID` | Secret | ID của spreadsheet |
| `TURNSTILE_SECRET_KEY` | Secret | Secret key của Turnstile |
| `GOOGLE_GROOM_RSVP_TAB` | Text | `Nhà trai` |
| `GOOGLE_BRIDE_RSVP_TAB` | Text | `Nhà gái` |
| `APP_ENV` | Text | `production` |
| `ALLOWED_ORIGINS` | Text | Origin HTTPS thật, ví dụ `https://wedding.example.workers.dev`; không có dấu `/` cuối |

`VITE_TURNSTILE_SITE_KEY` cần nằm ở phần **Build**. Các khóa Google và `TURNSTILE_SECRET_KEY` cần nằm ở phần **Variables and Secrets** của Worker; build variable không tự trở thành runtime binding.

Sau khi cấu hình xong, push hoặc retry deployment rồi thử cả `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap`. Không gửi private key vào chat hoặc commit Git.

## Những dữ liệu còn phải bổ sung trước khi phát hành

- Đưa tối thiểu 12 ảnh cưới đã tối ưu vào `public/images/` rồi gán `src` trong `src/config/wedding.json`.
- Đưa QR mừng cưới Nhà trai và Nhà gái vào `public/images/qr/`, sau đó điền đúng `gift.accounts.groom` và `gift.accounts.bride`.
- Giữ năm tab: `Nhà trai`, `Nhà gái`, `Tổng hợp số lượng`, `Nhà trai mời onl`, `Nhà gái mời onl`. Hai tab đầu nhận RSVP, tab tổng hợp dùng công thức, hai tab `mời onl` chỉ giữ Tên/Slug/Link thiệp.
- Tạo Turnstile widget và thêm site key ở build environment, secret key ở Pages Functions.
- Cloudflare đã tự deploy từ GitHub; thêm các Secret theo tài liệu 10, redeploy và chạy một phúc đáp thử trên production trước khi thay link QR phúc đáp.

## Bảo vệ dữ liệu

- Trình duyệt chỉ gọi `/api/invitation` và `/api/rsvp`; không nhận Sheet ID, private key hoặc link quản trị Sheet.
- Function kiểm tra origin, kiểu/kích thước request, dữ liệu bắt buộc, hạn gửi và slug; Turnstile được xác minh ở server theo action và hostname.
- Nội dung được ghi với `valueInputOption=RAW`, có bẫy bot và mã chống ghi lặp; không lưu IP/user-agent và không có API đọc danh sách RSVP.
- `.dev.vars`, `.env.local`, file khóa và dữ liệu xuất từ Sheet bị chặn khỏi Git. Source map production được tắt.

## Tài liệu

- [Yêu cầu và câu hỏi nội dung](docs/01-yeu-cau.md)
- [Định hướng giao diện](docs/02-giao-dien.md)
- [Kiến trúc và dữ liệu](docs/03-kien-truc.md)
- [Kế hoạch code](docs/04-ke-hoach-code.md)
- [Kế hoạch kiểm thử](docs/05-ke-hoach-kiem-thu.md)
- [Hướng dẫn GitHub và Cloudflare](docs/06-github-cloudflare.md)
- [Luồng hai trang và QR](docs/07-luong-trang-va-qr.md)
- [Công thức và link thiệp cá nhân](docs/08-link-moi-ca-nhan.md)
- [Bảo mật, riêng tư và chống spam](docs/09-bao-mat-va-chong-spam.md)

- [Kết nối Sheet riêng tư đang dùng](docs/10-ket-noi-sheet-rieng-tu.md)

## Lời chúc và dữ liệu tiếng Việt

Xem [hướng dẫn dữ liệu và lời chúc](docs/12-du-lieu-tieng-viet-va-loi-chuc.md). Hai tab lời chúc là `Lời chúc nhà trai` và `Lời chúc nhà gái`. Khách gửi lời chúc tại mục Sổ lưu bút trong thiệp; lời chúc chỉ gửi riêng đến hai gia đình, không có API công khai danh sách. Không cần thêm biến môi trường mới.
