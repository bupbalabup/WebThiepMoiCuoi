# Dữ liệu tiếng Việt và sổ lưu bút

## Phúc đáp

Hai tab `Nhà trai`, `Nhà gái` giữ cùng thứ tự cột A:J:

| Cột | Tiêu đề | Nội dung |
| --- | --- | --- |
| A | Thời gian gửi | Giờ Việt Nam, hiển thị ngày/tháng/năm giờ:phút:giây |
| B | Họ và tên | Tên khách nhập, chuẩn hóa khoảng trắng |
| C | Phúc đáp | Có tham dự / Đang cân nhắc / Không tham dự |
| D | Tổng số người | Tính cả khách, không tham dự lưu 0 |
| E | Mối quan hệ | Gia đình/người thân / Bạn bè / Đồng nghiệp / Bạn chung / Mục khác |
| F | Thông tin khác | Giải thích nếu chọn Mục khác |
| G | Mã phúc đáp | Mã kỹ thuật để tránh ghi lại cùng một lần gửi |
| H | Bên mời | Nhà trai / Nhà gái |
| I | Đường dẫn khách mời | Mã đường dẫn từ thiệp cá nhân, để trống với thiệp chung |
| J | Tên được mời | Tên gốc tra từ danh sách mời, để trống với thiệp chung |

## Lời chúc

Hai tab `Lời chúc nhà trai`, `Lời chúc nhà gái` có A:G:

`Thời gian gửi`, `Họ và tên`, `Lời chúc`, `Bên mời`, `Đường dẫn khách mời`, `Tên được mời`, `Mã lời chúc`.

Lời chúc dài tối đa 2.000 ký tự. Giữ xuống dòng của lời chúc. Không công khai danh sách lời chúc, tên hay đường dẫn Sheet qua API đọc. Khách chỉ nhận thông báo tiếng Việt sau khi gửi.

## Ngày giờ và bảo mật

- Cột A lưu kiểu ngày giờ số của Google Sheets, cộng múi giờ Việt Nam UTC+7. Định dạng hiển thị toàn cột A là `dd/MM/yyyy HH:mm:ss`; dữ liệu vẫn sắp xếp theo thời gian.
- Google API dùng `valueInputOption=RAW` để tên/lời chúc bắt đầu bằng `=` không biến thành công thức. Đây là cách nhập an toàn; người dùng vẫn thấy dữ liệu tiếng Việt được định dạng.
- Lời chúc yêu cầu Turnstile với hành động riêng `wedding_wish`, xác nhận đúng hostname, cùng nguồn gửi, giới hạn dung lượng, ô chống bot và kiểm tra đường dẫn cá nhân.
- Không cần biến môi trường mới cho lời chúc; dùng cấu hình Google và Turnstile hiện có.
- Giữ tên/thứ tự cột nhận dữ liệu. Không chèn cột vào giữa; API kiểm tra tiêu đề để tránh ghi sai vị trí.
- Không chia sẻ Sheet công khai. Chỉ chủ tiệc và tài khoản dịch vụ Google được quyền cần thiết.

## Tổng hợp và danh sách mời

`Tổng hợp số lượng` cộng hai bên, tách người xác nhận, người cân nhắc và lượt không tham gia; thêm tổng lời chúc. Dán công thức từ `google-sheets/tong-hop-so-luong.formulas.tsv`.

Hai tab mời giữ A tên, B đường dẫn tự tạo từ tên, C link thiệp tự nối đường dẫn. Cột D đang dùng Đã mời được giữ nguyên. Đổi nhãn Slug thành Đường dẫn khách mời không ảnh hưởng công thức hay link cũ.

## Ảnh và giao diện

- Dùng 18 ảnh từ `public/images/anhcuoi`, phiên bản 800px và 1600px, tổng khoảng 4,7 MB. Ảnh gốc không đưa lên Git.
- Tạo lại ảnh tối ưu bằng `scripts/optimize-wedding-photos.ps1` khi thay ảnh gốc. Script đọc hướng xoay từ ảnh.
- Thiệp có bìa mở, khung ảnh, thông tin hai gia đình, lịch cưới, địa điểm Google Maps, album, lời chúc và mừng cưới theo bên.
- Tôn trọng thiết lập giảm chuyển động của thiết bị; font được phục vụ tại website.
