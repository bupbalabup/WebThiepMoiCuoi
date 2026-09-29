# Thiệp cưới Tuấn Anh & Ngọc Anh

Dự án thiệp cưới trực tuyến theo phong cách trẻ, hiện đại, ưu tiên điện thoại nhưng vẫn đẹp trên máy tính. Trang home `/` cho khách chọn Nhà trai hoặc Nhà gái để mở thiệp tương ứng tại `/nha-trai`, `/nha-gai`. Phúc đáp có hai link riêng `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap`. Khách cũng có thể mở form phúc đáp ngay trong từng thiệp; mọi cách gửi đều ghi vào cùng Google Sheets và phân loại đúng bên mời.

## Trạng thái

**Giai đoạn lập kế hoạch.** Thư mục đã được chia để bắt đầu lập trình; chưa có ứng dụng chạy, Google Sheet, repository GitHub hoặc bản triển khai Cloudflare. Đã cập nhật thông tin cưới vào [cấu hình nội dung](src/config/wedding.json); ảnh và lời mời riêng đang chờ chủ tiệc cung cấp.

## Thông tin đã chốt

- Chú rể: **Tuấn Anh**. Cô dâu: **Ngọc Anh**.
- Tiệc cưới: **11:00 ngày 21/10/2026**, giờ Việt Nam.
- Địa điểm: **Trống Đồng Palace — Tòa nhà Hancorp Plaza, 72 Trần Đăng Ninh, Hà Nội**.
- Website phải có Google Maps với ghim địa điểm và nút mở chỉ đường.
- RSVP gồm tên khách, trạng thái **tham gia / đang cân nhắc / không tham gia**, tổng số người tham dự tính cả khách và mối quan hệ với cô dâu/chú rể.
- Số người: chọn nhanh 1 hoặc 2; “Mục khác” cho nhập số nguyên từ 1 trở lên, không đặt giới hạn tối đa. Nếu không tham gia, hệ thống lưu 0.
- Hạn RSVP: **hết ngày 15/10/2026**, giờ Việt Nam.
- Tông màu: kem, hồng, đỏ rượu.
- Bố cục responsive từ 320px đến màn hình lớn, không có khung ảnh rỗng hoặc vùng trống vô nghĩa. Thiệp có 18 vị trí ảnh linh hoạt và yêu cầu tối thiểu 12 ảnh thật trước khi phát hành.
- Trên thiệp, nút **Tham dự** mở form phúc đáp tại chỗ; nút **Gửi mừng cưới** chỉ mở QR của bên tương ứng với link thiệp.
- Chủ tiệc đã tạo QR dẫn đến trang phúc đáp. Khi deploy xong, bàn giao hai URL production cố định `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap` để chủ tiệc gắn đúng link cho QR của từng bên.
- Mỗi khách có link thiệp riêng, ví dụ `/nha-trai/nguyen-van-a`. Tên có dấu lấy từ tab `Nhà trai mời onl` hoặc `Nhà gái mời onl`; cột A là Tên, B tự tạo Slug, C tự tạo Link thiệp. Xem [cách đặt công thức](docs/08-link-moi-ca-nhan.md).

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

Xem [luồng hai trang và QR](docs/07-luong-trang-va-qr.md). Chưa có URL production để gắn vào QR; chỉ bàn giao sau khi kiểm thử gửi thật thành công.

## Công nghệ dự kiến

- React + Vite cho giao diện; Node.js và npm cho môi trường phát triển/build.
- Cloudflare Pages phục vụ trang và Pages Function tại `POST /api/rsvp` xử lý biểu mẫu.
- Google Sheets API lưu RSVP; tài khoản dịch vụ Google chỉ được cấp quyền với một Sheet.
- GitHub lưu mã nguồn và kích hoạt Cloudflare Pages build khi push.

> Không đưa khóa Google vào React, biến `VITE_*`, GitHub, hoặc file được publish. Mã Function chạy trên Cloudflare Workers runtime, không phải một tiến trình Node.js thường trực.

## Cấu trúc dự án

```text
web-moi-cuoi/
├── .github/workflows/          # CI, thêm ở giai đoạn triển khai
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
├── functions/api/              # Cloudflare Pages Function nhận RSVP
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

Các thư mục nguồn chưa có mã chứa `.gitkeep` để giữ cấu trúc trong Git. Cấu hình nội dung đã có tại `src/config/wedding.json`; các tệp ứng dụng và cấu hình npm sẽ được thêm khi bắt đầu chặng 1 của [kế hoạch code](docs/04-ke-hoach-code.md).

## Tài liệu

- [Yêu cầu và câu hỏi nội dung](docs/01-yeu-cau.md)
- [Định hướng giao diện](docs/02-giao-dien.md)
- [Kiến trúc và dữ liệu](docs/03-kien-truc.md)
- [Kế hoạch code](docs/04-ke-hoach-code.md)
- [Kế hoạch kiểm thử](docs/05-ke-hoach-kiem-thu.md)
- [Hướng dẫn GitHub và Cloudflare](docs/06-github-cloudflare.md)
- [Luồng hai trang và QR](docs/07-luong-trang-va-qr.md)
- [Công thức và link thiệp cá nhân](docs/08-link-moi-ca-nhan.md)
