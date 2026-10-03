# 06 — GitHub, Google Sheets và Cloudflare Workers

Tài liệu thao tác cho **giai đoạn kết nối và phát hành**. Ứng dụng, Worker API, CI, kiểm thử cục bộ, repository GitHub và Workers Builds đã có; chưa kết nối Sheet thật.

## 1. Google Sheets

1. Tạo Google Cloud project, bật Google Sheets API.
2. Tạo service account và khóa JSON; giữ private key ngoài repository.
3. Trong hai tab `Nhà trai` và `Nhà gái`, dán hàng tiêu đề từ `google-sheets/rsvp-headers.tsv` vào A1:K1.
4. Trong tab `Tổng hợp số lượng`, dán `google-sheets/tong-hop-so-luong.formulas.tsv` vào A1 để tổng tự cập nhật từ hai bên.
5. Chia sẻ Sheet cho email service account quyền Editor. Giữ Sheet ở chế độ riêng tư.
6. Dùng một Sheet test cho preview và một Sheet thật cho production nếu có thể.
7. Giữ/tạo hai tab `Nhà trai mời onl`, `Nhà gái mời onl` với A: STT, B: Tên, C: Slug, D: Link thiệp, E: Đã mời. Áp dụng [công thức tự tạo link](08-link-moi-ca-nhan.md), công thức áp dụng cho 1.000 dòng. Cấu hình quyền đọc tên khách và ghi RSVP cho Worker; kiểm thử Sheet thật trước khi bàn giao link.

## 2. GitHub

1. Tạo repository, thêm remote GitHub và push nhánh `main` sau khi kiểm tra `.gitignore`.
2. Chỉ commit `.dev.vars.example`; **không commit** `.dev.vars`, key JSON, `.env.local`, file xuất RSVP.
3. Bật bảo vệ nhánh/kiểm tra build nếu muốn. Các commit sau sẽ tự tạo Workers build khi đã kết nối.

## 3. Cloudflare Workers Free

1. Trong Workers & Pages, mở Worker `wedding` đã kết nối repository GitHub.
2. Trong **Settings > Build**, đặt production branch `main`, build command `npm run build`, deploy command `npx wrangler deploy`, root directory là thư mục gốc repository.
3. Trong **Settings > Build > Build variables and secrets**, thêm `VITE_TURNSTILE_SITE_KEY`. Biến này chỉ phục vụ Vite lúc build.
4. Trong **Settings > Variables and Secrets**, thêm `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `TURNSTILE_SECRET_KEY` dạng Secret; thêm `GOOGLE_GROOM_RSVP_TAB=Nhà trai`, `GOOGLE_BRIDE_RSVP_TAB=Nhà gái`, `APP_ENV=production`, `ALLOWED_ORIGINS=https://TEN-MIEN-THAT` dạng Text. Dùng Sheet/secret khác cho preview nếu có thể.
5. Deploy; mở URL `*.workers.dev` ở `/`, `/nha-trai`, `/nha-gai`, `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap`, refresh trực tiếp từng trang; kiểm tra hai nút home dẫn đúng thiệp và `/api/rsvp` từ các route có form. Entry tại `worker/index.js` chuyển `/api/*` vào API trước khi SPA fallback chạy.
6. Nếu dùng domain riêng, thêm domain sau khi bản `workers.dev` đã ổn. Cập nhật `ALLOWED_ORIGINS` và hostname Turnstile khi chuyển domain.
7. Cập nhật `Cấu hình!B1` bằng origin production thực tế. Mở một link cá nhân của mỗi bên từ cột D, kiểm tra tên có dấu, form điền trước, QR mừng cưới và các cột `invitation_slug`/`invited_name` trong Sheet phản hồi.
8. Trong Security > WAF > Rate limiting rules của domain, tạo một rule cho path bắt đầu bằng `/api/` với ngưỡng thấp phù hợp lượng khách (ví dụ 10 request/phút/IP). Chọn Managed Challenge nếu gói/tài khoản đang dùng cho phép; giữ Turnstile trong form dù đã có rule.

## Bàn giao link cho QR phúc đáp đã có

1. Xác định tên miền production sẽ giữ ổn định (domain riêng hoặc tên Worker `workers.dev`).
2. Ghi origin thực tế vào cấu hình; hai URL có dạng `https://TEN-MIEN-THAT/nha-trai/phuc-dap` và `https://TEN-MIEN-THAT/nha-gai/phuc-dap`. Đây là mẫu định dạng, chưa phải link đã deploy.
3. Chỉ bàn giao hai URL sau khi mỗi trang phúc đáp ghi đúng bên vào Sheet production và kiểm tra trên điện thoại. Chủ tiệc gắn link nhà trai cho QR phúc đáp nhà trai, link nhà gái cho QR phúc đáp nhà gái.
4. Quét từng QR thật sau khi cập nhật đích và giữ nguyên cả hai đường dẫn qua các bản phát hành. Nếu đổi domain sau này, phải duy trì chuyển hướng từ URL cũ trước khi gỡ domain.
5. Bàn giao thêm hai link thiệp `/nha-trai` và `/nha-gai`. Kiểm tra nút Gửi mừng cưới trên từng link chỉ hiện QR của đúng bên mời, kể cả khi cùng một thiết bị mở hai link. Đây là hai ảnh QR mừng cưới riêng, không dùng QR dẫn tới trang phúc đáp.

## 4. Chạy thử cục bộ ở giai đoạn code

`npm run dev` chỉ phục vụ giao diện Vite. Để kiểm tra Worker và API thực tế, chạy `npm run build`, sau đó `npx wrangler dev` với `.dev.vars` ở máy cá nhân và Sheet test. Không dùng khóa production khi kiểm thử local.

## Giới hạn và chi phí cần theo dõi

Cloudflare Workers Free có hạn mức build/request; Sheets API có quota theo phút. Quy mô thiệp cưới cá nhân thường nhỏ, nhưng không coi đây là cam kết miễn phí vĩnh viễn: kiểm tra lại trang giá/quota trước khi phát hành và quan sát lỗi `429` khi có nhiều RSVP cùng lúc.

## Tài liệu chính thức

- [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Workers Static Assets cho SPA](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Workers Variables and Secrets](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Google service account và chia sẻ Sheet](https://developers.google.com/workspace/guides/create-credentials)
- [Google Sheets append API](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)
- [Google Sheets API quotas](https://developers.google.com/workspace/sheets/api/limits)


