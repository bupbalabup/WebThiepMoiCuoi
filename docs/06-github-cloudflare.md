# 06 — GitHub, Google Sheets và Cloudflare Pages

Tài liệu thao tác cho **giai đoạn triển khai**, sau khi ứng dụng và kiểm thử đã hoàn tất. Chưa có tài khoản, repository, Sheet hoặc deploy nào được tạo trong giai đoạn lập kế hoạch.

## 1. Google Sheets

1. Tạo Google Cloud project, bật Google Sheets API.
2. Tạo service account và khóa JSON; giữ private key ngoài repository.
3. Tạo Sheet có tab `RSVP` và hàng tiêu đề theo [kiến trúc dữ liệu](03-kien-truc.md).
4. Chia sẻ Sheet cho email service account quyền Editor. Giữ Sheet ở chế độ riêng tư.
5. Dùng một Sheet test cho preview và một Sheet thật cho production nếu có thể.
6. Giữ/tạo hai tab `Nhà trai mời onl`, `Nhà gái mời onl` với A: Tên, B: Slug, C: Link thiệp. Áp dụng [công thức tự tạo link](08-link-moi-ca-nhan.md), cột D chỉ xử lý ngoại lệ. Cấu hình quyền đọc tên khách và ghi RSVP cho Function; kiểm thử Sheet thật trước khi bàn giao link.

## 2. GitHub

1. Tạo repository, thêm remote GitHub và push nhánh `main` sau khi kiểm tra `.gitignore`.
2. Chỉ commit `.dev.vars.example`; **không commit** `.dev.vars`, key JSON, `.env.local`, file xuất RSVP.
3. Bật bảo vệ nhánh/kiểm tra build nếu muốn. Các commit sau sẽ tự tạo build Pages khi đã kết nối.

## 3. Cloudflare Pages Free

1. Trong Workers & Pages, tạo Pages project từ repository GitHub.
2. Đặt production branch `main`, build command `npm run build`, output `dist`, root directory là thư mục gốc repository.
3. Thêm `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` dưới dạng secret/biến chỉ dành cho Function; dùng giá trị khác cho preview và production.
4. Deploy; mở URL `*.pages.dev` ở `/`, `/nha-trai`, `/nha-gai`, `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap`, refresh trực tiếp từng trang; kiểm tra hai nút home dẫn đúng thiệp và `/api/rsvp` từ bốn route có form. Kiểm tra SPA fallback không che lỗi API.
5. Nếu dùng domain riêng, thêm domain sau khi bản `pages.dev` đã ổn. Kiểm tra HTTPS, trang chia sẻ mạng xã hội và RSVP sau khi chuyển domain.
6. Cập nhật `Cấu hình!B1` bằng origin production thực tế. Mở một link cá nhân của mỗi bên từ cột C, kiểm tra tên có dấu, form điền trước, QR mừng cưới và các cột `invitation_slug`/`invited_name` trong Sheet phản hồi.

## Bàn giao link cho QR phúc đáp đã có

1. Xác định tên miền production sẽ giữ ổn định (domain riêng hoặc tên dự án `pages.dev`).
2. Ghi origin thực tế vào cấu hình; hai URL có dạng `https://TEN-MIEN-THAT/nha-trai/phuc-dap` và `https://TEN-MIEN-THAT/nha-gai/phuc-dap`. Đây là mẫu định dạng, chưa phải link đã deploy.
3. Chỉ bàn giao hai URL sau khi mỗi trang phúc đáp ghi đúng bên vào Sheet production và kiểm tra trên điện thoại. Chủ tiệc gắn link nhà trai cho QR phúc đáp nhà trai, link nhà gái cho QR phúc đáp nhà gái.
4. Quét từng QR thật sau khi cập nhật đích và giữ nguyên cả hai đường dẫn qua các bản phát hành. Nếu đổi domain sau này, phải duy trì chuyển hướng từ URL cũ trước khi gỡ domain.
5. Bàn giao thêm hai link thiệp `/nha-trai` và `/nha-gai`. Kiểm tra nút Gửi mừng cưới trên từng link chỉ hiện QR của đúng bên mời, kể cả khi cùng một thiết bị mở hai link. Đây là hai ảnh QR mừng cưới riêng, không dùng QR dẫn tới trang phúc đáp.

## 4. Chạy thử cục bộ ở giai đoạn code

`npm run dev` phục vụ giao diện Vite. Để kiểm tra Pages Function thực tế, build rồi chạy `npx wrangler pages dev dist` với `.dev.vars` ở máy cá nhân và Sheet test. Không dùng khóa production khi kiểm thử local.

## Giới hạn và chi phí cần theo dõi

Cloudflare Pages Free hiện có giới hạn build theo tháng; Pages Functions dùng hạn mức request của Workers Free. Sheets API có quota theo phút. Quy mô thiệp cưới cá nhân thường nhỏ, nhưng không coi đây là cam kết miễn phí vĩnh viễn: kiểm tra lại trang giá/quota trước khi phát hành và quan sát lỗi `429` khi có nhiều RSVP cùng lúc.

## Tài liệu chính thức

- [Cloudflare Pages cho React](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Cloudflare Pages Functions và routing](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare Pages Functions local development](https://developers.cloudflare.com/pages/functions/local-development/)
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Google service account và chia sẻ Sheet](https://developers.google.com/workspace/guides/create-credentials)
- [Google Sheets append API](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append)
- [Google Sheets API quotas](https://developers.google.com/workspace/sheets/api/limits)
