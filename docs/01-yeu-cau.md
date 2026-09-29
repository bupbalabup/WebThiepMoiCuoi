# 01 — Yêu cầu và phạm vi

## Mục tiêu

Website có trang thiệp mời và trang phúc đáp riêng, đọc dễ trên màn hình nhỏ, tải nhanh trên thiết bị cũ, có tương tác mượt và cho khách gửi xác nhận tham dự. Trang hoạt động tốt với chuột, bàn phím và cảm ứng.

## Thông tin đã được chủ tiệc xác nhận

| Nội dung | Giá trị |
| --- | --- |
| Chú rể | Tuấn Anh |
| Cô dâu | Ngọc Anh |
| Bắt đầu tiệc | 11:00 ngày 21/10/2026, giờ Việt Nam (UTC+07:00) |
| Địa điểm | Trống Đồng Palace — Tòa nhà Hancorp Plaza, Trần Đăng Ninh |
| Địa chỉ tra cứu | 72 Trần Đăng Ninh, Hà Nội |
| Bản đồ | Google Maps có ghim đúng cơ sở trên trang và nút chỉ đường |
| RSVP | Tên, trạng thái tham dự, tổng số người và nguồn quen biết |
| Trạng thái | Có tham gia / đang cân nhắc / không tham gia |
| Số người | Tính cả người trả lời; chọn 1, 2 hoặc Mục khác; không giới hạn tối đa |
| Nguồn quen biết | Gia đình/người thân, bạn bè, đồng nghiệp, bạn chung hoặc Mục khác |
| Hạn xác nhận | 15/10/2026; quy ước nhận đến hết ngày theo giờ Việt Nam |
| Tông màu | Kem, hồng, đỏ rượu |
| Trang home | `/`; hai nút chọn Khách Nhà trai / Khách Nhà gái mở thiệp tương ứng |
| Trang thiệp | `/nha-trai` và `/nha-gai`; nút Tham dự mở form phúc đáp ngay trong trang |
| Trang phúc đáp | `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap`; hai link riêng để gắn vào QR theo bên mời |
| Thiệp cá nhân | `/nha-trai/:slug`, `/nha-gai/:slug`; lấy tên có dấu trong tab khách mời tương ứng và điền trước vào thiệp/form |
| Gửi mừng cưới | Có hai QR riêng; mỗi link thiệp chỉ mở QR của đúng bên mời, không cho chọn giữa hai QR |

