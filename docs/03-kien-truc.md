# 03 — Kiến trúc, API và dữ liệu

## Luồng

```text
Home `/` → chọn Khách Nhà trai / Khách Nhà gái → thiệp tương ứng
Thiệp `/nha-trai` → hộp thoại RsvpForm (groom) ──────────┐
QR nhà trai → `/nha-trai/phuc-dap` → RsvpForm (groom) ──┤
Thiệp `/nha-gai` → hộp thoại RsvpForm (bride) ──────────┤→ POST /api/rsvp
QR nhà gái → `/nha-gai/phuc-dap` → RsvpForm (bride) ────┘  → Pages Function
                                                        → Google Sheets → Sheet riêng tư
Thiệp `/nha-trai` → Gửi mừng cưới → GiftDialog → QR nhà trai
Thiệp `/nha-gai`  → Gửi mừng cưới → GiftDialog → QR nhà gái
```

Node.js phục vụ cài gói, chạy Vite, build và kiểm thử cục bộ. Khi deploy, Cloudflare Pages phục vụ thư mục `dist`; Pages Function xử lý request trong Workers runtime. Không dùng gói Node chỉ chạy được trên server truyền thống nếu chưa kiểm tra khả năng tương thích Workers.

## Hai trang trong cùng dự án

- Một ứng dụng React/Vite, một lần triển khai Cloudflare Pages; năm route tĩnh `/`, `/nha-trai`, `/nha-gai`, `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap` và hai mẫu route cá nhân `/nha-trai/:slug`, `/nha-gai/:slug`. Ưu tiên route phúc đáp tĩnh trước `:slug`. Home cho khách chọn bên mời; route không hợp lệ hiển thị không tìm thấy.
- `src/pages/HomePage.jsx`: hiển thị tên hai bạn, thông tin tiệc ngắn gọn và hai nút đến thiệp Nhà trai/Nhà gái. Không có tự chuyển hướng hoặc lựa chọn bên mặc định. Các link thiệp và phúc đáp vẫn truy cập trực tiếp, không bị bắt đi qua HomePage.
- `src/pages/InvitationPage.jsx`: thiệp, nội dung, bản đồ và các nút mở hộp thoại; nhận `side` được ánh xạ từ route (`groom` hoặc `bride`). Xác định bên từ URL mỗi lần vào trang, không dùng lựa chọn cũ trong localStorage hoặc referrer.
- `src/pages/RsvpPage.jsx`: thông tin tiệc rút gọn và form độc lập; nhận `side` theo đường dẫn (`groom` hoặc `bride`), hiển thị nhãn đúng bên và liên kết quay về thiệp cùng bên. Dùng chung thành phần nhưng URL và phân loại dữ liệu tách rõ.
- `src/components/rsvp/RsvpForm.jsx`: dùng chung giữa trang phúc đáp và hộp thoại; không sao chép logic validation/gửi dữ liệu.
- `src/components/gift/GiftDialog.jsx`: chỉ nhận tài khoản QR từ `gift.accounts[side]` của trang hiện tại. `public/images/qr/` lưu hai ảnh riêng do chủ tiệc cung cấp; nhãn, tên người nhận và ảnh tải về đều phải thuộc cùng bên. Không render QR của bên còn lại, không có bộ chọn bên, không dự phòng bằng tài khoản khác khi thiếu QR.
- Mở trực tiếp hoặc refresh hai đường dẫn phúc đáp phải trả đúng trang và đúng bên. Cấu hình SPA fallback chỉ cho route giao diện, không biến lỗi API thành HTML; nghiệm thu trên môi trường Cloudflare.
- `site.productionOrigin` để `null` đến khi có tên miền production thực tế; hai URL bàn giao là origin cộng `routes.groomRsvp` và `routes.brideRsvp`. Không dùng URL preview trong QR đã phát hành.
- `gift.accounts.groom` và `gift.accounts.bride` giữ các trường tài khoản/QR là `null` cho đến khi có dữ liệu thật. Bản phát hành phải có QR đúng bên nếu nút Gửi mừng cưới được bật; không dùng QR phúc đáp làm QR mừng cưới. Nút mừng cưới nằm trong thiệp; từ trang phúc đáp có thể quay về thiệp cùng bên.
- Mừng cưới chỉ hiển thị QR, không gọi API RSVP, không lưu số tiền hoặc trạng thái giao dịch vào Sheet.

