# Sửa lệch cột phúc đáp và lời chúc — 04/10/2026

## Nguyên nhân

- Sau khi thêm STT, dữ liệu bắt đầu từ thời gian gửi nhưng không có vị trí dành cho STT. `values.append` chọn cột đầu của bảng, không nhất thiết là cột đầu của range truyền vào; range `B:K` vẫn có thể ghi từ A.
- Bốn tab nhận dữ liệu có Google Tables với vùng chỉ gồm hàng tiêu đề. Kiểm thử trực tiếp xác nhận lần append tiếp theo ghi đè hàng 2.

## Sửa

- Ghi theo thứ tự đầy đủ từ A; dùng `null` ở vị trí STT để giữ nguyên công thức mảng. Tất cả nội dung người dùng vẫn ghi bằng `RAW`, không chạy thành công thức.
- Chuyển bốn Google Tables nhận dữ liệu về vùng ô thường bằng `deleteBanding`, giữ nội dung, công thức, tiêu đề cố định và màu tiêu đề. Không dùng `deleteTable` vì thao tác đó xóa cả nội dung.
- Cột A hiển thị STT; cột B hiển thị ngày giờ Việt Nam `dd/MM/yyyy HH:mm:ss`. Các tab nhận lời chúc được bổ sung đủ 1.001 hàng gồm tiêu đề.
- Khi bắt đầu kiểm tra, cả bốn tab không còn dòng khách; không có dữ liệu khách bị lệch để dịch lại. Các bản chụp kiểm tra được giữ cục bộ trong thư mục bỏ qua Git.

## Kiểm thử

- Tái hiện lỗi cũ và cách sửa trên tab tạm; đã xóa tab tạm.
- Chạy handler thật với Google Sheets: mỗi tab hai lần gửi liên tiếp, kiểm tra từng cột và STT 1, 2; gửi lại cùng mã không thêm dòng.
- Kiểm tra chuỗi bắt đầu bằng dấu `=` vẫn là văn bản.
- Đối chiếu ngày giờ hiển thị thực tế, giữ nguyên công thức STT khi dọn các dòng thử.
- `npm test`: 28/28 đạt; `npm run build`: đạt.

## Lưu ý vận hành

Giữ bốn tab nhận dữ liệu dưới dạng vùng ô thường. Nếu chuyển lại thành Google Tables, phải kiểm thử khả năng thêm liên tiếp và vùng bảng trước khi nhận khách. Không thu hẹp bảng chỉ còn hàng tiêu đề.

Tham khảo: [Google Sheets append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append), [Google Sheets tables](https://developers.google.com/workspace/sheets/api/guides/tables).
