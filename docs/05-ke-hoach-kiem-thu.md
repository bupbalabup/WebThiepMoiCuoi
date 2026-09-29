# 05 — Kế hoạch kiểm thử

## Kiểm thử tự động khi có mã

- Thiệp cá nhân: cùng slug ở hai tab trả đúng tên/bên; slug trùng trong một tab phải lỗi, không lấy dòng đầu; Google lỗi trả trạng thái tạm lỗi. Route phúc đáp không bị nhận nhầm là slug. RSVP có slug phải tra đúng bên trước khi ghi, tên chỉnh sửa vẫn lưu riêng với tên gốc.
- `npm run build`: phát hiện lỗi build và tệp còn thiếu.
- Kiểm thử tên trống/quá dài và chuẩn hóa khoảng trắng. Kiểm thử đủ ba trạng thái `attending`, `considering`, `declined`; từ chối giá trị cũ `yes/no` và giá trị ngoài danh sách.
- Với tham gia/đang cân nhắc: chấp nhận tổng số 1, 2, 6, 10, 100; từ chối 0, số âm, số lẻ và sai kiểu. Với không tham gia: lưu 0 và không chấp nhận số dương. Không đặt trần theo nghiệp vụ.
- Kiểm thử đủ nguồn quen biết: gia đình/người thân, bạn bè, đồng nghiệp, bạn chung, Mục khác. Mục khác thiếu/chỉ có khoảng trắng phải lỗi; chọn phương án thường phải loại bỏ nội dung Mục khác cũ.
- Kiểm thử thời hạn với đồng hồ giả lập: chấp nhận lúc `2026-10-15T23:59:59.999+07:00`; trả `410 RSVP_CLOSED` từ `2026-10-16T00:00:00+07:00` và không gọi API Google. Thử form mở trước hạn nhưng gửi sau hạn, và đồng hồ máy khách sai.
- Kiểm thử Function bằng Google Sheets API giả lập: phản hồi `201` chỉ khi Google xác nhận ghi; xử lý token hết hạn, `429`, `5xx` và mạng gián đoạn.
- Kiểm thử form: gửi thành công, đang gửi, lỗi mạng, chống bấm nhiều lần, giữ dữ liệu đã nhập khi lỗi.
- Chạy cùng các ca gửi và đóng hạn trên `/nha-trai/phuc-dap`, `/nha-gai/phuc-dap`, `/nha-trai`, `/nha-gai`; mọi form gọi cùng endpoint, ghi cùng cấu trúc Sheet. Link nhà trai luôn ghi `invitation_side=groom`, link nhà gái luôn ghi `bride`. API từ chối thiếu/sai `invitationSide`; không ghi phản hồi không xác định bên. Mở/đóng hộp thoại QR không gọi API RSVP.
- Kiểm thử ánh xạ bên mời → tài khoản QR: đúng ảnh, nhãn và link tải; không hiển thị QR bên kia. Thiếu QR một bên phải báo chưa có QR, không thay bằng QR bên còn lại.

## Kiểm thử thủ công trên trình duyệt