## API đã triển khai

`GET /api/invitation?side=groom&slug=nguyen-van-a`: server chỉ cho phép `groom`/`bride`, ánh xạ tới tab `Nhà trai mời onl`/`Nhà gái mời onl`, đọc A:B và tìm slug chính xác, duy nhất. Không nhận tên tab hoặc range tùy ý từ client. `200` trả `{name, slug, side}` của đúng một người; `400` nếu tham số sai/dành riêng, `404` nếu không có, `409` nếu trùng slug, `503` nếu Google không phản hồi. Không trả toàn bộ danh sách khách và không biến lỗi Google thành `404`.

Thiệp cá nhân tra tên có dấu rồi điền trước lời mời và form. Hai trang phúc đáp chấp nhận tham số `khach` tùy chọn để dùng cùng tra cứu; không có tham số thì khách tự nhập tên. Tránh ghi đè tên đã được khách chỉnh sửa khi request tra tên trả về muộn. Link theo tên là cách cá nhân hóa, không phải cơ chế xác thực khách.

`POST /api/rsvp`, `Content-Type: application/json`, giới hạn body 16 KiB. Payload:

```json
{
  "name": "Tên khách",
  "attendance": "attending",
  "guestCount": 2,
  "relationship": "friend",
  "relationshipOther": "",
  "invitationSide": "groom",
  "invitationSlug": "nguyen-van-a",
  "idempotencyKey": "uuid-do-trinh-duyet-tao",
  "turnstileToken": "token-ngan-han",
  "website": ""
}
```

`attendance` nhận đúng một trong `attending`, `considering`, `declined`. `guestCount` là tổng số người, tính cả người trả lời. Với `attending` hoặc `considering`, đây phải là số nguyên an toàn từ 1 trở lên và không đặt giới hạn tối đa theo nghiệp vụ. Với `declined`, API chỉ chấp nhận/lưu 0. Giao diện cho chọn nhanh 1, 2 hoặc nhập “Mục khác”; API chỉ nhận giá trị số cuối cùng, không phụ thuộc cách nhập trên giao diện.

`relationship` nhận `family`, `friend`, `coworker`, `mutual_friend` hoặc `other`. Nếu là `other`, `relationshipOther` bắt buộc có nội dung sau khi chuẩn hóa khoảng trắng; với các lựa chọn còn lại, API bỏ trống trường này để không lưu dữ liệu cũ còn sót trong form. `website` là trường bẫy spam, ẩn với người dùng thật. Dữ liệu phải được kiểm tra lại ở Function, không chỉ ở form. API trả `201` khi ghi thành công, `400` cho dữ liệu sai, `410` kèm mã `RSVP_CLOSED` khi quá hạn, `429` nếu có giới hạn tốc độ, `500/502` nếu ghi Sheet thất bại. Giao diện không được báo thành công trước khi nhận xác nhận từ API.

`invitationSide` bắt buộc là `groom` khi gửi từ thiệp hoặc phúc đáp nhà trai, `bride` khi gửi từ thiệp hoặc phúc đáp nhà gái. Form lấy bên mời từ route, không yêu cầu khách nhập lại và không dùng lựa chọn còn lưu từ trang khác. API từ chối thiếu hoặc sai giá trị bằng `400`; không có giá trị mặc định không xác định. Đây là metadata phục vụ phân loại, không phải chứng thực danh tính khách.

`invitationSlug` là slug thiệp đã tra cứu hoặc `null` với thiệp chung/QR theo bên không chỉ định khách. Nếu có, server tra lại theo cặp `(invitationSide, invitationSlug)` trước khi ghi RSVP; lấy `invited_name` từ Sheet, không tin tên gốc do client gửi. `name` vẫn là tên thực tế khách gửi sau khi có thể chỉnh sửa. Nếu slug không tồn tại/trùng hoặc nguồn Google lỗi, không ghi nhầm RSVP. Slug cần duy nhất trong từng tab; xem [công thức và ngoại lệ](08-link-moi-ca-nhan.md).