Địa chỉ số 72 được đối chiếu với [trang chính thức của cơ sở Trần Đăng Ninh](https://trongdongpalace.com/he-thong/tran-dang-ninh/). Tên Hancorp Plaza được giữ theo thông tin chủ tiệc. Chưa có tên sảnh/tầng; không tự điền.

## Phạm vi phiên bản đầu

1. Màn hình mở đầu: tên cặp đôi, ngày cưới, lời mời, nút xem thông tin và nút xác nhận.
2. Thông tin lễ/tiệc: ngày, giờ, địa điểm, bản đồ Google Maps có ghim đúng cơ sở và nút “Chỉ đường”.
3. Nhiều khu vực ảnh cưới xuyên suốt thiệp: ảnh mở đầu, ảnh đôi cạnh lời mời, câu chuyện, dải ảnh nổi bật, album và ảnh kết. Có 18 vị trí cấu hình; cần tối thiểu 12 ảnh thật trước khi phát hành.
4. Lịch trình ngày cưới và lưu ý cho khách nếu cần.
5. RSVP có bốn câu hỏi bắt buộc theo nội dung đã chốt: tên; tham gia/đang cân nhắc/không tham gia; tổng số người tính cả người trả lời; biết cô dâu/chú rể từ đâu. Form dùng chung giữa hộp thoại trong thiệp và hai trang phúc đáp theo bên mời, cùng API và Google Sheet. Link nhà trai ghi `groom`, link nhà gái ghi `bride`; không yêu cầu khách chọn lại bên mời. Hiển thị kết quả gửi rõ ràng.
6. Chân trang: liên hệ của chủ tiệc theo lựa chọn của người dùng.
7. Nút “Gửi mừng cưới” mở hộp thoại chứa đúng một QR: link nhà trai hiện QR nhà trai, link nhà gái hiện QR nhà gái. Đây là hai ảnh QR mừng cưới riêng với QR dẫn đến trang phúc đáp đã tạo sẵn.
8. Bàn giao hai URL production `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap` sau khi kiểm thử để chủ tiệc cập nhật đích QR theo từng bên. Giữ hai đường dẫn ổn định ở những lần cập nhật sau.
9. Trang home `/` hiển thị tên hai bạn, thông tin tiệc ngắn gọn và câu hỏi “Bạn là khách của bên nào?”. Nút “Khách Nhà trai” mở `/nha-trai`; nút “Khách Nhà gái” mở `/nha-gai`. Khách mở link thiệp hoặc phúc đáp trực tiếp không phải chọn lại ở home.

## Những điều cần xác nhận trước khi điền nội dung thật

- Tên sảnh/tầng trong Hancorp Plaza nếu cần hướng dẫn khách; lịch trình ngoài thời điểm 11:00 nếu có.
- Ảnh và phong cách ảnh; logo/monogram nếu có; ảnh sử dụng đã được đồng ý chia sẻ công khai.
- Cần ít nhất 12 ảnh cưới, ưu tiên có cả ảnh dọc, ngang và vuông. Nếu cung cấp 18 ảnh trở lên có thể lấp đầy toàn bộ vị trí đã thiết kế mà không lặp ảnh.
- Có muốn thêm lời chúc hoặc chọn suất ăn ở phiên bản sau không.
- Đã chốt link cá nhân theo slug từ tab `Nhà trai mời onl` và `Nhà gái mời onl`, bố cục A: Tên, B: Slug, C: Link thiệp. Cần quyền truy cập Sheet thực tế để gắn công thức và kết nối tra tên. Quy tắc công thức, trùng tên và giữ link nằm trong [tài liệu thiệp cá nhân](08-link-moi-ca-nhan.md).
- Ảnh QR mừng cưới nhà trai và nhà gái cùng thông tin người nhận tương ứng. Đã chốt hai QR nhưng mỗi link chỉ hiển thị một QR, không cần hỏi lại lựa chọn này.
- Có muốn công khai số điện thoại, danh sách lời chúc hoặc chỉ giữ ở Sheet riêng tư không.
- Tên repository GitHub, tài khoản GitHub/Cloudflare, tên miền riêng (nếu có).

## Giả định tạm thời để lập kế hoạch

- Trang tiếng Việt, một sự kiện, không đăng nhập.
- Sheet chỉ lưu RSVP; không hiển thị danh sách người tham dự ra công khai.
- RSVP đã chốt theo bốn câu hỏi. Tổng số người tính cả người trả lời; “Mục khác” nhận số nguyên từ 1 trở lên và không đặt giới hạn tối đa. Nếu chọn không tham gia, form ẩn câu số người và API lưu 0.
- Sau 00:00 ngày 16/10/2026 theo giờ Việt Nam, đóng form và từ chối ghi mới ở API; thông tin thiệp và bản đồ vẫn xem được. Đây là cách triển khai mặc định cho hạn 15/10/2026.
- Tông màu đã chốt: kem, hồng, đỏ rượu. Sắc độ cụ thể sẽ được chọn theo ảnh thật.
- Không tự phát nhạc. Nếu có nhạc, khách chủ động bật và trang tôn trọng chế độ giảm chuyển động.

## Ngoài phạm vi phiên bản đầu

Trang quản trị, đối soát giao dịch mừng cưới tự động, gửi email/SMS tự động, quản lý danh sách khách với đăng nhập. Hiển thị QR mừng cưới đã nằm trong phiên bản đầu; website không xác nhận đã nhận tiền.