| Nhóm | Ca kiểm tra |
| --- | --- |
| Màn hình | Kiểm tra 320, 360, 375, 390, 414, 480, 568×320 ngang, 667×375 ngang, 768, 820, 1024, 1280, 1440, 1920px; thêm kéo resize liên tục; không cuộn ngang, chữ/nút/ảnh không bị cắt |
| Thiết bị | Android Chrome tầm thấp, iPhone Safari đời còn được hỗ trợ, Chrome/Edge desktop |
| Tương tác | Chạm, chuột, Tab/Shift+Tab, Enter, focus, nút mở chỉ đường Google Maps |
| Điều hướng | Vào trực tiếp/refresh năm route tĩnh và hai mẫu route cá nhân; home chọn đúng thiệp; route lạ không tự chọn bên; phúc đáp không bị nhận nhầm thành slug |
| Phúc đáp theo bên | QR nhà trai đến `/nha-trai/phuc-dap`, QR nhà gái đến `/nha-gai/phuc-dap`; đúng nhãn trang và link quay về thiệp; mở hai tab hoặc chuyển bên không lẫn `invitationSide` khi gửi |
| Thiệp cá nhân | Mở/refresh cả hai route `:slug`, hiển thị tên có dấu và prefill form; tên dài xuống dòng; `?khach=` giữ tên khi chuyển sang trang phúc đáp; tra cứu trả muộn không đè tên đang sửa |
| Công thức Sheet | Thêm/sửa tên ở A tự sinh B/C; dấu đ, Unicode tổ hợp, tên trùng, slug dành riêng, thiếu domain; D giữ link khi sửa tên; không làm hỏng ô công thức gốc |
| Chọn bên tại home | Chọn Nhà trai rồi quay lại home chọn Nhà gái và ngược lại; đúng thiệp/QR từng lượt; home không tự chuyển theo lần chọn trước; dùng được bằng cảm ứng và bàn phím |
| Hộp thoại phúc đáp | Bấm Tham dự mở form tại chỗ, URL không đổi; đổi được cả ba trạng thái; đóng/mở lại giữ nội dung và trạng thái thành công; không tự gửi lại |
| Hộp thoại mừng cưới | Mỗi link hiện duy nhất một QR đúng bên; mở hai tab nhà trai/nhà gái và chuyển qua lại không lẫn ảnh; tải đúng ảnh; quét bằng thiết bị thứ hai để đối chiếu người nhận; không thực hiện chuyển tiền khi test |
| Hộp thoại trên điện thoại | Bàn phím không che nút gửi; cuộn trong hộp thoại; đóng dễ; Escape/focus hoạt động; không mở chồng hai hộp thoại |
| Bản đồ | Có ghim tại Trống Đồng Palace Hancorp Plaza, 72 Trần Đăng Ninh; URL chỉ đường đúng cơ sở trên điện thoại/PC; iframe bị chặn vẫn xem được địa chỉ và nút chỉ đường |
| RSVP | Kiểm tra bốn câu hỏi bắt buộc; 1/2/Mục khác; tổng số tính cả khách; Mục khác ở nguồn quen biết; ba trạng thái tham dự; nhập dấu tiếng Việt, mất mạng, gửi lại, đóng form đúng hạn |
| Trợ năng | Tắt ảnh, tăng zoom 200%, reduced motion, nhãn form và thông báo đọc màn hình |
| Hiệu năng | Lighthouse production mobile/desktop, tải với mạng chậm, ảnh và font không chặn nội dung |
| Mật độ bố cục | Không có khung ảnh, cột, section hoặc spacer rỗng; thử lần lượt 12, 13, 17 và 18 ảnh; hàng cuối của album vẫn cân đối ở mọi breakpoint |
| Màu và ưu tiên | Ngày giờ, địa điểm, hạn RSVP và CTA chính dễ nhận ra trong 5 giây; nút phụ không tranh màu với nút chính; chữ đạt độ tương phản WCAG AA |
| Ảnh cưới | Tối thiểu 12 ảnh thật, không lặp ngoài chủ ý; mặt người không bị cắt ở các tỷ lệ; lightbox, tải trễ và ảnh responsive hoạt động; không nhảy bố cục khi ảnh tải |
| Riêng tư | DevTools không thấy Google key; Sheet không public; không có endpoint đọc RSVP |

## Trên bản preview và production

1. Dùng Sheet **thử nghiệm** ở preview, không ghi dữ liệu test vào Sheet thật.
2. Gửi ít nhất một RSVP hợp lệ, xác nhận cột và dấu thời gian đúng; thử input bắt đầu bằng `=`, `+`, `-`, `@` để đảm bảo Sheet giữ dạng text.
3. Thử secret thiếu/sai: trang vẫn hiện, form báo lỗi hữu ích, không lộ chi tiết khóa.
4. Sau khi gắn Sheet production và còn trước hạn 15/10, gửi một phản hồi kiểm thử có nhãn rõ và xóa hàng kiểm thử sau khi xác nhận. Nếu triển khai sau hạn, kiểm tra trạng thái đóng đúng; chỉ thử luồng ghi trong môi trường test với đồng hồ giả lập, không đổi hạn production.
5. Kiểm tra liên kết GitHub → Cloudflare: commit lên `main` tạo deploy; nhánh/PR tạo preview; rollback được một deploy trước nếu cần.
6. Bàn giao URL production `/nha-trai/phuc-dap` và `/nha-gai/phuc-dap`; sau khi chủ tiệc gắn đúng đích QR cho từng bên, quét từng QR thật và gửi thử để kiểm tra bên được lưu trong Sheet. Không phát hành link preview làm đích QR.
7. Sau mỗi lần deploy, route tĩnh và link thiệp cá nhân đã gửi vẫn hoạt động; khi hết hạn, form ở mọi trang/hộp thoại đóng nhưng home/thiệp/bản đồ/QR mừng cưới theo từng bên vẫn xem được.

## Tiêu chí chấp nhận

- Không có lỗi nghiêm trọng trong console; không có trang trắng.
- RSVP ghi đúng mười cột và chỉ báo thành công khi lưu xong; lưu slug/tên được mời khi có, tổng số tính cả khách, không giới hạn tối đa; API thực thi hạn hết ngày 15/10/2026 theo giờ Việt Nam.
- Hiện đúng Tuấn Anh & Ngọc Anh, 11:00 ngày 21/10/2026; Google Maps có ghim và chỉ đường đúng địa điểm.
- Trang phúc đáp mở độc lập từ QR; hai thiệp mở form tại chỗ; nút Gửi mừng cưới hiển thị đúng một QR của bên mời và quét được.
- Không rò khóa hoặc dữ liệu người tham gia qua mạng, source map hay giao diện.
- Nội dung đọc được và nút bấm được trên điện thoại cũ; animation có phương án giảm/tắt.
- Bố cục đầy đặn và cân đối trên toàn dải 320–1920px; không có khu vực trống do thiếu dữ liệu hay sai lưới. Có tối thiểu 12 ảnh thật và tối đa 18 slot được dùng linh hoạt.
- Điểm Lighthouse mobile Performance và Accessibility mục tiêu từ 90; nếu thiết bị thực tế chậm hơn, ưu tiên sửa trải nghiệm thực tế.