## Nội dung chung và mốc giờ

Dùng `src/config/wedding.json` làm nguồn chung cho giao diện và Function, tránh lệch hạn RSVP giữa hai phía. Tiệc bắt đầu `2026-10-21T11:00:00+07:00`. Hạn 15/10 được hiểu là nhận hết ngày: từ `2026-10-16T00:00:00+07:00` trở đi API trả `RSVP_CLOSED`, không gọi Google Sheets. Dùng đồng hồ phía server làm căn cứ quyết định, kể cả khi đồng hồ thiết bị khách sai hoặc form đã mở từ trước hạn.

Google Maps: cấu hình có URL tìm đúng tên/địa chỉ, URL chỉ đường và iframe theo định dạng [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started), không cần API key. Đã kiểm tra iframe hiển thị ghim Trống Đồng Palace ở tọa độ Google Maps trả về; vẫn cần quét lại nút chỉ đường trên điện thoại trước ngày phát hành.

## Cột hai tab phúc đáp `Nhà trai` và `Nhà gái`

| Cột | Nội dung |
| --- | --- |
| A | `submitted_at` (ISO 8601) |
| B | `name` |
| C | `attendance` (`attending`, `considering`, `declined`) |
| D | `guest_count` (tính cả người trả lời; 0 nếu không tham gia) |
| E | `relationship` |
| F | `relationship_other` |
| G | `submission_id` |
| H | `invitation_side` (`groom` hoặc `bride`, bắt buộc) |
| I | `invitation_slug` (trống nếu khách vào thiệp/phúc đáp chung của bên) |
| J | `invited_name` (tên gốc có dấu từ tab khách mời; trống nếu không có slug) |

`submission_id` dùng để dò trường hợp gửi lại do lỗi mạng; bản đầu có thể vẫn có phản hồi trùng nếu khách cố ý gửi nhiều lần. Nếu cần sửa RSVP hoặc chống trùng tuyệt đối, phải chốt quy tắc nhận diện khách trước khi code. Sheet không được chia sẻ công khai.

## Kết nối Google an toàn

Tạo Google Cloud project, bật Sheets API, tạo service account và chia sẻ đúng một Sheet cho email service account với quyền Editor. Cloudflare Worker lấy token từ Google bằng thông tin tài khoản dịch vụ và gọi `spreadsheets.values.append` với `valueInputOption=RAW` để nội dung khách nhập không bị Google Sheets diễn giải thành công thức. Các secret gồm `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`; chỉ Worker đọc được. File `.dev.vars` dùng local và bị Git bỏ qua.

## Quy tắc bảo vệ dữ liệu

- Không để khóa, Sheet ID nhạy cảm hoặc nội dung RSVP trong `src/`, `public/`, `VITE_*`, log hoặc repository.
- Chỉ lưu trường cần thiết; không đưa IP hoặc user-agent vào Sheet theo mặc định.
- Giới hạn độ dài trường, body 16 KiB, chuẩn hóa khoảng trắng, khóa nút khi đang gửi, honeypot và Cloudflare Turnstile. Function chỉ tin kết quả Siteverify thành công, đúng action `wedding_rsvp` và đúng hostname; token do Turnstile quản lý là ngắn hạn và chỉ dùng một lần.
- Kiểm tra `Origin`/`Sec-Fetch-Site`, header dành riêng của form và chỉ nhận đúng method. Có thể thêm một WAF rate limiting rule cho đường dẫn `/api/*` trên domain production; quy tắc này bổ sung cho Turnstile.
- `submission_id` được dò trước khi append để giảm bản ghi lặp khi request được gửi lại. Đây không phải khóa giao dịch tuyệt đối của Sheets; Turnstile và việc khóa nút vẫn là lớp chính chống spam/gửi dồn.
- Không render HTML từ nội dung khách nhập; React hiển thị dạng text. Không có API đọc danh sách RSVP hoặc toàn bộ tab khách mời; API tra thiệp chỉ trả tên/bên/slug của một link được yêu cầu.
- Có lời thông báo ngắn cạnh form: dữ liệu chỉ dùng để chuẩn bị tiệc và cách liên hệ để sửa/xóa phản hồi.
